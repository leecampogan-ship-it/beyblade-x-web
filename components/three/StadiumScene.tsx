"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Trail } from "@react-three/drei";
import ProjectedLabels from "./ProjectedLabels";
import * as THREE from "three";
import BeybladeModel from "./BeybladeModel";
import StudioLights from "./StudioLights";
import { PRODUCTS } from "@/lib/products";
import { seededRandom } from "@/lib/random";

export type FinishId = "xtreme" | "over" | "burst" | "spin";
export type BattlePhase = "launch" | "battle" | "dash" | "impact" | "finish";

/* ---------- Stadium geometry constants ---------- */
const R = 4; // bowl radius
const RAIL_R = 3.62;
const BOWL_DEPTH = 0.55;
const surf = (r: number) => BOWL_DEPTH * Math.pow(Math.min(r, R) / R, 2);
const polar = (r: number, theta: number): [number, number] => [Math.cos(theta) * r, Math.sin(theta) * r];

const XTREME_ANGLE = Math.PI / 2; // facing the camera
const OVER_ANGLES = [Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 - (2 * Math.PI) / 3];
const GAP_HALF = 0.32;
const POCKET_R = 4.75;
const POCKET_Y = 0.32;

const ATTACKER = PRODUCTS.find((p) => p.id === "sword-dran-3-60f")!.visual;
const DEFENDER = PRODUCTS.find((p) => p.id === "helm-knight-3-80n")!.visual;

/* ---------- Timeline (seconds) ---------- */
const T_LAND = 0.8;
const T_RAIL = 1.4;
const T_LEAVE = 3.15;
const T_HIT = 3.5;
const RAIL_OMEGA = 4.4;

function resultTime(finish: FinishId) {
  return finish === "spin" ? T_HIT + 3.4 : T_HIT + 1.1;
}
function loopLength(finish: FinishId) {
  return resultTime(finish) + 3.2;
}

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);

/** Position of the defender (B) before the hit. */
function defenderPre(t: number): THREE.Vector3 {
  if (t < T_LAND) {
    const [x, z] = polar(1.6, 0);
    return new THREE.Vector3(x, surf(1.6) + (1 - easeOut(t / T_LAND)) * 2.2, z);
  }
  const u = t - T_LAND;
  const r = THREE.MathUtils.lerp(1.6, 0.9, clamp01(u / 2.4));
  const [x, z] = polar(r, u * 1.4);
  return new THREE.Vector3(x, surf(r), z);
}

/** Position of the attacker (A). */
function attackerPos(t: number, finish: FinishId): { p: THREE.Vector3; onRail: boolean; theta: number } {
  if (t < T_LAND) {
    const [x, z] = polar(2.6, Math.PI);
    return { p: new THREE.Vector3(x, surf(2.6) + (1 - easeOut(t / T_LAND)) * 2.2, z), onRail: false, theta: Math.PI };
  }
  if (t < T_RAIL) {
    const u = (t - T_LAND) / (T_RAIL - T_LAND);
    const r = THREE.MathUtils.lerp(2.6, RAIL_R, easeOut(u));
    const theta = Math.PI + (t - T_LAND) * 2.5;
    const [x, z] = polar(r, theta);
    return { p: new THREE.Vector3(x, surf(r) + 0.04, z), onRail: false, theta };
  }
  const railTheta = (tt: number) => Math.PI + (T_RAIL - T_LAND) * 2.5 + (tt - T_RAIL) * RAIL_OMEGA;
  if (t < T_LEAVE) {
    const theta = railTheta(t);
    const [x, z] = polar(RAIL_R, theta);
    return { p: new THREE.Vector3(x, surf(RAIL_R) + 0.06, z), onRail: true, theta };
  }
  const bHit = defenderPre(T_HIT);
  const dirOut = bHit.clone().setY(0).normalize();
  const flightDir = finishDirection(finish, bHit);
  // Contact point: just behind the defender relative to where it will be knocked
  const contact = bHit.clone().addScaledVector(flightDir, -0.42);
  if (t < T_HIT) {
    const [sx, sz] = polar(RAIL_R, railTheta(T_LEAVE));
    const start = new THREE.Vector3(sx, surf(RAIL_R) + 0.06, sz);
    const u = easeOut((t - T_LEAVE) / (T_HIT - T_LEAVE));
    return { p: start.lerp(contact, u), onRail: false, theta: railTheta(T_LEAVE) };
  }
  // Recoil, then calm orbit around the centre
  const recoilEnd = contact.clone().addScaledVector(flightDir, -0.9).addScaledVector(dirOut, -0.2);
  recoilEnd.y = surf(Math.hypot(recoilEnd.x, recoilEnd.z));
  const u = (t - T_HIT) / 0.6;
  if (u < 1) return { p: contact.clone().lerp(recoilEnd, easeOut(u)), onRail: false, theta: 0 };
  const baseAngle = Math.atan2(recoilEnd.z, recoilEnd.x);
  const r0 = Math.hypot(recoilEnd.x, recoilEnd.z);
  const r = THREE.MathUtils.lerp(r0, 1.3, clamp01((t - T_HIT - 0.6) / 1.5));
  const [x, z] = polar(r, baseAngle + (t - T_HIT - 0.6) * 1.8);
  return { p: new THREE.Vector3(x, surf(r), z), onRail: false, theta: 0 };
}

