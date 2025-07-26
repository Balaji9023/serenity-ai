'use server';

/**
 * @fileOverview A mental wellness support AI chat companion.
 *
 * - mentalWellnessSupport - A function that handles the mental wellness support process.
 * - MentalWellnessSupportInput - The input type for the mentalWellnessSupport function.
 * - MentalWellnessSupportOutput - The return type for the mentalWellnessSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MentalWellnessSupportInputSchema = z.object({
  message: z.string().describe('The user message to the AI companion.'),
});
export type MentalWellnessSupportInput = z.infer<typeof MentalWellnessSupportInputSchema>;

const MentalWellnessSupportOutputSchema = z.object({
  response: z.string().describe('The response from the AI companion.'),
});
export type MentalWellnessSupportOutput = z.infer<typeof MentalWellnessSupportOutputSchema>;

export async function mentalWellnessSupport(input: MentalWellnessSupportInput): Promise<MentalWellnessSupportOutput> {
  return mentalWellnessSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentalWellnessSupportPrompt',
  input: {schema: MentalWellnessSupportInputSchema},
  output: {schema: MentalWellnessSupportOutputSchema},
  prompt: `You are a compassionate AI mental wellness companion. Your goal is to provide personalized support and empathetic conversations to the user. Respond in a way that makes the user feel understood and supported.\n\nUser message: {{{message}}}`,
});

const mentalWellnessSupportFlow = ai.defineFlow(
  {
    name: 'mentalWellnessSupportFlow',
    inputSchema: MentalWellnessSupportInputSchema,
    outputSchema: MentalWellnessSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
