/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * إعدادات وتهيئة Firebase لثانوية نور الكمال
 * يدعم تهيئة Firebase الحية مع إمكانية تحديث التكوين ديناميكياً
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
  measurementId?: string;
  firestoreDatabaseId?: string;
}

const STORAGE_KEY = 'noor_alkamal_firebase_config';

// تكوين مشروع Firebase الخاص بالمدرسة
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyD3ilUVC-Q3iMTvGPEqZUPKPhFBcHHrxsU",
  authDomain: "school-86c0b.firebaseapp.com",
  projectId: "school-86c0b",
  storageBucket: "school-86c0b.firebasestorage.app",
  messagingSenderId: "766549428756",
  appId: "1:766549428756:web:e708ddc94a7d59285f7501",
  measurementId: "G-MES9DDF6T7",
};

/**
 * فحص ما إذا كانت بيانات Firebase تم توفيرها وصالحة
 */
export function isFirebaseConfigValid(config?: FirebaseConfig | null): boolean {
  if (!config) return false;
  return Boolean(
    config.apiKey &&
    config.apiKey.trim().length > 10 &&
    !config.apiKey.includes('YOUR_') &&
    config.projectId &&
    config.projectId.trim().length > 2
  );
}

/**
 * الحصول على التكوين المخزن أو الافتراضي
 */
export function getStoredFirebaseConfig(): FirebaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_FIREBASE_CONFIG, ...parsed };
      }
    }
  } catch (e) {
    console.warn('Could not read stored Firebase config:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

/**
 * حفظ التكوين في localStorage
 */
export function saveStoredFirebaseConfig(config: FirebaseConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Could not save Firebase config:', e);
  }
}

/**
 * استخراج بيانات Firebase من نص JavaScript أو JSON المنسوخ من لوحة Firebase
 */
export function parseFirebaseConfigInput(input: string): Partial<FirebaseConfig> | null {
  const clean = input.trim();
  if (!clean) return null;

  // المحاولة الأولى: JSON صالح
  try {
    const parsed = JSON.parse(clean);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    // ليس JSON مباشراً، نستخرج القيم بالـ Regex
  }

  // المحاولة الثانية: استخراج المفاتيح عبر تعبيرات منتظمة (Regex) من كود JS
  const extract = (key: string): string => {
    const regex = new RegExp(`${key}\\s*:\\s*["'\`]([^"'\`]+)["'\`]`, 'i');
    const match = clean.match(regex);
    return match ? match[1] : '';
  };

  const apiKey = extract('apiKey');
  const authDomain = extract('authDomain');
  const projectId = extract('projectId');
  const storageBucket = extract('storageBucket');
  const messagingSenderId = extract('messagingSenderId');
  const appId = extract('appId');
  const measurementId = extract('measurementId');

  if (apiKey || projectId) {
    return {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
      measurementId
    };
  }

  return null;
}

let activeApp: FirebaseApp | null = null;
let activeAuth: Auth | null = null;

/**
 * تهيئة Firebase بالبيانات الحالية
 */
export function getFirebaseInstances(): {
  app: FirebaseApp | null;
  auth: Auth | null;
  googleProvider: GoogleAuthProvider | null;
  isConfigured: boolean;
} {
  const currentConfig = getStoredFirebaseConfig();
  const isValid = isFirebaseConfigValid(currentConfig);

  if (!isValid) {
    return { app: null, auth: null, googleProvider: null, isConfigured: false };
  }

  try {
    if (!activeApp) {
      const existingApps = getApps();
      activeApp = existingApps.length > 0 ? getApp() : initializeApp(currentConfig);
    }
    if (!activeAuth && activeApp) {
      activeAuth = getAuth(activeApp);
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    return {
      app: activeApp,
      auth: activeAuth,
      googleProvider: provider,
      isConfigured: true
    };
  } catch (err) {
    console.warn('Firebase initialization error:', err);
    return { app: null, auth: null, googleProvider: null, isConfigured: false };
  }
}
