'use server';
/**
 * @fileOverview A Genkit flow for generating a short, emotional memory story from user inputs.
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
    .describe('A short, emotional story about the day, 3-5 sentences long.')
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
  prompt: `You are an AI assistant that specializes in writing short, emotional, and reflective memory stories based on daily inputs. Your task is to transform the provided information into a concise story, 3 to 5 sentences in length. Focus on capturing the essence and emotion of the day.

Here are today's memories:

What happened today: {{{whatHappened}}}

What made you happy: {{{whatMadeYouHappy}}}

{{#if didYouLearnSomething}}
What you learned: {{{didYouLearnSomething}}}
{{/if}}

{{#if photoDataUri}}
Photo: {{media url=photoDataUri}}
{{/if}}

Rewrite these inputs into a beautiful, emotional memory story, 3 to 5 sentences long.
Example output style: "Today was a refreshing and peaceful day. I spent some time outside enjoying the cool wind, which made the moment feel calm and relaxing. Small moments like these remind us how beautiful simple days can be."`
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
