import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;

export const initializeAnthropic = (apiKey: string) => {
  anthropicClient = new Anthropic({
    apiKey
  });
};

export const sendMessage = async (message: string, context: string = '') => {
  if (!anthropicClient) {
    throw new Error('Anthropic client not initialized');
  }

  const response = await anthropicClient.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: context ? `Context: ${context}\n\nUser: ${message}` : message
    }],
    system: "You are an empathetic AI therapist. Respond with understanding and professional therapeutic insights. Keep responses concise and focused on helping the user process their emotions and develop coping strategies."
  });

  return response.content[0].text;
};