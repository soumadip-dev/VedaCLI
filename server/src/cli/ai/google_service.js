import { google } from '@ai-sdk/google';
import { streamText, generateObject, convertToModelMessages } from 'ai';
import { config } from '../../config/google.config.js';
import chalk from 'chalk';

export class AIService {
  constructor() {
    if (!config.googleApiKey) {
      throw new Error('GOOGLE_API_KEY is not set in environment variables');
    }

    this.model = google(config.model, {
      apiKey: config.googleApiKey,
    });
  }

  //* Send a message and get streaming response
  async sendMessage(messages, onChunk, tools = undefined, onToolCall = null) {
    try {
      const streamConfig = {
        model: this.model,
        messages: messages,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
      };

      const result = streamText(streamConfig);

      let fullResponse = '';

      // Stream text chunks
      for await (const chunk of result.textStream) {
        fullResponse += chunk;
        if (onChunk) {
          onChunk(chunk);
        }
      }

      // IMPORTANT: Await the result to get access to steps, toolCalls, etc.
      const fullResult = await result;

      return {
        content: fullResponse,
        finishReason: fullResult.finishReason,
        usage: fullResult.usage,
        // toolCalls,
        // toolResults,
        // steps: fullResult.steps,
      };
    } catch (error) {
      console.error(chalk.red('AI Service Error:'), error.message);
      console.error(chalk.red('Full error:'), error);
      throw error;
    }
  }

  //* Get a non-streaming response
  async getMessage(messages, tools = undefined) {
    let fullResponse = '';
    await this.sendMessage(messages, chunk => {
      fullResponse += chunk;
    });

    return fullResponse;
  }
}
