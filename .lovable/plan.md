# Add missing Loom module stubs before export

Extend `src/lib/loom/modules.ts` so all 8 modules Codex will wire are visible in the contract. No UI, no routes, no behavior change — submit buttons still show "Awaiting Loom engine — will run when connected."

## Change

**File:** `src/lib/loom/modules.ts` — append three entries to `LOOM_MODULES`.

All three follow the existing shape (`id`, `label`, `blurb`, `status: "stub"`, `inputs[]`) and reuse the existing `LoomModuleInput` kinds (`text`, `longtext`, `select`, `tags`).

### 1. Platform Adapter

Reshape one piece of source material for a specific platform without losing its spine.

- `source` (longtext) — the original piece
- `platform` (select) — newsletter, x/thread, linkedin, instagram, site, talk
- `constraint` (text, optional) — length, tone, or audience note

### 2. Serendipity Lab

Cross-pollinate the current field with an unexpected adjacent domain to find non-obvious moves.

- `field` (longtext) — what you're working on
- `adjacencies` (tags) — domains to borrow from (e.g. cartography, jazz, mycology)

### 3. Creative Operator

Turn a scattered week of creative activity into the next three concrete moves.

- `log` (longtext) — recent work, notes, half-finished threads
- `horizon` (select) — this week, this month, this quarter
- `energy` (select) — low, steady, high

## What does not change

- No UI, no routes, no copy, no palette, no components.
- SPARK flow untouched.
- `loomClient` stubs unchanged — same "Awaiting Loom engine" contract.
- `dataAdapter` unchanged.
- No new dependencies.

## Verify

- `bunx tsgo --noEmit` clean.
- Registry now lists 8 modules in this order: signal-collapse, editorial, personas, launch-packets, platform-adapter, serendipity-lab, creative-operator.
- (The 8th is SPARK deep reflection, which lives in `src/routes/spark.*` — not a Loom module and correctly stays out of the registry.)

## After approval

Once merged, you can export via **+ menu → GitHub → Connect project → Create Repository**, or **Code Editor → Download codebase** for a ZIP. Codex then only has to implement handlers against the endpoints already declared in `src/lib/api/loomClient.ts`.
