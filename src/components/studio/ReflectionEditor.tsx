import { useEffect, useState } from "react";
import { studioStore, newId, type Reflection } from "@/lib/studio/store";

export function ReflectionEditor() {
  const [items, setItems] = useState<Reflection[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => { setItems(studioStore.load().reflections); }, []);

  const add = () => {
    const body = draft.trim();
    if (!body) return;
    const r: Reflection = { id: newId(), body, createdAt: new Date().toISOString() };
    const next = [r, ...items];
    setItems(next);
    setDraft("");
    studioStore.update((s) => ({ ...s, reflections: next }));
  };

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    studioStore.update((s) => ({ ...s, reflections: next }));
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <p className="mb-3 text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
          A note to yourself
        </p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          placeholder="Anything you noticed. The system will not respond, interpret, or analyze."
          className="w-full resize-none rounded-xl border border-border/60 bg-black/20 p-4 text-base outline-none focus:border-foreground/40"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={add}
            className="rounded-full px-6 py-2.5 text-xs tracking-[0.22em] uppercase transition-calm"
            style={{ background: "var(--gradient-thread)", color: "oklch(0.14 0.04 270)" }}
          >
            Keep
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border/40 bg-black/20 p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => remove(r.id)}
                  className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-calm"
                >
                  Release
                </button>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
