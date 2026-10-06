/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Teachers View — Section 12: إدارة المدرسين والكوادر التعليمية
 */

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Search, Mail, Phone, BookOpen, Layers, Award, Calendar, DollarSign, Trash2 } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Teacher } from '../../types';
import { Modal } from '../common/Modal';

export const TeachersView: React.FC = () => {
  const { db, settings, refreshData } = useSchool();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState<Partial<Teacher>>({
    fullName: '',
    specialty: '',
    qualification: 'بكالوريوس',
    university: 'جامعة بغداد',
    graduationYear: '2015',
    phone: '',
    email: '',
    address: 'بغداد',
    nationalId: '198500000000',
    contractType: 'دائمي',
    workHours: 20,
    basicSalary: 1300000,
    allowances: 150000,
    bonuses: 50000,
    deductions: 0,
    advances: 0,
    netSalary: 1500000,
    status: 'active',
    leavesCount: 0
  });

  const loadTeachers = async () => {
    const list = await db.getTeachers();
    setTeachers(list);
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) return;

    const basic = Number(formData.basicSalary) || 1200000;
    const allowances = Number(formData.allowances) || 0;
    const bonuses = Number(formData.bonuses) || 0;
    const deductions = Number(formData.deductions) || 0;
    const net = basic + allowances + bonuses - deductions;

    const newTeacher: Teacher = {
      id: formData.id || `tch-${Date.now()}`,
      fullName: formData.fullName || '',
      avatar: '',
      birthDate: '1985-01-01',
      phone: formData.phone || '',
      email: formData.email || '',
      address: formData.address || '',
      nationalId: formData.nationalId || '',
      qualification: formData.qualification || 'بكالوريوس',
      specialty: formData.specialty || 'مادة عامة',
      university: formData.university || 'جامعة بغداد',
      graduationYear: formData.graduationYear || '2015',
      hireDate: new Date().toISOString().split('T')[0],
      contractType: formData.contractType as any || 'دائمي',
      subjectIds: [],
      classIds: [],
      workHours: Number(formData.workHours) || 20,
      basicSalary: basic,
      allowances,
      bonuses,
      deductions,
      advances: 0,
      netSalary: net,
      status: 'active',
      leavesCount: 0
    };

    await db.saveTeacher(newTeacher);
    await db.addAuditLog({
      id: `aud-${Date.now()}`,
      userName: 'المدير العام',
      userRole: 'Administrator',
      action: 'إضافة / تحديث مدرس',
      department: 'الكادر التدريسي',
      affectedData: `المدرس: ${newTeacher.fullName} (تخصص: ${newTeacher.specialty})`,
      timestamp: new Date().toLocaleString('ar-IQ')
    });

    setAddModalOpen(false);
    await loadTeachers();
    await refreshData();
  };

  const handleDeleteTeacher = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف بيانات الأستاذ "${name}"؟`)) {
      await db.deleteTeacher(id);
      await loadTeachers();
      await refreshData();
    }
  };

  const filtered = teachers.filter(t =>
    searchQuery === '' ||
    t.fullName.includes(searchQuery) ||
    t.specialty.includes(searchQuery) ||
    t.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            إدارة المدرسين والكوادر التعليمية
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            الكادر التدريسي المعتمد لـ {settings.name} — {teachers.length} مدرسين ومدرسات
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              fullName: '',
              specialty: '',
              qualification: 'بكالوريوس',
              university: 'جامعة بغداد',
              graduationYear: '2015',
              phone: '',
              email: '',
              address: 'بغداد',
              nationalId: '',
              contractType: 'دائمي',
              workHours: 20,
              basicSalary: 1300000,
              allowances: 150000,
              bonuses: 50000,
              deductions: 0,
              advances: 0,
              netSalary: 1500000,
              status: 'active',
              leavesCount: 0
            });
            setAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مدرس جديد</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو التخصص الأكاديمي..."
            className="w-full pr-9 pl-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#2563EB] outline-hidden text-slate-800"
          />
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:border-blue-200 transition-colors">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center justify-center font-bold text-base">
                    {t.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{t.fullName}</h3>
                    <p className="text-xs text-amber-600 font-semibold">{t.specialty}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t.contractType}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">المؤهل العلمي:</span>
                  <span className="font-medium text-slate-800">{t.qualification} · {t.university}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ساعات العمل الأسبوعية:</span>
                  <span className="font-medium text-slate-800 font-mono">{t.workHours} ساعة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الراتب الصافي:</span>
                  <span className="font-bold text-[#16A34A] font-mono">{t.netSalary.toLocaleString()} {settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">الهاتف:</span>
                  <span className="font-mono text-slate-700">{t.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">الإجازات: {t.leavesCount} أيام</span>
              <button
                onClick={() => handleDeleteTeacher(t.id, t.fullName)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                title="حذف المدرس"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="إضافة مدرس جديد إلى الكادر"
        subtitle={`إدراج عضو هيئة تدريس في ${settings.name}`}
      >
        <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">الاسم الكامل *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="أ. محمد جاسم"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">التخصص الدقيق والمادة *</label>
              <input
                type="text"
                required
                value={formData.specialty}
                onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="الفيزياء / الكيمياء / الرياضيات"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">المؤهل الأكاديمي</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="ماجستير / بكالوريوس"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">الجامعة المتخرج منها</label>
              <input
                type="text"
                value={formData.university}
                onChange={e => setFormData({ ...formData, university: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="جامعة بغداد - كلية العلوم"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">رقم الهاتف</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="07701234567"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">الراتب الأساسي (د.ع)</label>
              <input
                type="number"
                value={formData.basicSalary}
                onChange={e => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-xs"
            >
              حفظ المدرس
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
