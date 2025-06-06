
// src/ai/flows/generate-development-guide.ts
'use server';
/**
 * @fileOverview Generates a step-by-step development guide for a given business idea.
 *
 * - generateDevelopmentGuide - A function that generates the development guide.
 * - GenerateDevelopmentGuideInput - The input type for the function.
 * - GenerateDevelopmentGuideOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { SavedIdea, BuildProject } from '@/lib/db'; // Assuming types are here

// Combined input from SavedIdea and BuildProject relevant for the guide
const GenerateDevelopmentGuideInputSchema = z.object({
  originalIdea: z.string().describe('The original user-provided idea.'),
  refinedIdea: z.string().describe('The AI-refined version of the idea.'),
  valueProposition: z.string().describe('The unique value the idea offers.'),
  customerSegments: z.string().describe('The target customers for the idea.'),
  keyActivities: z.string().describe('The critical activities the business must perform.'),
  revenueStreams: z.string().describe('How the business will generate revenue.'),
  targetPlatform: z.string().optional().describe('Preferred target platform (e.g., Web, Mobile App, Desktop).'),
  coreFeaturesMVP: z.string().optional().describe('A list of 3-5 essential features for the Minimum Viable Product.'),
  techStackSuggestion: z.string().optional().describe('User\'s preferred technical stack, if any.'),
  notes: z.string().optional().describe('Additional notes or context about the idea.'),
});

export type GenerateDevelopmentGuideInput = z.infer<typeof GenerateDevelopmentGuideInputSchema>;

const GenerateDevelopmentGuideOutputSchema = z.object({
  guideMarkdown: z.string().describe('A comprehensive, step-by-step development guide in Markdown format. The guide should be well-structured with clear headings, bullet points, and actionable advice. It should cover MVP definition, development phases (setup, frontend, backend if applicable, database), testing, deployment, and post-launch considerations. Include potential challenges and rough timeline estimations (e.g., for a small team).'),
});

export type GenerateDevelopmentGuideOutput = z.infer<typeof GenerateDevelopmentGuideOutputSchema>;

export async function generateDevelopmentGuide(input: GenerateDevelopmentGuideInput): Promise<GenerateDevelopmentGuideOutput> {
  return generateDevelopmentGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDevelopmentGuidePrompt',
  input: {schema: GenerateDevelopmentGuideInputSchema},
  output: {schema: GenerateDevelopmentGuideOutputSchema},
  prompt: `You are an expert startup advisor and software architect. Your task is to create a comprehensive, step-by-step development guide in Markdown format for the following business idea.

  Original Idea: {{{originalIdea}}}
  Refined Idea: {{{refinedIdea}}}
  Value Proposition: {{{valueProposition}}}
  Customer Segments: {{{customerSegments}}}
  Key Activities: {{{keyActivities}}}
  Revenue Streams: {{{revenueStreams}}}
  {{#if targetPlatform}}Target Platform: {{{targetPlatform}}}{{/if}}
  {{#if coreFeaturesMVP}}Core MVP Features: {{{coreFeaturesMVP}}}{{/if}}
  {{#if techStackSuggestion}}User's Tech Stack Preference: {{{techStackSuggestion}}}{{/if}}
  {{#if notes}}Additional Notes: {{{notes}}}{{/if}}

  The guide should be well-structured and actionable. Please include the following sections using Markdown headings:

  ## 1. Introduction
  Briefly re-state the refined idea and the purpose of this guide.

  ## 2. Minimum Viable Product (MVP) Definition
    ### Core MVP Features
      - List and briefly describe the absolute essential features for the first version.
    ### User Stories
      - Provide 2-3 key user stories for the MVP.
    ### Tech Stack Recommendation
      - Based on the idea, target platform, and user preference (if any), recommend a suitable tech stack (frontend, backend, database). If no preference, suggest a common, effective stack. Briefly justify your choices.

  ## 3. Phase-Based Development Plan
    ### Phase 1: Project Setup & Foundational Backend (if applicable)
      - Detailed steps (e.g., Version control, project structure, basic API endpoints, database schema design).
    ### Phase 2: Core Feature Implementation (Frontend & Backend)
      - Detailed steps for building the core MVP features. Break down by feature.
    ### Phase 3: UI/UX Design & Frontend Development
      - Steps for designing user interfaces and implementing the frontend.
    ### Phase 4: Testing
      - Outline key testing strategies (unit, integration, E2E, user acceptance testing).
    ### Phase 5: Deployment
      - Suggest deployment platforms and steps based on the tech stack.

  ## 4. Post-Launch & Iteration
    ### Initial Marketing & User Acquisition
      - Suggest 2-3 initial strategies.
    ### Feedback Collection & Iteration
      - How to gather user feedback and plan for future development cycles.

  ## 5. Estimated Timeline & Resources
    - Provide a very rough timeline estimate for the MVP (e.g., 3-6 months for a small focused team of 2-3 developers). Mention factors that can influence this.
    - Briefly discuss typical team roles needed (e.g., developer, designer).

  ## 6. Potential Challenges & Mitigation
    - Identify 2-3 potential challenges (technical, market, operational) and suggest mitigation strategies.

  Ensure the output is a single Markdown string. Be practical and provide actionable advice.
  Assume the user has some technical understanding but might need guidance on structuring the development process.
  `,
});

const generateDevelopmentGuideFlow = ai.defineFlow(
  {
    name: 'generateDevelopmentGuideFlow',
    inputSchema: GenerateDevelopmentGuideInputSchema,
    outputSchema: GenerateDevelopmentGuideOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
