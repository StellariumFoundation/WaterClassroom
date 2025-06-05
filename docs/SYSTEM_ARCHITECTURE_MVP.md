---

**Document 3: System Architecture Document - MVP**

**Version:** 1.1
**Date:** October 28, 2023 (Updated for Monolith)
**Based on:** PRD-MVP, Dossier v1.1 (Sections 6, 10.1)

**1. Introduction & Overview**
This document details the technical architecture for the Water Classroom MVP. It outlines the structure of the frontend clients, the **backend monolith application**, AI model integration, database, and other key technical aspects for Phase 1. The architecture prioritizes modularity within the monolith for maintainability, scalability for future growth, and leveraging the specified tech stack.

**2. High-Level Architecture Diagram (Textual Description of Components & Flow)**
*(A visual diagram (e.g., using draw.io, Lucidchart) will be created and maintained, showing these components and their primary interactions.)*

*   **Clients:**
    *   **Web Browser (Svelte App):** User interacts, makes API calls to the Backend Monolith.
    *   **Mobile App (Flutter - Android/iOS):** User interacts, makes API calls to the Backend Monolith.
*   **Backend (Cloud Hosted - AWS/Google Cloud/Azure):**
    *   **Backend Monolith (Go Application):** Single entry point and application server for all client requests.
        *   Contains internal **modules** (e.g., `auth`, `curriculum`, `payment`, `progress`, `ai_tutor_orchestrator`) that handle specific business logic.
        *   Interactions between these modules primarily occur via direct Go function/method calls within the same process.
        *   Exposes a unified API (REST, potentially gRPC for specific internal uses later) for clients.
        *   Serves static frontend assets (HTML, CSS, JS for the Svelte SPA).
        *   Communicates with PostgreSQL Database.
        *   Communicates with external AI Services (e.g., Gemini API).
        *   Handles background tasks or asynchronous operations (e.g., email sending via RabbitMQ, if used) through dedicated components or goroutines within the monolith.
    *   **PostgreSQL Database:** Stores all persistent application data.
    *   **(Optional) RabbitMQ:** For asynchronous tasks like sending emails or notifications, if not handled by direct API calls to third-party services.
*   **External Services:**
    *   **AI LLM Service (e.g., Google Gemini API):** For AI tutoring.
    *   **Payment Gateway (e.g., Stripe API):** For processing payments.

**3. Frontend Architecture (MVP)**

*   **3.1. Web (Svelte & SvelteKit):**
    *   **Structure:** SvelteKit for routing, server-side rendering (SSR) or static site generation (SSG) where appropriate for landing/info pages, client-side rendering (CSR) for the dynamic application interior (served by the Go monolith).
    *   **State Management:** Svelte stores, or a lightweight global state manager if needed.
    *   **API Communication:** `fetch` API or a library like `axios` to interact with the monolith's backend API.
    *   **Component-Based:** UI built from reusable Svelte components.
*   **3.2. Mobile (Flutter):**
    *   **Structure:** Widget-based UI. Clear separation of UI, business logic (e.g., using BLoC, Provider, Riverpod for state management).
    *   **Navigation:** Flutter's Navigator 2.0 or a package like `go_router`.
    *   **API Communication:** `http` package or `dio` to interact with the monolith's backend API.
    *   **Platform Channels:** If any native device features are needed (unlikely for MVP core).

**4. Backend Monolith Architecture (Go - MVP)**
*(The application deployed as a Docker container, potentially orchestrated by Kubernetes or a simpler PaaS for scalability.)*

*   **4.1. List of MVP Modules & Core Responsibilities:**
    *   **4.1.1. Auth Module (`auth`):**
        *   Manages user registration, login, authentication (JWTs), profile data, "Water School" status.
    *   **4.1.2. Curriculum Module (`curriculum`):**
        *   Manages curriculum structure, subjects, lessons, interactive content metadata.
    *   **4.1.3. Progress Module (`progress`):**
        *   Tracks student progress: lesson completion, quiz scores, game achievements.
    *   **4.1.4. Payment Module (`payment`):**
        *   Integrates with Stripe for payment processing, manages payment intents and history.
    *   **4.1.5. Notification Module (`notification`):**
        *   Handles placeholder logic for future user notifications (e.g., achievements, reminders).
    *   **4.1.6. Assessment Module (`assessment`):**
        *   Handles placeholder logic for quizzes, exams, and other assessment types.
    *   **4.1.7. AI Tutor Orchestration Module (`tutor_orchestrator`):**
        *   Receives tutoring requests from clients via the monolith's API.
        *   Formats requests and custom system prompts.
        *   Interfaces with the external LLM (e.g., Gemini API).
        *   Processes LLM responses before returning to the client.
    *   **4.1.8. Static File Serving (Router/Core):**
        *   Serves the Svelte SPA (HTML, CSS, JS) and any other static assets.
