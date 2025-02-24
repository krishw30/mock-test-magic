import { useState } from "react";
import { Timer } from "@/components/Timer";
import { ProgressBar } from "@/components/ProgressBar";
import { Question } from "@/components/Question";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EditTestDialog } from "@/components/EditTestDialog";
import { Brain, Rocket, Timer as TimerIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuestionType {
  question: string;
  options: string[];
  correctAnswer: number;
  marks?: number;
  negativeMark?: number;
}

const Index = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timerReset, setTimerReset] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#F2FCE2] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Brain className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
              Welcome to the
              <span className="text-primary block">Smart Test Platform</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-5 md:max-w-3xl">
              Create engaging tests, track performance, and analyze results in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <EditTestDialog 
                questions={questions}
                onQuestionsChange={setQuestions}
              />
              <Button
                size="lg"
                className="font-semibold gap-2 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:opacity-90 transition-all"
                onClick={() => {
                  const editTestDialog = document.querySelector("[role='dialog']");
                  if (editTestDialog) {
                    (editTestDialog as HTMLElement).click();
                  }
                }}
              >
                <Rocket className="w-5 h-5" />
                Create Your First Test
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Analysis</h3>
                <p className="text-gray-600">Get detailed insights into test performance and participant results.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <TimerIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Time Tracking</h3>
                <p className="text-gray-600">Monitor time spent on each question for better assessment.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
                <p className="text-gray-600">Get immediate feedback and detailed performance metrics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswer = (answerIndex: number) => {
    if (!isStarted) {
      toast({
        title: "Test not started",
        description: "Please click 'Start Test' to begin.",
        variant: "destructive",
      });
      return;
    }
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answerIndex }));
  };

  const handleSkip = () => {
    if (!isStarted) return;
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleSaveAndNext = () => {
    if (!isStarted) return;
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
    if (!isStarted) return;
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setIsSubmitted(false);
    setIsStarted(false);
    setShowResults(false);
    setTimerReset(true);
    setQuestionTimes({});
    setTotalTime(0);
    setTimeout(() => setTimerReset(false), 100);
    toast({
      title: "Test Reset",
      description: "All answers have been cleared. You can start fresh.",
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (userAnswer === undefined) {
        skippedCount++;
      } else if (userAnswer === q.correctAnswer) {
        totalScore += q.marks || 2;
        correctCount++;
      } else {
        totalScore += q.negativeMark || -0.66;
        wrongCount++;
      }
    });

    return {
      totalScore: totalScore.toFixed(2),
      correctCount,
      wrongCount,
      skippedCount,
    };
  };

  const handleSubmit = () => {
    if (!isStarted) return;
    const results = calculateScore();
    setIsSubmitted(true);
    setIsStarted(false);
    setShowResults(true);
    toast({
      title: "Test Completed!",
      description: `Score: ${results.totalScore} | Correct: ${results.correctCount} | Wrong: ${results.wrongCount} | Skipped: ${results.skippedCount}`,
    });
  };

  const navigateToQuestion = (index: number) => {
    if (!isStarted && !isSubmitted) return;
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

  const getButtonStyle = (index: number) => {
    if (!isSubmitted) return {};
    const isCorrect = isAnswerCorrect(index);
    if (isCorrect === true) return { backgroundColor: '#22c55e' };
    if (isCorrect === false) return { backgroundColor: '#ef4444' };
    return { backgroundColor: '#ffffff' };
  };

  const getResultsChartData = () => {
    const results = calculateScore();
    return [
      { name: 'Results', Correct: results.correctCount, Wrong: results.wrongCount, Skipped: results.skippedCount }
    ];
  };

  const handleTimeUpdate = (time: number) => {
    setTotalTime(time);
    setQuestionTimes(prev => ({
      ...prev,
      [currentQuestion]: time - (Object.values(questionTimes).reduce((a, b) => a + b, 0) || 0)
    }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const getSummaryText = () => {
    const { totalScore, correctCount, wrongCount, skippedCount } = calculateScore();
    const averageTimePerQuestion = totalTime / questions.length;
    
    const fastestQuestion = Object.entries(questionTimes)
      .sort(([, a], [, b]) => a - b)[0];
    const slowestQuestion = Object.entries(questionTimes)
      .sort(([, a], [, b]) => b - a)[0];

    return {
      totalQuestions: questions.length,
      totalScore,
      correctCount,
      wrongCount,
      skippedCount,
      totalTime: formatTime(totalTime),
      averageTime: formatTime(Math.floor(averageTimePerQuestion)),
      fastestQuestion: `Q${Number(fastestQuestion?.[0]) + 1} (${formatTime(fastestQuestion?.[1] || 0)})`,
      slowestQuestion: `Q${Number(slowestQuestion?.[0]) + 1} (${formatTime(slowestQuestion?.[1] || 0)})`,
      accuracy: `${((correctCount / questions.length) * 100).toFixed(1)}%`
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#F2FCE2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsStarted(true)}
              disabled={isStarted || isSubmitted}
              variant="outline"
              className="font-medium hover:bg-primary/5"
            >
              Start Test
            </Button>
            <EditTestDialog 
              questions={questions}
              onQuestionsChange={setQuestions}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Timer 
              isRunning={isStarted} 
              shouldReset={timerReset}
              onTimeUpdate={handleTimeUpdate}
            />
            <div className="text-sm text-gray-500 font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <ProgressBar current={currentQuestion + 1} total={questions.length} />
          
          <div className="mt-6">
            <Question
              question={questions[currentQuestion].question}
              options={questions[currentQuestion].options}
              onAnswer={handleAnswer}
              selectedAnswer={answers[currentQuestion]}
              correctAnswer={isSubmitted ? questions[currentQuestion].correctAnswer : undefined}
            />
          </div>
        </div>

        <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || !isStarted}
              className="hover:bg-primary/5"
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="hover:bg-primary/5"
            >
              Reset Test
            </Button>
          </div>
          
          <div className="space-x-4">
            {isSubmitted && (
              <Button 
                variant="secondary"
                onClick={() => setShowSummary(true)}
                className="bg-primary/10 hover:bg-primary/20 text-primary"
              >
                View Summary
              </Button>
            )}
            <Button 
              variant="destructive"
              onClick={handleSubmit}
              disabled={isSubmitted || !isStarted}
              className="hover:opacity-90"
            >
              Submit Test
            </Button>
            {currentQuestion !== questions.length - 1 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                  disabled={!isStarted}
                  className="hover:bg-primary/5"
                >
                  Skip
                </Button>
                <Button 
                  onClick={handleSaveAndNext}
                  disabled={answers[currentQuestion] === undefined || !isStarted}
                  className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:opacity-90"
                >
                  Save & Next
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Test Results</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky top-0 bg-white">Q.No</TableHead>
                    <TableHead className="sticky top-0 bg-white">Your Answer</TableHead>
                    <TableHead className="sticky top-0 bg-white">Correct Answer</TableHead>
                    <TableHead className="sticky top-0 bg-white">Time Taken</TableHead>
                    <TableHead className="sticky top-0 bg-white">Status</TableHead>
                    <TableHead className="sticky top-0 bg-white">Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer === question.correctAnswer;
                    const marks = userAnswer === undefined ? 0 : 
                      isCorrect ? question.marks : question.negativeMark;

                    return (
                      <TableRow key={index}>
                        <TableCell>Question {index + 1}</TableCell>
                        <TableCell>
                          {userAnswer !== undefined ? question.options[userAnswer] : "Skipped"}
                        </TableCell>
                        <TableCell>{question.options[question.correctAnswer]}</TableCell>
                        <TableCell>{formatTime(questionTimes[index] || 0)}</TableCell>
                        <TableCell>
                          {userAnswer === undefined ? (
                            <span className="text-gray-500">Skipped</span>
                          ) : isCorrect ? (
                            <span className="text-green-600">Correct</span>
                          ) : (
                            <span className="text-red-600">Wrong</span>
                          )}
                        </TableCell>
                        <TableCell>{marks}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
