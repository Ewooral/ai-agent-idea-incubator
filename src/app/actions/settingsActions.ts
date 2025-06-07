
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

interface Database {
  savedIdeas: any[]; // Using any for simplicity as structure isn't critical for clearing
  buildProjects: any[];
  // Add other top-level keys from your db.json if they exist
}

async function readDb(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data) as Database;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, return structure of an empty DB
      return { savedIdeas: [], buildProjects: [] };
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

export async function clearApplicationDataAction(): Promise<{ success: boolean; message: string }> {
  try {
    const db = await readDb();

    // Reset the relevant parts of the database
    db.savedIdeas = [];
    db.buildProjects = [];
    // If you have other arrays/data at the root of db.json to clear, add them here.

    await writeDb(db);

    // Revalidate paths to reflect the changes in the UI
    revalidatePath('/');
    revalidatePath('/dashboard');
    revalidatePath('/build-studio');
    // Add any other paths that display this data

    return { success: true, message: 'All application data has been successfully cleared.' };
  } catch (error: any) {
    console.error('Error clearing application data:', error);
    return { success: false, message: error.message || 'Failed to clear application data.' };
  }
}
