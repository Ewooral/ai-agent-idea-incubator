
import { z } from 'zod';

export const BuildProjectDataSchema = z.object({
  ideaId: z.string().min(1, "Idea ID is required."),
  valueProposition: z.string().min(1, "Value Proposition is required.").max(1000, "Too long"),
  customerSegments: z.string().min(1, "Customer Segments are required.").max(1000, "Too long"),
  keyActivities: z.string().min(1, "Key Activities are required.").max(1000, "Too long"),
  revenueStreams: z.string().min(1, "Revenue Streams are required.").max(1000, "Too long"),
  notes: z.string().max(5000, "Too long").optional(),
  id: z.string().optional(),
  targetPlatform: z.string().max(200, "Too long").optional(),
  coreFeaturesMVP: z.string().max(2000, "Too long").optional(),
  techStackSuggestion: z.string().max(1000, "Too long").optional(),
  // generatedGuideMarkdown is not part of form submission, it's an output
});

export type BuildProjectFormValues = z.infer<typeof BuildProjectDataSchema>;
