/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Auth Context:
 * إدارة المصادقة، تسجيل الدخول، إنشاء الحساب، والمزامنة مع Firebase
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  getFirebaseInstances,
  getStoredFirebaseConfig,
  saveStoredFirebaseConfig,
  isFirebaseConfigValid,
  FirebaseConfig
} from '../firebase/config';
import { UserRole } from '../types';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  isFirebaseUser: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isConfigured: boolean;
  firebaseConfig: FirebaseConfig;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, pass: string, fullName: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: (role?: UserRole) => Promise<{ success: boolean; error?: string; isUnauthorizedDomain?: boolean }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  updateCustomFirebaseConfig: (config: FirebaseConfig) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_ROLES_STORAGE_KEY = 'noor_alkamal_user_roles';

function getStoredRoleForUid(_uid: string, _fallbackRole: UserRole = 'SCHOOL_OWNER'): UserRole {
  return 'SCHOOL_OWNER';
}

function saveRoleForUid(uid: string, role: UserRole): void {
  try {
    const raw = localStorage.getItem(USER_ROLES_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[uid] = role;
    localStorage.setItem(USER_ROLES_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

// أخطاء Firebase مترجمة للعربية بوضوح
export function translateFirebaseError(error: unknown): string {
  if (!error) return 'حدث خطأ غير متوقع';
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password')) {
    return 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد الإلكتروني وكلمة المرور';
  }
  if (message.includes('auth/user-not-found')) {
    return 'لا يوجد حساب مسجل بهذا البريد الإلكتروني';
  }
  if (message.includes('auth/email-already-in-use')) {
    return 'هذا البريد الإلكتروني مسجل بالفعل لمستخدم آخر';
  }
  if (message.includes('auth/weak-password')) {
    return 'كلمة المرور ضعيفة جداً. يجب أن تحتوي على 6 خانات على الأقل';
  }
  if (message.includes('auth/invalid-email')) {
    return 'صيغة البريد الإلكتروني غير صالحة';
  }
  if (message.includes('auth/unauthorized-domain')) {
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
    return `نطاق الموقع (${currentHost}) غير مضاف في قائمة النطاقات المعتمدة (Authorized Domains) في لوحة Firebase Console. يرجى إضافة هذا النطاق من قسم Authentication -> Settings -> Authorized domains.`;
  }
  if (message.includes('auth/popup-blocked')) {
    return 'قام المتصفح بحظر النافذة المنبثقة لـ Google. يرجى السماح بالنوافذ المنبثقة (Popups) أو استخدام تسجيل الدخول بالبريد الإلكتروني.';
  }
  if (message.includes('auth/popup-closed-by-user')) {
    return 'تم إغلاق نافذة تسجيل الدخول عبر Google قبل إتمام العملية';
  }
  if (message.includes('auth/operation-not-allowed')) {
    return 'تسجيل الدخول عبر Google غير مفعّل في لوحة Firebase. يرجى الدخول إلى Firebase Console -> Authentication -> Sign-in method وتفعيل خيار Google.';
  }
  if (message.includes('auth/network-request-failed')) {
    return 'فشل الاتصال بالشبكة، يرجى التحقق من اتصالك بالإنترنت';
  }
  if (message.includes('auth/too-many-requests')) {
    return 'تم حظر الدخول مؤقتاً لكثرة المحاولات الفاشلة، يرجى المحاولة بعد قليل';
  }

  return message;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(getStoredFirebaseConfig());
  const [isConfigured, setIsConfigured] = useState<boolean>(isFirebaseConfigValid(firebaseConfig));

  useEffect(() => {
    const { auth, isConfigured: valid } = getFirebaseInstances();
    setIsConfigured(valid);

    if (auth && valid) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const role = 'SCHOOL_OWNER';
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: String(fbUser.displayName || '').includes('اختبار') ? 'مالك المدرسة' : (fbUser.displayName || fbUser.email?.split('@')[0] || 'مالك المدرسة'),
            role,
            photoURL: fbUser.photoURL || undefined,
            isFirebaseUser: true
          });
        } else {
          // فحص الجلسة المحلية لمالك المدرسة
          const demoUserRaw = localStorage.getItem('noor_demo_logged_in');
          if (demoUserRaw) {
            try {
              const parsed = JSON.parse(demoUserRaw);
              setUser({ ...parsed, role: 'SCHOOL_OWNER', displayName: String(parsed.displayName || '').includes('اختبار') ? 'مالك المدرسة' : (parsed.displayName || 'مالك المدرسة') });
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Firebase غير مهيأ بعد — فحص جلسة مالك المدرسة
      const demoUserRaw = localStorage.getItem('noor_demo_logged_in');
      if (demoUserRaw) {
        try {
          const parsed = JSON.parse(demoUserRaw);
          setUser({ ...parsed, role: 'SCHOOL_OWNER', displayName: String(parsed.displayName || '').includes('اختبار') ? 'مالك المدرسة' : (parsed.displayName || 'مالك المدرسة') });
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, [firebaseConfig]);

  // تحديث إعدادات Firebase من قِبل المستخدم
  const updateCustomFirebaseConfig = (newConfig: FirebaseConfig): boolean => {
    saveStoredFirebaseConfig(newConfig);
    setFirebaseConfig(newConfig);
    const valid = isFirebaseConfigValid(newConfig);
    setIsConfigured(valid);
    return valid;
  };

  // تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
  const signInWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const { auth, isConfigured: valid } = getFirebaseInstances();

    if (!valid || !auth) {
      // إذا لم يُدخل المستخدم إعدادات Firebase بعد، نتيح له الدخول التجريبي مع تنبيه
      const mockUser: AppUser = {
        uid: 'local-owner-' + Date.now(),
        email,
        displayName: email.split('@')[0] || 'مالك المدرسة',
        role: 'SCHOOL_OWNER',
        isFirebaseUser: false
      };
      setUser(mockUser);
      localStorage.setItem('noor_demo_logged_in', JSON.stringify(mockUser));
      return { success: true };
    }

    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const role = 'SCHOOL_OWNER';
      setUser({
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: String(cred.user.displayName || '').includes('اختبار') ? 'مالك المدرسة' : (cred.user.displayName || email.split('@')[0] || 'مالك المدرسة'),
        role,
        photoURL: cred.user.photoURL || undefined,
        isFirebaseUser: true
      });
      localStorage.removeItem('noor_demo_logged_in');
      return { success: true };
    } catch (err) {
      console.error('Firebase signIn error:', err);
      return { success: false, error: translateFirebaseError(err) };
    } finally {
      setLoading(false);
    }
  };

  // إنشاء حساب جديد بالبريد الإلكتروني
  const signUpWithEmail = async (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const { auth, isConfigured: valid } = getFirebaseInstances();

    if (!valid || !auth) {
      // وضع تجريبي إذا لم تكن البيانات مدخلة
      const mockUser: AppUser = {
        uid: 'local-owner-' + Date.now(),
        email,
        displayName: fullName,
        role: 'SCHOOL_OWNER',
        isFirebaseUser: false
      };
      setUser(mockUser);
      localStorage.setItem('noor_demo_logged_in', JSON.stringify(mockUser));
      return { success: true };
    }

    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (fullName) {
        await updateProfile(cred.user, { displayName: fullName });
      }
      saveRoleForUid(cred.user.uid, role);
      setUser({
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: fullName || cred.user.email?.split('@')[0] || 'عضو جديد',
        role,
        photoURL: cred.user.photoURL || undefined,
        isFirebaseUser: true
      });
      localStorage.removeItem('noor_demo_logged_in');
      return { success: true };
    } catch (err) {
      console.error('Firebase signUp error:', err);
      return { success: false, error: translateFirebaseError(err) };
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الدخول عبر Google
  const signInWithGoogle = async (_role: UserRole = 'SCHOOL_OWNER'): Promise<{ success: boolean; error?: string; isUnauthorizedDomain?: boolean }> => {
    const { auth, googleProvider, isConfigured: valid } = getFirebaseInstances();

    if (!valid || !auth || !googleProvider) {
      return {
        success: false,
        error: 'يرجى إدخال إعدادات Firebase الخاصة بك أولاً لتفعيل تسجيل الدخول عبر Google'
      };
    }

    try {
      setLoading(true);
      const cred = await signInWithPopup(auth, googleProvider);
      const existingRole = 'SCHOOL_OWNER';
      saveRoleForUid(cred.user.uid, existingRole);
      setUser({
        uid: cred.user.uid,
        email: cred.user.email || '',
        displayName: String(cred.user.displayName || '').includes('اختبار') ? 'مالك المدرسة' : (cred.user.displayName || 'مالك المدرسة'),
        role: existingRole,
        photoURL: cred.user.photoURL || undefined,
        isFirebaseUser: true
      });
      localStorage.removeItem('noor_demo_logged_in');
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('auth/unauthorized-domain')) {
        return {
          success: false,
          isUnauthorizedDomain: true,
          error: translateFirebaseError(err)
        };
      }
      return { success: false, error: translateFirebaseError(err) };
    } finally {
      setLoading(false);
    }
  };

  // استعادة كلمة المرور
  const resetPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    const { auth, isConfigured: valid } = getFirebaseInstances();

    if (!valid || !auth) {
      return {
        success: true,
        message: 'تم تجهيز رابط استعادة كلمة المرور. فعّل Firebase لإرسال البريد فعلياً.'
      };
    }

    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني المسجل'
      };
    } catch (err) {
      return { success: false, error: translateFirebaseError(err) };
    }
  };

  // تسجيل الخروج
  const logout = async (): Promise<void> => {
    const { auth } = getFirebaseInstances();
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signOut error:', e);
      }
    }
    localStorage.removeItem('noor_demo_logged_in');
    setUser(null);
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured,
        firebaseConfig,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        resetPassword,
        logout,
        updateCustomFirebaseConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
