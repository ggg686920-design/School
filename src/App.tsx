/**
 * نظام إدارة المدارس الأهلية — بوابة العراق
 * واجهة عامة للزائر + إعداد أولي إلزامي للمدرسة قبل فتح لوحة التحكم.
 */
import React, { useState } from 'react';
import {
  ArrowLeft, ArrowUpLeft, Building2, Check, ChevronLeft, ClipboardCheck,
  GraduationCap, Landmark, LockKeyhole, Menu, Phone, Rocket, School,
  ShieldCheck, Sparkles, Users, Wallet, X
} from 'lucide-react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SearchModal } from './components/common/SearchModal';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardView } from './components/views/DashboardView';
import { StudentsView } from './components/views/StudentsView';
import { TeachersView } from './components/views/TeachersView';
import { TimetableView } from './components/views/TimetableView';
import { AttendanceView } from './components/views/AttendanceView';
import { CertificatesView } from './components/views/CertificatesView';
import { FeesPaymentsView } from './components/views/FeesPaymentsView';
import { ReceiptsView } from './components/views/ReceiptsView';
import { ExpensesView } from './components/views/ExpensesView';
import { PayrollView } from './components/views/PayrollView';
import { TransportView } from './components/views/TransportView';
import { SchoolAssistantView } from './components/views/SchoolAssistantView';
import { SettingsView } from './components/views/SettingsView';
import {
  ParentsView, ClassesView, SubjectsView, ExamsGradesView, StaffView,
  AnnouncementsView, NotificationsView, MessagesView, ReportsView, AuditLogView
} from './components/views/AdditionalViews';
import { SchoolSettings } from './types';

const features = [
  { icon: Users, title: 'ملف الطالب الكامل', text: 'تسجيل الطلبة والأولياء والمستمسكات والانتقال بين الصفوف من شاشة واحدة.' },
  { icon: ClipboardCheck, title: 'حضور ودرجات بلا ورق', text: 'سجل الحضور والغياب والدرجات والنتائج مع تقارير جاهزة للطباعة.' },
  { icon: Wallet, title: 'مالية المدرسة', text: 'الأقساط وسندات القبض والرواتب والمصروفات بعملة الدينار العراقي.' },
  { icon: ShieldCheck, title: 'صلاحيات وأمان', text: 'أدوار واضحة للمالك والمدير والمحاسب والمدرس وولي الأمر والطالب.' }
];

