/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sidebar Component:
 * القائمة الرئيسية الشاملة طبقاً للبند 43 من متطلبات النظام
 */

import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Users2,
  Briefcase,
  Layers,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  CreditCard,
  Receipt,
  Wallet,
  Bus,
  Megaphone,
  Bell,
  MessageSquare,
  BarChart3,
  Terminal,
  Settings,
  ShieldCheck,
  X
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentRole } = useSchool();

  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم الرئيسية', icon: LayoutDashboard, roles: ['admin', 'teacher', 'accountant', 'student', 'parent'] },
    { id: 'students', label: 'إدارة الطلاب', icon: GraduationCap, roles: ['admin', 'teacher', 'accountant'] },
    { id: 'parents', label: 'أولياء الأمور', icon: Users2, roles: ['admin', 'teacher'] },
    { id: 'teachers', label: 'المدرسون والكوادر', icon: Briefcase, roles: ['admin'] },
    { id: 'staff', label: 'الموظفون الإداريون', icon: Users2, roles: ['admin'] },
    { id: 'classes', label: 'الصفوف والشعب', icon: Layers, roles: ['admin', 'teacher'] },
    { id: 'subjects', label: 'المواد الدراسية', icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
    { id: 'timetable', label: 'الجدول الأسبوعي', icon: CalendarDays, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'attendance', label: 'الحضور والغياب', icon: CheckCircle2, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'exams', label: 'الامتحانات والدرجات', icon: FileSpreadsheet, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'certificates', label: 'الشهادات والنتائج', icon: Award, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'fees', label: 'الأقساط والمدفوعات', icon: CreditCard, roles: ['admin', 'accountant', 'parent', 'student'] },
    { id: 'receipts', label: 'سندات القبض', icon: Receipt, roles: ['admin', 'accountant', 'parent'] },
    { id: 'expenses', label: 'المصروفات التشغيلية', icon: Wallet, roles: ['admin', 'accountant'] },
    { id: 'payroll', label: 'الرواتب والأجور', icon: Briefcase, roles: ['admin', 'accountant'] },
    { id: 'transport', label: 'النقل المدرسي', icon: Bus, roles: ['admin', 'teacher', 'parent', 'student'] },
    { id: 'announcements', label: 'الإعلانات والفعاليات', icon: Megaphone, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'notifications', label: 'الإشعارات والتنبيهات', icon: Bell, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'messages', label: 'الرسائل والتواصل', icon: MessageSquare, roles: ['admin', 'teacher', 'student', 'parent'] },
    { id: 'reports', label: 'التقارير والإحصائيات', icon: BarChart3, roles: ['admin', 'accountant'] },
    { id: 'school_assistant', label: 'School Assistant (مساعد المدرسة)', icon: Terminal, roles: ['admin', 'teacher', 'accountant'] },
    { id: 'audit_log', label: 'سجل العمليات', icon: ShieldCheck, roles: ['admin'] },
    { id: 'settings', label: 'إعدادات المدرسة', icon: Settings, roles: ['admin'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(currentRole));

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden no-print"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 right-0 z-40 h-screen w-64 bg-white border-l border-slate-200 flex flex-col transition-transform duration-200 ease-in-out no-print ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <span className="text-sm font-bold text-slate-800">قائمة النظام</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
            الأقسام والخدمات
          </div>

          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-right ${
                  isActive
                    ? 'bg-blue-50 text-[#2563EB] font-bold border-r-2 border-[#2563EB]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#2563EB]' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.id === 'school_assistant' && (
                  <span className="mr-auto text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.2 rounded">
                    أوامر
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info: School Year & Database Provider */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>قاعدة البيانات:</span>
            <span className="font-semibold text-emerald-600">جاهزة لـ Firebase</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            Repository Data Layer Active
          </div>
        </div>
      </aside>
    </>
  );
};
