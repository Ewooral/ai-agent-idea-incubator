
import fs from 'fs/promises';
import path from 'path';
import type { RefineIdeaOutput } from '@/ai/flows/refine-idea-with-ai';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

export interface SavedIdea {
  id: string;
  originalIdea: string;
  refinedIdea: string; // From RefineIdeaOutput.refinedIdea
  marketPotentialScore?: number;
  swotSnippet?: string;
  competitorTeaser?: string;
  associatedConcepts?: string[];
  potentialPivots?: string[];
  createdAt: string; // ISO date string
}

export interface BuildProject {
  id: string;
  ideaId: string; // Links to SavedIdea.id
  valueProposition: string;
  customerSegments: string;
  keyActivities: string;
  revenueStreams: string;
  notes: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface Database {
  savedIdeas: SavedIdea[];
  buildProjects: BuildProject[];
}

async function readDb(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const jsonData = JSON.parse(data) as Database;
    // Ensure all expected top-level arrays exist
    if (!jsonData.savedIdeas) {
      jsonData.savedIdeas = [];
    }
    if (!jsonData.buildProjects) {
      jsonData.buildProjects = [];
    }
    return jsonData;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default structure
      return { savedIdeas: [], buildProjects: [] };
    }
    console.error('Failed to read database file:', error);
    throw new Error('Could not read database.');
  }
}

async function writeDb(data: Database): Promise<void> {
  try {
    // Ensure the directory exists
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
  refinedOutput: RefineIdeaOutput
): Promise<SavedIdea> {
  const db = await readDb();
  const newIdea: SavedIdea = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // Simple unique ID
    originalIdea,
    refinedIdea: refinedOutput.refinedIdea,
    marketPotentialScore: refinedOutput.marketPotentialScore,
    swotSnippet: refinedOutput.swotSnippet,
    competitorTeaser: refinedOutput.competitorTeaser,
    associatedConcepts: refinedOutput.associatedConcepts,
    potentialPivots: refinedOutput.potentialPivots,
    createdAt: new Date().toISOString(),
  };
  db.savedIdeas.push(newIdea);
  await writeDb(db);
  return newIdea;
}

// Build Project Functions
export async function getBuildProjectByIdeaId(ideaId: string): Promise<BuildProject | null> {
  const db = await readDb();
  return db.buildProjects.find(project => project.ideaId === ideaId) || null;
}

export async function upsertBuildProject(
  projectData: Omit<BuildProject, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; ideaId: string }
): Promise<BuildProject> {
  const db = await readDb();
  const now = new Date().toISOString();
  
  if (projectData.id) { // Update existing project
    const projectIndex = db.buildProjects.findIndex(p => p.id === projectData.id && p.ideaId === projectData.ideaId);
    if (projectIndex > -1) {
      db.buildProjects[projectIndex] = {
        ...db.buildProjects[projectIndex],
        ...projectData,
        updatedAt: now,
      };
      await writeDb(db);
      return db.buildProjects[projectIndex];
    } else {
      // If ID provided but not found, or ideaId mismatch, treat as new (or throw error - for simplicity, treat as new for now)
      // This case ideally shouldn't happen if ID is only passed for existing projects fetched by ideaId first
      console.warn(`upsertBuildProject: Project with id ${projectData.id} for idea ${projectData.ideaId} not found for update. Creating new.`);
    }
  }
  
  // Create new project if no ID or if update target not found
  const existingProjectIndex = db.buildProjects.findIndex(p => p.ideaId === projectData.ideaId);
  if (existingProjectIndex > -1) {
    // Update existing project for this ideaId if found (even if no ID was passed in projectData)
     db.buildProjects[existingProjectIndex] = {
        ...db.buildProjects[existingProjectIndex],
        ...projectData,
        id: db.buildProjects[existingProjectIndex].id, // ensure existing ID is kept
        updatedAt: now,
      };
      await writeDb(db);
      return db.buildProjects[existingProjectIndex];
  }


  // If truly new (no ID, or ID not found, and no existing project for ideaId)
  const newProject: BuildProject = {
    id: projectData.id || Date.now().toString() + Math.random().toString(36).substring(2, 9), // Use provided ID or generate new
    ideaId: projectData.ideaId,
    valueProposition: projectData.valueProposition,
    customerSegments: projectData.customerSegments,
    keyActivities: projectData.keyActivities,
    revenueStreams: projectData.revenueStreams,
    notes: projectData.notes,
    createdAt: now,
    updatedAt: now,
  };
  db.buildProjects.push(newProject);
  await writeDb(db);
  return newProject;
}
