
// src/data/help-guide-topics.ts
import { Lightbulb, CheckCircle, LayoutDashboard, Hammer, Users, Settings, Palette, Globe, HelpCircle, Info, TestTube, type Icon as LucideIcon } from 'lucide-react';

export interface HelpTopic {
  id: string;
  title: string;
  icon: LucideIcon;
  content: string; // Markdown content
}

export const helpTopics: HelpTopic[] = [
  {
    id: 'overview',
    title: 'App Overview',
    icon: Info,
    content: `
Welcome to the **Idea Incubator**! This application is designed to accelerate your innovation workflow, helping you:
- **Generate** novel ideas, from business concepts to research proposals, using AI.
- **Analyze & Refine** these ideas with AI-driven analysis and strategic insights.
- **Develop** detailed, step-by-step development guides or experiment plans for your validated concepts.
- **Connect** with a community of fellow innovators (feature in development).

Navigate through the app using the sidebar on the left. Each section is tailored to a specific stage of the idea lifecycle.
    `,
  },
  {
    id: 'generate-idea',
    title: 'Generating Novel Ideas',
    icon: Lightbulb,
    content: `
The **Generate Idea** page is your starting point for exploring new concepts.

![Generate Idea Page Preview](https://placehold.co/600x300.png?text=Generate+Idea+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Generate Idea Page Interface</p>

**How to Use:**
1.  **Custom Input (Form)**:
    *   **Problem Area (Optional)**: Describe a challenge you want to solve (e.g., "making oversight scalable").
    *   **Keywords/Topics (Optional)**: Provide high-level topics to guide the AI (e.g., "deceptive alignment, interpretability").
    *   Click "Generate With My Input".
2.  **Explore by Topic Cards**:
    *   Below the form are cards for various topics (e.g., "Scalable Oversight", "LLM Deception"). These are particularly useful for researchers.
    *   Clicking a card auto-fills the form and generates relevant ideas or research questions.
3.  **Viewing Results**:
    *   Generated ideas appear as cards at the bottom of the page.
    *   Each card includes a "Novelty Score" to gauge its originality.
4.  **Next Step**:
    *   On each idea card, click "Analyze & Refine" to move to the next stage.

**Key Takeaway**: Use this page to brainstorm novel, concrete ideas that can be developed into full projects.
    `,
  },
  {
    id: 'analyze-idea',
    title: 'Analyzing & Refining Ideas',
    icon: CheckCircle,
    content: `
The **Analyze Idea** page (CheckCircle icon) helps you flesh out an idea into a validated concept.

![Analyze Idea Page Preview](https://placehold.co/600x350.png?text=Analyze+Idea+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Analyze Idea Page Interface</p>

**How to Use:**
1.  **Input Your Idea**:
    *   An idea from the previous page will be pre-filled.
    *   You can also enter your own concept directly.
    *   **Context / Related Work (Optional)**: Add any known competitors, papers, or market context.
    *   **Focus Keywords (Optional)**: Add keywords to guide the AI's refinement.
2.  **AI Analysis**:
    *   Click "Analyze & Refine with AI".
3.  **Review AI Output**:
    *   **Refined Idea/Hypothesis**: A more polished and specific version of your concept.
    *   **Potential Pivots/Experiments**: Alternative directions to explore.
    *   **AI-Generated Analysis**:
        *   **Potential Impact Score**: An AI-estimated score (0-100) of the idea's potential.
        *   **Related Work/Competitor Teaser**: A brief summary of the landscape.
        *   **Viability Factors Chart**: A chart showing scores for factors like 'Tractability' and 'Market Size'.
4.  **Save Idea**:
    *   Click "Save to Dashboard" to keep a record of the refined concept.

**Key Takeaway**: This page provides a structured, AI-driven critique to strengthen your initial idea.
    `,
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    icon: LayoutDashboard,
    content: `
The **Dashboard** (LayoutDashboard icon) is where all your saved ideas are stored.

![Dashboard Page Preview](https://placehold.co/600x300.png?text=Dashboard+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Dashboard Interface</p>

**Features:**
- **View Saved Ideas**: Each saved idea is displayed as a card.
- **Actions per Idea**:
    - **Re-Analyze**: Takes you back to the Analyze page to get fresh AI insights on the original concept.
    - **Develop Plan**: Takes you to the Build Studio to start planning the project.

**Key Takeaway**: The Dashboard is your central hub for managing and advancing your saved ideas.
    `,
  },
  {
    id: 'build-studio',
    title: 'Build Studio',
    icon: Hammer,
    content: `
The **Build Studio** page (Hammer icon) helps you create a detailed, AI-generated plan for your project.

**Workflow:**
1.  **Select an Idea**:
    *   On the main Build Studio page, select one of your saved ideas.
2.  **Input Project Details**:
    *   Fill in the form with key details about your project: Value Proposition, Customer Segments, Key Activities, and Revenue Streams.
    *   Provide details for the AI like Target Platform, Core MVP Features, and any tech preferences.
    *   Click **"Save Project Details"** before generating a plan.

    ![Build Studio Form Preview](https://placehold.co/600x400.png?text=Build+Studio+Form)
    <p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Build Studio Input Form</p>

3.  **Generate Development Guide**:
    *   Click **"Generate Development Guide"**.
    *   The AI will create a step-by-step guide for building your project or conducting research.
4.  **Review and Use**:
    *   The guide covers setup, development phases, data analysis, and potential challenges, serving as a first draft for a full project plan.

**Key Takeaway**: This tool transforms your refined idea into an actionable development or research plan.
    `,
  },
  {
    id: 'community',
    title: 'Community Forum',
    icon: Users,
    content: `
The **Community Forum** (Users icon) is envisioned as a place to connect with fellow innovators and researchers.

**Current Features:**
- **Browse Categories**: View discussion categories relevant to innovation and research.

**Future Development (Coming Soon):**
- User profiles and accounts.
- Creating new threads to discuss ideas, papers, and results.
- Replying to posts and engaging with other users.

**Key Takeaway**: This section is under active development and will become a hub for collaboration.
    `,
  },
  {
    id: 'settings',
    title: 'Application Settings',
    icon: Settings,
    content: `
The **Settings** page (Cog icon) allows you to manage application-level configurations.

**Current Features:**
- **Clear All Application Data**:
    - Located in the "Danger Zone".
    - This action **permanently deletes all saved ideas and project plans** from the application's local JSON database.
    - **Use with extreme caution, as this is irreversible.**

**Key Takeaway**: The Settings page is for administrative tasks.
    `,
  },
  {
    id: 'customization',
    title: 'Theme & Language',
    icon: Palette,
    content: `
You can customize your viewing experience using the controls in the sidebar footer.

**Theme Customization (Sun/Moon Icon):**
- Switch between Light, Dark, and System themes.

**Language Selection (Globe Icon):**
- Choose a language from the dropdown.
- AI-generated content will be translated to your selected language.

**Key Takeaway**: Personalize the app's appearance and content language to suit your preferences.
    `,
  },
  {
    id: 'images-in-guide',
    title: 'Images in this Guide',
    icon: HelpCircle,
    content: `
Please note that the images used throughout this help guide are **illustrative placeholders**.

![Placeholder Example](https://placehold.co/400x200.png?text=Illustrative+Image)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Example of a placeholder image</p>

They are intended to give you a general idea of what the interface looks like. The actual application UI may have evolved or might appear slightly different on your screen.
    `,
  },
];
