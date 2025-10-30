import { printSystem } from '../cli/output-formatter.js';

//* Function to safely exit
async function safeExit(code = 0) {
  // Give stdout time to flush on windows
  await new Promise(resolve => setTimeout(resolve, 10));
  printSystem('Goodbye!');
  process.exit(code);
}

export { safeExit };
