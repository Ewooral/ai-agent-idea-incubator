
'use server';

import { z } from 'zod';
import { addForumCategory, type ForumCategory } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const AddCategorySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description too long"),
  iconName: z.string().min(1, "Icon name is required").max(50, "Icon name too long"), // E.g., "MessageSquare"
});

export type AddCategoryFormValues = z.infer<typeof AddCategorySchema>;

export async function addForumCategoryAction(
  data: AddCategoryFormValues
): Promise<{ success: boolean; category?: ForumCategory; message?: string, errors?: z.ZodIssue[] }> {
  const validation = AddCategorySchema.safeParse(data);

  if (!validation.success) {
    return { success: false, message: "Invalid data.", errors: validation.error.issues };
  }

  try {
    const newCategory = await addForumCategory(validation.data);
    revalidatePath('/community');
    revalidatePath('/admin/community/categories'); // Revalidate admin page if you navigate back
    return { success: true, message: 'Forum category added successfully!', category: newCategory };
  } catch (error) {
    console.error('Error adding forum category:', error);
    return { success: false, message: 'Failed to add forum category. Please try again.' };
  }
}
