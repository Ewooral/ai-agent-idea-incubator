
// src/ai/flows/generate-business-proposal.ts
'use server';
/**
 * @fileOverview Generates a comprehensive business proposal for a given idea.
 *
 * - generateBusinessProposal - A function that generates the business proposal.
 * - GenerateBusinessProposalInput - The input type for the function.
 * - GenerateBusinessProposalOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessProposalInputSchema = z.object({
  originalIdea: z.string().describe('The original user-provided idea.'),
  refinedIdea: z.string().describe('The AI-refined version of the idea.'),
  valueProposition: z.string().describe('The unique value the idea offers.'),
  customerSegments: z.string().describe('The target customers for the idea.'),
  keyActivities: z.string().describe('The critical activities the business must perform.'),
  revenueStreams: z.string().describe('How the business will generate revenue.'),
  targetPlatform: z.string().optional().describe('Preferred target platform (e.g., Web, Mobile App, Desktop).'),
  coreFeaturesMVP: z.string().optional().describe('A list of 3-5 essential features for the Minimum Viable Product.'),
  notes: z.string().optional().describe('Additional notes or context about the idea or business model.'),
  marketPotentialScore: z.number().optional().describe('AI-estimated market potential score (0-100).'),
  swotSnippet: z.string().optional().describe("A key strength or opportunity for the idea (SWOT snippet)."),
  competitorTeaser: z.string().optional().describe('A brief teaser about the competitive landscape.'),
});

export type GenerateBusinessProposalInput = z.infer<typeof GenerateBusinessProposalInputSchema>;

const GenerateBusinessProposalOutputSchema = z.object({
  proposalMarkdown: z.string().describe('A comprehensive business proposal in Markdown format. It should follow a standard investor-friendly structure, be well-documented, detailed, and professionally toned.'),
});

export type GenerateBusinessProposalOutput = z.infer<typeof GenerateBusinessProposalOutputSchema>;

export async function generateBusinessProposal(input: GenerateBusinessProposalInput): Promise<GenerateBusinessProposalOutput> {
  return generateBusinessProposalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessProposalPrompt',
  input: {schema: GenerateBusinessProposalInputSchema},
  output: {schema: GenerateBusinessProposalOutputSchema},
  prompt: `You are an expert business consultant and startup advisor specializing in creating compelling investor-ready business proposals.
  Your task is to generate a comprehensive, well-documented, and detailed business proposal in Markdown format based on the provided information.
  The tone should be professional and persuasive, suitable for presenting to potential investors.

  Provided Idea Details:
  - Original Idea: {{{originalIdea}}}
  - Refined Idea: {{{refinedIdea}}}
  - Value Proposition: {{{valueProposition}}}
  - Customer Segments: {{{customerSegments}}}
  - Key Activities: {{{keyActivities}}}
  - Revenue Streams: {{{revenueStreams}}}
  {{#if targetPlatform}}- Target Platform: {{{targetPlatform}}}{{/if}}
  {{#if coreFeaturesMVP}}- Core MVP Features: {{{coreFeaturesMVP}}}{{/if}}
  {{#if marketPotentialScore}}- AI Market Potential Score: {{{marketPotentialScore}}}%{{/if}}
  {{#if swotSnippet}}- SWOT Snippet: {{{swotSnippet}}}{{/if}}
  {{#if competitorTeaser}}- Competitor Teaser: {{{competitorTeaser}}}{{/if}}
  {{#if notes}}- Additional Notes: {{{notes}}}{{/if}}

  Please structure the proposal with the following sections, using appropriate Markdown headings (## for main sections, ### for sub-sections). Ensure each section is detailed and well-written.

  ## 1. Executive Summary
  (Provide a concise overview of the entire business proposal. Highlight the problem, solution, target market, competitive advantage, and financial highlights/goals. This should be compelling and grab the reader's attention.)

  ## 2. The Problem
  (Clearly define the problem or unmet need that the business idea addresses. Explain its significance and impact on the target audience. Use data or relatable scenarios if possible, drawing from 'Customer Segments' and 'Refined Idea'.)

  ## 3. Our Solution
  (Describe the product/service in detail. Explain how it solves the defined problem. Highlight unique features and benefits, referencing 'Refined Idea', 'Value Proposition', and 'Core MVP Features'. If 'Target Platform' is specified, mention it.)

  ## 4. Market Analysis
    ### Target Market
    (Describe the primary target audience in detail, based on 'Customer Segments'. Include demographics, psychographics, and needs.)
    ### Market Size & Opportunity
    (Discuss the overall market size, growth potential, and trends. If 'Market Potential Score' is available, subtly weave it in as an indicator of potential.)
    ### Competition
    (Analyze the competitive landscape. Mention direct and indirect competitors. Use 'Competitor Teaser' as a starting point and expand. What is your competitive advantage?)

  ## 5. Product/Service Details
    ### Core Features & Functionality
    (Elaborate on the 'Core MVP Features'. How do they work? What user experience can be expected?)
    ### Technology Stack (if applicable)
    (Briefly mention the proposed 'Target Platform' and any key technologies if relevant to the value proposition, e.g., AI, blockchain. If no specific tech preference, suggest a suitable modern stack.)
    ### Future Development / Roadmap
    (Briefly outline potential future features or expansion plans beyond the MVP.)

  ## 6. Business Model
    ### Revenue Streams
    (Detail how the business will generate income, based on 'Revenue Streams'. Explain pricing strategy if inferable.)
    ### Key Activities & Operations
    (Summarize the 'Key Activities' essential to delivering the value proposition and running the business.)

  ## 7. Marketing and Sales Strategy
    ### Go-to-Market Strategy
    (How will you reach your 'Customer Segments'? Outline key marketing channels and initial customer acquisition strategies.)
    ### Sales Process
    (Briefly describe how you will convert leads into paying customers.)

  ## 8. Team (Placeholder)
  (As this is AI-generated based on idea details, provide a placeholder. For example: "The success of this venture will depend on a skilled and dedicated team. The founding team possesses [mention relevant general skills if inferable from the idea, otherwise generic like 'strong vision and execution capabilities']. Key roles to be filled include specialized development expertise, marketing leadership, and operational management. Detailed team bios will be provided in subsequent discussions.")

  ## 9. Financial Projections (Qualitative/Placeholder)
  (As AI cannot generate real financials, provide a qualitative outlook or placeholder. For example: "Based on the identified market opportunity and scalable business model ('Revenue Streams'), we project strong revenue growth within the first 3-5 years. Key financial metrics will focus on customer acquisition cost, lifetime value, and profitability. Detailed financial models and projections are available upon request and will be part of ongoing due diligence.")

  ## 10. Funding Request (Placeholder)
  (Provide a placeholder. For example: "To achieve our initial milestones, including full product development, market launch, and initial customer acquisition, we are seeking [Specify a generic range like '$X00,000 - $Y,000,000' or state 'seed funding']. Funds will be allocated to product development, marketing, team expansion, and operational expenses. A detailed breakdown of fund utilization is available.")

  ## 11. Appendix (Optional - Mention)
  (Indicate that an appendix with more detailed information can be made available, e.g., "An appendix containing detailed market research data, user personas, and technical specifications can be provided upon request.")

  Ensure the output is a single, coherent Markdown string. Be thorough and professional. Use bullet points and sub-headings to enhance readability.
  `,
});

const generateBusinessProposalFlow = ai.defineFlow(
  {
    name: 'generateBusinessProposalFlow',
    inputSchema: GenerateBusinessProposalInputSchema,
    outputSchema: GenerateBusinessProposalOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.proposalMarkdown) {
        throw new Error("AI failed to generate the business proposal markdown.");
    }
    return output;
  }
);
