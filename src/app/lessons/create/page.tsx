import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

function CreateLessonContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    detailedDesc: '',
    category: '',
    format: 'sync',
    maxStudents: 10,
    scheduledAt: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const lessonId = crypto.randomUUID();
      await setDoc(doc(db, 'lessons', lessonId), {
        lessonId,
        title: formData.title,
        shortDesc: formData.shortDesc,
        detailedDesc: formData.detailedDesc,
        teacherId: user.uid,
        category: formData.category,
        format: formData.format,
        maxStudents: Number(formData.maxStudents),
        enrolledUsers: [],
        rating: 0,
        createdAt: new Date(),
        ...(formData.format === 'sync' && { scheduledAt: new Date(formData.scheduledAt) }),
      });

      router.push(`/lessons/${lessonId}`);
    } catch (error) {
      setError('Ошибка при создании урока. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Создать новый урок</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Название урока
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  maxLength={60}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700">
                  Краткое описание
                </label>
                <input
                  type="text"
                  id="shortDesc"
                  name="shortDesc"
                  required
                  maxLength={200}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.shortDesc}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="detailedDesc" className="block text-sm font-medium text-gray-700">
                  Подробное описание
                </label>
                <textarea
                  id="detailedDesc"
                  name="detailedDesc"
                  rows={4}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.detailedDesc}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Категория
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Выберите категорию</option>
                    <option value="IT">IT</option>
                    <option value="Языки">Языки</option>
                    <option value="Наука">Наука</option>
                    <option value="Творчество">Творчество</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                    Формат проведения
                  </label>
                  <select
                    id="format"
                    name="format"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.format}
                    onChange={handleChange}
                  >
                    <option value="sync">Синхронный (в реальном времени)</option>
                    <option value="async">Асинхронный (материалы + чат)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700">
                    Максимальное количество участников
                  </label>
                  <input
                    type="number"
                    id="maxStudents"
                    name="maxStudents"
                    min="1"
                    max="50"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.maxStudents}
                    onChange={handleChange}
                  />
                </div>

                {formData.format === 'sync' && (
                  <div>
                    <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
                      Дата и время проведения
                    </label>
                    <input
                      type="datetime-local"
                      id="scheduledAt"
                      name="scheduledAt"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.scheduledAt}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Создать урок
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

export default function CreateLesson() {
  return (
    <ProtectedRoute>
      <CreateLessonContent />
    </ProtectedRoute>
  );
} 