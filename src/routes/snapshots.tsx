import { createFileRoute, Link } from "@tanstack/react-router";
import { AuroraField } from "@/components/AuroraField";
import { SnapshotList } from "@/components/studio/SnapshotList";

export const Route = createFileRoute("/snapshots")({
  head: () => ({
    meta: [
      { title: "Snapshots — Creative Studio" },
      {
        name: "description",
        content:
          "Save the mode and phase you chose, with a note. Build a personal record of how your work moves.",
      },
    ],
  }),
  component: SnapshotsPage,
});

function SnapshotsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-32">
      <AuroraField />
      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-8">
        <Link to="/" className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full breathe"
            style={{ background: "var(--gradient-thread)" }}
          />
          <span className="font-display text-base tracking-wide">Creative Studio</span>
        </Link>
        <Link
          to="/timing"
          className="text-xs tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
        >
          Timing →
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-6 pt-8">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-4 fade-up">
          Mode snapshots
        </p>
        <h1
          className="font-display text-5xl leading-[1.05] fade-up"
          style={{ animationDelay: "60ms" }}
        >
          Mark the <span className="text-thread italic">moment.</span>
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground fade-up"
          style={{ animationDelay: "160ms" }}
        >
          Choose a mode, optionally a phase, add a line. The studio stores the labels you picked.
          Over time you'll see your own pattern — written by you.
        </p>
      </section>

      <section className="relative z-10 mx-auto mt-10 max-w-3xl px-6">
        <SnapshotList />
      </section>
    </main>
  );
}
