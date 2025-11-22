import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { generateObject } from 'ai';
import { z } from 'zod';

// Color theme constants
const THEME = {
  primary: '#8B5CF6',
  secondary: '#06D6A0',
  accent: '#64B5F6',
  warning: '#FFD166',
  error: '#EF4444',
  success: '#10B981',
  info: '#6366F1',
  muted: '#6B7280',
  background: '#0F0F23',
};

//* Zod schema for structured application generation
const ApplicationSchema = z.object({
  folderName: z.string().describe('Kebab-case folder name for the application'),
  description: z.string().describe('Brief description of what was created'),
  files: z
    .array(
      z.object({
        path: z.string().describe('Relative file path (e.g., src/App.jsx)'),
        content: z.string().describe('Complete file content'),
      })
    )
    .describe('All files needed for the application'),
  setupCommands: z
    .array(z.string())
    .describe('Bash commands to setup and run (e.g., npm install, npm run dev)'),
});

//* Console logging helpers
function printSystem(message) {
  console.log(message);
}

//* Display file tree structure
function displayFileTree(files, folderName) {
  printSystem(chalk.hex(THEME.accent)('\n📂 Project Structure:'));
  printSystem(chalk.hex(THEME.muted)(`${folderName}/`));

  const filesByDir = {};
  files.forEach(file => {
    const parts = file.path.split('/');
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '';

    if (!filesByDir[dir]) {
      filesByDir[dir] = [];
    }
    filesByDir[dir].push(parts[parts.length - 1]);
  });

  Object.keys(filesByDir)
    .sort()
    .forEach(dir => {
      if (dir) {
        printSystem(chalk.hex(THEME.muted)(`├── ${dir}/`));
        filesByDir[dir].forEach(file => {
          printSystem(chalk.hex(THEME.muted)(`│   └── ${file}`));
        });
      } else {
        filesByDir[dir].forEach(file => {
          printSystem(chalk.hex(THEME.muted)(`├── ${file}`));
        });
      }
    });
}

//* Create application files
async function createApplicationFiles(baseDir, folderName, files) {
  const appDir = path.join(baseDir, folderName);

  await fs.mkdir(appDir, { recursive: true });
  printSystem(chalk.hex(THEME.accent)(`\n📁 Created directory: ${folderName}/`));

  for (const file of files) {
    const filePath = path.join(appDir, file.path);
    const fileDir = path.dirname(filePath);

    await fs.mkdir(fileDir, { recursive: true });
    await fs.writeFile(filePath, file.content, 'utf8');
    printSystem(chalk.hex(THEME.success)(`  ✓ ${file.path}`));
  }

  return appDir;
}

//* Generate application using structured output
export async function generateApplication(description, aiService, cwd = process.cwd()) {
  try {
    printSystem(chalk.hex(THEME.primary)('\n🤖 Agent Mode: Generating your application...\n'));
    printSystem(chalk.hex(THEME.muted)(`Request: ${description}\n`));

    printSystem(chalk.hex(THEME.info)('🤖 Generating structured output...\n'));

    const result = await generateObject({
      model: aiService.model,
      schema: ApplicationSchema,
      prompt: `Generate a fully functional, production-ready application based on the following description:

${description}

MANDATORY REQUIREMENTS:
1. Produce EVERY file required for the application to run without modifications.
2. If applicable, include a complete package.json with all dependencies, correct versions, and scripts.
3. Provide a comprehensive README.md with setup, installation, and usage instructions.
4. Include all necessary configuration files (e.g., .gitignore, tsconfig.json, env examples, build configs).
5. Deliver clean, maintainable, well-structured, and well-commented production-quality code.
6. Implement robust error handling, input validation, and safe defaults.
7. Follow modern JavaScript/TypeScript standards and best practices.
8. Ensure all imports, file paths, module references, and folder structures are correct.
9. Absolutely NO placeholders or incomplete sections—everything must be final and runnable.
10. For basic HTML/CSS/JS applications, omit package.json only if unnecessary.

OUTPUT FORMAT:
- A meaningful kebab-case root folder name for the project.
- A full list of all generated files with complete contents.
- Exact setup, installation, and execution commands (e.g., "cd <folder>", "npm install", "npm run dev", or "open index.html").
- Ensure the final application is fully functional, visually polished, and ready for immediate use.`,
    });

    const application = result.object;

    printSystem(chalk.hex(THEME.success)(`\n✅ Generated: ${application.folderName}\n`));
    printSystem(chalk.hex(THEME.muted)(`Description: ${application.description}\n`));

    if (!application.files || application.files.length === 0) {
      throw new Error('No files were generated');
    }

    printSystem(chalk.hex(THEME.success)(`Files: ${application.files.length}\n`));

    // Display file tree
    displayFileTree(application.files, application.folderName);

    // Create application directory and files
    printSystem(chalk.hex(THEME.accent)('\n📝 Creating files...\n'));
    const appDir = await createApplicationFiles(cwd, application.folderName, application.files);

    // Display results
    printSystem(chalk.hex(THEME.success).bold(`\n✨ Application created successfully!\n`));
    printSystem(chalk.hex(THEME.accent)(`📁 Location: ${chalk.hex(THEME.primary).bold(appDir)}\n`));

    // Display setup commands
    if (application.setupCommands && application.setupCommands.length > 0) {
      printSystem(chalk.hex(THEME.accent)('📋 Next Steps:\n'));
      printSystem(chalk.hex(THEME.muted)('```bash'));
      application.setupCommands.forEach(cmd => {
        printSystem(chalk.hex(THEME.muted)(cmd));
      });
      printSystem(chalk.hex(THEME.muted)('```\n'));
    } else {
      printSystem(chalk.hex(THEME.warning)('ℹ️  No setup commands provided\n'));
    }

    return {
      folderName: application.folderName,
      appDir,
      files: application.files.map(f => f.path),
      commands: application.setupCommands || [],
      success: true,
    };
  } catch (err) {
    printSystem(chalk.hex(THEME.error)(`\n❌ Error generating application: ${err.message}\n`));
    if (err.stack) {
      printSystem(chalk.hex(THEME.muted).dim(err.stack + '\n'));
    }
    throw err;
  }
}
