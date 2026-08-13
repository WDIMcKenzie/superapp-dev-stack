# Blueprint: Stripe + Autonomous Business OS with Permission Escalation

**ID:** BP-STRIPE-BUSINESS-OS  
**Owner:** Orchestrator  
**Engineer:** Cursor  
**Status:** Draft (requires Phase 1 validation)  
**Phases:** 4 (Stripe → Business OS → Agent Runtime → Permission System)

---

## §GOAL

Build a complete business operations system that:
1. **Integrates Stripe** as the payment backbone via adapters (not hard-coded SDK calls)
2. **Provides unified Business OS UI/UX** (Rubric/Hermex/OpenClaw/Jarvis aesthetic) — single dashboard for all business operations
3. **Runs autonomous agents** with browser-like + computer-use IDE capabilities (can execute business tasks end-to-end)
4. **Enforces permission tiers** — from supervised (human approval per action) → autonomous (agent runs full business with audit trail) → unrestricted (with explicit user opt-in + disclaimer)

Users can configure their risk tolerance once; agents operate within declared boundaries.

---

## §SCOPE

### In Scope

- **Stripe integration layer** — payment events, subscriptions, webhooks, customer sync
- **Business OS UI system** — dashboard, settings, audit logs, permission dashboard
- **Autonomous agent runtime** — task scheduling, computer-use capabilities, API orchestration
- **Permission escalation model** — 4 tiers with role-based action classes
- **Audit trail & recovery** — comprehensive logging; snapshot/rollback capability for destructive actions
- **Deployment** — staging validation required before production autonomous mode

### Out of Scope

- **Stripe SDK documentation** (use official Stripe docs; we build adapters over it)
- **Specific business logic** (accounting, fulfillment, etc.) — templates only
- **Custom ML training** (agents use existing LLM APIs)
- **Multi-tenant isolation** — single-business-per-deployment (separate projects for multi-tenancy)

---

## §ARCHITECTURE LAYERS

### Layer 1: Stripe Adapter (`integrations/stripe/`)

Stripe becomes one third-party connector alongside others (plugins, MCP, etc.).

```
integrations/stripe/
├── README.md
├── package.json
├── src/
│   ├── index.ts                    # Public exports
│   ├── adapter.ts                  # @superapp/data-compatible adapter
│   ├── webhook/
│   │   ├── handler.ts              # Webhook router
│   │   ├── events/
│   │   │   ├── customer.webhook.ts
│   │   │   ├── payment_intent.webhook.ts
│   │   │   ├── subscription.webhook.ts
│   │   │   └── invoice.webhook.ts
│   │   └── signature-verify.ts
│   ├── services/
│   │   ├── customer.service.ts
│   │   ├── payment.service.ts
│   │   ├── subscription.service.ts
│   │   └── billing.service.ts
│   ├── types/
│   │   ├── stripe-events.ts
│   │   ├── stripe-schema.ts        # Zod validation
│   │   └── business-events.ts      # Mapped to app domain
│   └── env.ts                      # STRIPE_* validation
├── migrations/
│   └── 01-stripe-tables.sql        # Idempotent schema
└── tests/
    ├── webhook.test.ts
    ├── services.test.ts
    └── adapter.test.ts
```

**Key rule:** No direct `stripe.charges.create()` in app code. All Stripe calls go through `integrations/stripe/services/`.

### Layer 2: Business OS UI (`packages/business-os/`)

Unified dashboard for business operations (payment, subscriptions, audit, agent control).

