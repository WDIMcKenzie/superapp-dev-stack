# Trigger: leak scan

**Say:** `run leak scan` before any public push

```bash
bash scripts/leak-scan.sh
```

If failures: stop push, list files/lines, do not commit secrets.
