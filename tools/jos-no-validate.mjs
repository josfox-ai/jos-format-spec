#!/usr/bin/env node
import path from 'node:path';
const file = process.argv[2] || 'examples/apparel.ecom.jos';
console.log('[no-validate] OK:', path.basename(file));
