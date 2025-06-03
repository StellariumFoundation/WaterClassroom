Okay, John Victor, this is a condensed package of the initial documents your software engineering team will need to kick off the MVP development for Water Classroom. These are derived from the **Water Classroom Comprehensive Project Dossier v1.1** and focus specifically on **Phase 1 (MVP)**.

Remember, these are starting points. Each would typically be a more extensive, living document with greater detail, especially the UX/UI specifications (which would include actual visual assets).

---

**Water Classroom - MVP Engineering Kickoff Documents (Condensed)**

---

**Document 1: Product Requirements Document (PRD) - MVP**

**Version:** 1.0
**Date:** October 27, 2023
**Based on:** Water Classroom Comprehensive Project Dossier v1.1 (Phase 1)

**1. Introduction & Purpose**
This document outlines the requirements for the Minimum Viable Product (MVP) of Water Classroom. The MVP aims to validate the core concept of an AI-driven, interactive educational platform, focusing on delivering a foundational learning experience for "Water School" homeschooled students and individual learners.

**2. MVP Goals & Scope**

*   **Goals:**
    *   Deliver a functional core learning platform accessible via Web (Svelte) and Mobile (Flutter - initial OS, e.g., Android first, then iOS).
    *   Provide access to a limited set of curricula and subjects.
    *   Implement text-based AI tutoring using Gemini (or similar LLM) with custom system prompts.
    *   Introduce foundational single-player interactive educational games/modules.
    *   Enable basic "Water School" student onboarding and progress tracking.
    *   Gather user feedback for future iterations.
*   **In Scope for MVP (Phase 1 - Dossier v1.1, Section 10.1):**
    *   User registration & authentication (Email/Password, "Water School" distinction).
    *   Curriculum selection (limited initial offering, e.g., Grade 5 Math - Common Core).
    *   AI-delivered interactive lessons (text, images, embedded simple quizzes).
    *   Suite of 3-5 single-player educational games for the selected curriculum.
    *   Text-based AI Tutor (powered by Gemini with custom prompts, accessible during lessons/homework).
    *   Automated grading for simple quizzes/homework (multiple choice, fill-in-the-blanks).
    *   Basic student performance dashboard (completed lessons, scores).
    *   "Water School" student onboarding flow.
    *   Frontend: Web (Svelte), Mobile (Flutter - one OS initially).
    *   Backend: Go microservices for core functions.
    *   Database: PostgreSQL.
*   **Out of Scope for MVP (Defer to Phase 2+):**
    *   Voice-based AI Tutoring.
    *   Multiplayer educational games.
    *   AI-Proctored Exams (and associated identity verification).
    *   Desktop App (Tauri).
    *   Educator/Institutional tools.
    *   Advanced personalization beyond basic curriculum path.
    *   Project-Based Learning Modules.
    *   Gamified "Innovation Labs."
    *   Comprehensive global curricula.
    *   Dynamic multilingual capabilities (MVP likely English-first).
    *   Limited offline access (MVP assumes online connectivity).
    *   Achievement badges, leaderboards beyond basic progress.

**3. Target Users (MVP Focus)**

*   **Primary:** "Water School" Homeschooled Students (e.g., middle-grade, specific initial curriculum).
*   **Secondary:** Independent Students & Consumers (same age/curriculum focus as above for MVP testing).

**4. User Stories & Acceptance Criteria (Key Examples)**

*   **4.1. "Water School" Student Onboarding:**
    *   **US1:** As a prospective "Water School" student, I want to sign up for an account using my email and password, indicating I am a "Water School" student, so I can access the platform.
        *   **AC1:** User can enter email, password, confirm password.
        *   **AC2:** User can check a box/select an option for "Water School" enrollment.
        *   **AC3:** Successful registration creates a user account flagged as "Water School."
        *   **AC4:** User receives a confirmation email (out of scope for MVP if too complex, basic confirmation page is fine).
    *   **US2:** As a new "Water School" student, I want to select my curriculum (e.g., Grade 5 Math, Common Core) from a predefined list, so I can start learning relevant content.
        *   **AC1:** Post-login, user is prompted to select curriculum if not already set.
        *   **AC2:** A limited list of MVP-supported curricula/subjects is presented.
        *   **AC3:** Selection is saved to the user's profile.

*   **4.2. Engaging with Interactive Content (Single Player):**
    *   **US3:** As a student, I want to access my assigned lessons for a selected subject, so I can learn new material.
        *   **AC1:** Dashboard shows current subject/curriculum.
        *   **AC2:** List of lessons (e.g., "Chapter 1: Fractions") is displayed.
        *   **AC3:** User can click on a lesson to open it.
    *   **US4:** As a student, I want to engage with an interactive educational game within a lesson that reinforces a concept (e.g., a fraction matching game), so I can learn in a fun way.
        *   **AC1:** Game loads within the lesson view.
        *   **AC2:** Game has clear instructions.
        *   **AC3:** User can interact with game elements as designed.
        *   **AC4:** Game provides immediate feedback on actions (correct/incorrect).
        *   **AC5:** Game completion is tracked.

