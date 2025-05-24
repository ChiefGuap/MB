import Anthropic from '@anthropic-ai/sdk';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  throw new Error('Missing Anthropic API key');
}

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

export const generateTherapyResponse = async (
  message: string,
  currentEmotion: string | null,
  conversationHistory: string[]
) => {
  try {
    const emotionContext = currentEmotion 
      ? `\nDetected emotion: ${currentEmotion}`
      : '';

    const context = `Previous conversation:\n${conversationHistory.slice(-5).join('\n')}${emotionContext}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Context: ${context}\n\nUser: ${message}`
      }],
      system: "You are an empathetic AI therapist. Respond with understanding and professional therapeutic insights. Keep responses concise and focused on helping the user process their emotions and develop coping strategies."
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error generating therapy response:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
};