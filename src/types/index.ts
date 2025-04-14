export type UserRole = 'user' | 'admin';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: UserRole;
  bio: string;
  city: string;
  classGrade: string;
  skills: string[];
  points: number;
  createdAt: Date;
}

export type LessonFormat = 'sync' | 'async';

export interface Lesson {
  lessonId: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  teacherId: string;
  category: string;
  format: LessonFormat;
  scheduledAt?: Date;
  maxStudents: number;
  enrolledUsers: string[];
  rating: number;
  createdAt: Date;
}

export interface Review {
  reviewId: string;
  lessonId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ChatMessage {
  messageId: string;
  text: string;
  senderId: string;
  timestamp: Date;
  files?: string[];
} 