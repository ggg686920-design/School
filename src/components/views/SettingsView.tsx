/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Settings View — Section 3 & Section 38: إعدادات المدرسة وهوية النظام
 * يتم هنا تعديل اسم المدرسة ديناميكياً ليظهر في كافة الواجهات والشهادات والوصولات
 */

import React, { useState } from 'react';
import { Settings, Save, School, Database, Shield, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolSettings } from '../../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToDefault } = useSchool();
  const [formData, setFormData] = useState<SchoolSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = async () => {
    if (confirm('هل أنت متأكد من إعادة ضبط بيانات النظام إلى الإعدادات الافتراضية؟')) {
      await resetToDefault();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            إعدادات المدرسة والهوية الرسمية
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            تعديل اسم المدرسة، بيانات التواصل، السنة الدراسية، وبنية قاعدة البيانات
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة البيانات الافتراضية</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ وتحديث هوية المدرسة بنجاح في جميع أقسام النظام!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6 text-xs">
        {/* School Name & Basic Identity */}
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E3A8A] font-['Alexandria',sans-serif] pb-2 border-b border-slate-100 mb-4">
            <School className="w-4 h-4" />
            <span>هوية ومسمى المدرسة (يظهر تلقائياً في الشهادات، الإيصالات، والترويسة)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">اسم المدرسة الرسمي *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-hidden focus:border-[#2563EB] text-sm font-bold text-slate-900"
                placeholder="ثانوية نور الكمال"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                تغيير هذا الاسم يحدث مباشرة في شريط التنقل، الشهادات المطبوعة، وسندات القبض.
              </span>
            </div>

            <div>
              <label className="block text-slate-600 mb-1">اسم مدير المدرسة المعتمد</label>
              <input
                type="text"
                value={formData.principalName}
                onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">السنة الدراسية الحالية</label>
              <input
                type="text"
                value={formData.currentAcademicYear}
                onChange={e => setFormData({ ...formData, currentAcademicYear: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB] font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">العملة المعتمدة في النظام</label>
              <input
                type="text"
                value={formData.currency}
                onChange={e => setFormData({ ...formData, currency: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">أوقات الدوام الرسمي</label>
              <input
                type="text"
                value={formData.workHours}
                onChange={e => setFormData({ ...formData, workHours: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* Contact & Location Info */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 mb-4">
            معلومات التواصل والعنوان الجغرافي
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 mb-1">المحافظة</label>
              <input
                type="text"
                value={formData.province}
                onChange={e => setFormData({ ...formData, province: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">المدينة / القضاء</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 mb-1">العنوان التفصيلي</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">رقم الهاتف الرسمي</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB] font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">البريد الإلكتروني الرسمي</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Firebase Architecture Readiness Box (Section 40) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-xs">
              <Database className="w-4 h-4 text-[#2563EB]" />
              <span>جاهزية بنية Firebase Architecture (Section 2 & 40)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              تم بناء طبقة البيانات بنمط Repository Pattern المستقل تماماً (UI → Business Logic → Repository → Database Provider).
              التطبيق يعمل حالياً عبر Local Storage Provider المترابط، وهو مهيأ ومطابق 100% للربط المباشر مع:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-semibold text-blue-900">
              <div className="p-2 bg-white rounded border border-blue-100 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Firebase Auth</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-100 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Cloud Firestore</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-100 flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5 text-amber-600" />
                <span>Firebase Storage</span>
              </div>
              <div className="p-2 bg-white rounded border border-blue-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                <span>FCM Messaging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>حفظ وتطبيق التغييرات</span>
          </button>
        </div>
      </form>
    </div>
  );
};
