import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { doc, collection, addDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useFirebaseError } from '@/hooks/useFirebaseError';
import RatingStars from './RatingStars';
import toast from 'react-hot-toast';
import { ReviewFormData } from '@/types/review';

interface ReviewFormProps {
  lessonId: string;
  userId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ lessonId, userId, onReviewSubmitted }) => {
  const { handleError } = useFirebaseError();
  const [rating, setRating] = useState(0);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ReviewFormData>();

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast.error('Пожалуйста, поставьте оценку');
      return;
    }

    try {
      // Add review to subcollection
      const reviewRef = await addDoc(collection(db, 'lessons', lessonId, 'reviews'), {
        userId,
        rating,
        comment: data.comment,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update lesson's review stats
      const lessonRef = doc(db, 'lessons', lessonId);
      await updateDoc(lessonRef, {
        reviewsCount: increment(1),
        averageRating: increment(rating),
      });

      toast.success('Отзыв успешно добавлен!');
      reset();
      setRating(0);
      onReviewSubmitted();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Оценка
        </label>
        <RatingStars
          rating={rating}
          onRatingChange={setRating}
          interactive
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Комментарий
        </label>
        <textarea
          id="comment"
          {...register('comment', { required: 'Пожалуйста, напишите комментарий' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          rows={4}
          placeholder="Поделитесь своим мнением об уроке..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
      </button>
    </form>
  );
};

export default ReviewForm; 