function finishDirection(finish: FinishId, bHit: THREE.Vector3): THREE.Vector3 {
  if (finish === "xtreme" || finish === "over") {
    const angle = finish === "xtreme" ? XTREME_ANGLE : OVER_ANGLES[1];
    const [x, z] = polar(POCKET_R, angle);
    return new THREE.Vector3(x - bHit.x, 0, z - bHit.z).normalize();
  }
  return bHit.clone().setY(0).normalize();
}

interface DefenderState {
  p: THREE.Vector3;
  spin: number;
  tilt: number;
  scatter: number;
}

function defenderState(t: number, finish: FinishId): DefenderState {
  if (t < T_HIT) return { p: defenderPre(t), spin: 16, tilt: 0.05, scatter: 0 };
  const bHit = defenderPre(T_HIT);
  const dt = t - T_HIT;
  if (finish === "xtreme" || finish === "over") {
    const angle = finish === "xtreme" ? XTREME_ANGLE : OVER_ANGLES[1];
    const [px, pz] = polar(POCKET_R, angle);
    const u = clamp01(dt / 0.75);
    const e = easeOut(u);
    const p = new THREE.Vector3(
      THREE.MathUtils.lerp(bHit.x, px, e),
      THREE.MathUtils.lerp(bHit.y, POCKET_Y, e) + Math.sin(Math.PI * u) * 0.9,
      THREE.MathUtils.lerp(bHit.z, pz, e),
    );
    const settle = clamp01((dt - 0.75) / 1.2);
    return { p, spin: 16 * (1 - settle), tilt: 0.1 + settle * 1.2, scatter: 0 };
  }
  if (finish === "burst") {
    const out = bHit.clone().setY(0).normalize();
    const p = bHit.clone().addScaledVector(out, easeOut(dt / 0.4) * 0.35);
    p.y = surf(Math.hypot(p.x, p.z));
    return { p, spin: dt < 0.15 ? 16 : 0, tilt: 0, scatter: easeOut(clamp01((dt - 0.05) / 0.8)) };
  }
  // Spin finish: light knock, then the defender slowly loses spin, wobbles and topples.
  const out = bHit.clone().setY(0).normalize();
  const drift = bHit.clone().addScaledVector(out, easeOut(dt / 0.5) * 0.5);
  const r = Math.hypot(drift.x, drift.z);
  const ang = Math.atan2(drift.z, drift.x) + dt * 0.6 * Math.max(0, 1 - dt / 3.2);
  const [x, z] = polar(r, ang);
  const decay = clamp01(dt / 3.2);
  const tilt = decay < 0.85 ? 0.05 + decay * 0.35 : 0.35 + easeOut((decay - 0.85) / 0.15) * 1.0;
  return { p: new THREE.Vector3(x, surf(r), z), spin: 16 * (1 - decay), tilt, scatter: 0 };
}

/* ---------- Visual pieces ---------- */

