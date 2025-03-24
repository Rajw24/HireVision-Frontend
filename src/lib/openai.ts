import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'your-api-key-here', // Replace with your actual API key
  dangerouslyAllowBrowser: true
});

export const generateAIContent = async (prompt: string, section: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional resume writer. Generate content for the ${section} section of a resume. Keep the response concise and professional.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw error;
  }
};