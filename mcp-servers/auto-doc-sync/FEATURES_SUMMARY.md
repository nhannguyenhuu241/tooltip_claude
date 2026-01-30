# Auto-Doc-Sync MCP Server - Features Summary

## ✅ Hoàn Chỉnh 100%

### 🛠️ MCP Tools (5 tools)

1. **`install`** - Cài đặt hook vào project
2. **`sync`** - Xem team activity
3. **`configure_modules`** - Config custom modules
4. **`deduplicate`** - Dọn duplicates
5. **`run_hook`** - Chạy hook manually

### 📚 MCP Resources (3+ resources)

1. **`CHANGES.md`** - Global changelog
2. **`docs/CONTEXT.md`** - AI context
3. **`docs/modules/*.md`** - Module docs (dynamic)

### 🤖 MCP Prompts (4 prompts)

1. **`sync-and-review`** - Daily sync + conflict prevention
2. **`onboarding-guide`** - New developer onboarding
3. **`tech-stack-analysis`** - Tech-specific best practices
4. **`module-coordination`** - Module conflict check

---

## 🎯 Tech Stack Support

### Auto-Detection

MCP server tự động detect và customize cho:

| Tech Stack | Detect From | Frameworks Detected | Prompts Customized |
|-----------|-------------|---------------------|-------------------|
| **Flutter** | pubspec.yaml | Provider, BLoC, Riverpod | ✅ Dart patterns, Provider architecture |
| **Node.js** | package.json | Express, NestJS | ✅ JavaScript/TypeScript best practices |
| **React** | package.json | Next.js, CRA | ✅ React patterns, hooks, SSR |
| **Python** | requirements.txt | Django, Flask, FastAPI | ✅ Python patterns, async/await |
| **Ruby** | Gemfile | Rails | ✅ Ruby on Rails conventions |
| **Go** | go.mod | - | ✅ Go idioms, concurrency |
| **Generic** | Git repo | - | ✅ General best practices |

### Language-Specific Best Practices

#### Flutter Prompts Include:

- Provider pattern examples
- Widget architecture guidelines
- Theme system best practices
- Localization patterns
- Performance tips (const, lazy loading)
- Testing strategies (unit, widget, integration)

#### Node.js/TypeScript Prompts Include:

- Express.js patterns
- NestJS architecture
- Async/await best practices
- Error handling
- Security (CORS, rate limiting)
- Testing with Jest

#### Python Prompts Include:

- Django MTV pattern
- FastAPI async patterns
- Type hints usage
- Virtual environments
- Testing with pytest

---

## 📖 Prompts Examples

### Example 1: Flutter Project

**Tech Stack Detected:**
```json
{
  "primary": "Flutter",
  "languages": ["Dart"],
  "frameworks": ["Flutter", "Provider"]
}
```

**Prompt: `tech-stack-analysis`**

Generates:
- Flutter best practices
- Provider pattern examples
- Widget composition tips
- Theme system guidelines
- Performance optimization
- Testing strategies

**Output Language**: Vietnamese (customizable)

---

### Example 2: Node.js + Express

**Tech Stack Detected:**
```json
{
  "primary": "Node.js",
  "languages": ["JavaScript"],
  "frameworks": ["Express"]
}
```

**Prompt: `tech-stack-analysis`**

Generates:
- Express.js patterns
- Middleware best practices
- Error handling
- Security tips (helmet, CORS)
- API design
- Testing with Jest/Mocha

---

### Example 3: Python + FastAPI

**Tech Stack Detected:**
```json
{
  "primary": "Python",
  "languages": ["Python"],
  "frameworks": ["FastAPI"]
}
```

**Prompt: `tech-stack-analysis`**

Generates:
- FastAPI async patterns
- Pydantic models
- Dependency injection
- Testing with pytest
- Type hints best practices
- Performance optimization

---

## 🔄 Auto-Generation Flow

### 1. Project Detection