function Bowl() {
  const geometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const r = (i / steps) * R;
      pts.push(new THREE.Vector2(r, surf(r)));
    }
    return new THREE.LatheGeometry(pts, 128);
  }, []);
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#0f100e" metalness={0.55} roughness={0.38} side={THREE.DoubleSide} />
    </mesh>
  );
}

function FloorMarkings() {
  return (
    <group>
      {[0.6, 1.4, 2.3, 3.1].map((r) => (
        <mesh key={r} position={[0, surf(r) + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r, r + 0.025, 128]} />
          <meshBasicMaterial color="#2c3122" transparent opacity={0.55} toneMapped={false} />
        </mesh>
      ))}
      {/* Centre X mark */}
      {[Math.PI / 4, -Math.PI / 4].map((a) => (
        <mesh key={a} position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, a]}>
          <planeGeometry args={[0.9, 0.08]} />
          <meshBasicMaterial color="#ff4a2e" transparent opacity={0.75} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Wall segments with gaps for the Xtreme and Over zones. */
function Walls() {
  const gaps = [XTREME_ANGLE, ...OVER_ANGLES].map((a) => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)).sort((a, b) => a - b);
  const segments: Array<[number, number]> = [];
  for (let i = 0; i < gaps.length; i++) {
    const start = gaps[i] + GAP_HALF;
    const end = (i + 1 < gaps.length ? gaps[i + 1] : gaps[0] + Math.PI * 2) - GAP_HALF;
    segments.push([start, end]);
  }
  return (
    <group>
      {segments.map(([a, b], i) => (
        // CylinderGeometry measures theta from +Z towards +X, so convert from our (cos, sin) convention
        <mesh key={i} position={[0, BOWL_DEPTH + 0.28, 0]}>
          <cylinderGeometry args={[R + 0.05, R + 0.05, 0.62, 64, 1, true, Math.PI / 2 - b, b - a]} />
          <meshStandardMaterial color="#cfd2c8" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {segments.map(([a, b], i) => (
        <mesh key={`rim-${i}`} position={[0, BOWL_DEPTH + 0.6, 0]}>
          <cylinderGeometry args={[R + 0.07, R + 0.07, 0.05, 64, 1, true, Math.PI / 2 - b, b - a]} />
          <meshBasicMaterial color="#c6f31a" toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

const ZONES = [
  { angle: XTREME_ANGLE, color: "#ff4a2e", label: "XTREME ZONE · 3 PTS" },
  { angle: OVER_ANGLES[0], color: "#ffb020", label: "OVER ZONE · 2 PTS" },
  { angle: OVER_ANGLES[1], color: "#ffb020", label: "OVER ZONE · 2 PTS" },
];
const SCENE_Y = -0.6;
const ZONE_LABEL_POSITIONS = ZONES.map((z) => {
  const [x, zz] = polar(POCKET_R, z.angle);
  return [x, SCENE_Y + POCKET_Y + 0.55, zz] as [number, number, number];
});

function Pockets() {
  return (
    <group>
      {ZONES.map(({ angle, color }) => {
        const [x, z] = polar(POCKET_R, angle);
        return (
          <group key={angle} position={[x, POCKET_Y - 0.06, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[1.5, 0.08, 0.9]} />
              <meshStandardMaterial color="#10131b" emissive={color} emissiveIntensity={0.35} metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.35, 0.75]} />
              <meshBasicMaterial color={color} transparent opacity={0.22} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** The X-Celerator Rail — gear teeth light up in a chase pattern following the dashing Beyblade. */
function Rail({ headRef }: { headRef: React.RefObject<{ theta: number; active: boolean }> }) {
  const COUNT = 150;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const base = useMemo(() => new THREE.Color("#2a3550"), []);
  const hot = useMemo(() => new THREE.Color("#e4ff8a"), []);

  const angles = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < COUNT; i++) {
      const a = (i / COUNT) * Math.PI * 2;
      // Leave openings for the zones
      const inGap = [XTREME_ANGLE, ...OVER_ANGLES].some((g) => {
        const d = Math.atan2(Math.sin(a - g), Math.cos(a - g));
        return Math.abs(d) < GAP_HALF * 0.9;
      });
      if (!inGap) list.push(a);
    }
    return list;
  }, []);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const obj = new THREE.Object3D();
    angles.forEach((a, i) => {
      const [x, z] = polar(RAIL_R + 0.12, a);
      obj.position.set(x, surf(RAIL_R) + 0.07, z);
      obj.rotation.set(0, -a, 0);
      obj.updateMatrix();
      m.setMatrixAt(i, obj.matrix);
      m.setColorAt(i, base);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [angles, base]);

  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const head = headRef.current;
    const theta = head.active ? head.theta : clock.getElapsedTime() * 1.5;
    const width = head.active ? 1.2 : 0.6;
    angles.forEach((a, i) => {
      const d = Math.atan2(Math.sin(theta - a), Math.cos(theta - a)); // a behind theta => positive
      const k = d >= 0 && d < width ? 1 - d / width : 0;
      tmpColor.copy(base).lerp(hot, k);
      m.setColorAt(i, tmpColor);
    });
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <mesh position={[0, surf(RAIL_R) + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RAIL_R + 0.05, RAIL_R + 0.22, 160]} />
        <meshStandardMaterial color="#1a2234" metalness={0.8} roughness={0.3} />
      </mesh>
      <instancedMesh ref={mesh} args={[undefined, undefined, angles.length]}>
        <boxGeometry args={[0.06, 0.08, 0.14]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Sparks({ triggerRef }: { triggerRef: React.RefObject<{ time: number; origin: THREE.Vector3 } | null> }) {
  const COUNT = 80;
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const velocities = useMemo(() => {
    const rand = seededRandom(7);
    const v = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const a = rand() * Math.PI * 2;
      const s = 1.5 + rand() * 3.5;
      v[i * 3] = Math.cos(a) * s;
      v[i * 3 + 1] = 1 + rand() * 3;
      v[i * 3 + 2] = Math.sin(a) * s;
    }
    return v;
  }, []);
  const positions = useMemo(() => new Float32Array(COUNT * 3), []);

  useFrame(({ clock }) => {
    const trig = triggerRef.current;
    if (!points.current || !mat.current) return;
    if (!trig) {
      mat.current.opacity = 0;
      return;
    }
    const age = clock.getElapsedTime() - trig.time;
    if (age < 0 || age > 0.8) {
      mat.current.opacity = 0;
      return;
    }
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = trig.origin.x + velocities[i * 3] * age;
      arr[i * 3 + 1] = trig.origin.y + 0.2 + velocities[i * 3 + 1] * age - 4.9 * age * age;
      arr[i * 3 + 2] = trig.origin.z + velocities[i * 3 + 2] * age;
    }
    attr.needsUpdate = true;
    mat.current.opacity = 1 - age / 0.8;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={mat} size={0.09} color="#ffe08a" transparent opacity={0} depthWrite={false} toneMapped={false} />
    </points>
  );
}

/* ---------- Battle controller ---------- */

function Battle({
  finish,
  playId,
  playing,
  onPhase,
}: {
  finish: FinishId;
  playId: number;
  playing: boolean;
  onPhase: (phase: BattlePhase) => void;
}) {
  const aGroup = useRef<THREE.Group>(null);
  const bGroup = useRef<THREE.Group>(null);
  const bTilt = useRef<THREE.Group>(null);
  const aSpin = useRef(18);
  const bSpin = useRef(16);
  const bScatter = useRef(0);
  const time = useRef(0);
  const precession = useRef(0);
  const lastPlayId = useRef(playId);
  const lastPhase = useRef<BattlePhase | null>(null);
  const sparkTrigger = useRef<{ time: number; origin: THREE.Vector3 } | null>(null);
  const sparkFired = useRef(false);
  const railHead = useRef({ theta: 0, active: false });

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    if (lastPlayId.current !== playId) {
      lastPlayId.current = playId;
      time.current = 0;
      sparkFired.current = false;
    }
    if (playing) time.current += dt;
    if (time.current > loopLength(finish)) {
      time.current = 0;
      sparkFired.current = false;
    }
    const t = time.current;

    const a = attackerPos(t, finish);
    const b = defenderState(t, finish);
    aGroup.current?.position.copy(a.p);
    bGroup.current?.position.copy(b.p);
    railHead.current.theta = a.theta;
    railHead.current.active = a.onRail;
    aSpin.current = playing ? 18 : 0;
    bSpin.current = playing ? b.spin : 0;
    bScatter.current = b.scatter;

    if (bTilt.current) {
      if (playing) precession.current += dt * (2 + b.tilt * 6);
      bTilt.current.rotation.x = Math.cos(precession.current) * b.tilt;
      bTilt.current.rotation.z = Math.sin(precession.current) * b.tilt;
    }

    if (t >= T_HIT && !sparkFired.current) {
      sparkFired.current = true;
      sparkTrigger.current = { time: clock.getElapsedTime(), origin: b.p.clone() };
    }

    let phase: BattlePhase;
    if (t < T_LAND) phase = "launch";
    else if (a.onRail) phase = "dash";
    else if (t < T_HIT) phase = "battle";
    else if (t < resultTime(finish)) phase = t < T_HIT + 0.5 ? "impact" : "battle";
    else phase = "finish";
    if (phase !== lastPhase.current) {
      lastPhase.current = phase;
      onPhase(phase);
    }
  });

  return (
    <>
      <Rail headRef={railHead} />
      <group ref={aGroup}>
        <group scale={0.5}>
          <BeybladeModel visual={ATTACKER} spinRef={aSpin} castShadow={false} lowDetail />
        </group>
        <Trail width={1.4} length={5} color="#e4ff8a" attenuation={(w) => w * w} decay={1.5}>
          <mesh position={[0, 0.18, 0]} visible={false}>
            <sphereGeometry args={[0.02, 4, 4]} />
            <meshBasicMaterial />
          </mesh>
        </Trail>
      </group>
      <group ref={bGroup}>
        <group ref={bTilt}>
          <group scale={0.5}>
            <BeybladeModel visual={DEFENDER} spinRef={bSpin} scatterRef={bScatter} castShadow={false} lowDetail />
          </group>
        </group>
      </group>
      <Sparks triggerRef={sparkTrigger} />
    </>
  );
}

export default function StadiumScene({
  active,
  finish,
  playId,
  playing,
  onPhase,
}: {
  active: boolean;
  finish: FinishId;
  playId: number;
  playing: boolean;
  onPhase: (phase: BattlePhase) => void;
}) {
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const resolve = () =>
    ZONE_LABEL_POSITIONS.map((position, i) => ({ el: labels.current[i], position }));

  return (
    <div className="relative h-full w-full">
    <Canvas
      resize={{ offsetSize: true }}
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      camera={{ position: [0, 8.2, 8.2], fov: 44 }}
      gl={{ antialias: true, alpha: true }}
      aria-label="Animated 3D Beyblade X stadium battle demonstration"
      role="img"
    >
      <Suspense fallback={null}>
        <StudioLights intensity={0.9} />
        <group position={[0, SCENE_Y, 0]}>
          {/* Base plate */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[R + 1.4, R + 1.6, 0.22, 96]} />
            <meshStandardMaterial color="#0b0e15" metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[R + 1.3, R + 1.36, 128]} />
            <meshBasicMaterial color="#c6f31a" toneMapped={false} />
          </mesh>
          <Bowl />
          <FloorMarkings />
          <Walls />
          <Pockets />
          <Battle finish={finish} playId={playId} playing={playing} onPhase={onPhase} />
        </group>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          minPolarAngle={Math.PI * 0.12}
          maxPolarAngle={Math.PI * 0.42}
          target={[0, -0.6, 0.6]}
        />
        <ProjectedLabels resolve={resolve} />
      </Suspense>
    </Canvas>
    {ZONES.map((z, i) => (
      <span
        key={i}
        ref={(el) => {
          labels.current[i] = el;
        }}
        style={{ visibility: "hidden", color: z.color }}
        className="headline pointer-events-none absolute left-0 top-0 whitespace-nowrap bg-ink/80 px-2 py-1 text-base sm:text-xl"
      >
        {z.label}
      </span>
    ))}
    </div>
  );
}
