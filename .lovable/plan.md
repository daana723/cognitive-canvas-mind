# Frontend Scaffolding — Types + Adapter + Loom Client

Keep every existing route, component, style, and copy exactly as-is. Add only the five scaffolding files agreed with Codex. Framework-agnostic core + local-first split is deferred to a later pass.

## Files added (only these)

1. **`src/lib/data/types.ts`** — stable contracts
   - `ModeId`, `PhaseId`, `CurrentId`
   - `SparkSketch { motifs, modeAffinities, currentHeat?, takenAt, version: 1 }`
   - `CurrentsReading { values, takenAt }`
   - `MirrorResult { motifs, suggestedModes, note? }`
   - `LoomModule { id, label, blurb, status, inputs }`
   - `Result<T> = { ok: true; data: T } | { ok: false; reason: "unavailable"; message: string }`

2. **`src/lib/loom/modules.ts`** — static registry of the four Loom modules
   (signal-collapse, editorial, personas, launch-packets) with label, blurb,
   `status: "stub"`, and typed `inputs`. Data only, no behavior.

3. **`src/lib/loom/workflows.ts`** — thin re-export of the existing
   `WORKFLOWS` from `src/lib/modes/workflows.ts`, typed against `ModeId`
   from `data/types.ts`. No duplication of content.

4. **`src/lib/data/adapter.ts`** — `DataAdapter` interface + default local
   implementation backed by the existing `studioStore` (unchanged):
   - `getSparkSketch` / `saveSparkSketch`
   - `getCurrents` / `saveCurrents`
   - `getLoomState` / `saveLoomState`
   Also exports a `remoteAdapter` stub whose methods all return
   `{ ok: false, reason: "unavailable", message: "Backend not connected" }`.
   Default export = local adapter.

5. **`src/lib/api/loomClient.ts`** — thin fetch wrappers for the six agreed
   endpoints. Until Codex ships, every method returns
   `{ ok: false, reason: "unavailable", message: "Awaiting Loom engine — will run when connected." }`.
   - `GET  /api/loom/modules`
   - `GET  /api/loom/workflows`
   - `POST /api/loom/run`
   - `POST /api/spark/reflect`
   - `POST /api/spark/currents`
   - `POST /api/spark/mirror`

## Not touched

- All routes (`/`, `/modes`, `/map`, `/workflows`, `/reflections`, `/snapshots`, `/timing`)
- All components (Mode cards, AuroraField, PhaseRibbon, NarrativeMap, ReflectionEditor, SnapshotList, WorkflowTemplate)
- `src/lib/modes/*`, `src/lib/studio/store.ts`, `src/styles.css`, `__root.tsx`, `mem/index.md`
- No visual, layout, route, or copy change

## Explicitly deferred (next pass, on your signal)

- Framework-agnostic split into `src/lib/core/**` (pure) + `src/lib/adapters/**` (side effects)
- Wiring adapters/clients into existing UI (additive only)
- Remote sync, login, AI adapters — all opt-in later
- Backend endpoint implementations — Codex

## Verification

- `tsgo` passes.
- `/` renders identically.
- `dataAdapter.getLoomState()` returns local values from `studioStore`.
- `loomClient.listModules()` returns the unavailable result.

Approve and I'll add exactly these five files.
