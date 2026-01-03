const crypto = require('crypto');
const fs = require('fs');

/**
 * Calculate SHA-256 checksum of detailed content
 * @param {string} content 
 * @returns {string} Hex digest
 */
exports.calculateChecksum = (content) => {
    return crypto.createHash('sha256').update(content).digest('hex');
};

/**
 * Verify artifact integrity
 * @param {object} artifact Parsed JSON artifact
 * @param {string} rawContent Raw file content string
 * @returns {boolean} True if valid
 */
exports.verifyIntegrity = (artifact, rawContent) => {
    const expected = artifact.meta?.checksum;
    if (!expected) return false;

    // To verify, we need to reproduce how the checksum was calculated.
    // Standard JOS: Checksum is of the minified JSON structure *excluding* the checksum field itself.
    // For simplicity in this v0.0.7 alpha, we'll assume it's a file-hash if provided externally,
    // OR we just trust the meta if we aren't doing strict reproduction yet.

    // STRICT MODE:
    // 1. Remove meta.checksum from object
    // 2. Canonicalize JSON
    // 3. Hash

    const clone = JSON.parse(JSON.stringify(artifact));
    if (clone.meta) delete clone.meta.checksum;

    // Canonical stringify (basic)
    const canonical = JSON.stringify(clone);
    const calculated = exports.calculateChecksum(canonical);

    return calculated === expected;
};
