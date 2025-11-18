import chalk from 'chalk';
import { Command } from 'commander';
import prisma from '../../../lib/db.js';
import { requireAuth } from '../../../lib/token.js';

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

//* Whoami command
export async function whoamiAction(opts) {
  const token = await requireAuth();
  if (!token?.access_token) {
    console.log(chalk.hex(THEME.error)('❌ No access token found. Please login.'));
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: {
      sessions: {
        some: {
          token: token.access_token,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  if (!user) {
    console.log(chalk.hex(THEME.error)('❌ User not found. Please login again.'));
    process.exit(1);
  }

  // Output user session info with better styling
  console.log(chalk.hex(THEME.primary).bold('\n👤 User Profile'));
  console.log(chalk.hex(THEME.muted)('────────────────────'));
  console.log(chalk.hex(THEME.secondary)(`   👤 Name: ${chalk.bold(user.name)}`));
  console.log(chalk.hex(THEME.accent)(`   📧 Email: ${chalk.bold(user.email)}`));
  console.log(chalk.hex(THEME.info)(`   🆔 ID: ${chalk.bold(user.id)}`));
  console.log('');
}

export const whoami = new Command('whoami')
  .description(chalk.hex(THEME.info)('Show current authenticated user'))
  .option('--server-url <url>', 'The Better Auth server URL')
  .action(whoamiAction);
