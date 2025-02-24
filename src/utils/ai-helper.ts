
export interface ImportedJSON {
  test_name?: string;
  questions: {
    question: string;
    options: Record<string, string>;
    correct_answer: number;
  }[];
}

export const analyzeQuestion = async (question: string, options: string[]) => {
  try {
    const response = await fetch('/api/get-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `You are an AI that analyzes multiple choice questions. Given the following question and options, respond ONLY with the number (0, 1, 2, or 3) representing the index of the correct answer. No other text or explanation.

Question: ${question}

Options:
${options.map((opt, idx) => `${idx}. ${opt}`).join('\n')}

Remember: Only respond with a single number (0, 1, 2, or 3).`,
      }),
    });

    const data = await response.json();
    return parseInt(data.generatedText.trim());
  } catch (error) {
    console.error('Error analyzing question:', error);
    return null;
  }
};
