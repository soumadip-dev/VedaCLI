#!/usr/bin/env node
// Makes the file runnable as a command in a terminal. Tells the system: “Run this script using Node.js.”

import dotenv from 'dotenv';
import chalk from 'chalk'; // adds colors/styling to terminal text.
import figlet from 'figlet'; // creates big ASCII text banners.
import boxen from 'boxen'; // adds boxes around text

import { Command } from 'commander'; // helps build CLI commands.
import { login } from './commands/auth/login.js';

dotenv.config();

async function main() {
  const title = chalk.hex('#6366F1')(
    figlet.textSync('VedaCLI', {
      font: 'Standard',
      horizontalLayout: 'full',
    })
  );

  const subtitle = chalk.hex('#8B5CF6').bold('🤖 A CLI based AI Tool');

  const bannerContent = [title, '', subtitle].join('\n');

  const boxedBanner = boxen(bannerContent, {
    padding: { top: 1, bottom: 1, left: 2, right: 2 },
    margin: 1,
    borderColor: '#6366F1',
    borderStyle: 'round',
    textAlignment: 'center',
  });

  console.log(boxedBanner);

  const program = new Command('veda'); // Creates the main CLI command called veda.

  program
    .version('0.0.1')
    .description(chalk.hex('#10B981').bold('✨ Veda CLI - A CLI based AI Tool'))
    .addCommand(login);

  // If the user just types veda, it automatically shows the help menu.
  program.action(() => {
    program.help();
  });
  // Reads user commands from the terminal (like veda --help).
  program.parse();
}

main().catch(err => {
  const errorMessage =
    chalk.hex('#EF4444').bold('❌ Error running VedaCLI: ') + chalk.hex('#FCA5A5')(err.message);

  const boxedError = boxen(errorMessage, {
    padding: 1,
    margin: { top: 1, bottom: 1 },
    borderStyle: 'round',
    borderColor: '#DC2626',
    backgroundColor: '#450A0A',
    textAlignment: 'center',
  });

  console.error(boxedError);
  process.exit(1);
});
