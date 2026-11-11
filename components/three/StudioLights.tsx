"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Fully procedural studio lighting — no HDR downloads. Lightformers create crisp
 * reflections on the metallic blade.
 */
export default function StudioLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.25 * intensity} />
      <directionalLight position={[4, 8, 5]} intensity={1.6 * intensity} castShadow={false} />
      <pointLight position={[-5, 2, -3]} intensity={18 * intensity} color="#c6f31a" distance={20} />
      <pointLight position={[5, 1, -2]} intensity={14 * intensity} color="#e4ff8a" distance={20} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -6]} scale={[12, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.5} position={[-6, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#eef7d6" />
        <Lightformer form="rect" intensity={2} position={[6, 1, 0]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#c6f31a" />
        <Lightformer form="ring" intensity={2} position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={4} color="#ffffff" />
        <Lightformer form="rect" intensity={1} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} color="#202634" />
      </Environment>
    </>
  );
}
