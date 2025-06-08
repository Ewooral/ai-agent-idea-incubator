
'use server';
/**
 * @fileOverview A Genkit flow for an AI chatbot to answer questions about the Idea Incubator app.
 *
 * - ideaIncubatorChatbotFlow - The main flow function.
 * - IdeaIncubatorChatbotInput - Input type for the flow.
 * - IdeaIncubatorChatbotOutput - Output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({text: z.string()})),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const AppFeatureSummarySchema = z.object({
  title: z.string().describe("The title of the application feature."),
  summary: z.string().describe("A brief summary of what the feature does and how to use it."),
  // We could add more structured data here if needed, like keywords or related features.
});

export const IdeaIncubatorChatbotInputSchema = z.object({
  userQuery: z.string().describe("The user's current question."),
  chatHistory: z.array(ChatMessageSchema).optional().describe("The history of the conversation so far."),
  appFeatureSummaries: z.array(AppFeatureSummarySchema).describe("Summaries of the Idea Incubator application features to be used as a knowledge base."),
});
export type IdeaIncubatorChatbotInput = z.infer<typeof IdeaIncubatorChatbotInputSchema>;

export const IdeaIncubatorChatbotOutputSchema = z.object({
  aiResponse: z.string().describe("The AI's response to the user's query."),
});
export type IdeaIncubatorChatbotOutput = z.infer<typeof IdeaIncubatorChatbotOutputSchema>;


const chatbotPrompt = ai.definePrompt({
  name: 'ideaIncubatorChatbotPrompt',
  input: {schema: IdeaIncubatorChatbotInputSchema},
  output: {schema: IdeaIncubatorChatbotOutputSchema},
  prompt: `You are "Sparky", a friendly, respectful, and helpful AI assistant for the "Idea Incubator" web application.
Your primary goal is to answer user questions about how to use the Idea Incubator application and its features.
Base your answers *only* on the information provided below about Idea Incubator's features.
If a question is outside this scope, or if the information below doesn't cover the question, politely state that you don't have the information or cannot answer that specific question.
Do not invent features or speculate. Be concise and clear in your answers.
If asked about your name, mention you are "Sparky".
Do not refer to yourself as "the AI assistant" or "the chatbot", use "I" or "Sparky".

Here is a summary of the Idea Incubator application features. Use this as your knowledge base:
{{#each appFeatureSummaries}}
- Feature: {{this.title}}
  Summary: {{this.summary}}

{{/each}}

Chat History (if any):
{{#if chatHistory}}
  {{#each chatHistory}}
    {{#if (eq this.role "user")}}User: {{this.parts.0.text}}{{/if}}
    {{#if (eq this.role "model")}}Sparky: {{this.parts.0.text}}{{/if}}
  {{/each}}
{{/if}}

Current User Question:
{{{userQuery}}}

Sparky's Response:
`,
});

export const ideaIncubatorChatbotFlow = ai.defineFlow(
  {
    name: 'ideaIncubatorChatbotFlow',
    inputSchema: IdeaIncubatorChatbotInputSchema,
    outputSchema: IdeaIncubatorChatbotOutputSchema,
  },
  async (input) => {
    const {output} = await chatbotPrompt(input);
    if (!output || !output.aiResponse) {
        throw new Error("AI failed to generate a response for the chatbot.");
    }
    return output;
  }
);
