
'use server';

import { z } from 'zod';
import { upsertBuildProject, getBuildProjectByIdeaId, getSavedIdeaById, type BuildProject, type SavedIdea } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { BuildProjectDataSchema, type BuildProjectFormValues } from '@/app/schemas/build.schemas';
import { generateDevelopmentGuide, type GenerateDevelopmentGuideInput } from '@/ai/flows/generate-development-guide';


export async function saveBuildProjectAction(
  data: BuildProjectFormValues
): Promise<{ success: boolean; message?: string; project?: BuildProject }> {
  const validation = BuildProjectDataSchema.safeParse(data);

  if (!validation.success) {
    console.error("Validation errors:", validation.error.flatten().fieldErrors);
    return { success: false, message: "Invalid data. " + JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  try {
    const projectToSave: Partial<Omit<BuildProject, 'createdAt' | 'updatedAt'>> & { id?: string; ideaId: string } = {
      id: data.id, 
      ideaId: validation.data.ideaId,
      valueProposition: validation.data.valueProposition,
      customerSegments: validation.data.customerSegments,
      keyActivities: validation.data.keyActivities,
      revenueStreams: validation.data.revenueStreams,
      notes: data.notes || "",
      targetPlatform: data.targetPlatform,
      coreFeaturesMVP: data.coreFeaturesMVP,
      techStackSuggestion: data.techStackSuggestion,
    };
    
    const savedProject = await upsertBuildProject(projectToSave);
    revalidatePath(`/build-studio/${savedProject.ideaId}`);
    revalidatePath('/dashboard'); 
    revalidatePath('/build-studio');
    return { success: true, message: 'Project details saved successfully!', project: savedProject };
  } catch (error) {
    console.error('Error saving build project:', error);
    return { success: false, message: 'Failed to save project. Please try again.' };
  }
}

export async function generateDevelopmentGuideAction(
  ideaId: string
): Promise<{ success: boolean; guideMarkdown?: string; message?: string }> {
  try {
    const savedIdea = await getSavedIdeaById(ideaId);
    const buildProject = await getBuildProjectByIdeaId(ideaId);

    if (!savedIdea) {
      return { success: false, message: "Original idea not found." };
    }
    if (!buildProject) {
      return { success: false, message: "Project details not found. Please save the project details first." };
    }
    if (!buildProject.valueProposition || !buildProject.customerSegments || !buildProject.coreFeaturesMVP) {
        return { success: false, message: "Missing key project details (e.g. Value Proposition, Customer Segments, Core MVP Features) needed to generate a comprehensive guide. Please fill them in and save." };
    }


    const aiInput: GenerateDevelopmentGuideInput = {
      originalIdea: savedIdea.originalIdea,
      refinedIdea: savedIdea.refinedIdea,
      valueProposition: buildProject.valueProposition,
      customerSegments: buildProject.customerSegments,
      keyActivities: buildProject.keyActivities,
      revenueStreams: buildProject.revenueStreams,
      targetPlatform: buildProject.targetPlatform,
      coreFeaturesMVP: buildProject.coreFeaturesMVP,
      techStackSuggestion: buildProject.techStackSuggestion,
      notes: buildProject.notes,
    };

    const result = await generateDevelopmentGuide(aiInput);
    
    if (result.guideMarkdown) {
      // Save the generated guide back to the build project
      await upsertBuildProject({ 
        ideaId: ideaId, 
        id: buildProject.id, // Important to pass id for upsert to update
        generatedGuideMarkdown: result.guideMarkdown 
      });
      revalidatePath(`/build-studio/${ideaId}`);
      return { success: true, guideMarkdown: result.guideMarkdown };
    } else {
      return { success: false, message: "AI failed to generate the development guide." };
    }
  } catch (error) {
    console.error('Error generating development guide:', error);
    return { success: false, message: 'An unexpected error occurred while generating the guide.' };
  }
}
