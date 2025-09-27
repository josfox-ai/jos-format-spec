#!/usr/bin/env node
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';
import { spawn } from 'node:child_process';

import { validate } from '../lib/validate.js';
import { resolveJos } from '../lib/resolve.js';
import { run } from '../lib/run.js';
import { serve } from '../lib/serve.js';

function writeJSON(p, data){ fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8'); }

function getExtForShell(shell) {
  if (!shell) return '.sh';
  const s = shell.toLowerCase();
  if (s.includes('bash') || s.includes('sh')) return '.sh';
  if (s.includes('zsh')) return '.sh';
  if (s.includes('python')) return '.py';
  if (s.includes('node')) return '.js';
  return '.sh';
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return await new Promise(resolve => {
    rl.question(question, ans => { rl.close(); resolve(/^y(es)?$/i.test(ans.trim())); });
  });
}

function materializeBodyToFile(doc, { keep=false } = {}) {
  if (!doc?.script?.body || doc?.script?.file) return null;
  const ext = getExtForShell(doc.script.shell);
  const base = (doc.name || 'jos_task').replace(/[^\w.-]+/g, '_');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jos-'));
  const filePath = path.join(tmpDir, `${base}${ext}`);
  const shebang = doc.script.shell && doc.script.shell.startsWith('/') ? `#!${doc.script.shell}\n` : '';
  fs.writeFileSync(filePath, `${shebang}${doc.script.body}`, { encoding: 'utf8', mode: 0o755 });
  // Inyectar para que aguas abajo se use file
  doc.script.file = filePath;
  if (!keep) {
    process.on('exit', () => { try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {} });
    process.on('SIGINT', () => { try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}; process.exit(130); });
  }
  return filePath;
}

/* ---------- Preferencias de auto-run ---------- */

function loadConfig() {
  try {
    const envPath = process.env.JOS_CONFIG;
    const home = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME;
    const xdg = process.env.XDG_CONFIG_HOME || (home ? path.join(home, '.config') : null);
    const defaultPath = xdg ? path.join(xdg, 'jos', 'config.json') : null;
    const p = envPath || defaultPath;
    if (!p) return {};
    if (!fs.existsSync(p)) return {};
    return JSON.parse(fs.readFileSync(p, 'utf8')) || {};
  } catch { return {}; }
}

function saveConfig(next) {
  try {
    const home = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME;
    const xdg = process.env.XDG_CONFIG_HOME || (home ? path.join(home, '.config') : null);
    if (!xdg) return;
    const dir = path.join(xdg, 'jos');
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, 'config.json');
    const prev = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
    fs.writeFileSync(p, JSON.stringify({ ...prev, ...next }, null, 2), 'utf8');
  } catch {}
}

function docWantsAutoRun(doc) {
  // admite x.jos.autoRun, x.autoRun o meta.autoRun
  return !!(doc?.x?.jos?.autoRun || doc?.x?.autoRun || doc?.meta?.autoRun);
}

async function askPolicyOnce() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const q = (s) => new Promise(r => rl.question(s, a => r(a.trim())));
  const ans = (await q('Run script.body now? (a=always, y=yes once, n=no) [n] ')).toLowerCase();
  rl.close();
  if (ans === 'a') return 'always';
  if (ans === 'y' || ans === 'yes') return 'once';
  return 'no';
}

/* ---------- Ejecución directa con stdio heredado ---------- */

