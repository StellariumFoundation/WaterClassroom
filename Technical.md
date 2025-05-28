
## Water Classroom: Foundational Engineering Documentation Suite

**Version:** 1.0
**Date:** October 26, 2023
**Project Lead:** John Victor

---

### Document 1: Detailed Functional Specifications (Engineering Focus)

**1. Introduction**
This document specifies key functional requirements for Water Classroom, guiding engineering development. It focuses on system behavior and user interactions critical for implementation.

**2. User Roles (Summary for Engineering)**
*   **Student:** Primary user; interacts with content, AI tutor, assessments.
*   **Educator (Institutional - Future):** Manages groups, customizes content.
*   **System Administrator (Stellarium):** Platform oversight, content/AI management.

**3. General Platform Requirements (Engineering Implications)**
*   **GP-01: Multi-Platform Delivery:**
    *   **Web App:** Target modern browsers. Ensure performant rendering (Flutter Web considerations).
    *   **Mobile Apps (iOS/Android):** Native or Flutter-based. Access to device camera/mic required.
    *   **Desktop Apps (Windows, macOS, Linux):** Likely Flutter-based. Access to device camera/mic.
*   **GP-02: Responsive UI/UX:** Fluid layouts, adaptive components.
*   **GP-03: Localization (L10N):** UI strings externalized. AI content translation handled by AI services.
*   **GP-04: Accessibility (A11Y):** Semantic HTML (web), ARIA attributes, keyboard navigation, screen reader compatibility.
*   **GP-05: Offline Mode (Limited):** Client-side caching strategy for lesson text/simple interactives. Robust sync mechanism upon reconnection.

**4. Core Functional Modules (Specifications for Engineering)**

    **4.1. User Account Management (UAM)**
        *   **UAM-FS-01: Registration:** Email/password & OAuth (Google, Apple). Email verification flow. Secure password hashing (e.g., bcrypt, Argon2).
        *   **UAM-FS-02: Login:** Credential & OAuth authentication. Session management (e.g., JWT). Rate limiting.
        *   **UAM-FS-03: Password Reset:** Secure token-based flow via email.
        *   **UAM-FS-04: Profile Management:** Editable name. Curriculum selection (persisted). Account deletion (soft & hard delete stages).

    **4.2. Curriculum & Content Delivery (CCD)**
        *   **CCD-FS-01: Curriculum Selection:** Hierarchical selection (Country -> System -> Grade -> Subject). Persist choice. Dynamic content loading based on selection.
        *   **CCD-FS-02: AI-Delivered Interactive Lectures:**
            *   Modular content presentation (text, image, video, interactive quizzes/games).
            *   Content sourced/structured by AI, stored in a manageable format (e.g., JSON, Markdown with extensions).
            *   Video streaming capabilities (internal or external hosting).
            *   Interactive elements (quizzes, simulations) logic handled client-side or via API calls for state persistence.
            *   Progress tracking per module/lesson.
        *   **CCD-FS-03: Educational Games:** Embedded or linked. State potentially managed client-side for simple games, server-side for complex ones.

    **4.3. AI Tutoring (AIT)**
        *   **AIT-FS-01: Tutor Access:** Persistent UI element. Opens chat interface (WebSocket for real-time text/voice).
        *   **AIT-FS-02: Personalized Responses:**
            *   API calls to Tutoring AI service with user query, context (current lesson, recent performance).
            *   Tutor AI avoids direct answers for assessments; provides guidance.
            *   Session logging for AI improvement (anonymized).
        *   **AIT-FS-03: AI Learning Analysis:** Backend process analyzing interaction logs, assessment data to infer knowledge gaps/styles. This data can feed into the context provided to the Tutoring AI.

    **4.4. Homework & Assessments (HWA)**
        *   **HWA-FS-01: Homework Assignment:** AI generates/selects homework based on curriculum. Presented to student. Submission via platform.
        *   **HWA-FS-02: Automated Grading & Feedback:**
            *   Objective questions: Client-side or server-side validation.
            *   Subjective questions (text): API call to specialized grading AI model with rubric/criteria.
            *   Feedback (correct answers, explanations) displayed to student. Scores recorded.
        *   **HWA-FS-03: Verified Exams (AI Proctored):**
            *   Requires camera/microphone permissions.
            *   Identity Verification: Pre-exam step (e.g., API to facial recognition service, liveness check logic).
            *   Real-time (or near real-time analysis of) video/audio stream sent to Proctoring AI service.
            *   Proctoring AI flags events via API callback or WebSocket message.
            *   Secure recording and temporary storage of exam session media.
            *   Integrity report generation.
        *   **HWA-FS-04: Exam Content & Grading:** Secure question bank. Timed sessions. Automated grading as per HWA-FS-02.

    **4.5. Motivation & Engagement System (MES)**
        *   **MES-FS-01: Badges & Points:** Backend logic to award based on defined criteria (lesson completion, quiz scores, etc.). User profile stores earned items.
        *   **MES-FS-02: Learning Streaks:** Backend tracks daily "active learning" events.
        *   **MES-FS-03: Leaderboards:** Opt-in. Backend aggregates scores for participating users.

