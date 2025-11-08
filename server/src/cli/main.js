#!/usr/bin/env node
// Makes the file runnable as a command in a terminal. Tells the system: “Run this script using Node.js.”

import dotenv from 'dotenv';
import chalk from 'chalk'; // adds colors/styling to terminal text.
import figlet from 'figlet'; // creates big ASCII text banners.

import { Command } from 'commander'; // helps build CLI commands.

dotenv.config();

async function main() {
  console.log(
    chalk.hex('#6366F1')(
      figlet.textSync('VedaCLI', {
        font: 'Standard',
        horizontalLayout: 'full',
      })
    )
  );
  console.log(chalk.hex('#8B5CF6').bold('🤖 A CLI based AI Tool \n'));

  const program = new Command('veda'); // Creates the main CLI command called veda.

  program
    .version('0.0.1')
    .description(chalk.hex('#10B981').bold('✨ Veda CLI - A CLI based AI Tool'));

  // If the user just types veda, it automatically shows the help menu.
  program.action(() => {
    program.help();
  });
  // Reads user commands from the terminal (like veda --help).
  program.parse();
}

main().catch(err => {
  console.error(
    chalk.hex('#EF4444').bold('❌ Error running VedaCLI: ') + chalk.hex('#FCA5A5')(err.message)
  );
  process.exit(1);
});
