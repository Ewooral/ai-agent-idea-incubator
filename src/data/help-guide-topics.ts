
// src/data/help-guide-topics.ts
import { Lightbulb, CheckCircle, LayoutDashboard, Hammer, Users, Settings, Palette, Globe, HelpCircle, Info, type Icon as LucideIcon } from 'lucide-react';

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
Welcome to **Idea Incubator**! This application is designed to be your partner in innovation, helping you:
- **Generate** novel business ideas using AI.
- **Validate & Refine** these ideas with AI-driven analysis and market insights.
- **Develop** detailed, step-by-step project plans for your validated ideas.
- **Connect** with a community (feature in development).

Navigate through the app using the sidebar on the left. Each section is tailored to a specific stage of the idea lifecycle.
    `,
  },
  {
    id: 'generate-idea',
    title: 'Generating New Ideas',
    icon: Lightbulb,
    content: `
The **Generate Idea** page is where your journey begins. Access it from the sidebar via the Lightbulb icon.

![Generate Idea Page Preview](https://placehold.co/600x300.png?text=Generate+Idea+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Generate Idea Page Interface</p>

**How to Use:**
1.  **Custom Input (Form)**:
    *   **Problem Area (Optional)**: Describe a challenge or domain you're interested in (e.g., "reducing urban food waste").
    *   **Keywords/Topics (Optional)**: Provide high-level topics to guide the AI (e.g., "sustainable energy, AI in education").
    *   Click the "Generate With My Input" button.
    *   *Tip: Providing at least one field helps the AI generate more relevant ideas.*
2.  **Explore by Topic Cards**:
    *   Below the form, you'll find topic cards (e.g., "Health & Wellness", "Sustainable Living").
    *   Clicking a card automatically populates the problem area and keywords and generates ideas for that theme.
3.  **Viewing Results**:
    *   Generated ideas appear as cards at the bottom of the page.
    *   The page will automatically scroll down to show you the loading skeletons and then the results.
4.  **Translation**:
    *   If you select a different language (using the Globe icon in the sidebar), the generated ideas will be translated.
5.  **Next Step**:
    *   On each idea card, click "Validate & Refine" to take the idea to the next stage.

**Key Takeaway**: Experiment with different inputs and topics to discover unique business concepts.
    `,
  },
  {
    id: 'validate-idea',
    title: 'Validating & Refining Ideas',
    icon: CheckCircle,
    content: `
The **Idea Validation** page (Zap icon in the sidebar) helps you dive deeper into a specific idea using AI.

![Idea Validation Page Preview](https://placehold.co/600x350.png?text=Idea+Validation+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Idea Validation Page Interface</p>

**How to Use:**
1.  **Input Your Idea**:
    *   If you clicked "Validate & Refine" from the Generate Idea page, the idea will be pre-filled.
    *   Otherwise, type or paste your idea into the "Your Core Idea" text area.
    *   **Market Context (Optional)**: Add any known market data or trends.
    *   **Focus Keywords (Optional)**: Add keywords to guide the AI's refinement.
2.  **AI Analysis**:
    *   Click "Validate & Refine with AI". The page will scroll to the results section.
3.  **Review AI Output**:
    *   **Refined Idea**: A more polished version of your concept. This can be translated using the language selector.
    *   **Associated Concepts**: Related industries or ideas.
    *   **Potential Pivots**: Alternative directions for your idea.
    *   **AI-Generated Analysis**:
        *   **Overall Market Potential Score**: An AI-estimated score (0-100).
        *   **Key SWOT Snippet**: A highlight from Strengths, Weaknesses, Opportunities, Threats.
        *   **Competitor Landscape Teaser**: A brief AI insight.
        *   **Market Viability Factors Chart**: A bar chart showing AI-estimated scores for factors like "Market Size," "Growth Potential," etc. This chart is dynamically generated by the AI.
4.  **Save Idea**:
    *   If you're happy with the refined idea and analysis, click "Save to Dashboard".

**Key Takeaway**: This page uses AI to provide a quick, structured assessment and refinement of your initial concept.
    `,
  },
  {
    id: 'dashboard',
    title: 'Your Idea Dashboard',
    icon: LayoutDashboard,
    content: `
The **Dashboard** (LayoutDashboard icon in the sidebar) is where all your saved ideas are stored.

![Dashboard Page Preview](https://placehold.co/600x300.png?text=Dashboard+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Dashboard Interface</p>

**Features:**
- **View Saved Ideas**: Each saved idea (after validation) is displayed as a card.
- **Idea Details**: Shows the AI-refined idea text.
- **Actions per Idea**:
    - **Re-Validate Idea**: Takes you back to the Idea Validation page with the original idea pre-filled, allowing you to get fresh AI insights.
    - **Develop Idea**: Takes you to the Build Studio to start planning the development of this specific idea.

**Key Takeaway**: The Dashboard is your central hub for managing and progressing your validated concepts.
    `,
  },
  {
    id: 'build-studio',
    title: 'Build Studio: Development Guides',
    icon: Hammer,
    content: `
The **Build Studio** (Hammer icon in the sidebar) helps you create a detailed, AI-generated development guide for your projects.

**Workflow:**
1.  **Select an Idea**:
    *   The main Build Studio page lists your saved ideas. Click "Develop Guide" on an idea to proceed.
    *   This takes you to a dedicated page for that idea (e.g., \`/build-studio/[ideaId]\`).

    ![Build Studio Idea Selection](https://placehold.co/600x300.png?text=Build+Studio+List)
    <p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Build Studio Idea List</p>

2.  **Input Project Details**:
    *   On the idea-specific page, fill in the form:
        *   **Value Proposition***
        *   **Customer Segments***
        *   **Key Activities***
        *   **Revenue Streams***
        *   **Target Platform*** (e.g., Web, Mobile)
        *   **Core MVP Features*** (3-5 essential features)
        *   Tech Stack Preference (Optional)
        *   Additional Notes for AI (Optional)
    *   Fields marked with * are crucial for generating a good guide.
    *   Click **"Save Project Details"**. *You must save before generating a guide if you make changes.*

    ![Build Studio Form Preview](https://placehold.co/600x400.png?text=Build+Studio+Form)
    <p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Build Studio Input Form</p>

3.  **Generate Development Guide**:
    *   Once details are saved and all required fields are filled, click **"Generate Development Guide"**.
    *   The AI will create a comprehensive step-by-step guide in Markdown format.
    *   The page will scroll down to show the guide. This guide can also be translated using the language selector.
4.  **Review and Use**:
    *   The generated guide covers MVP definition, tech stack, development phases, post-launch considerations, and more.

**Key Takeaway**: The Build Studio transforms your refined idea into an actionable development plan.
    `,
  },
  {
    id: 'community',
    title: 'Community Forum',
    icon: Users,
    content: `
The **Community Forum** (Users icon in the sidebar) is envisioned as a place to connect with fellow innovators.

![Community Page Preview](https://placehold.co/600x300.png?text=Community+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Community Forum Categories</p>

**Current Features:**
- **Browse Categories**: View a list of discussion categories (e.g., "General Discussion", "Idea Feedback").
- **Category Pages**: Click on a category to navigate to its dedicated page.

**Future Development (Coming Soon):**
- User accounts and profiles.
- Ability to create new threads within categories.
- Posting replies and engaging in discussions.
- Real-time interactions.

An administrator can currently add new categories via a dedicated admin page (link available on the community page header during development).

**Key Takeaway**: This section is under active development and will grow into a collaborative space.
    `,
  },
  {
    id: 'settings',
    title: 'Application Settings',
    icon: Settings,
    content: `
The **Settings** page (Cog icon in the sidebar) allows you to manage application-level configurations.

![Settings Page Preview](https://placehold.co/600x250.png?text=Settings+Page)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Settings Page Interface</p>

**Current Features:**
- **Clear All Application Data**:
    - Located in the "Danger Zone".
    - This action **permanently deletes all saved ideas and project development plans** from the application's local JSON database (\`src/data/db.json\`).
    - A confirmation dialog will appear to prevent accidental deletion.
    - **Use with extreme caution, as this is irreversible.**
- **Data Storage Information**:
    - Provides a note that the app currently uses a local JSON file for data storage.
    - Recommends considering a dedicated database solution for production or larger datasets.

**Key Takeaway**: The Settings page is for administrative tasks. Be careful with data clearing operations.
    `,
  },
  {
    id: 'customization',
    title: 'Theme & Language',
    icon: Palette,
    content: `
You can customize your viewing experience using the controls in the sidebar footer.

![Sidebar Footer Preview](https://placehold.co/300x150.png?text=Sidebar+Controls)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Sidebar Theme and Language Controls</p>

**Theme Customization (Sun/Moon Icon):**
- Click the Sun/Moon icon to open the theme selection dropdown.
- **Light**: Sets the application to a light color scheme.
- **Dark**: Sets the application to a dark color scheme.
- **System**: Automatically syncs with your operating system's theme preference.

**Language Selection (Globe Icon):**
- Click the Globe icon to open the language selection dropdown.
- Choose from the list of supported languages (e.g., English, Español, Français).
- **Effect**:
    - AI-generated content (like refined ideas, generated ideas on the main page, and development guides) will be translated to your selected language.
    - Static UI text (button labels, titles fixed in the code) is **not** currently translated by this feature.

**Key Takeaway**: Personalize the app's appearance and content language to suit your preferences.
    `,
  },
  {
    id: 'images-in-guide',
    title: 'Images in this Guide',
    icon: HelpCircle,
    content: `
Please note that the images used throughout this help guide (like the one below) are **illustrative placeholders**.

![Placeholder Example](https://placehold.co/400x200.png?text=Illustrative+Image)
<p class="text-xs text-center text-muted-foreground mt-1" data-ai-hint="app screenshot">Example of a placeholder image</p>

They are intended to give you a general idea of what the interface looks like. The actual application UI may have evolved or might appear slightly different on your screen. These placeholders can be replaced with actual screenshots in future updates.
    `,
  },
];

    