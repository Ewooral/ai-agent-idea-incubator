
'use server';

import { z } from 'zod';
import { upsertBuildProject, getBuildProjectByIdeaId, getSavedIdeaById, type BuildProject, type SavedIdea } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { BuildProjectDataSchema, type BuildProjectFormValues } from '@/app/schemas/build.schemas';
import { generateDevelopmentGuide, type GenerateDevelopmentGuideInput, type GenerateDevelopmentGuideOutput } from '@/ai/flows/generate-development-guide';
import { generateBusinessProposal, type GenerateBusinessProposalInput, type GenerateBusinessProposalOutput } from '@/ai/flows/generate-business-proposal';


export async function saveBuildProjectAction(
  data: BuildProjectFormValues
): Promise<{ success: boolean; message?: string; project?: BuildProject }> {
  const validation = BuildProjectDataSchema.safeParse(data);

  if (!validation.success) {
    console.error("Validation errors:", validation.error.flatten().fieldErrors);
    const errorMessages = validation.error.flatten().fieldErrors;
    const simplifiedErrors = Object.entries(errorMessages).map(([key, value]) => `${key}: ${value?.join(', ')}`).join('; ');
    return { success: false, message: "Invalid data: " + simplifiedErrors };
  }

  try {
    const projectToSave: Partial<BuildProject> & { ideaId: string } = {
        ...validation.data,
        id: validation.data.id || undefined, // Ensure id is passed if it exists
        ideaId: validation.data.ideaId,
    };

    const savedProject = await upsertBuildProject(projectToSave);
    revalidatePath(`/build-studio/${savedProject.ideaId}`);
    revalidatePath('/build-studio');
    return { success: true, message: 'Project details saved successfully!', project: savedProject };
  } catch (error: any) {
    console.error('Error saving build project:', error);
    return { success: false, message: error.message || 'Failed to save project details.' };
  }
}

export async function generateDevelopmentGuideAction(
  ideaId: string
): Promise<{ success: boolean; message?: string; guideMarkdown?: string }> {
  try {
    const savedIdea = await getSavedIdeaById(ideaId);
    const buildProject = await getBuildProjectByIdeaId(ideaId);

    if (!savedIdea) {
      return { success: false, message: 'Saved idea not found.' };
    }
    if (!buildProject) {
      return { success: false, message: 'Build project details not found. Please fill and save the project details first.' };
    }

    const guideInput: GenerateDevelopmentGuideInput = {
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

    const result: GenerateDevelopmentGuideOutput = await generateDevelopmentGuide(guideInput);
    
    if (result.guideMarkdown) {
      await upsertBuildProject({
        ...buildProject, // Spread existing project details
        id: buildProject.id, // Ensure ID is passed for upsert
        ideaId: ideaId,
        generatedGuideMarkdown: result.guideMarkdown,
      });
      revalidatePath(`/build-studio/${ideaId}`);
      return { success: true, guideMarkdown: result.guideMarkdown, message: 'Development guide generated successfully.' };
    } else {
      return { success: false, message: 'AI failed to generate the development guide.' };
    }
  } catch (error: any) {
    console.error('Error generating development guide:', error);
    return { success: false, message: error.message || 'Failed to generate development guide.' };
  }
}

export async function generateBusinessProposalAction(
  ideaId: string
): Promise<{ success: boolean; message?: string; proposalMarkdown?: string; pitchDeckOutlineMarkdown?: string }> {
  try {
    const savedIdea = await getSavedIdeaById(ideaId);
    const buildProject = await getBuildProjectByIdeaId(ideaId);

    if (!savedIdea) {
      return { success: false, message: 'Saved idea not found.' };
    }
    if (!buildProject) {
      return { success: false, message: 'Build project details not found. Please fill and save the project details first.' };
    }
     if (!savedIdea.marketPotentialScore || !savedIdea.swotSnippet || !savedIdea.competitorTeaser) {
        console.warn(`Attempting to generate business proposal for idea ${ideaId} which is missing some AI-generated fields (marketPotentialScore, swotSnippet, competitorTeaser) from the validation step. Proceeding with available data.`);
    }


    const proposalInput: GenerateBusinessProposalInput = {
      originalIdea: savedIdea.originalIdea,
      refinedIdea: savedIdea.refinedIdea,
      valueProposition: buildProject.valueProposition,
      customerSegments: buildProject.customerSegments,
      keyActivities: buildProject.keyActivities,
      revenueStreams: buildProject.revenueStreams,
      targetPlatform: buildProject.targetPlatform,
      coreFeaturesMVP: buildProject.coreFeaturesMVP,
      notes: buildProject.notes,
      // Fields from SavedIdea (refined output)
      marketPotentialScore: savedIdea.marketPotentialScore,
      swotSnippet: savedIdea.swotSnippet,
      competitorTeaser: savedIdea.competitorTeaser,
    };
    
    const result: GenerateBusinessProposalOutput = await generateBusinessProposal(proposalInput);

    if (result.proposalMarkdown && result.pitchDeckOutlineMarkdown) {
      await upsertBuildProject({
        ...buildProject,
        id: buildProject.id, // Ensure ID is passed for upsert
        ideaId: ideaId,
        generatedBusinessProposalMarkdown: result.proposalMarkdown,
        generatedPitchDeckOutlineMarkdown: result.pitchDeckOutlineMarkdown,
      });
      revalidatePath(`/build-studio/${ideaId}`);
      return { 
        success: true, 
        proposalMarkdown: result.proposalMarkdown, 
        pitchDeckOutlineMarkdown: result.pitchDeckOutlineMarkdown,
        message: 'Business proposal and pitch deck outline generated successfully.' 
      };
    } else {
      return { success: false, message: 'AI failed to generate the business proposal or pitch deck outline.' };
    }
  } catch (error: any) {
    console.error('Error generating business proposal:', error);
    return { success: false, message: error.message || 'Failed to generate business proposal.' };
  }
}
