
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { prompt } = req.body;
    const openAIApiKey = process.env.OPENAI_API_KEY;

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant that analyzes multiple choice questions and provides the index of the correct answer. Only respond with the number representing the index of the correct answer.'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    res.status(200).json({ generatedText });
  } catch (error) {
    console.error('Error in get-answer API:', error);
    res.status(500).json({ error: error.message });
  }
}