```
install tool
  ↓
Scan project files
  ↓
Detect: pubspec.yaml → Flutter
  ↓
Read pubspec.yaml
  ↓
Detect: provider: → Provider pattern
  ↓
Set: techStack = { primary: "Flutter", frameworks: ["Flutter", "Provider"] }
```

### 2. Prompt Generation

```
User: Use prompt tech-stack-analysis
  ↓
Read techStack from project
  ↓
Generate Flutter-specific prompt
  ↓
Include Provider examples
  ↓
Output in Vietnamese
```

### 3. Context Integration

```
Prompt reads:
- docs/CONTEXT.md → Recent changes, active modules
- docs/modules/*.md → Module-specific activity
- Tech stack detection → Framework-specific advice
  ↓
Generates comprehensive, context-aware response
```

---

## 💡 Use Cases

### Use Case 1: Daily Standup

```bash
# Morning routine
git pull
```

```
User: Use prompt sync-and-review
```

**Claude Output:**
```markdown
# Team Sync (Flutter Project)

## High-Risk Modules
- widgets: 19 commits - coordinate before changes
- core-theme: Breaking changes

## Dependencies
⚠️ Run: flutter pub get

## Recommendations
1. Check widgets module với @mike
2. Update AppColors imports
3. Review breaking changes in theme-system.md
```

---

### Use Case 2: New Developer Onboarding

```
User: Use prompt onboarding-guide
```

**Claude Output:**
```markdown
# Onboarding Guide - Flutter Project

## Tech Stack
- Flutter + Provider
- Dart 3.0
- Multi-language support (en, vi, zh)

## Setup
1. Install Flutter SDK
2. Run: flutter pub get
3. Run: flutter run

## Architecture
- Provider pattern for state
- Modular structure (core + features)
- Custom theme system

## Where to Start
1. Read docs/CONTEXT.md
2. Review widgets module
3. Fix "good first issue" bugs
```

---

### Use Case 3: Before Modifying Module

```
User: Use prompt module-coordination for widgets
```

**Claude Output:**
```markdown
# Module Coordination - widgets

⚠️ Conflict Risk: HIGH

## Active Developers
- @mike: 12 commits (primary)
- @sarah: 7 commits (theme)

## Recent Changes
- Refactored PrimaryButton
- Added TextFieldCustom variants
- Updated theme integration

## Recommendation
❌ High conflict risk
✅ Coordinate with @mike first
✅ Or work on different module
```

---

## 🌟 Key Features

### ✅ Auto-Detection
- Scans project files
- Detects tech stack
- Identifies frameworks

### ✅ Context-Aware
- Reads CHANGES.md
- Reads CONTEXT.md
- Reads module docs

### ✅ Language-Specific
- Flutter patterns
- Node.js patterns
- Python patterns
- Ruby patterns
- Go patterns

### ✅ Multi-Language Output
- Vietnamese (default)
- English (customizable)

### ✅ Team Coordination
- Check active developers
- Identify high-risk modules
- Prevent conflicts

---

## 📊 Comparison

| Feature | Manual Docs | Auto-Doc-Sync MCP |
|---------|-------------|-------------------|
| Update docs | ❌ Manual | ✅ Auto on commit |
| Team sync | ❌ Ask around | ✅ View CONTEXT.md |
| Best practices | ❌ Google search | ✅ Tech-specific prompts |
| Onboarding | ❌ Wiki outdated | ✅ Auto-generated guide |
| Conflict prevention | ❌ Hope for best | ✅ Module coordination |
| Multi-language | ❌ Hard to maintain | ✅ Auto for all projects |

---

## 🚀 Next Steps

### Try it now:

```bash
# 1. Install
cd mcp-servers/auto-doc-sync
./install.sh local

# 2. Restart Claude Desktop

# 3. Test
User: Install auto-doc-sync vào my-project
User: Use prompt sync-and-review
User: Use prompt tech-stack-analysis
```

---

**All features working exactly like Construction Project + enhanced with AI prompts!** 🎉
