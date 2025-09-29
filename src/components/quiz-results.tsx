"use client";

import { useEffect, useMemo } from "react";
import type { QuizQuestion } from "@/lib/definitions";
import { useGameStore } from "@/hooks/use-game-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Award, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

type QuizResultsProps = {
  questions: QuizQuestion[];
  userAnswers: number[];
  onPlayAgain: () => void;
};

const POINTS_PER_CORRECT_ANSWER = 10;

export function QuizResults({ questions, userAnswers, onPlayAgain }: QuizResultsProps) {
  const { addPoints, updateHealth } = useGameStore();

  const score = useMemo(() => {
    return userAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswerIndex ? acc + 1 : acc;
    }, 0);
  }, [userAnswers, questions]);

  const pointsEarned = score * POINTS_PER_CORRECT_ANSWER;

  useEffect(() => {
    if (pointsEarned > 0) {
      addPoints(pointsEarned);
    }
    updateHealth(100); // Restore health on quiz completion
  }, [pointsEarned, addPoints, updateHealth]);
  
  const getFeedbackMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect Score! Your pet is very proud!";
    if (percentage >= 75) return "Great job! You're a fast learner!";
    if (percentage >= 50) return "Good effort! Keep practicing!";
    return "Nice try! Every quiz helps you learn something new.";
  };

  return (
    <Card className="w-full max-w-lg mx-auto text-center animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="mx-auto bg-yellow-400 rounded-full p-3 w-fit mb-2">
            <Award className="h-8 w-8 text-yellow-900" />
        </div>
        <CardTitle className="font-headline text-3xl">Quiz Complete!</CardTitle>
        <CardDescription>{getFeedbackMessage()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-5xl font-bold">
          {score} / {questions.length}
        </div>
        <div className="flex items-center justify-center gap-2 text-lg font-semibold text-yellow-600">
          <Award className="h-6 w-6"/>
          <span>You earned {pointsEarned} points!</span>
        </div>
        <div className="space-y-4 max-h-60 overflow-y-auto p-1 text-left">
          {questions.map((q, i) => (
             <div key={i} className="p-3 rounded-md bg-secondary/50">
                <p className="font-semibold text-sm mb-2">{i+1}. {q.question}</p>
                <div className={cn("text-sm p-2 rounded flex items-center gap-2", userAnswers[i] === q.correctAnswerIndex ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                    {userAnswers[i] === q.correctAnswerIndex ? <CheckCircle2 className="h-4 w-4 shrink-0"/> : <XCircle className="h-4 w-4 shrink-0"/>}
                    Your answer: {q.answers[userAnswers[i]]}
                </div>
                {userAnswers[i] !== q.correctAnswerIndex && (
                     <div className="text-sm p-2 mt-1 rounded flex items-center gap-2 bg-green-100 text-green-800">
                        <CheckCircle2 className="h-4 w-4 shrink-0"/>
                        Correct answer: {q.answers[q.correctAnswerIndex]}
                     </div>
                )}
             </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onPlayAgain} className="w-full">
          <RotateCw className="mr-2 h-4 w-4" />
          Play Again
        </Button>
      </CardFooter>
    </Card>
  );
}
