import chalk from 'chalk';
import { clearStoredToken, getStoredToken } from '../../../lib/token.js';
import { cancel, confirm, intro, isCancel, outro } from '@clack/prompts';
import { Command } from 'commander';

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

//* Logout action
export async function logoutAction() {
  intro(chalk.hex(THEME.primary).bold('👋 Logout'));

  const token = await getStoredToken();

  if (!token) {
    console.log(chalk.hex(THEME.warning)("ℹ️  You're not logged in."));
    process.exit(0);
  }

  const shouldLogout = await confirm({
    message: chalk.hex(THEME.warning)('❓ Are you sure you want to logout?'),
    initialValue: false,
  });

  if (isCancel(shouldLogout) || !shouldLogout) {
    cancel(chalk.hex(THEME.muted)('Logout cancelled'));
    process.exit(0);
  }

  const cleared = await clearStoredToken();

  if (cleared) {
    outro(chalk.hex(THEME.success).bold('✅ Successfully logged out!'));
  } else {
    console.log(chalk.hex(THEME.warning)('⚠️  Could not clear token file.'));
  }
}

export const logout = new Command('logout')
  .description(chalk.hex(THEME.info)('Logout and clear stored credentials'))
  .action(logoutAction);