function PublicLanding({ onAuth }: { onAuth: (tab: 'signin' | 'signup') => void }) {
  return <div className="landing-shell" dir="rtl">
    <nav className="landing-nav">
      <div className="brand-lockup"><span className="brand-mark"><School className="w-5 h-5" /></span><span>نظام إدارة المدارس الأهلية</span></div>
      <div className="landing-nav-actions"><span className="nav-note">مصمم لمدارس العراق</span><button className="btn-ghost" onClick={() => onAuth('signin')}>تسجيل الدخول</button><button className="btn-primary" onClick={() => onAuth('signup')}>ابدأ مجاناً <ArrowLeft className="w-4 h-4" /></button></div>
    </nav>
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles className="w-4 h-4" /> منصة واحدة لإدارة مدرستك بثقة</div>
          <h1>كل تفاصيل مدرستك،<br /><span>بقرار أسرع.</span></h1>
          <p>نظام عراقي حديث يساعدك على إدارة الطلبة والكادر والحضور والدرجات والمالية من مكان واحد — بدون جداول مبعثرة أو بيانات تجريبية.</p>
          <div className="hero-actions"><button className="btn-primary btn-large" onClick={() => onAuth('signup')}>أنشئ مساحة مدرستك <ArrowLeft className="w-5 h-5" /></button><button className="btn-outline btn-large" onClick={() => onAuth('signin')}>لدي حساب بالفعل</button></div>
          <div className="trust-row"><span><Check /> إعداد أولي خلال دقائق</span><span><Check /> بياناتك ملكك</span><span><Check /> واجهة عربية RTL</span></div>
        </div>
        <div className="hero-visual"><div className="dashboard-preview"><div className="preview-top"><span className="preview-dot" /><span className="preview-dot muted" /><span className="preview-dot muted" /><span className="preview-label">لوحة القيادة</span></div><div className="preview-body"><div className="preview-sidebar"><span className="active-line" /><span /><span /><span /><span /><span /></div><div className="preview-content"><div className="preview-welcome"><small>مساحة مدرستك الجديدة</small><strong>مرحباً بك في نظامك</strong><div className="preview-button" /></div><div className="preview-stats"><i /><i /><i /><i /></div><div className="preview-chart"><span /><span /><span /><span /><span /><span /><span /></div></div></div></div><div className="float-card float-one"><div className="float-icon green"><Check /></div><div><strong>جاهز للبدء</strong><small>لا توجد بيانات وهمية</small></div></div><div className="float-card float-two"><div className="float-icon blue"><LockKeyhole /></div><div><strong>بيانات آمنة</strong><small>صلاحيات مخصصة</small></div></div></div>
      </section>
      <section className="feature-section"><div className="section-heading"><span className="eyebrow">مصمم حول احتياجك</span><h2>أدوات واضحة، لنتائج أفضل</h2><p>ابدأ من شاشة نظيفة، أدخل بيانات مدرستك الحقيقية، واترك النظام يرتب العمل اليومي.</p></div><div className="feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="feature-card" key={title}><span className="feature-icon"><Icon /></span><h3>{title}</h3><p>{text}</p><ChevronLeft className="feature-arrow" /></article>)}</div></section>
      <section className="audience-section"><div><span className="eyebrow">لكل فريق المدرسة</span><h2>من الإدارة إلى ولي الأمر<br />الجميع يرى ما يخصه.</h2></div><div className="audience-pills"><span><Landmark /> مالك المدرسة</span><span><GraduationCap /> الهيئة التعليمية</span><span><Users /> أولياء الأمور</span><span><Phone /> التواصل المدرسي</span></div></section>
    </main>
    <footer><span>نظام إدارة المدارس الأهلية</span><span>حل عملي لمدارس العراق · 2026</span></footer>
  </div>;
}

function SchoolOnboarding() {
  const { settings, updateSettings } = useSchool();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: settings.name, province: settings.province, city: settings.city, address: settings.address, phone: settings.phone, email: settings.email, currentAcademicYear: settings.currentAcademicYear || '2026-2027', principalName: settings.principalName });
  const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const submit = async (e: React.FormEvent) => { e.preventDefault(); if (!form.name.trim() || !form.province.trim() || !form.currentAcademicYear.trim()) { setError('أكمل اسم المدرسة والمحافظة والسنة الدراسية للمتابعة.'); return; } setSaving(true); setError(''); await updateSettings({ ...settings, ...form, name: form.name.trim(), province: form.province.trim(), city: form.city.trim(), address: form.address.trim(), phone: form.phone.trim(), email: form.email.trim(), principalName: form.principalName.trim() }); setSaving(false); };
  const field = (key: keyof typeof form, label: string, placeholder: string, required = false) => <label className="form-field"><span>{label}{required && ' *'}</span><input value={form[key]} onChange={e => update(key, e.target.value)} placeholder={placeholder} required={required} /></label>;
  return <div className="onboarding-shell" dir="rtl"><div className="onboarding-card"><div className="onboarding-intro"><span className="onboarding-icon"><Building2 /></span><span className="step-label">الخطوة الأخيرة قبل البدء</span><h1>عرّفنا بمدرستك</h1><p>مرحباً {user?.displayName || 'بك'}، لن نضع أي معلومات افتراضية. أدخل التفاصيل الحقيقية لتظهر في تقاريرك وواجهتك.</p><div className="onboarding-points"><span><Check /> لا بيانات وهمية</span><span><Check /> قابل للتعديل لاحقاً</span><span><Check /> محفوظة محلياً بأمان</span></div></div><form onSubmit={submit} className="onboarding-form"><div className="form-grid">{field('name', 'اسم المدرسة', 'مثال: مدرسة الأمل الأهلية', true)}{field('principalName', 'اسم المدير / المالك', 'الاسم الكامل')}{field('province', 'المحافظة', 'بغداد، البصرة، أربيل...', true)}{field('city', 'المدينة / القضاء', 'الكرخ، الرصافة...')}{field('currentAcademicYear', 'السنة الدراسية', '2026-2027', true)}{field('phone', 'هاتف المدرسة', '07xxxxxxxxx')}{field('email', 'البريد الرسمي', 'school@example.iq')}{field('address', 'العنوان', 'الحي، الشارع، أقرب نقطة دالة')}</div>{error && <div className="form-error">{error}</div>}<button className="btn-primary btn-submit" disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ وفتح لوحة المدرسة'} <ArrowLeft className="w-5 h-5" /></button><p className="form-hint">يمكن تعديل هذه التفاصيل من الإعدادات في أي وقت.</p></form></div></div>;
}

