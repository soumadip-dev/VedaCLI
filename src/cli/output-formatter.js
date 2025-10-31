import chalk from 'chalk';
import boxen from 'boxen';

//* Function to print system messages
function printSystem(text) {
  const boxed = boxen(chalk.hex('#A7F3D0')(text), {
    padding: 1,
    margin: { top: 1, bottom: 1 },
    borderStyle: 'round',
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  });
  console.log(boxed);
}

//* Function to print help
function printHelp() {
  const helpText = `
${chalk.hex('#10B981').bold('💡 Available Commands:')}

${chalk.hex('#34D399')('┌─')} ${chalk.hex('#34D399').bold('/help')} 
${chalk.hex('#34D399')('└')}   Show this help message

${chalk.hex('#34D399')('┌─')} ${chalk.hex('#34D399').bold('/exit')} 
${chalk.hex('#34D399')('└')}   Quit the chat application

${chalk.hex('#10B981').bold('\n🎯 Tips:')}
${chalk.hex('#34D399')('◇')} Ask questions or paste content to discuss
${chalk.hex('#34D399')('◇')} The assistant will provide thoughtful responses
${chalk.hex('#34D399')('◇')} Use clear and specific questions for better answers
  `;

  const boxed = boxen(helpText, {
    padding: 1,
    margin: { top: 1, bottom: 1 },
    borderStyle: 'classic',
    borderColor: '#059669',
    backgroundColor: '#064E3B',
  });
  console.log(boxed);
}

//* Function to print user input
function printUser(text) {
  const userLabel = chalk.hex('#10B981').bold('👤 You:');
  const userMessage = chalk.hex('#ECFDF5')(text);

  console.log(`\n${userLabel} ${userMessage}`);
  console.log(chalk.hex('#059669').dim('─'.repeat(60) + '\n'));
}

//* Function to print assistant response (start)
function printAssistantStart() {
  process.stdout.write(chalk.hex('#10B981').bold('🔥 VEDA:') + ' ');
}

//* Function to print assistant response (streaming)
function printAssistantChunk(chunk) {
  process.stdout.write(chalk.hex('#34D399')(chunk));
}

//* Function to print assistant response (end)
function printAssistantEnd() {
  process.stdout.write('\n');
  console.log(chalk.hex('#059669').dim('─'.repeat(60)));
}

//* Function to print error messages
function printError(error) {
  const errorText = chalk.hex('#FCA5A5')(`⚠️  Error: ${error}`);
  const boxed = boxen(errorText, {
    padding: 1,
    margin: { top: 1, bottom: 1 },
    borderStyle: 'round',
    borderColor: '#DC2626',
    backgroundColor: '#7F1D1D',
  });
  console.log(boxed);
}

//* Exporting functions
export {
  printSystem,
  printHelp,
  printUser,
  printAssistantStart,
  printAssistantChunk,
  printAssistantEnd,
  printError,
};
