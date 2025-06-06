
import { z } from 'zod';

export const BuildProjectDataSchema = z.object({
  ideaId: z.string().min(1, "Idea ID is required."),
  valueProposition: z.string().min(1, "Value Proposition is required.").max(1000, "Too long"),
  customerSegments: z.string().min(1, "Customer Segments are required.").max(1000, "Too long"),
  keyActivities: z.string().min(1, "Key Activities are required.").max(1000, "Too long"),
  revenueStreams: z.string().min(1, "Revenue Streams are required.").max(1000, "Too long"),
  notes: z.string().max(5000, "Too long").optional(),
  // The 'id' field is optional because it might not exist for new projects.
  // It will be used by the upsert logic if present.
  id: z.string().optional(),
});

export type BuildProjectFormValues = z.infer<typeof BuildProjectDataSchema>;
