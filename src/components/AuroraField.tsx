/**
 * Ambient background field — soft drifting auroras.
 * Decorative only; purely CSS-driven, no animations on mount.
 */
import loomHero from "@/assets/loom-hero.jpg";

export function AuroraField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Mythic-tech base layer: indigo loom photo at low opacity */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-screen"
        style={{
          backgroundImage: `url(${loomHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(1.4) contrast(1.05)",
        }}
      />
      {/* Vignette to keep edges deep and text legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, oklch(0.13 0.05 275 / 0.85) 95%)",
        }}
      />
      <div
        className="absolute -top-40 -left-40 h-[65vh] w-[65vh] rounded-full opacity-80 blur-3xl drift"
        style={{
          background: "radial-gradient(circle, oklch(0.78 0.22 290 / 0.65), transparent 65%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[60vh] w-[60vh] rounded-full opacity-70 blur-3xl drift"
        style={{
          background: "radial-gradient(circle, oklch(0.84 0.18 215 / 0.6), transparent 65%)",
          animationDelay: "-4s",
        }}
      />
      <div
        className="absolute -bottom-40 left-1/4 h-[55vh] w-[55vh] rounded-full opacity-60 blur-3xl drift"
        style={{
          background: "radial-gradient(circle, oklch(0.74 0.22 325 / 0.6), transparent 65%)",
          animationDelay: "-8s",
        }}
      />
    </div>
  );
}
