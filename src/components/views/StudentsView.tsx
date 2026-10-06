/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Students View — Section 11: إدارة ملفات الطلاب الشاملة
 */

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  User,
  HeartPulse,
  Users2,
  FileText,
  CreditCard,
  Award,
  CheckCircle2,
  Printer,
  ChevronLeft,
  X,
  Phone,
  Calendar,
  MapPin,
  Trash2,
  Edit
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Student } from '../../types';
import { Modal } from '../common/Modal';

interface StudentsViewProps {
  initialOpenAdd?: boolean;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ initialOpenAdd = false }) => {
  const { db, schoolService, settings, selectedStudentId, setSelectedStudentId, refreshData } = useSchool();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  
  // Profile Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'info' | 'health' | 'parent' | 'finance' | 'grades' | 'attendance' | 'docs'>('info');
  const [studentProfileData, setStudentProfileData] = useState<any>(null);

  // Add/Edit Student Modal
  const [addModalOpen, setAddModalOpen] = useState(initialOpenAdd);
  const [formData, setFormData] = useState<Partial<Student>>({
    fullName: '',
    fatherName: '',
    motherName: '',
    birthDate: '2008-01-01',
    gender: 'male',
    nationality: 'عراقي',
    bloodType: 'O+',
    nationalId: '',
    phone: '',
    email: '',
    address: 'بغداد',
    district: '',
    province: 'بغداد',
    stage: 'إعدادي',
    gradeId: 'cls-6',
    gradeName: 'السادس العلمي (الوزاري)',
    sectionId: 'sec-1',
    sectionName: 'أ',
    academicYear: '2025-2026',
    registrationDate: '2025-09-01',
    status: 'active',
    gpa: 90,
    rank: 1,
    healthStatus: 'سليم',
    allergies: 'لا يوجد',
    chronicDiseases: 'لا يوجد',
    medications: 'لا يوجد',
    emergencyContact: '',
    parentId: 'prt-1',
    parentName: '',
    parentPhone: ''
  });

  const loadStudents = async () => {
    setLoading(true);
    const list = await db.getStudents();
    setStudents(list);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const openStudentDetails = async (id: string) => {
    setSelectedStudentId(id);
    const profile = await schoolService.getStudentFullProfile(id);
    setStudentProfileData(profile);
    setProfileModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName) return;

    const newStudent: Student = {
      id: formData.id || `std-${Date.now()}`,
      studentNumber: formData.studentNumber || `${new Date().getFullYear()}01${Math.floor(10 + Math.random() * 90)}`,
      fullName: formData.fullName || '',
      fatherName: formData.fatherName || '',
      motherName: formData.motherName || '',
      avatar: formData.avatar || '',
      birthDate: formData.birthDate || '2008-01-01',
      gender: formData.gender as any || 'male',
      nationality: formData.nationality || 'عراقي',
      bloodType: formData.bloodType || 'O+',
      nationalId: formData.nationalId || '198000000000',
      phone: formData.phone || '',
      email: formData.email || '',
      address: formData.address || '',
      district: formData.district || '',
      province: formData.province || 'بغداد',
      stage: formData.stage as any || 'إعدادي',
      gradeId: formData.gradeId || 'cls-6',
      gradeName: formData.gradeName || 'السادس العلمي',
      sectionId: formData.sectionId || 'sec-1',
      sectionName: formData.sectionName || 'أ',
      academicYear: formData.academicYear || settings.currentAcademicYear,
      registrationDate: formData.registrationDate || new Date().toISOString().split('T')[0],
      status: formData.status as any || 'active',
      gpa: Number(formData.gpa) || 85,
      rank: Number(formData.rank) || 1,
      healthStatus: formData.healthStatus || 'سليم',
      allergies: formData.allergies || 'لا يوجد',
      chronicDiseases: formData.chronicDiseases || 'لا يوجد',
      medications: formData.medications || 'لا يوجد',
      emergencyContact: formData.emergencyContact || formData.phone || '',
      parentId: formData.parentId || 'prt-1',
      parentName: formData.parentName || 'ولي الأمر',
      parentPhone: formData.parentPhone || formData.phone || '',
      documents: [
        { id: `doc-${Date.now()}`, title: 'استمارة التسجيل الإلكترونية', type: 'PDF', date: new Date().toISOString().split('T')[0] }
      ]
    };

    await db.saveStudent(newStudent);
    await db.addAuditLog({
      id: `aud-${Date.now()}`,
      userName: 'إدارة المدرسة',
      userRole: 'Administrator',
      action: 'إضافة / تعديل طالب',
      department: 'شؤون الطلبة',
      affectedData: `الطالب: ${newStudent.fullName} (رقم: ${newStudent.studentNumber})`,
      timestamp: new Date().toLocaleString('ar-IQ')
    });

    setAddModalOpen(false);
    await loadStudents();
    await refreshData();
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف بيانات الطالب "${name}"؟`)) {
      await db.deleteStudent(id);
      await loadStudents();
      await refreshData();
    }
  };

  const filtered = students.filter(s => {
    const matchesSearch =
      searchQuery === '' ||
      s.fullName.includes(searchQuery) ||
      s.studentNumber.includes(searchQuery) ||
      s.phone.includes(searchQuery);
    const matchesStage = stageFilter === 'all' || s.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            إدارة شؤون الطلاب
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            سجل الطلاب المعتمد في {settings.name} — إجمالي {students.length} طالب
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              fullName: '',
              fatherName: '',
              motherName: '',
              birthDate: '2008-01-01',
              gender: 'male',
              nationality: 'عراقي',
              bloodType: 'O+',
              nationalId: '',
              phone: '',
              email: '',
              address: 'بغداد',
              district: '',
              province: 'بغداد',
              stage: 'إعدادي',
              gradeId: 'cls-6',
              gradeName: 'السادس العلمي (الوزاري)',
              sectionId: 'sec-1',
              sectionName: 'أ',
              academicYear: settings.currentAcademicYear,
              registrationDate: new Date().toISOString().split('T')[0],
              status: 'active',
              gpa: 90,
              rank: 1,
              healthStatus: 'سليم',
              allergies: 'لا يوجد',
              chronicDiseases: 'لا يوجد',
              medications: 'لا يوجد',
              emergencyContact: '',
              parentId: 'prt-1',
              parentName: '',
              parentPhone: ''
            });
            setAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طالب جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="البحث بالاسم أو الرقم التعريفي..."
            className="w-full pr-9 pl-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#2563EB] outline-hidden text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 whitespace-nowrap">المرحلة:</span>
          {['all', 'إعدادي', 'متوسط', 'ابتدائي'].map(st => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-3 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                stageFilter === st
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'جميع المراحل' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">رقم الطالب</th>
                <th className="py-3 px-4">الاسم الكامل</th>
                <th className="py-3 px-4">الصف والشعبة</th>
                <th className="py-3 px-4">المعدل العام</th>
                <th className="py-3 px-4">ولي الأمر</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-500">{s.studentNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{s.fullName}</div>
                    <div className="text-[11px] text-slate-400">هاتف: {s.phone || 'غير مسجل'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800">{s.gradeName}</span>
                    <span className="text-slate-400"> (شعبة {s.sectionName})</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-[#16A34A] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                      {s.gpa}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{s.parentName}</div>
                    <div className="text-[11px] text-slate-400">{s.parentPhone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      مستمر في الدوام
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openStudentDetails(s.id)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded text-xs font-semibold transition-colors"
                      >
                        الملف الكامل
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s.id, s.fullName)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="حذف الطالب"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Student Profile Modal (Section 11) */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title={studentProfileData?.student?.fullName || 'ملف الطالب'}
        subtitle={`رقم الطالب: ${studentProfileData?.student?.studentNumber} · ${studentProfileData?.student?.gradeName}`}
        maxWidth="4xl"
      >
        {studentProfileData && (
          <div className="space-y-4">
            {/* Modal Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveProfileTab('info')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeProfileTab === 'info' ? 'bg-[#2563EB] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                البيانات الشخصية
              </button>
              <button
                onClick={() => setActiveProfileTab('health')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeProfileTab === 'health' ? 'bg-[#2563EB] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                البيانات الصحية
              </button>
              <button
                onClick={() => setActiveProfileTab('parent')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeProfileTab === 'parent' ? 'bg-[#2563EB] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                ولي الأمر
              </button>
              <button
                onClick={() => setActiveProfileTab('finance')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeProfileTab === 'finance' ? 'bg-[#2563EB] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                الأقساط والمدفوعات
              </button>
              <button
                onClick={() => setActiveProfileTab('grades')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeProfileTab === 'grades' ? 'bg-[#2563EB] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                الدرجات والشهادات
              </button>
              <button
                onClick={() => setActiveProfileTab('attendance')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeProfileTab === 'attendance' ? 'bg-[#2563EB] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                الحضور والغياب
              </button>
              <button
                onClick={() => setActiveProfileTab('docs')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeProfileTab === 'docs' ? 'bg-[#2563EB] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                المستمسكات والوثائق
              </button>
            </div>

            {/* Tab 1: Personal Info */}
            {activeProfileTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg space-y-2 border border-slate-200">
                  <div className="font-bold text-slate-800 border-b border-slate-200 pb-1">المعلومات الشخصية</div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">اسم الأب:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">اسم الأم:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.motherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">تاريخ الميلاد:</span>
                    <span className="font-semibold text-slate-800 font-mono">{studentProfileData.student.birthDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">الجنسية وفصيلة الدم:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.nationality} ({studentProfileData.student.bloodType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">الرقم الوطني الموحد:</span>
                    <span className="font-semibold text-slate-800 font-mono">{studentProfileData.student.nationalId}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg space-y-2 border border-slate-200">
                  <div className="font-bold text-slate-800 border-b border-slate-200 pb-1">المعلومات الدراسية والسكن</div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">المرحلة والصف:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.gradeName} - الشعبة {studentProfileData.student.sectionName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">السنة وتاريخ التسجيل:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.academicYear} · {studentProfileData.student.registrationDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">المعدل العام:</span>
                    <span className="font-bold text-[#16A34A] font-mono">{studentProfileData.student.gpa}% (الترتيب: {studentProfileData.student.rank})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">العنوان:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">خط النقل المدرسي:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.route ? studentProfileData.route.name : 'لا يستخدم النقل'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Health Info */}
            {activeProfileTab === 'health' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span>الملف الصحي للطالب</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">الحالة الصحية العامة:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.healthStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">الحساسية المعروفة:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.allergies}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">الأمراض المزمنة:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.chronicDiseases}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">الأدوية الدورية:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.medications}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block">جهة الاتصال للطوارئ:</span>
                    <span className="font-bold text-rose-700">{studentProfileData.student.emergencyContact}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Guardian */}
            {activeProfileTab === 'parent' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-2">بيانات ولي الأمر المعتمد</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">الاسم الرباعي:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.student.parentName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">رقم الهاتف:</span>
                    <span className="font-semibold text-slate-800 font-mono">{studentProfileData.student.parentPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">المهنة:</span>
                    <span className="font-semibold text-slate-800">{studentProfileData.parent?.job || 'موظف'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">البريد الإلكتروني:</span>
                    <span className="font-semibold text-slate-800 font-mono">{studentProfileData.parent?.email || 'لا يوجد'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Finance & Fees */}
            {activeProfileTab === 'finance' && (
              <div className="space-y-4 text-xs">
                <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-slate-600">إجمالي القسط الدراسي للعام {settings.currentAcademicYear}:</div>
                    <div className="text-xl font-bold text-[#2563EB] font-mono mt-1">
                      {studentProfileData.fee?.totalFee.toLocaleString() || '2,500,000'} {settings.currency}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-slate-600">المبلغ المسدد:</div>
                    <div className="text-lg font-bold text-[#16A34A] font-mono">
                      {studentProfileData.fee?.paidAmount.toLocaleString() || '0'} {settings.currency}
                    </div>
                    <div className="text-[11px] text-[#DC2626]">
                      المتبقي: {studentProfileData.fee?.remainingAmount.toLocaleString() || '0'} {settings.currency}
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-slate-100 p-2.5 font-bold text-slate-800">سندات القبض الصادرة للطالب</div>
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="p-2">رقم السند</th>
                        <th className="p-2">المبلغ</th>
                        <th className="p-2">السبب</th>
                        <th className="p-2">التاريخ</th>
                        <th className="p-2">طريقة الدفع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentProfileData.receipts?.map((r: any) => (
                        <tr key={r.id}>
                          <td className="p-2 font-mono font-medium">{r.receiptNumber}</td>
                          <td className="p-2 font-mono font-bold text-emerald-600">{r.amount.toLocaleString()} د.ع</td>
                          <td className="p-2">{r.reason}</td>
                          <td className="p-2 font-mono text-slate-400">{r.date}</td>
                          <td className="p-2">{r.paymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 5: Grades */}
            {activeProfileTab === 'grades' && (
              <div className="space-y-3 text-xs">
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-2.5">المادة</th>
                        <th className="p-2.5">الفصل / الامتحان</th>
                        <th className="p-2.5">الدرجة</th>
                        <th className="p-2.5">الدرجة العظمى</th>
                        <th className="p-2.5">التقدير</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentProfileData.grades?.map((g: any) => (
                        <tr key={g.id}>
                          <td className="p-2.5 font-bold text-slate-900">{g.subjectName}</td>
                          <td className="p-2.5 text-slate-600">{g.semester}</td>
                          <td className="p-2.5 font-mono font-bold text-[#16A34A]">{g.score}</td>
                          <td className="p-2.5 font-mono text-slate-400">{g.maxScore}</td>
                          <td className="p-2.5 font-medium text-emerald-700">امتياز</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 6: Attendance */}
            {activeProfileTab === 'attendance' && (
              <div className="space-y-3 text-xs">
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="p-2.5">التاريخ</th>
                        <th className="p-2.5">الحالة</th>
                        <th className="p-2.5">ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentProfileData.attendance?.map((a: any) => (
                        <tr key={a.id}>
                          <td className="p-2.5 font-mono font-medium">{a.date}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              a.status === 'present' ? 'bg-emerald-50 text-emerald-700' :
                              a.status === 'absent' ? 'bg-rose-50 text-rose-700' :
                              a.status === 'late' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'
                            }`}>
                              {a.status === 'present' ? '🟢 حاضر' : a.status === 'absent' ? '🔴 غائب' : a.status === 'late' ? '🟡 متأخر' : '🔵 بعذر'}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-500">{a.note || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 7: Documents */}
            {activeProfileTab === 'docs' && (
              <div className="space-y-2 text-xs">
                {studentProfileData.student.documents?.map((doc: any) => (
                  <div key={doc.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#2563EB]" />
                      <span className="font-semibold text-slate-800">{doc.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{doc.type} · {doc.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="تسجيل طالب جديد في النظام"
        subtitle={`إضافة طالب معتمد في ${settings.name}`}
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">الاسم الكامل للطالب *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="مثال: يحيى عمار شاكر"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">اسم الأب والجد</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="عمار شاكر البدري"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">اسم الأم الثلاثي</label>
              <input
                type="text"
                value={formData.motherName}
                onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="هناء عبد الجبار"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">المرحلة الدراسية</label>
              <select
                value={formData.stage}
                onChange={e => setFormData({ ...formData, stage: e.target.value as any })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              >
                <option value="إعدادي">إعدادي</option>
                <option value="متوسط">متوسط</option>
                <option value="ابتدائي">ابتدائي</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 mb-1">الصف</label>
              <input
                type="text"
                value={formData.gradeName}
                onChange={e => setFormData({ ...formData, gradeName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="السادس العلمي"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">الشعبة</label>
              <input
                type="text"
                value={formData.sectionName}
                onChange={e => setFormData({ ...formData, sectionName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="أ أو ب أو ج"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">اسم ولي الأمر</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="عمار شاكر"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">هاتف التواصل / ولي الأمر</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value, parentPhone: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="07701234567"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">عنوان السكن</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                placeholder="بغداد - المنصور"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">المعدل المبدئي / التقديري</label>
              <input
                type="number"
                value={formData.gpa}
                onChange={e => setFormData({ ...formData, gpa: Number(e.target.value) })}
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
              حفظ الطالب في النظام
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
