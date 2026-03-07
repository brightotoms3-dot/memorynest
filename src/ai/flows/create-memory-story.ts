
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
    .describe('A very simple, conversational, and easy-to-understand story about the day. Max 2-3 short sentences. Use simple words for people who do not like reading long texts.')
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
The goal is to make the story extremely easy to read and understand for everyone, especially people who find reading long paragraphs tiring.

Rules:
1. Use the most basic, common English words possible. 
2. Be extremely concise: 2 or 3 short, punchy sentences ONLY.
3. Make it sound like a friendly text message or a caption from a friend.
4. Focus on the core positive emotion of the day.
5. NO complicated sentence structures.

Inputs:
What happened: {{{whatHappened}}}
What made them happy: {{{whatMadeYouHappy}}}
{{#if didYouLearnSomething}}What they learned: {{{didYouLearnSomething}}}{{/if}}
{{#if photoDataUri}}Photo reference included.{{/if}}

Example Style:
"Today was so lovely. I took a slow walk in the park and the sun felt warm on my face. It really made me smile."`
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
