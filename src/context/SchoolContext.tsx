/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * School Context:
 * يوفر حالة النظام الشاملة، بيانات المدرسة، الدور الحالي (RBAC)،
 * وتحديثات قاعدة البيانات المتصلة
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SchoolSettings,
  UserRole,
  NotificationItem,
  SmartAlert
} from '../types';
import { IDatabaseAdapter, LocalStorageDatabaseAdapter } from '../repositories/DatabaseAdapter';
import { SchoolService, DashboardMetrics } from '../services/SchoolService';
import { AIService } from '../services/AIService';
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
  aiService: AIService;
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
}

const dbInstance: IDatabaseAdapter = new LocalStorageDatabaseAdapter();
const schoolServiceInstance = new SchoolService(dbInstance);
const aiServiceInstance = new AIService(dbInstance, schoolServiceInstance);

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SchoolSettings>(INITIAL_SCHOOL_SETTINGS);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-1');

  const loadData = async () => {
    try {
      const s = await dbInstance.getSettings();
      setSettings(s);
      const m = await schoolServiceInstance.getDashboardMetrics();
      setMetrics(m);
      const n = await dbInstance.getNotifications();
      setNotifications(n);
      const al = await dbInstance.getSmartAlerts();
      setSmartAlerts(al);
    } catch (err) {
      console.error('Failed to load school state:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    await dbInstance.resetToInitialDemo();
    await loadData();
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
        aiService: aiServiceInstance,
        metrics,
        notifications,
        unreadCount,
        markNotificationRead,
        smartAlerts,
        resolveAlert,
        refreshData: loadData,
        resetToDefault,
        selectedStudentId,
        setSelectedStudentId
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
