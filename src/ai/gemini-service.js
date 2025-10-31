import ora from 'ora';
import { convertToModelMessages, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { config } from '../config/config.js';

export async function sendMessage({ messages, onChunk, retries = 3 }) {
  if (!messages || !Array.isArray(messages)) {
    throw new Error('Messages must be an array');
  }

  if (!config.googleApiKey) {
    throw new Error('Google API key is missing. Please check your .env file');
  }

  if (!config.model) {
    throw new Error('Model configuration is missing');
  }

  let attempt = 0;
  let lastErr;

  while (attempt <= retries) {
    const spinner = ora({
      text: attempt === 0 ? 'VEDA is thinking...' : `Retrying (${attempt}/${retries})...`,
      color: 'green',
      spinner: 'dots2',
    }).start();

    try {
      const model = google(config.model, {
        apiKey: config.googleApiKey,
      });

      const { textStream } = await streamText({
        model,
        messages: convertToModelMessages(messages),
        maxOutputTokens: 4096,
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      });

      spinner.stop();

      let fullResponse = '';
      for await (const chunk of textStream) {
        fullResponse += chunk;
        if (onChunk) onChunk(chunk);
      }

      return fullResponse.trim();
    } catch (err) {
      spinner.stop();
      lastErr = err;

      const errorMsg = String(err?.message || '');
      console.error(`Attempt ${attempt + 1} failed:`, errorMsg);

      // Don't retry on these errors
      if (
        /\b(401|403|429|404)\b/.test(errorMsg) ||
        /not found|quota|rate limit|invalid api key/i.test(errorMsg)
      ) {
        break;
      }

      // Exponential backoff
      if (attempt < retries) {
        const delayMs = 1000 * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      attempt += 1;
    }
  }

  throw lastErr || new Error('Failed to get response after retries');
}
