#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const schema = JSON.parse(fs.readFileSync(path.resolve('schemas/jos.schema.v0.1.json'),'utf8'));
const file = process.argv[2];
if(!file){
  console.error('Usage: node tools/jos-validate.mjs <file.jos>');
  process.exit(2);
}
const data = JSON.parse(fs.readFileSync(path.resolve(file),'utf8'));

const ajv = new Ajv({ allErrors:true, strict:false });
addFormats(ajv);

const validate = ajv.compile(schema);
const ok = validate(data);
if(!ok){
  console.error('Invalid .jos file:');
  for(const err of validate.errors||[]){
    console.error('-', err.instancePath||'$', err.message);
  }
  process.exit(1);
}
console.log('OK:', path.basename(file));
