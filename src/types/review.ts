import { Timestamp } from 'firebase/firestore';

export interface Review {
  id: string;
  userId: string;
  lessonId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface ReviewStats {
  averageRating: number;
  reviewsCount: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
} 