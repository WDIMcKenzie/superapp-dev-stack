# Starter prompt — Deploy to staging

---

Act as **Orchestrator**. I want a **staging** deploy for `{{PROJECT_PATH}}/` using host playbook `{{HOST_ID}}`.

1. List human approval gates (DNS, secrets, production traffic).
2. Produce a numbered checklist with location tags: `[local-tree]`, `[github]`, `[-stage env]`.
3. Do **not** run production commands — wait for my explicit "go" on each gate.

Current stack: Next.js web + API + database per `.superapp/profile.json`.
