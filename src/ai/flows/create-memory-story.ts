'use server';
/**
 * @fileOverview A Genkit flow for generating a short, humanized, and easy-to-read memory story.
 *
 * - createMemoryStory - A function that generates a memory story.
 * - CreateMemoryStoryInput - The input type for the createMemoryStory function.
 * - CreateMemoryStoryOutput - The return type for the createMemoryStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateMemoryStoryInputSchema = z.object({
  whatHappened: z
    .string()
    .describe('A description of what happened today.'),
  whatMadeYouHappy: z
    .string()
    .describe('What made the user happy today.'),
  didYouLearnSomething: z
    .string()
    .optional()
    .describe('An optional description of something the user learned today.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
});
export type CreateMemoryStoryInput = z.infer<typeof CreateMemoryStoryInputSchema>;

const CreateMemoryStoryOutputSchema = z.object({
  story: z
    .string()
    .describe('A very simple, conversational, and easy-to-understand story about the day, 2-3 short sentences.')
});
export type CreateMemoryStoryOutput = z.infer<typeof CreateMemoryStoryOutputSchema>;

export async function createMemoryStory(
  input: CreateMemoryStoryInput
): Promise<CreateMemoryStoryOutput> {
  return createMemoryStoryFlow(input);
}

const createMemoryStoryPrompt = ai.definePrompt({
  name: 'createMemoryStoryPrompt',
  input: {schema: CreateMemoryStoryInputSchema},
  output: {schema: CreateMemoryStoryOutputSchema},
  prompt: `You are an AI that writes daily memories in a very human, simple, and conversational way. 
The goal is to make the story easy to read and understand for everyone, especially people who don't like reading long texts.

Rules:
1. Use very simple language. No fancy words.
2. Keep it short: only 2 to 3 punchy sentences.
3. Make it feel like a warm text message from a friend.
4. Focus on the feeling of the day.

Inputs:
What happened: {{{whatHappened}}}
What made them happy: {{{whatMadeYouHappy}}}
{{#if didYouLearnSomething}}What they learned: {{{didYouLearnSomething}}}{{/if}}
{{#if photoDataUri}}Photo reference included.{{/if}}

Example Style:
"Today was so nice. I finally got some fresh air on a long walk, and the sun felt amazing. It's the little things that count."`
});

const createMemoryStoryFlow = ai.defineFlow(
  {
    name: 'createMemoryStoryFlow',
    inputSchema: CreateMemoryStoryInputSchema,
    outputSchema: CreateMemoryStoryOutputSchema
  },
  async (input) => {
    const {output} = await createMemoryStoryPrompt(input);
    return output!;
  }
);
