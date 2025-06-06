
'use server';

import { translateText, type TranslateTextInput, type TranslateTextOutput } from '@/ai/flows/translate-text-flow';
import { z } from 'zod';

// This schema could be co-located with the flow, but for server actions, we sometimes redefine
// or import to ensure clear boundaries if action inputs differ slightly from flow inputs.
// For now, let's assume they are the same.
const ActionInputSchema = z.object({
  textToTranslate: z.string(),
  targetLanguage: z.string(), // Expecting full language name like "Spanish"
});

export async function translateTextAction(
  input: TranslateTextInput
): Promise<{ success: boolean; translatedText?: string; message?: string }> {
  const validation = ActionInputSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, message: "Invalid input: " + validation.error.flatten().fieldErrors };
  }

  try {
    const result: TranslateTextOutput = await translateText(validation.data);
    return { success: true, translatedText: result.translatedText };
  } catch (error: any) {
    console.error('Error during translation action:', error);
    return { success: false, message: error.message || 'Failed to translate text.' };
  }
}
