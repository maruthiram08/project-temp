import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Model configurations
export const AI_MODELS = {
    RELEVANCE_FILTER: process.env.OPENAI_MODEL_RELEVANCE || 'gpt-4o-mini',
    EXTRACTION: process.env.OPENAI_MODEL_EXTRACTION || 'gpt-4o',
} as const;

// AI configuration constants
export const AI_CONFIG = {
    TEMPERATURE: 0, // Deterministic output
    MAX_TOKENS: 2000, // Sufficient for most extractions
    TIMEOUT_MS: 30000, // 30 second timeout
} as const;

export type AIModel = typeof AI_MODELS[keyof typeof AI_MODELS];
