
'use server';

import { revalidatePath } from 'next/cache';
import { addSavedIdea } from '@/lib/db';
import type { RefineIdeaOutput } from '@/ai/flows/refine-idea-with-ai';

export async function saveValidatedIdeaAction(
  originalIdea: string,
  refinedOutput: RefineIdeaOutput
): Promise<{ success: boolean; message?: string; ideaId?: string }> {
  if (!originalIdea || !refinedOutput || !refinedOutput.refinedIdea) {
    return { success: false, message: 'Missing required idea data.' };
  }

  try {
    const newSavedIdea = await addSavedIdea(originalIdea, refinedOutput);
    revalidatePath('/dashboard'); // Revalidate the dashboard page to show the new idea
    revalidatePath('/'); // Revalidate home page if needed
    return { success: true, message: 'Idea saved successfully!', ideaId: newSavedIdea.id };
  } catch (error) {
    console.error('Error saving idea:', error);
    return { success: false, message: 'Failed to save idea. Please try again.' };
  }
}
