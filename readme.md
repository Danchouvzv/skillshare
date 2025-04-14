# SkillShare KZ

**SkillShare KZ** — это современное образовательное веб-приложение, созданное на базе Next.js и Firebase. Платформа позволяет школьникам и студентам создавать и проходить уроки, общаться, делиться опытом и развиваться вместе. Проект сочетает в себе онлайн-курсы, рейтинги, отзывы, чат и элементы геймификации для повышения вовлечённости в обучение.

---

## 🚀 Основные функции

### 📚 Каталог уроков
- Просмотр всех доступных курсов
- Фильтрация по категориям и формату (синхронный / асинхронный)
- Детальная страница урока с описанием, рейтингом и отзывами

### 🔑 Аутентификация
- Вход через Email/Password и Google OAuth (Firebase Auth)
- Ролевая система: `admin`, `teacher`, `student`

### ⭐ Отзывы и рейтинг
- Пользователи могут оставлять отзывы с рейтингом (1–5 звёзд)
- Средний рейтинг отображается на карточке урока
- Администраторы и авторы могут удалять отзывы

### 💬 Чат участников
- Firestore-based чат в реальном времени
- Доступен только записанным участникам урока
- (Планируется) уведомления о новых сообщениях через FCM

### 🎮 Геймификация *(в разработке)*
- Система баллов (points) за участие
- Бейджи за достижения (создание, прохождение, отзывы)
- Лидерборд /leaderboard

### 🛠 Админ-панель *(в разработке)*
- Управление пользователями, уроками и ролями
- Модерация контента

---

## 🛠 Технологии

- **Frontend**: Next.js (App Router), TypeScript
- **UI**: Tailwind CSS, Framer Motion
- **Icons**: React Icons / FontAwesome
- **Backend**: Firebase
  - Authentication
  - Firestore (курсы, чаты, отзывы)
  - Storage (медиафайлы)
  - Cloud Messaging *(опционально)*
- **Валидация форм**: react-hook-form
- **Уведомления**: react-hot-toast

---

## 📁 Структура проекта

```
skillshare-kz/
├─ src/
│  ├─ app/               # Next.js App Router
│  │  ├─ catalog/
│  │  ├─ lessons/
│  │  ├─ profile/
│  │  ├─ login/
│  │  ├─ register/
│  │  └─ layout.tsx
│  ├─ components/        # UI-компоненты
│  │  ├─ Layout.tsx
│  │  ├─ RatingStars.tsx
│  │  ├─ ReviewForm.tsx
│  │  ├─ ReviewList.tsx
│  │  ├─ Chat.tsx
│  ├─ contexts/
│  │  └─ AuthContext.tsx
│  ├─ hooks/
│  ├─ lib/
│  │  └─ firebase.ts
│  ├─ types/
├─ .env.local            # Firebase переменные
├─ firestore.rules       # Безопасность Firestore
├─ .gitignore
├─ README.md
└─ package.json
```

---

## 📦 Установка и запуск

```bash
# 1. Клонируйте репозиторий
$ git clone https://github.com/Danchouvzv/skillshare.git
$ cd skillshare

# 2. Установите зависимости
$ npm install
# или
$ yarn install

# 3. Добавьте .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# 4. Запуск проекта
$ npm run dev
# или
$ yarn dev

# Доступ по адресу:
http://localhost:3000
```

---

## 🏃 Быстрый старт

1. **Регистрация и вход** — /register, /login
2. **Создание урока** — /lessons/create (доступно teacher/admin)
3. **Каталог и фильтрация** — /catalog
4. **Запись на урок** — на странице урока
5. **Отзывы** — вкладка "Отзывы" после прохождения
6. **Чат** — доступен после записи
7. **Админка** — /admin (только для admin)

---

## 🛡 Firestore Security Rules

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /lessons/{lessonId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
      match /reviews/{reviewId} {
        allow read: if isAuthenticated();
        allow create: if isAuthenticated();
      }
    }
  }
}
```

---

## 🗒 TODO

- [ ] Геймификация (баллы, бейджи, лидерборд)
- [ ] Firebase Cloud Messaging (уведомления)
- [ ] Админ-панель для управления
- [ ] Поиск по ключевым словам (Algolia / Firestore индексы)
- [ ] Поддержка многоязычности (i18n)

---

## 📢 Вклад

Мы открыты к сотрудничеству! Чтобы внести вклад:

```bash
# Форк проекта
$ git clone https://github.com/ваш-аккаунт/skillshare.git
$ git checkout -b feature/my-awesome-feature

# После правок
$ git push origin feature/my-awesome-feature
# И отправьте Pull Request
```

---

## 📄 Лицензия

Проект распространяется под лицензией **MIT**. См. файл `LICENSE`.

---

## 📩 Контакты

**Email:** talgatovdaniyal@gmail.com

> Присоединяйтесь к развитию SkillShare KZ и сделаем обучение увлекательным вместе!

