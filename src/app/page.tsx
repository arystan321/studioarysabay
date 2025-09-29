"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { createQuiz } from "@/app/actions";
import { QuizCreator } from "@/components/quiz-creator";
import { QuizDisplay } from "@/components/quiz-display";
import { QuizResults } from "@/components/quiz-results";
import type { QuizQuestion } from "@/lib/definitions";
import { Loader2 } from "lucide-react";

type QuizState = "form" | "loading" | "quiz" | "results";

export default function Home() {
  const [quizState, setQuizState] = useState<QuizState>("form");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const [formState, formAction] = useFormState(createQuiz, {});

  const handleQuizCreation = (data: FormData) => {
    setQuizState("loading");
    formAction(data);
  };

  if (formState.questions && quizState === "loading") {
    setQuestions(formState.questions);
    setQuizState("quiz");
    formState.questions = undefined; // Reset for next time
  } else if (formState.error && quizState === "loading") {
     alert(`Error: ${formState.error}`); // Simple error handling
     setQuizState("form");
     formState.error = undefined; // Reset for next time
  }


  const handleQuizFinish = (answers: number[]) => {
    setUserAnswers(answers);
    setQuizState("results");
  };

  const handlePlayAgain = () => {
    setQuestions([]);
    setUserAnswers([]);
    setQuizState("form");
  };

  const renderContent = () => {
    switch (quizState) {
      case "form":
        return <QuizCreator action={handleQuizCreation} />;
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold text-primary-foreground">Generating your quiz...</p>
            <p className="text-muted-foreground">Your pet is excited to learn!</p>
          </div>
        );
      case "quiz":
        return <QuizDisplay questions={questions} onFinish={handleQuizFinish} />;
      case "results":
        return (
          <QuizResults
            questions={questions}
            userAnswers={userAnswers}
            onPlayAgain={handlePlayAgain}
          />
        );
      default:
        return null;
    }
  };

  return (
      <div className="container mx-auto flex h-full flex-col justify-center px-4">
        {renderContent()}
      </div>
  );
}
