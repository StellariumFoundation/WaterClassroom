
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  selectedCurriculumId?: string;
  progress?: UserProgress;
  subscription?: SubscriptionDetails;
  badges?: Badge[];
  streak?: number;
  points?: number;
  role?: string; // Added role
  accessToken?: string; // Added accessToken
  refreshToken?: string; // Added refreshToken
}

export interface UserProgress {
  completedLectures: string[]; // array of lecture IDs
  assessmentScores: Record<string, number>; // assessmentId: score
  overallProgress?: number; // percentage
}

export interface SubscriptionDetails {
  planName: string; // e.g., "Monthly", "Yearly", "Free Trial"
  isActive: boolean;
  expiryDate?: string; // ISO date string
}

export interface Curriculum {
  id: string;
  name: string;
  description: string;
  subjects: Subject[];
  targetAudience: string; // e.g., "K-12", "Grade 9-10", "Undergraduate Computer Science"
}

export interface Subject {
  id: string;
  name: string;
  lectures: Lecture[];
  assessments?: Assessment[];
}

export interface Lecture {
  id: string;
  title: string;
  subjectId: string;
  type: 'text' | 'video' | 'interactive' | 'game_placeholder';
  content: string; // For text, this is the main content. For video, URL. For interactive, could be JSON config or description.
  estimatedDurationMinutes?: number;
  aiGenerated?: boolean;
  imagePlaceholderUrl?: string;
}

export interface Assessment {
  id: string;
  title: string;
  subjectId: string;
  type: 'homework' | 'quiz' | 'exam';
  description: string;
  questions?: AssessmentQuestion[]; // For AI generation or display
  requiresProctoring?: boolean;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple_choice' | 'short_answer' | 'essay';
  options?: string[]; // For multiple_choice
  correctAnswer?: string; // Can be complex for AI grading
}


export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
  // Fix: Add optional groundingMetadata property to ChatMessage
  groundingMetadata?: GroundingChunk[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string; // URL or placeholder for SVG
  dateEarned?: string; // ISO date string
}

export enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}
export interface GroundingChunk {
  web: GroundingChunkWeb;
}
export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

// For Gemini API responses that might include grounding metadata
export interface GeminiApiResponse {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

// API Response types (matching backend)
export interface RegisterResponse {
  id: string; // uuid.UUID will be a string
  email: string;
  display_name: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user_id: string; // uuid.UUID will be a string
  email: string;
  display_name: string;
  role: string;
}