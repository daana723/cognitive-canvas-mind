# Merge Indigo Hub's 7-agent constellation over the existing Loom core

Keep everything already built. Layer the Indigo Hub constellation on top as the visible Loom interface, and map the current modules to agents instead of replacing them. Deterministic, local-first, no API calls — with a clean seam Codex can slot into later.

## Demo shape

> "Bring a messy creative intention. Loom reads the thread, lights up the right agents, and returns a structured creative action plan."

Single flow that shows the constellation working end-to-end.

## Preserved as-is

- SPARK: prompts, currents, mirror, radar, store — untouched.
- 2E: assessment, OE radar, results — untouched.
- Existing 7 Loom modules in `src/lib/loom/modules.ts` (signal-collapse, editorial, personas, launch-packets, platform-adapter, serendipity-lab, creative-operator) — kept, not rewritten.
- `dataAdapter` local-first contract and `Result<T>` shape.
- `loomClient` method signatures — implementations get filled in locally; endpoint contract stays the same for Codex.

## New: agent layer over existing modules

### 1. Agent registry — `src/lib/loom/agents.ts`
The 7 Indigo Hub roles: `loom`, `research`, `content`, `product`, `marketing`, `avatar`, `operations`. Each entry: id, label, role, sigil variant, essence, accent color, `moduleIds: string[]` pointing into the existing registry.

Mapping (existing → agent):
- **Loom** (orchestrator) — no modules; owns the weave itself.
- **Research** — `signal-collapse`, `serendipity-lab`
- **Content** — `editorial`, `personas`
- **Product** — `launch-packets`
- **Marketing** — `platform-adapter`
- **Avatar** — (reserved; SPARK deep reflection surfaces here as a link, not a module)
- **Operations** — `creative-operator`

Nothing in `modules.ts` changes. Agents are a view over it.

### 2. Weaving phases — `src/lib/loom/phases.ts`
Ports Indigo Hub's 5 phases verbatim (Intention → Delegation → Return → Automation → Flow). Copy only, used by `/loom` UI.

### 3. Deterministic orchestrator — `src/lib/loom/orchestrator.ts`
Pure function `weave(intention: { body: string; tags?: string[] }): WeavePlan`.

- Tokenizes the intention, matches keywords + optional tags to agent essences.
- Returns `{ agents: AgentId[]; steps: Array<{ agentId; moduleId; why }>; artifacts: string[] }`.
- No LLM, no network. Rules table lives next to the function so it's easy to tune.
- The mapping is intentionally simple and inspectable — this is the "Loom reads the thread" moment in the demo.

### 4. Local execution — `src/lib/loom/execute.ts`
`runModule(moduleId, inputs)` returns a deterministic structured plan for each module (headings + bullet scaffolds derived from inputs). This is the "structured creative action plan" the demo returns. Local-first, no API — Codex swaps this file's implementation later without any UI changes.

### 5. Wire `loomClient` to local core
`src/lib/api/loomClient.ts` keeps its shape but returns `ok(...)` backed by `orchestrator` + `execute` + `LOOM_MODULES`. A single `USE_REMOTE_LOOM` flag (default false) is the seam — when Codex ships, flip it and route through `fetch`. New method: `weave(req)` returning the `WeavePlan`.

### 6. History via `dataAdapter`
Add `saveWeave` / `listWeaves` and `saveModuleRun` / `listModuleRuns` to `src/lib/data/adapter.ts` (localStorage keys `nls:weaves`, `nls:module-runs`). Types added to `src/lib/data/types.ts`.

## New routes

### 7. `src/routes/loom.tsx` — layout
AuroraField + a ported ThreadBackground; `<Outlet />`.

### 8. `src/routes/loom.index.tsx` — Intention entry
Textarea for the messy intention + optional tag chips. On submit → `weave()` → shows: which agents lit up (sigils glowing in order), the phase ribbon, and a "Return the action plan" button that runs each mapped module with defaults and renders the combined plan. Save to history.

### 9. `src/routes/loom.constellation.tsx` — the 7-agent view
Grid of 7 sigils (Loom centered, hero-sized). Each card lists its mapped modules and links to `/loom/$moduleId`. Follows Indigo Hub's constellation layout.

### 10. `src/routes/loom.$moduleId.tsx` — single module runner
Renders inputs from `LoomModule.inputs`, runs `execute.runModule`, displays the structured output, saves to history. Uses `getLoomModule`; 404 via `notFoundComponent`.

### 11. `src/routes/index.tsx` — landing
Third door "Loom" changes copy from "coming" to "the weaving — constellation of 7 agents" and links to `/loom`. SPARK and 2E doors unchanged.

## Visual system port

Recreate two components locally from Indigo Hub (they're TSX; will read via `cross_project--read_project_file` and write into this project):
- `src/components/loom/Sigil.tsx` — 7 sigil variants used by agent cards.
- `src/components/loom/ThreadBackground.tsx` — subtle thread motif behind `/loom`.

Add tokens if missing to `src/styles.css`: `--thread`, `--gradient-veil`. No palette overhaul — additive only.

Copy `loom-hero.jpg` and `faceless-avatar.jpg` from Indigo Hub via `cross_project--copy_project_asset` if not already in `src/assets/`.

## Codex seam

The only file Codex needs to replace to plug in a real backend is `src/lib/loom/execute.ts` (and optionally `orchestrator.ts` if they want LLM-based routing). Everything else — UI, module registry, phases, history — stays. The `loomClient` `USE_REMOTE_LOOM` flag flips the transport without UI churn.

## Verify

- `bunx tsgo --noEmit` clean.
- `/` shows the third door active.
- `/loom` accepts an intention → returns a lit constellation + a combined action plan.
- `/loom/constellation` shows all 7 sigils and links to module runners.
- `/loom/editorial` (and others) runs and displays a structured plan.
- SPARK and 2E flows unchanged.
