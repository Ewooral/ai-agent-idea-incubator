
'use server';

import { z } from 'zod';
import { upsertBuildProject, type BuildProject } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { BuildProjectDataSchema, type BuildProjectFormValues } from '@/app/schemas/build.schemas';


export async function saveBuildProjectAction(
  data: BuildProjectFormValues
): Promise<{ success: boolean; message?: string; project?: BuildProject }> {
  const validation = BuildProjectDataSchema.safeParse(data);

  if (!validation.success) {
    console.error("Validation errors:", validation.error.flatten().fieldErrors);
    return { success: false, message: "Invalid data. " + JSON.stringify(validation.error.flatten().fieldErrors) };
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
