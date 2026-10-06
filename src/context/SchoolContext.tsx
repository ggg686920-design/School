/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * School Context:
 * يوفر حالة النظام الشاملة، بيانات المدرسة، الدور الحالي (RBAC)،
 * وتطبيق حظر المجاميع المالية عن المدير برمجياً
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SchoolSettings,
  UserRole,
  NotificationItem,
  SmartAlert,
  LoginAttemptLog
} from '../types';
import { IDatabaseAdapter, LocalStorageDatabaseAdapter } from '../repositories/DatabaseAdapter';
import { SchoolService, DashboardMetrics } from '../services/SchoolService';
import { INITIAL_SCHOOL_SETTINGS } from '../repositories/seedData';

interface SchoolContextType {
  settings: SchoolSettings;
  updateSettings: (newSettings: SchoolSettings) => Promise<void>;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  db: IDatabaseAdapter;
  schoolService: SchoolService;
  metrics: DashboardMetrics | null;
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  smartAlerts: SmartAlert[];
  resolveAlert: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
  resetToDefault: () => Promise<void>;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  
  // كود أمان المدرسة
  schoolAccessCode: string;
  verifyAccessCode: (code: string) => Promise<boolean>;
  regenerateAccessCode: () => Promise<string>;
  
  // سجل محاولات الدخول
  loginAttempts: LoginAttemptLog[];
  recordLoginAttempt: (attempt: Omit<LoginAttemptLog, 'id' | 'timestamp'>) => Promise<void>;
}

const dbInstance: IDatabaseAdapter = new LocalStorageDatabaseAdapter();
const schoolServiceInstance = new SchoolService(dbInstance);

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SchoolSettings>(INITIAL_SCHOOL_SETTINGS);
  const [currentRole, setCurrentRole] = useState<UserRole>('SCHOOL_OWNER');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [schoolAccessCode, setSchoolAccessCode] = useState<string>('NK-SEC-94721-KML');
  const [loginAttempts, setLoginAttempts] = useState<LoginAttemptLog[]>([]);

  const loadData = async () => {
    try {
      const s = await dbInstance.getSettings();
      const isKnownTestSetup = ['مدرسة المستقبل الأهلية', 'مدرسة اختبار المدرسة'].includes(s.name) || String(s.principalName || '').includes('اختبار');
      const cleanSettings = isKnownTestSetup ? INITIAL_SCHOOL_SETTINGS : s;
      if (isKnownTestSetup) await dbInstance.saveSettings(INITIAL_SCHOOL_SETTINGS);
      setSettings(cleanSettings);
      setSchoolAccessCode(cleanSettings.schoolAccessCode || '');
      
      const m = await schoolServiceInstance.getDashboardMetrics(currentRole);
      setMetrics(m);
      
      const n = await dbInstance.getNotifications();
      setNotifications(n);
      
      const al = await schoolServiceInstance.getSystemRuleAlerts();
      setSmartAlerts(al);

      const attempts = await dbInstance.getLoginAttempts();
      setLoginAttempts(attempts);
    } catch (err) {
      console.error('Failed to load school state:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentRole]);

  const updateSettings = async (newSettings: SchoolSettings) => {
    await dbInstance.saveSettings(newSettings);
    setSettings(newSettings);
    await loadData();
  };

  const markNotificationRead = async (id: string) => {
    await dbInstance.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const resolveAlert = async (id: string) => {
    await dbInstance.resolveSmartAlert(id);
    setSmartAlerts(prev => prev.filter(a => a.id !== id));
  };

  const resetToDefault = async () => {
    await dbInstance.resetToInitialClean();
    await loadData();
  };

  const verifyAccessCode = async (code: string): Promise<boolean> => {
    return dbInstance.verifySchoolAccessCode(code);
  };

  const regenerateAccessCode = async (): Promise<string> => {
    const newCode = await dbInstance.regenerateSchoolAccessCode();
    setSchoolAccessCode(newCode);
    const updatedSettings = await dbInstance.getSettings();
    setSettings(updatedSettings);
    return newCode;
  };

  const recordLoginAttempt = async (attempt: Omit<LoginAttemptLog, 'id' | 'timestamp'>) => {
    const log: LoginAttemptLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      ...attempt,
      timestamp: new Date().toISOString()
    };
    await dbInstance.logLoginAttempt(log);
    setLoginAttempts(prev => [log, ...prev].slice(0, 100));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SchoolContext.Provider
      value={{
        settings,
        updateSettings,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        db: dbInstance,
        schoolService: schoolServiceInstance,
        metrics,
        notifications,
        unreadCount,
        markNotificationRead,
        smartAlerts,
        resolveAlert,
        refreshData: loadData,
        resetToDefault,
        selectedStudentId,
        setSelectedStudentId,
        schoolAccessCode,
        verifyAccessCode,
        regenerateAccessCode,
        loginAttempts,
        recordLoginAttempt
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
