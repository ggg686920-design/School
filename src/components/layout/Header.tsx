/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Header Component:
 * ينفذ عقد الشريط العلوي (Top Bar Contract):
 * اسم المدرسة ديناميكي بالكامل (يأتي من Settings ولا يثبت أبداً)
 * مبدل الأدوار السريع (RBAC)، التنبيهات، والبحث السريع
 */

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  UserCheck,
  GraduationCap,
  Terminal,
  Menu,
  School as SchoolIcon,
  Plus,
  LogIn,
  LogOut,
  User,
  Settings,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { AuthModal } from '../auth/AuthModal';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  onQuickAddStudent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  onOpenSearch,
  onQuickAddStudent
}) => {
  const { settings, currentRole, setCurrentRole, unreadCount, setActiveTab } = useSchool();
  const { user, logout, isConfigured } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  // Synchronize SchoolContext role with logged-in user role
  useEffect(() => {
    if (user?.role && user.role !== currentRole) {
      setCurrentRole(user.role);
    }
  }, [user?.role]);

  const rolesList: { id: UserRole; label: string; desc: string }[] = [
    { id: 'SCHOOL_OWNER', label: 'مالك المدرسة', desc: 'الحساب الرئيسي — جميع الصلاحيات' }
  ];

  const currentRoleInfo = rolesList.find(r => r.id === currentRole) || rolesList[0];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#1E3A8A] text-white border-b border-blue-900/60 shadow-xs px-4 lg:px-8 py-3 flex items-center justify-between no-print transition-colors">
        {/* Zone 1: Brand Wordmark (Fully dynamic school name) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800 transition-colors"
            aria-label="فتح القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/60 border border-blue-400/40 flex items-center justify-center text-white shadow-xs">
              <SchoolIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white font-['Alexandria',sans-serif] whitespace-nowrap">
                {settings.name || 'نظام إدارة المدارس الأهلية'}
              </div>
              <div className="text-[11px] text-blue-200/90 hidden sm:block whitespace-nowrap">
                العام الدراسي {settings.currentAcademicYear || 'لم تُحدد السنة'} · {settings.province || 'لم تُحدد المحافظة'}
              </div>
            </div>
          </div>
        </div>

        {/* Zone 2: Fast Navigation & Role Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-900/70 border border-blue-700/60 text-xs font-medium text-blue-100">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span className="text-slate-300">الحساب:</span>
            <span className="text-white font-semibold">مالك المدرسة</span>
          </div>

          <button
            onClick={() => setActiveTab('school_assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800/60 border border-blue-700/50 hover:bg-blue-700/60 text-xs font-medium text-blue-100 hover:text-white transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-300" />
            <span>مساعد المدرسة</span>
          </button>
        </div>

        {/* Zone 3: Primary Actions & Utility icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/80 transition-colors"
            title="بحث شامل في النظام"
            aria-label="البحث"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/80 transition-colors relative"
            title="الإشعارات"
            aria-label="الإشعارات"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-blue-900" />
            )}
          </button>

          {(currentRole === 'admin' || currentRole === 'SCHOOL_OWNER') && (
            <button
              onClick={onQuickAddStudent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F59E0B] hover:bg-amber-600 text-slate-950 font-semibold text-xs transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إضافة طالب</span>
            </button>
          )}

          {/* Authentication & User Account Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 border border-blue-700/70 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-xs">
                  {user.displayName ? user.displayName.charAt(0) : 'U'}
                </div>
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-semibold leading-tight text-white max-w-[120px] truncate">
                    {user.displayName}
                  </div>
                  <div className="text-[10px] text-blue-200">
                    <span>{currentRoleInfo.label}</span>
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-900 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="font-bold text-xs text-slate-900">{user.displayName}</div>
                    <div className="text-[11px] text-slate-500 truncate" dir="ltr">{user.email}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-semibold">
                        {currentRoleInfo.label}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => logout()}
                    className="w-full text-right px-4 py-2 text-xs flex items-center gap-2 hover:bg-rose-50 text-rose-600 font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAuthModalTab('signin');
                  setAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal Container */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
};