---

### Document 2: System Architecture & Technical Design Document

**1. Introduction**
This document outlines the high-level system architecture and key technical design choices for Water Classroom.

**2. Architectural Goals**
*   **Scalability:** Handle millions of concurrent users.
*   **Reliability:** Achieve 99.9% uptime.
*   **Maintainability:** Modular design for easier updates and feature additions.
*   **Security:** Protect user data and ensure academic integrity.
*   **Performance:** Responsive user experience, fast AI interactions.

**3. High-Level Architecture Diagram**

```mermaid
graph TD
    subgraph Client Tier
        WebApp[Web Application (Flutter Web)]
        MobileApp[Mobile Applications (Flutter iOS/Android)]
        DesktopApp[Desktop Applications (Flutter Windows/macOS/Linux)]
    end

    subgraph API Gateway / Load Balancer
        APIGateway[API Gateway / LB]
    end

    subgraph Backend Services (Go Microservices)
        AuthService[Authentication Service]
        UserService[User & Profile Service]
        CurriculumService[Curriculum & Content Service]
        ProgressService[Progress Tracking Service]
        AssessmentService[Assessment & Proctoring Orchestration Service]
        TutorOrchestrationService[AI Tutor Orchestration Service]
        NotificationService[Notification Service]
    end

    subgraph AI Services Layer (Internal or External)
        ContentGenAI[Content Generation/Adaptation AI]
        TutoringAI[Tutoring AI Model(s)]
        ProctoringAI[Proctoring AI Model(s) (VLM)]
        GradingAI[Automated Grading AI (for subjective text)]
    end

    subgraph Data Tier
        UserDB[(User Database - e.g., PostgreSQL)]
        ContentDB[(Content Metadata DB - e.g., PostgreSQL/MongoDB)]
        ProgressDB[(Progress & Analytics DB - e.g., TimeScaleDB/ClickHouse)]
        ExamMediaStorage[(Secure Exam Media Storage - e.g., AWS S3 Glacier)]
        ContentMediaStorage[(Lesson Media Storage - e.g., AWS S3/Cloudflare R2)]
    end

    subgraph Supporting Infrastructure
        CDN[Content Delivery Network]
        Cache[Caching Layer (e.g., Redis)]
        MessageQueue[Message Queue (e.g., RabbitMQ/Kafka for async tasks)]
        LoggingMonitoring[Logging & Monitoring System]
    end

    Client Tier -->|HTTPS/WSS| APIGateway
    APIGateway -->|HTTP/gRPC| Backend Services
    
    CurriculumService --> ContentGenAI
    TutorOrchestrationService --> TutoringAI
    AssessmentService --> ProctoringAI
    AssessmentService --> GradingAI
    
    Backend Services <--> UserDB
    Backend Services <--> ContentDB
    Backend Services <--> ProgressDB
    AssessmentService --> ExamMediaStorage
    CurriculumService --> ContentMediaStorage

    ContentMediaStorage --> CDN --> Client Tier
```

