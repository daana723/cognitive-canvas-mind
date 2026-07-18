import { Outlet, createFileRoute, Link } from "@tanstack/react-router";
import { AuroraField } from "@/components/AuroraField";
import { ThreadBackground } from "@/components/loom/ThreadBackground";

export const Route = createFileRoute("/loom")({
  head: () => ({
    meta: [
      { title: "Loom - Nonlinear Studio" },
      { name: "description", content: "The Loom orchestrates a constellation of local-first creative agents." },
    ],
  }),
  component: LoomLayout,
});

function LoomLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-28">
      <AuroraField />
      <ThreadBackground />
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-base tracking-wide">Nonlinear Studio</span>
        </Link>
        <nav className="flex items-center gap-5 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          <Link to="/loom" className="hover:text-foreground transition-calm">Loom</Link>
          <Link to="/loom/constellation" className="hover:text-foreground transition-calm">Constellation</Link>
          <Link to="/spark" className="hover:text-foreground transition-calm">SPARK</Link>
        </nav>
      </header>
      <Outlet />
    </main>
  );
}
