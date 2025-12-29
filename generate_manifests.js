#!/usr/bin/env node
/**
 * JOS Manifest Generator
 * Generates detached integrity manifests for .jos artifacts
 * Solves the hash paradox: artifact points to manifest, manifest contains artifact hash
 * 
 * Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const baseDir = path.join(__dirname, 'jos/examples/release');
const files = [
    'publish-jos.jos',
    'publish-jos-cli.jos',
    'publish-josfox-alias.jos',
    'orchestration.jos'
];

function generateManifest(filename) {
    const filePath = path.join(baseDir, filename);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filename}`);
        return null;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const sha256 = crypto.createHash('sha256').update(content).digest('hex');
    const stats = fs.statSync(filePath);

    const manifest = {
        "$schema": "https://josfox.ai/schemas/jos-manifest-0.0.7.json",
        "manifest_version": "1.0.0",
        "artifact_ref": filename,
        "artifact_sha256": sha256,
        "artifact_size_bytes": stats.size,
        "timestamp": new Date().toISOString(),
        "generated_by": "JOS Release Auditor",
        "canonical_version": "Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)",
        "notes": "Detached integrity manifest to solve hash paradox. The .jos file references this manifest via security.integrity_ref. The runtime verifies that the artifact's SHA-256 matches artifact_sha256.",
        "verification": {
            "algorithm": "sha256",
            "encoding": "hex",
            "verified_fields": ["artifact_sha256"]
        }
    };

    const manifestPath = filePath + '.sig.json';
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`✅ Generated manifest for ${filename}`);
    console.log(`   Path: ${manifestPath}`);
    console.log(`   SHA256: ${sha256}`);
    console.log(`   Size: ${stats.size} bytes`);
    console.log('');

    return manifest;
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('JOS Manifest Generator');
console.log('Format version v0.0.7 — Specification maturity v0.1.0 (Alpha)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const results = files.map(generateManifest).filter(Boolean);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Generated ${results.length}/${files.length} manifests`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
