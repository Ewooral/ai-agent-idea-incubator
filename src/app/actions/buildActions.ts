
'use server';

import { z } from 'zod';
import { upsertBuildProject, type BuildProject } from '@/lib/db';
import { revalidatePath } from 'next/cache';

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

export async function saveBuildProjectAction(
  data: BuildProjectFormValues
): Promise<{ success: boolean; message?: string; project?: BuildProject }> {
  const validation = BuildProjectDataSchema.safeParse(data);

  if (!validation.success) {
    console.error("Validation errors:", validation.error.flatten().fieldErrors);
    return { success: false, message: "Invalid data. " + validation.error.flatten().fieldErrors };
  }

  try {
    // The upsertBuildProject function expects an object that might include an 'id'.
    // It handles creation or update internally.
    const projectToSave: Omit<BuildProject, 'createdAt' | 'updatedAt'> & { id?: string; ideaId: string } = {
      id: data.id, // Pass the ID if it exists (for updates)
      ideaId: validation.data.ideaId,
      valueProposition: validation.data.valueProposition,
      customerSegments: validation.data.customerSegments,
      keyActivities: validation.data.keyActivities,
      revenueStreams: validation.data.revenueStreams,
      notes: validation.data.notes || "",
    };
    
    const savedProject = await upsertBuildProject(projectToSave);
    revalidatePath(`/build-studio/${savedProject.ideaId}`);
    revalidatePath('/dashboard'); // In case dashboard shows status
    return { success: true, message: 'Project saved successfully!', project: savedProject };
  } catch (error) {
    console.error('Error saving build project:', error);
    return { success: false, message: 'Failed to save project. Please try again.' };
  }
}
