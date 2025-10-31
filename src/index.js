import { sendMessage } from './ai/gemini-service.js';
import { renderBanner } from './cli/banner.js';
import { promptUser } from './cli/input-handler.js';
import {
  printAssistantChunk,
  printAssistantEnd,
  printAssistantStart,
  printHelp,
  printSystem,
  printUser,
} from './cli/output-formatter.js';
import { safeExit } from './utils/helper.js';
import dotenv from 'dotenv';

dotenv.config();

const messages = [];
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
    }

    messages.push({
      role: 'user',
      parts: [
        {
          type: 'text',
          text: userInput,
        },
      ],
    });

    printUser(userInput);

    let reply = '';
    try {
      printAssistantStart();
      // FIX: Pass an object with messages and onChunk properties
      reply = await sendMessage({
        messages: messages,
        onChunk: chunk => printAssistantChunk(chunk),
      });
      printAssistantEnd();
      messages.push({
        role: 'assistant',
        parts: [{ type: 'text', text: reply }],
      });
    } catch (error) {
      printAssistantEnd();
      printSystem(`Provider error: ${String(error?.message || error)}`);
      continue;
    }
  }
}

main();