**4. Frontend Architecture (Flutter)**
*   **State Management:** Riverpod or BLoC/Cubit recommended for scalability and testability.
*   **Routing:** GoRouter for declarative routing.
*   **UI Components:** Develop a custom widget library for consistent theming (navy blue, Apple-esque).
*   **API Client:** `dio` or `http` package for communication with the Go backend. Use code generation for API models (Dart & Go).
*   **Offline Storage:** `sqflite` or `sembast` for caching lesson data. `shared_preferences` for user settings.
*   **Platform Channels:** For accessing native device features (camera, microphone) if not fully handled by Flutter plugins.

**5. Backend Architecture (Go Microservices)**
*   **Framework:** Gin or Echo for building RESTful/gRPC services.
*   **Communication:** gRPC for inter-service communication (performance), REST for client-facing API Gateway.
*   **Containerization:** Docker for all services.
*   **Orchestration:** Kubernetes (K8s) for deployment, scaling, and management.
*   **Authentication Service:** Handles user registration, login, JWT generation/validation.
*   **User & Profile Service:** Manages user data, preferences, curriculum selection.
*   **Curriculum & Content Service:** Serves lesson content, interacts with Content Generation AI, manages curriculum metadata.
*   **Progress Tracking Service:** Stores and retrieves student progress, badges, streaks, scores.
*   **Assessment & Proctoring Orchestration Service:** Manages exam sessions, interacts with Proctoring AI and Grading AI, stores exam media securely.
*   **AI Tutor Orchestration Service:** Manages chat sessions, routes queries to Tutoring AI, handles context.
*   **Notification Service:** Manages in-app and email notifications (async via Message Queue).

**6. AI Services Layer**
*   **Deployment:** AI models can be deployed as separate services (e.g., Python/Flask/FastAPI containers on K8s) or accessed via third-party APIs (e.g., Hugging Face Inference, OpenAI, specialized providers).
*   **Content Generation AI:** RAG-based system. Requires vector database (e.g., Pinecone, Weaviate) for semantic search over curated educational content.
*   **Tutoring AI:** LLMs fine-tuned on Socratic dialogue, educational Q&A. Context window management is critical.
*   **Proctoring AI:** VLM models. Requires robust video/audio streaming infrastructure to the AI service.
*   **Grading AI:** LLMs fine-tuned for evaluating text based on rubrics.

**7. Data Tier**
*   **User Database (Relational - e.g., PostgreSQL):** Stores user accounts, profiles, institutional data.
*   **Content Metadata Database (Relational or NoSQL - e.g., PostgreSQL/MongoDB):** Stores curriculum structure, lesson metadata, links to media assets.
*   **Progress & Analytics Database (Time-series or Columnar - e.g., TimeScaleDB, ClickHouse):** Optimized for storing and querying large volumes of student interaction and performance data.
*   **Secure Exam Media Storage (Object Storage - e.g., AWS S3 Glacier/Deep Archive):** For long-term, secure, and cost-effective storage of proctoring recordings, with strict access controls and lifecycle policies.
*   **Lesson Media Storage (Object Storage - e.g., AWS S3, Cloudflare R2):** For videos, images, interactive files. Served via CDN.

**8. Supporting Infrastructure**
*   **CDN:** For fast delivery of static assets and lesson media.
*   **Caching (Redis/Memcached):** For frequently accessed data (session info, popular content) to reduce database load.
*   **Message Queue (RabbitMQ/Kafka):** For decoupling services and handling asynchronous tasks (notifications, background processing of analytics).
*   **Logging & Monitoring (ELK Stack, Prometheus/Grafana):** Centralized logging, performance monitoring, and alerting.

---

### Document 3: Data Model & Database Design (Initial Outline)

