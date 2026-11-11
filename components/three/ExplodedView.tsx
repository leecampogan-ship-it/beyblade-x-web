"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type * as THREE from "three";
import BeybladeModel, { type PartId } from "./BeybladeModel";
import StudioLights from "./StudioLights";
import ProjectedLabels from "./ProjectedLabels";
import type { BeyVisual } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExplodedViewProps {
  active: boolean;
  visual: BeyVisual;
  exploded: boolean;
  selected: PartId | null;
  onSelect: (part: PartId | null) => void;
}

const LABELS: { id: PartId; text: string; offsetX: number }[] = [
  { id: "blade", text: "BLADE", offsetX: 150 },
  { id: "ratchet", text: "RATCHET", offsetX: -120 },
  { id: "bit", text: "BIT", offsetX: 90 },
];

export default function ExplodedView({ active, visual, exploded, selected, onSelect }: ExplodedViewProps) {
  const [hovered, setHovered] = useState<PartId | null>(null);
  const anchors = useRef<Partial<Record<PartId, THREE.Object3D | null>>>({});
  const labels = useRef<Partial<Record<PartId, HTMLButtonElement | null>>>({});
  const resolve = () =>
    LABELS.map((l) => ({ el: labels.current[l.id], object: anchors.current[l.id], offsetX: l.offsetX }));

  return (
    <div className="relative h-full w-full">
      <Canvas
        resize={{ offsetSize: true }}
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 8.2, 7.4], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => onSelect(null)}
        aria-label="Interactive exploded view of a Beyblade X. Drag to rotate, click a part to learn about it."
        role="img"
      >
        <Suspense fallback={null}>
          <StudioLights />
          <group scale={1.1} position={[0, -0.55, 0]}>
            <BeybladeModel
              visual={visual}
              explode={exploded ? 1 : 0}
              selected={selected}
              hovered={hovered}
              onSelectPart={(p) => onSelect(p)}
              onHoverPart={setHovered}
              onAnchor={(part, o) => {
                anchors.current[part] = o;
              }}
            />
          </group>
          <ContactShadows position={[0, -1.7, 0]} opacity={0.55} scale={8} blur={2.6} far={4} resolution={512} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            minPolarAngle={Math.PI * 0.12}
            maxPolarAngle={Math.PI * 0.42}
            target={[0, 0.75, 0]}
          />
          <ProjectedLabels resolve={resolve} />
        </Suspense>
      </Canvas>

      {/* Floating labels (positioned every frame by ProjectedLabels) */}
      {LABELS.map((l) => (
        <button
          key={l.id}
          ref={(el) => {
            labels.current[l.id] = el;
          }}
          type="button"
          tabIndex={exploded ? 0 : -1}
          aria-hidden={!exploded}
          onClick={() => onSelect(l.id)}
          style={{ visibility: "hidden" }}
          className={cn(
            "label absolute left-0 top-0 whitespace-nowrap rounded-full border px-3 py-1.5 transition-[opacity,background-color,border-color] duration-300",
            exploded ? "opacity-100" : "pointer-events-none opacity-0",
            selected === l.id
              ? "border-accent bg-accent text-ink"
              : "glass border-cream/25 text-cream hover:border-accent",
          )}
        >
          {l.text}
        </button>
      ))}
    </div>
  );
}
