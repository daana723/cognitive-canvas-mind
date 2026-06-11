# Repositioning: Cognitive Layer → Creative Cognition Studio

A significant pivot. The current app frames itself as a SPARK assessment + Dąbrowski-derived Intensities + 2E pattern reading. Per the new direction, **none of that psychological scaffolding can remain on the surface**. The product becomes a symbolic, user-selected creative-mode navigator — never an assessor.

## Principles (binding)

- Nothing is inferred about the user. Everything is user-chosen.
- No psychology, mental health, traits, symptoms, Dąbrowski, OE, 2E, intensities, developmental levels.
- Categories are symbolic and metaphorical (Flux / Depth / Signal / Myth / Pulse).
- The system organizes **ideas, projects, creative states** — never the person.
- Assessment-style language (score, dimension, archetype-as-identity, diagnostic verbs) is replaced with exploratory language (notice, try, sketch, choose).

## New information architecture

```text
/                     Home — "a studio for nonlinear thinkers"
/modes                Creative Modes Selector (Flux / Depth / Signal / Myth / Pulse)
/map                  Narrative Mapping — user describes current creative state
/workflows            Workflow Clarity — templates per chosen mode
/reflections          Reflection Space — user notes, zero interpretation
/snapshots            Mode Snapshots — saved mode + notes + phase
/timing  (optional)   Symbolic Timing Cues — metaphor only, framed as such
/explore (optional)   The old SPARK flow, re-skinned as an *optional symbolic prompt deck* —
                      pure narrative reflection, no scoring surfaced, no "your profile"
```

The five SPARK archetypes survive **only** as symbolic illustrations for the five Creative Modes (one image per mode). The archetype generator code, scoring, translation, intensities, 2E analysis, pattern engine, and profile readout are removed from the user-facing flow.

## Removals (UI + routing)

Delete routes: `/assessment`, `/intensities`, `/profile`, `/toolkit`, current `/map`.

Delete or quarantine modules (move under `src/lib/_legacy/` if we want to keep code around for reference, otherwise delete):
- `src/lib/spark/` (questions, scoring, translation, dimensions)
- `src/lib/intensities/`
- `src/lib/twoe/`
- `src/lib/patterns/`
- `src/lib/state-machine/assessment-machine.ts`
- `src/components/assessment/`, `src/components/intensities/`, `src/components/profile/`, `src/components/toolkit/`

Recommendation: **delete**, since they carry the framing we're moving away from. The archetype illustrations are reused under new (symbolic-mode) names.

## New modules

```text
src/lib/modes/
  modes.ts              5 creative modes (id, label, essence, color, image, prompts)
  phases.ts             4 narrative phases (Initiation / Expansion / Integration / Synthesis)
  workflows.ts          Templates keyed by mode (checklists, prompt scaffolds, session shapes)
  timing.ts             Symbolic timing cues (metaphorical, clearly flagged)

src/lib/studio/
  store.ts              Local-first store: snapshots, reflections, current mode, current phase

src/components/modes/
  ModeCard.tsx          One card per mode with image + essence + "Enter this mode"
  ModeSelector.tsx      Grid of all five
  PhaseRibbon.tsx       Phase indicator the user sets manually

src/components/studio/
  NarrativeMap.tsx      Free-form mapping canvas (text-first; nodes = ideas, edges = links)
  WorkflowTemplate.tsx  Renders a chosen template
  ReflectionEditor.tsx  Plain notes; no interpretation
  SnapshotList.tsx      Saved snapshots
```

## Routes

- `/` — landing reframed: "a studio for nonlinear thinkers." Three doors: *Pick a mode*, *Map your state*, *Open a workflow*. No mention of assessment.
- `/modes` — Mode selector. Choosing a mode sets it as current in local store.
- `/map` — Narrative Mapping. User types what they're working on; the system reflects their words back, never analyzes.
- `/workflows` — Lists templates for the current mode; user opens one.
- `/reflections` — Append-only notes journal.
- `/snapshots` — Saved {mode, phase, note, timestamp}.
- `/timing` (deferred / optional) — Symbolic cues with explicit "metaphor, not prediction" framing.

## Asset reuse

- `weaver.jpg` → **Myth Mode**
- `deepwell.jpg` → **Depth Mode**
- `tuner.jpg` → **Signal Mode**
- `cartographer.jpg` → **Flux Mode**
- `ember.jpg` → **Pulse Mode**

`loom-hero.jpg` and `AuroraField` stay; they're atmosphere, not framing.

## Language rules (applied everywhere)

| Replace                          | With                                  |
|----------------------------------|---------------------------------------|
| Assessment, reflection (as test) | Studio, mapping, sketch               |
| Score, dimension, profile        | Mode, phase, snapshot                 |
| Archetype (as identity)          | Symbolic mode (chosen)                |
| Intensities, OEs, 2E             | (removed entirely)                    |
| "Your signature", "you are…"     | "What you're working on", "you chose" |
| Recommendation                   | Template, prompt, experiment          |

## What I will NOT do without confirmation

- Build the `/timing` symbolic-astrology layer. Flagging as optional; I'll stub the route with a "coming next" panel and confirm before fleshing out.
- Touch the `Indigo Hub` / `Loom` cross-project code. I'll only mirror their **aesthetic** (atmospheric, mythic-tech). If you want actual component reuse from those projects, point me at them with `@mention` and I'll cross-import.
- Keep any legacy `/profile` redirect that surfaces old data. Old local-store data will be ignored (new `studioStore` namespace).

## Build order

1. New `src/lib/modes/` + `src/lib/studio/store.ts`.
2. New components (ModeCard, ModeSelector, PhaseRibbon, NarrativeMap, WorkflowTemplate, ReflectionEditor, SnapshotList).
3. New routes (`/`, `/modes`, `/map`, `/workflows`, `/reflections`, `/snapshots`) and stub `/timing`.
4. Delete legacy routes + components + libs.
5. Verify build, check the preview.

Approve and I'll execute the whole pivot in one pass.
