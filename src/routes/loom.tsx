import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Sigil } from "@/components/Sigil";
import { ThreadBackground } from "@/components/ThreadBackground";

export const Route = createFileRoute("/loom")({
  component: LoomLayout,
});

function LoomLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      <div className="absolute inset-0 bg-[var(--gradient-aurora)]" />
      <ThreadBackground />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <Sigil variant="loom" className="h-5 w-5 text-thread" />
          <span className="font-display text-base tracking-wide">Nonlinear Studio</span>
        </Link>
        <nav className="flex gap-5 text-xs tracking-[0.22em] uppercase">
          <Link to="/loom" className="text-muted-foreground hover:text-foreground transition-calm">
            Loom
          </Link>
          <Link
            to="/loom/constellation"
            className="text-muted-foreground hover:text-foreground transition-calm"
          >
            Constellation
          </Link>
        </nav>
      </header>
      <div className="relative z-10">
        <Outlet />
      </div>
    </main>
  );
}
