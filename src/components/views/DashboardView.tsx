/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Dashboard View — Section 10: لوحة تحكم المدير المركزية
 */

import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  TrendingUp,
  Receipt,
  UserPlus,
  CalendarCheck,
  ChevronLeft,
  ArrowUpRight,
  ShieldAlert,
  Bus
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { StatCard } from '../common/StatCard';

interface DashboardViewProps {
  onQuickAddStudent: () => void;
  onQuickRecordPayment: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onQuickAddStudent,
  onQuickRecordPayment
}) => {
  const { settings, metrics, smartAlerts, resolveAlert, setActiveTab, setSelectedStudentId } = useSchool();

  if (!metrics) {
    return <div className="p-8 text-center text-slate-500 text-sm">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-l from-[#1E3A8A] to-[#2563EB] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold mb-1">
            <span>لوحة القيادة المدرسية الذكية</span>
            <span>·</span>
            <span>العام الدراسي {settings.currentAcademicYear}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-['Alexandria',sans-serif]">
            مرحباً بك في {settings.name}
          </h1>
          <p className="text-xs text-blue-100/90 mt-1 max-w-xl leading-relaxed">
            النظام يعمل بكفاءة كاملة. يمكنك إدارة بيانات الطلاب والكوادر التعليمية، متابعة التحصيل المالي، واستعراض إحصاءات وأوامر قاعدة البيانات الدقيقة عبر مساعد المدرسة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onQuickAddStudent}
            className="px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة طالب جديد</span>
          </button>
          <button
            onClick={onQuickRecordPayment}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-colors flex items-center gap-2"
          >
            <Receipt className="w-4 h-4" />
            <span>تسجيل سند قبض</span>
          </button>
        </div>
      </div>

      {/* Smart Alerts Section (Section 30) */}
      {smartAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 mb-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>التنبيهات البرمجية والرقابية الاستباقية (System Smart Alerts)</span>
              <span className="text-[11px] bg-amber-200 text-amber-900 px-2 py-0.2 rounded-full font-mono">
                {smartAlerts.length} تنبيهات
              </span>
            </div>
            <button
              onClick={() => setActiveTab('school_assistant')}
              className="text-xs text-amber-900 hover:text-amber-950 font-medium flex items-center gap-1"
            >
              <span>مركز الأوامر</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {smartAlerts.map(alert => (
              <div
                key={alert.id}
                className="bg-white/90 rounded-lg p-3 border border-amber-200 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${alert.severity === 'error' ? 'bg-[#DC2626]' : 'bg-[#EAB308]'}`} />
                    {alert.title}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{alert.description}</p>
                </div>
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="px-2 py-1 rounded text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors"
                >
                  معالجة
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary KPI Grid (Section 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الطلاب المسجلين"
          value={metrics.totalStudents}
          subtitle={`${metrics.maleStudents} ذكور · ${metrics.femaleStudents} إناث`}
          icon={GraduationCap}
          badge={{ text: `${metrics.activeStudents} نشط`, type: 'success' }}
          onClick={() => setActiveTab('students')}
        />
        <StatCard
          title="نسبة حضور اليوم"
          value={`${metrics.todayAttendanceRate}%`}
          subtitle={`${metrics.todayPresentCount} حاضر · ${metrics.todayAbsentCount} غائب`}
          icon={CheckCircle2}
          badge={{ text: metrics.todayDate, type: 'info' }}
          onClick={() => setActiveTab('attendance')}
        />
        <StatCard
          title="المبالغ المحصلة من الأقساط"
          value={`${(metrics.totalRevenueCollected ?? 0).toLocaleString()} ${settings.currency}`}
          subtitle={`المتبقي ديون: ${(metrics.totalDebtsRemaining ?? 0).toLocaleString()} ${settings.currency}`}
          icon={Wallet}
          badge={{
            text: `${Math.round(((metrics.totalRevenueCollected ?? 0) / (metrics.totalRevenueExpected || 1)) * 100)}% تحصيل`,
            type: 'warning'
          }}
          onClick={() => setActiveTab('fees')}
        />
        <StatCard
          title="المصروفات التشغيلية"
          value={`${(metrics.totalExpenses ?? 0).toLocaleString()} ${settings.currency}`}
          subtitle={`صافي السيولة: ${(metrics.netCashFlow ?? 0).toLocaleString()} ${settings.currency}`}
          icon={TrendingUp}
          badge={{ text: 'تحت السيطرة', type: 'info' }}
          onClick={() => setActiveTab('expenses')}
        />
      </div>

      {/* Middle Section: Financial Progress & Attendance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance & Demographics Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 font-['Alexandria',sans-serif]">
              حالة الحضور والدوام اليوم
            </h2>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs text-[#2563EB] hover:underline font-semibold"
            >
              سجل الحضور
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">نسبة الحضور الرسمية</span>
                <span className="font-bold text-[#16A34A]">{metrics.todayAttendanceRate}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#16A34A] rounded-full transition-all duration-300"
                  style={{ width: `${metrics.todayAttendanceRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="text-[10px] text-emerald-800 font-medium">حاضر</div>
                <div className="text-base font-bold text-[#16A34A] font-mono">{metrics.todayPresentCount}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100">
                <div className="text-[10px] text-rose-800 font-medium">غائب</div>
                <div className="text-base font-bold text-[#DC2626] font-mono">{metrics.todayAbsentCount}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                <div className="text-[10px] text-amber-800 font-medium">متأخر</div>
                <div className="text-base font-bold text-[#EAB308] font-mono">{metrics.todayLateCount}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100">
                <div className="text-[10px] text-sky-800 font-medium">بعذر</div>
                <div className="text-base font-bold text-[#0EA5E9] font-mono">{metrics.todayExcusedCount}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
              <span>خطوط النقل المشغلة:</span>
              <span className="font-semibold text-slate-800">{metrics.totalRoutes} خطوط ({metrics.transportStudentsCount} طالباً)</span>
            </div>
          </div>
        </div>

        {/* Financial Overview (Revenues, Expenses, Debts) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 font-['Alexandria',sans-serif]">
              المؤشرات المالية (الأقساط والمصروفات)
            </h2>
            <button
              onClick={() => setActiveTab('fees')}
              className="text-xs text-[#2563EB] hover:underline font-semibold"
            >
              المالية
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-600">إجمالي الأقساط المقررة:</span>
              <span className="font-bold text-slate-900 font-mono">
                {(metrics.totalRevenueExpected ?? 0).toLocaleString()} {settings.currency}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-600">المحصل فعلياً:</span>
              <span className="font-bold text-[#16A34A] font-mono">
                {(metrics.totalRevenueCollected ?? 0).toLocaleString()} {settings.currency}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-600">الديون المتبقية بذمة الطلاب:</span>
              <span className="font-bold text-[#DC2626] font-mono">
                {(metrics.totalDebtsRemaining ?? 0).toLocaleString()} {settings.currency}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50">
              <span className="text-slate-600">المصروفات التشغيلية والرواتب:</span>
              <span className="font-bold text-slate-900 font-mono">
                {(metrics.totalExpenses ?? 0).toLocaleString()} {settings.currency}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
              <span className="font-bold text-blue-900">صافي السيولة النقدية:</span>
              <span className="font-bold text-[#2563EB] font-mono text-sm">
                {(metrics.netCashFlow ?? 0).toLocaleString()} {settings.currency}
              </span>
            </div>
          </div>
        </div>

        {/* School Assistant Quick Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#2563EB] text-xs font-bold mb-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>School Assistant</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 font-['Alexandria',sans-serif]">
              مساعد المدرسة (مركز الأوامر البرمجية)
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              مركز استعلامات وأوامر برمجية مباشرة: جرد الطلبة، موقف حضور اليوم، كشف الأقساط المتبقية، إحصاءات الكادر التدريسي والنتائج مستخرجة مباشرة من قاعدة البيانات.
            </p>

            <div className="mt-4 space-y-1.5">
              <button
                onClick={() => setActiveTab('school_assistant')}
                className="w-full text-right p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2563EB] text-xs text-slate-700 transition-colors border border-slate-100 flex items-center justify-between"
              >
                <span>«جرد جميع الطلبة في المدرسة وموقف الدوام»</span>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setActiveTab('school_assistant')}
                className="w-full text-right p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2563EB] text-xs text-slate-700 transition-colors border border-slate-100 flex items-center justify-between"
              >
                <span>«كشف الأقساط المتبقية والطلبة المتأخرين بالسداد»</span>
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('school_assistant')}
            className="mt-4 w-full py-2 bg-[#1E3A8A] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>فتح مركز أوامر مساعد المدرسة</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
