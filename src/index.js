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
  printError,
} from './cli/output-formatter.js';
import { safeExit } from './utils/helper.js';
import dotenv from 'dotenv';

dotenv.config();

const messages = [];
let isFirstMessage = true;

async function main() {
  try {
    renderBanner();
    
    if (isFirstMessage) {
      printSystem("🌟 Welcome to VEDA AI! Type '/help' for commands or '/exit' to leave.");
      isFirstMessage = false;
    }

    while (true) {
      const userInput = await promptUser();

      if (!userInput) continue;

      const trimmedInput = userInput.trim();
      const lowerInput = trimmedInput.toLowerCase();

      if (lowerInput === '/exit' || lowerInput === '/quit') {
        await safeExit(0);
        return;
      }
      
      if (lowerInput === '/help') {
        printHelp();
        continue;
      }
      
      if (lowerInput === '/clear') {
        messages.length = 0;
        printSystem('🗑️  Conversation history cleared!');
        continue;
      }

      // Add user message to history
      messages.push({
        role: 'user',
        parts: [{ type: 'text', text: trimmedInput }],
      });

      printUser(trimmedInput);

      let reply = '';
      try {
        printAssistantStart();
        
        // Send message with streaming
        reply = await sendMessage({
          messages: messages,
          onChunk: chunk => printAssistantChunk(chunk),
        });
        
        printAssistantEnd();
        
        // Add assistant response to history
        if (reply.trim()) {
          messages.push({
            role: 'assistant',
            parts: [{ type: 'text', text: reply.trim() }],
          });
        }
      } catch (error) {
        printAssistantEnd();
        printError(`AI Service error: ${String(error?.message || error)}`);
        // Remove the last user message if there was an error
        if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
          messages.pop();
        }
        continue;
      }
    }
  } catch (error) {
    printError(`Unexpected error: ${String(error?.message || error)}`);
    await safeExit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  console.log('\n');
  await safeExit(0);
});

process.on('SIGTERM', async () => {
  await safeExit(0);
});

main();