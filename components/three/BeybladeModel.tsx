"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { BeyVisual, BladeStyle } from "@/lib/types";
import { bladeRadius } from "@/lib/bladeShape";

export type PartId = "blade" | "ratchet" | "bit";

interface BeybladeModelProps {
  visual: BeyVisual;
  /** Target explode amount 0 (assembled) → 1 (fully exploded). Animated smoothly. */
  explode?: number;
  /** Optional per-frame explode amount (0-1), applied directly without smoothing (e.g. scroll-driven). */
  explodeRef?: RefObject<number>;
  /** Optional per-frame burst scatter amount (0-1) — parts fly apart radially. */
  scatterRef?: RefObject<number>;
  /** Spin speed in radians / second (positive = right spin / clockwise from above). */
  spin?: number;
  /** Optional per-frame spin speed override. */
  spinRef?: RefObject<number>;
  selected?: PartId | null;
  hovered?: PartId | null;
  onSelectPart?: (part: PartId) => void;
  onHoverPart?: (part: PartId | null) => void;
  /** Receives invisible anchor objects at the centre of each part (used for projected DOM labels). */
  onAnchor?: (part: PartId, object: THREE.Object3D | null) => void;
  castShadow?: boolean;
  /** Lower geometry detail for small / many instances. */
  lowDetail?: boolean;
}

/* ---------- Geometry helpers ---------- */

