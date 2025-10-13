// src/ai/flows/analyze-image-for-insights.ts
'use server';
/**
 * @fileOverview An AI flow to analyze an image for business and UI/UX insights.
 *
 * - analyzeImageForInsights - A function that analyzes an image.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeImageInputSchema, AnalyzeImageOutputSchema, type AnalyzeImageInput, type AnalyzeImageOutput } from '@/app/schemas/image-analysis.schemas';


export async function analyzeImageForInsights(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
  return analyzeImageForInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageForInsightsPrompt',
  input: {schema: AnalyzeImageInputSchema},
  output: {schema: AnalyzeImageOutputSchema},
  prompt: `You are an expert product manager and UI/UX analyst. You will be given an image (likely a screenshot of a competitor's app or website) and an optional user prompt. Your task is to analyze the image and provide structured insights.

  Analyze the provided image:
  {{media url=photoDataUri}}

  {{#if userPrompt}}
  The user has a specific question: "{{userPrompt}}". Keep this in mind during your analysis.
  {{/if}}

  Provide the following analysis based on the image:
  - **UI/UX Analysis**: Briefly comment on the layout, color palette, typography, and perceived ease of use.
  - **Brand and Marketing Analysis**: What is the likely brand identity (e.g., playful, professional, minimalist)? What marketing message or value proposition does it convey?
  - **Feature Identification**: List the key features or components you can identify (e.g., "User Login Form", "Product Showcase Carousel", "Search Bar").
  - **Potential Improvements**: Suggest 2-3 specific, actionable improvements that could be made to the UI/UX or design.

  Be objective and provide concrete observations.
  `,
});

const analyzeImageForInsightsFlow = ai.defineFlow(
  {
    name: 'analyzeImageForInsightsFlow',
    inputSchema: AnalyzeImageInputSchema,
    outputSchema: AnalyzeImageOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate insights for the image.');
    }
    return output;
  }
);
