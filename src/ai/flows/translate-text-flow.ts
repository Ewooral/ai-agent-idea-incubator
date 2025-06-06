
'use server';
/**
 * @fileOverview A Genkit flow to translate text into a specified target language.
 *
 * - translateText - A function that translates text.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  textToTranslate: z.string().describe('The text content to be translated.'),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Spanish", "French", "Japanese"). Provide the full language name.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translationPrompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `Translate the following text into {{targetLanguage}}. Only return the translated text, without any introductory phrases like "Here is the translation:" or any explanations.

Text to translate:
{{{textToTranslate}}}
`,
  // Example of potential safety settings if needed, but generally not required for simple translation
  // config: {
  //   safetySettings: [
  //     {
  //       category: 'HARM_CATEGORY_HATE_SPEECH',
  //       threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  //     },
  //   ],
  // },
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    const {output} = await translationPrompt(input);
    if (!output) {
        // This case should ideally be handled by Genkit's error handling or prompt output validation.
        // Throwing an error here to make it explicit if output is unexpectedly null/undefined.
        throw new Error("Translation prompt did not return an output.");
    }
    return output;
  }
);
