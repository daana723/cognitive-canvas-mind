import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { AuroraField } from "@/components/AuroraField";

export const Route = createFileRoute("/spark")({
  component: SparkLayout,
});

function SparkLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      <AuroraField />
      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full breathe" style={{ background: "var(--gradient-thread)" }} />
          <span className="font-display text-base tracking-wide">Nonlinear Studio</span>
        </Link>
        <Link to="/" className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm">
          Pause
        </Link>
      </header>
      <div className="relative z-10">
        <Outlet />
      </div>
    </main>
  );
}
