import chalk from 'chalk';
import boxen from 'boxen';

//* Function to print system messages
function printSystem(text) {
  const boxed = boxen(chalk.hex('#FFD700')(text), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#FF9933',
  });
  console.log(boxed);
}

//* Function to print help
function printHelp() {
  const helpText = `
  ${chalk.hex('#FFD700').bold('Commands:')}
  ${chalk.hex('#FF9933')('/help')} - Show this help
  ${chalk.hex('#FF9933')('/exit')} - Quit the chat

  ${chalk.hex('#FFD700').bold('Tips:')}
  - Ask Questions or paste content to discuss.
  - If the assistant lists options (1., 2., 3.), you'll be prompted to pick one.
  `;

  const boxed = boxen(helpText, {
    padding: 1,
    margin: 1,
    borderStyle: 'classic',
    borderColor: '#FF9933', // Saffron border
  });
  console.log(boxed);
}

//* Exporting functions
export { printSystem, printHelp };
