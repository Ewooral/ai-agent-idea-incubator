// src/app/api/image-analysis/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { analyzeImageForInsights, AnalyzeImageInputSchema, type AnalyzeImageOutput } from '@/ai/flows/analyze-image-for-insights';
import { z } from 'zod';

// This API route is better suited for handling file uploads (in this case, data URIs from the client)
// than a Server Action, which has limitations on payload size.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = AnalyzeImageInputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.flatten() }, { status: 400 });
    }

    const result: AnalyzeImageOutput = await analyzeImageForInsights(validation.data);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in image analysis route:', error);
    
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof z.ZodError) {
      errorMessage = 'Validation error.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ error: 'Failed to analyze image', details: errorMessage }, { status: 500 });
  }
}
