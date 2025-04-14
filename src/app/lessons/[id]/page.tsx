import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Chat from '@/components/Chat';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import RatingStars from '@/components/RatingStars';
import { Lesson } from '@/types/lesson';
import { useRole } from '@/hooks/useRole';
import toast from 'react-hot-toast';

function LessonDetailContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const { isAdmin, isTeacher } = useRole();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!params.id) return;

      try {
        const lessonDoc = await getDoc(doc(db, 'lessons', params.id));
        if (!lessonDoc.exists()) {
          setError('Урок не найден');
          setLoading(false);
          return;
        }

        const lessonData = lessonDoc.data() as Lesson;
        setLesson(lessonData);
        setIsEnrolled(lessonData.enrolledUsers?.includes(user?.uid || '') || false);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке урока');
        setLoading(false);
      }
    };

    fetchLesson();
  }, [params.id, user?.uid]);

  const handleEnroll = async () => {
    if (!lesson || !user) return;

    try {
      await updateDoc(doc(db, 'lessons', lesson.id), {
        enrolledUsers: arrayUnion(user.uid),
      });
      setIsEnrolled(true);
      toast.success('Вы успешно записались на урок!');
    } catch (err) {
      toast.error('Ошибка при записи на урок');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !lesson) {
    return (
      <Layout>
        <div className="text-center text-red-600">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
              <div className="text-gray-500 mb-4">
                Создано: {new Date(lesson.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <RatingStars rating={lesson.averageRating || 0} size="lg" />
              <span className="text-gray-500">
                ({lesson.reviewsCount || 0} отзывов)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              {lesson.category}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {lesson.format}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{lesson.shortDescription}</p>
          <div className="prose max-w-none mb-6">
            {lesson.detailedDescription}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Максимум участников</h3>
              <p>{lesson.maxStudents}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Записано</h3>
              <p>{lesson.enrolledUsers?.length || 0}</p>
            </div>
          </div>

          {lesson.scheduledTime && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Время проведения</h3>
              <p>{new Date(lesson.scheduledTime).toLocaleString()}</p>
            </div>
          )}

          <button
            onClick={handleEnroll}
            disabled={isEnrolled || (lesson.enrolledUsers?.length || 0) >= lesson.maxStudents}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isEnrolled
                ? 'bg-gray-400 cursor-not-allowed'
                : (lesson.enrolledUsers?.length || 0) >= lesson.maxStudents
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isEnrolled
              ? 'Вы уже записаны'
              : (lesson.enrolledUsers?.length || 0) >= lesson.maxStudents
              ? 'Мест нет'
              : 'Записаться на урок'}
          </button>
        </div>

        {isEnrolled && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">Обсуждение урока</h2>
              <Chat lessonId={lesson.id} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Отзывы</h2>
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {showReviews ? 'Скрыть отзывы' : 'Показать отзывы'}
                </button>
              </div>

              {showReviews && (
                <>
                  <ReviewForm
                    lessonId={lesson.id}
                    userId={user?.uid || ''}
                    onReviewSubmitted={() => setShowReviews(true)}
                  />
                  <div className="mt-8">
                    <ReviewList lessonId={lesson.id} />
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </motion.div>
    </Layout>
  );
}

export default function LessonDetail({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <LessonDetailContent params={params} />
    </ProtectedRoute>
  );
} 