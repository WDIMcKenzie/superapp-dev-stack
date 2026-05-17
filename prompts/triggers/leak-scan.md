# Trigger: leak scan

**Say:** `run leak scan` before any public push

```bash
bash scripts/leak-scan.sh
```

Optional: maintain a **gitignored** `scripts/leak-scan.patterns` (copy from
`scripts/leak-scan.patterns.example`) for your org’s hostnames — never commit
real internal names to this public curriculum repo.

If failures: stop push, list files/lines, do not commit secrets.
