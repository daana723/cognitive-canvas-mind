/**
 * Ambient background field — soft drifting auroras.
 * Decorative only; purely CSS-driven, no animations on mount.
 */
export function AuroraField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-40 -left-40 h-[60vh] w-[60vh] rounded-full opacity-50 blur-3xl drift"
        style={{ background: "radial-gradient(circle, oklch(0.74 0.16 285 / 0.45), transparent 60%)" }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[55vh] w-[55vh] rounded-full opacity-40 blur-3xl drift"
        style={{ background: "radial-gradient(circle, oklch(0.80 0.12 220 / 0.4), transparent 60%)", animationDelay: "-4s" }}
      />
      <div
        className="absolute -bottom-40 left-1/4 h-[50vh] w-[50vh] rounded-full opacity-30 blur-3xl drift"
        style={{ background: "radial-gradient(circle, oklch(0.70 0.18 320 / 0.45), transparent 60%)", animationDelay: "-8s" }}
      />
    </div>
  );
}