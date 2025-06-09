import fs from 'fs/promises';
import path from 'path';
import type { RefineIdeaOutput } from '@/ai/flows/refine-idea-with-ai';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

export interface SavedIdea {
  id: string;
  originalIdea: string;
  refinedIdea: string;
  marketPotentialScore?: number;
  swotSnippet?: string;
  competitorTeaser?: string;
  associatedConcepts?: string[];
  potentialPivots?: string[];
  viabilityFactorsChartData?: Array<{ name: string; score: number }>;
  conceptualImageUrl?: string; // New: For AI-generated conceptual image
  createdAt: string;
}

export interface BuildProject {
  id: string;
  ideaId: string;
  valueProposition: string;
  customerSegments: string;
  keyActivities: string;
  revenueStreams: string;
  notes: string;
  targetPlatform?: string;
  coreFeaturesMVP?: string;
  techStackSuggestion?: string;
  generatedGuideMarkdown?: string;
  generatedBusinessProposalMarkdown?: string;
  generatedPitchDeckOutlineMarkdown?: string; // New: For AI-generated pitch deck outline
  createdAt: string;
  updatedAt: string;
}

export interface ForumCategory {
  id: string;
  title: string;
  description: string;
  iconName: string; // Name of the lucide-react icon
  createdAt: string;
}

interface Database {
  savedIdeas: SavedIdea[];
  buildProjects: BuildProject[];
  forumCategories: ForumCategory[];
}

async function readDb(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const jsonData = JSON.parse(data) as Database;
    if (!jsonData.savedIdeas) {
      jsonData.savedIdeas = [];
    }
    if (!jsonData.buildProjects) {
      jsonData.buildProjects = [];
    }
    if (!jsonData.forumCategories) {
      jsonData.forumCategories = [];
    }
    return jsonData;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return { savedIdeas: [], buildProjects: [], forumCategories: [] };
    }
    console.error('Failed to read database file:', error);
    throw new Error('Could not read database.');
  }
}

async function writeDb(data: Database): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write database file:', error);
    throw new Error('Could not write to database.');
  }
}

export async function getSavedIdeas(): Promise<SavedIdea[]> {
  const db = await readDb();
  return db.savedIdeas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getSavedIdeaById(id: string): Promise<SavedIdea | null> {
  const db = await readDb();
  return db.savedIdeas.find(idea => idea.id === id) || null;
}

export async function addSavedIdea(
  originalIdea: string,
  refinedOutput: RefineIdeaOutput // This already includes conceptualImageUrl from the flow
): Promise<SavedIdea> {
  const db = await readDb();
  const newIdea: SavedIdea = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
    originalIdea,
    refinedIdea: refinedOutput.refinedIdea,
    marketPotentialScore: refinedOutput.marketPotentialScore,
    swotSnippet: refinedOutput.swotSnippet,
    competitorTeaser: refinedOutput.competitorTeaser,
    associatedConcepts: refinedOutput.associatedConcepts,
    potentialPivots: refinedOutput.potentialPivots,
    viabilityFactorsChartData: refinedOutput.viabilityFactorsChartData,
    conceptualImageUrl: refinedOutput.conceptualImageUrl, // Store the image URL
    createdAt: new Date().toISOString(),
  };
  db.savedIdeas.push(newIdea);
  await writeDb(db);
  return newIdea;
}

export async function getBuildProjectByIdeaId(ideaId: string): Promise<BuildProject | null> {
  const db = await readDb();
  return db.buildProjects.find(project => project.ideaId === ideaId) || null;
}

export async function upsertBuildProject(
  projectData: Partial<Omit<BuildProject, 'createdAt' | 'updatedAt'>> & { id?: string; ideaId: string }
): Promise<BuildProject> {
  const db = await readDb();
  const now = new Date().toISOString();

  const existingProjectIndex = db.buildProjects.findIndex(p => p.ideaId === projectData.ideaId || (projectData.id && p.id === projectData.id));

  if (existingProjectIndex > -1) {
    const existingProject = db.buildProjects[existingProjectIndex];
    db.buildProjects[existingProjectIndex] = {
      ...existingProject,
      ...projectData,
      id: existingProject.id,
      ideaId: existingProject.ideaId,
      updatedAt: now,
    };
    await writeDb(db);
    return db.buildProjects[existingProjectIndex];
  }

  const newProject: BuildProject = {
    id: projectData.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
    ideaId: projectData.ideaId,
    valueProposition: projectData.valueProposition || '',
    customerSegments: projectData.customerSegments || '',
    keyActivities: projectData.keyActivities || '',
    revenueStreams: projectData.revenueStreams || '',
    notes: projectData.notes || '',
    targetPlatform: projectData.targetPlatform,
    coreFeaturesMVP: projectData.coreFeaturesMVP,
    techStackSuggestion: projectData.techStackSuggestion,
    generatedGuideMarkdown: projectData.generatedGuideMarkdown,
    generatedBusinessProposalMarkdown: projectData.generatedBusinessProposalMarkdown,
    generatedPitchDeckOutlineMarkdown: projectData.generatedPitchDeckOutlineMarkdown, // Initialize new field
    createdAt: now,
    updatedAt: now,
  };
  db.buildProjects.push(newProject);
  await writeDb(db);
  return newProject;
}

// Forum Category Functions
export async function getForumCategories(): Promise<ForumCategory[]> {
  const db = await readDb();
  return db.forumCategories.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export async function getForumCategoryById(id: string): Promise<ForumCategory | null> {
  const db = await readDb();
  return db.forumCategories.find(category => category.id === id) || null;
}

export async function addForumCategory(
  categoryData: Omit<ForumCategory, 'id' | 'createdAt'>
): Promise<ForumCategory> {
  const db = await readDb();
  const newCategory: ForumCategory = {
    id: `cat_${Date.now().toString()}` + Math.random().toString(36).substring(2, 7),
    ...categoryData,
    createdAt: new Date().toISOString(),
  };
  db.forumCategories.push(newCategory);
  await writeDb(db);
  return newCategory;
}