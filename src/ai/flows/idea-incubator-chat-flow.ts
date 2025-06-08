
'use server';
/**
 * @fileOverview A Genkit flow for an AI chatbot to answer questions about the Idea Incubator app.
 *
 * - askIdeaIncubatorChatbot - The main exported async wrapper function for the flow.
 * - IdeaIncubatorChatbotInput - Input type for the flow.
 * - IdeaIncubatorChatbotOutput - Output type for the flow.
 * - ChatMessage - Type for chat messages within history.
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
});

const IdeaIncubatorChatbotInputSchema = z.object({
  userQuery: z.string().describe("The user's current question."),
  chatHistory: z.array(ChatMessageSchema).optional().describe("The history of the conversation so far."),
  appFeatureSummaries: z.array(AppFeatureSummarySchema).describe("Summaries of the Idea Incubator application features to be used as a knowledge base."),
});
export type IdeaIncubatorChatbotInput = z.infer<typeof IdeaIncubatorChatbotInputSchema>;

const IdeaIncubatorChatbotOutputSchema = z.object({
  aiResponse: z.string().describe("The AI's response to the user's query."),
});
export type IdeaIncubatorChatbotOutput = z.infer<typeof IdeaIncubatorChatbotOutputSchema>;


const chatbotPrompt = ai.definePrompt({
  name: 'ideaIncubatorChatbotPrompt',
  // The input schema for the prompt itself doesn't need to change,
  // as we will pass an augmented object to its invocation.
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
    {{#if this.isUser}}User: {{this.parts.0.text}}{{/if}}
    {{#if this.isModel}}Sparky: {{this.parts.0.text}}{{/if}}
  {{/each}}
{{/if}}

Current User Question:
{{{userQuery}}}

Sparky's Response:
`,
});

// Internal flow definition, not exported directly
const _ideaIncubatorChatbotFlow = ai.defineFlow(
  {
    name: 'ideaIncubatorChatbotInternalFlow', // Renamed for clarity
    inputSchema: IdeaIncubatorChatbotInputSchema,
    outputSchema: IdeaIncubatorChatbotOutputSchema,
  },
  async (input) => {
    // Augment chatHistory with isUser and isModel flags for Handlebars
    const augmentedChatHistory = input.chatHistory?.map(msg => ({
      ...msg,
      isUser: msg.role === 'user',
      isModel: msg.role === 'model',
    }));

    const promptInput = {
      ...input,
      chatHistory: augmentedChatHistory,
    };

    const {output} = await chatbotPrompt(promptInput);
    if (!output || !output.aiResponse) {
        throw new Error("AI failed to generate a response for the chatbot.");
    }
    return output;
  }
);

// Exported async wrapper function
export async function askIdeaIncubatorChatbot(input: IdeaIncubatorChatbotInput): Promise<IdeaIncubatorChatbotOutput> {
  return _ideaIncubatorChatbotFlow(input);
}
