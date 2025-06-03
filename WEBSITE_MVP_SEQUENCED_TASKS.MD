### Phase 0: Foundational Setup (Corresponds to M0-M1)

1.  **A1. Basic Cloud Infrastructure & IaC (Terraform for VPC, EKS, RDS, S3 basics).**
    *   Set up Terraform configuration for basic Virtual Private Cloud (VPC).
    *   Define Terraform module for Elastic Kubernetes Service (EKS) cluster (initial configuration).
    *   Define Terraform module for RDS PostgreSQL instance (MVP specifications).
    *   Define Terraform module for S3 bucket for lesson content/media and static website hosting if applicable.

2.  **A2. CI/CD Pipeline (GitHub Actions: Lint→Test→Build→Container push basics).**
    *   Configure GitHub Actions workflow for Go backend: linting, unit testing, building binaries.
    *   Configure GitHub Actions workflow for Go backend: Docker image building and pushing to container registry.
    *   Configure GitHub Actions workflow for Svelte/React frontend: linting, unit testing, building static assets.
    *   Configure GitHub Actions workflow for Svelte/React frontend: deploying static assets to S3/hosting.

3.  **A4. Secrets Management (External-Secrets Operator).**
    *   Deploy External-Secrets Operator to EKS cluster.
    *   Configure roles and permissions for External-Secrets Operator to access AWS Secrets Manager.
    *   Define initial secret schemas and store placeholder secrets in AWS Secrets Manager for core services.

4.  **A5. API Gateway (Initial setup, routing for core services).**
    *   Deploy an API Gateway solution (e.g., AWS API Gateway, or an Ingress controller like NGINX/Traefik with basic routing rules if using EKS).
    *   Configure initial routing rules for `auth-svc`.

5.  **B2. `auth-svc` Backend: Database schema for users.**
    *   Design and implement PostgreSQL schema for `users` table (columns: user_id, email, password_hash, is_water_school_student, created_at, updated_at).
    *   Set up database migrations for the `users` table.

6.  **B1. `auth-svc` Backend: User registration (email/password, "Water School" flag), login, JWT issuance.**
    *   Implement `/auth/register` endpoint in `auth-svc` (Go): handle email/password input, hash password, store user with "Water School" flag.
    *   Implement `/auth/login` endpoint in `auth-svc` (Go): verify credentials, issue JWT.
    *   Implement JWT generation and validation logic (RS256 recommended).
    *   Add basic unit and integration tests for registration and login flows.

7.  **A3. Observability Stack Setup (Prometheus, Grafana - Helm install, basic dashboards).**
    *   Install Prometheus operator and Prometheus instance via Helm chart in EKS.
    *   Install Grafana via Helm chart in EKS.
    *   Configure Prometheus to scrape metrics from core backend services (initially `auth-svc`).
    *   Create a basic Grafana dashboard for `auth-svc` metrics (e.g., request rate, error rate, latency).

### Phase 1: Core User & Curriculum Backend (Corresponds to M1-M2)

8.  **B4. `user-svc` Backend: Database schema for user profiles.**
    *   Design and implement PostgreSQL schema for `user_profiles` table (columns: user_id (FK), name, profile_picture_url, selected_curriculum_id, country, etc.).
    *   Set up database migrations for the `user_profiles` table.

9.  **B3. `user-svc` Backend: Basic user profile data management.**
    *   Implement CRUD endpoints in `user-svc` (Go) for managing user profile data (e.g., GET `/users/{id}/profile`, PUT `/users/{id}/profile`).
    *   Ensure `user-svc` endpoints are authenticated and authorized.
    *   Add unit and integration tests for profile management.

10. **C2. `curriculum-svc` Backend: Database schema for curriculum structure.**
    *   Design and implement PostgreSQL schema for `curricula`, `subjects`, and `lessons` tables (metadata focus: ids, titles, descriptions, order, relationships).
    *   Set up database migrations for these tables.

11. **C4. `curriculum-svc` Backend: Define initial lesson structure/schema.**
    *   Define JSON schema or a structured format for representing basic lesson content (e.g., text blocks, image URLs, simple quiz references). This is the metadata part, not raw files.

12. **C5. `curriculum-svc` Backend: Mechanism for storing/linking actual lesson content.**
    *   Implement logic in `curriculum-svc` to store URLs or identifiers pointing to actual lesson content/assets stored in S3 (e.g., markdown files, images, game configs).
    *   If using structured content (e.g., JSON in DB), ensure `lessons` table can store this or links to it.

13. **C1. `curriculum-svc` Backend: CRUD for limited MVP curricula, subjects, lessons (metadata).**
    *   Implement admin-facing (initially, could be direct DB access or simple internal endpoints) CRUD operations in `curriculum-svc` (Go) for managing a limited set of curricula, subjects, and lesson metadata.
    *   Add unit and integration tests for curriculum metadata management.

14. **C3. `curriculum-svc` Backend: Endpoints to serve lesson content metadata.**
    *   Implement public-facing GET endpoints in `curriculum-svc` (Go) to list available curricula, subjects within a curriculum, and lessons within a subject.
    *   Implement a GET endpoint to retrieve specific lesson metadata (including links/info to actual content).

15. **E1. AI Mesh Backend: Design and implement proxy/abstraction layer for AI service calls (Gemini).**
    *   Design gRPC interface for internal AI service calls (e.g., `AIService.GenerateText`).
    *   Implement an internal `ai-mesh-svc` (Go) or a module within an existing service that acts as a proxy to the Gemini API.
    *   Securely manage Gemini API key server-side.

