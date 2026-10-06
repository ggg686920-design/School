import React from 'react';
import {
  ArrowLeft, ArrowUpLeft, Banknote, BarChart3, BellRing, BookOpenCheck,
  CalendarCheck2, Check, CheckCircle2, ChevronLeft, CircleDollarSign,
  ClipboardList, Clock3, FileText, GraduationCap, LayoutGrid, Plus,
  Receipt, Settings2, ShieldCheck, Sparkles, TrendingUp, UserPlus, Users,
  WalletCards, XCircle
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { StatCard } from '../common/StatCard';

interface DashboardViewProps {
  onQuickAddStudent: () => void;
  onQuickRecordPayment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onQuickAddStudent, onQuickRecordPayment }) => {
  const { settings, metrics, smartAlerts, resolveAlert, setActiveTab } = useSchool();
  if (!metrics) return <div className="owner-loading"><div className="loading-orbit" /><span>نجهز لوحة مدرستك...</span></div>;

  const currency = settings.currency || 'د.ع';
  const collectionRate = Math.round(((metrics.totalRevenueCollected ?? 0) / (metrics.totalRevenueExpected || 1)) * 100);
  const setupItems = [
    { label: 'تسجيل أول طالب', done: metrics.totalStudents > 0, tab: 'students' },
    { label: 'إضافة كادر المدرسة', done: metrics.totalTeachers > 0, tab: 'teachers' },
    { label: 'بناء الصفوف والشعب', done: metrics.totalStudents > 0, tab: 'classes' },
    { label: 'ضبط بيانات المدرسة', done: Boolean(settings.phone || settings.address), tab: 'settings' }
  ];
  const quickActions = [
    { label: 'تسجيل طالب جديد', hint: 'ملف الطالب وولي الأمر', icon: UserPlus, action: onQuickAddStudent, tone: 'mint' },
    { label: 'تسجيل سند قبض', hint: 'تحديث الأقساط فوراً', icon: Receipt, action: onQuickRecordPayment, tone: 'gold' },
    { label: 'تحضير الحضور', hint: 'سجل دوام اليوم', icon: CalendarCheck2, action: () => setActiveTab('attendance'), tone: 'lavender' },
    { label: 'إنشاء تقرير', hint: 'كشف جاهز للطباعة', icon: FileText, action: () => setActiveTab('reports'), tone: 'sky' }
  ];

  return <div className="owner-dashboard" dir="rtl">
    <section className="owner-hero">
      <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
      <div className="owner-hero-copy">
        <div className="owner-kicker"><span className="live-dot" /> مركز قيادة المدرسة <span className="kicker-separator">/</span> {settings.currentAcademicYear || 'السنة الدراسية'}</div>
        <h1>صباحك مرتب، <span>{settings.principalName || 'يا مالك المدرسة'}</span></h1>
        <p>هنا تشوف الصورة الكاملة لمدرستك: الطلبة، الدوام، الأقساط، والكادر — بقرار واضح ومن شاشة واحدة.</p>
        <div className="hero-meta"><span><ShieldCheck /> مساحة خاصة وآمنة</span><span><Clock3 /> آخر تحديث الآن</span></div>
      </div>
      <div className="hero-actions">
        <button className="owner-btn owner-btn-primary" onClick={onQuickAddStudent}><Plus /> إضافة طالب</button>
        <button className="owner-btn owner-btn-glass" onClick={() => setActiveTab('settings')}><Settings2 /> إعدادات المدرسة</button>
      </div>
    </section>

    <section className="owner-section-head"><div><span className="owner-eyebrow"><Sparkles /> نظرة سريعة</span><h2>مؤشرات اليوم</h2><p>أرقام حقيقية من قاعدة بيانات مدرستك، بدون بيانات افتراضية.</p></div><button className="text-action" onClick={() => setActiveTab('reports')}>عرض التقارير <ArrowLeft /></button></section>
    <section className="owner-kpi-grid">
      <StatCard title="الطلاب المسجلون" value={metrics.totalStudents} subtitle={`${metrics.activeStudents} طالب نشط الآن`} icon={GraduationCap} badge={{ text: `${metrics.maleStudents} ذكور · ${metrics.femaleStudents} إناث`, type: 'success' }} onClick={() => setActiveTab('students')} />
      <StatCard title="دوام اليوم" value={`${metrics.todayAttendanceRate}%`} subtitle={`${metrics.todayPresentCount} حاضر · ${metrics.todayAbsentCount} غائب`} icon={CalendarCheck2} badge={{ text: metrics.todayDate, type: 'info' }} onClick={() => setActiveTab('attendance')} />
      <StatCard title="تحصيل الأقساط" value={`${(metrics.totalRevenueCollected ?? 0).toLocaleString()} ${currency}`} subtitle={`المتبقي ${(metrics.totalDebtsRemaining ?? 0).toLocaleString()} ${currency}`} icon={CircleDollarSign} badge={{ text: `${collectionRate}% مكتمل`, type: 'warning' }} onClick={() => setActiveTab('fees')} />
      <StatCard title="الكادر والموظفون" value={metrics.totalTeachers + metrics.totalEmployees} subtitle={`${metrics.activeTeachers} مدرس نشط · ${metrics.totalEmployees} إداري`} icon={Users} badge={{ text: 'إدارة الكادر', type: 'info' }} onClick={() => setActiveTab('teachers')} />
    </section>

    <section className="owner-content-grid">
      <div className="owner-panel quick-panel"><div className="panel-title"><div><span className="owner-eyebrow">اختصارات المالك</span><h3>أنجزها بسرعة</h3></div><LayoutGrid /></div><div className="quick-action-grid">{quickActions.map(({ label, hint, icon: Icon, action, tone }) => <button key={label} className={`quick-action ${tone}`} onClick={action}><span className="quick-icon"><Icon /></span><span><strong>{label}</strong><small>{hint}</small></span><ArrowUpLeft className="quick-arrow" /></button>)}</div></div>
      <div className="owner-panel setup-panel"><div className="panel-title"><div><span className="owner-eyebrow">مركز التجهيز</span><h3>خلّي النظام يشتغل صح</h3></div><ClipboardList /></div><p className="panel-description">أكمل الخطوات الأساسية حتى تحصل على تقارير دقيقة وتجربة مرتبة لفريقك.</p><div className="setup-progress"><span><b>{setupItems.filter(i => i.done).length}</b> من {setupItems.length} مكتملة</span><div><i style={{ width: `${(setupItems.filter(i => i.done).length / setupItems.length) * 100}%` }} /></div></div><div className="setup-list">{setupItems.map(item => <button key={item.label} onClick={() => setActiveTab(item.tab)}><span className={item.done ? 'setup-check done' : 'setup-check'}>{item.done ? <Check /> : <span />}</span><span>{item.label}</span><ChevronLeft /></button>)}</div></div>
    </section>

    <section className="owner-content-grid lower-grid">
      <div className="owner-panel attendance-panel"><div className="panel-title"><div><span className="owner-eyebrow">الدوام المدرسي</span><h3>حالة الحضور اليوم</h3></div><button className="icon-link" onClick={() => setActiveTab('attendance')}><ArrowLeft /></button></div><div className="attendance-gauge"><div className="gauge-ring" style={{ '--gauge': `${metrics.todayAttendanceRate * 3.6}deg` } as React.CSSProperties}><strong>{metrics.todayAttendanceRate}%</strong><small>نسبة الحضور</small></div><div className="attendance-breakdown"><span className="present"><CheckCircle2 /> حاضر <b>{metrics.todayPresentCount}</b></span><span className="absent"><XCircle /> غائب <b>{metrics.todayAbsentCount}</b></span><span className="late"><Clock3 /> متأخر <b>{metrics.todayLateCount}</b></span></div></div><div className="panel-foot"><span>المواصلات المشغلة</span><strong>{metrics.totalRoutes} خطوط <small>({metrics.transportStudentsCount} طالب)</small></strong></div></div>
      <div className="owner-panel finance-panel"><div className="panel-title"><div><span className="owner-eyebrow">الصحة المالية</span><h3>ملخص السيولة</h3></div><button className="icon-link" onClick={() => setActiveTab('fees')}><ArrowLeft /></button></div><div className="finance-total"><span>صافي التدفق النقدي</span><strong>{(metrics.netCashFlow ?? 0).toLocaleString()} <small>{currency}</small></strong><em><TrendingUp /> من واقع السجلات</em></div><div className="finance-rows"><div><span><WalletCards /> المحصل</span><b className="positive">{(metrics.totalRevenueCollected ?? 0).toLocaleString()} {currency}</b></div><div><span><Banknote /> المصروفات</span><b>{(metrics.totalExpenses ?? 0).toLocaleString()} {currency}</b></div><div><span><BarChart3 /> المتوقع</span><b>{(metrics.totalRevenueExpected ?? 0).toLocaleString()} {currency}</b></div></div></div>
      <div className="owner-panel alerts-panel"><div className="panel-title"><div><span className="owner-eyebrow">المراقبة الذكية</span><h3>تنبيهات تحتاج انتباهك</h3></div><BellRing /></div>{smartAlerts.length ? <div className="alert-list">{smartAlerts.slice(0, 3).map(alert => <div className="owner-alert" key={alert.id}><span className={`alert-dot ${alert.severity}`} /><div><strong>{alert.title}</strong><p>{alert.description}</p></div><button onClick={() => resolveAlert(alert.id)}>تمت المعالجة</button></div>)}</div> : <div className="empty-state"><span className="empty-state-icon"><CheckCircle2 /></span><strong>كلشي مستقر</strong><p>ماكو تنبيهات معلقة حالياً. نراقب البيانات ونخبرك عند الحاجة.</p></div>}</div>
    </section>

    <section className="owner-tip"><span className="tip-icon"><BookOpenCheck /></span><div><strong>نصيحة المالك</strong><p>ابدأ بتسجيل الصفوف والطلاب أولاً، بعدها راح تقدر تستخدم الحضور والأقساط والتقارير بأفضل صورة.</p></div><button onClick={() => setActiveTab('school_assistant')}>افتح مساعد المدرسة <ArrowLeft /></button></section>
  </div>;
};
