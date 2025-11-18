import chalk from 'chalk';
import { CONFIG_DIR, TOKEN_FILE } from '../cli/commands/auth/login.js';
import fs from 'node:fs/promises';

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

//* Get stored token
export async function getStoredToken() {
  try {
    const data = await fs.readFile(TOKEN_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

//* Store token
export async function storeToken(token) {
  try {
    // Ensure config directory exists
    await fs.mkdir(CONFIG_DIR, { recursive: true });

    // Store token with metadata
    const tokenData = {
      access_token: token.access_token,
      refresh_token: token.refresh_token, // Store if available
      token_type: token.token_type || 'Bearer',
      scope: token.scope,
      expires_at: token.expires_in
        ? new Date(Date.now() + token.expires_in * 1000).toISOString()
        : null,
      created_at: new Date().toISOString(),
    };

    await fs.writeFile(TOKEN_FILE, JSON.stringify(tokenData, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(
      chalk.hex(THEME.error).bold('❌ Failed to store token:'),
      chalk.hex(THEME.muted)(error.message)
    );
    return false;
  }
}

//* Check if token is expired
export async function isTokenExpired() {
  const token = await getStoredToken();
  if (!token || !token.expires_at) {
    return true;
  }

  const expiresAt = new Date(token.expires_at);
  const now = new Date();

  // Consider expired if less than 5 minutes remaining
  return expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;
}

//* Clear stored token
export async function clearStoredToken() {
  try {
    await fs.unlink(TOKEN_FILE);
    return true;
  } catch (error) {
    // File doesn't exist or can't be deleted
    return false;
  }
}

//* Require authentication
export async function requireAuth() {
  const token = await getStoredToken();

  if (!token) {
    console.log(
      chalk.hex(THEME.error).bold("❌ Not authenticated. Please run 'veda login' first.")
    );
    process.exit(1);
  }

  if (await isTokenExpired()) {
    console.log(chalk.hex(THEME.warning).bold('⚠️  Your session has expired. Please login again.'));
    console.log(chalk.hex(THEME.muted)('   Run: veda login\n'));
    process.exit(1);
  }

  return token;
}
