import chalk from 'chalk';
import boxen from 'boxen';
import { text, isCancel, cancel, intro, outro, multiselect } from '@clack/prompts';
import yoctoSpinner from 'yocto-spinner';
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { AIService } from '../ai/google_service.js';
import { ChatService } from '../../services/chat.services.js';
import { getStoredToken } from '../../lib/token.js';
import prisma from '../../lib/db.js';
import {
  availableTools,
  getEnabledTools,
  enableTools,
  getEnabledToolNames,
  resetTools,
} from '../../config/tool.config.js';

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

// Configure marked for terminal
marked.use(
  markedTerminal({
    // Code styling
    code: chalk.hex(THEME.muted).bgHex(THEME.background),
    blockquote: chalk.hex(THEME.muted).italic,

    // Headings
    firstHeading: chalk.hex(THEME.primary).underline.bold,
    h1: chalk.hex(THEME.primary).underline.bold,
    h2: chalk.hex(THEME.secondary).bold,
    h3: chalk.hex(THEME.accent).bold,
    h4: chalk.hex(THEME.warning).bold,
    h5: chalk.hex(THEME.info).bold,
    h6: chalk.hex(THEME.muted).bold,

    // Horizontal rule
    hr: chalk.hex(THEME.muted),

    // Lists
    list: chalk.reset,
    listitem: chalk.reset,

    // Text formatting
    strong: text => chalk.hex(THEME.primary).bold(text),
    em: text => chalk.hex(THEME.accent).italic(text),
    codespan: text => chalk.hex(THEME.warning).bgHex(THEME.background)(text),
    del: text => chalk.hex(THEME.muted).dim.strikethrough(text),

    // Links
    link: (href, title, text) => chalk.hex(THEME.info).underline(text),
    href: href => chalk.hex(THEME.info).underline(href),

    // Tables
    table: chalk.reset,
    thead: chalk.hex(THEME.primary).bold.underline,

    // Display options
    unescape: true,
    emoji: true,
    width: 80,
    reflowText: true,
    showSectionPrefix: false,
  })
);

const aiService = new AIService();
const chatService = new ChatService();

//* Get user from token
async function getUserFromToken() {
  const token = await getStoredToken();

  if (!token?.access_token) {
    throw new Error(chalk.hex(THEME.error)("❌ Not authenticated. Please run 'Veda login' first."));
  }

  const spinner = yoctoSpinner({
    text: chalk.hex(THEME.info)('🔐 Authenticating...'),
    color: 'blue',
  }).start();

  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: { token: token.access_token },
      },
    },
  });

  if (!user) {
    spinner.error(chalk.hex(THEME.error)('User not found'));
    throw new Error(chalk.hex(THEME.error)('❌ User not found. Please login again.'));
  }

  spinner.success(chalk.hex(THEME.success)(`✅ Welcome back, ${user.name}!`));
  return user;
}

//* Select tools
async function selectTools() {
  const toolOptions = availableTools.map(tool => ({
    value: tool.id,
    label: tool.name,
    hint: tool.description,
  }));

  const selectedTools = await multiselect({
    message: chalk.hex(THEME.primary)(
      'Select tools to enable (Space to select, Enter to confirm):'
    ),
    options: toolOptions,
    required: false,
  });

  if (isCancel(selectedTools)) {
    cancel(chalk.hex(THEME.warning)('Tool selection cancelled'));
    process.exit(0);
  }

  // Enable selected tools
  enableTools(selectedTools);

  if (selectedTools.length === 0) {
    console.log(chalk.hex(THEME.warning)('\n⚠️  No tools selected. AI will work without tools.\n'));
  } else {
    const toolsBox = boxen(
      chalk.hex(THEME.success)(
        `✅ Enabled tools:\n${selectedTools
          .map(id => {
            const tool = availableTools.find(t => t.id === id);
            return `  • ${tool.name}`;
          })
          .join('\n')}`
      ),
      {
        padding: 1,
        margin: { top: 1, bottom: 1 },
        borderStyle: 'round',
        borderColor: THEME.success,
        title: chalk.hex(THEME.success).bold('🛠️  Active Tools'),
        titleAlignment: 'center',
        backgroundColor: THEME.background,
      }
    );
    console.log(toolsBox);
  }

  return selectedTools.length > 0;
}

