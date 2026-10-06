import React from 'react';
import {
  LayoutDashboard, GraduationCap, Users2, Briefcase, Layers, BookOpen,
  CalendarDays, CheckCircle2, FileSpreadsheet, Award, CreditCard, Receipt,
  Wallet, Bus, Megaphone, Bell, MessageSquare, BarChart3, Terminal,
  Settings, ShieldCheck, X, ChevronLeft, CircleHelp
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface SidebarProps { isOpen: boolean; onClose: () => void; }

const groups = [
  { label: 'المشهد العام', items: [
    { id: 'dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'reports', label: 'التقارير والتحليلات', icon: BarChart3 },
  ]},
  { label: 'العملية التعليمية', items: [
    { id: 'students', label: 'الطلاب والملفات', icon: GraduationCap },
    { id: 'parents', label: 'أولياء الأمور', icon: Users2 },
    { id: 'teachers', label: 'الكادر التعليمي', icon: Briefcase },
    { id: 'staff', label: 'الموظفون', icon: Users2 },
    { id: 'classes', label: 'الصفوف والشعب', icon: Layers },
    { id: 'subjects', label: 'المواد الدراسية', icon: BookOpen },
    { id: 'timetable', label: 'الجدول الأسبوعي', icon: CalendarDays },
    { id: 'attendance', label: 'الحضور والغياب', icon: CheckCircle2 },
    { id: 'exams', label: 'الامتحانات والدرجات', icon: FileSpreadsheet },
    { id: 'certificates', label: 'الشهادات والنتائج', icon: Award },
  ]},
  { label: 'الإدارة والمالية', items: [
    { id: 'fees', label: 'الأقساط والمدفوعات', icon: CreditCard },
    { id: 'receipts', label: 'سندات القبض', icon: Receipt },
    { id: 'expenses', label: 'المصروفات', icon: Wallet },
    { id: 'payroll', label: 'الرواتب والأجور', icon: Briefcase },
    { id: 'transport', label: 'النقل المدرسي', icon: Bus },
    { id: 'announcements', label: 'الإعلانات والفعاليات', icon: Megaphone },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'messages', label: 'الرسائل والتواصل', icon: MessageSquare },
  ]},
  { label: 'الأدوات والحماية', items: [
    { id: 'school_assistant', label: 'مساعد المدرسة', icon: Terminal },
    { id: 'audit_log', label: 'سجل العمليات', icon: ShieldCheck },
    { id: 'settings', label: 'إعدادات المدرسة', icon: Settings },
  ]}
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab } = useSchool();
  return <>
    {isOpen && <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden no-print" />}
    <aside className={`owner-sidebar fixed lg:sticky top-0 right-0 z-40 h-screen w-72 flex flex-col transition-transform duration-300 no-print ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
      <div className="sidebar-mobile-head lg:hidden"><strong>قائمة النظام</strong><button onClick={onClose} aria-label="إغلاق القائمة"><X /></button></div>
      <div className="sidebar-brand"><div className="sidebar-brand-mark"><ShieldCheck /></div><div><strong>مساحة المالك</strong><small>إدارة المدرسة من مكان واحد</small></div></div>
      <div className="sidebar-scroll">{groups.map(group => <div className="sidebar-group" key={group.label}><div className="sidebar-group-label">{group.label}</div>{group.items.map(item => { const Icon = item.icon; const active = activeTab === item.id; return <button key={item.id} onClick={() => { setActiveTab(item.id); onClose(); }} className={`sidebar-item ${active ? 'active' : ''}`}><Icon /><span>{item.label}</span>{active && <ChevronLeft className="sidebar-active-arrow" />}</button>; })}</div>)}</div>
      <div className="sidebar-footer"><div className="sidebar-secure"><ShieldCheck /><span><strong>وضع المالك</strong><small>كل الصلاحيات مفعلة</small></span><span className="secure-dot" /></div><button onClick={() => setActiveTab('school_assistant')} className="sidebar-help"><CircleHelp /> تحتاج مساعدة؟</button></div>
    </aside>
  </>;
};
