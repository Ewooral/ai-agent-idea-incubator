
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
Welcome to the **AI Safety Research Simulator**! This application is designed to accelerate your AI Safety research workflow, helping you:
- **Generate** novel research proposals using AI.
- **Analyze & Refine** these proposals with AI-driven analysis and strategic insights.
- **Develop** detailed, step-by-step experiment plans for your validated proposals.
- **Connect** with a community of fellow researchers (feature in development).

Navigate through the app using the sidebar on the left. Each section is tailored to a specific stage of the research lifecycle.
    `,
  },
  {
    id: 'generate-proposal',
    title: 'Generating Research Proposals',
    icon: Lightbulb,
    content: `
The **Generate Proposal** page is your starting point for exploring new research directions.

![Generate Proposal Page Preview](https://placehold.co/600x300.png?text=Generate+Proposal+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Generate Proposal Page Interface</p>

**How to Use:**
1.  **Custom Input (Form)**:
    *   **Problem Area (Optional)**: Describe a challenge in AI Safety (e.g., "how to verify honesty in LLMs").
    *   **Keywords/Topics (Optional)**: Provide high-level topics to guide the AI (e.g., "deceptive alignment, interpretability").
    *   Click "Generate With My Input".
2.  **Explore by Topic Cards**:
    *   Below the form are cards for core AI Safety topics (e.g., "Scalable Oversight", "Interpretability").
    *   Clicking a card auto-fills the form and generates relevant research questions.
3.  **Viewing Results**:
    *   Generated research questions appear as cards at the bottom of the page.
    *   Each card includes a "Novelty Score" to gauge its originality.
4.  **Next Step**:
    *   On each proposal card, click "Analyze & Refine" to move to the next stage.

**Key Takeaway**: Use this page to brainstorm novel, concrete research questions that can be developed into full projects.
    `,
  },
  {
    id: 'analyze-proposal',
    title: 'Analyzing & Refining Proposals',
    icon: CheckCircle,
    content: `
The **Analyze Proposal** page (CheckCircle icon) helps you flesh out a research question into a testable hypothesis.

![Analyze Proposal Page Preview](https://placehold.co/600x350.png?text=Analyze+Proposal+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Analyze Proposal Page Interface</p>

**How to Use:**
1.  **Input Your Proposal**:
    *   A research question from the previous page will be pre-filled.
    *   You can also enter your own question directly.
    *   **Context / Related Work (Optional)**: Add any known papers or context.
    *   **Focus Keywords (Optional)**: Add keywords to guide the AI's refinement.
2.  **AI Analysis**:
    *   Click "Analyze & Refine with AI".
3.  **Review AI Output**:
    *   **Refined Hypothesis**: A more polished and specific version of your idea.
    *   **Potential Experiments / Pivots**: Alternative research directions.
    *   **AI-Generated Analysis**:
        *   **Potential Impact Score**: An AI-estimated score (0-100) of the idea's potential contribution to reducing AI risk.
        *   **Related Work Teaser**: A brief summary of similar research.
        *   **Viability Factors Chart**: A chart showing scores for factors like 'Tractability' and 'Scalability'.
4.  **Save Proposal**:
    *   Click "Save to Dashboard" to keep a record of the refined proposal.

**Key Takeaway**: This page provides a structured, AI-driven critique to strengthen your initial research idea.
    `,
  },
  {
    id: 'dashboard',
    title: 'Your Research Dashboard',
    icon: LayoutDashboard,
    content: `
The **Dashboard** (LayoutDashboard icon) is where all your saved research proposals are stored.

![Dashboard Page Preview](https://placehold.co/600x300.png?text=Dashboard+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Dashboard Interface</p>

**Features:**
- **View Saved Proposals**: Each saved proposal is displayed as a card, showing the refined hypothesis.
- **Actions per Proposal**:
    - **Re-Analyze**: Takes you back to the Analyze page to get fresh AI insights on the original question.
    - **Develop Plan**: Takes you to the Experiment Plan page to start designing the research project.

**Key Takeaway**: The Dashboard is your central hub for managing and advancing your research proposals.
    `,
  },
  {
    id: 'experiment-plan',
    title: 'Experiment Plan',
    icon: Hammer,
    content: `
The **Experiment Plan** page (Hammer icon) helps you create a detailed, AI-generated plan for your research project.

**Workflow:**
1.  **Select a Proposal**:
    *   On the main Experiment Plan page, select one of your saved proposals.
2.  **Input Project Details**:
    *   Fill in the form with key details about your proposed experiment: Value Proposition (of the research), Customer Segments (who benefits), Key Activities (research tasks), and Revenue Streams (funding sources).
    *   Provide details for the AI like Target Platform (e.g., PyTorch, JAX), Core MVP Features (core experimental setup), and any tech preferences.
    *   Click **"Save Project Details"** before generating a plan.

    ![Experiment Plan Form Preview](https://placehold.co/600x400.png?text=Experiment+Plan+Form)
    <p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Experiment Plan Input Form</p>

3.  **Generate Development Guide**:
    *   Click **"Generate Development Guide"**.
    *   The AI will create a step-by-step guide for conducting the research.
4.  **Review and Use**:
    *   The guide covers the experimental setup, development phases, data analysis, and potential challenges, serving as a first draft for a full research plan.

**Key Takeaway**: This tool transforms your refined hypothesis into an actionable research and development plan.
    `,
  },
  {
    id: 'community',
    title: 'Community Forum',
    icon: Users,
    content: `
The **Community Forum** (Users icon) is envisioned as a place to connect with fellow AI Safety researchers.

**Current Features:**
- **Browse Categories**: View discussion categories relevant to AI Safety research.

**Future Development (Coming Soon):**
- User profiles and accounts.
- Creating new threads to discuss papers, proposals, and results.
- Replying to posts and engaging with other researchers.

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
    - This action **permanently deletes all saved research proposals and experiment plans** from the application's local JSON database.
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
- AI-generated content (like refined hypotheses and experiment plans) will be translated to your selected language.

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
