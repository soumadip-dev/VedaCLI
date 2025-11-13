import ENV from './env.config.js';

export const config = {
  googleApiKey: ENV.GOOGLE_GENERATIVE_AI_API_KEY || '',
  model: ENV.ORBITAI_MODEL || 'gemini-2.5-flash',
};
