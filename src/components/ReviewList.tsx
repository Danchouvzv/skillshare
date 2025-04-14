import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { useFirebaseError } from '@/hooks/useFirebaseError';
import RatingStars from './RatingStars';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { Review } from '@/types/review';

interface ReviewListProps {
  lessonId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ lessonId }) => {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const { handleError } = useFirebaseError();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'lessons', lessonId, 'reviews'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
      setLoading(false);
    }, (error) => {
      handleError(error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [lessonId, handleError]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'lessons', lessonId, 'reviews', reviewId));
      toast.success('Отзыв успешно удален');
    } catch (error) {
      handleError(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Пока нет отзывов. Будьте первым!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {review.userId.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <RatingStars rating={review.rating} size="sm" />
                <p className="text-sm text-gray-500 mt-1">
                  {format(review.createdAt.toDate(), 'd MMMM yyyy', { locale: ru })}
                </p>
              </div>
            </div>
            {(user?.uid === review.userId || isAdmin) && (
              <button
                onClick={() => handleDeleteReview(review.id)}
                className="text-red-500 hover:text-red-700"
              >
                Удалить
              </button>
            )}
          </div>
          <p className="mt-4 text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 