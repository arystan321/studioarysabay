'use server';

/**
 * @fileOverview Quiz generation flow.
 *
 * - generateQuizQuestions - A function that generates a quiz based on the given topic and number of questions.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizQuestionsInput = z.infer<
  typeof GenerateQuizQuestionsInputSchema
>;

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string(),
        answers: z.array(z.string()),
        correctAnswerIndex: z.number(),
      })
    )
    .describe('An array of quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<
  typeof GenerateQuizQuestionsOutputSchema
>;

export async function generateQuizQuestions(
  input: GenerateQuizQuestionsInput
): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const generateQuizQuestionsPrompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are a quiz generator. Generate a quiz on the topic of {{{topic}}} with {{{numQuestions}}} questions.

The quiz should be in the following JSON format:
{
  "questions": [
    {
      "question": "question text",
      "answers": ["answer 1", "answer 2", "answer 3", "answer 4"],
      "correctAnswerIndex": 0
    }
  ]
}

Each question should have 4 possible answers, and only one correct answer.
`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateQuizQuestionsPrompt(input);
    return output!;
  }
);
