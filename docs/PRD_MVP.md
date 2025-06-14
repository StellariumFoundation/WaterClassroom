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
