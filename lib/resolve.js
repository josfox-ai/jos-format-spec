import fs from 'node:fs';
import path from 'node:path';

export function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function isAbs(p){ return path.isAbsolute(p) || p.startsWith('http://') || p.startsWith('https://'); }
export function resolvePath(base, rel) { return isAbs(rel) ? rel : path.join(path.dirname(base), rel); }
export function deepMerge(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    const out = { ...a };
    for (const k of Object.keys(b)) out[k] = deepMerge(a[k], b[k]);
    return out;
  }
  return b === undefined ? a : b;
}
export function resolveJos(entry) {
  function _res(file) {
    const doc = loadJSON(file);
    let acc = { ...doc };
    if (doc.$extends) {
      const base = resolvePath(file, doc.$extends);
      acc = deepMerge(_res(base), acc);
      delete acc.$extends;
    }
    if (doc.$imports) {
      for (const imp of doc.$imports) acc = deepMerge(_res(resolvePath(file, imp)), acc);
      delete acc.$imports;
    }
    return acc;
  }
  return _res(entry);
}
