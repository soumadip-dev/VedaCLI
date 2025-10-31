import chalk from 'chalk';
import boxen from 'boxen';

//* Function to print system messages
function printSystem(text) {
  const boxed = boxen(chalk.hex('#A7F3D0')(text), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#10B981',
  });
  console.log(boxed);
}

//* Function to print help
function printHelp() {
  const helpText = `
  ${chalk.hex('#10B981').bold('Commands:')}
  ${chalk.hex('#34D399')('/help')} - Show this help
  ${chalk.hex('#34D399')('/exit')} - Quit the chat

  ${chalk.hex('#10B981').bold('Tips:')}
  - Ask Questions or paste content to discuss.
  - If the assistant lists options (1., 2., 3.), you'll be prompted to pick one.
  `;

  const boxed = boxen(helpText, {
    padding: 1,
    margin: 1,
    borderStyle: 'classic',
    borderColor: '#059669',
  });
  console.log(boxed);
}

//* Function to print user input
function printUser(text) {
  const userLabel = chalk.hex('#10B981').bold('You:');
  const userMessage = chalk.hex('#ECFDF5')(text);

  console.log(`\n${userLabel} ${userMessage}\n`);
}

//* Function to print assistant response (start)
function printAssistantStart() {
  process.stdout.write(chalk.hex('#10B981').bold('🧠 VedaAI') + ': ');
}

//* Function to print assistant response (streaming)
function printAssistantChunk(chunk) {
  process.stdout.write(chalk.hex('#34D399')(chunk));
}

//* Function to print assistant response (end)
function printAssistantEnd() {
  process.stdout.write('\n');
}

//* Exporting functions
export {
  printSystem,
  printHelp,
  printUser,
  printAssistantStart,
  printAssistantChunk,
  printAssistantEnd,
};
