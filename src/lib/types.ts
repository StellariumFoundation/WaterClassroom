/**
 * Water Classroom - Types & Interfaces
 */

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  curriculum: string; // 'creed' | 'scitech' | 'business' | 'dynamics'
  description: string;
  content: string; // Markdown study guide
  durationMin: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
  pointsToAward: number;
}

export interface StudentProgress {
  points: number;
  streakDays: number;
  level: number;
  completedLessons: string[]; // Lesson IDs
  unlockedBadges: string[]; // Badge keys
  lastActiveDate: string; // YYYY-MM-DD
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string; // 'Policy' | 'Tech' | 'Philanthropy' | 'Community'
  rewardPoints: number;
  status: 'Open' | 'In Progress' | 'Completed';
  assignee: string | null;
  createdBy: string;
  backersCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  timestamp: string;
}

export interface Badge {
  key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface CurriculumTrack {
  id: string;
  country_code: string;
  country_name: string;
  grade_level: string;
  track_type: 'country_standard' | 'homeschool_fallback';
  display_name: string;
  lesson_ids: string[];
  is_default: boolean;
}

export interface LessonDetail {
  id: string;
  external_id?: string;
  title: string;
  description: string;
  subject: string;
  grade_level: string;
  lesson_type: 'content' | 'game' | 'assessment';
  estimated_minutes: number;
  content_ref: string;
  quiz_ref: string;
}

export interface Exam {
  id: string;
  track_id: string;
  lesson_id: string;
  is_proctored: boolean;
  duration_seconds: number;
  passing_score: number;
  is_verified: boolean;
}

export interface ExamAttempt {
  id: string;
  student_id: string;
  exam_id: string;
  score: number | null;
  max_score: number;
  proctor_flags: Array<{ type: string; severity: string; timestamp: string }>;
  camera_authorized: boolean;
  identity_scan_ref: string;
  status: 'not_started' | 'in_progress' | 'flagged' | 'verified' | 'voided';
  started_at: string | null;
  completed_at: string | null;
}

export interface Tutor {
  id: string;
  institution_id: string;
  name: string;
  email: string;
  subjects: string[];
  grade_levels: string[];
}

export interface Institution {
  id: string;
  name: string;
  representative_name: string;
  country: string;
  grade_range: string;
  billing_cycle: string;
  student_volume: number;
}

export interface InstitutionAdmin {
  id: string;
  user_id: string;
  institution_id: string;
  role: 'admin' | 'super_admin';
}

export interface InstitutionCurriculumOverride {
  id: string;
  institution_id: string;
  grade_level: string;
  subject: string;
  ordered_lesson_ids: string[];
  created_by: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  author_name: string;
  author_level: number;
  title: string;
  content: string;
  likes: number;
  replies: number;
  category: string;
  grade_level: string;
  moderation_status: 'pending' | 'approved' | 'removed';
  created_at: string;
}

export interface LessonComponent {
  hash: string;
  title: string;
  subject: string;
  grade: string;
  componentPath: string;
  estimatedMinutes: number;
  interactiveType: 'phaser-game' | 'quiz' | 'scenario';
}
