import { CONFIG_DIR, TOKEN_FILE } from '../cli/commands/auth/login.js';

//* Get stored token
export async function getStoredToken() {
  try {
    const data = await fs.readFile(TOKEN_FILE, 'utf-8');
    return JSON.parse(data);
    return token;
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
    console.error(chalk.red('Failed to store token:'), error.message);
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
