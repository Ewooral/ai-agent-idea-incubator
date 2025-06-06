
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

interface Database {
  savedIdeas: SavedIdea[];
}

async function readDb(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Database;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return default structure
      return { savedIdeas: [] };
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