//* Init conversation
async function initConversation(userId, conversationId = null, mode = 'tool') {
  const spinner = yoctoSpinner({
    text: chalk.hex(THEME.info)('📂 Loading conversation...'),
    color: 'blue',
  }).start();

  const conversation = await chatService.getOrCreateConversation(userId, conversationId, mode);

  spinner.success(chalk.hex(THEME.success)('✅ Conversation loaded'));

  // Get enabled tool names for display
  const enabledToolNames = getEnabledToolNames();
  const toolsDisplay =
    enabledToolNames.length > 0
      ? `\n${chalk.hex(THEME.muted)('Active Tools:')} ${enabledToolNames.join(', ')}`
      : `\n${chalk.hex(THEME.muted)('No tools enabled')}`;

  // Display conversation info in a box
  const conversationInfo = boxen(
    `${chalk.hex(THEME.primary).bold('💬 Conversation')}: ${conversation.title}\n${chalk.hex(
      THEME.muted
    )('🆔 ID: ' + conversation.id)}\n${chalk.hex(THEME.muted)(
      '🎮 Mode: ' + conversation.mode
    )}${toolsDisplay}`,
    {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: 'round',
      borderColor: THEME.accent,
      title: chalk.hex(THEME.primary).bold('🛠️ Tool Calling Session'),
      titleAlignment: 'center',
      backgroundColor: THEME.background,
    }
  );

  console.log(conversationInfo);

  // Display existing messages if any
  if (conversation.messages?.length > 0) {
    console.log(chalk.hex(THEME.warning)('📜 Previous messages:\n'));
    displayMessages(conversation.messages);
  }

  return conversation;
}

//* Display messages
function displayMessages(messages) {
  messages.forEach(msg => {
    if (msg.role === 'user') {
      const userBox = boxen(chalk.hex(THEME.muted)(msg.content), {
        padding: 1,
        margin: { left: 2, bottom: 1 },
        borderStyle: 'round',
        borderColor: THEME.accent,
        title: chalk.hex(THEME.accent)('👤 You'),
        titleAlignment: 'left',
        backgroundColor: THEME.background,
      });
      console.log(userBox);
    } else if (msg.role === 'assistant') {
      const renderedContent = marked.parse(msg.content);
      const assistantBox = boxen(renderedContent.trim(), {
        padding: 1,
        margin: { left: 2, bottom: 1 },
        borderStyle: 'round',
        borderColor: THEME.secondary,
        title: chalk.hex(THEME.secondary)('🤖 Assistant (with tools)'),
        titleAlignment: 'left',
        backgroundColor: THEME.background,
      });
      console.log(assistantBox);
    }
  });
}

//* Save message
async function saveMessage(conversationId, role, content) {
  return await chatService.addMessage(conversationId, role, content);
}

//* Get AI response
async function getAIResponse(conversationId) {
  const spinner = yoctoSpinner({
    text: chalk.hex(THEME.info)('🤖 AI is thinking...'),
    color: 'blue',
  }).start();

  const dbMessages = await chatService.getMessages(conversationId);
  const aiMessages = chatService.formatMessagesForAI(dbMessages);

  const tools = getEnabledTools();

  let fullResponse = '';
  let isFirstChunk = true;
  const toolCallsDetected = [];

  try {
    // IMPORTANT: Pass tools in the streamText config
    const result = await aiService.sendMessage(
      aiMessages,
      chunk => {
        if (isFirstChunk) {
          spinner.stop();
          console.log('\n');
          const header = chalk.hex(THEME.secondary).bold('🤖 Assistant:');
          console.log(header);
          console.log(chalk.hex(THEME.muted)('─'.repeat(60)));
          isFirstChunk = false;
        }
        fullResponse += chunk;
      },
      tools,
      toolCall => {
        toolCallsDetected.push(toolCall);
      }
    );

    // Display tool calls if any
    if (toolCallsDetected.length > 0) {
      console.log('\n');
      const toolCallBox = boxen(
        toolCallsDetected
          .map(
            tc =>
              `${chalk.hex(THEME.accent)('🔧 Tool:')} ${tc.toolName}\n${chalk.hex(THEME.muted)(
                'Args:'
              )} ${JSON.stringify(tc.args, null, 2)}`
          )
          .join('\n\n'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: THEME.accent,
          title: chalk.hex(THEME.accent).bold('🛠️  Tool Calls'),
          backgroundColor: THEME.background,
        }
      );
      console.log(toolCallBox);
    }

    // Display tool results if any
    if (result.toolResults && result.toolResults.length > 0) {
      const toolResultBox = boxen(
        result.toolResults
          .map(
            tr =>
              `${chalk.hex(THEME.success)('✅ Tool:')} ${tr.toolName}\n${chalk.hex(THEME.muted)(
                'Result:'
              )} ${JSON.stringify(tr.result, null, 2).slice(0, 200)}...`
          )
          .join('\n\n'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: THEME.success,
          title: chalk.hex(THEME.success).bold('📊 Tool Results'),
          backgroundColor: THEME.background,
        }
      );
      console.log(toolResultBox);
    }

    // Render markdown response
    console.log('\n');
    const renderedMarkdown = marked.parse(fullResponse);
    console.log(renderedMarkdown);
    console.log(chalk.hex(THEME.muted)('─'.repeat(60)));
    console.log('\n');

    return result.content;
  } catch (error) {
    spinner.error(chalk.hex(THEME.error)('❌ Failed to get AI response'));
    throw error;
  }
}