function makeBladeShape(style: BladeStyle, points: number, scale: number, holeRadius: number, segments: number) {
  const shape = new THREE.Shape();
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const r = bladeRadius(style, points, theta) * scale;
    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  if (holeRadius > 0) {
    const hole = new THREE.Path();
    hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  return shape;
}

function useBladeGeometries(style: BladeStyle, points: number, lowDetail: boolean) {
  return useMemo(() => {
    const segments = lowDetail ? 96 : 220;
    const metal = new THREE.ExtrudeGeometry(makeBladeShape(style, points, 1, 0.42, segments), {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.02,
      bevelSegments: lowDetail ? 1 : 3,
      curveSegments: lowDetail ? 16 : 32,
    });
    metal.rotateX(-Math.PI / 2);
    const cover = new THREE.ExtrudeGeometry(makeBladeShape(style, points, 0.8, 0, segments), {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      bevelSegments: lowDetail ? 1 : 3,
      curveSegments: lowDetail ? 16 : 32,
    });
    cover.rotateX(-Math.PI / 2);
    return { metal, cover };
  }, [style, points, lowDetail]);
}

/* ---------- Constants (model units; total height ≈ 1.2) ---------- */

const BIT_HEIGHT = 0.42;
const HIGH_BIT_HEIGHT = 0.52;
const BLADE_HEIGHT = 0.32;

/* ---------- Component ---------- */

export default function BeybladeModel({
  visual,
  explode = 0,
  explodeRef,
  scatterRef,
  spin = 0,
  spinRef,
  selected = null,
  hovered = null,
  onSelectPart,
  onHoverPart,
  onAnchor,
  castShadow = true,
  lowDetail = false,
}: BeybladeModelProps) {
  const spinGroup = useRef<THREE.Group>(null);
  const bladeRef = useRef<THREE.Group>(null);
  const ratchetRef = useRef<THREE.Group>(null);
  const bitRef = useRef<THREE.Group>(null);
  const explodeCurrent = useRef(explode);

  const { metal, cover } = useBladeGeometries(visual.bladeStyle, visual.contactPoints, lowDetail);
  const bitH = visual.bit === "highneedle" ? HIGH_BIT_HEIGHT : BIT_HEIGHT;
  const ratchetH = visual.ratchetHeight * 0.035;

  // Base (assembled) Y positions of each part group
  const baseY = useMemo(
    () => ({ bit: 0, ratchet: bitH, blade: bitH + ratchetH }),
    [bitH, ratchetH],
  );

  const interactive = !!onSelectPart;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    explodeCurrent.current =
      explodeRef?.current ?? THREE.MathUtils.damp(explodeCurrent.current, explode, 5, dt);
    const e = explodeCurrent.current;
    const s = scatterRef?.current ?? 0;

    // Burst scatter: each part follows an arc and lands on the floor beside the others.
    const arc = Math.sin(Math.PI * s);
    if (bitRef.current) {
      bitRef.current.position.set(-s * 1.4, baseY.bit - e * 1.0 + arc * 0.6 + s * 0.3, s * 0.6);
      bitRef.current.rotation.set(0, 0, s * Math.PI * 0.5);
    }
    if (ratchetRef.current) {
      ratchetRef.current.position.set(s * 1.3, baseY.ratchet * (1 - s) + e * 0.05 + arc * 0.9 + s * 0.4, s * 1.1);
      ratchetRef.current.rotation.set(s * Math.PI * 0.5, 0, 0);
    }
    if (bladeRef.current) {
      bladeRef.current.position.set(s * 0.3, baseY.blade * (1 - s) + e * 1.7 + arc * 1.3 + s * 0.35, -s * 1.4);
      bladeRef.current.rotation.set(s * Math.PI, 0, 0);
    }
    const speed = spinRef?.current ?? spin;
    if (spinGroup.current && speed !== 0) {
      spinGroup.current.rotation.y -= speed * dt;
    }
  });

  const handlers = (part: PartId) =>
    interactive
      ? {
          onClick: (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onSelectPart?.(part);
          },
          onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHoverPart?.(part);
            document.body.style.cursor = "pointer";
          },
          onPointerOut: () => {
            onHoverPart?.(null);
            document.body.style.cursor = "";
          },
        }
      : {};

  const glow = (part: PartId) => {
    if (selected === part) return { emissive: new THREE.Color("#c6f31a"), emissiveIntensity: 0.55 };
    if (hovered === part) return { emissive: new THREE.Color("#c6f31a"), emissiveIntensity: 0.3 };
    return { emissive: new THREE.Color("#000000"), emissiveIntensity: 0 };
  };

  const radialSegs = lowDetail ? 24 : 48;

  return (
    <group ref={spinGroup}>
      {/* ---------------- BIT ---------------- */}
      <group ref={bitRef} {...handlers("bit")}>
        <BitMesh visual={visual} height={bitH} glow={glow("bit")} radialSegs={radialSegs} castShadow={castShadow} />
        <object3D ref={(o) => onAnchor?.("bit", o)} position={[0, bitH * 0.45, 0]} />
      </group>

      {/* ---------------- RATCHET ---------------- */}
      <group ref={ratchetRef} {...handlers("ratchet")}>
        <mesh position={[0, ratchetH / 2, 0]} castShadow={castShadow}>
          <cylinderGeometry args={[0.4, 0.42, ratchetH, radialSegs]} />
          <meshStandardMaterial color="#2b2f36" metalness={0.2} roughness={0.45} {...glow("ratchet")} />
        </mesh>
        {/* Protrusions — the first number in the ratchet name */}
        {Array.from({ length: visual.ratchetProtrusions }).map((_, i) => {
          const a = (i / visual.ratchetProtrusions) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.46, ratchetH * 0.55, Math.sin(a) * 0.46]}
              rotation={[0, -a, 0]}
              castShadow={castShadow}
            >
              <boxGeometry args={[0.16, ratchetH * 0.7, 0.12]} />
              <meshStandardMaterial color="#3d434d" metalness={0.3} roughness={0.4} {...glow("ratchet")} />
            </mesh>
          );
        })}
        {/* Locking teeth ring */}
        <mesh position={[0, ratchetH, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.025, 8, radialSegs]} />
          <meshStandardMaterial color={visual.accent} metalness={0.4} roughness={0.3} {...glow("ratchet")} />
        </mesh>
        <object3D ref={(o) => onAnchor?.("ratchet", o)} position={[0, ratchetH * 0.5, 0]} />
      </group>

      {/* ---------------- BLADE ---------------- */}
      <group ref={bladeRef} {...handlers("blade")}>
        {visual.image ? (
          <PhotoBlade
            url={visual.image}
            glow={glow("blade")}
            radialSegs={radialSegs}
            castShadow={castShadow}
            lowDetail={lowDetail}
          />
        ) : (
          <>
            {/* Metal blade ring */}
            <mesh geometry={metal} castShadow={castShadow}>
              <meshStandardMaterial color="#d6dde6" metalness={1} roughness={0.22} {...glow("blade")} />
            </mesh>
            {/* Inner metal core */}
            <mesh position={[0, 0.08, 0]} castShadow={castShadow}>
              <cylinderGeometry args={[0.44, 0.44, 0.16, radialSegs]} />
              <meshStandardMaterial color="#9aa4b1" metalness={1} roughness={0.3} {...glow("blade")} />
            </mesh>
            {/* Coloured plastic cover */}
            <mesh geometry={cover} position={[0, 0.17, 0]} castShadow={castShadow}>
              <meshPhysicalMaterial
                color={visual.primary}
                metalness={0.25}
                roughness={0.28}
                clearcoat={lowDetail ? 0 : 1}
                clearcoatRoughness={0.15}
                {...glow("blade")}
              />
            </mesh>
            {/* Secondary detail ring */}
            <mesh position={[0, BLADE_HEIGHT - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.32, 0.5, radialSegs]} />
              <meshStandardMaterial color={visual.secondary} metalness={0.7} roughness={0.25} side={THREE.DoubleSide} {...glow("blade")} />
            </mesh>
            {/* Centre emblem */}
            <mesh position={[0, BLADE_HEIGHT + 0.02, 0]} castShadow={castShadow}>
              <cylinderGeometry args={[0.3, 0.32, 0.08, radialSegs]} />
              <meshPhysicalMaterial color={visual.accent} metalness={0.5} roughness={0.2} clearcoat={1} {...glow("blade")} />
            </mesh>
            {/* X emblem */}
            <group position={[0, BLADE_HEIGHT + 0.065, 0]}>
              {[Math.PI / 4, -Math.PI / 4].map((r) => (
                <mesh key={r} rotation={[0, r, 0]}>
                  <boxGeometry args={[0.42, 0.02, 0.07]} />
                  <meshStandardMaterial color="#0b0d12" metalness={0.6} roughness={0.3} />
                </mesh>
              ))}
            </group>
          </>
        )}
        <object3D ref={(o) => onAnchor?.("blade", o)} position={[0, 0.2, 0]} />
      </group>
    </group>
  );
}

