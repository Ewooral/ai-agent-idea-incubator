// src/ai/flows/analyze-idea-safety.ts
'use server';
/**
 * @fileOverview An AI flow to analyze a research idea for potential safety and ethical risks.
 *
 * - analyzeIdeaSafety - A function that analyzes a research idea for safety concerns.
 * - AnalyzeIdeaSafetyInput - The input type for the function.
 * - AnalyzeIdeaSafetyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeIdeaSafetyInputSchema = z.object({
  refinedIdea: z.string().describe('The AI-refined research idea or hypothesis to be analyzed.'),
  associatedConcepts: z.array(z.string()).optional().describe('A list of technical concepts associated with the idea.'),
});

export type AnalyzeIdeaSafetyInput = z.infer<typeof AnalyzeIdeaSafetyInputSchema>;

const AnalyzeIdeaSafetyOutputSchema = z.object({
  potentialMisuse: z.string().describe("An analysis of how the research or resulting technology could be misused by malicious actors (dual-use risks). Provide 2-3 concrete, plausible examples."),
  safetyAndAlignmentRisks: z.string().describe("An analysis of potential new AI safety or alignment challenges this research could introduce (e.g., emergent capabilities, reward hacking, negative side effects)."),
  ethicalConsiderations: z.string().describe("An analysis of broader societal or ethical issues to consider, such as fairness, bias, economic impact, or autonomy."),
});

export type AnalyzeIdeaSafetyOutput = z.infer<typeof AnalyzeIdeaSafetyOutputSchema>;

export async function analyzeIdeaSafety(input: AnalyzeIdeaSafetyInput): Promise<AnalyzeIdeaSafetyOutput> {
  return analyzeIdeaSafetyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeIdeaSafetyPrompt',
  input: {schema: AnalyzeIdeaSafetyInputSchema},
  output: {schema: AnalyzeIdeaSafetyOutputSchema},
  prompt: `You are an expert AI Safety researcher and ethicist with a specialization in red-teaming and risk analysis. Your task is to analyze a given research idea from a safety and ethics perspective. Be critical, thoughtful, and forward-thinking.

  The research idea to analyze is:
  "{{{refinedIdea}}}"

  {{#if associatedConcepts}}
  It is associated with the following concepts: {{{associatedConcepts}}}.
  {{/if}}

  Please provide a structured analysis with the following sections. For each section, be specific and provide plausible scenarios where applicable.

  1.  **Potential for Misuse (Dual-Use Risks)**:
      - How could a malicious actor (e.g., a hostile state, a corporation with perverse incentives, a terrorist group) leverage the results or technology from this research for harmful purposes?
      - Provide 2-3 concrete, plausible examples of misuse. Think about scale, automation, and unexpected applications.

  2.  **Safety & Alignment Risks**:
      - Could this research lead to AI systems with dangerous emergent capabilities?
      - Does this research create new avenues for reward hacking, goal misgeneralization, or specification gaming?
      - Could the resulting AI have unintended negative side effects on its environment?
      - Does it make AI systems harder to control, interpret, or shut down?

  3.  **Ethical Considerations**:
      - Are there potential issues of fairness, bias, or equity? Could this technology disproportionately harm certain groups?
      - What are the implications for human autonomy, privacy, or employment?
      - What are the long-term societal consequences if this line of research is successful and widely adopted?

  Be objective and grounded in established AI safety and ethics literature, but do not hesitate to extrapolate to future risks. Your goal is to help the researcher proactively identify and think about mitigating these risks.
  `,
});

const analyzeIdeaSafetyFlow = ai.defineFlow(
  {
    name: 'analyzeIdeaSafetyFlow',
    inputSchema: AnalyzeIdeaSafetyInputSchema,
    outputSchema: AnalyzeIdeaSafetyOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a safety analysis for the idea.');
    }
    return output;
  }
);
