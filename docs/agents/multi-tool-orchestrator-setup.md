# Multi-tool orchestrator setup

How to run the SuperApp **five-specialist team** across Claude, ChatGPT, Gemini,
NotebookLM, and Cursor. You stay in the **orchestrator and architect** seat; each
tool handles a focused lane.

Full team contracts: [`team/agent-index.md`](../../team/agent-index.md) · Paste
[`team/ADAPTER-PROMPT.md`](../../team/ADAPTER-PROMPT.md) into your primary Orchestrator
(Claude) on day one.

## Tool × role map

| SuperApp role | Primary tool | What it does |
|---------------|--------------|--------------|
| **Orchestrator** | **Claude** | Routes work, owns `team/STATE.md` and `team/HANDOFF.md`, session plans |
| **Architect** | **Claude** | Blueprints, data contracts, file trees, STOP gates |
| **Assistant** | **Claude** | Day-to-day follow-ups, clarifications, doc polish |
| **Document designer** | **Claude** | Specs, handbook pages, README/runbooks, blueprint prose |
| **Engineer** | **[Cursor](https://cursor.com/referral?code=DMALHVRLXZPR)** | Code, tests, migrations, git in the repo |
| **Assistant 2** | **ChatGPT** | Shorter coding passes — sanity checks, bugs, “does this diff look right?” |
| **Researcher** | **Gemini** or **NotebookLM** | Web search, source grounding, competitive scans, digest for Orchestrator |
| **Creative** | **Claude, ChatGPT, or Gemini** | Graphics, UI direction, copy, tokens — use whichever is strongest that day |
| **Quality** | **ChatGPT** + **Cursor** | Pre-merge review; ChatGPT for fast review, Cursor for repo-aware fixes |

**Graphics and design** are intentionally shared: all three LLMs can draft layouts,
copy, and visual direction. Pick one per task; send outputs to Orchestrator for a
single HANDOFF to Cursor.

## Process stages

```text
1. Intake      → You + Claude (Orchestrator)
2. Research    → Gemini / NotebookLM (Researcher) → brief back to Orchestrator
3. Blueprint   → Claude (Architect) → §DATA CONTRACT if DB changes
4. Implement   → Cursor (Engineer) → db:validate → tests
5. Quick check → ChatGPT (Assistant 2) → short bug/review pass
6. Design      → Claude / ChatGPT / Gemini (Creative) → optional UI/copy pass
7. Quality     → ChatGPT or Quality specialist → acceptance vs blueprint
8. Ship        → HANDOFF → staging checklist → gated production
```

### Stage 1 — Intake (you + Claude Orchestrator)

1. Open Claude (Projects recommended for long context).
2. Paste [`team/ADAPTER-PROMPT.md`](../../team/ADAPTER-PROMPT.md).
3. Ask: “Where are we?” — Claude reads `team/STATE.md` and `team/HANDOFF.md`.
4. Describe the feature or fix in plain language; Orchestrator assigns a wave.

**Exit:** A one-paragraph HANDOFF or blueprint outline exists.

### Stage 2 — Research (Gemini or NotebookLM)

Use when you need **external** context (competitors, APIs, pricing, docs).

**Gemini**

1. New chat with a focused question and URLs if you have them.
2. Ask for a **digest**: bullets, sources, risks, open questions.
3. Copy the digest into Claude Orchestrator — do not ask Cursor to “research the web”
   unless you have browse tools enabled.

**NotebookLM**

1. Create a notebook; upload PDFs, links, or notes for the topic.
2. Ask for summaries, comparisons, or “what contradicts X?”
3. Export the summary to Orchestrator for blueprint input.

**Exit:** Research digest attached to the Orchestrator thread or saved under
`team/Researcher/` (optional).

### Stage 3 — Blueprint (Claude Architect)

1. Orchestrator (or a dedicated Claude thread) uses
   [`docs/agents/templates/blueprint-template.md`](templates/blueprint-template.md).
2. Include §EXECUTION CONSTRAINTS and §DATA CONTRACT when touching the database.
3. Save the plan under `docs/plans/` in **your app repo** (not required in this
   curriculum repo).

**Exit:** Engineer has a numbered, unambiguous implementation list.

### Stage 4 — Implement (Cursor Engineer)

1. Install [Cursor](https://cursor.com/referral?code=DMALHVRLXZPR); open your project
   folder (`projects/<your-app>/` or copied `template/`).
2. Point Cursor at `team/Engineer/AGENTS.md` and the blueprint section.
3. Run from project root:

   ```bash
   pnpm run db:validate
   pnpm dev
   ```

4. Engineer implements **one blueprint section at a time**; you commit on a feature
   branch.

**Exit:** Tests pass locally; diff matches blueprint scope.

### Stage 5 — Quick check (ChatGPT Assistant 2)

Short session — keep context small.

1. Paste the **diff summary** or error message (not the whole repo).
2. Ask: “What did I miss? Any obvious bugs or security issues?”
3. Send actionable bullets back to Cursor or to Orchestrator if scope changed.

**Exit:** No blocking issues, or a tiny fix list for Cursor.

### Stage 6 — Design (Creative — any of three)

1. Choose Claude, ChatGPT, or Gemini for **graphics, layout, or copy**.
2. Provide: audience, brand adjectives, screenshot or wireframe if you have one.
3. Creative output goes to Orchestrator; Orchestrator writes HANDOFF for Engineer
   (token names, copy strings, Tailwind direction — not vague “make it pretty”).

**Exit:** Implementable design notes in HANDOFF (hex/Tailwind, component names, copy).

### Stage 7 — Quality (pre-merge)

1. Open a PR on `[github]`.
2. ChatGPT: quick pass on description + risk areas.
3. Cursor or Orchestrator: run `pnpm test`, Playwright if configured, `db:validate`.
4. Update `team/STATE.md` — Orchestrator only.

**Exit:** PR ready for human merge; staging deploy only with `--confirm` scripts.

### Stage 8 — Ship (gated)

1. Follow [`docs/00-start-here.md`](../00-start-here.md) Track 3.
2. Use playbooks under `playbooks/hosting/` (GCP, AWS, or Oracle).
3. Run `deploy-staging.sh --confirm` before any production gate.

**Exit:** Staging verified; production only after explicit owner sign-off.

## How to add each tool (first-time setup)

| Tool | Setup steps |
|------|-------------|
| **Claude** | Account + Project; paste `ADAPTER-PROMPT.md`; pin `team/STATE.md` uploads or repo access |
| **ChatGPT** | Account; separate chat per “Assistant 2” / Quality pass; avoid pasting secrets |
| **Gemini** | Google account; use for research chats; link sources in digest |
| **NotebookLM** | Google account; create notebook per product/research topic |
| **Cursor** | Install from [referral link](https://cursor.com/referral?code=DMALHVRLXZPR); open app repo; enable project rules from `.cursorrules` / `CURSOR.md` |

After init wizard:

```bash
pnpm run init
```

Your project copy includes `.superapp/ai/` with tool-specific starter files when you
select them in the wizard.

## Daily loop (minimum viable)

```text
Claude (plan/HANDOFF) → Cursor (build) → ChatGPT (quick check) → PR → staging gate
```

Add Gemini/NotebookLM when the task needs **external** research. Add Creative when
the task needs **UX/copy/visuals**.

## Build your own models (coming soon)

We'll Do It Solutions is preparing a **public track on developing and training your
own models** (when to fine-tune, when to use hosted APIs, data prep, and evaluation).
Watch [welldoit.solutions](https://welldoit.solutions) and this repo for announcements.

Until then, use the hosted stack above — it is enough to ship production apps without
running your own training cluster.

## Related

- [`docs/handbook/03-dual-agent-workflow.md`](../handbook/03-dual-agent-workflow.md)
- [`docs/agents/claude-setup.md`](claude-setup.md)
- [`docs/agents/chatgpt-and-gemini.md`](chatgpt-and-gemini.md)
- [`docs/agents/cursor-setup.md`](cursor-setup.md)
