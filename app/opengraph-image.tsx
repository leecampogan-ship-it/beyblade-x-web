import { ImageResponse } from "next/og";

export const alt = "BEYBLADE X — Accelerate Your Game. An interactive 3D fan experience.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 75% 50%, #1a2205 0%, #000000 60%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 12, color: "#e4ff8a" }}>INTERACTIVE 3D FAN EXPERIENCE</div>
        <div style={{ display: "flex", fontSize: 150, fontWeight: 900, marginTop: 20, letterSpacing: -4 }}>
          BEYBLADE&nbsp;<span style={{ color: "#c6f31a", textShadow: "0 0 30px #c6f31a" }}>X</span>
        </div>
        <div style={{ display: "flex", fontSize: 44, marginTop: 10, color: "#d6dde6", letterSpacing: 6 }}>ACCELERATE YOUR GAME.</div>
        <div
          style={{
            position: "absolute",
            right: 90,
            top: 165,
            width: 300,
            height: 300,
            borderRadius: 9999,
            border: "18px solid #c9d2de",
            boxShadow: "0 0 80px #c6f31a",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
