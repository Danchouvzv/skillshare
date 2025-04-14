SkillShare KZ
SkillShare KZ — это веб-приложение на Next.js + Firebase, позволяющее школьникам и студентам создавать и проходить уроки, общаться, оставлять отзывы и развиваться сообща. Проект сочетает функционал онлайн-курсов, системы рейтинга, чата и геймификации, чтобы максимизировать вовлечённость и эффективность обучения.




Основные особенности
Каталог уроков

Фильтрация по категориям и формату проведения (sync / async)

Просмотр детальной информации о каждом уроке: описание, рейтинг, отзывы

Регистрация и авторизация

Firebase Authentication (Email/Password, Google OAuth)

Ролевая система (admin, teacher, student)

Отзывы и рейтинг

Пользователи могут оставлять отзывы о пройденных уроках (1–5 звёзд)

Средняя оценка выводится на карточке урока

Система удаления отзывов для автора или админа

Чат

Реальный чат в режиме реального времени (Firestore subcollection)

Доступен только записанным ученикам

Уведомления о новых сообщениях (опционально через Firebase Cloud Messaging)

Геймификация (опционально)

Начисление очков (points) за активность и достижения

Бейджи за прохождение уроков, написание отзывов, создание контента

Лидерборд с топ-участниками

Админ-панель (опционально)

Управление уроками, пользователями, модерация контента

Изменение ролей пользователей (student ↔ teacher ↔ admin)

Стек технологий
Frontend: Next.js (App Router) + TypeScript

UI: Tailwind CSS, Framer Motion (анимации)

Icons: react-icons или Font Awesome

Backend: Firebase

Auth — регистрация и вход

Firestore — хранение уроков, отзывов, чатов

Storage (опционально) — хранение медиафайлов (PDF/изображения/видео)

Cloud Functions (опционально) — бизнес-логика (геймификация, уведомления)

Уведомления: Firebase Cloud Messaging (опционально)

Валидация форм: react-hook-form

Уведомления (UI): react-hot-toast

Установка и запуск
Ниже приведены инструкции для локального запуска. Предполагается, что у вас установлены Node.js и npm или yarn.

Клонируйте репозиторий:

bash
Копировать
Редактировать
git clone https://github.com/<your-username>/skillshare-kz.git
cd skillshare-kz
Установите зависимости:

bash
Копировать
Редактировать
npm install
# или
yarn install
Настройте переменные окружения
Создайте файл .env.local в корне проекта (или .env) и укажите ключи Firebase:

bash
Копировать
Редактировать
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
Убедитесь, что .env* добавлены в .gitignore, чтобы не хранить ключи публично.

Запуск в режиме разработки:

bash
Копировать
Редактировать
npm run dev
# или
yarn dev
По умолчанию, приложение будет доступно по адресу: http://localhost:3000

Сборка и запуск на продакшен:

bash
Копировать
Редактировать
npm run build
npm run start
(Команда build создаёт оптимизированную сборку, а start запускает её.)

Использование
1. Регистрация и вход
Перейдите на /register или /login.

Заполните необходимые поля. После входа вы будете перенаправлены на страницу профиля или главную.

2. Создание урока
Авторизуйтесь под учителем (teacher) или админом (admin).

На /lessons/create заполните форму (название, описание, формат) и сохраните.

3. Просмотр каталога
На /catalog вы найдёте список всех уроков.

Можно искать уроки по категории, формату и ключевым словам.

4. Запись на урок
На странице урока нажмите «Записаться», если ещё есть свободные места.

Получите доступ к чату и материалам.

5. Оставление отзыва
Пройдя урок, откройте вкладку «Отзывы» и заполните форму (рейтинг + комментарий).

6. Админ-панель (при наличии)
Если у вас роль admin, вы можете зайти на /admin для управления пользователями, уроками и жалобами.

Firebase Security Rules
Для корректной защиты данных в Firestore следует задать Security Rules:

plaintext
Копировать
Редактировать
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Примеры хелпер-функций:
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    ...
    
    // Пример: защита коллекции lessons
    match /lessons/{lessonId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.teacherId) || isAdmin();
      allow delete: if isOwner(resource.data.teacherId) || isAdmin();
      
      // Подколлекция отзывов
      match /reviews/{reviewId} {
        allow read: if isAuthenticated();
        allow create: if isEnrolled(lessonId);
        ...
      }
    }
  }
}
Настройте правила под вашу конкретную бизнес-логику и роли.

Структура проекта
bash
Копировать
Редактировать
skillshare-kz/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx       # Global layout (Next.js App Router)
│  │  ├─ page.tsx         # Landing page
│  │  ├─ catalog/
│  │  ├─ lessons/
│  │  ├─ login/
│  │  ├─ register/
│  │  └─ profile/
│  ├─ components/
│  │  ├─ Layout.tsx
│  │  ├─ RatingStars.tsx
│  │  ├─ ReviewForm.tsx
│  │  ├─ ReviewList.tsx
│  │  ├─ Chat.tsx
│  │  └─ ...
│  ├─ contexts/
│  │  └─ AuthContext.tsx
│  ├─ hooks/
│  │  ├─ useAuth.ts
│  │  ├─ useRole.ts
│  │  └─ useFirebaseError.ts
│  ├─ lib/
│  │  └─ firebase.ts
│  ├─ types/
│  │  ├─ lesson.ts
│  │  └─ review.ts
│  └─ ...
├─ .env.local             # Секретные ключи Firebase
├─ .gitignore
├─ package.json
└─ README.md
Готовые задачи / TODO
[ ] Подключить геймификацию (баллы, бейджи, лидерборд)

[ ] Настроить уведомления через FCM (push messages)

[ ] Создать полноценную админ-панель /admin

[ ] Интегрировать расширенный поиск (через Algolia или Firestore индексы)

[ ] Добавить поддержку нескольких языков (i18n)

Вклад
Мы приветствуем вклад сообщества. Если вы хотите внести изменения:

Форкните репозиторий

Создайте ветку: git checkout -b feature/new-amazing-feature

Внесите правки

Сделайте Pull Request, описав, какие задачи решает ваш PR

Лицензия
Этот проект распространяется под лицензией MIT (или другой на ваше усмотрение). Подробности читайте в файле LICENSE.

Контакт


Email: talgatovdaniyal@gmail.com



Будем рады любым вопросам, предложениям и идеям по развитию SkillShare KZ!







