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
  icon: string; // Lucide icon name
  color: string; // Tailwind class
}
