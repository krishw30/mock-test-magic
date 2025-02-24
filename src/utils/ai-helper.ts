
export const analyzeQuestion = async (question: string, options: string[]) => {
  try {
    const response = await fetch('/api/get-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Given this multiple choice question and its options, respond ONLY with the number (0, 1, 2, or 3) representing the index of the correct answer. No other text.

Question: ${question}

Options:
${options.map((opt, idx) => `${idx}. ${opt}`).join('\n')}`,
      }),
    });

    const data = await response.json();
    return parseInt(data.generatedText.trim());
  } catch (error) {
    console.error('Error analyzing question:', error);
    return null;
  }
};
