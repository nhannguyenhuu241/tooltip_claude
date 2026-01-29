#!/bin/bash

# =============================================================================
# Claude Skills & Agents Integration Script
# Usage: ./integrate.sh /path/to/your-project
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory (source)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR"

# Target directory from argument
TARGET_PROJECT="${1:-}"

if [ -z "$TARGET_PROJECT" ]; then
    echo -e "${RED}Error: Please provide target project path${NC}"
    echo "Usage: ./integrate.sh /path/to/your-project"
    exit 1
fi

TARGET_DIR="$TARGET_PROJECT/.claude"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Claude Skills & Agents Integration${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Source: ${YELLOW}$SOURCE_DIR${NC}"
echo -e "Target: ${YELLOW}$TARGET_DIR${NC}"
echo ""

# Create directories
echo -e "${BLUE}Creating directories...${NC}"
mkdir -p "$TARGET_DIR/skills"
mkdir -p "$TARGET_DIR/agents"
mkdir -p "$TARGET_DIR/hooks"

# Skills to copy (excluding document-skills which are built-in)
SKILLS=(
    "debugging"
    "frontend-development"
    "backend-development"
    "mobile-development"
    "databases"
    "web-frameworks"
    "research"
)

echo ""
echo -e "${BLUE}Copying skills...${NC}"
for skill in "${SKILLS[@]}"; do
    if [ -d "$SOURCE_DIR/skills/$skill" ]; then
        cp -r "$SOURCE_DIR/skills/$skill" "$TARGET_DIR/skills/"
        echo -e "  ${GREEN}✓${NC} $skill"
    else
        echo -e "  ${YELLOW}⊘${NC} $skill (not found)"
    fi
done

# Copy skill spec
if [ -f "$SOURCE_DIR/skills/agent_skills_spec.md" ]; then
    cp "$SOURCE_DIR/skills/agent_skills_spec.md" "$TARGET_DIR/skills/"
    echo -e "  ${GREEN}✓${NC} agent_skills_spec.md"
fi

# Copy agents
echo ""
echo -e "${BLUE}Copying agents...${NC}"
for agent in "$SOURCE_DIR/agents/"*.md; do
    if [ -f "$agent" ]; then
        cp "$agent" "$TARGET_DIR/agents/"
        echo -e "  ${GREEN}✓${NC} $(basename "$agent")"
    fi
done

# Copy hooks
echo ""
echo -e "${BLUE}Copying hooks...${NC}"
for hook in "$SOURCE_DIR/hooks/"*; do
    if [ -f "$hook" ]; then
        cp "$hook" "$TARGET_DIR/hooks/"
        chmod +x "$TARGET_DIR/hooks/$(basename "$hook")" 2>/dev/null || true
        echo -e "  ${GREEN}✓${NC} $(basename "$hook")"
    fi
done

# Copy statusline
echo ""
echo -e "${BLUE}Copying statusline...${NC}"
for statusline in "$SOURCE_DIR/.claude/statusline."*; do
    if [ -f "$statusline" ]; then
        cp "$statusline" "$TARGET_DIR/"
        chmod +x "$TARGET_DIR/$(basename "$statusline")" 2>/dev/null || true
        echo -e "  ${GREEN}✓${NC} $(basename "$statusline")"
    fi
done

# Handle settings.json
echo ""
echo -e "${BLUE}Handling settings.json...${NC}"
if [ -f "$TARGET_DIR/settings.json" ]; then
    echo -e "  ${YELLOW}!${NC} settings.json already exists - creating settings.json.new"
    cp "$SOURCE_DIR/.claude/settings.json" "$TARGET_DIR/settings.json.new"
    echo -e "  ${YELLOW}→${NC} Please merge manually from settings.json.new"
else
    cp "$SOURCE_DIR/.claude/settings.json" "$TARGET_DIR/"
    echo -e "  ${GREEN}✓${NC} settings.json"
fi

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Integration Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Next steps:"
echo -e "  1. ${YELLOW}cd $TARGET_PROJECT${NC}"
echo -e "  2. Review .claude/settings.json"
echo -e "  3. Test with Claude Code"
echo ""

# Check if settings needs merge
if [ -f "$TARGET_DIR/settings.json.new" ]; then
    echo -e "${YELLOW}Important:${NC} Merge settings.json.new into settings.json:"
    echo ""
    echo -e "  ${BLUE}Key sections to add:${NC}"
    echo '  - "statusLine": { "type": "command", "command": "node .claude/statusline.js" }'
    echo '  - "hooks": { "PreToolUse": [...] }'
    echo ""
fi
