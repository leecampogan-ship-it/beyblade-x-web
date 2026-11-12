export default function SceneLoader({ label = "Loading 3D" }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
          <div className="absolute inset-2 animate-[spin_0.8s_linear_infinite_reverse] rounded-full border-2 border-crimson/20 border-b-crimson" />
          <div className="absolute inset-[26px] rounded-full bg-chrome shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
        </div>
        <span className="font-display text-xs tracking-wider text-white/72 uppercase">{label}</span>
      </div>
    </div>
  );
}
