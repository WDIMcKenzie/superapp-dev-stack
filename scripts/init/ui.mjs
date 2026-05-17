const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

export function banner() {
  console.log(`
${c.cyan}${c.bold}╔══════════════════════════════════════════════════════════╗
║           SuperApp Dev Stack — Setup Wizard              ║
╚══════════════════════════════════════════════════════════╝${c.reset}
${c.dim}Interactive installer for tools, template, database, host, and AI IDE setup.
Secrets stay on your machine — nothing is sent to the network by this script.${c.reset}
`);
}

export function section(title) {
  console.log(`\n${c.bold}${c.blue}── ${title} ──${c.reset}\n`);
}

export function ok(msg) {
  console.log(`  ${c.green}✓${c.reset} ${msg}`);
}

export function warn(msg) {
  console.log(`  ${c.yellow}!${c.reset} ${msg}`);
}

export function fail(msg) {
  console.log(`  ${c.red}✗${c.reset} ${msg}`);
}

export function info(msg) {
  console.log(`  ${c.dim}→${c.reset} ${msg}`);
}

export function box(lines) {
  const width = Math.max(...lines.map((l) => l.length), 40);
  console.log(`  ${c.dim}┌${'─'.repeat(width + 2)}┐${c.reset}`);
  for (const line of lines) {
    console.log(`  ${c.dim}│${c.reset} ${line.padEnd(width)} ${c.dim}│${c.reset}`);
  }
  console.log(`  ${c.dim}└${'─'.repeat(width + 2)}┘${c.reset}`);
}
