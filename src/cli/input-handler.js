import inquirer from 'inquirer';
import chalk from 'chalk';

//* Function to handle user input
async function promptUser() {
  const { text } = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: chalk.hex('#FF9933')('You:'),
      prefix: chalk.hex('#FFD700')('👉'),
      transformer: val => chalk.hex('#FFD700')(val),
    },
  ]);
  return text;
}

export { promptUser };
