
'use server';

import { askIdeaIncubatorChatbot, type IdeaIncubatorChatbotInput, type IdeaIncubatorChatbotOutput } from '@/ai/flows/idea-incubator-chat-flow';
import { helpTopics, type HelpTopic } from '@/data/help-guide-topics';
import { z } from 'zod';

// Simple markdown to plain text (very basic, consider a library for complex markdown)
function simplifyMarkdownForPrompt(markdown: string): string {
  // Remove headings, list markers, image tags, bold/italics, links but keep link text
  let text = markdown
    .replace(/#{1,6}\s*(.+)/g, '$1.') // Headings to sentences
    .replace(/!\[.*?\]\(.*?\)/g, '')    // Remove images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Keep link text
    .replace(/(\*|_){1,2}(.*?)\1{1,2}/g, '$2') // Remove bold/italics
    .replace(/\n\s*-\s*/g, '\n- ')    // Normalize list items
    .replace(/\n\s*\*\s*/g, '\n* ')  // Normalize list items (asterisk)
    .replace(/\n\s*\d+\.\s*/g, '\n ') // Remove numbered list markers
    .replace(/<\/?[^>]+(>|$)/g, "")    // Strip other HTML tags
    .replace(/\s\s+/g, ' ')           // Normalize whitespace
    .trim();
  
  // Take first N sentences or up to a certain character limit for brevity
  const sentences = text.split('. ').slice(0, 3); // Max 3 sentences
  let summary = sentences.join('. ');
  if (summary.length > 300) {
    summary = summary.substring(0, 300) + '...';
  }
  return summary;
}


const ChatbotActionInputSchema = z.object({
  userQuery: z.string(),
  chatHistory: z.array(
    z.object({
      role: z.enum(['user', 'model']), // Ensure frontend uses 'model' for AI responses
      parts: z.array(z.object({ text: z.string() })),
    })
  ).optional(),
});

export type ChatbotActionFrontendInput = {
  userQuery: string;
  chatHistory: Array<{ role: 'user' | 'ai'; content: string }>; // Frontend uses 'ai'
}

export async function askChatbotAction(
  input: ChatbotActionFrontendInput
): Promise<{ success: boolean; aiResponse?: string; message?: string }> {
  
  const validation = ChatbotActionInputSchema.safeParse({
    userQuery: input.userQuery,
    // Transform frontend chat history (role: 'ai') to backend (role: 'model')
    chatHistory: input.chatHistory.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })),
  });

  if (!validation.success) {
    return { success: false, message: "Invalid input: " + validation.error.flatten().fieldErrors };
  }

  try {
    // Prepare app feature summaries from helpTopics
    const appFeatureSummaries = helpTopics.map((topic: HelpTopic) => ({
      title: topic.title,
      summary: simplifyMarkdownForPrompt(topic.content),
    }));

    const flowInput: IdeaIncubatorChatbotInput = {
      userQuery: validation.data.userQuery,
      chatHistory: validation.data.chatHistory,
      appFeatureSummaries: appFeatureSummaries,
    };

    const result: IdeaIncubatorChatbotOutput = await askIdeaIncubatorChatbot(flowInput); // Use the new wrapper function
    return { success: true, aiResponse: result.aiResponse };
  } catch (error: any) {
    console.error('Error during chatbot action:', error);
    return { success: false, message: error.message || 'Failed to get response from chatbot.' };
  }
}
