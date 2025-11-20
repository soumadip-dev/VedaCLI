import { google } from '@ai-sdk/google';
import chalk from 'chalk';

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

//* Available tools for the AI model
export const availableTools = [
  {
    id: 'google_search',
    name: 'Google Search',
    description:
      'Access the latest information using Google search. Useful for current events, news, and real-time information.',
    getTool: () => google.tools.googleSearch({}),
    enabled: false,
  },
  {
    id: 'code_execution',
    name: 'Code Execution',
    description:
      'Generate and execute Python code to perform calculations, solve problems, or provide accurate information.',
    getTool: () => google.tools.codeExecution({}),
    enabled: false,
  },
  {
    id: 'url_context',
    name: 'URL Context',
    description:
      'Provide specific URLs that you want the model to analyze directly from the prompt. Supports up to 20 URLs per request.',
    getTool: () => google.tools.urlContext({}),
    enabled: false,
  },
];

//* Get enabled tools
export function getEnabledTools() {
  const tools = {};

  try {
    for (const toolConfig of availableTools) {
      if (toolConfig.enabled) {
        // Instantiate the tool when needed
        tools[toolConfig.id] = toolConfig.getTool();
      }
    }

    // Debug logging
    if (Object.keys(tools).length > 0) {
      console.log(chalk.hex(THEME.muted)(`🔧 Enabled tools: ${Object.keys(tools).join(', ')}`));
    } else {
      console.log(chalk.hex(THEME.warning)('⚠️ No tools enabled'));
    }

    return Object.keys(tools).length > 0 ? tools : undefined;
  } catch (error) {
    console.error(chalk.hex(THEME.error)('❌ Failed to initialize tools:'), error.message);
    console.error(
      chalk.hex(THEME.warning)('💡 Make sure you have @ai-sdk/google version 2.0+ installed')
    );
    console.error(chalk.hex(THEME.warning)('📦 Run: npm install @ai-sdk/google@latest'));
    return undefined;
  }
}

//* Toggle a tool
export function toggleTool(toolId) {
  const tool = availableTools.find(t => t.id === toolId);
  if (tool) {
    tool.enabled = !tool.enabled;
    console.log(chalk.hex(THEME.muted)(`🛠️ Tool ${toolId} toggled to ${tool.enabled}`));
    return tool.enabled;
  }
  console.log(chalk.hex(THEME.error)(`❌ Tool ${toolId} not found`));
  return false;
}

//* Enable tools
export function enableTools(toolIds) {
  console.log(chalk.hex(THEME.muted)('🔧 enableTools called with:'), toolIds);

  availableTools.forEach(tool => {
    const wasEnabled = tool.enabled;
    tool.enabled = toolIds.includes(tool.id);

    if (tool.enabled !== wasEnabled) {
      console.log(chalk.hex(THEME.muted)(`🛠️ ${tool.id}: ${wasEnabled} → ${tool.enabled}`));
    }
  });

  const enabledCount = availableTools.filter(t => t.enabled).length;
  console.log(
    chalk.hex(THEME.muted)(`📊 Total tools enabled: ${enabledCount}/${availableTools.length}`)
  );
}

//* Get enabled tool names
export function getEnabledToolNames() {
  const names = availableTools.filter(t => t.enabled).map(t => t.name);
  console.log(chalk.hex(THEME.muted)(`🔧 getEnabledToolNames returning:`), names);
  return names;
}

//* Reset tools
export function resetTools() {
  availableTools.forEach(tool => {
    tool.enabled = false;
  });
  console.log(chalk.hex(THEME.muted)('🔄 All tools have been reset (disabled)'));
}
