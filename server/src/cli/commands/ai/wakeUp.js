import chalk from 'chalk';
import { Command } from 'commander';
import yoctoSpinner from 'yocto-spinner';
import { getStoredToken } from '../../../lib/token.js';
import prisma from '../../../lib/db.js';
import { select } from '@clack/prompts';
import { startChat } from '../../chat/chat-with-ai.js';
import { startToolChat } from '../../chat/chat-with-ai-tool.js';
// import { startAgentChat } from '../../chat/chat-with-ai-agent.js';

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

const wakeUpAction = async () => {
  const token = await getStoredToken();

  if (!token?.access_token) {
    console.log(chalk.hex(THEME.error)('❌ Not authenticated. Please login first.'));
    process.exit(1);
  }

  const spinner = yoctoSpinner({
    text: chalk.hex(THEME.info)('🔍 Fetching user information...'),
    color: 'blue',
  });
  spinner.start();

  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: { token: token.access_token },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  spinner.stop();

  if (!user) {
    console.log(chalk.hex(THEME.error)('❌ User not found. Please login again.'));
    process.exit(1);
  }

  console.log(chalk.hex(THEME.success).bold(`\n👋 Welcome back, ${user.name}!`));
  console.log(chalk.hex(THEME.muted)('────────────────────'));

  const choice = await select({
    message: chalk.hex(THEME.primary).bold('👩‍💻 Choose your AI experience:'),
    options: [
      {
        value: 'chat',
        label: chalk.hex(THEME.secondary)('Simple Chat'),
        hint: chalk.hex(THEME.muted)('Direct conversation with AI'),
      },
      {
        value: 'tool',
        label: chalk.hex(THEME.accent)('Tool Calling'),
        hint: chalk.hex(THEME.muted)('Enhanced chat with Google Search, Code Execution'),
      },
      {
        value: 'agent',
        label: chalk.hex(THEME.warning)('Agentic Mode'),
        hint: chalk.hex(THEME.muted)('Advanced AI agent (Coming soon)'),
      },
    ],
  });

  switch (choice) {
    case 'chat':
      await startChat('chat');
      break;
    case 'tool':
      await startToolChat();

      break;
    case 'agent':
      // await startAgentChat();
      console.log(chalk.hex(THEME.warning).bold('\n🤖 Agentic Mode Coming Soon!'));
      console.log(chalk.hex(THEME.muted)('   Stay tuned for advanced AI capabilities'));
      break;
  }
};

export const wakeUp = new Command('wakeup')
  .description(chalk.hex(THEME.info)('Wake up and interact with AI'))
  .action(wakeUpAction);
