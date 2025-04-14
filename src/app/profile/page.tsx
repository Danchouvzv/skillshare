import { useState } from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock user data
const mockUser = {
  name: 'Алишер',
  email: 'alisher@example.com',
  city: 'Алматы',
  classGrade: '11 класс',
  bio: 'Люблю программирование и преподавание. Специализируюсь на Python и веб-разработке.',
  points: 150,
  skills: ['Python', 'JavaScript', 'Web Development'],
  createdLessons: 5,
  completedLessons: 12,
};

function ProfileContent() {
  const [activeTab, setActiveTab] = useState<'info' | 'created' | 'completed'>('info');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {mockUser.name[0]}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{mockUser.name}</h3>
                <p className="text-sm text-gray-500">{mockUser.email}</p>
                <div className="mt-2 flex items-center">
                  <span className="px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                    {mockUser.points} баллов
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {[
                { id: 'info', label: 'Информация' },
                { id: 'created', label: 'Созданные уроки' },
                { id: 'completed', label: 'Пройденные уроки' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'info' | 'created' | 'completed')}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="px-4 py-5 sm:p-6">
            {activeTab === 'info' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Основная информация</h4>
                    <dl className="mt-4 space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Город</dt>
                        <dd className="mt-1 text-sm text-gray-900">{mockUser.city}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Класс</dt>
                        <dd className="mt-1 text-sm text-gray-900">{mockUser.classGrade}</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Навыки</h4>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {mockUser.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900">О себе</h4>
                  <p className="mt-2 text-sm text-gray-600">{mockUser.bio}</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'created' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500">Создано уроков: {mockUser.createdLessons}</p>
                {/* Здесь будет список созданных уроков */}
              </motion.div>
            )}

            {activeTab === 'completed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500">Пройдено уроков: {mockUser.completedLessons}</p>
                {/* Здесь будет список пройденных уроков */}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
} 