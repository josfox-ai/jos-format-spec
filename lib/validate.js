import Ajv from 'ajv';
import fs from 'node:fs';
import { resolveJos } from './resolve.js';
const schema = JSON.parse(fs.readFileSync(new URL('../schemas/jos.v0.3.1.schema.json', import.meta.url)));
export function validate(file) {
  const doc = resolveJos(file);
  const ajv = new Ajv({ allErrors: true, strict: false });
  const check = ajv.compile(schema);
  const ok = check(doc);
  return { ok, errors: check.errors || [], doc };
}
