import inquirer from 'inquirer';
import chalk from 'chalk';

//* Function to handle user input
async function promptUser() {
  const { text } = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: chalk.hex('#10B981').bold('You:'),
      prefix: chalk.hex('#34D399')('❯'),
      suffix: chalk.hex('#059669')('◇'),
      transformer: input => {
        if (!input) return chalk.dim('Type your message or /help for commands...');
        return chalk.hex('#ECFDF5')(input);
      },
      validate: input => {
        if (input.trim().startsWith('/') || input.trim().length > 0) return true;
        return 'Please enter a message or use /help for commands';
      },
    },
  ]);
  return text;
}

export { promptUser };
