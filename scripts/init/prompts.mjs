import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { section, info } from './ui.mjs';

export function createPrompter() {
  return readline.createInterface({ input, output });
}

export async function ask(rl, question, defaultValue = '') {
  const hint = defaultValue ? ` ${'\x1b[2m'}(default: ${defaultValue})\x1b[0m` : '';
  const answer = (await rl.question(`${question}${hint}: `)).trim();
  return answer || defaultValue;
}

export async function askYesNo(rl, question, defaultYes = true) {
  const def = defaultYes ? 'Y/n' : 'y/N';
  const answer = (await rl.question(`${question} [${def}]: `)).trim().toLowerCase();
  if (!answer) return defaultYes;
  return answer === 'y' || answer === 'yes';
}

export async function pickOne(rl, title, options) {
  section(title);
  options.forEach((opt, i) => {
    console.log(`  ${i + 1}) ${opt.label}`);
    if (opt.hint) info(opt.hint);
  });
  while (true) {
    const raw = await rl.question(`\nEnter number (1-${options.length}): `);
    const n = Number.parseInt(raw, 10);
    if (n >= 1 && n <= options.length) return options[n - 1];
    console.log('  Invalid choice — try again.');
  }
}

export async function pickMany(rl, title, options) {
  section(title);
  options.forEach((opt, i) => {
    console.log(`  ${i + 1}) ${opt.label}`);
    if (opt.hint) info(opt.hint);
  });
  console.log('\n  Enter numbers separated by commas (e.g. 1,3) or "all":');
  while (true) {
    const raw = (await rl.question('Choices: ')).trim().toLowerCase();
    if (raw === 'all') return [...options];
    const nums = raw.split(',').map((s) => Number.parseInt(s.trim(), 10));
    if (nums.every((n) => n >= 1 && n <= options.length)) {
      return [...new Set(nums.map((n) => options[n - 1]))];
    }
    console.log('  Invalid — use comma-separated numbers or "all".');
  }
}

export async function askSecret(rl, question) {
  process.stdout.write(`${question} (input hidden, Enter to skip): `);
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;
    if (stdin.isTTY) stdin.setRawMode(true);
    let value = '';
    const onData = (chunk) => {
      const c = chunk.toString();
      if (c === '\n' || c === '\r' || c === '\u0004') {
        if (stdin.isTTY) stdin.setRawMode(wasRaw ?? false);
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(value);
        return;
      }
      if (c === '\u0003') {
        process.stdout.write('\n');
        process.exit(130);
      }
      if (c === '\u007f' || c === '\b') {
        value = value.slice(0, -1);
        return;
      }
      value += c;
    };
    stdin.on('data', onData);
    stdin.resume();
  });
}
