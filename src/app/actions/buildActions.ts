
'use server';

import { z } from 'zod';
import { upsertBuildProject, getBuildProjectByIdeaId, getSavedIdeaById, type BuildProject, type SavedIdea } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { BuildProjectDataSchema, type BuildProjectFormValues } from '@/app/schemas/build.schemas';
import { generateDevelopmentGuide, type GenerateDevelopmentGuideInput } from '@/ai/flows/generate-development-guide';
import { generateBusinessProposal, type GenerateBusinessProposalInput } from '@/ai/flows/generate-business-proposal';


export async function saveBuildProjectAction(
  data: BuildProjectFormValues
): Promise<{ success: boolean; message?: string; project?: BuildProject }> {
  const validation = BuildProjectDataSchema.safeParse(data);

  if (!validation.success) {
    console.error("Validation errors:", validation.error.flatten().fieldErrors);
    return { success: false, message: "Invalid data. " + JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  try {
    // Ensure all fields from BuildProjectFormValues are mapped, including optional ones
    const projectToSave: Partial<Omit<BuildProject, 'createdAt' | 'updatedAt'>> & { id?: string; ideaId: string } = {
      id: data.id, 
      ideaId: validation.data.ideaId,
      valueProposition: validation.data.valueProposition,
      customerSegments: validation.data.customerSegments,
      keyActivities: validation.data.keyActivities,
      revenueStreams: validation.data.revenueStreams,
      notes: data.notes || "", // Ensure notes is always a string
      targetPlatform: data.targetPlatform,
      coreFeaturesMVP: data.coreFeaturesMVP,
      techStackSuggestion: data.techStackSuggestion,
      // generatedGuideMarkdown and generatedBusinessProposalMarkdown are typically set by their specific actions
      // but if they are passed (e.g. if form includes them for some reason, though unlikely), they will be saved.
      generatedGuideMarkdown: data.generatedGuideMarkdown,
      generatedBusinessProposalMarkdown: data.generatedBusinessProposalMarkdown,
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
      await upsertBuildProject({ 
        ideaId: ideaId, 
        id: buildProject.id, 
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

export async function generateBusinessProposalAction(
  ideaId: string
): Promise<{ success: boolean; proposalMarkdown?: string; message?: string }> {
  try {
    const savedIdea = await getSavedIdeaById(ideaId);
    const buildProject = await getBuildProjectByIdeaId(ideaId);

    if (!savedIdea) {
      return { success: false, message: "Original idea not found. Cannot generate proposal." };
    }
    if (!buildProject) {
      return { success: false, message: "Project details not found. Please save the project details first to generate a proposal." };
    }
    if (!buildProject.valueProposition || !buildProject.customerSegments || !buildProject.keyActivities || !buildProject.revenueStreams) {
        return { success: false, message: "Missing key project details (Value Proposition, Customer Segments, Key Activities, Revenue Streams) needed for a comprehensive proposal. Please fill them in and save." };
    }

    const aiInput: GenerateBusinessProposalInput = {
      originalIdea: savedIdea.originalIdea,
      refinedIdea: savedIdea.refinedIdea,
      valueProposition: buildProject.valueProposition,
      customerSegments: buildProject.customerSegments,
      keyActivities: buildProject.keyActivities,
      revenueStreams: buildProject.revenueStreams,
      targetPlatform: buildProject.targetPlatform,
      coreFeaturesMVP: buildProject.coreFeaturesMVP,
      notes: buildProject.notes,
      marketPotentialScore: savedIdea.marketPotentialScore,
      swotSnippet: savedIdea.swotSnippet,
      competitorTeaser: savedIdea.competitorTeaser,
    };

    const result = await generateBusinessProposal(aiInput);
    
    if (result.proposalMarkdown) {
      await upsertBuildProject({ 
        ideaId: ideaId, 
        id: buildProject.id, 
        generatedBusinessProposalMarkdown: result.proposalMarkdown 
      });
      revalidatePath(`/build-studio/${ideaId}`);
      return { success: true, proposalMarkdown: result.proposalMarkdown };
    } else {
      return { success: false, message: "AI failed to generate the business proposal." };
    }
  } catch (error) {
    console.error('Error generating business proposal:', error);
    return { success: false, message: 'An unexpected error occurred while generating the business proposal.' };
  }
}