```
packages/business-os/
├── README.md
├── package.json
├── src/
│   ├── index.ts
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── DashboardShell.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── index.ts
│   │   ├── Payments/
│   │   │   ├── PaymentsList.tsx
│   │   │   ├── PaymentDetail.tsx
│   │   │   ├── InvoiceViewer.tsx
│   │   │   └── index.ts
│   │   ├── Subscriptions/
│   │   │   ├── SubscriptionManager.tsx
│   │   │   ├── PlanSelector.tsx
│   │   │   └── index.ts
│   │   ├── Permissions/
│   │   │   ├── PermissionDashboard.tsx     # View/edit agent permission tiers
│   │   │   ├── RiskAssessment.tsx          # Shows what agent can do at each tier
│   │   │   ├── ApprovalQueue.tsx           # Pending high-risk actions
│   │   │   └── index.ts
│   │   ├── AuditLog/
│   │   │   ├── AuditViewer.tsx
│   │   │   ├── ActionTimeline.tsx
│   │   │   ├── RollbackDialog.tsx          # Undo destructive actions
│   │   │   └── index.ts
│   │   ├── AgentControl/
│   │   │   ├── AgentStatus.tsx             # Is agent running? In what mode?
│   │   │   ├── TaskQueue.tsx               # Upcoming scheduled tasks
│   │   │   ├── EmergencyStop.tsx           # Pause agent
│   │   │   └── index.ts
│   │   └── Common/
│   │       ├── Layout.tsx
│   │       ├── Sidebar.tsx
│   │       └── TopBar.tsx
│   ├── hooks/
│   │   ├── usePermissionMode.ts
│   │   ├── useAuditLog.ts
│   │   ├── useAgentStatus.ts
│   │   └── usePaymentData.ts
│   ├── theme/
│   │   ├── colors.ts                # Unified palette (Rubric-like aesthetic)
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── risk-classifier.ts       # Action → risk level
│   │   └── format.ts
│   └── styles/
│       └── globals.css
└── tests/
    └── components.test.tsx
```

### Layer 3: Autonomous Agent Runtime (`packages/agent-runtime/`)

Coordinates task execution, computer-use capabilities, permission gating.

```
packages/agent-runtime/
├── README.md
├── package.json
├── src/
│   ├── index.ts
│   ├── core/
│   │   ├── agent.ts                # Main orchestrator
│   │   ├── task-queue.ts           # Scheduled/queued work
│   │   ├── action-executor.ts      # Runs actions within permission boundaries
│   │   └── computer-use/
│   │       ├── browser.ts          # Headless browser control
│   │       ├── api-call.ts         # HTTP orchestration
│   │       ├── file-system.ts      # Safe fs operations
│   │       └── capabilities.ts     # Declares what agent CAN do
│   ├── permissions/
│   │   ├── model.ts                # Permission tier definition
│   │   ├── evaluator.ts            # Checks action against tier
│   │   ├── tiers.ts                # SUPERVISED, AUTONOMOUS, UNRESTRICTED
│   │   └── disclaimer.ts           # Legal/risk waiver for UNRESTRICTED
│   ├── audit/
│   │   ├── logger.ts               # Immutable action log
│   │   ├── snapshot.ts             # State before/after action
│   │   └── rollback.ts             # Undo capability
│   ├── scheduler/
│   │   ├── cron.ts                 # Recurring tasks
│   │   └── trigger.ts              # Event-driven execution
│   └── integrations/
│       ├── stripe-sync.ts          # Sync customer/payment state
│       ├── notify.ts               # Alert user of pending approval
│       └── llm-client.ts           # Call Claude/GPT for decision-making
├── migrations/
│   └── 01-agent-tables.sql         # Task queue, audit log, snapshots
└── tests/
    ├── executor.test.ts
    ├── permissions.test.ts
    └── audit.test.ts
```

### Layer 4: Permission System (Core Logic)

Embedded in `packages/agent-runtime/permissions/`, enforced at action execution time.