*(This section would typically include ERDs (Entity-Relationship Diagrams). Here's a textual outline.)*

**Key Entities:**

1.  **User:**
    *   `user_id` (PK), `email`, `password_hash`, `display_name`, `role` (student, educator, admin), `created_at`, `updated_at`, `is_verified`, `oauth_provider_id`, `profile_picture_url`.
2.  **StudentProfile:**
    *   `student_profile_id` (PK), `user_id` (FK), `current_curriculum_id` (FK), `current_grade_level`, `points`, `parent_guardian_id` (FK, nullable).
3.  **Curriculum:**
    *   `curriculum_id` (PK), `name` (e.g., "US Common Core Grade 10 Math"), `description`, `country_code`, `education_system`, `grade_level`, `subject`.
4.  **Course:**
    *   `course_id` (PK), `curriculum_id` (FK), `title`, `description`, `sequence_order`.
5.  **Lesson:**
    *   `lesson_id` (PK), `course_id` (FK), `title`, `sequence_order`.
6.  **LessonModule:**
    *   `module_id` (PK), `lesson_id` (FK), `module_type` (text, video, quiz, game), `content_data` (JSON or link to external content), `sequence_order`, `estimated_duration`.
7.  **StudentLessonProgress:**
    *   `progress_id` (PK), `student_profile_id` (FK), `lesson_id` (FK), `status` (not_started, in_progress, completed), `last_accessed_module_id` (FK), `completed_at`.
8.  **QuizAttempt:**
    *   `attempt_id` (PK), `student_profile_id` (FK), `module_id` (FK representing quiz), `score`, `answers_data` (JSON), `submitted_at`.
9.  **HomeworkAssignment:**
    *   `assignment_id` (PK), `course_id` (FK) or `lesson_id` (FK), `title`, `due_date`.
10. **HomeworkSubmission:**
    *   `submission_id` (PK), `assignment_id` (FK), `student_profile_id` (FK), `submission_data` (JSON or file links), `grade`, `feedback_text`, `submitted_at`, `graded_at`.
11. **Exam:**
    *   `exam_id` (PK), `course_id` (FK) or `curriculum_id` (FK), `title`, `duration_minutes`.
12. **ExamAttempt:**
    *   `exam_attempt_id` (PK), `exam_id` (FK), `student_profile_id` (FK), `score`, `answers_data`, `proctoring_session_id` (FK), `start_time`, `end_time`.
13. **ProctoringSession:**
    *   `proctoring_session_id` (PK), `student_profile_id` (FK), `exam_attempt_id` (FK linking back), `video_recording_url`, `audio_recording_url`, `flags_detected` (JSON array of {timestamp, type, severity}), `integrity_score`, `status` (active, completed, reviewed).
14. **Badge:**
    *   `badge_id` (PK), `name`, `description`, `icon_url`, `criteria` (JSON).
15. **StudentBadge:**
    *   `student_badge_id` (PK), `student_profile_id` (FK), `badge_id` (FK), `earned_at`.
16. **TutorSessionLog:**
    *   `log_id` (PK), `student_profile_id` (FK), `start_time`, `end_time`, `transcript` (JSON of user/AI messages), `topics_discussed`.

**Relationships:** Standard one-to-many and many-to-many relationships will be defined (e.g., User has one StudentProfile, Curriculum has many Courses, Student can earn many Badges).

---

### Document 4: AI Model Integration & Requirements

**1. Content Generation/Adaptation AI**
*   **Input:** Curriculum topic, learning objectives, target grade level, desired module type (text, quiz, game concept).
*   **Process:** RAG system retrieves relevant information from vetted educational databases and open resources. LLM adapts, structures, and generates content based on pedagogical templates. Human oversight for quality control.
*   **Output:** Structured content data (JSON/Markdown) for `LessonModule`.
*   **Requirements:** Access to large corpus of educational material, high-quality LLM for generation and adaptation, vector database for RAG. Multilingual output capability.

**2. Tutoring AI**
*   **Input:** User query (text/voice), conversational history, current learning context (lesson, recent performance), student's inferred learning style/gaps.
*   **Process:** LLM specialized in Socratic dialogue and subject matter expertise. Manages context, generates empathetic and guiding responses.
*   **Output:** Text/voice responses, suggestions for practice problems, links to relevant resources.
*   **Requirements:** Low-latency LLM for real-time interaction, robust NLU, ability to integrate context.

**3. Proctoring AI (VLM)**
*   **Input:** Live (or near real-time buffered) video/audio stream from student's device. Reference identity data (e.g., photo).
*   **Process:** VLM analyzes visual feed for: presence of student, absence of others, gaze direction, use of unauthorized materials (phones, books), unusual head movements. Audio analysis for spoken words or presence of other voices.
*   **Output:** Real-time flags/alerts for suspicious events (timestamp, type, severity). Post-session integrity score and summary report.
*   **Requirements:** High-throughput VLM capable of processing video streams. Secure streaming infrastructure.

**4. Automated Grading AI (for subjective text)**
*   **Input:** Student's textual answer, question prompt, pre-defined rubric or ideal answer components.
*   **Process:** LLM evaluates submission against rubric criteria, checks for keywords, assesses coherence, and identifies factual accuracy.
*   **Output:** Numerical score (or grade category) and textual feedback explaining the assessment.
*   **Requirements:** LLM fine-tuned for text evaluation and rubric adherence.

---

### Document 5: API Specification (Core Endpoints - Initial Draft)

*(Using OpenAPI/Swagger style for conceptual illustration. Actual implementation would use a tool like Swagger Editor or Postman.)*

**Base URL:** `/api/v1`

**Authentication:** JWT Bearer Token in Authorization header for protected routes.

**1. Authentication (`/auth`)**
*   `POST /auth/register` - Student registration.
*   `POST /auth/login` - User login, returns JWT.
*   `POST /auth/refresh_token` - Refreshes JWT.
*   `POST /auth/forgot_password` - Initiates password reset.
*   `POST /auth/reset_password` - Completes password reset with token.

**2. User & Profile (`/users`)**
*   `GET /users/me` - Get current user's profile.
*   `PUT /users/me` - Update current user's profile (name, curriculum choice).
*   `POST /users/me/change_password` - Change password for logged-in user.
*   `DELETE /users/me` - Request account deletion.

**3. Curriculum & Content (`/curricula`, `/courses`, `/lessons`)**
*   `GET /curricula` - List available curricula (hierarchical).
*   `GET /curricula/{curriculum_id}/courses` - List courses for a curriculum.
*   `GET /courses/{course_id}/lessons` - List lessons for a course.
*   `GET /lessons/{lesson_id}/modules` - Get modules for a lesson.
*   `POST /lessons/{lesson_id}/progress` - Update lesson progress (e.g., module completion).

**4. AI Tutor (`/tutor`)**
*   `POST /tutor/chat` - Send message to AI tutor, receive response (could be WebSocket endpoint for real-time).
    *   Request: `{ "session_id": "...", "message": "...", "context": { "current_lesson_id": "..." } }`
    *   Response: `{ "session_id": "...", "response_message": "..." }`

**5. Assessments (`/assessments`)**
*   `GET /homework/{assignment_id}` - Get homework details.
*   `POST /homework/{assignment_id}/submit` - Submit homework.
*   `GET /homework/submissions/{submission_id}` - Get homework submission result/feedback.
*   `POST /exams/{exam_id}/start` - Start a proctored exam session, returns `proctoring_session_id`.
*   `POST /exams/proctoring/{proctoring_session_id}/event` - (Internal from client proctoring agent) Send proctoring event data/stream chunk.
*   `POST /exams/{exam_id}/attempts/{attempt_id}/submit_answer` - Submit answer for an exam question.
*   `POST /exams/attempts/{attempt_id}/finish` - Finalize exam attempt.
*   `GET /exams/attempts/{attempt_id}/result` - Get exam result and proctoring report.

**6. Motivation (`/engagement`)**
*   `GET /engagement/badges` - Get user's earned badges.
*   `GET /engagement/points` - Get user's total points.
*   `GET /engagement/streaks` - Get user's current learning streak.
*   `GET /engagement/leaderboards` - Get (opt-in) leaderboard data.