//* Update conversation title
async function updateConversationTitle(conversationId, userInput, messageCount) {
  if (messageCount === 1) {
    const title = userInput.slice(0, 50) + (userInput.length > 50 ? '...' : '');
    await chatService.updateTitle(conversationId, title);
  }
}

//* Chat loop
async function chatLoop(conversation) {
  const enabledToolNames = getEnabledToolNames();
  const helpBox = boxen(
    `${chalk.hex(THEME.muted)('• Type your message and press Enter')}\n${chalk.hex(THEME.muted)(
      '• AI has access to:'
    )} ${enabledToolNames.length > 0 ? enabledToolNames.join(', ') : 'No tools'}\n${chalk.hex(
      THEME.muted
    )('• Type "exit" to end conversation')}\n${chalk.hex(THEME.muted)(
      '• Press Ctrl+C to quit anytime'
    )}`,
    {
      padding: 1,
      margin: { bottom: 1 },
      borderStyle: 'round',
      borderColor: THEME.muted,
      dimBorder: true,
      backgroundColor: THEME.background,
    }
  );

  console.log(helpBox);

  while (true) {
    const userInput = await text({
      message: chalk.hex(THEME.primary)('💬 Your message'),
      placeholder: 'Type your message...',
      validate(value) {
        if (!value || value.trim().length === 0) {
          return chalk.hex(THEME.error)('Message cannot be empty');
        }
      },
    });

    if (isCancel(userInput)) {
      const exitBox = boxen(chalk.hex(THEME.warning)('👋 Chat session ended. Goodbye!'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: THEME.warning,
        backgroundColor: THEME.background,
      });
      console.log(exitBox);
      process.exit(0);
    }

    if (userInput.toLowerCase() === 'exit') {
      const exitBox = boxen(chalk.hex(THEME.warning)('👋 Chat session ended. Goodbye!'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: THEME.warning,
        backgroundColor: THEME.background,
      });
      console.log(exitBox);
      break;
    }

    const userBox = boxen(chalk.hex(THEME.muted)(userInput), {
      padding: 1,
      margin: { left: 2, top: 1, bottom: 1 },
      borderStyle: 'round',
      borderColor: THEME.accent,
      title: chalk.hex(THEME.accent)('👤 You'),
      titleAlignment: 'left',
      backgroundColor: THEME.background,
    });
    console.log(userBox);

    await saveMessage(conversation.id, 'user', userInput);
    const messages = await chatService.getMessages(conversation.id);
    const aiResponse = await getAIResponse(conversation.id);
    await saveMessage(conversation.id, 'assistant', aiResponse);
    await updateConversationTitle(conversation.id, userInput, messages.length);
  }
}

//* Start tool chat
export async function startToolChat(conversationId = null) {
  try {
    intro(chalk.hex(THEME.primary).bold('🛠️ Veda AI - Tool Calling Mode'));

    const user = await getUserFromToken();

    // Select tools
    await selectTools();

    const conversation = await initConversation(user.id, conversationId, 'tool');
    await chatLoop(conversation);

    // Reset tools on exit
    resetTools();

    outro(chalk.hex(THEME.success).bold('✨ Thanks for using tools!'));
  } catch (error) {
    const errorBox = boxen(chalk.hex(THEME.error)(`❌ Error: ${error.message}`), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: THEME.error,
      backgroundColor: THEME.background,
    });
    console.log(errorBox);
    resetTools();
    process.exit(1);
  }
}
