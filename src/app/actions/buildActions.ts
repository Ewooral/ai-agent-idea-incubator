
'use server';

import { z } from 'zod';
import { upsertBuildProject, getBuildProjectByIdeaId, getSavedIdeaById, type BuildProject, type SavedIdea } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { BuildProjectDataSchema, type BuildProjectFormValues } from '@/app/schemas/build.schemas';
import { generateDevelopmentGuide, type GenerateDevelopmentGuideInput } from '@/ai/flows/generate-development-guide';
import { generateBusinessProposal, type GenerateBusinessProposalInput, type GenerateBusinessProposalOutput } from '@/ai/flows/generate-business-proposal';


export async function saveBuildProjectAction(
  data: BuildProjectFormValues
): Promise<{ success: boolean; message?: string; project?: BuildProject }> {
  const validation = BuildProjectDataSchema.safeParse(data);

  if (!validation.success) {
    console.error("Validation errors:", validation.error.flatten().fieldErrors);
    return { success: false, message: "Invalid data. " + JSON.stringify(validation.error.flatten().fieldErrors) };
  }

  try
