import chalk from 'chalk';
import boxen from 'boxen';
import { text, isCancel, cancel, intro, outro, confirm } from '@clack/prompts';
import { AIService } from '../ai/google_service.js';
import { ChatService } from '../../services/chat.services.js';
import { getStoredToken } from '../../lib/token.js';
import prisma from '../../lib/db.js';
import { generateApplication } from '../../config/agent.config.js';

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

const aiService = new AIService();
const chatService = new ChatService();

async function getUserFromToken() {
  const token = await getStoredToken();

  if (!token?.access_token) {
    throw new Error(
      chalk.hex(THEME.error)("❌ Not authenticated. Please run 'orbit login' first.")
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: { token: token.access_token },
      },
    },
  });

  if (!user) {
    throw new Error(chalk.hex(THEME.error)('❌ User not found. Please login again.'));
  }

  console.log(chalk.hex(THEME.success)(`\n✅ Welcome back, ${user.name}!\n`));
  return user;
}

async function initConversation(userId, conversationId = null) {
  const conversation = await chatService.getOrCreateConversation(userId, conversationId, 'agent');

  const conversationInfo = boxen(
    `${chalk.hex(THEME.primary).bold('💬 Conversation')}: ${conversation.title}\n` +
      `${chalk.hex(THEME.muted)('🆔 ID:')} ${conversation.id}\n` +
      `${chalk.hex(THEME.muted)('🎮 Mode:')} ${chalk.hex(THEME.info)('Agent (Code Generator)')}\n` +
      `${chalk.hex(THEME.accent)('📁 Working Directory:')} ${process.cwd()}`,
    {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: 'round',
      borderColor: THEME.info,
      title: chalk.hex(THEME.info).bold('🤖 Agent Mode'),
      titleAlignment: 'center',
      backgroundColor: THEME.background,
    }
  );

  console.log(conversationInfo);

  return conversation;
}

async function saveMessage(conversationId, role, content) {
  return await chatService.addMessage(conversationId, role, content);
}

async function agentLoop(conversation) {
  const helpBox = boxen(
    `${chalk.hex(THEME.accent).bold('What can the agent do?')}\n\n` +
      `${chalk.hex(THEME.muted)('• Generate complete applications from descriptions')}\n` +
      `${chalk.hex(THEME.muted)('• Create all necessary files and folders')}\n` +
      `${chalk.hex(THEME.muted)('• Include setup instructions and commands')}\n` +
      `${chalk.hex(THEME.muted)('• Generate production-ready code')}\n\n` +
      `${chalk.hex(THEME.warning).bold('Examples:')}\n` +
      `${chalk.hex(THEME.muted)('• "Build a todo app with React and Tailwind"')}\n` +
      `${chalk.hex(THEME.muted)('• "Create a REST API with Express and MongoDB"')}\n` +
      `${chalk.hex(THEME.muted)('• "Make a weather app using OpenWeatherMap API"')}\n\n` +
      `${chalk.hex(THEME.muted)('Type "exit" to end the session')}`,
    {
      padding: 1,
      margin: { bottom: 1 },
      borderStyle: 'round',
      borderColor: THEME.accent,
      title: chalk.hex(THEME.accent).bold('💡 Agent Instructions'),
      backgroundColor: THEME.background,
    }
  );

  console.log(helpBox);

  while (true) {
    const userInput = await text({
      message: chalk.hex(THEME.primary)('🤖 What would you like to build?'),
      placeholder: 'Describe your application...',
      validate(value) {
        if (!value || value.trim().length === 0) {
          return chalk.hex(THEME.error)('Description cannot be empty');
        }
        if (value.trim().length < 10) {
          return chalk.hex(THEME.error)('Please provide more details (at least 10 characters)');
        }
      },
    });

    if (isCancel(userInput)) {
      const exitBox = boxen(chalk.hex(THEME.warning)('👋 Agent session cancelled'), {
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
      const exitBox = boxen(chalk.hex(THEME.warning)('👋 Agent session ended'), {
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
      margin: { top: 1, bottom: 1 },
      borderStyle: 'round',
      borderColor: THEME.accent,
      title: chalk.hex(THEME.accent)('👤 Your Request'),
      titleAlignment: 'left',
      backgroundColor: THEME.background,
    });
    console.log(userBox);

    // Save user message
    await saveMessage(conversation.id, 'user', userInput);

    try {
      // Generate application using structured output
      const result = await generateApplication(userInput, aiService, process.cwd());

      if (result && result.success) {
        // Save successful generation details
        const responseMessage =
          `Generated application: ${result.folderName}\n` +
          `Files created: ${result.files.length}\n` +
          `Location: ${result.appDir}\n\n` +
          `Setup commands:\n${result.commands.join('\n')}`;

        await saveMessage(conversation.id, 'assistant', responseMessage);

        // Ask if user wants to generate another app
        const continuePrompt = await confirm({
          message: chalk.hex(THEME.accent)('Would you like to generate another application?'),
          initialValue: false,
        });

        if (isCancel(continuePrompt) || !continuePrompt) {
          console.log(chalk.hex(THEME.warning)('\n👋 Great! Check your new application.\n'));
          break;
        }
      } else {
        throw new Error('Generation returned no result');
      }
    } catch (error) {
      console.log(chalk.hex(THEME.error)(`\n❌ Error: ${error.message}\n`));

      await saveMessage(conversation.id, 'assistant', `Error: ${error.message}`);

      const retry = await confirm({
        message: chalk.hex(THEME.accent)('Would you like to try again?'),
        initialValue: true,
      });

      if (isCancel(retry) || !retry) {
        break;
      }
    }
  }
}

export async function startAgentChat(conversationId = null) {
  try {
    intro(chalk.hex(THEME.primary).bold('🤖 Orbit AI - Agent Mode'));

    const user = await getUserFromToken();

    // Warning about file system access
    const shouldContinue = await confirm({
      message: chalk.hex(THEME.warning)(
        '⚠️  The agent will create files and folders in the current directory. Continue?'
      ),
      initialValue: true,
    });

    if (isCancel(shouldContinue) || !shouldContinue) {
      cancel(chalk.hex(THEME.warning)('Agent mode cancelled'));
      process.exit(0);
    }

    const conversation = await initConversation(user.id, conversationId);
    await agentLoop(conversation);

    outro(chalk.hex(THEME.success).bold('\n✨ Thanks for using Agent Mode!'));
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
