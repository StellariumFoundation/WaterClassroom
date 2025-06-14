---

**Document 2: UX/UI Design Specifications - MVP (Conceptual Outline)**

**Version:** 1.0
**Date:** October 27, 2023
**Based on:** PRD-MVP & Dossier v1.1

**1. Introduction & Design Philosophy**
This document outlines the UX/UI design direction for the Water Classroom MVP. The design philosophy emphasizes:
*   **Engaging & Interactive:** Prioritize active learning through games and interactive elements.
*   **User-Friendly:** Intuitive, simple, and accessible for the target student audience.
*   **Encouraging:** Positive reinforcement and clear progress indicators.
*   **Consistent:** A unified experience across Web (Svelte) and Mobile (Flutter).

**2. Key User Flows (MVP Examples - Textual Description)**
*(Detailed flow diagrams to be provided in Figma/Miro)*

*   **2.1. "Water School" Student Onboarding & Curriculum Selection:**
    1.  Landing Page -> Sign Up Button.
    2.  Sign Up Form (Email, Password, "Water School" Checkbox) -> Submit.
    3.  (Optional: Email verification step).
    4.  Login Page -> Enter Credentials -> Submit.
    5.  Welcome Screen / Initial Dashboard -> Prompt for Curriculum Selection.
    6.  Curriculum Selection Screen (List of available subjects/grades) -> Select -> Confirm.
    7.  Main Student Dashboard.
*   **2.2. Engaging with an Interactive Lesson/Game (Single Player):**
    1.  Student Dashboard -> Select Subject (e.g., Math).
    2.  Subject Page (List of Lessons/Modules) -> Select Lesson.
    3.  Lesson View:
        *   Lesson content (text, images).
        *   Embedded interactive quiz/element.
        *   Link/Button to start Educational Game.
    4.  Game View:
        *   Game loads and starts.
        *   User plays the game.
        *   Game ends, score/result shown.
        *   Option to return to lesson or next activity.
*   **2.3. Accessing AI Tutor for Text-Based Help:**
    1.  Student is in Lesson View or Homework View.
    2.  Clicks "AI Tutor" button.
    3.  AI Tutor Chat Panel slides in/opens.
    4.  Student types question -> Sends.
    5.  AI Tutor response appears in chat.
    6.  Student can continue conversation or close chat panel.

**3. Wireframes & Mockups (Conceptual - Describe what's needed)**
*(Links to Figma/Sketch/XD files containing detailed wireframes and high-fidelity mockups for all screens and states will be provided by the design team.)*

*   **3.1. Core Screens List (MVP):**
    *   Login / Sign Up Pages
    *   Password Reset Flow
    *   Student Dashboard (Overview of progress, current lesson)
    *   Curriculum/Subject Selection Page
    *   Lesson List Page (for a subject)
    *   Lesson View (displaying content, interactive elements, game launchers)
    *   Educational Game View (interface for playing single-player games)
    *   AI Tutor Chat Interface (panel or modal)
    *   Simple Quiz/Homework Interface
    *   Basic Profile/Settings Page
*   **3.2. Key Interactive Elements:**
    *   Navigation menus (sidebar/top bar)
    *   Buttons (primary, secondary, tertiary actions)
    *   Input fields, dropdowns, checkboxes
    *   Progress bars/indicators
    *   Game controls (specific to each MVP game type)
    *   Chat input and display bubbles

**4. UI Kit / Component Library (Conceptual - List key components)**
*(A shared library in Figma/Sketch will define these for visual consistency. Svelte and Flutter teams will implement reusable components based on this.)*

*   **Common:** Typography (headings, body, labels), Color Palette, Iconography, Buttons, Cards, Modals, Form Elements, Navigation Components.
*   **4.1. Svelte Components (Web):** Specific implementations for web layout, responsiveness.
*   **4.2. Flutter Widgets (Mobile):** Specific implementations for mobile layout, touch interactions.

**5. Accessibility Considerations in Design (MVP)**
*   Sufficient color contrast.
*   Clear visual hierarchy.
*   Focus indicators for keyboard navigation (Web).
*   ARIA attributes for web components where appropriate.
*   Consideration for tap target sizes (Mobile).
