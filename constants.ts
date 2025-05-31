
export const APP_NAME = "Water Classroom";
export const API_KEY_INSTRUCTION = "Please ensure your GEMINI_API_KEY is set as an environment variable (e.g., process.env.API_KEY). This app requires it to function.";
export const API_BASE_URL = "http://localhost:8080"; // Added API Base URL

export enum APP_ROUTES {
  HOME = '/',
  LOGIN = '/login', // Kept for clarity, AuthPage handles both
  AUTH = '/auth',
  OAUTH_CALLBACK = '/auth/oauth-callback', // Added OAuth callback route
  ONBOARDING = '/onboarding', // Added Onboarding route
  DASHBOARD = '/dashboard',
  CURRICULUM_SELECT = '/curriculum',
  LECTURE = '/lecture', // e.g. /lecture/:lectureId
  TUTOR = '/tutor',
  ASSESSMENT = '/assessment', // e.g. /assessment/:assessmentId
  PROFILE = '/profile',
  SETTINGS = '/settings',
  LEADERBOARD = '/leaderboard',
}

export const MOCK_CURRICULA_DATA = [
  {
    id: 'common-core-math-g9',
    name: 'U.S. Common Core - Math Grade 9',
    description: 'Covers key mathematical concepts for 9th-grade students under the U.S. Common Core standards.',
    targetAudience: 'Grade 9',
    subjects: [
      {
        id: 'algebra-1', name: 'Algebra I', 
        lectures: [
          { id: 'alg1-l1', subjectId: 'algebra-1', title: 'Introduction to Algebra', type: 'text', content: 'Placeholder for AI generated content.' },
          { id: 'alg1-l2', subjectId: 'algebra-1', title: 'Solving Linear Equations', type: 'text', content: 'Placeholder for AI generated content.' },
          { id: 'alg1-l3', subjectId: 'algebra-1', title: 'Graphing Linear Functions', type: 'video', content: 'https://picsum.photos/seed/alg1-l3-video/600/400', imagePlaceholderUrl: 'https://picsum.photos/seed/alg1-l3-video/600/400' },
        ],
        assessments: [
          { id: 'alg1-a1', subjectId: 'algebra-1', title: 'Algebra Basics Quiz', type: 'quiz', description: 'Test your understanding of fundamental algebraic concepts.', requiresProctoring: false }
        ]
      },
      { 
        id: 'geometry-basics', name: 'Geometry Basics',
        lectures: [
          { id: 'geo-l1', subjectId: 'geometry-basics', title: 'Introduction to Geometric Shapes', type: 'interactive', content: 'Placeholder for an interactive module about shapes.' },
        ],
      },
    ]
  },
  {
    id: 'uk-gcse-physics',
    name: 'UK GCSE - Physics',
    description: 'Fundamental physics concepts for students preparing for UK GCSE examinations.',
    targetAudience: 'GCSE Level (Age 14-16)',
    subjects: [
      { 
        id: 'forces-motion', name: 'Forces and Motion',
        lectures: [
          { id: 'fm-l1', subjectId: 'forces-motion', title: "Newton's Laws of Motion", type: 'text', content: 'Placeholder for AI generated content.' },
        ],
      },
    ]
  },
  {
    id: 'ib-history-hl',
    name: 'IB History HL - The Cold War',
    description: 'In-depth study of The Cold War for IB History Higher Level students.',
    targetAudience: 'IB Diploma (Age 16-18)',
    subjects: [
      { 
        id: 'cold-war-origins', name: 'Origins of the Cold War',
        lectures: [
          { id: 'cw-l1', subjectId: 'cold-war-origins', title: 'Post-WWII Geopolitics', type: 'text', content: 'Placeholder for AI generated content.' },
        ],
      },
    ]
  }
];

export const MOCK_BADGES = [
  { id: 'b1', name: 'First Steps', description: 'Completed your first lecture!', iconUrl: 'Star' },
  { id: 'b2', name: 'Curiosity Sparked', description: 'Asked 5 questions to the AI Tutor.', iconUrl: 'HelpCircle' },
  { id: 'b3', name: 'Knowledge Builder', description: 'Completed an entire subject.', iconUrl: 'BookOpen' },
  { id: 'b4', name: 'Streak Starter', description: 'Maintained a 3-day learning streak.', iconUrl: 'TrendingUp' },
];

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
// process.env.API_KEY is expected to be set in the execution environment.
// For local development, you might need to use a .env file and a build tool that supports it (like Vite or Webpack).
// const API_KEY = process.env.API_KEY;
// if (!API_KEY) {
//   console.warn(API_KEY_INSTRUCTION);
// }