### Phase 2: Initial Web Frontend - Auth & Curriculum Display (Corresponds to M1-M2 UX)

16. **B5. Web Frontend: User registration page/components.**
    *   Develop Svelte/React components for user registration form (email, password, "Water School" flag).
    *   Implement client-side validation for registration form.
    *   Implement API call to `auth-svc` `/auth/register` endpoint.

17. **B6. Web Frontend: User login page/components.**
    *   Develop Svelte/React components for user login form.
    *   Implement client-side validation for login form.
    *   Implement API call to `auth-svc` `/auth/login` endpoint and handle JWT storage (e.g., HttpOnly cookie or secure local storage).

18. **B8. Web Frontend: "Water School" student onboarding flow.**
    *   Design and implement UI flow for post-registration/login if user is "Water School" flagged and needs to select initial curriculum (if not part of registration itself).
    *   Connect this flow to `user-svc` to save curriculum choice.

19. **B7. Web Frontend: Basic profile display/management.**
    *   Develop Svelte/React page/components to display user profile data from `user-svc`.
    *   Develop Svelte/React components to allow users to update basic profile information (e.g., name, profile picture URL).
    *   Implement API calls to `user-svc` for fetching and updating profile data.

20. **C6. Web Frontend: Curriculum selection/browsing interface.**
    *   Develop Svelte/React components to display list of available curricula.
    *   Develop Svelte/React components to display subjects within a selected curriculum.
    *   Develop Svelte/React components to display lessons within a selected subject.
    *   Implement API calls to `curriculum-svc` to fetch curriculum data.

21. **C7. Web Frontend: Lesson display view (rendering text, images).**
    *   Develop Svelte/React component to render lesson content fetched from `curriculum-svc` (initially text and images based on the defined lesson structure).
    *   Handle fetching and displaying content from S3 URLs if applicable.

### Phase 3: Basic Interactivity & AI Tutor Backend (Corresponds to M2-M3)

22. **D2. `progress-svc` Backend: Database schema for progress.**
    *   Design and implement PostgreSQL schema for `user_progress` table (e.g., user_id, lesson_id, status like 'completed', quiz_score, last_accessed_at).
    *   Set up database migrations for the `user_progress` table.

23. **D1. `progress-svc` Backend: Basic progress tracking (lesson completion, simple quiz scores).**
    *   Implement endpoints in `progress-svc` (Go) to record lesson completion.
    *   Implement endpoints in `progress-svc` (Go) to record quiz scores.
    *   Add unit and integration tests for progress tracking.

24. **D5. `assessment-svc` Backend (or simplified alternative): Receive quiz answers, auto-grade.**
    *   Design basic schema for `quizzes` (quiz_id, lesson_id, questions) and `quiz_submissions` (submission_id, user_id, quiz_id, answers, score).
    *   Implement an endpoint in `assessment-svc` (or `progress-svc` if simplifying) to receive quiz answers.
    *   Implement logic for auto-grading multiple-choice questions.
    *   Store submission and score, potentially update `user_progress`.

25. **E2. `tutor-orchestrator-svc` Backend: Basic version for text queries.**
    *   Develop initial `tutor-orchestrator-svc` (Go).
    *   Implement an endpoint to receive text queries from users (e.g., `/tutor/chat`).
    *   This service will call the `ai-mesh-svc` (Gemini proxy) with the user's query and any necessary context (e.g., current lesson ID, basic user info).
    *   Format and return the AI's response.

26. **D7. Single-Player Games: Framework/engine for web-based games.**
    *   Research and select/develop a simple JavaScript framework or patterns for embedding interactive educational mini-games (e.g., using Phaser.js if complex, or custom Svelte/React components for simpler interactions).
    *   Define how game state and completion will be communicated back to the main application.

### Phase 4: Web Frontend Interactivity & AI Tutor Integration (Corresponds to M2-M3 UX)

27. **D3. Web Frontend: Embed simple quizzes within lesson view.**
    *   Develop Svelte/React components to render simple quizzes (e.g., multiple choice) based on data from `curriculum-svc`.
    *   Integrate these components into the lesson display view.

28. **D4. Web Frontend: Submit quiz answers.**
    *   Implement form handling and API call to `assessment-svc` (or alternative) to submit quiz answers.
    *   Display feedback/score to the user.

29. **D8. Single-Player Games: Develop 1-2 initial web-based educational games.**
    *   Design and implement the first MVP single-player educational game (e.g., a simple matching game or fill-in-the-blanks related to the initial curriculum).
    *   Design and implement a second MVP single-player educational game.

30. **D9. Web Frontend: Integrate/embed single-player games.**
    *   Develop Svelte/React components to embed or link to the single-player games within relevant lessons.
    *   Implement logic to track game completion/basic scores and report to `progress-svc`.

31. **E3. Web Frontend: AI Tutor chat widget/interface.**
    *   Develop Svelte/React components for an AI Tutor chat widget (input field, message display area).
    *   Allow users to open/close the widget.

32. **E4. Web Frontend: Send query + context to `tutor-orchestrator-svc`.**
    *   Implement API call from the chat widget to `tutor-orchestrator-svc` `/tutor/chat` endpoint, sending the user's query and relevant context (e.g., current lesson ID).
    *   Display the AI tutor's response in the chat interface.

33. **D6. Web Frontend: Basic student performance dashboard.**
    *   Develop Svelte/React page/components for a simple student dashboard.
    *   Display data such as completed lessons and quiz scores by fetching data from `progress-svc`.
