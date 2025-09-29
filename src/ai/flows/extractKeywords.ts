'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractKeywordsInputSchema = z.object({
  text: z.string().describe('The text to analyze for keywords.'),
  numKeywords: z
    .number()
    .default(3) // default is 4 now
    .describe('The number of keywords to extract.'),
});
export type ExtractKeywordsInput = z.infer<typeof ExtractKeywordsInputSchema>;

const ExtractKeywordsOutputSchema = z.object({
  keywords: z.array(z.string()).describe('An array of extracted keywords.'),
});
export type ExtractKeywordsOutput = z.infer<typeof ExtractKeywordsOutputSchema>;

// Server action that forces 4 keywords regardless of input
export async function extractKeywords(
  input: ExtractKeywordsInput
): Promise<ExtractKeywordsOutput> {
  const fixedInput = { ...input, numKeywords: 3 }; // force 4 keywords
  return extractKeywordsFlow(fixedInput);
}

const extractKeywordsPrompt = ai.definePrompt({
  name: 'extractKeywordsPrompt',
  input: { schema: ExtractKeywordsInputSchema },
  output: { schema: ExtractKeywordsOutputSchema },
  prompt: `You are a keyword extraction engine. 
Given the following text, extract the {{{numKeywords}}} most important keywords.
Return the result as a JSON array of strings with no explanation.

Text:
{{{text}}}`,
});

const extractKeywordsFlow = ai.defineFlow(
  {
    name: 'extractKeywordsFlow',
    inputSchema: ExtractKeywordsInputSchema,
    outputSchema: ExtractKeywordsOutputSchema,
  },
  async input => {
    const { output } = await extractKeywordsPrompt(input);
    return output!;
  }
);
