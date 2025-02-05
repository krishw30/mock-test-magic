import { useState } from "react";
import { Timer } from "@/components/Timer";
import { ProgressBar } from "@/components/ProgressBar";
import { Question } from "@/components/Question";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
];

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answerIndex }));
  };

  const handleSkip = () => {
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleSaveAndNext = () => {
    if (answers[currentQuestion] === undefined) {
      toast({
        title: "Please select an answer",
        description: "You must select an answer before saving.",
        variant: "destructive",
      });
      return;
    }
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setIsSubmitted(false);
    toast({
      title: "Test Reset",
      description: "All answers have been cleared. You can start fresh.",
    });
  };

  const handleSubmit = () => {
    const score = questions.reduce((acc, q, index) => {
      return acc + (answers[index] === q.correctAnswer ? 1 : 0);
    }, 0);

    setIsSubmitted(true);
    toast({
      title: "Test Completed!",
      description: `Your score: ${score}/${questions.length}`,
    });
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const isAnswerCorrect = (questionIndex: number) => {
    if (!isSubmitted || answers[questionIndex] === undefined) return null;
    return answers[questionIndex] === questions[questionIndex].correctAnswer;
  };

  const getButtonVariant = (index: number) => {
    if (!isSubmitted) {
      return answers[index] !== undefined ? "default" : "outline";
    }
    const isCorrect = isAnswerCorrect(index);
    if (isCorrect === true) return "secondary";
    if (isCorrect === false) return "destructive";
    return "outline";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Timer />
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            {/* Question Navigation Panel */}
            <div className="flex flex-wrap gap-2 max-w-[200px]">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={getButtonVariant(index)}
                  size="sm"
                  onClick={() => navigateToQuestion(index)}
                  className={currentQuestion === index ? "ring-2 ring-primary" : ""}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <ProgressBar current={currentQuestion + 1} total={questions.length} />

        <div className="bg-white shadow-sm rounded-xl p-6">
          <Question
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            onAnswer={handleAnswer}
            selectedAnswer={answers[currentQuestion]}
            correctAnswer={isSubmitted ? questions[currentQuestion].correctAnswer : undefined}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={isSubmitted}
            >
              Reset Test
            </Button>
          </div>
          
          <div className="space-x-4">
            <Button 
              variant="destructive"
              onClick={handleSubmit}
              disabled={isSubmitted}
            >
              Submit Test
            </Button>
            {currentQuestion !== questions.length - 1 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                >
                  Skip
                </Button>
                <Button 
                  onClick={handleSaveAndNext}
                  disabled={answers[currentQuestion] === undefined}
                >
                  Save & Next
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;