```
Permission Tiers:

┌─────────────────────────────────────────────────────────────┐
│ TIER 1: SUPERVISED (Default, safest)                        │
├─────────────────────────────────────────────────────────────┤
│ • Agent suggests action                                      │
│ • Waits for human approval before executing                 │
│ • Examples: Charge customer, refund, delete invoice         │
│ • Good for: Learning, sensitive operations                  │
│ • Risk: Human delay; higher overhead                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TIER 2: AUTONOMOUS (Moderate, balanced)                     │
├─────────────────────────────────────────────────────────────┤
│ • Agent executes low-risk actions (< $X limit, standard)    │
│ • Agent escalates high-risk actions to TIER 1 approval      │
│ • Examples:                                                  │
│   - Auto-charge: ✓ (if < $1000 & subscription-renewal)     │
│   - Refund: ✗ (escalates; human approves)                   │
│   - Send invoice: ✓                                         │
│   - Change billing email: ✓ (notifies customer)             │
│ • Good for: Production operations, high-frequency tasks     │
│ • Risk: Moderate; audit trail is critical                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TIER 3: UNRESTRICTED (Dangerous, explicit opt-in only)      │
├─────────────────────────────────────────────────────────────┤
│ • Agent executes ANY action without human gate              │
│ • Full autonomy: delete customers, refund, change config    │
│ • Requires:                                                  │
│   1. User opts in explicitly via UI modal                    │
│   2. User acknowledges legal disclaimer:                     │
│      "Agent can modify system config, delete data,           │
│       transfer funds, or corrupt/delete entire system.       │
│       You accept full liability for these actions."          │
│   3. Must re-confirm every 30 days                          │
│ • Good for: Fully automated business (minimal human touch)   │
│ • Risk: Extreme; any bug = total loss                        │
│ • Audit trail still 100% (for forensics/recovery)           │
└─────────────────────────────────────────────────────────────┘

How Agent Evaluates Action:

  User asks agent to do X
        ↓
  Agent looks up permission_mode = TIER 2 (AUTONOMOUS)
        ↓
  Agent classifies X as risk_level = HIGH (refund)
        ↓
  Risk level > permission tier?
        ├─ YES (HIGH > AUTONOMOUS) → Escalate to SUPERVISED
        │                             Notify user, wait for approval
        └─ NO (PROCESS < AUTONOMOUS) → Execute immediately
                                        Log action, continue
```

---

## §DATA CONTRACT

### Stripe Event Tables

Created via `integrations/stripe/migrations/01-stripe-tables.sql`:

```sql
-- Core Stripe data (synced bidirectionally)
CREATE TABLE stripe_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_id TEXT UNIQUE NOT NULL,
  app_user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL REFERENCES stripe_customers(stripe_id),
  product_id TEXT NOT NULL,
  price_id TEXT NOT NULL,
  status TEXT NOT NULL,  -- active, past_due, canceled, etc.
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE stripe_payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL REFERENCES stripe_customers(stripe_id),
  amount_cents BIGINT NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,  -- succeeded, requires_action, etc.
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE stripe_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL REFERENCES stripe_customers(stripe_id),
  stripe_subscription_id TEXT REFERENCES stripe_subscriptions(stripe_id),
  amount_due BIGINT,
  amount_paid BIGINT,
  status TEXT NOT NULL,
  pdf_url TEXT,
  hosted_invoice_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Webhook audit trail
CREATE TABLE stripe_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### Agent Runtime Tables

Created via `packages/agent-runtime/migrations/01-agent-tables.sql`:

```sql
-- Permission configuration per user/deployment
CREATE TABLE agent_permission_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  tier TEXT NOT NULL,  -- SUPERVISED, AUTONOMOUS, UNRESTRICTED
  thresholds JSONB,  -- e.g., {"refund_max_cents": 5000, "daily_charge_limit_cents": 100000}
  unrestricted_confirmed_at TIMESTAMP,  -- When user last opted into UNRESTRICTED
  unrestricted_confirm_required_at TIMESTAMP,  -- Re-confirm deadline (30 days)
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Immutable audit trail: every action agent attempts
CREATE TABLE agent_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  action_type TEXT NOT NULL,  -- charge, refund, delete_customer, etc.
  action_class TEXT NOT NULL,  -- business, system, destructive
  risk_level TEXT NOT NULL,    -- LOW, MEDIUM, HIGH, CRITICAL
  requested_by TEXT,  -- user email or 'agent'
  permission_tier TEXT NOT NULL,  -- What tier was active?
  permission_granted BOOLEAN NOT NULL,
  reason TEXT,  -- Why approved/denied
  input_data JSONB NOT NULL,
  result JSONB,  -- Success? Error? New state?
  snapshot_id UUID REFERENCES agent_snapshots(id),  -- Link to state before
  executed_at TIMESTAMP DEFAULT now()
);

-- State snapshots: system state before/after destructive action
CREATE TABLE agent_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  action_id UUID REFERENCES agent_audit_log(id),
  state_type TEXT NOT NULL,  -- before, after
  entity_type TEXT NOT NULL,  -- customer, subscription, payment, etc.
  entity_id TEXT NOT NULL,
  state_data JSONB NOT NULL,  -- Full object state
  created_at TIMESTAMP DEFAULT now()
);

