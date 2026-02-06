#!/usr/bin/env node

/**
 * Auto-Doc-Sync MCP Server
 *
 * Provides automatic documentation synchronization for any codebase.
 * Features:
 * - Auto-update CHANGES.md on every commit
 * - Generate AI-readable CONTEXT.md
 * - Module-based documentation
 * - Team sync capabilities
 * - Deduplication & conflict prevention
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class AutoDocSyncServer {
  constructor() {
    this.server = new Server(
      {
        name: 'auto-doc-sync-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
    this.setupPromptHandlers();

    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'install',
          description: 'Install auto-doc-sync hook in a project. Detects project type (Flutter, Node.js, Python, etc.) and sets up appropriate module detection.',
          inputSchema: {
            type: 'object',
            properties: {
              project_path: {
                type: 'string',
                description: 'Path to the project root directory',
              },
              auto_detect: {
                type: 'boolean',
                description: 'Auto-detect project type and modules',
                default: true,
              },
            },
            required: ['project_path'],
          },
        },
        {
          name: 'sync',
          description: 'View recent changes and team activity. Shows comprehensive AI context including breaking changes, active modules, and dependencies.',
          inputSchema: {
            type: 'object',
            properties: {
              project_path: {
                type: 'string',
                description: 'Path to the project root',
              },
              module: {
                type: 'string',
                description: 'Optional: specific module to deep dive',
              },
            },
            required: ['project_path'],
          },
        },
        {
          name: 'configure_modules',
          description: 'Configure custom module detection rules for your project structure',
          inputSchema: {
            type: 'object',
            properties: {
              project_path: {
                type: 'string',
                description: 'Path to the project root',
              },
              module_rules: {
                type: 'array',
                description: 'Array of module detection rules',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    pattern: { type: 'string' },
                  },
                },
              },
            },
            required: ['project_path', 'module_rules'],
          },
        },
        {
          name: 'deduplicate',
          description: 'Clean up duplicate entries in CHANGES.md and module docs',
          inputSchema: {
            type: 'object',
            properties: {
              project_path: {
                type: 'string',
                description: 'Path to the project root',
              },
              target: {
                type: 'string',
                enum: ['all', 'changes', 'modules'],
                description: 'What to deduplicate',
                default: 'all',
              },
            },
            required: ['project_path'],
          },
        },
        {
          name: 'run_hook',
          description: 'Manually run the auto-doc-sync hook to update documentation',
          inputSchema: {
            type: 'object',
            properties: {
              project_path: {
                type: 'string',
                description: 'Path to the project root',
              },
            },
            required: ['project_path'],
          },
        },
        // Multi-Dev Coordination Tools
        {
          name: 'check_conflicts',
          description: 'Check for potential conflicts before editing a file. Detects: other Claude sessions editing same file, remote changes not pulled, local uncommitted changes.',
          inputSchema: {
            type: 'object',
            properties: {
              project_path: {
                type: 'string',
                description: 'Path to the project root',
              },
              file_path: {
                type: 'string',
                description: 'File path to check for conflicts',
              },
            },
            required: ['project_path', 'file_path'],
          },
        },
        {
          name: 'list_sessions',
          description: 'List all active Claude sessions working on this project. Shows developer, hostname, branch, and files being edited.',
          inputSchema: {
            type: 'object',
            properties: {
              project_path: {
                type: 'string',
                description: 'Path to the project root',
              },
              include_stale: {
                type: 'boolean',
                description: 'Include stale/inactive sessions',
                default: false,
              },
            },
            required: ['project_path'],
          },
        },
        {
          name: 'register_session',
          description: 'Register current Claude session for multi-dev coordination. Required for WIP tracking and conflict detection.',
          inputSchema: {
            type: 'object',
            properties: {
              project_path: {
                type: 'string',
                description: 'Path to the project root',
              },
              working_on: {
                type: 'string',
                description: 'Brief description of what you are working on',
              },
            },
            required: ['project_path'],
          },
        },
        {
          name: 'cleanup_sessions',
          description: 'Clean up stale and abandoned Claude sessions. Removes sessions inactive for more than 30 minutes.',
          inputSchema: {
            type: 'object',
            properties: {
              project_path: {
                type: 'string',
                description: 'Path to the project root',
              },
            },
            required: ['project_path'],
          },
        },
        {
          name: 'end_session',
          description: 'End current Claude session and clean up WIP tracking.',
          inputSchema: {
            type: 'object',
            properties: {
              project_path: {
                type: 'string',
                description: 'Path to the project root',
              },
            },
            required: ['project_path'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'install':
            return await this.handleInstall(args);
          case 'sync':
            return await this.handleSync(args);
          case 'configure_modules':
            return await this.handleConfigureModules(args);
          case 'deduplicate':
            return await this.handleDeduplicate(args);
          case 'run_hook':
            return await this.handleRunHook(args);
          // Multi-Dev Coordination
          case 'check_conflicts':
            return await this.handleCheckConflicts(args);
          case 'list_sessions':
            return await this.handleListSessions(args);
          case 'register_session':
            return await this.handleRegisterSession(args);
          case 'cleanup_sessions':
            return await this.handleCleanupSessions(args);
          case 'end_session':
            return await this.handleEndSession(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  setupResourceHandlers() {
    this.server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
      const projectPath = request.params?.project_path || process.cwd();

      const resources = [
        {
          uri: `file://${projectPath}/CHANGES.md`,
          mimeType: 'text/markdown',
          name: 'Global Changelog',
          description: 'Full changelog with all commits',
        },
        {
          uri: `file://${projectPath}/docs/CONTEXT.md`,
          mimeType: 'text/markdown',
          name: 'AI Context',
          description: 'Comprehensive AI-readable context about codebase state',
        },
      ];

      // Add module docs if they exist
      const moduleDocsDir = join(projectPath, 'docs/modules');
      if (existsSync(moduleDocsDir)) {
        const moduleFiles = this.getModuleFiles(moduleDocsDir);
        moduleFiles.forEach(file => {
          resources.push({
            uri: `file://${join(moduleDocsDir, file)}`,
            mimeType: 'text/markdown',
            name: `Module: ${file.replace('.md', '')}`,
            description: `Per-module documentation for ${file.replace('.md', '')}`,
          });
        });
      }

      return { resources };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;
      const filePath = uri.replace('file://', '');

      if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const content = readFileSync(filePath, 'utf-8');

      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: content,
          },
        ],
      };
    });
  }

  setupPromptHandlers() {
    this.server.setRequestHandler(
      { method: 'prompts/list' },
      async () => {
        return {
          prompts: [
            {
              name: 'sync-and-review',
              description: 'View recent changes and provide review recommendations',
              arguments: [
                {
                  name: 'project_path',
                  description: 'Path to the project root',
                  required: true,
                },
              ],
            },
            {
              name: 'onboarding-guide',
              description: 'Generate onboarding guide based on recent activity',
              arguments: [
                {
                  name: 'project_path',
                  description: 'Path to the project root',
                  required: true,
                },
              ],
            },
            {
              name: 'tech-stack-analysis',
              description: 'Analyze tech stack and generate project-specific best practices',
              arguments: [
                {
                  name: 'project_path',
                  description: 'Path to the project root',
                  required: true,
                },
              ],
            },
            {
              name: 'module-coordination',
              description: 'Check which modules need coordination before coding',
              arguments: [
                {
                  name: 'project_path',
                  description: 'Path to the project root',
                  required: true,
                },
                {
                  name: 'target_module',
                  description: 'Module you plan to work on',
                  required: false,
                },
              ],
            },
          ],
        };
      }
    );

    this.server.setRequestHandler(
      { method: 'prompts/get' },
      async (request) => {
        const { name, arguments: args } = request.params;
        const projectPath = args?.project_path || process.cwd();

        switch (name) {
          case 'sync-and-review':
            return this.generateSyncAndReviewPrompt(projectPath);
          case 'onboarding-guide':
            return this.generateOnboardingPrompt(projectPath);
          case 'tech-stack-analysis':
            return this.generateTechStackPrompt(projectPath);
          case 'module-coordination':
            return this.generateModuleCoordinationPrompt(projectPath, args?.target_module);
          default:
            throw new Error(`Unknown prompt: ${name}`);
        }
      }
    );
  }

  // Prompt Generators

  generateSyncAndReviewPrompt(projectPath) {
    const contextPath = join(projectPath, 'docs/CONTEXT.md');
    const changesPath = join(projectPath, 'CHANGES.md');

    if (!existsSync(contextPath)) {
      throw new Error('Auto-doc-sync not installed. Run "install" first.');
    }

    const context = readFileSync(contextPath, 'utf-8');
    const changes = existsSync(changesPath) ? readFileSync(changesPath, 'utf-8') : '';

    // Detect tech stack
    const techStack = this.detectTechStack(projectPath);

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `# Team Sync & Code Review

You are a senior ${techStack.primary} developer reviewing recent changes to help the team coordinate and avoid conflicts.

## Project Context

${context}

## Recent Changes

${this.extractRecentChanges(changes, 10)}

## Your Task

Based on the above context, provide:

1. **High-Risk Modules**: Which modules have high activity and need coordination?
2. **Breaking Changes**: Any breaking changes team should know about?
3. **Dependency Updates**: What packages need to be installed?
4. **Recommendations**: What should developers check before starting new work?

Format your response in Vietnamese for team communication.`,
          },
        },
      ],
    };
  }

  generateOnboardingPrompt(projectPath) {
    const contextPath = join(projectPath, 'docs/CONTEXT.md');

    if (!existsSync(contextPath)) {
      throw new Error('Auto-doc-sync not installed.');
    }

    const context = readFileSync(contextPath, 'utf-8');
    const techStack = this.detectTechStack(projectPath);

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `# Onboarding Guide Generator

Generate a comprehensive onboarding guide for new developers joining this ${techStack.primary} project.

## Project Context

${context}

## Tech Stack Detected

${JSON.stringify(techStack, null, 2)}

## Your Task

Create a detailed onboarding guide covering:

1. **Project Overview**: Architecture, tech stack, key modules
2. **Setup Instructions**: Installation, dependencies, environment
3. **Recent Activity**: What's being actively developed
4. **Best Practices**: Coding standards, patterns used
5. **Where to Start**: Good first issues, modules to explore

Make it beginner-friendly in Vietnamese.`,
          },
        },
      ],
    };
  }

  generateTechStackPrompt(projectPath) {
    const techStack = this.detectTechStack(projectPath);
    const contextPath = join(projectPath, 'docs/CONTEXT.md');
    const context = existsSync(contextPath) ? readFileSync(contextPath, 'utf-8') : '';

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `# Tech Stack Analysis & Best Practices

Analyze this project's tech stack and provide customized best practices.

## Detected Tech Stack

\`\`\`json
${JSON.stringify(techStack, null, 2)}
\`\`\`

## Current Codebase Context

${context}

## Your Task

Provide tech-stack-specific guidance:

1. **${techStack.primary} Best Practices**: Latest patterns and conventions for this stack
2. **Architecture Recommendations**: Based on detected patterns in CONTEXT.md
3. **Security Considerations**: Common vulnerabilities for this tech stack
4. **Performance Tips**: Optimization techniques
5. **Testing Strategy**: Appropriate testing approaches
6. **Tooling**: Recommended dev tools, linters, formatters

Format in Vietnamese with code examples where appropriate.`,
          },
        },
      ],
    };
  }

  generateModuleCoordinationPrompt(projectPath, targetModule) {
    const contextPath = join(projectPath, 'docs/CONTEXT.md');

    if (!existsSync(contextPath)) {
      throw new Error('Auto-doc-sync not installed.');
    }

    const context = readFileSync(contextPath, 'utf-8');

    let moduleInfo = '';
    if (targetModule) {
      const modulePath = join(projectPath, `docs/modules/${targetModule}.md`);
      if (existsSync(modulePath)) {
        moduleInfo = readFileSync(modulePath, 'utf-8');
      }
    }

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `# Module Coordination Check

${targetModule ? `You plan to work on the **${targetModule}** module.` : 'Checking all modules for coordination needs.'}

## Overall Project Activity

${context}

${moduleInfo ? `## ${targetModule} Module Details\n\n${moduleInfo}` : ''}

## Your Task

Analyze the activity and provide coordination guidance:

1. **Conflict Risk**: How likely are conflicts if you start working now?
2. **Active Developers**: Who's currently working on ${targetModule || 'these modules'}?
3. **Recent Changes**: What changed recently that might affect your work?
4. **Coordination Needed**: Should you check with team before proceeding?
5. **Safe to Proceed**: Can you start coding or should you wait/coordinate?

Be specific and actionable. Format in Vietnamese.`,
          },
        },
      ],
    };
  }

  detectTechStack(projectPath) {
    const stack = {
      primary: 'Generic',
      languages: [],
      frameworks: [],
      tools: [],
    };

    // Flutter
    if (existsSync(join(projectPath, 'pubspec.yaml'))) {
      stack.primary = 'Flutter';
      stack.languages.push('Dart');
      stack.frameworks.push('Flutter');

      // Check for state management
      const pubspec = readFileSync(join(projectPath, 'pubspec.yaml'), 'utf-8');
      if (pubspec.includes('provider:')) stack.frameworks.push('Provider');
      if (pubspec.includes('bloc:')) stack.frameworks.push('BLoC');
      if (pubspec.includes('riverpod:')) stack.frameworks.push('Riverpod');
    }

    // Node.js / JavaScript / TypeScript
    if (existsSync(join(projectPath, 'package.json'))) {
      const packageJson = JSON.parse(readFileSync(join(projectPath, 'package.json'), 'utf-8'));

      if (packageJson.dependencies?.typescript || packageJson.devDependencies?.typescript) {
        stack.primary = 'TypeScript';
        stack.languages.push('TypeScript');
      } else {
        stack.primary = 'Node.js';
        stack.languages.push('JavaScript');
      }

      // Detect frameworks
      if (packageJson.dependencies?.react) {
        stack.frameworks.push('React');
        if (packageJson.dependencies?.['next']) stack.frameworks.push('Next.js');
      }
      if (packageJson.dependencies?.vue) stack.frameworks.push('Vue.js');
      if (packageJson.dependencies?.express) stack.frameworks.push('Express');
      if (packageJson.dependencies?.['@nestjs/core']) stack.frameworks.push('NestJS');
    }

    // Python
    if (existsSync(join(projectPath, 'requirements.txt')) || existsSync(join(projectPath, 'setup.py'))) {
      stack.primary = 'Python';
      stack.languages.push('Python');

      if (existsSync(join(projectPath, 'requirements.txt'))) {
        const requirements = readFileSync(join(projectPath, 'requirements.txt'), 'utf-8');
        if (requirements.includes('django')) stack.frameworks.push('Django');
        if (requirements.includes('flask')) stack.frameworks.push('Flask');
        if (requirements.includes('fastapi')) stack.frameworks.push('FastAPI');
      }
    }

    // Ruby
    if (existsSync(join(projectPath, 'Gemfile'))) {
      stack.primary = 'Ruby';
      stack.languages.push('Ruby');

      const gemfile = readFileSync(join(projectPath, 'Gemfile'), 'utf-8');
      if (gemfile.includes('rails')) stack.frameworks.push('Ruby on Rails');
    }

    // Go
    if (existsSync(join(projectPath, 'go.mod'))) {
      stack.primary = 'Go';
      stack.languages.push('Go');
    }

    return stack;
  }

  // Tool Handlers

  async handleInstall(args) {
    const { project_path, auto_detect = true } = args;

    // Detect project type
    const projectType = auto_detect ? this.detectProjectType(project_path) : 'generic';

    // Copy hook template
    const hookDir = join(project_path, '.claude/hooks/auto-doc-sync');
    mkdirSync(hookDir, { recursive: true });

    // Generate hook script based on project type
    const hookScript = this.generateHookScript(projectType);
    const hookPath = join(hookDir, 'auto-doc-sync.js');
    writeFileSync(hookPath, hookScript, 'utf-8');

    // Copy deduplication scripts
    const dedupeChangesTemplate = join(__dirname, 'templates/deduplicate-changes.js');
    const dedupeModulesTemplate = join(__dirname, 'templates/deduplicate-module-docs.js');

    if (existsSync(dedupeChangesTemplate)) {
      const dedupeChangesPath = join(hookDir, 'deduplicate-changes.js');
      const dedupeChangesContent = readFileSync(dedupeChangesTemplate, 'utf-8');
      writeFileSync(dedupeChangesPath, dedupeChangesContent, 'utf-8');
    }

    if (existsSync(dedupeModulesTemplate)) {
      const dedupeModulesPath = join(hookDir, 'deduplicate-module-docs.js');
      const dedupeModulesContent = readFileSync(dedupeModulesTemplate, 'utf-8');
      writeFileSync(dedupeModulesPath, dedupeModulesContent, 'utf-8');
    }

    // Copy team-context-sync hook (PreToolUse — injects team context into Claude)
    const teamSyncTemplate = join(__dirname, 'templates/team-context-sync.js');
    if (existsSync(teamSyncTemplate)) {
      const teamSyncDir = join(project_path, '.claude/hooks/team-context-sync');
      mkdirSync(teamSyncDir, { recursive: true });
      const teamSyncContent = readFileSync(teamSyncTemplate, 'utf-8');
      writeFileSync(join(teamSyncDir, 'team-context-sync.js'), teamSyncContent, 'utf-8');
    }

    // Copy Multi-Dev Coordination hooks
    const coordHooksDir = join(project_path, '.claude/hooks/multi-dev-coord');
    mkdirSync(coordHooksDir, { recursive: true });

    // WIP Tracker (PostToolUse)
    const wipTrackerTemplate = join(__dirname, 'templates/wip-tracker.js');
    if (existsSync(wipTrackerTemplate)) {
      writeFileSync(
        join(coordHooksDir, 'wip-tracker.js'),
        readFileSync(wipTrackerTemplate, 'utf-8'),
        'utf-8'
      );
    }

    // Conflict Checker (PreToolUse)
    const conflictCheckerTemplate = join(__dirname, 'templates/conflict-checker.js');
    if (existsSync(conflictCheckerTemplate)) {
      writeFileSync(
        join(coordHooksDir, 'conflict-checker.js'),
        readFileSync(conflictCheckerTemplate, 'utf-8'),
        'utf-8'
      );
    }

    // Remote Sync Checker (PreToolUse)
    const remoteSyncTemplate = join(__dirname, 'templates/remote-sync-checker.js');
    if (existsSync(remoteSyncTemplate)) {
      writeFileSync(
        join(coordHooksDir, 'remote-sync-checker.js'),
        readFileSync(remoteSyncTemplate, 'utf-8'),
        'utf-8'
      );
    }

    // Session Manager
    const sessionManagerTemplate = join(__dirname, 'templates/session-manager.js');
    if (existsSync(sessionManagerTemplate)) {
      writeFileSync(
        join(coordHooksDir, 'session-manager.js'),
        readFileSync(sessionManagerTemplate, 'utf-8'),
        'utf-8'
      );
    }

    // Create WIP and sessions directories
    mkdirSync(join(project_path, '.claude/wip'), { recursive: true });
    mkdirSync(join(project_path, '.claude/sessions'), { recursive: true });

    // Add to .gitignore
    const gitignorePath = join(project_path, '.gitignore');
    if (existsSync(gitignorePath)) {
      let gitignore = readFileSync(gitignorePath, 'utf-8');
      const additions = [];
      if (!gitignore.includes('.claude/wip/')) additions.push('.claude/wip/');
      if (!gitignore.includes('.claude/sessions/')) additions.push('.claude/sessions/');
      if (!gitignore.includes('.claude/cache/')) additions.push('.claude/cache/');

      if (additions.length > 0) {
        gitignore += '\n# Claude multi-dev coordination (auto-generated)\n';
        gitignore += additions.join('\n') + '\n';
        writeFileSync(gitignorePath, gitignore, 'utf-8');
      }
    }

    // Install as git post-commit hook
    this.installGitHook(project_path, hookPath);

    // Create initial documentation structure
    this.createInitialDocs(project_path);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Auto-Doc-Sync installed successfully!

**Project Type Detected**: ${projectType}

**Files Created**:
- .claude/hooks/auto-doc-sync/auto-doc-sync.js
- .claude/hooks/auto-doc-sync/deduplicate-changes.js
- .claude/hooks/auto-doc-sync/deduplicate-module-docs.js
- .claude/hooks/team-context-sync/team-context-sync.js
- .claude/hooks/multi-dev-coord/wip-tracker.js
- .claude/hooks/multi-dev-coord/conflict-checker.js
- .claude/hooks/multi-dev-coord/remote-sync-checker.js
- .claude/hooks/multi-dev-coord/session-manager.js
- .claude/wip/ (directory)
- .claude/sessions/ (directory)
- .git/hooks/post-commit
- CHANGES.md
- docs/CONTEXT.md
- docs/modules/ (directory)

**Next Steps**:
1. Add hooks to your settings.json:
   \`\`\`json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Edit|Write",
           "hooks": [{
             "type": "command",
             "command": "node \\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/multi-dev-coord/conflict-checker.js"
           }]
         },
         {
           "matcher": "Bash|Edit|Write",
           "hooks": [{
             "type": "command",
             "command": "node \\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/multi-dev-coord/remote-sync-checker.js"
           }]
         },
         {
           "matcher": "Bash|Edit|Write",
           "hooks": [{
             "type": "command",
             "command": "node \\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/team-context-sync/team-context-sync.js"
           }]
         }
       ],
       "PostToolUse": [
         {
           "matcher": "Edit|Write",
           "hooks": [{
             "type": "command",
             "command": "node \\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/multi-dev-coord/wip-tracker.js"
           }]
         }
       ]
     }
   }
   \`\`\`

2. Run \`register_session\` to start multi-dev tracking
3. Make a commit to test the documentation hook
4. Run \`list_sessions\` to see other active Claude sessions
5. Configure custom modules with \`/modules\` command if needed

**Multi-Dev Coordination Features**:
- 🔴 Real-time WIP tracking (who's editing what)
- 🛡️ Conflict detection before editing files
- 📡 Proactive remote change detection
- 👥 Multi-Claude session coordination
- 🧹 Automatic stale session cleanup`,
        },
      ],
    };
  }

  async handleSync(args) {
    const { project_path, module } = args;

    const changesPath = join(project_path, 'CHANGES.md');
    const contextPath = join(project_path, 'docs/CONTEXT.md');

    if (!existsSync(contextPath)) {
      throw new Error('Auto-doc-sync not installed. Run "install" first.');
    }

    let output = '# Team Sync Report\n\n';

    // Read CONTEXT.md
    const context = readFileSync(contextPath, 'utf-8');
    output += context;
    output += '\n\n---\n\n';

    // If specific module requested, show module details
    if (module) {
      const modulePath = join(project_path, `docs/modules/${module}.md`);
      if (existsSync(modulePath)) {
        output += `## Deep Dive: ${module} Module\n\n`;
        output += readFileSync(modulePath, 'utf-8');
      } else {
        output += `⚠️ Module "${module}" not found.\n`;
      }
    }

    // Show recent commits from CHANGES.md
    if (existsSync(changesPath)) {
      const changes = readFileSync(changesPath, 'utf-8');
      const recentChanges = this.extractRecentChanges(changes, 10);
      output += `## Recent Commits (Last 10)\n\n${recentChanges}`;
    }

    return {
      content: [
        {
          type: 'text',
          text: output,
        },
      ],
    };
  }

  async handleConfigureModules(args) {
    const { project_path, module_rules } = args;

    const configPath = join(project_path, '.claude/hooks/auto-doc-sync/config.json');
    const config = {
      modules: module_rules,
      updated: new Date().toISOString(),
    };

    writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

    return {
      content: [
        {
          type: 'text',
          text: `✅ Module configuration saved!

**Configured Modules**: ${module_rules.length}

${module_rules.map(r => `- **${r.name}**: \`${r.pattern}\``).join('\n')}

The hook will now use these rules to detect modules in commits.`,
        },
      ],
    };
  }

  async handleDeduplicate(args) {
    const { project_path, target = 'all' } = args;

    let output = '';

    if (target === 'all' || target === 'changes') {
      const dedupeChangesScript = join(project_path, '.claude/hooks/auto-doc-sync/deduplicate-changes.js');
      if (existsSync(dedupeChangesScript)) {
        try {
          const result = execSync(`node "${dedupeChangesScript}"`, {
            cwd: project_path,
            encoding: 'utf-8',
          });
          output += result + '\n';
        } catch (error) {
          output += `⚠️ Error deduplicating CHANGES.md: ${error.message}\n`;
        }
      } else {
        output += `⚠️ Deduplication script not found. Run 'install' first.\n`;
      }
    }

    if (target === 'all' || target === 'modules') {
      const dedupeModulesScript = join(project_path, '.claude/hooks/auto-doc-sync/deduplicate-module-docs.js');
      if (existsSync(dedupeModulesScript)) {
        try {
          const result = execSync(`node "${dedupeModulesScript}"`, {
            cwd: project_path,
            encoding: 'utf-8',
          });
          output += result;
        } catch (error) {
          output += `⚠️ Error deduplicating module docs: ${error.message}\n`;
        }
      } else {
        output += `⚠️ Deduplication script not found. Run 'install' first.\n`;
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: output || '✅ Deduplication complete!',
        },
      ],
    };
  }

  async handleRunHook(args) {
    const { project_path } = args;

    const hookPath = join(project_path, '.claude/hooks/auto-doc-sync/auto-doc-sync.js');

    if (!existsSync(hookPath)) {
      throw new Error('Auto-doc-sync not installed. Run "install" first.');
    }

    // Run the hook
    const output = execSync(`node "${hookPath}"`, {
      cwd: project_path,
      encoding: 'utf-8',
    });

    return {
      content: [
        {
          type: 'text',
          text: `✅ Hook executed successfully!\n\n${output}`,
        },
      ],
    };
  }

  // ========== Multi-Dev Coordination Tools ==========

  async handleCheckConflicts(args) {
    const { project_path, file_path } = args;

    const wipDir = join(project_path, '.claude/wip');
    const relativePath = file_path.replace(project_path, '').replace(/^[\/\\]/, '');
    const conflicts = [];
    let output = `# Conflict Check: ${relativePath}\n\n`;

    // 1. Check WIP conflicts (other sessions)
    if (existsSync(wipDir)) {
      const sessionFiles = this.getFilesInDir(wipDir, '.json');
      const staleThreshold = 30 * 60 * 1000; // 30 minutes
      const now = Date.now();

      for (const file of sessionFiles) {
        try {
          const data = JSON.parse(readFileSync(join(wipDir, file), 'utf-8'));
          const lastActivity = new Date(data.lastActivity).getTime();

          if (now - lastActivity > staleThreshold) continue;

          if (data.files && data.files[relativePath]) {
            conflicts.push({
              type: 'wip',
              developer: data.developer,
              hostname: data.hostname,
              lastAccess: data.files[relativePath].lastAccess,
              accessCount: data.files[relativePath].accessCount
            });
          }
        } catch {}
      }
    }

    // 2. Check remote changes
    let remoteChanges = null;
    try {
      execSync('git fetch --quiet', { cwd: project_path, stdio: 'ignore' });
      const branch = execSync('git rev-parse --abbrev-ref HEAD', {
        cwd: project_path, encoding: 'utf-8'
      }).trim();

      const diff = execSync(
        `git diff HEAD..origin/${branch} -- "${relativePath}" 2>/dev/null`,
        { cwd: project_path, encoding: 'utf-8' }
      ).trim();

      if (diff) {
        remoteChanges = {
          branch,
          hasDiff: true,
          diffPreview: diff.substring(0, 300)
        };
      }
    } catch {}

    // 3. Check local uncommitted changes
    let localChanges = null;
    try {
      const status = execSync(
        `git status --porcelain -- "${relativePath}"`,
        { cwd: project_path, encoding: 'utf-8' }
      ).trim();

      if (status) {
        localChanges = { status };
      }
    } catch {}

    // Build report
    if (conflicts.length > 0) {
      output += `## 🔴 Active Conflicts\n\n`;
      output += `Other Claude sessions are editing this file:\n\n`;
      for (const c of conflicts) {
        output += `- **${c.developer}@${c.hostname}**\n`;
        output += `  - Last access: ${c.lastAccess}\n`;
        output += `  - Edit count: ${c.accessCount}\n\n`;
      }
    }

    if (remoteChanges) {
      output += `## 🟡 Remote Changes\n\n`;
      output += `File has changes on remote branch \`origin/${remoteChanges.branch}\` not yet pulled.\n\n`;
      output += `\`\`\`diff\n${remoteChanges.diffPreview}...\n\`\`\`\n\n`;
      output += `**Action**: Run \`git pull\` before editing.\n\n`;
    }

    if (localChanges) {
      output += `## 🟠 Local Changes\n\n`;
      output += `File has uncommitted local changes:\n`;
      output += `\`\`\`\n${localChanges.status}\n\`\`\`\n\n`;
    }

    if (conflicts.length === 0 && !remoteChanges && !localChanges) {
      output += `## ✅ No Conflicts Detected\n\n`;
      output += `Safe to edit this file.\n`;
    } else {
      output += `---\n\n## Recommendations\n\n`;
      if (conflicts.length > 0) {
        output += `1. Coordinate with other developers before editing\n`;
      }
      if (remoteChanges) {
        output += `2. Run \`git pull\` to get latest changes\n`;
      }
      if (localChanges) {
        output += `3. Commit or stash local changes first\n`;
      }
    }

    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleListSessions(args) {
    const { project_path, include_stale = false } = args;

    const sessionsDir = join(project_path, '.claude/sessions');
    const wipDir = join(project_path, '.claude/wip');

    if (!existsSync(sessionsDir) && !existsSync(wipDir)) {
      return {
        content: [{
          type: 'text',
          text: `No sessions found. Run \`register_session\` to start tracking.`
        }],
      };
    }

    const sessions = [];
    const staleThreshold = 30 * 60 * 1000;
    const now = Date.now();

    // Read from sessions dir
    if (existsSync(sessionsDir)) {
      const files = this.getFilesInDir(sessionsDir, '.json');
      for (const file of files) {
        try {
          const data = JSON.parse(readFileSync(join(sessionsDir, file), 'utf-8'));
          const lastActivity = new Date(data.lastHeartbeat || data.lastActivity).getTime();
          const age = now - lastActivity;

          const status = data.status === 'ended' ? 'ended'
            : age > staleThreshold ? 'stale' : 'active';

          if (!include_stale && status !== 'active') continue;

          sessions.push({
            ...data,
            displayStatus: status,
            ageMinutes: Math.floor(age / 60000)
          });
        } catch {}
      }
    }

    // Also check WIP for sessions not in sessions dir
    if (existsSync(wipDir)) {
      const wipFiles = this.getFilesInDir(wipDir, '.json');
      for (const file of wipFiles) {
        try {
          const data = JSON.parse(readFileSync(join(wipDir, file), 'utf-8'));
          const lastActivity = new Date(data.lastActivity).getTime();
          const age = now - lastActivity;

          if (age > staleThreshold && !include_stale) continue;

          // Check if already in sessions
          const exists = sessions.find(s => s.sessionId === data.sessionId);
          if (!exists) {
            sessions.push({
              ...data,
              displayStatus: age > staleThreshold ? 'stale' : 'active',
              ageMinutes: Math.floor(age / 60000)
            });
          }
        } catch {}
      }
    }

    // Build output
    let output = `# Active Claude Sessions\n\n`;
    output += `Found ${sessions.length} session(s)\n\n`;

    const statusIcons = { active: '🟢', stale: '🟡', ended: '⚫' };

    for (const s of sessions) {
      output += `## ${statusIcons[s.displayStatus]} ${s.developer}@${s.hostname}\n\n`;
      output += `- **Session ID**: \`${s.sessionId}\`\n`;
      output += `- **Status**: ${s.displayStatus}\n`;
      output += `- **Branch**: ${s.branch || 'unknown'}\n`;
      output += `- **Started**: ${s.started}\n`;
      output += `- **Last Activity**: ${s.ageMinutes} minutes ago\n`;

      const fileCount = Object.keys(s.files || {}).length;
      if (fileCount > 0) {
        output += `- **Files being edited**: ${fileCount}\n`;
        const files = Object.keys(s.files).slice(0, 5);
        for (const f of files) {
          output += `  - ${f}\n`;
        }
        if (fileCount > 5) {
          output += `  - ... and ${fileCount - 5} more\n`;
        }
      }
      output += '\n';
    }

    if (sessions.length === 0) {
      output += `No active sessions found.\n`;
    }

    return {
      content: [{ type: 'text', text: output }],
    };
  }

  async handleRegisterSession(args) {
    const { project_path, working_on } = args;

    const sessionsDir = join(project_path, '.claude/sessions');
    const wipDir = join(project_path, '.claude/wip');

    mkdirSync(sessionsDir, { recursive: true });
    mkdirSync(wipDir, { recursive: true });

    // Generate session ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    const developer = process.env.USER || process.env.USERNAME || 'claude';
    const sessionId = `${developer}-${timestamp}-${random}`;

    // Get current branch
    let branch = 'unknown';
    try {
      branch = execSync('git rev-parse --abbrev-ref HEAD', {
        cwd: project_path, encoding: 'utf-8'
      }).trim();
    } catch {}

    const sessionData = {
      sessionId,
      developer,
      hostname: require('os').hostname(),
      platform: process.platform,
      started: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString(),
      status: 'active',
      workingOn: working_on || null,
      branch,
      files: {},
      stats: { toolCalls: 0, edits: 0, writes: 0, reads: 0 }
    };

    // Save to sessions dir
    writeFileSync(
      join(sessionsDir, `${sessionId}.json`),
      JSON.stringify(sessionData, null, 2),
      'utf-8'
    );

    // Save to WIP dir
    writeFileSync(
      join(wipDir, `${sessionId}.json`),
      JSON.stringify({
        sessionId,
        developer,
        hostname: sessionData.hostname,
        started: sessionData.started,
        lastActivity: sessionData.lastHeartbeat,
        files: {},
        stats: sessionData.stats
      }, null, 2),
      'utf-8'
    );

    return {
      content: [{
        type: 'text',
        text: `✅ Session registered successfully!

**Session ID**: \`${sessionId}\`
**Developer**: ${developer}
**Branch**: ${branch}
**Working On**: ${working_on || 'Not specified'}

Your session is now tracked. Other Claude instances will see your activity.

**Next steps**:
1. Add conflict-checker hook to settings.json for automatic conflict detection
2. Run \`list_sessions\` to see other active sessions
3. Run \`end_session\` when done`
      }],
    };
  }

  async handleCleanupSessions(args) {
    const { project_path } = args;

    const sessionsDir = join(project_path, '.claude/sessions');
    const wipDir = join(project_path, '.claude/wip');

    let cleaned = { sessions: 0, wip: 0 };
    const staleThreshold = 30 * 60 * 1000;
    const now = Date.now();

    // Clean sessions
    if (existsSync(sessionsDir)) {
      const files = this.getFilesInDir(sessionsDir, '.json');
      for (const file of files) {
        try {
          const filePath = join(sessionsDir, file);
          const data = JSON.parse(readFileSync(filePath, 'utf-8'));
          const lastActivity = new Date(data.lastHeartbeat || data.started).getTime();

          if (now - lastActivity > staleThreshold || data.status === 'ended') {
            require('fs').unlinkSync(filePath);
            cleaned.sessions++;
          }
        } catch {
          try {
            require('fs').unlinkSync(join(sessionsDir, file));
            cleaned.sessions++;
          } catch {}
        }
      }
    }

    // Clean WIP
    if (existsSync(wipDir)) {
      const files = this.getFilesInDir(wipDir, '.json');
      for (const file of files) {
        try {
          const filePath = join(wipDir, file);
          const data = JSON.parse(readFileSync(filePath, 'utf-8'));
          const lastActivity = new Date(data.lastActivity || data.started).getTime();

          if (now - lastActivity > staleThreshold) {
            require('fs').unlinkSync(filePath);
            cleaned.wip++;
          }
        } catch {
          try {
            require('fs').unlinkSync(join(wipDir, file));
            cleaned.wip++;
          } catch {}
        }
      }
    }

    return {
      content: [{
        type: 'text',
        text: `🧹 Cleanup complete!

**Sessions removed**: ${cleaned.sessions}
**WIP entries removed**: ${cleaned.wip}

Stale sessions (inactive > 30 minutes) have been cleaned up.`
      }],
    };
  }

  async handleEndSession(args) {
    const { project_path } = args;

    // Find current session (most recent one from this process)
    const sessionsDir = join(project_path, '.claude/sessions');
    const wipDir = join(project_path, '.claude/wip');

    let endedCount = 0;

    // For now, we'll end all sessions from this developer
    const developer = process.env.USER || process.env.USERNAME || 'claude';

    if (existsSync(sessionsDir)) {
      const files = this.getFilesInDir(sessionsDir, '.json');
      for (const file of files) {
        if (file.startsWith(developer)) {
          try {
            const filePath = join(sessionsDir, file);
            const data = JSON.parse(readFileSync(filePath, 'utf-8'));
            data.status = 'ended';
            data.endedAt = new Date().toISOString();
            writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
            endedCount++;
          } catch {}
        }
      }
    }

    // Remove from WIP
    if (existsSync(wipDir)) {
      const files = this.getFilesInDir(wipDir, '.json');
      for (const file of files) {
        if (file.startsWith(developer)) {
          try {
            require('fs').unlinkSync(join(wipDir, file));
          } catch {}
        }
      }
    }

    return {
      content: [{
        type: 'text',
        text: `✅ Session(s) ended!

**Sessions ended**: ${endedCount}
**Developer**: ${developer}

Your WIP tracking has been cleared. Other sessions will no longer see your activity.`
      }],
    };
  }

  getFilesInDir(dir, extension) {
    try {
      return require('fs').readdirSync(dir).filter(f => f.endsWith(extension));
    } catch {
      return [];
    }
  }

  // Helper Methods

  detectProjectType(projectPath) {
    if (existsSync(join(projectPath, 'pubspec.yaml'))) return 'flutter';
    if (existsSync(join(projectPath, 'package.json'))) return 'nodejs';
    if (existsSync(join(projectPath, 'requirements.txt'))) return 'python';
    if (existsSync(join(projectPath, 'Gemfile'))) return 'ruby';
    if (existsSync(join(projectPath, 'go.mod'))) return 'go';
    return 'generic';
  }

  generateHookScript(projectType) {
    // Read the template from the codebase
    const templatePath = join(__dirname, 'templates', `${projectType}-hook.js`);
    if (existsSync(templatePath)) {
      return readFileSync(templatePath, 'utf-8');
    }

    // Fallback to generic template
    return readFileSync(join(__dirname, 'templates', 'generic-hook.js'), 'utf-8');
  }

  installGitHook(projectPath, hookScriptPath) {
    const gitHookPath = join(projectPath, '.git/hooks/post-commit');
    const hookContent = `#!/bin/sh
# Auto-Doc-Sync Hook
node "${hookScriptPath}"
`;
    writeFileSync(gitHookPath, hookContent, 'utf-8');
    execSync(`chmod +x "${gitHookPath}"`);
  }

  createInitialDocs(projectPath) {
    // Create CHANGES.md
    const changesPath = join(projectPath, 'CHANGES.md');
    if (!existsSync(changesPath)) {
      writeFileSync(changesPath, '# Changes Log\n\n', 'utf-8');
    }

    // Create docs/CONTEXT.md
    const docsDir = join(projectPath, 'docs');
    mkdirSync(docsDir, { recursive: true });

    const contextPath = join(docsDir, 'CONTEXT.md');
    if (!existsSync(contextPath)) {
      writeFileSync(contextPath, '# Project Context\n\n**Auto-generated AI Context**\n\n', 'utf-8');
    }

    // Create docs/modules/
    const moduleDocsDir = join(docsDir, 'modules');
    mkdirSync(moduleDocsDir, { recursive: true });
  }

  extractRecentChanges(changesContent, limit = 10) {
    const lines = changesContent.split('\n');
    const commitLines = [];

    for (const line of lines) {
      if (line.match(/^- \*\*[a-f0-9]{7}\*\*/)) {
        commitLines.push(line);
        if (commitLines.length >= limit) break;
      }
    }

    return commitLines.join('\n');
  }

  getModuleFiles(moduleDocsDir) {
    try {
      const files = execSync(`ls "${moduleDocsDir}"`, { encoding: 'utf-8' });
      return files.split('\n').filter(f => f.endsWith('.md'));
    } catch {
      return [];
    }
  }

  deduplicateChanges(projectPath) {
    const changesPath = join(projectPath, 'CHANGES.md');
    if (!existsSync(changesPath)) return 0;

    const content = readFileSync(changesPath, 'utf-8');
    const lines = content.split('\n');
    const seenHashes = new Set();
    const dedupedLines = [];
    let removed = 0;

    for (const line of lines) {
      const match = line.match(/^- \*\*([a-f0-9]{7})\*\*/);
      if (match) {
        const hash = match[1];
        if (seenHashes.has(hash)) {
          removed++;
          continue;
        }
        seenHashes.add(hash);
      }
      dedupedLines.push(line);
    }

    writeFileSync(changesPath, dedupedLines.join('\n'), 'utf-8');
    return removed;
  }

  deduplicateModules(projectPath) {
    const moduleDocsDir = join(projectPath, 'docs/modules');
    if (!existsSync(moduleDocsDir)) return 0;

    const files = this.getModuleFiles(moduleDocsDir);
    let totalRemoved = 0;

    for (const file of files) {
      const filePath = join(moduleDocsDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const seenHashes = new Set();
      const dedupedLines = [];
      let removed = 0;

      for (const line of lines) {
        const match = line.match(/\(([a-f0-9]{7})\)/);
        if (match) {
          const hash = match[1];
          if (seenHashes.has(hash)) {
            removed++;
            continue;
          }
          seenHashes.add(hash);
        }
        dedupedLines.push(line);
      }

      writeFileSync(filePath, dedupedLines.join('\n'), 'utf-8');
      totalRemoved += removed;
    }

    return totalRemoved;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Auto-Doc-Sync MCP Server running on stdio');
  }
}

const server = new AutoDocSyncServer();
server.run().catch(console.error);
