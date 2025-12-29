#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# JOS UNIVERSE — RELEASE PUBLISHER
# ═══════════════════════════════════════════════════════════════════════════════
set -e

echo ""
echo "🦊 JOS Universe Publisher"
echo "════════════════════════════════════════════════════════════════"
echo ""

cd /Users/jos/Documents/dev/jos

# Publish @josfox/jos (Developer Edition)
echo "📦 Publishing @josfox/jos..."
cd jos
npm version 4.0.5 --no-git-tag-version
npm publish --access public
echo "✅ @josfox/jos@4.0.5 published!"
cd ..

# Publish @josfox/jos-cli (Kernel Only)
echo ""
echo "📦 Publishing @josfox/jos-cli..."
cd jos-cli
npm version 1.0.4 --no-git-tag-version
npm publish --access public
echo "✅ @josfox/jos-cli@1.0.4 published!"
cd ..

# Publish josfox (NPX Alias)
echo ""
echo "📦 Publishing josfox..."
cd josfox-alias
npm version 1.0.3 --no-git-tag-version
# Update dependency to latest
sed -i '' 's/"@josfox\/jos": "^4.0.4"/"@josfox\/jos": "^4.0.5"/' package.json
npm publish --access public
echo "✅ josfox@1.0.3 published!"
cd ..

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "🎉 ALL PACKAGES PUBLISHED!"
echo ""
echo "  @josfox/jos       → 4.0.5"
echo "  @josfox/jos-cli   → 1.0.4"
echo "  josfox            → 1.0.3"
echo ""
echo "Test with: npx josfox serve"
echo "════════════════════════════════════════════════════════════════"
