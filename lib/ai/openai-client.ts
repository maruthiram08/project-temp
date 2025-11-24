import OpenAI from 'openai';

// Lazy initialization of OpenAI client
let _openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
    if (!_openaiClient) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OPENAI_API_KEY environment variable is not set. Please configure it to use AI tweet processing features.');
        }
        _openaiClient = new OpenAI({ apiKey });
    }
    return _openaiClient;
}

// For backward compatibility
export const openai = new Proxy({} as OpenAI, {
    get(_target, prop) {
        return getOpenAIClient()[prop as keyof OpenAI];
    }
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
