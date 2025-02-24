
import type { NextApiRequest, NextApiResponse } from 'next';

const openAIApiKey = process.env.OPENAI_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant that analyzes multiple choice questions and provides the index of the correct answer. Only respond with the number representing the index of the correct answer (0-3).'
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return res.status(200).json({ generatedText });
  } catch (error) {
    console.error('Error in get-answer API:', error);
    return res.status(500).json({ error: error.message });
  }
}
