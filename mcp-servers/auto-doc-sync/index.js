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
- .git/hooks/post-commit
- CHANGES.md
- docs/CONTEXT.md
- docs/modules/ (directory)

**Next Steps**:
1. Add team-context-sync to your settings.json PreToolUse hooks:
   \`\`\`json
   "PreToolUse": [{
     "matcher": "Bash|Write|Edit",
     "hooks": [{
       "type": "command",
       "command": "node \\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/team-context-sync/team-context-sync.js"
     }]
   }]
   \`\`\`
2. Make a commit to test the hook
3. Run \`auto-doc-sync-mcp sync\` to view changes
4. Configure custom modules with \`/modules\` command if needed

The hooks will now automatically update documentation after every commit and inject team context into Claude sessions!`,
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
