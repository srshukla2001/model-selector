// app/components/CameraRig.js
"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function CameraRig({ selected, controls, orbiting }) {
  const { camera } = useThree();

  const target = useRef(new THREE.Vector3(0, 1, 0));
  const desiredPos = useRef(new THREE.Vector3(0, 2, 8));
  const initialCam = useRef(new THREE.Vector3(0, 2, 8));
  const angle = useRef(0);

  useFrame((state, delta) => {
    if (!controls.current) return;

    // determine the target position (center of focus)
    const dest = selected ? new THREE.Vector3(...selected.position) : new THREE.Vector3(0, 1, 0);
    target.current.lerp(dest, 0.08);

    controls.current.target.copy(target.current);

    // softly nudge the camera a bit closer when a model is selected to give a subtle zoom/focus
    const camDest = selected
      ? dest.clone().add(new THREE.Vector3(0, 1.6, 3))
      : initialCam.current;

    desiredPos.current.lerp(camDest, 0.06);
    // camera.position.lerp(desiredPos.current, 0.06);

    // orbiting behavior: rotate camera around the target
    if (orbiting && selected) {
      angle.current += delta * 0.6; // speed
      const radius = camera.position.distanceTo(controls.current.target);
      const x = controls.current.target.x + Math.cos(angle.current) * radius;
      const z = controls.current.target.z + Math.sin(angle.current) * radius;
      const y = camera.position.y; // keep current height
      camera.position.lerp(new THREE.Vector3(x, y, z), 0.05);
      camera.lookAt(controls.current.target);
    }

    // keep controls in sync
    if (typeof controls.current.update === "function") controls.current.update();
  });

  return null;
}
