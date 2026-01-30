"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import MachineModel from "./MachineModel";
import CameraRig from "./CameraRig";

const machines = [
  {
    id: 1,
    name: "Machine A",
    model: "/models/machine1.glb",
    position: [-6, 0.9, 0],
    scale: 0.009,
  },
  {
    id: 2,
    name: "Machine B",
    model: "/models/machine2.glb",
    position: [0, -1.3, 0],
    scale: 50,
  },
  {
    id: 3,
    name: "Machine C",
    model: "/models/machine3.glb",
    position: [8, -1.3, 0],
    scale: 2.5,
  },
];

function Table() {
  const { scene } = useGLTF("/models/old_wooden_table.glb");
  return <primitive object={scene} position={[0, -10, 0]} scale={10} />;
}

export default function Scene({ selected, setSelected }) {
  const controlsRef = useRef();

  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 60 }} shadows>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />

      <Environment files="/hdr/factory.hdr" background intensity={1} />

      <Table />

      <CameraRig selected={selected} controls={controlsRef} />

      {machines.map((machine) => {
        if (selected && selected.id !== machine.id) return null;

        return (
          <MachineModel
            key={machine.id}
            data={machine}
            isSelected={selected?.id === machine.id}
            onSelect={setSelected}
          />
        );
      })}

      <OrbitControls
        ref={controlsRef}
        target={[0, 2, 0]}
        minPolarAngle={THREE.MathUtils.degToRad(10)}
        maxPolarAngle={THREE.MathUtils.degToRad(90)}
        minDistance={3}
        maxDistance={13}
      />
    </Canvas>
  );
}
