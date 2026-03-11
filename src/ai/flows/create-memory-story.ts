'use server';
/**
 * @fileOverview A Genkit flow for generating a short, humanized, and easy-to-read memory story acting as a diary assistant.
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
    .describe('A very simple, conversational, and easy-to-understand diary reflection. Max 2-3 short sentences. Use simple words.')
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
  prompt: `You are a warm, supportive AI diary assistant. Your goal is to help the user reflect on their day by turning their raw notes into a simple, beautiful, and conversational diary entry.

Rules:
1. Use the most basic, common English words possible. 
2. Be extremely concise: 2 or 3 short, punchy sentences ONLY.
3. Sound like a friendly companion who is summarizing the day's highlights in a "human" way.
4. Focus on the positive feelings and the core memory of the day.
5. NO complicated sentence structures. This is for someone who prefers simple reading.

Inputs:
What happened: {{{whatHappened}}}
What made them happy: {{{whatMadeYouHappy}}}
{{#if didYouLearnSomething}}What they learned: {{{didYouLearnSomething}}}{{/if}}
{{#if photoDataUri}}Photo reference included.{{/if}}

Example Style:
"Today was a great day because you finally finished your project. You felt so proud and happy. It was a big win for you!"`
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