const AppContent: React.FC = () => {
  const { user } = useAuth(); const { settings, activeTab, setActiveTab, setSelectedStudentId } = useSchool();
  const [sidebarOpen, setSidebarOpen] = useState(false); const [searchOpen, setSearchOpen] = useState(false); const [quickAddStudent, setQuickAddStudent] = useState(false); const [authOpen, setAuthOpen] = useState(false); const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const openAuth = (tab: 'signin' | 'signup') => { setAuthTab(tab); setAuthOpen(true); };
  if (!user) return <><PublicLanding onAuth={openAuth} /><AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} initialTab={authTab} /></>;
  if (!settings.name?.trim()) return <SchoolOnboarding />;
  const handleEntitySelect = (type: string, id: string) => { if (type === 'students') { setSelectedStudentId(id); setActiveTab('students'); } else if (type === 'teachers') setActiveTab('teachers'); else if (type === 'receipts') setActiveTab('receipts'); };
  const renderActiveView = () => { switch (activeTab) { case 'dashboard': return <DashboardView onQuickAddStudent={() => { setActiveTab('students'); setQuickAddStudent(true); }} onQuickRecordPayment={() => setActiveTab('fees')} />; case 'students': return <StudentsView initialOpenAdd={quickAddStudent} />; case 'parents': return <ParentsView />; case 'teachers': return <TeachersView />; case 'staff': return <StaffView />; case 'classes': return <ClassesView />; case 'subjects': return <SubjectsView />; case 'timetable': return <TimetableView />; case 'attendance': return <AttendanceView />; case 'exams': return <ExamsGradesView />; case 'certificates': return <CertificatesView />; case 'fees': return <FeesPaymentsView />; case 'receipts': return <ReceiptsView />; case 'expenses': return <ExpensesView />; case 'payroll': return <PayrollView />; case 'transport': return <TransportView />; case 'announcements': return <AnnouncementsView />; case 'notifications': return <NotificationsView />; case 'messages': return <MessagesView />; case 'reports': return <ReportsView />; case 'school_assistant': case 'ai_assistant': return <SchoolAssistantView />; case 'audit_log': return <AuditLogView />; case 'settings': return <SettingsView />; default: return <DashboardView onQuickAddStudent={() => setActiveTab('students')} onQuickRecordPayment={() => setActiveTab('fees')} />; } };
  return <div className="app-shell" dir="rtl"><Header onOpenSidebar={() => setSidebarOpen(true)} onOpenSearch={() => setSearchOpen(true)} onQuickAddStudent={() => { setActiveTab('students'); setQuickAddStudent(true); }} /><div className="app-body"><Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /><main className="app-main">{renderActiveView()}</main></div><SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} onSelectEntity={handleEntitySelect} /></div>;
};

export default function App() { return <AuthProvider><SchoolProvider><AppContent /></SchoolProvider></AuthProvider>; }
