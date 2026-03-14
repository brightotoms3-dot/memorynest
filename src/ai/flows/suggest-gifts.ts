'use server';
/**
 * @fileOverview A Genkit flow for generating creative gift ideas for upcoming events.
 *
 * - suggestGifts - A function that generates gift suggestions.
 * - SuggestGiftsInput - The input type for the suggestGifts function.
 * - SuggestGiftsOutput - The return type for the suggestGifts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGiftsInputSchema = z.object({
  eventName: z.string().describe('The name of the event (e.g., Anniversary, Birthday).'),
  description: z.string().optional().describe('Details about the event or person.'),
});
export type SuggestGiftsInput = z.infer<typeof SuggestGiftsInputSchema>;

const SuggestGiftsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of 3-4 creative and personalized gift ideas.'),
  reasoning: z.string().describe('A short, warm explanation of why these gifts were chosen.')
});
export type SuggestGiftsOutput = z.infer<typeof SuggestGiftsOutputSchema>;

export async function suggestGifts(input: SuggestGiftsInput): Promise<SuggestGiftsOutput> {
  return suggestGiftsFlow(input);
}

const suggestGiftsPrompt = ai.definePrompt({
  name: 'suggestGiftsPrompt',
  input: {schema: SuggestGiftsInputSchema},
  output: {schema: SuggestGiftsOutputSchema},
  prompt: `You are a thoughtful gift-giving expert. The user has an upcoming event called "{{{eventName}}}".
{{#if description}}Description: {{{description}}}{{/if}}

Provide 3 to 4 unique and personalized gift ideas. 
- Avoid generic "gift card" suggestions. 
- Think about sentimental value, experiences, or practical items that match the event theme.
- Keep the suggestions concise and creative.`
});

const suggestGiftsFlow = ai.defineFlow(
  {
    name: 'suggestGiftsFlow',
    inputSchema: SuggestGiftsInputSchema,
    outputSchema: SuggestGiftsOutputSchema
  },
  async (input) => {
    const {output} = await suggestGiftsPrompt(input);
    return output!;
  }
);
