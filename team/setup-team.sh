#!/bin/bash
# setup-team.sh — Copy agent team config vào project
# Usage: ./setup-team.sh <team-name> [project-path]
# Example:
#   ./setup-team.sh backend-developer /path/to/my-project
#   ./setup-team.sh frontend-developer  (dùng current directory)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEAM_NAME="$1"
PROJECT_PATH="${2:-$(pwd)}"

AVAILABLE_TEAMS=(business-analyst backend-developer frontend-developer database project-manager ui-ux mobile ai r-and-d security)

# --- Validate ---
if [ -z "$TEAM_NAME" ]; then
  echo "Usage: $0 <team-name> [project-path]"
  echo ""
  echo "Available teams:"
  for t in "${AVAILABLE_TEAMS[@]}"; do
    count=$(ls "$SCRIPT_DIR/$t/agents/" 2>/dev/null | wc -l | tr -d ' ')
    echo "  - $t  ($count agents)"
  done
  exit 1
fi

TEAM_SRC="$SCRIPT_DIR/$TEAM_NAME"
if [ ! -d "$TEAM_SRC" ]; then
  echo "❌ Team '$TEAM_NAME' not found."
  echo "Available: ${AVAILABLE_TEAMS[*]}"
  exit 1
fi

CLAUDE_DIR="$PROJECT_PATH/.claude"

# --- Confirm if .claude already exists ---
if [ -d "$CLAUDE_DIR" ]; then
  echo "⚠️  .claude/ already exists at: $CLAUDE_DIR"
  read -p "Overwrite agents and settings? (y/N): " confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
fi

# --- Copy team config ---
echo ""
echo "🚀 Setting up [$TEAM_NAME] team in: $PROJECT_PATH"

mkdir -p "$CLAUDE_DIR/agents"
mkdir -p "$CLAUDE_DIR/agent-memory"

# Copy agents
cp -r "$TEAM_SRC/agents/"* "$CLAUDE_DIR/agents/"
echo "  ✓ Copied $(ls "$TEAM_SRC/agents/" | wc -l | tr -d ' ') agents"

# Copy settings.json
cp "$TEAM_SRC/settings.json" "$CLAUDE_DIR/settings.json"
echo "  ✓ Copied settings.json"

# Copy shared TEAM-MEMORY.md (don't overwrite if exists)
if [ ! -f "$CLAUDE_DIR/agent-memory/TEAM-MEMORY.md" ]; then
  cp "$TEAM_SRC/agent-memory/TEAM-MEMORY.md" "$CLAUDE_DIR/agent-memory/TEAM-MEMORY.md" 2>/dev/null || true
  echo "  ✓ Created shared TEAM-MEMORY.md"
else
  echo "  ~ Kept existing TEAM-MEMORY.md"
fi

# Copy agent-memory dirs (with MEMORY.md stubs, don't overwrite existing)
for memdir in "$TEAM_SRC/agent-memory"/*/; do
  agent=$(basename "$memdir")
  target="$CLAUDE_DIR/agent-memory/$agent"
  mkdir -p "$target"
  if [ ! -f "$target/MEMORY.md" ]; then
    cp "$memdir/MEMORY.md" "$target/MEMORY.md" 2>/dev/null || \
    echo "# MEMORY.md

Your MEMORY.md is currently empty." > "$target/MEMORY.md"
    echo "  ✓ Created memory dir: $agent"
  else
    echo "  ~ Kept existing memory: $agent"
  fi
done

# Copy CLAUDE.md if not present
if [ ! -f "$PROJECT_PATH/CLAUDE.md" ]; then
  cp "$TEAM_SRC/CLAUDE.md" "$PROJECT_PATH/CLAUDE.md"
  echo "  ✓ Created CLAUDE.md (customize Project Overview section)"
else
  echo "  ~ CLAUDE.md already exists — not overwritten"
fi

# Update memory paths in agent files to point to project's .claude dir
echo "  ↻ Updating memory paths to project directory..."
for f in "$CLAUDE_DIR/agents/"*.md; do
  if [[ "$(uname)" == "Darwin" ]]; then
    # Replace hardcoded team source paths (legacy)
    sed -i '' "s|$TEAM_SRC/agent-memory/|$CLAUDE_DIR/agent-memory/|g" "$f"
    # Replace portable {TEAM_MEMORY} placeholder
    sed -i '' "s|{TEAM_MEMORY}|$CLAUDE_DIR/agent-memory|g" "$f"
  else
    sed -i "s|$TEAM_SRC/agent-memory/|$CLAUDE_DIR/agent-memory/|g" "$f"
    sed -i "s|{TEAM_MEMORY}|$CLAUDE_DIR/agent-memory|g" "$f"
  fi
done
echo "  ✓ Memory paths updated"

# --- Summary ---
echo ""
echo "✅ Done! [$TEAM_NAME] team is ready."
echo ""
echo "Agents installed:"
for f in "$CLAUDE_DIR/agents/"*.md; do
  name=$(grep "^name:" "$f" | head -1 | sed 's/name: //')
  model=$(grep "^model:" "$f" | head -1 | sed 's/model: //')
  echo "  - $name ($model)"
done
echo ""
echo "Next steps:"
echo "  1. Edit CLAUDE.md → fill in [PROJECT_NAME], tech stack, build commands"
echo "  2. cd $PROJECT_PATH && claude"
