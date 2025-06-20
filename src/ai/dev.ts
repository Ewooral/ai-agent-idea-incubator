
import { config } from 'dotenv';
config();

import '@/ai/flows/refine-idea-with-ai.ts';
import '@/ai/flows/generate-novel-idea.ts';
import '@/ai/flows/generate-development-guide.ts';
import '@/ai/flows/translate-text-flow.ts'; // Added translation flow
import '@/ai/flows/generate-business-proposal.ts'; // Added business proposal flow
import '@/ai/flows/idea-incubator-chat-flow.ts'; // Added chatbot flow

