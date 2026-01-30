"use client";

import Scene from "./components/Scene";
import InfoPanel from "./components/InfoPanel";
import { useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [panelPos, setPanelPos] = useState(null);
  const [orbiting, setOrbiting] = useState(false);

  return (
    <div className="container">
      <InfoPanel model={selected} panelPos={panelPos} setSelected={setSelected} orbiting={orbiting} setOrbiting={setOrbiting} />
      <Scene selected={selected} setSelected={setSelected} setPanelPos={setPanelPos} orbiting={orbiting} setOrbiting={setOrbiting} />
    </div>
  );
}
