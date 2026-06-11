import { useEffect, useState } from "react";
import { studioStore, newId, type NarrativeNode } from "@/lib/studio/store";

export function NarrativeMap() {
  const [nodes, setNodes] = useState<NarrativeNode[]>([]);
  const [context, setContext] = useState("");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const s = studioStore.load();
    setNodes(s.narrative);
    setContext(s.narrativeContext);
  }, []);

  const saveContext = (val: string) => {
    setContext(val);
    studioStore.update((s) => ({ ...s, narrativeContext: val }));
  };

  const addNode = () => {
    const text = draft.trim();
    if (!text) return;
    const node: NarrativeNode = { id: newId(), text, createdAt: new Date().toISOString() };
    const next = [node, ...nodes];
    setNodes(next);
    setDraft("");
    studioStore.update((s) => ({ ...s, narrative: next }));
  };

  const remove = (id: string) => {
    const next = nodes.filter((n) => n.id !== id);
    setNodes(next);
    studioStore.update((s) => ({ ...s, narrative: next }));
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <label className="text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
          What you're working on · in your words
        </label>
        <textarea
          value={context}
          onChange={(e) => saveContext(e.target.value)}
          rows={3}
          placeholder="A sentence or two about the current creative territory."
          className="mt-3 w-full resize-none rounded-xl border border-border/60 bg-black/20 p-4 text-base text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-foreground/40"
        />
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <p className="mb-3 text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
          Add a thread
        </p>
        <div className="flex gap-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNode()}
            placeholder="An idea, fragment, question, image…"
            className="flex-1 rounded-xl border border-border/60 bg-black/20 px-4 py-3 text-sm outline-none focus:border-foreground/40"
          />
          <button
            type="button"
            onClick={addNode}
            className="rounded-xl px-5 py-3 text-xs tracking-[0.22em] uppercase transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)" }}
          >
            Add
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground italic">
          The system stores what you write. It does not interpret it.
        </p>
      </div>

      {nodes.length > 0 && (
        <div className="space-y-2">
          {nodes.map((n) => (
            <div
              key={n.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-border/40 bg-black/20 p-4"
            >
              <p className="text-sm leading-relaxed text-foreground/90">{n.text}</p>
              <button
                type="button"
                onClick={() => remove(n.id)}
                className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
              >
                Release
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
