import chalk from 'chalk';
import boxen from 'boxen';
import { text, isCancel, cancel, intro, outro } from '@clack/prompts';
import yoctoSpinner from 'yocto-spinner';
import { marked } from 'marked';
import { markedTerminal } from 'marked-terminal';
import { AIService } from '../ai/google_service.js';
import { ChatService } from '../../services/chat.services.js';
import { getStoredToken } from '../../lib/token.js';
import prisma from '../../lib/db.js';

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

//* Configure marked to use terminal renderer
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

//* Initialize services
const aiService = new AIService();
const chatService = new ChatService();

//* Get user from token
async function getUserFromToken() {
  const token = await getStoredToken();

  if (!token?.access_token) {
    throw new Error(chalk.hex(THEME.error)("❌ Not authenticated. Please run 'veda login' first."));
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

//* Initialize conversation
async function initConversation(userId, conversationId = null, mode = 'chat') {
  const spinner = yoctoSpinner({
    text: chalk.hex(THEME.info)('📂 Loading conversation...'),
    color: 'blue',
  }).start();

  const conversation = await chatService.getOrCreateConversation(userId, conversationId, mode);

  spinner.success(chalk.hex(THEME.success)('✅ Conversation loaded'));

  // Display conversation info in a box
  const conversationInfo = boxen(
    `${chalk.hex(THEME.primary).bold('💬 Conversation')}: ${conversation.title}\n${chalk.hex(
      THEME.muted
    )('🆔 ID: ' + conversation.id)}\n${chalk.hex(THEME.muted)('🎮 Mode: ' + conversation.mode)}`,
    {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: 'round',
      borderColor: THEME.accent,
      title: chalk.hex(THEME.primary).bold('💬 Chat Session'),
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
    } else {
      // Render markdown for assistant messages
      const renderedContent = marked.parse(msg.content);
      const assistantBox = boxen(renderedContent.trim(), {
        padding: 1,
        margin: { left: 2, bottom: 1 },
        borderStyle: 'round',
        borderColor: THEME.secondary,
        title: chalk.hex(THEME.secondary)('🤖 Assistant'),
        titleAlignment: 'left',
        backgroundColor: THEME.background,
      });
      console.log(assistantBox);
    }
  });
}

//* Chat loop
async function chatLoop(conversation) {
  const helpBox = boxen(
    `${chalk.hex(THEME.muted)('• Type your message and press Enter')}\n${chalk.hex(THEME.muted)(
      '• Markdown formatting is supported in responses'
    )}\n${chalk.hex(THEME.muted)('• Type "exit" to end conversation')}\n${chalk.hex(THEME.muted)(
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

    // Handle cancellation (Ctrl+C)
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
    // Handle exit command
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

    // Save user message
    await saveMessage(conversation.id, 'user', userInput);

    // Get message count before AI response
    const messages = await chatService.getMessages(conversation.id);

    // Get AI response with streaming and markdown rendering
    const aiResponse = await getAIResponse(conversation.id);

    // Save AI response
    await saveMessage(conversation.id, 'assistant', aiResponse);

    // Update title if first exchange
    await updateConversationTitle(conversation.id, userInput, messages.length);
  }
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

  let fullResponse = '';
  let isFirstChunk = true;

  try {
    const result = await aiService.sendMessage(aiMessages, chunk => {
      // Stop spinner on first chunk and show header
      if (isFirstChunk) {
        spinner.stop();
        console.log('\n');
        const header = chalk.hex(THEME.secondary).bold('🤖 Assistant:');
        console.log(header);
        console.log(chalk.hex(THEME.muted)('─'.repeat(60)));
        isFirstChunk = false;
      }
      fullResponse += chunk;
    });

    // Now render the complete markdown response
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

//* Start chat
export async function startChat(mode = 'chat', conversationId = null) {
  try {
    // Display intro banner
    intro(chalk.hex(THEME.primary).bold('✨ Veda AI Chat'));

    // Get user from token
    const user = await getUserFromToken();
    const conversation = await initConversation(user.id, conversationId, mode);
    await chatLoop(conversation);

    // Display outro
    outro(chalk.hex(THEME.success).bold('✨ Thanks for chatting!'));
  } catch (error) {
    const errorBox = boxen(chalk.hex(THEME.error)(`❌ Error: ${error.message}`), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: THEME.error,
      backgroundColor: THEME.background,
    });
    console.log(errorBox);
    process.exit(1);
  }
}
