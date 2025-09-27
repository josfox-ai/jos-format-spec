import { spawn } from 'node:child_process';
export async function serve(doc) {
  const cmd = doc.devServer?.command; if (!cmd) throw new Error('devServer.command not defined');
  const [exe, ...args] = cmd.split(' '); const child = spawn(exe, args, { stdio: 'inherit', env: process.env });
  await new Promise((r)=> child.on('close', r));
}
