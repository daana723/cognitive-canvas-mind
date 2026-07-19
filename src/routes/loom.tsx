import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ThreadBackground } from "@/components/loom/ThreadBackground";

export const Route = createFileRoute("/loom")({
  head: () => ({
    meta: [
      { title: "Loom — the practical door · Nonlinear Studio" },
      {
        name: "description",
        content:
          "Bring a messy creative intention. The Loom reads the thread and lights the seven agents — Research, Content, Product, Marketing, Avatar, Operations — and returns a structured plan.",
      },
      { property: "og:title", content: "Loom — a seven-agent creative constellation" },
      { property: "og:description", content: "Local-first orchestrator for nonlinear making. Weave an intention, get a structured plan." },
    ],
  }),
  component: LoomShell,
});

function LoomShell() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-aurora, radial-gradient(1200px 800px at 20% 10%, oklch(0.28 0.08 285 / 0.6), transparent), radial-gradient(900px 700px at 90% 90%, oklch(0.25 0.09 220 / 0.5), transparent))" }} />
      <ThreadBackground />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-lg tracking-wide">Nonlinear Studio</span>
        </Link>
        <nav className="flex gap-6 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          <Link to="/loom" className="hover:text-foreground transition-calm">Weave</Link>
          <Link to="/loom/constellation" className="hover:text-foreground transition-calm">Constellation</Link>
          <Link to="/" className="hover:text-foreground transition-calm">Studio</Link>
        </nav>
      </header>

      <div className="relative z-10">
        <Outlet />
      </div>

      <footer className="relative z-10 border-t border-border/30 py-8 text-center text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
        Loom · local-first · deterministic · Codex-ready seam
      </footer>
    </main>
  );
}