*   **4.3. Interacting with AI Tutor (Text-Based):**
    *   **US5:** As a student, when I am stuck on a concept in a lesson or homework, I want to open a text chat with the AI Tutor, so I can ask questions and get help.
        *   **AC1:** A clear "Ask AI Tutor" button/icon is visible during lessons/homework.
        *   **AC2:** Clicking it opens a chat interface.
        *   **AC3:** Student can type a question and send it.
        *   **AC4:** AI Tutor (Gemini via backend) provides a relevant text-based response.
        *   **AC5:** Conversation history is maintained within the session.

**5. Functional Requirements (High-Level List for MVP)**

*   User Account Management (Create, Login, Basic Profile).
*   Curriculum & Lesson Navigation.
*   Interactive Content Delivery (Text, Image, Simple Quizzes, Embedded Single-Player Games).
*   Single-Player Educational Game Engine/Framework Integration.
*   AI Tutor Interaction (Text-based Q&A).
*   Basic Homework/Quiz Submission & Automated Grading.
*   Student Progress Tracking (Lesson Completion, Quiz Scores).
*   "Water School" Student Designation.

**6. Non-Functional Requirements (NFRs) - MVP**

*   **6.1. Performance:**
    *   Page load times (Web): < 3 seconds for key views.
    *   App screen transitions (Mobile): Smooth, < 500ms.
    *   AI Tutor response time: < 5 seconds for typical queries.
    *   Game load time: < 10 seconds.
*   **6.2. Scalability (Initial):**
    *   Support for up to 1,000 concurrent users for MVP.
    *   System should be designed for horizontal scaling of backend services.
*   **6.3. Usability:**
    *   Intuitive navigation.
    *   Clear instructions for games and interactive elements.
    *   Onboarding completion rate > 80%.
*   **6.4. Accessibility (A11y):**
    *   Target WCAG 2.1 Level A for core content and navigation.
    *   Keyboard navigability for web.
    *   Basic screen reader compatibility for text content.
*   **6.5. Security (Basic):**
    *   HTTPS for all communication.
    *   Password hashing (e.g., bcrypt).
    *   Protection against common web vulnerabilities (OWASP Top 10 basics like XSS, SQLi through ORM/sanitization).
    *   Secure handling of AI API keys.

**7. Success Metrics for MVP**

*   Number of registered users (total and "Water School").
*   Daily/Monthly Active Users (DAU/MAU).
*   Average session duration.
*   Lesson completion rates.
*   Game engagement rates (time spent, completion).
*   AI Tutor usage frequency.
*   User feedback scores (e.g., via surveys).

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

---

**Document 3: System Architecture Document - MVP**

**Version:** 1.0
**Date:** October 27, 2023
**Based on:** PRD-MVP, Dossier v1.1 (Sections 6, 10.1)

**1. Introduction & Overview**
This document details the technical architecture for the Water Classroom MVP. It outlines the structure of the frontend clients, backend microservices, AI model integration, database, and other key technical aspects for Phase 1. The architecture prioritizes modularity, scalability for future growth, and leveraging the specified tech stack.

**2. High-Level Architecture Diagram (Textual Description of Components & Flow)**
*(A visual diagram (e.g., using draw.io, Lucidchart) will be created and maintained, showing these components and their primary interactions.)*

*   **Clients:**
    *   **Web Browser (Svelte App):** User interacts, makes API calls to Backend API Gateway.
    *   **Mobile App (Flutter - Android/iOS):** User interacts, makes API calls to Backend API Gateway.
*   **Backend (Cloud Hosted - AWS/Google Cloud/Azure):**
    *   **API Gateway:** Single entry point for all client requests, routes to appropriate microservices. Handles authentication, rate limiting.
    *   **Go Microservices:** Suite of services handling specific business logic.
        *   Communicate with each other (e.g., gRPC or async messaging via a queue for certain tasks).
        *   Communicate with PostgreSQL Database.
        *   Communicate with external AI Services (e.g., Gemini API).
    *   **PostgreSQL Database:** Stores all persistent application data.
*   **External Services:**
    *   **AI LLM Service (e.g., Google Gemini API):** For AI tutoring.

**3. Frontend Architecture (MVP)**

*   **3.1. Web (Svelte & SvelteKit):**
    *   **Structure:** SvelteKit for routing, server-side rendering (SSR) or static site generation (SSG) where appropriate for landing/info pages, client-side rendering (CSR) for the dynamic application interior.
    *   **State Management:** Svelte stores, or a lightweight global state manager if needed.
    *   **API Communication:** `fetch` API or a library like `axios` to interact with the backend API Gateway.
    *   **Component-Based:** UI built from reusable Svelte components.
*   **3.2. Mobile (Flutter):**
    *   **Structure:** Widget-based UI. Clear separation of UI, business logic (e.g., using BLoC, Provider, Riverpod for state management).
    *   **Navigation:** Flutter's Navigator 2.0 or a package like `go_router`.
    *   **API Communication:** `http` package or `dio` to interact with the backend API Gateway.
    *   **Platform Channels:** If any native device features are needed (unlikely for MVP core).