*   **4.2. Inter-module Communication:**
    *   **Primary Method:** Direct Go function/method calls between packages/modules (e.g., `tutor_orchestrator` module calling methods from `curriculum` module).
    *   **Shared Context:** Request-scoped context (`gin.Context`) can carry request-specific data and shared dependencies (like the `app.Application` struct).
    *   **Asynchronous Operations:** For tasks like sending confirmation emails or processing lengthy background jobs (if RabbitMQ is integrated), specific modules would publish messages to a queue. A worker component (potentially within the same monolith process or a separate process sharing the codebase) would consume and process these messages. This is distinct from core request/response flows between modules.

**5. AI Model Integration (MVP)**

*   **5.1. Gemini (or similar LLM) for Text-Based Tutoring:**
    *   The **AI Tutor Orchestration Module** within the monolith will make secure API calls to the chosen LLM.
    *   **System Prompts:** Carefully crafted prompts providing context (e.g., student's current lesson, curriculum data from the `curriculum` module, relevant prior interactions from the `progress` module) will be sent with each user query.
    *   Focus on RAG-like behavior through prompt engineering: grounding responses in Water Classroom's curriculum data.

**6. Database Design (PostgreSQL - MVP)**
*(Detailed ERD and table schemas are maintained in the `/migrations` directory.)*

*   **6.1. Key Entities & Relationships (Conceptual):**
    *   `Users` (user_id, email, password_hash, is_water_school_student, created_at)
    *   `Curricula` (curriculum_id, name, description)
    *   `Subjects` (subject_id, curriculum_id, name)
    *   `Lectures` (lecture_id, subject_id, title, content_source_type, content)
    *   `UserProgress` (user_id, item_id, item_type, status, score)
    *   `Payments` (payment_id, user_id, stripe_payment_intent_id, amount, status)
    *   `TutorInteractions` (user_id, session_id, timestamp, user_query, ai_response) - *Conceptual, to be defined if session logging is detailed.*
    *   (Relationships: User-Curriculum (selected), User-Progress, Curriculum-Subject, Subject-Lecture, etc.)
*   **Storage:** Cloud object storage (AWS S3, GCS) for multimedia assets (game assets, videos - referenced by URLs in DB, not directly managed by monolith for MVP).

**7. Data Flow Diagrams (Conceptual - Example: AI Tutor Request)**
*(To be visualized)*
1.  Client (Svelte/Flutter) sends tutor request (user_id from token, current_lesson_context, user_query) to the **Monolith API**.
2.  **Monolith API** authenticates the request (using the `auth_module`), then routes it to the **AI Tutor Orchestration Module**.
3.  **AI Tutor Orchestration Module** fetches relevant curriculum context (from `curriculum_module` via direct function call) and student history snippets (from `progress_module` via direct function call).
4.  **AI Tutor Orchestration Module** constructs a detailed system prompt + user_query, then calls the Gemini API.
5.  Gemini API returns a response.
6.  **AI Tutor Orchestration Module** processes the response (e.g., basic filtering, formatting), potentially logs the interaction (if a logging mechanism is added to this module), and returns the response to the client via the Monolith's standard API response flow.

**8. Technology Stack Summary (MVP - from Dossier v1.1, adapted for Monolith)**
*   **Frontend Web:** Svelte, SvelteKit
*   **Frontend Mobile:** Flutter (Dart)
*   **Frontend Desktop (Phase 2):** Tauri
*   **Backend:** Go (**Monolith with internal modules**)
*   **Database:** PostgreSQL
*   **AI Tutoring:** Gemini (or similar LLM) via API
*   **Payment Processing:** Stripe API
*   **AI Proctoring (Phase 2):** Hugging Face VLMs
*   **Deployment:** Docker, Cloud Platform (AWS/GCP/Azure)
*   **(Optional) Message Queue:** RabbitMQ (for specific async tasks)

**9. Security Considerations (MVP)**
*   Standard input validation and output encoding for all API handlers.
*   Secure API authentication (JWTs) managed by the `auth` module.
*   Secrets management for API keys (e.g., HashiCorp Vault, cloud provider's KMS, or environment variables for simplicity in early MVP).
*   Regular dependency scanning.
*   RBAC (Role-Based Access Control) can be implemented within modules if different user roles (admin vs student) require different access levels to module functionalities.

**10. Scalability & Performance Considerations (MVP)**
*   **Horizontal scaling of the entire monolith application instance.** Multiple instances can be run behind a load balancer.
*   Stateless application handlers/modules where possible to facilitate horizontal scaling.
*   Efficient database queries and indexing (critical for monolith performance).
*   Connection pooling for database and external API calls.
*   Basic caching strategies (e.g., in-memory caching for frequently accessed, rarely changing data like curriculum structures, or Redis if shared cache is needed).
*   Monitoring and logging in place from day one (e.g., Prometheus, Grafana, ELK stack or cloud equivalents) to identify bottlenecks within the monolith.
*   Asynchronous processing for long-running tasks (e.g., sending emails, complex report generation) to avoid blocking API requests, potentially using goroutines or a message queue like RabbitMQ.

---
