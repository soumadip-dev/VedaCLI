import { renderBanner } from './cli/banner.js';
import { promptUser } from './cli/input-handler.js';
import { printHelp, printSystem, printUser } from './cli/output-formatter.js';
import { safeExit } from './utils/helper.js';

const message = [];
async function main() {
  renderBanner();
  printSystem("Type '/help' for commands. Type '/exit' to exit.");

  while (true) {
    const userInput = await promptUser();

    if (!userInput) continue;

    if (userInput.trim().toLowerCase() === '/exit') {
      await safeExit(0);
      return;
    }
    if (userInput.trim().toLowerCase() === '/help') {
      await printHelp();
      return;
    }

    message.push({
      role: 'user',
      parts: [
        {
          type: 'text',
          text: userInput,
        },
      ],
    });

    printUser(userInput);
  }
}

main();
