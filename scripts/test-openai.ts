import { openai, AI_MODELS } from '../lib/ai/openai-client.ts';
import { RELEVANCE_FILTER_PROMPT } from '../lib/ai/prompts.ts';

async function testAI() {
    try {
        console.log('Testing OpenAI API...\n');

        const testTweet = "HDFC Infinia Credit Card - Get 5x reward points on dining via Swiggy Dineout! Valid till Dec 31, 2024.";

        const completion = await openai.chat.completions.create({
            model: AI_MODELS.RELEVANCE_FILTER,
            messages: [
                {
                    role: 'system',
                    content: RELEVANCE_FILTER_PROMPT,
                },
                {
                    role: 'user',
                    content: `Tweet:\n${testTweet}\n\nAuthor: @creditdeals`,
                },
            ],
            temperature: 0,
        });

        const content = completion.choices[0].message.content;
        console.log('Raw AI Response:');
        console.log(content);
        console.log('\n---\n');

        // Try to extract JSON
        let jsonContent = content?.trim() || '';
        const jsonMatch = jsonContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1].trim();
            console.log('Extracted JSON from code block:');
        } else {
            console.log('No code block found, using raw content:');
        }
        console.log(jsonContent);
        console.log('\n---\n');

        const parsed = JSON.parse(jsonContent);
        console.log('Parsed JSON:');
        console.log(JSON.stringify(parsed, null, 2));

    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error) {
            console.error('Message:', error.message);
        }
    }
}

testAI();
