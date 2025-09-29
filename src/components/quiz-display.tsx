"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type QuizDisplayProps = {
  questions: QuizQuestion[];
  onFinish: (answers: number[]) => void;
};

export function QuizDisplay({ questions, onFinish }: QuizDisplayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onFinish(newAnswers);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto animate-in fade-in-50 duration-500">
      <CardHeader>
        <Progress value={progress} className="h-2 mb-4" />
        <CardTitle className="text-xl md:text-2xl leading-snug">
          {currentQuestion.question}
        </CardTitle>
        <CardDescription>
          Question {currentQuestionIndex + 1} of {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => setSelectedAnswer(Number(value))}
          className="space-y-4"
        >
          {currentQuestion.answers.map((answer, index) => (
            <Label
              key={index}
              htmlFor={`answer-${index}`}
              className="flex items-center gap-4 rounded-lg border p-4 cursor-pointer hover:bg-secondary has-[[data-state=checked]]:bg-secondary has-[[data-state=checked]]:border-primary"
            >
              <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
              <span className="text-base">{answer}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} disabled={selectedAnswer === null} className="w-full">
          {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
        </Button>
      </CardFooter>
    </Card>
  );
}
