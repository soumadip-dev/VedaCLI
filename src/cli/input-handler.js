import inquirer from 'inquirer';
import chalk from 'chalk';

//* Function to handle user input
async function promptUser() {
  const { text } = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: chalk.hex('#10B981')('You:'),
      prefix: chalk.hex('#059669')('❯'),
      transformer: val => chalk.hex('#A7F3D0')(val),
    },
  ]);
  return text;
}

export { promptUser };