-- Task queue: scheduled/pending agent work
CREATE TABLE agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  task_type TEXT NOT NULL,  -- sync_stripe, process_invoices, check_subscriptions
  status TEXT NOT NULL,  -- pending, running, completed, failed
  scheduled_for TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  parameters JSONB,
  result JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Approval queue: actions waiting for human confirmation
CREATE TABLE agent_approvals_pending (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  audit_log_id UUID UNIQUE REFERENCES agent_audit_log(id),
  action_summary TEXT NOT NULL,  -- "Refund $45.00 to customer john@example.com"
  risk_explanation TEXT,
  action_details JSONB,
  expires_at TIMESTAMP,  -- Auto-deny if not approved in time
  approved_by TEXT,
  approved_at TIMESTAMP,
  denied_at TIMESTAMP,
  denial_reason TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### Environment Variables

Add to data contract (`docs/databases/00-data-contract.md`):

```bash
# Stripe integration
STRIPE_API_KEY=sk_...
STRIPE_PUBLIC_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_IDEMPOTENCY_KEY_PREFIX={{APP}}_

# Agent runtime
AGENT_PERMISSION_TIER=SUPERVISED          # SUPERVISED | AUTONOMOUS | UNRESTRICTED
AGENT_TASK_INTERVAL_SECONDS=300           # How often to check task queue
AGENT_APPROVAL_TIMEOUT_MINUTES=60         # Auto-deny if not approved
AGENT_ENABLE_COMPUTER_USE=true            # Allow browser/file access
AGENT_LOG_RETENTION_DAYS=90               # How long to keep audit trail
AGENT_SNAPSHOT_ON_RISK_LEVEL=HIGH         # Create before/after snapshots for HIGH+ risk
```

---

## §FILE TREE

### New Packages/Integrations

```
integrations/stripe/                    # Stripe adapter
packages/business-os/                   # Unified UI dashboard
packages/agent-runtime/                 # Autonomous task execution + permissions
services/agent-api/                     # API for agent → task queue, approvals
docs/agent-runtime/                     # Agent runtime playbook + architecture
docs/permission-model/                  # Permission tier deep-dive
```

### Modified Files

```
docs/databases/00-data-contract.md           # Add STRIPE_* + AGENT_* env vars
docs/handbook/06-user-branches-and-deploy-governance.md  # Add: agent-runtime deploy gates
team/STATE.md                                # Reflects active Stripe + agent config
integrations/                                # Create if missing
```

### Integration Points

```
services/api/src/routes/
├── webhook.ts                           # POST /stripe/webhook
├── agent-control.ts                     # GET/POST /agent/* (status, pause, settings)
└── payments.ts                          # GET /payments, /subscriptions

apps/web-local/src/pages/
├── dashboard/
│   ├── index.tsx                        # Main dashboard (Business OS shell)
│   ├── payments.tsx                     # Payment history
│   ├── subscriptions.tsx                # Subscription manager
│   ├── audit-log.tsx                    # Agent audit log + rollback
│   └── agent-settings.tsx               # Permission tier configuration
```

---

## §EXECUTION CONSTRAINTS

### Stripe Adapter

1. **No inline SDK calls** — all Stripe API calls via `integrations/stripe/services/`
2. **Webhook verification** — `signature-verify.ts` validates HMAC before processing
3. **Idempotency** — `STRIPE_IDEMPOTENCY_KEY_PREFIX` prevents duplicate charges
4. **Event deduplication** — `stripe_webhooks.event_id` is UNIQUE; prevents double-processing
5. **Adapter pattern** — exports conform to `@superapp/data` interface (optional; can be standalone first)

### Business OS UI

1. **No hardcoded values** — all settings from database + env
2. **Real-time sync** — payment state syncs with Stripe via webhook handler
3. **Mobile-responsive** — works on desktop + tablet (agent control interface can be minimal)
4. **Accessibility** — WCAG 2.1 AA (critical for operator approval queue)

### Autonomous Agent Runtime

1. **Permission check before every action** — no exceptions
2. **Audit logging** — every attempt (approved/denied) logged immutably
3. **State snapshots** — before/after for any action at risk level ≥ HIGH
4. **Approval workflow** — SUPERVISED/escalated actions create `agent_approvals_pending` rows; block execution until approved
5. **Disclaimer enforcement** — UNRESTRICTED tier requires explicit user modal + re-confirmation every 30 days
6. **Emergency stop** — agent respects immediate `pause_agent` flag; stops scheduling new work
7. **No side effects in permissions layer** — evaluator is read-only; execution layer applies verdict

### Computer-Use Capabilities

1. **Headless browser** — Puppeteer or Playwright; limited to app domains + pre-approved external APIs
2. **API call** — orchestrates HTTP calls; respects rate limits; no hardcoded secrets in calls
3. **File system** — read-only by default; write only to designated temp/output folders
4. **Capabilities declare intent** — `packages/agent-runtime/core/computer-use/capabilities.ts` lists what agent CAN do (e.g., "can use Stripe API", "can check email", "cannot access /etc")

### Destructive Action Handling

Actions classified as HIGH/CRITICAL risk:
- **Refund** (any amount)
- **Delete customer**
- **Cancel subscription**
- **Modify config** (billing email, webhook secret, etc.)
- **Write to database** (beyond append-only logs)

Flow:
1. Agent evaluates action
2. Checks permission tier vs. risk level
3. If mismatch → create `agent_approvals_pending` row + notify user via email + in-app alert
4. Block execution; return "awaiting approval" to user
5. Once approved via UI, log approval, then execute
6. Log result in audit trail with snapshot references

---

## §VERIFICATION

### Phase 1 (Stripe Adapter)
- [ ] `pnpm run db:validate` passes (Stripe tables created)
- [ ] Webhook handler test passes (mock Stripe events)
- [ ] Adapter exports match `integrations/stripe/README.md` spec
- [ ] Manual: POST to `/stripe/webhook` with test event; verify logged in `stripe_webhooks`

### Phase 2 (Business OS UI)
- [ ] All dashboard routes render without errors
- [ ] Payment/subscription data displays correctly
- [ ] Permission settings UI loads + saves to `agent_permission_settings`
- [ ] Manual: Change permission tier; confirm UI reflects change

### Phase 3 (Agent Runtime)
- [ ] `pnpm run db:validate` passes (agent tables created)
- [ ] `packages/agent-runtime/` exports core API
- [ ] Permission evaluator test: action + tier → decision is correct
- [ ] Audit logger test: action logged immutably + snapshot created for HIGH-risk

### Phase 4 (Permission Escalation)
- [ ] SUPERVISED tier: agent creates approval, blocks execution, user approves, then executes
- [ ] AUTONOMOUS tier: LOW/MEDIUM risk actions execute immediately; HIGH risk escalates
- [ ] UNRESTRICTED tier: all actions execute; user opted in explicitly; disclaimer confirmed
- [ ] Manual: Trigger a refund request at each tier; verify behavior matches model

### Integration

- [ ] `services/api` routes (webhook, agent-control, payments) all pass tests
- [ ] `apps/web-local` dashboard pages load; data syncs in real-time
- [ ] Agent task queue processes; scheduled tasks run at interval
- [ ] `pnpm test` (full suite) passes
- [ ] Deploy staging: full workflow test (charge → refund → audit log check)

---

## §STOP GATES

### Staging Deploy (requires human go-ahead)

```bash
# Before running: verify Stripe test/live keys are correct
echo "Review agent_permission_settings:"
SELECT * FROM agent_permission_settings;

# Check audit log has baseline (no unexpected actions)
echo "Verify audit log is clean:"
SELECT COUNT(*) FROM agent_audit_log WHERE created_at > now() - INTERVAL '1 hour';
# Should be near-zero before deploy

# Confirm approval queue is empty (no pending high-risk actions)
echo "Confirm no stuck approvals:"
SELECT * FROM agent_approvals_pending WHERE status = 'pending';

# Run this BEFORE deploy:
pnpm run db:validate && pnpm test
```

**Gate:** Deploy operator must manually run:
```bash
bash scripts/ops/deploy-staging.sh --confirm
```

### Production Deploy (hard gate + disclaimer)

1. **Audit trail review** — at least 7 days of staging history clean (no repeated errors)
2. **Permission tier lock-in** — confirm `AGENT_PERMISSION_TIER` is intentional (not default SUPERVISED)
3. **Stripe keys audit** — production Stripe keys verified, not test keys
4. **Backup before UNRESTRICTED** — if deploying UNRESTRICTED tier, backup database first
5. **User acknowledgment** — if UNRESTRICTED, user has accepted disclaimer in UI (verified via `unrestricted_confirmed_at`)

**Command:**
```bash
bash scripts/ops/deploy-prod.sh --confirm --permission-tier $AGENT_PERMISSION_TIER
```

**Operator must confirm in stdout:**
```
⚠️  PERMISSION TIER: UNRESTRICTED (unrestricted!)
    Deployed agent will execute ANY action without human approval.
    Risks: data loss, system compromise, financial loss.
    
    User must have explicitly opted in:
    SELECT unrestricted_confirmed_at FROM agent_permission_settings 
    WHERE app_id = '...' AND tier = 'UNRESTRICTED';

    Type "yes, deploy unrestricted" to continue:
```

---

## §ROLLOUT PHASES

### Phase 1: Stripe Adapter (Week 1)
- [ ] Create `integrations/stripe/` structure
- [ ] Implement webhook handler + event types
- [ ] Implement customer/payment/subscription services
- [ ] Write tests; validate locally
- [ ] **Gate:** Merge to `develop` only after PR review + tests green

### Phase 2: Business OS UI (Week 2)
- [ ] Create `packages/business-os/` + theme
- [ ] Build dashboard shell + layout
- [ ] Implement Payment, Subscription, Audit viewers
- [ ] Implement Permission settings UI
- [ ] Wire to backend APIs
- [ ] **Gate:** Staging validation only; no data mutations in staging

### Phase 3: Agent Runtime (Week 3)
- [ ] Create `packages/agent-runtime/` core structure
- [ ] Implement permission evaluator + tiers
- [ ] Implement audit logger + snapshots
- [ ] Implement task queue + scheduler
- [ ] Implement approval workflow
- [ ] **Gate:** Full test suite passes; approval queue tested end-to-end

### Phase 4: Computer-Use + Production (Week 4)
- [ ] Implement headless browser + API orchestration
- [ ] Implement rollback capability
- [ ] Integrate with LLM client (Claude/GPT)
- [ ] Final integration tests
- [ ] Staging validation: full business workflow
- [ ] **Gate:** Operator approval + user disclaimer acknowledged before prod deploy

---

## §RELATED DOCS

- `docs/databases/00-data-contract.md` — add STRIPE_* + AGENT_* env vars
- `docs/handbook/06-user-branches-and-deploy-governance.md` — agent-runtime deploy gates
- `docs/agents/multi-tool-orchestrator-setup.md` — how to ask agent to manage Stripe/permissions
- `integrations/stripe/README.md` (to create) — Stripe adapter user guide
- `packages/agent-runtime/README.md` (to create) — Agent runtime architecture + usage
- `docs/permission-model/01-tiers-and-escalation.md` (to create) — Deep-dive on permission system
- `docs/permission-model/02-risk-classification.md` (to create) — How actions map to risk levels

---

## §HANDOFF

**Next Orchestrator session:**

1. Validate this blueprint with Engineer (Cursor)
2. Confirm Phase 1 scope (Stripe adapter only) is clear
3. Break Phase 1 into specific feature tasks if needed
4. Update `team/STATE.md` with active work
5. Prepare Engineer brief (`team/HANDOFF.md`)

**For Engineer (Cursor):**

- Stripe adapter is first; no UI or agent runtime yet
- Start with webhook handler (most critical)
- Implement services after webhook validation
- All via `integrations/stripe/`; do NOT add to `services/api` or `apps/` until Phase 2

**For User (WDIMcKenzie):**

Confirm before Phase 1 starts:
- [ ] Permission tier model matches your vision
- [ ] Disclaimer text acceptable (we can customize)
- [ ] AUTONOMOUS tier thresholds reasonable (can adjust)
- [ ] Stripe webhook domain/URL ready
- [ ] Any third-party integrations besides Stripe planned? (Plan them now; affects adapter pattern)

---

**Status:** Ready for Phase 1 Engineer brief.

