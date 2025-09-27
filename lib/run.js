import { spawn } from 'node:child_process';
import http from 'node:http'; import https from 'node:https';

function postJSON(url, token, payload) {
  const u = new URL(url);
  const data = Buffer.from(JSON.stringify(payload));
  const isHttps = u.protocol === 'https:';
  const opts = { hostname: u.hostname, port: u.port || (isHttps ? 443 : 80),
    path: u.pathname + (u.search || ''), method: 'POST',
    headers: { 'content-type': 'application/json', 'content-length': data.length, ...(token ? {'authorization': `Bearer ${token}`} : {}) } };
  const agent = isHttps ? https : http;
  return new Promise((resolve, reject) => {
    const req = agent.request(opts, res => { let body=''; res.on('data', c=> body+=c); res.on('end', ()=> resolve({ status: res.statusCode, body })); });
    req.on('error', reject); req.write(data); req.end();
  });
}

export async function run(doc, flags={}) {
  const env = { ...process.env };
  if (doc.envMap) for (const [k,v] of Object.entries(doc.envMap)) {
    let val = v; if (typeof v === 'string' && v.startsWith('inputs.')) { const key = v.split('.').slice(1).join('.'); val = doc.inputs?.[key]; }
    if (Array.isArray(val)) val = val.join(' '); env[k] = val;
  }
  let code = 0;
  for (const t of (doc.tasks||[])) {
    if (t.runner === 'shell') {
      const sh = t.script?.shell || 'bash'; const body = t.script?.body || '';
      const child = spawn(sh, ['-lc', body], { stdio: 'inherit', env });
      code = await new Promise(r => child.on('close', r)); if (code !== 0) break;
    } else if (t.runner === 'node') {
      if (t.action) { const mod = await import(new URL('../' + t.action, import.meta.url)); if (typeof mod.default === 'function') { const r = await mod.default({ doc, task: t, env, flags }); if (r?.exitCode) code = r.exitCode; } }
    } else if (t.runner === 'http') {
      console.warn('[stub] http runner not implemented');
    } else if (t.runner === 'forge' || t.runner === 'ai') {
      console.warn(`[stub] runner "${t.runner}" not implemented in community build`);
    }
  }
  const e = doc.evaluation; const stars = Number(flags['eval.stars'] ?? 0);
  if (e?.feedbackEndpoint && e?.contract==='stars_1_5' && stars>=1 && stars<=5) {
    try { const res = await postJSON(e.feedbackEndpoint, e.authToken, { runId: flags.runId || Date.now().toString(36), taskId: flags.taskId || doc.id, stars, notes: flags['eval.notes']||'', context: e.context||{}, ts: new Date().toISOString() }); console.log(`[eval] posted: ${res.status}`); } catch(err){ console.warn('[eval] failed:', err.message); }
  }
  return code;
}
