
interface QuestionProps {
  question: string;
  options: string[];
  onAnswer: (index: number) => void;
  selectedAnswer?: number;
  correctAnswer?: number;
}

export const Question = ({ 
  question, 
  options, 
  onAnswer, 
  selectedAnswer,
  correctAnswer 
}: QuestionProps) => {
  const getOptionClassName = (index: number) => {
    const baseClasses = "w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ";
    
    if (correctAnswer === undefined) {
      return baseClasses + (
        selectedAnswer === index
          ? "border-primary bg-primary/10 text-primary shadow-lg scale-[1.02]"
          : "border-gray-200 hover:border-primary/50 hover:scale-[1.01]"
      );
    }

    if (index === correctAnswer) {
      return baseClasses + "border-green-500 bg-green-50 text-green-800 shadow-lg scale-[1.02]";
    }
    
    if (selectedAnswer === index && index !== correctAnswer) {
      return baseClasses + "border-red-500 bg-red-50 text-red-800";
    }

    return baseClasses + "border-gray-200 opacity-75";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">{question}</h2>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !correctAnswer && onAnswer(index)}
            disabled={correctAnswer !== undefined}
            className={getOptionClassName(index)}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </div>
            {correctAnswer !== undefined && selectedAnswer === index && index !== correctAnswer && (
              <div className="mt-2 text-sm text-green-700 pl-9">
                Correct answer: {options[correctAnswer]}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
