#!/bin/bash

# DB Context Sync MCP Server Installer
# Supports: local installation (development) and global installation (production)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🗄️  DB Context Sync MCP Server Installer"
echo ""

# Check if running from source or npm
if [ -f "$SCRIPT_DIR/package.json" ]; then
  INSTALL_MODE="local"
  echo "📦 Installing from source (local mode)"
else
  INSTALL_MODE="global"
  echo "📦 Installing from npm (global mode)"
fi

# Install npm dependencies
echo ""
echo "📥 Installing dependencies..."
if [ "$INSTALL_MODE" = "local" ]; then
  cd "$SCRIPT_DIR"
  npm install
else
  npm install -g @claudekit/db-context-sync-mcp
fi

# Claude Desktop config path
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

echo ""
echo "🔧 Configuring Claude Desktop..."

# Create config directory if it doesn't exist
mkdir -p "$(dirname "$CLAUDE_CONFIG")"

# Check if config file exists
if [ ! -f "$CLAUDE_CONFIG" ]; then
  echo '{"mcpServers":{}}' > "$CLAUDE_CONFIG"
fi

# Add MCP server to config
if [ "$INSTALL_MODE" = "local" ]; then
  # Local installation - use node with full path
  CONFIG_COMMAND="node $SCRIPT_DIR/index.js"
else
  # Global installation - use global command
  CONFIG_COMMAND="db-context-sync-mcp"
fi

# Use Python to update JSON (more reliable than jq)
python3 -c "
import json
import sys

config_path = '$CLAUDE_CONFIG'
command = '$CONFIG_COMMAND'

with open(config_path, 'r') as f:
    config = json.load(f)

if 'mcpServers' not in config:
    config['mcpServers'] = {}

config['mcpServers']['db-context-sync'] = {
    'command': command
}

with open(config_path, 'w') as f:
    json.dump(config, f, indent=2)

print('✅ Claude Desktop config updated')
"

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Next steps:"
echo "1. Restart Claude Desktop"
echo "2. In Claude Code, run: 'Scan database từ Prisma schema'"
echo "3. Review generated docs in docs/database-schema.md"
echo ""
echo "🔗 Documentation: $SCRIPT_DIR/README.md"
