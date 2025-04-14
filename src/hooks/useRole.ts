import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'admin' | 'teacher' | 'student';

interface UserData {
  role: UserRole;
  points?: number;
  badges?: string[];
}

export const useRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as UserData;
          setUserData(data);
          setRole(data.role);
        } else {
          setRole('student');
          setUserData({ role: 'student', points: 0, badges: [] });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user role:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher' || isAdmin;
  const isStudent = role === 'student';

  return {
    role,
    isAdmin,
    isTeacher,
    isStudent,
    userData,
    loading,
  };
}; 