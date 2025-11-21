# Twitter Automation - Environment Variables Setup

## Required Environment Variables

Add these variables to your `.env` file:

```env
# OpenAI Configuration (for Twitter Automation)
OPENAI_API_KEY="sk-your-openai-api-key-here"
OPENAI_MODEL_RELEVANCE="gpt-4o-mini"
OPENAI_MODEL_EXTRACTION="gpt-4o"
```

## Getting an OpenAI API Key

1. Visit https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and add it to your `.env` file
5. **Important**: Never commit the `.env` file to git!

## Model Configuration

### Relevance Filter Model (`OPENAI_MODEL_RELEVANCE`)
- Default: `gpt-4o-mini`
- Purpose: Quick, cheap relevance checking
- Cost: ~$0.0001 per tweet
- Alternative: Can use `gpt-3.5-turbo` for even cheaper filtering

### Extraction Model (`OPENAI_MODEL_EXTRACTION`)
- Default: `gpt-4o`
- Purpose: Accurate category detection and data extraction
- Cost: ~$0.01 per tweet
- Alternative: `gpt-4o-mini` for lower costs but potentially lower accuracy

## Estimated Costs

Based on 1000 tweets/month:
- Relevance filtering (1000 tweets × $0.0001): ~$0.10
- Extraction (1000 tweets × $0.01): ~$10.00
- **Total: ~$10-12/month**

Note: Costs may vary based on actual API pricing and tweet length.

## Testing Without API Key

If you don't have an OpenAI API key yet, you can still:
- Import tweets via CSV
- View tweets in the source management interface
- Manually create posts using the existing admin panel

AI processing will only work when OPENAI_API_KEY is configured.
