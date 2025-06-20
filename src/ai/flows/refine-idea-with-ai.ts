
// 'use server'
'use server';

/**
 * @fileOverview Refines an existing idea using AI to explore associated concepts, potential pivoting strategies, and provide preliminary premium insights including chart data.
 *
 * - refineIdea - A function that refines an idea using AI.
 * - RefineIdeaInput - The input type for the refineIdea function.
 * - RefineIdeaOutput - The return type for the refineIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineIdeaInputSchema = z.object({
  idea: z.string().describe('The original idea to be refined.'),
  marketData: z
    .string()
    .optional()
    .describe('Optional market data to inform the refinement process.'),
  focusKeywords: z
    .string()
    .optional()
    .describe('Optional keywords to focus the idea refinement.'),
});

export type RefineIdeaInput = z.infer<typeof RefineIdeaInputSchema>;

const ViabilityFactorSchema = z.object({
  name: z.string().describe("The name of the viability factor (e.g., Market Size, Competition, Innovation)."),
  score: z.number().min(0).max(100).describe("The AI-estimated score for this factor (0-100)."),
});

const RefineIdeaOutputSchema = z.object({
  refinedIdea: z.string().describe('The refined idea generated by the AI.'),
  associatedConcepts: z.array(z.string()).describe('Associated concepts explored by the AI.'),
  potentialPivots: z.array(z.string()).describe('Potential pivoting strategies based on market data.'),
  marketPotentialScore: z.number().min(0).max(100).describe('An estimated overall market potential score from 0 to 100, generated by AI.'),
  swotSnippet: z.string().describe("A key strength or opportunity for the idea (SWOT snippet), generated by AI. Format as 'Strength: [description]' or 'Opportunity: [description]'."),
  competitorTeaser: z.string().describe('A brief teaser about the competitive landscape, generated by AI.'),
  viabilityFactorsChartData: z.array(ViabilityFactorSchema)
    .min(3).max(5)
    .describe("An array of 3 to 5 key market viability factors and their AI-estimated scores (0-100), suitable for a bar chart. Each factor should be an object with 'name' (string) and 'score' (number). Examples: { name: 'Market Size', score: 75 }, { name: 'Growth Potential', score: 80 }."),
});

export type RefineIdeaOutput = z.infer<typeof RefineIdeaOutputSchema>;

export async function refineIdea(input: RefineIdeaInput): Promise<RefineIdeaOutput> {
  return refineIdeaFlow(input);
}

const refineIdeaPrompt = ai.definePrompt({
  name: 'refineIdeaPrompt',
  input: {schema: RefineIdeaInputSchema},
  output: {schema: RefineIdeaOutputSchema},
  prompt: `You are an AI assistant tasked with refining existing ideas and providing insightful analysis.

  The user will provide an idea, optional market data, and optional focus keywords.

  Original Idea: {{{idea}}}
  {{#if marketData}}Market Data: {{{marketData}}}{{/if}}
  {{#if focusKeywords}}Focus Keywords: {{{focusKeywords}}}{{/if}}

  Based on the input, provide the following:
  Refined Idea: (Provide a concise, actionable, and refined version of the original idea. Focus on a clear value proposition.)
  Associated Concepts: (List 3-5 relevant associated concepts or related industries that the idea could touch upon.)
  Potential Pivots: (Suggest 2-3 potential pivoting strategies or alternative applications for the core idea, especially if market data suggests challenges with the original direction.)
  Market Potential Score: (Provide an estimated OVERALL market potential score for the refined idea, as a number between 0 and 100. Base this on factors like innovation, addressable market (if inferable), and scalability. Be realistic but optimistic if warranted. Just output the number.)
  SWOT Snippet: (Identify ONE key Strength OR ONE key Opportunity for this refined idea. Format as 'Strength: [Concise description of the strength]' or 'Opportunity: [Concise description of the opportunity]'. Be specific and impactful.)
  Competitor Teaser: (Provide a very brief, one-sentence teaser about the competitive landscape. e.g., 'The market presents several established players, but specific innovation gaps remain.' or 'This appears to be a relatively untapped niche with significant growth potential if executed well.' or 'Competition is fragmented, offering a chance for a strong brand to emerge.')
  Viability Factors Chart Data: (Provide 3-5 key market viability factors relevant to the idea, such as 'Market Size', 'Growth Potential', 'Competition Level', 'Innovation Factor', or 'Scalability'. Assign an estimated score (0-100) to each factor. Format this as an array of objects, where each object has a 'name' (string) and a 'score' (number). This data will be used to generate a bar chart. For example: [{ "name": "Market Attractiveness", "score": 75 }, { "name": "Competitive Advantage", "score": 60 }, { "name": "Execution Feasibility", "score": 80 }]. Ensure you return between 3 and 5 factors.)
`,
});

const refineIdeaFlow = ai.defineFlow(
  {
    name: 'refineIdeaFlow',
    inputSchema: RefineIdeaInputSchema,
    outputSchema: RefineIdeaOutputSchema,
  },
  async input => {
    const {output} = await refineIdeaPrompt(input);
    // Ensure the score is a number, default to a moderate score if parsing fails or is not a number
    let score = 50; // Default score
    if (output?.marketPotentialScore && !isNaN(Number(output.marketPotentialScore))) {
        score = Number(output.marketPotentialScore);
    } else if (output?.marketPotentialScore) {
        // Attempt to extract number if it's a string like "75/100" or "Score: 80"
        const match = String(output.marketPotentialScore).match(/\d+/);
        if (match) {
            score = parseInt(match[0], 10);
        }
    }
    score = Math.max(0, Math.min(100, score)); // Clamp between 0 and 100

    // Ensure viabilityFactorsChartData is an array and has between 3 and 5 items
    let chartData = output?.viabilityFactorsChartData || [];
    if (!Array.isArray(chartData)) chartData = [];
    if (chartData.length < 3) {
        // Add placeholder data if not enough factors are returned
        const needed = 3 - chartData.length;
        for (let i = 0; i < needed; i++) {
            chartData.push({ name: `Factor ${chartData.length + 1}`, score: Math.floor(Math.random() * 50) + 30 });
        }
    }
    chartData = chartData.slice(0, 5); // Ensure no more than 5 items

    return {
        ...output!,
        marketPotentialScore: score,
        viabilityFactorsChartData: chartData.map(factor => ({
            name: factor.name || "Unnamed Factor",
            score: Math.max(0, Math.min(100, Number(factor.score) || 0)), // Ensure score is valid
        })),
    };
  }
);

