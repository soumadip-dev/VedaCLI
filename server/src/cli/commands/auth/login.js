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

const URL = ENV.BASE_URL;
const CLIENT_ID = ENV.GITHUB_CLIENT_ID;
const CONFIG_DIR = path.join(os.homedir(), '.better-auth');
const TOKEN_FILE = path.join(CONFIG_DIR, 'token.json');

export async function loginAction(opts) {
  const options = z.object({
    serverUrl: z.string().optional(),
    clientId: z.string().optional(),
  });

  const serverUrl = options.serverUrl || URL;
  const clientId = options.clientId || CLIENT_ID;

  // Modern intro with clean styling
  intro(chalk.hex('#8B5CF6').bold('🔐 Secure Authentication'));

  const existingToken = false;
  const expired = false;

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
  } catch (error) {
    spinner.stop();
    console.error(chalk.hex('#FF6B6B').bold('\n🚫 Authentication failed:'), error.message);
    process.exit(1);
  }
}

export const login = new Command('login')
  .description('Authenticate with secure provider')
  .option('--server-url <url>', 'Authentication server URL', URL)
  .option('--client-id <id>', 'OAuth client identifier', CLIENT_ID)
  .action(loginAction);
