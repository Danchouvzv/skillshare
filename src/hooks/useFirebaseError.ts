import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';

export const useFirebaseError = () => {
  const handleError = (error: unknown) => {
    if (error instanceof FirebaseError) {
      const firebaseError = error as FirebaseError;
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          toast.error('Этот email уже зарегистрирован');
          break;
        case 'auth/invalid-email':
          toast.error('Неверный формат email');
          break;
        case 'auth/weak-password':
          toast.error('Пароль должен содержать минимум 6 символов');
          break;
        case 'auth/wrong-password':
          toast.error('Неверный пароль');
          break;
        case 'auth/user-not-found':
          toast.error('Пользователь не найден');
          break;
        case 'permission-denied':
          toast.error('У вас нет прав для выполнения этого действия');
          break;
        case 'unavailable':
          toast.error('Сервис временно недоступен');
          break;
        default:
          toast.error('Произошла ошибка: ' + firebaseError.message);
      }
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Произошла неизвестная ошибка');
    }
  };

  return { handleError };
}; 