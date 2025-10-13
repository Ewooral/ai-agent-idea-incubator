
import { z } from 'zod';

export const AnalyzeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a competitor's app, website, or product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userPrompt: z
    .string()
    .optional()
    .describe('A specific question or focus for the analysis (e.g., "What is the primary call to action?").'),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

export const AnalyzeImageOutputSchema = z.object({
  uiUxAnalysis: z.string().describe("A brief analysis of the user interface and user experience, covering layout, color scheme, and usability."),
  brandAndMarketingAnalysis: z.string().describe("An analysis of the branding, tone, and potential marketing message conveyed by the image."),
  featureIdentification: z.array(z.string()).describe("A list of identifiable features or key components visible in the image."),
  potentialImprovements: z.array(z.string()).describe("A list of 2-3 actionable suggestions for potential improvements based on the analysis."),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;
