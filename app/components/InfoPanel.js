"use client";

import { useMemo, useState, useEffect } from "react";

export default function InfoPanel({ model, panelPos, setSelected, orbiting, setOrbiting }) {
  const PANEL_W = 300;
  const PANEL_LEFT = 36;

  const anchor = useMemo(() => {
    const x = PANEL_LEFT + PANEL_W;
    const y = typeof window !== "undefined" ? window.innerHeight / 2 : 320;
    return { x, y };
  }, []);

  const [expanded, setExpanded] = useState(false);
  const temp = model?.temperature ?? null;

  useEffect(() => {
    setExpanded(false);
  }, [model]);

  /* ---------------- graph data (mock, replace later) ---------------- */
  const graphData = useMemo(() => {
    if (!model) return [];
    // fake 20-point activity curve
    return Array.from({ length: 20 }, () => 40 + Math.random() * 60);
  }, [model]);

  const graphPath = useMemo(() => {
    if (!graphData.length) return "";
    const w = 260;
    const h = 40;
    const max = Math.max(...graphData);
    const min = Math.min(...graphData);

    return graphData
      .map((v, i) => {
        const x = (i / (graphData.length - 1)) * w;
        const y = h - ((v - min) / (max - min)) * h;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [graphData]);

  const thermometer = temp !== null ? (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width={36} height={140} viewBox="0 0 36 140">
        <defs>
          <linearGradient id="thermGrad" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="#4caf50" />
            <stop offset="50%" stopColor="#ffeb3b" />
            <stop offset="100%" stopColor="#f44336" />
          </linearGradient>
        </defs>

        <rect
          x={10}
          y={10}
          width={16}
          height={100}
          rx={8}
          ry={8}
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.12)"
        />

        {(() => {
          const min = 0;
          const max = 120;
          const clamped = Math.max(min, Math.min(max, temp));
          const pct = (clamped - min) / (max - min);
          const fillH = Math.max(4, Math.floor(100 * pct));
          const y = 10 + (100 - fillH);
          return (
            <g>
              <rect x={10} y={y} width={16} height={fillH} rx={8} ry={8} fill="url(#thermGrad)" />
              <circle cx={18} cy={122} r={12} fill="url(#thermGrad)" stroke="rgba(255,255,255,0.12)" />
            </g>
          );
        })()}
      </svg>

      <div style={{ color: "#fff", lineHeight: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{temp}°C</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>Temperature</div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <svg
        className="overlay-connector"
        width="100%"
        height="100%"
        viewBox={`0 0 ${typeof window !== "undefined" ? window.innerWidth : 800} ${typeof window !== "undefined" ? window.innerHeight : 600}`}
        preserveAspectRatio="none"
        style={{ position: "fixed", left: 0, top: 0, pointerEvents: "none" }}
      >
        {panelPos && (
          <line
            x1={panelPos.x}
            y1={panelPos.y}
            x2={anchor.x}
            y2={200}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>

      <div
        className="info-panel overlay"
        style={{
          position: "fixed",
          left: PANEL_LEFT,
          top: "30%",
          transform: "translateY(-50%)",
          width: PANEL_W,
          background: "rgba(10,10,10,0.68)",
          color: "#fff",
          padding: 18,
          borderRadius: 12,
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.04)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{model?.name ?? ""}</div>
            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
              {model
                ? expanded
                  ? model.description
                  : model.description?.slice(0, 120) + "..."
                : "Select the Machines for info"}
            </div>

            {/* ----------------- GRAPH UI (conditional by machine id) ----------------- */}
            {model && (
              <div style={{ marginTop: 10 }}>
                {model.id === 1 && (
                  <>
                    <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
                      Activity (last 20s)
                    </div>
                    <svg width="260" height="40" viewBox="0 0 260 40">
                      <path
                        d={graphPath}
                        fill="none"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </>
                )}

                {model.id === 2 && (
                  <>
                    <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 6 }}>
                      Recent Activity (bar)
                    </div>
                    <svg width="260" height="40" viewBox="0 0 260 40">
                      {(() => {
                        if (!graphData.length) return null;
                        const w = 260;
                        const h = 40;
                        const pad = 2;
                        const barW = (w - pad * (graphData.length - 1)) / graphData.length;
                        const max = Math.max(...graphData);
                        const min = Math.min(...graphData);
                        return graphData.map((v, i) => {
                          const norm = max === min ? 0.5 : (v - min) / (max - min);
                          const barH = Math.max(2, Math.floor(norm * h));
                          const x = i * (barW + pad);
                          const y = h - barH;
                          return (
                            <rect key={i} x={x} y={y} width={barW} height={barH} rx={2} ry={2} fill="rgba(255,255,255,0.9)" />
                          );
                        });
                      })()}
                    </svg>
                  </>
                )}

                {model.id === 3 && (
                  <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>
                    {/* No activity graph for this machine */}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Status</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 6 }}>
              {model ? "Active" : ""}
            </div>
          </div>
        </div>

        <div style={{ height: 12 }} />
        {thermometer}

        <div style={{ display: model ? "flex" : "none", gap: 8, marginTop: 14 }}>
          <button
            onClick={() => setSelected(null)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            &lt;
          </button>

          <button
            onClick={() => setOrbiting(!orbiting)}
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 8,
              background: orbiting ? "rgba(255,255,255,0.12)" : "transparent",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.04)",
              cursor: "pointer",
            }}
          >
            {orbiting ? "Stop Orbit" : "Orbit"}
          </button>
        </div>
      </div>
    </>
  );
}
