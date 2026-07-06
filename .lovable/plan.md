## Restore SPARK as a deep reflective mirror

Keep everything currently on screen. Add SPARK back as a full multi-step reflective flow — the second equal door next to Loom — using the depth of the original assessment code but reframed in non-diagnostic language.

## Sources to recover (from git history, don't reinvent)

Recover the original files as starting material, then rewrite copy/labels:

- `src/lib/spark/questions.ts` (60 lines) — the item set
- `src/lib/spark/dimensions.ts` (84) — five axes → become the five **currents** (Flux / Depth / Signal / Myth / Pulse)
- `src/lib/spark/scoring.ts` (33) — becomes `resonance.ts` (heat per current, no score)
- `src/lib/spark/translation.ts` (309) — becomes `mirror.ts` (motifs + "you may recognize" phrasing)
- `src/lib/spark/archetypes.ts` (73) — becomes `symbolicModes.ts` (modes the user *may recognize*, never assigned)
- `src/components/assessment/{QuestionCard,LikertScale,ProgressThread}.tsx` — become `src/components/spark/{ReflectionCard,ResonanceScale,ThreadProgress}.tsx`
- `src/routes/assessment.tsx` (161) — becomes `src/routes/spark.tsx` (the flow)
- `src/lib/intensities/*` — becomes optional Currents step inside SPARK

I'll `git show <deleted-sha>~1:path` each file, port it in, then rename types and rewrite user-facing strings.

## SPARK flow (multi-step, restored depth)

```
/spark                → invitation + start
/spark/reflect        → item-by-item reflection (recovered questions, Likert reframed
                        as "resonance", ProgressThread visual kept)
/spark/currents       → optional short currents pass (from intensities set)
/spark/mirror         → the pattern sketch: motifs, current heat map,
                        symbolic modes you may recognize, gentle notes
/spark/mirror/:id     → view a saved sketch (local-first)
```

Each step: calm one-question-at-a-time layout, thread progress, no scores shown mid-flow, ability to skip/leave and resume.

## Language rewrite (applied throughout)

| Old | New |
|---|---|
| assessment | reflection |
| question | prompt |
| answer / score | resonance |
| result / profile | pattern sketch / mirror |
| archetype | symbolic mode you may recognize |
| dimension / trait | current |
| intensity | current |
| "You are…" | "You may recognize…" |
| "This means…" | "This may point toward…" |
| "Take the test" | "Enter the reflection" |

No forbidden vocab (per `mem/index.md`): no assessment, score, dimension, profile, trait, diagnosis, OE, 2E, Dąbrowski, etc. Currents keep the Flux/Depth/Signal/Myth/Pulse names already in the studio.

## The Mirror page (formerly Result)

Renders:
- Sketch title + timestamp
- **Motifs** — short symbolic phrases surfaced from the reflection
- **Current heat** — soft ring/heat chart of the five currents (not scores; no numbers on axes, just weight)
- **Symbolic modes you may recognize** — 1–3 modes surfaced with an invitation, never "you are"
- **A note to sit with** — one open reflective sentence
- **Save to your sketches** — writes to local `SparkSketch` via existing `dataAdapter.saveSparkSketch`

Result copy uses "you may recognize / this may point toward / notice whether this resonates" phrasing throughout.

## Persistence & contracts (use scaffolding already added)

- Reads/writes via `dataAdapter` (`getSparkSketch` / `saveSparkSketch`, `getCurrents` / `saveCurrents`) — no new storage layer.
- `SparkSketch` / `CurrentsReading` / `MirrorResult` shapes from `src/lib/data/types.ts` are the source of truth; extend only if a field is genuinely missing (e.g. add `id` and `mirror: MirrorResult` — additive, no breaking change).
- `loomClient.reflect / currents / mirror` remain the future-remote path but are NOT called; the flow computes the mirror locally (deterministic, no AI) so SPARK works offline today.
- No changes to `studioStore` schema; `SparkSketch` and `CurrentsReading` keep their own keys (already defined).

## Landing (`/`) — restore the two equal doors

Keep current visual design. Update the two entry cards so both doors read as equal:

- **Enter the SPARK reflection** — "A guided reflective mirror. Recognize patterns in how you create, sense, decide, and move through ideas." → `/spark`
- **Open the Loom workspace** — existing copy → `/modes` (unchanged)

No layout / palette / typography change. Just copy + the SPARK link target.

## Explicitly NOT changing

- Loom side: `/modes`, `/map`, `/workflows`, `/reflections`, `/snapshots`, `/timing`, all their components and copy
- `AuroraField`, palette, fonts, animations
- `mem/index.md` core rules (SPARK is built to satisfy them)
- Scaffolding files added last pass (`src/lib/data/*`, `src/lib/loom/*`, `src/lib/api/loomClient.ts`)

## Verification

- `bunx tsgo --noEmit` passes
- `/` shows two equal doors, both reachable
- `/spark` walks through reflection → currents → mirror end-to-end
- Mirror persists via `dataAdapter.saveSparkSketch` and reloads on refresh
- No forbidden vocab anywhere in SPARK UI (grep before finishing)
- No changes to Loom routes/components (grep + visual check)

Approve and I'll implement.
