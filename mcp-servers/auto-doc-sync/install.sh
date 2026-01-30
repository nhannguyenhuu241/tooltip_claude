#!/bin/bash

##
# Auto-Doc-Sync MCP Server - Quick Install Script
#
# Usage:
#   ./install.sh                 # Install globally via npm
#   ./install.sh local           # Install locally to Claude config
##

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"

echo "🔄 Installing Auto-Doc-Sync MCP Server..."

# Check Node.js installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Check npm installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd "$SCRIPT_DIR"
npm install

# Make executable
chmod +x index.js

if [ "$1" == "local" ]; then
    # Local installation - add to Claude config directly
    echo "📝 Adding to Claude Desktop config..."

    # Create config directory if not exists
    mkdir -p "$(dirname "$CLAUDE_CONFIG")"

    # Check if config exists
    if [ ! -f "$CLAUDE_CONFIG" ]; then
        # Create new config
        cat > "$CLAUDE_CONFIG" <<EOF
{
  "mcpServers": {
    "auto-doc-sync": {
      "command": "node",
      "args": ["$SCRIPT_DIR/index.js"]
    }
  }
}
EOF
    else
        # Append to existing config using jq or manual edit
        if command -v jq &> /dev/null; then
            # Use jq if available
            jq --arg path "$SCRIPT_DIR/index.js" \
               '.mcpServers["auto-doc-sync"] = {"command": "node", "args": [$path]}' \
               "$CLAUDE_CONFIG" > "$CLAUDE_CONFIG.tmp"
            mv "$CLAUDE_CONFIG.tmp" "$CLAUDE_CONFIG"
        else
            echo ""
            echo "⚠️  jq not installed. Please manually add to $CLAUDE_CONFIG:"
            echo ""
            echo '  "auto-doc-sync": {'
            echo '    "command": "node",'
            echo "    \"args\": [\"$SCRIPT_DIR/index.js\"]"
            echo '  }'
            echo ""
        fi
    fi

    echo "✅ Installed locally!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Restart Claude Desktop"
    echo "2. In any project, say: 'Install auto-doc-sync'"

else
    # Global installation via npm
    echo "📦 Installing globally via npm..."
    npm install -g .

    echo "✅ Installed globally!"
    echo ""
    echo "📋 Add to Claude Desktop config ($CLAUDE_CONFIG):"
    echo ""
    echo '{'
    echo '  "mcpServers": {'
    echo '    "auto-doc-sync": {'
    echo '      "command": "auto-doc-sync-mcp"'
    echo '    }'
    echo '  }'
    echo '}'
    echo ""
    echo "Then restart Claude Desktop."
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "📚 Usage:"
echo "  User: Install auto-doc-sync vào project này"
echo "  User: /sync"
echo "  User: /sync widgets"
echo ""
