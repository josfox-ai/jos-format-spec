#!/bin/bash
# JOS CLI Installer for macOS/Linux
# Run: curl -fsSL https://raw.githubusercontent.com/josfox-ai/jos-repo-starter/main/install/install.sh | bash

set -e

echo ""
echo "🦊 JOS CLI Installer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${CYAN}Checking for Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}✖ Node.js not found!${NC}"
    echo ""
    echo -e "${YELLOW}Please install Node.js first:${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo -e "  ${CYAN}brew install node${NC}"
        echo "  or visit https://nodejs.org/"
    else
        echo -e "  ${CYAN}curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -${NC}"
        echo -e "  ${CYAN}sudo apt-get install -y nodejs${NC}"
        echo "  or visit https://nodejs.org/"
    fi
    echo ""
    exit 1
fi

# Check npm
echo -e "${CYAN}Checking for npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}✖ npm not found!${NC}"
    exit 1
fi

# Install JOS CLI
echo ""
echo -e "${CYAN}Installing @josfox/jos...${NC}"
npm install -g @josfox/jos

# Verify
echo ""
echo -e "${CYAN}Verifying installation...${NC}"
if command -v jos &> /dev/null; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✓ JOS CLI installed successfully!${NC}"
    echo ""
    echo "  Get started:"
    echo -e "    ${CYAN}jos --help${NC}"
    echo -e "    ${CYAN}jos get ollama${NC}"
    echo ""
    echo "  Documentation:"
    echo -e "    ${CYAN}https://josfox-ai.github.io/jos-format-spec${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo -e "${RED}✖ Installation failed. Please try again.${NC}"
    exit 1
fi
