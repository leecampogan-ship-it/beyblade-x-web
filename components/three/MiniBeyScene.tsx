"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import BeybladeModel from "./BeybladeModel";
import StudioLights from "./StudioLights";
import type { BeyVisual } from "@/lib/types";

/** Small, lightweight spinning Beyblade used for type showcases and product detail views. */
export default function MiniBeyScene({
  active,
  visual,
  reduced,
  glowColor,
}: {
  active: boolean;
  visual: BeyVisual;
  reduced: boolean;
  glowColor?: string;
}) {
  return (
    <Canvas
      resize={{ offsetSize: true }}
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 3.6, 4.6], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <StudioLights />
        {glowColor && <pointLight position={[0, -0.4, 1.5]} intensity={10} color={glowColor} distance={6} />}
        <Float speed={reduced ? 0 : 2.4} rotationIntensity={0.25} floatIntensity={0.5}>
          <group scale={1.05} position={[0, -0.7, 0]} rotation={[0.25, 0, 0.05]}>
            <BeybladeModel visual={visual} spin={reduced ? 0.3 : 7} castShadow={false} lowDetail />
          </group>
        </Float>
        <ContactShadows position={[0, -1.05, 0]} opacity={0.5} scale={5} blur={2.2} far={3} resolution={256} />
      </Suspense>
    </Canvas>
  );
}
