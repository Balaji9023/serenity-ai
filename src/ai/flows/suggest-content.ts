// This file holds the Genkit flow for suggesting mindfulness exercises or journaling prompts based on user mood logs.

'use server';

/**
 * @fileOverview Suggests relevant mindfulness exercises or journaling prompts based on mood logs.
 *
 * - suggestContent - A function that suggests content based on mood.
 * - SuggestContentInput - The input type for the suggestContent function.
 * - SuggestContentOutput - The return type for the suggestContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestContentInputSchema = z.object({
  moodLog: z.string().describe('A string representing the user\u0027s mood log.'),
});
export type SuggestContentInput = z.infer<typeof SuggestContentInputSchema>;

const SuggestContentOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'An array of suggestions for mindfulness exercises or journaling prompts relevant to the mood log.'
    ),
});
export type SuggestContentOutput = z.infer<typeof SuggestContentOutputSchema>;

export async function suggestContent(input: SuggestContentInput): Promise<SuggestContentOutput> {
  return suggestContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContentPrompt',
  input: {schema: SuggestContentInputSchema},
  output: {schema: SuggestContentOutputSchema},
  prompt: `Based on the following mood log: {{{moodLog}}}, suggest some relevant mindfulness exercises or journaling prompts. Return the suggestions as an array of strings.`,
});

const suggestContentFlow = ai.defineFlow(
  {
    name: 'suggestContentFlow',
    inputSchema: SuggestContentInputSchema,
    outputSchema: SuggestContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