function directExecIfPossible(doc, argv) {
  const hasSingleInlineScript = !!(doc?.script?.file && (!doc?.tasks || doc.tasks.length === 0));
  if (!argv.direct && !hasSingleInlineScript) return false;

  const file = doc.script.file;
  const shell = doc?.script?.shell || '/bin/bash';

  let cmd, args;
  try {
    const content = fs.readFileSync(file, 'utf8');
    const useShebang = content.startsWith('#!');
    cmd = useShebang ? file : shell;
    args = useShebang ? [] : [file];
  } catch (e) {
    console.error('Failed to read materialized script:', e.message);
    process.exit(1);
  }

  if (argv.verbose) {
    console.log('▶ executing:', cmd, args.join(' '));
  }

  const child = spawn(cmd, args, {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', code => process.exit(code ?? 1));
  child.on('error', err => { console.error('spawn error:', err.message); process.exit(1); });
  return true;
}

/* ---------- CLI ---------- */

yargs(hideBin(process.argv))
  .scriptName('jos')

  .command('validate <file>', 'Validate .jos v0.3.1', y => y.positional('file', { type:'string' }), argv => {
    const res = validate(argv.file);
    if (!res.ok) { console.error('Schema errors:', res.errors); process.exit(1); }
    console.log('OK ✅');
  })

  // RUN: resolver, materializar y ejecutar
  .command('run <file>', 'Run task/pipeline', y => y
    .positional('file', { type:'string' })
    .option('yes', { type:'boolean', default:false, desc:'Skip confirmation for creating a temporary executable (deprecated; prefer config or x.jos.autoRun)'} )
    .option('dry-run', { type:'boolean', default:false, desc:'Do not execute; only print what would run' })
    .option('keep', { type:'boolean', default:false, desc:'Keep the materialized temporary file' })
    .option('direct', { type:'boolean', default:false, desc:'Force direct execution with stdio inherit when possible' })
    .option('verbose', { type:'boolean', default:false, desc:'Verbose logs (show spawned command)' })
  , async argv => {
    const doc = resolveJos(argv.file);

    const cfg = loadConfig();
    const preferAuto = argv.yes || docWantsAutoRun(doc) || cfg.autoRun === true;

    let materializedPath = null;
    if (doc?.script?.body && !doc?.script?.file) {
      if (!preferAuto) {
        const policy = await askPolicyOnce();
        if (policy === 'no') { console.log('Cancelado.'); process.exit(0); }
        if (policy === 'always') { saveConfig({ autoRun: true }); }
        // 'once' solo continúa sin guardar
      }
      materializedPath = materializeBodyToFile(doc, { keep: argv.keep });
      console.log(`🧩 Materializado script a: ${materializedPath}`);
    }

    if (argv['dry-run']) {
      console.log('🏁 DRY-RUN: Ejecutaría el pipeline con:');
      console.log(JSON.stringify({
        file: argv.file,
        scriptFile: doc?.script?.file || null,
        shell: doc?.script?.shell || null,
        autoRun: preferAuto === true
      }, null, 2));
      process.exit(0);
    }

    // Direct exec fast-path (stdout/stderr en vivo)
    if (doc?.script?.file && directExecIfPossible(doc, argv)) {
      return; // el proceso terminará cuando termine el hijo
    }

    // Fallback al orquestador para pipelines / docs complejos
    const flags = {};
    for (const [k,v] of Object.entries(argv)) if (k.startsWith('eval.')) flags[k]=v;

    const code = await run(doc, flags);
    process.exit(code);
  })

  .command('serve <file>', 'Run dev server', y => y.positional('file',{type:'string'}), async argv => {
    const doc = resolveJos(argv.file);
    await serve(doc);
  })

  .command('doc <file> --out <out>', 'Generate docs', y => y
    .positional('file',{type:'string'})
    .option('out',{type:'string', demandOption:true})
  , argv => {
    const { doc } = validate(argv.file);
    const tasks = (doc.tasks||[]).map(t => `- **${t.id}** \`${t.runner}${t.action?':'+t.action:''}\``).join('\n');
    const md = `# ${doc.name}\n\nSchema: ${doc.schema}\n\n## Tasks\n${tasks}\n`;
    fs.writeFileSync(argv.out, md, 'utf8');
    console.log(`Doc written to ${argv.out}`);
  })

  .command('pack <file> --out <out>', 'Pack resolved JSON', y => y
    .positional('file',{type:'string'})
    .option('out',{type:'string', demandOption:true})
  , argv => {
    const doc = resolveJos(argv.file);
    writeJSON(argv.out, doc);
    console.log(`Packed to ${argv.out}`);
  })

  .command('publish <file>', 'Publish (stub)', y => y.positional('file',{type:'string'}), () => {
    console.warn('[stub] Forge publish not implemented in community build');
  })
  .command('test <file>', 'Run basic checks (stub)', y => y.positional('file',{type:'string'}), () => {
    console.warn('[stub] checks TBD');
  })
  .command('lint <path>', 'Lint (stub)', y => y.positional('path',{type:'string'}), () => {
    console.warn('[stub] lint TBD');
  })
  .demandCommand(1)
  .help()
  .parse();
