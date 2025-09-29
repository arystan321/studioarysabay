"use server";

import {
  generateQuizQuestions,
  type GenerateQuizQuestionsOutput,
} from "@/ai/flows/generate-quiz-questions";
import { z } from "zod";

const QuizRequestSchema = z.object({
  topic: z
    .string({ required_error: "Topic is required." })
    .min(2, { message: "Topic must be at least 2 characters." })
    .max(50, { message: "Topic must be 50 characters or less." }),
  numQuestions: z.coerce.number().min(1).max(10),
});

export type FormState = {
  questions?: GenerateQuizQuestionsOutput["questions"];
  error?: string;
  formErrors?: {
    topic?: string[];
    numQuestions?: string[];
  }
};

export async function createQuiz(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = QuizRequestSchema.safeParse({
    topic: formData.get("topic"),
    numQuestions: formData.get("numQuestions"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid input. Please check the form.",
      formErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const quiz = await generateQuizQuestions(validatedFields.data);
    if (!quiz.questions || quiz.questions.length === 0) {
      return { error: "Could not generate a quiz for this topic. Please try a different one." };
    }
    return { questions: quiz.questions };
  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred while generating the quiz. Please try again later." };
  }
}
