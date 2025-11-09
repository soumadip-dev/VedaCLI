import { cancel, confirm, intro, isCancel, outro } from '@clack/prompts';
import { logger } from 'better-auth';
import { createAuthClient } from 'better-auth/client';
import { deviceAuthorizationClient } from 'better-auth/client/plugins';
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'node:fs/promises';
import open from 'open';
import os from 'os';
import path from 'path';
import yoctoSpinner from 'yocto-spinner';
import * as z from 'zod/v4';
import prisma from '../../../lib/db.js';
import ENV from '../../../config/env.config.js';
import { getStoredToken, isTokenExpired, storeToken } from '../../../lib/token.js';

const URL = ENV.BASE_URL;
const CLIENT_ID = ENV.GITHUB_CLIENT_ID;
export const CONFIG_DIR = path.join(os.homedir(), '.better-auth');
export const TOKEN_FILE = path.join(CONFIG_DIR, 'token.json');

export async function loginAction(opts) {
  const options = z.object({
    serverUrl: z.string().optional(),
    clientId: z.string().optional(),
  });

  const serverUrl = options.serverUrl || URL;
  const clientId = options.clientId || CLIENT_ID;

  // Modern intro with clean styling
  intro(chalk.hex('#8B5CF6').bold('🔐 Secure Authentication'));

  const existingToken = await getStoredToken();
  const expired = await isTokenExpired();

  if (existingToken && !expired) {
    const shouldReAuth = await confirm({
      message: 'Active session detected. Re-authenticate?',
      initialValue: false,
    });

    if (isCancel(shouldReAuth) || !shouldReAuth) {
      cancel('Authentication cancelled');
      process.exit(0);
    }
  }

  const authClient = createAuthClient({
    baseUrl: serverUrl,
    plugins: [deviceAuthorizationClient()],
  });

  const spinner = yoctoSpinner({
    text: 'Initializing secure connection...',
    color: 'blue',
  });
  spinner.start();

  try {
    const { data, error } = await authClient.device.code({
      client_id: clientId,
      scope: 'openid profile email',
    });
    spinner.stop();

    if (error || !data) {
      logger.error(`Authorization failed: ${error?.error_description}`);
      process.exit(1);
    }

    const {
      device_code,
      user_code,
      verification_uri,
      verification_uri_complete,
      interval = 5,
      expires_in,
    } = data;

    console.log(chalk.hex('#06D6A0').bold('🔑 Device Authorization Required'));

    console.log(
      `🌐 Visit: ${chalk.underline.hex('#64B5F6')(verification_uri || verification_uri_complete)}`
    );

    console.log(`📝 Enter code: ${chalk.hex('#FFD166').bold(user_code)}`);

    console.log('');

    const shouldOpen = await confirm({
      message: 'Launch browser automatically?',
      initialValue: true,
    });

    if (!isCancel(shouldOpen) && shouldOpen) {
      const urlToOpen = verification_uri_complete || verification_uri;
      await open(urlToOpen);
    }

    console.log(
      chalk.gray(
        `⏱️ Waiting for authorization (expires in ${Math.floor(expires_in / 60)} minutes)...`
      )
    );

    const token = await pollForToken(authClient, device_code, clientId, interval);

    if (token) {
      const saved = await storeToken(token);

      if (!saved) {
        console.log(chalk.yellow('\n⚠️  Warning: Could not save authentication token.'));
        console.log(chalk.yellow('You may need to login again on next use.'));
      }

      // TODO => GET THE USER DATA
      outro(
        chalk.green(
          // `✅ Login successful! Welcome ${session?.user?.name || session?.user?.email || 'User'}`
          'Login Successfull'
        )
      );

      console.log(chalk.gray(`\n📁 Token saved to: ${TOKEN_FILE}`));
      console.log(chalk.gray('   You can now use AI commands without logging in again.\n'));
    }
  } catch (error) {
    spinner.stop();
    console.error(chalk.hex('#FF6B6B').bold('\n🚫 Authentication failed:'), error.message);
    process.exit(1);
  }
}

//* Polling for token
async function pollForToken(authClient, deviceCode, clientId, initialInterval) {
  let pollingInterval = initialInterval;
  const spinner = yoctoSpinner({
    text: '',
    colour: 'blue',
  });
  let dots = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      dots = (dots + 1) % 4;
      spinner.text = chalk.gray(
        `Polling for authorization${'.'.repeat(dots)}${' '.repeat(3 - dots)}`
      );
      if (!spinner.isSpinning) spinner.start();
      try {
        const { data, error } = await authClient.device.token({
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          device_code: deviceCode,
          client_id: clientId,
          fetchOptions: {
            headers: {
              'user-agent': `Better Auth CLI`,
            },
          },
        });

        if (data?.access_token) {
          // TODO => REMOVE IT
          console.log(chalk.bold.yellow(`Your access token: ${data.access_token}`));
          spinner.stop();
          resolve(data);
          return;
        } else if (error) {
          switch (error.error) {
            case 'authorization_pending':
              // Continue polling
              break;
            case 'slow_down':
              pollingInterval += 5;
              break;
            case 'access_denied':
              spinner.stop();
              logger.error('Access was denied by the user');
              process.exit(1);
              break;
            case 'expired_token':
              spinner.stop();
              logger.error('The device code has expired. Please try again.');
              process.exit(1);
              break;
            default:
              spinner.stop();
              logger.error(`Error: ${error.error_description}`);
              process.exit(1);
          }
        }
      } catch (error) {
        spinner.stop();
        logger.error(`Network error: ${err.message}`);
        process.exit(1);
      }
      setTimeout(poll, pollingInterval * 1000);
    };
    setTimeout(poll, pollingInterval * 1000);
  });
}
export const login = new Command('login')
  .description('Authenticate with secure provider')
  .option('--server-url <url>', 'Authentication server URL', URL)
  .option('--client-id <id>', 'OAuth client identifier', CLIENT_ID)
  .action(loginAction);
