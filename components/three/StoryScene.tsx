"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import BeybladeModel, { type PartId } from "./BeybladeModel";
import StudioLights from "./StudioLights";
import ProjectedLabels, { type ResolvedAnchor } from "./ProjectedLabels";
import type { BeyVisual } from "@/lib/types";
import { STORY } from "@/lib/story";

function Rig({
  visual,
  progress,
  reduced,
  onAnchor,
}: {
  visual: BeyVisual;
  progress: MotionValue<number>;
  reduced: boolean;
  onAnchor: (part: PartId, o: THREE.Object3D | null) => void;
}) {
  const tiltGroup = useRef<THREE.Group>(null);
  const explodeRef = useRef(0);
  const spinRef = useRef(0.9);

  useFrame(({ pointer, size }, delta) => {
    const p = progress.get();
    // Fit the model to portrait screens (phones) as well as wide desktops
    const fit = Math.min(1, Math.max(0.52, size.width / size.height / 1.15));
    const g = tiltGroup.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    explodeRef.current = STORY.explode(p);
    spinRef.current = STORY.spin(p, reduced);
    // Tilt towards the viewer (negative X rotation keeps the Blade at the top of the screen)
    const targetTilt = -STORY.tilt(p) + (reduced ? 0 : -pointer.y * 0.06);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetTilt, 8, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, reduced ? 0 : pointer.x * 0.06, 4, dt);
    const s = STORY.scale(p) * fit;
    g.scale.setScalar(s);
    g.position.z = STORY.shift(p) - STORY.lift(p);
  });

  return (
    <group ref={tiltGroup}>
      <group position={[0, -0.35, 0]}>
        <BeybladeModel visual={visual} explodeRef={explodeRef} spinRef={spinRef} onAnchor={onAnchor} />
      </group>
    </group>
  );
}

export default function StoryScene({
  active,
  visual,
  progress,
  reduced,
  resolveLabels,
  onAnchor,
}: {
  active: boolean;
  visual: BeyVisual;
  progress: MotionValue<number>;
  reduced: boolean;
  resolveLabels: () => ResolvedAnchor[];
  onAnchor: (part: PartId, o: THREE.Object3D | null) => void;
}) {
  return (
    <Canvas
      resize={{ offsetSize: true }}
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 9, 0.01], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      aria-label="3D Sword Dran Beyblade that rotates and comes apart as you scroll"
      role="img"
    >
      <Suspense fallback={null}>
        <StudioLights intensity={0.9} />
        <directionalLight position={[-3, 6, 4]} intensity={1.2} color="#ffffff" />
        <Rig visual={visual} progress={progress} reduced={reduced} onAnchor={onAnchor} />
        <ContactShadows position={[0, -0.4, 0]} opacity={0.55} scale={7} blur={2.8} far={3} resolution={512} />
        <ProjectedLabels resolve={resolveLabels} />
      </Suspense>
    </Canvas>
  );
}