/* ---------- Photo blade ---------- */

/**
 * Blade built from the official top-down product photo: several stacked, alpha-cut layers give
 * the photo real thickness, with a metal body underneath, so the top looks exactly like the product.
 */
function PhotoBlade({
  url,
  glow,
  radialSegs,
  castShadow,
  lowDetail,
}: {
  url: string;
  glow: { emissive: THREE.Color; emissiveIntensity: number };
  radialSegs: number;
  castShadow: boolean;
  lowDetail: boolean;
}) {
  const texture = useTexture(url, (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });
  const layers = lowDetail ? 8 : 14;
  // Softer highlight so the photo isn't washed out when hovered / selected
  const photoGlow = { emissive: glow.emissive, emissiveIntensity: glow.emissiveIntensity * 0.35 };
  const radius = 1.04;
  return (
    <group>
      {/* Metal body under the photo layers */}
      <mesh position={[0, 0.1, 0]} castShadow={castShadow}>
        <cylinderGeometry args={[0.72, 0.6, 0.2, radialSegs]} />
        <meshStandardMaterial color="#aab3bf" metalness={1} roughness={0.3} {...glow} />
      </mesh>
      {Array.from({ length: layers }).map((_, i) => {
        const k = i / (layers - 1); // 0 = bottom, 1 = top
        const shade = new THREE.Color().setScalar(0.35 + 0.65 * Math.pow(k, 2));
        return (
          <mesh
            key={i}
            position={[0, 0.08 + k * (BLADE_HEIGHT - 0.06), 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            castShadow={castShadow && i === 0}
          >
            <circleGeometry args={[radius - (1 - k) * 0.03, radialSegs * 2]} />
            <meshStandardMaterial
              map={texture}
              color={shade}
              alphaTest={0.5}
              side={THREE.DoubleSide}
              metalness={i === layers - 1 ? 0.25 : 0.5}
              roughness={i === layers - 1 ? 0.38 : 0.45}
              envMapIntensity={0.7}
              {...photoGlow}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* ---------- Bit ---------- */

function BitMesh({
  visual,
  height,
  glow,
  radialSegs,
  castShadow,
}: {
  visual: BeyVisual;
  height: number;
  glow: { emissive: THREE.Color; emissiveIntensity: number };
  radialSegs: number;
  castShadow: boolean;
}) {
  const bodyH = 0.16;
  const tipTop = height - bodyH; // y where body starts
  const bitColor = "#e9edf2";
  const gearTeeth = visual.bit === "gearflat" ? 18 : 12;
  const gearRadius = visual.bit === "gearflat" ? 0.27 : 0.24;

  return (
    <group>
      {/* Upper bit body */}
      <mesh position={[0, tipTop + bodyH / 2, 0]} castShadow={castShadow}>
        <cylinderGeometry args={[0.32, 0.28, bodyH, radialSegs]} />
        <meshStandardMaterial color={visual.primary} metalness={0.2} roughness={0.35} {...glow} />
      </mesh>
      {/* Gear ring — engages the X-Celerator Rail */}
      <group position={[0, tipTop - 0.02, 0]}>
        <mesh>
          <cylinderGeometry args={[gearRadius - 0.03, gearRadius - 0.05, 0.08, radialSegs]} />
          <meshStandardMaterial color="#c9ced6" metalness={0.6} roughness={0.3} {...glow} />
        </mesh>
        {Array.from({ length: gearTeeth }).map((_, i) => {
          const a = (i / gearTeeth) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * gearRadius, 0, Math.sin(a) * gearRadius]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.05, 0.08, 0.04]} />
              <meshStandardMaterial color="#c9ced6" metalness={0.6} roughness={0.3} {...glow} />
            </mesh>
          );
        })}
      </group>
      {/* Tip */}
      <TipMesh shape={visual.bit} top={tipTop - 0.06} color={bitColor} glow={glow} radialSegs={radialSegs} castShadow={castShadow} />
    </group>
  );
}

function TipMesh({
  shape,
  top,
  color,
  glow,
  radialSegs,
  castShadow,
}: {
  shape: BeyVisual["bit"];
  top: number;
  color: string;
  glow: { emissive: THREE.Color; emissiveIntensity: number };
  radialSegs: number;
  castShadow: boolean;
}) {
  const mat = <meshStandardMaterial color={color} metalness={0.1} roughness={0.35} {...glow} />;
  switch (shape) {
    case "ball":
      return (
        <mesh position={[0, top * 0.55, 0]} castShadow={castShadow}>
          <sphereGeometry args={[top * 0.55 + 0.02, radialSegs, radialSegs / 2]} />
          {mat}
        </mesh>
      );
    case "needle":
    case "highneedle":
      return (
        <mesh position={[0, top / 2, 0]} castShadow={castShadow}>
          <cylinderGeometry args={[0.16, 0.012, top, radialSegs]} />
          {mat}
        </mesh>
      );
    case "taper":
      return (
        <mesh position={[0, top / 2, 0]} castShadow={castShadow}>
          <cylinderGeometry args={[0.2, 0.06, top, radialSegs]} />
          {mat}
        </mesh>
      );
    case "flat":
    case "gearflat":
    default:
      return (
        <mesh position={[0, top / 2, 0]} castShadow={castShadow}>
          <cylinderGeometry args={[0.2, shape === "gearflat" ? 0.17 : 0.15, top, radialSegs]} />
          {mat}
        </mesh>
      );
  }
}
