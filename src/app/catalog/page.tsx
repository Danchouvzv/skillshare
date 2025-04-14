import { useState } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

// Mock data for demonstration
const mockLessons = [
  {
    id: '1',
    title: 'Основы программирования на Python',
    shortDesc: 'Научись основам Python за 5 уроков',
    category: 'IT',
    rating: 4.8,
    teacher: 'Алишер',
    format: 'sync',
    scheduledAt: '2024-03-15T18:00:00',
  },
  {
    id: '2',
    title: 'Английский для начинающих',
    shortDesc: 'Разговорный английский с нуля',
    category: 'Языки',
    rating: 4.5,
    teacher: 'Мария',
    format: 'async',
  },
  // Add more mock lessons as needed
];

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', 'IT', 'Языки', 'Наука', 'Творчество'];

  const filteredLessons = mockLessons.filter((lesson) => {
    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900">Каталог уроков</h1>
          
          {/* Search and Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Поиск уроков..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'Все' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                      {lesson.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {lesson.format === 'sync' ? 'Синхронный' : 'Асинхронный'}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">
                    {lesson.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{lesson.shortDesc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-gray-600">{lesson.rating}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Учитель: {lesson.teacher}</span>
                  </div>
                  {lesson.format === 'sync' && lesson.scheduledAt && (
                    <div className="mt-4 text-sm text-gray-500">
                      Начало: {new Date(lesson.scheduledAt).toLocaleString()}
                    </div>
                  )}
                  <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                    Записаться
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
} 