**4. Backend Microservices Architecture (Go - MVP)**
*(Services deployed as Docker containers, orchestrated by Kubernetes or a simpler PaaS.)*

*   **4.1. List of MVP Microservices & Core Responsibilities:**
    *   **4.1.1. User Service:**
        *   Manages user registration, login, authentication (JWTs), profile data, "Water School" status.
    *   **4.1.2. Curriculum Service:**
        *   Manages curriculum structure, subjects, lessons, interactive content metadata (not the assets themselves, which might be in object storage).
    *   **4.1.3. Progress Service:**
        *   Tracks student progress: lesson completion, quiz scores, game achievements (simple for MVP).
    *   **4.1.4. Content Delivery Service (or part of Curriculum Service for MVP):**
        *   Serves lesson content, game configurations/data to clients.
    *   **4.1.5. AI Tutor Orchestration Service:**
        *   Receives tutoring requests from clients.
        *   Formats requests and custom system prompts.
        *   Interfaces with the external LLM (e.g., Gemini API).
        *   Processes LLM responses before returning to the client.
*   **4.2. Inter-service Communication:**
    *   **Synchronous:** gRPC preferred for performance and typed contracts between Go services. REST as a fallback or for simpler internal APIs.
    *   **Asynchronous (Future Consideration):** Message queue (e.g., RabbitMQ, Kafka, NATS) for tasks like sending confirmation emails (if added), or complex background processing (not critical for MVP core).

**5. AI Model Integration (MVP)**

*   **5.1. Gemini (or similar LLM) for Text-Based Tutoring:**
    *   AI Tutor Orchestration Service will make secure API calls to the chosen LLM.
    *   **System Prompts:** Carefully crafted prompts providing context (e.g., student's current lesson, curriculum, relevant prior interactions stored in Progress Service or cached) will be sent with each user query.
    *   Focus on RAG-like behavior through prompt engineering: grounding responses in Water Classroom's curriculum data.

**6. Database Design (PostgreSQL - MVP)**
*(Detailed ERD and table schemas to be created.)*

*   **6.1. Key Entities & Relationships (Conceptual):**
    *   `Users` (user_id, email, password_hash, is_water_school_student, created_at)
    *   `Curricula` (curriculum_id, name, description)
    *   `Subjects` (subject_id, curriculum_id, name)
    *   `Lessons` (lesson_id, subject_id, title, content_metadata_url)
    *   `Games` (game_id, lesson_id, name, config_url)
    *   `UserProgress` (user_id, lesson_id, status, score, game_attempts)
    *   `TutorInteractions` (user_id, session_id, timestamp, user_query, ai_response)
    *   (Relationships: User-Curriculum (selected), User-Progress, Lesson-Games, etc.)
*   **Storage:** Cloud object storage (AWS S3, GCS) for multimedia assets (game assets, videos - referenced by URLs in DB).

**7. Data Flow Diagrams (Conceptual - Example: AI Tutor Request)**
*(To be visualized)*
1.  Client (Svelte/Flutter) sends tutor request (user_id, current_lesson_context, user_query) to API Gateway.
2.  API Gateway authenticates, routes to AI Tutor Orchestration Service.
3.  AI Tutor Service fetches relevant curriculum context (from Curriculum Service or its cache) and student history snippets (from Progress Service).
4.  AI Tutor Service constructs detailed system prompt + user_query, calls Gemini API.
5.  Gemini API returns response.
6.  AI Tutor Service processes response (e.g., basic filtering, formatting), logs interaction, returns to client via API Gateway.

**8. Technology Stack Summary (MVP - from Dossier v1.1)**
*   **Frontend Web:** Svelte, SvelteKit
*   **Frontend Mobile:** Flutter (Dart)
*   **Frontend Desktop (Phase 2):** Tauri
*   **Backend:** Go (Microservices)
*   **Database:** PostgreSQL
*   **AI Tutoring:** Gemini (or similar LLM) via API
*   **AI Proctoring (Phase 2):** Hugging Face VLMs
*   **Deployment:** Docker, Cloud Platform (AWS/GCP/Azure)

**9. Security Considerations (MVP)**
*   Standard input validation and output encoding.
*   Secure API authentication (JWTs).
*   Secrets management for API keys (e.g., HashiCorp Vault, cloud provider's KMS).
*   Regular dependency scanning.
*   Role-based access control (RBAC) for internal APIs if multiple user types (admin vs student) access them, though simple for MVP.

**10. Scalability & Performance Considerations (MVP)**
*   Stateless backend services where possible for easier horizontal scaling.
*   Efficient database queries and indexing.
*   Connection pooling for database and external API calls.
*   Basic caching strategies (e.g., for frequently accessed curriculum data).
*   Monitoring and logging in place from day one (e.g., Prometheus, Grafana, ELK stack or cloud equivalents).

---

John Victor, these condensed documents should give your engineering team a solid foundation to begin discussing implementation details, breaking down tasks, and starting development on the Water Classroom MVP. Each section here can and should be expanded with more detail as the project progresses.


