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
