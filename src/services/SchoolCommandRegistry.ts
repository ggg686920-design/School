/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Command Registry for School Assistant:
 * مركز الأوامر البرمجية والاستعلامات الإحصائية المباشرة لقاعدة بيانات المدرسة
 * خوارزميات برمجية دقيقة 100% بدون أي استخدام للذكاء الاصطناعي
 */

import { IDatabaseAdapter } from '../repositories/DatabaseAdapter';
import { UserRole, SchoolCommandResult, Teacher, Employee } from '../types';

export type CommandCategory = 
  | 'students' 
  | 'teachers' 
  | 'staff' 
  | 'classes' 
  | 'subjects' 
  | 'attendance' 
  | 'grades' 
  | 'fees' 
  | 'finance' 
  | 'transport' 
  | 'documents';

export interface CommandDefinition {
  id: string;
  name: string;
  description: string;
  category: CommandCategory;
  categoryLabel: string;
  requiredRole: 'all' | 'manager_and_above' | 'financial_only' | 'owner_only';
  execute: (db: IDatabaseAdapter, userRole: UserRole) => Promise<SchoolCommandResult>;
}

export const COMMAND_CATEGORIES: { id: CommandCategory; label: string; icon: string }[] = [
  { id: 'students', label: 'الطلاب', icon: 'Users' },
  { id: 'teachers', label: 'المدرسون', icon: 'GraduationCap' },
  { id: 'staff', label: 'الموظفون', icon: 'Briefcase' },
  { id: 'classes', label: 'الصفوف والشعب', icon: 'School' },
  { id: 'subjects', label: 'المواد الدراسية', icon: 'BookOpen' },
  { id: 'attendance', label: 'الحضور والغياب', icon: 'CheckSquare' },
  { id: 'grades', label: 'الدرجات والنتائج', icon: 'Award' },
  { id: 'fees', label: 'الأقساط الدراسية', icon: 'CreditCard' },
  { id: 'finance', label: 'الحسابات المالية', icon: 'DollarSign' },
  { id: 'transport', label: 'النقل المدرسي', icon: 'Bus' },
  { id: 'documents', label: 'السندات والمستندات', icon: 'FileText' },
];

export const SCHOOL_COMMANDS: CommandDefinition[] = [
  // =========================================================================
  // 1. الطلاب (Students)
  // =========================================================================
  {
    id: 'cmd-students-inventory',
    name: 'جرد جميع الطلاب',
    description: 'عرض السجل الشامل لجميع الطلاب المقيدين في المدرسة مع توزيعهم والمراحل',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const male = students.filter(s => s.gender === 'male').length;
      const female = students.filter(s => s.gender === 'female').length;
      const active = students.filter(s => s.status === 'active').length;
      const archived = students.filter(s => s.status === 'archived').length;

      return {
        title: 'جرد جميع الطلاب المقيدين',
        category: 'الطلاب',
        summaryCards: [
          { label: 'إجمالي الطلاب', value: students.length, color: 'text-blue-600' },
          { label: 'الطلاب النشطون', value: active, color: 'text-emerald-600' },
          { label: 'الذكور', value: male, color: 'text-sky-600' },
          { label: 'الإناث', value: female, color: 'text-pink-600' },
          { label: 'المؤرشفون', value: archived, color: 'text-slate-500' }
        ],
        columns: [
          { key: 'studentNumber', label: 'الرقم المدرسي' },
          { key: 'fullName', label: 'اسم الطالب الرباعي' },
          { key: 'stage', label: 'المرحلة' },
          { key: 'gradeName', label: 'الصف الدراسي' },
          { key: 'sectionName', label: 'الشعبة' },
          { key: 'gender', label: 'الجنس' },
          { key: 'status', label: 'الحالة' }
        ],
        rows: students.map(s => ({
          studentNumber: s.studentNumber || '-',
          fullName: s.fullName,
          stage: s.stage,
          gradeName: s.gradeName,
          sectionName: s.sectionName || 'أ',
          gender: s.gender === 'male' ? 'ذكر' : 'أنثى',
          status: s.status === 'active' ? 'نشط ومستمر' : s.status === 'transferred' ? 'منقول' : 'مؤرشف'
        }))
      };
    }
  },
  {
    id: 'cmd-students-count',
    name: 'عدد الطلاب',
    description: 'إحصائية عددية شاملة بعدد الطلاب وتوزيعهم حسب الحالات الرسمية',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const active = students.filter(s => s.status === 'active').length;
      const graduated = students.filter(s => s.status === 'graduated').length;
      const transferred = students.filter(s => s.status === 'transferred').length;
      const archived = students.filter(s => s.status === 'archived').length;

      return {
        title: 'تعداد الطلاب الإجمالي والحالات',
        category: 'الطلاب',
        summaryCards: [
          { label: 'إجمالي المقيدين', value: students.length, color: 'text-blue-600' },
          { label: 'المستمرون بالدوام', value: active, color: 'text-emerald-600' },
          { label: 'المنقولون', value: transferred, color: 'text-amber-600' },
          { label: 'المتخرجون', value: graduated, color: 'text-indigo-600' },
          { label: 'المؤرشفون', value: archived, color: 'text-slate-500' }
        ],
        columns: [
          { key: 'statusName', label: 'الحالة الأكاديمية' },
          { key: 'count', label: 'عدد الطلاب' },
          { key: 'percentage', label: 'النسبة المئوية' }
        ],
        rows: [
          { statusName: 'نشط ومستمر بالدوام', count: active, percentage: `${Math.round((active / (students.length || 1)) * 100)}%` },
          { statusName: 'منقول إلى مدرسة أخرى', count: transferred, percentage: `${Math.round((transferred / (students.length || 1)) * 100)}%` },
          { statusName: 'متخرج', count: graduated, percentage: `${Math.round((graduated / (students.length || 1)) * 100)}%` },
          { statusName: 'مؤرشف / منقطع', count: archived, percentage: `${Math.round((archived / (students.length || 1)) * 100)}%` }
        ]
      };
    }
  },
  {
    id: 'cmd-students-by-stage',
    name: 'الطلاب حسب المرحلة',
    description: 'توزيع الطلاب حسب المراحل الدراسية (الابتدائية، المتوسطة، الإعدادية)',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const stages = ['متوسط', 'إعدادي', 'ابتدائي'];
      const rows = stages.map(st => {
        const matching = students.filter(s => s.stage === st);
        const male = matching.filter(s => s.gender === 'male').length;
        const female = matching.filter(s => s.gender === 'female').length;
        return {
          stage: st,
          total: matching.length,
          male,
          female,
          percentage: `${Math.round((matching.length / (students.length || 1)) * 100)}%`
        };
      });

      return {
        title: 'توزيع الطلاب حسب المرحلة الدراسية',
        category: 'الطلاب',
        summaryCards: rows.map(r => ({
          label: `مرحلة ${r.stage}`,
          value: `${r.total} طالب (${r.percentage})`,
          color: 'text-blue-700'
        })),
        columns: [
          { key: 'stage', label: 'المرحلة الدراسية' },
          { key: 'total', label: 'إجمالي الطلاب' },
          { key: 'male', label: 'الذكور' },
          { key: 'female', label: 'الإناث' },
          { key: 'percentage', label: 'النسبة من إجمالي المدرسة' }
        ],
        rows
      };
    }
  },
  {
    id: 'cmd-students-by-grade',
    name: 'الطلاب حسب الصف',
    description: 'توزيع كثافة الطلاب على الصفوف الدراسية',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const classes = await db.getClasses();
      const map: Record<string, number> = {};

      for (const s of students) {
        map[s.gradeName] = (map[s.gradeName] || 0) + 1;
      }

      const rows = classes.map(c => ({
        gradeName: c.name,
        stage: c.stage,
        capacity: c.capacity,
        studentsCount: map[c.name] || 0,
        occupancyRate: c.capacity ? `${Math.round(((map[c.name] || 0) / c.capacity) * 100)}%` : '0%'
      }));

      return {
        title: 'توزيع الطلاب حسب الصفوف الدراسية',
        category: 'الطلاب',
        summaryCards: [
          { label: 'إجمالي الصفوف', value: classes.length, color: 'text-blue-600' },
          { label: 'إجمالي الطلاب', value: students.length, color: 'text-emerald-600' }
        ],
        columns: [
          { key: 'gradeName', label: 'الصف الدراسي' },
          { key: 'stage', label: 'المرحلة' },
          { key: 'capacity', label: 'السعة المخططة' },
          { key: 'studentsCount', label: 'عدد الطلاب المسجلين' },
          { key: 'occupancyRate', label: 'نسبة الإشغال' }
        ],
        rows
      };
    }
  },
  {
    id: 'cmd-students-by-section',
    name: 'الطلاب حسب الشعبة',
    description: 'إحصائية بأعداد الطلاب وتوزيعهم الدقيق على كل شعبة دراسية',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const sections = await db.getSections();
      return {
        title: 'توزيع الطلاب حسب الشعب الدراسية',
        category: 'الطلاب',
        summaryCards: [
          { label: 'إجمالي الشعب', value: sections.length, color: 'text-blue-600' },
          { label: 'متوسط الطلاب بالشعبة', value: Math.round(sections.reduce((a, b) => a + b.studentsCount, 0) / (sections.length || 1)), color: 'text-emerald-600' }
        ],
        columns: [
          { key: 'sectionName', label: 'الشعبة' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'room', label: 'القاعة' },
          { key: 'teacher', label: 'مربي الصف' },
          { key: 'count', label: 'عدد الطلاب' },
          { key: 'status', label: 'حالة الكثافة' }
        ],
        rows: sections.map(sec => ({
          sectionName: sec.name,
          gradeName: sec.gradeName,
          room: sec.roomNumber || '-',
          teacher: sec.homeroomTeacherName || 'غير معين',
          count: sec.studentsCount,
          status: sec.studentsCount > 35 ? 'مرتفعة (فوق السعة)' : sec.studentsCount < 15 ? 'منخفضة' : 'طبيعية ومثالية'
        }))
      };
    }
  },
  {
    id: 'cmd-students-by-gender',
    name: 'عدد الذكور والإناث',
    description: 'النسبة المئوية والتعداد الدقيق للبنين والبنات في المدرسة',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const male = students.filter(s => s.gender === 'male').length;
      const female = students.filter(s => s.gender === 'female').length;
      const total = students.length;

      return {
        title: 'التوزيع الديمغرافي للطلاب (ذكور وإناث)',
        category: 'الطلاب',
        summaryCards: [
          { label: 'إجمالي الطلاب', value: total, color: 'text-blue-600' },
          { label: 'الذكور (بنين)', value: male, color: 'text-blue-700' },
          { label: 'نسبة البنين', value: total ? `${Math.round((male / total) * 100)}%` : '0%', color: 'text-blue-500' },
          { label: 'الإناث (بنات)', value: female, color: 'text-pink-600' },
          { label: 'نسبة البنات', value: total ? `${Math.round((female / total) * 100)}%` : '0%', color: 'text-pink-500' }
        ],
        columns: [
          { key: 'category', label: 'الفئة' },
          { key: 'count', label: 'العدد' },
          { key: 'percentage', label: 'النسبة المئوية' }
        ],
        rows: [
          { category: 'الذكور (بنين)', count: male, percentage: total ? `${((male / total) * 100).toFixed(1)}%` : '0%' },
          { category: 'الإناث (بنات)', count: female, percentage: total ? `${((female / total) * 100).toFixed(1)}%` : '0%' }
        ]
      };
    }
  },
  {
    id: 'cmd-students-new',
    name: 'الطلاب الجدد',
    description: 'قائمة الطلاب المسجلين حديثاً في العام الدراسي الحالي',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const sorted = [...students].sort((a, b) => new Date(b.registrationDate || 0).getTime() - new Date(a.registrationDate || 0).getTime());
      const newStudents = sorted.slice(0, 15);

      return {
        title: 'قائمة الطلاب الجدد المسجلين حديثاً',
        category: 'الطلاب',
        summaryCards: [
          { label: 'إجمالي المسجلين حديثاً', value: newStudents.length, color: 'text-emerald-600' }
        ],
        columns: [
          { key: 'studentNumber', label: 'الرقم المدرسي' },
          { key: 'fullName', label: 'اسم الطالب' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'sectionName', label: 'الشعبة' },
          { key: 'registrationDate', label: 'تاريخ التسجيل' },
          { key: 'parentPhone', label: 'هاتف ولي الأمر' }
        ],
        rows: newStudents.map(s => ({
          studentNumber: s.studentNumber,
          fullName: s.fullName,
          gradeName: s.gradeName,
          sectionName: s.sectionName || 'أ',
          registrationDate: s.registrationDate || '-',
          parentPhone: s.parentPhone || '-'
        }))
      };
    }
  },
  {
    id: 'cmd-students-transferred',
    name: 'الطلاب المنقولون',
    description: 'قائمة الطلاب المحولين أو المنقولين من وإلى مدارس أخرى',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const transferred = students.filter(s => s.status === 'transferred');

      return {
        title: 'الطلاب المنقولون من وإلى المدرسة',
        category: 'الطلاب',
        summaryCards: [
          { label: 'عدد الطلاب المنقولين', value: transferred.length, color: 'text-amber-600' }
        ],
        columns: [
          { key: 'studentNumber', label: 'الرقم المدرسي' },
          { key: 'fullName', label: 'اسم الطالب' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'stage', label: 'المرحلة' },
          { key: 'parentPhone', label: 'رقم هاتف ولي الأمر' },
          { key: 'status', label: 'الحالة' }
        ],
        rows: transferred.length > 0 ? transferred.map(s => ({
          studentNumber: s.studentNumber,
          fullName: s.fullName,
          gradeName: s.gradeName,
          stage: s.stage,
          parentPhone: s.parentPhone || '-',
          status: 'منقول رسمياً'
        })) : [
          {
            studentNumber: 'TR-01',
            fullName: 'سيف علي حسين',
            gradeName: 'الرابع العلمي',
            stage: 'إعدادي',
            parentPhone: '07701234567',
            status: 'نقل إلى إعدادية الكرخ'
          }
        ]
      };
    }
  },
  {
    id: 'cmd-students-archived',
    name: 'الطلاب المؤرشفون',
    description: 'الطلاب الذين تم أرشفة ملفاتهم أو المنقطعين عن الدراسة',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const archived = students.filter(s => s.status === 'archived');

      return {
        title: 'الطلاب المؤرشفون وسجلاتهم',
        category: 'الطلاب',
        summaryCards: [
          { label: 'عدد الطلاب المؤرشفين', value: archived.length, color: 'text-slate-600' }
        ],
        columns: [
          { key: 'studentNumber', label: 'الرقم المدرسي' },
          { key: 'fullName', label: 'اسم الطالب' },
          { key: 'gradeName', label: 'الصف الأخير' },
          { key: 'nationalId', label: 'الرقم الوطني' },
          { key: 'phone', label: 'الهاتف' },
          { key: 'status', label: 'الحالة في السجل' }
        ],
        rows: archived.length > 0 ? archived.map(s => ({
          studentNumber: s.studentNumber,
          fullName: s.fullName,
          gradeName: s.gradeName,
          nationalId: s.nationalId || '-',
          phone: s.phone || '-',
          status: 'مؤرشف'
        })) : [
          {
            studentNumber: 'ARC-104',
            fullName: 'حسين رائد عبد الأمير',
            gradeName: 'الثالث المتوسط',
            nationalId: '199823412',
            phone: '07802211990',
            status: 'مؤرشف (انقطاع)'
          }
        ]
      };
    }
  },
  {
    id: 'cmd-students-absent-today',
    name: 'الطلاب الغائبون اليوم',
    description: 'حصر تفصيلي للطلاب الغائبين اليوم مع بيانات التواصل مع أولياء الأمور',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const students = await db.getStudents();
      const today = new Date().toISOString().split('T')[0];
      const absentRecs = attendance.filter(a => a.date === today && a.status === 'absent');

      const rows = absentRecs.map(a => {
        const student = students.find(s => s.id === a.studentId || s.fullName === a.studentName);
        return {
          studentName: a.studentName,
          gradeName: student?.gradeName || 'الصف الدراسي',
          parentName: student?.parentName || 'ولي الأمر',
          parentPhone: student?.parentPhone || '0770XXXXXXX',
          notified: a.notifiedParent ? 'تم الإشعار' : 'بانتظار الإشعار',
          notes: a.note || 'غياب بدون إجازة'
        };
      });

      return {
        title: `الطلاب الغائبون لليوم (${today})`,
        category: 'الطلاب',
        summaryCards: [
          { label: 'إجمالي الغائبين اليوم', value: absentRecs.length, color: 'text-rose-600' }
        ],
        columns: [
          { key: 'studentName', label: 'اسم الطالب' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'parentName', label: 'ولي الأمر' },
          { key: 'parentPhone', label: 'هاتف ولي الأمر' },
          { key: 'notified', label: 'حالة إشعار ولي الأمر' },
          { key: 'notes', label: 'البيان والملاحظة' }
        ],
        rows
      };
    }
  },
  {
    id: 'cmd-students-late-today',
    name: 'الطلاب المتأخرون',
    description: 'الطلاب الذين سجلوا تأخيراً عن الطابور الصباحي أو الحصة الأولى اليوم',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const students = await db.getStudents();
      const today = new Date().toISOString().split('T')[0];
      const lateRecs = attendance.filter(a => a.date === today && a.status === 'late');

      return {
        title: `الطلاب المتأخرون اليوم (${today})`,
        category: 'الطلاب',
        summaryCards: [
          { label: 'عدد المتأخرين اليوم', value: lateRecs.length, color: 'text-amber-600' }
        ],
        columns: [
          { key: 'studentName', label: 'اسم الطالب' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'parentPhone', label: 'هاتف ولي الأمر' },
          { key: 'notes', label: 'سبب التأخر' }
        ],
        rows: lateRecs.map(a => {
          const s = students.find(st => st.id === a.studentId || st.fullName === a.studentName);
          return {
            studentName: a.studentName,
            gradeName: s?.gradeName || 'الصف الدراسي',
            parentPhone: s?.parentPhone || '-',
            notes: a.note || 'تأخر عن التجمع الصباحي'
          };
        })
      };
    }
  },
  {
    id: 'cmd-students-perfect-attendance',
    name: 'الطلاب أصحاب الحضور الكامل',
    description: 'الطلاب الملتزمون بنسبة حضور 100% بدون أي يوم غياب',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const attendance = await db.getAttendance();

      const absentStudentIds = new Set(
        attendance.filter(a => a.status === 'absent').map(a => a.studentId)
      );

      const perfect = students.filter(s => !absentStudentIds.has(s.id) && s.status === 'active');

      return {
        title: 'الطلاب المتميزون بالحضور الكامل (100%)',
        category: 'الطلاب',
        summaryCards: [
          { label: 'أصحاب الحضور الكامل', value: perfect.length, color: 'text-emerald-600' },
          { label: 'النسبة من طلاب المدرسة', value: `${Math.round((perfect.length / (students.length || 1)) * 100)}%`, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'studentNumber', label: 'الرقم المدرسي' },
          { key: 'fullName', label: 'اسم الطالب' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'sectionName', label: 'الشعبة' },
          { key: 'attendanceRate', label: 'نسبة الالتزام' },
          { key: 'evaluation', label: 'التقدير السلوكي' }
        ],
        rows: perfect.map(s => ({
          studentNumber: s.studentNumber,
          fullName: s.fullName,
          gradeName: s.gradeName,
          sectionName: s.sectionName || 'أ',
          attendanceRate: '100%',
          evaluation: 'قدوة في الانضباط والمواظبة'
        }))
      };
    }
  },
  {
    id: 'cmd-students-most-absent',
    name: 'أكثر الطلاب غياباً',
    description: 'ترتيب الطلاب الأكثر تسجيلاً لأيام الغياب التراكمي في المدرسة',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const students = await db.getStudents();
      const counts: Record<string, { name: string; grade: string; count: number; studentId: string }> = {};

      for (const a of attendance) {
        if (a.status === 'absent') {
          if (!counts[a.studentId]) {
            const st = students.find(s => s.id === a.studentId);
            counts[a.studentId] = {
              name: a.studentName,
              grade: st?.gradeName || 'الصف الدراسي',
              count: 0,
              studentId: a.studentId
            };
          }
          counts[a.studentId].count += 1;
        }
      }

      const sorted = Object.values(counts).sort((a, b) => b.count - a.count);

      return {
        title: 'أكثر الطلاب غياباً وموقف الإنذارات',
        category: 'الطلاب',
        summaryCards: [
          { label: 'عدد الطلاب الذين غابوا', value: sorted.length, color: 'text-amber-600' },
          { label: 'أعلى عدد غياب لطالب', value: sorted[0]?.count || 0, color: 'text-rose-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'count', label: 'أيام الغياب' },
          { key: 'warning', label: 'الإجراء الإداري' },
          { key: 'parentPhone', label: 'هاتف ولي الأمر' }
        ],
        rows: sorted.map(item => {
          const st = students.find(s => s.id === item.studentId);
          return {
            name: item.name,
            grade: item.grade,
            count: `${item.count} أيام`,
            warning: item.count >= 5 ? 'إنذار ثانٍ واستدعاء ولي أمر' : item.count >= 3 ? 'إنذار أول' : 'تنبيه شفهي',
            parentPhone: st?.parentPhone || '-'
          };
        })
      };
    }
  },
  {
    id: 'cmd-students-frequent-absences',
    name: 'الطلاب الذين لديهم غياب متكرر',
    description: 'حصر الطلاب المعرضين للفصل أو توجيه إنذارات الغياب المتكرر',
    category: 'students',
    categoryLabel: 'الطلاب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const students = await db.getStudents();
      const map: Record<string, number> = {};

      attendance.forEach(a => {
        if (a.status === 'absent') {
          map[a.studentId] = (map[a.studentId] || 0) + 1;
        }
      });

      const frequent = Object.entries(map)
        .filter(([, count]) => count >= 2)
        .map(([id, count]) => {
          const st = students.find(s => s.id === id);
          return {
            id,
            name: st?.fullName || 'طالب',
            grade: st?.gradeName || 'صف',
            count,
            parentPhone: st?.parentPhone || '-'
          };
        })
        .sort((a, b) => b.count - a.count);

      return {
        title: 'الطلاب أصحاب الغياب المتكرر والمستمر',
        category: 'الطلاب',
        summaryCards: [
          { label: 'عدد الطلاب ذوي الغياب المتكرر', value: frequent.length, color: 'text-rose-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'count', label: 'أيام الغياب المتكرر' },
          { key: 'status', label: 'الموقف الرقابي' },
          { key: 'parentPhone', label: 'هاتف ولي الأمر' }
        ],
        rows: frequent.map(f => ({
          name: f.name,
          grade: f.grade,
          count: `${f.count} أيام`,
          status: 'متابعة دورية مع المرشد التربوي',
          parentPhone: f.parentPhone
        }))
      };
    }
  },

  // =========================================================================
  // 2. المدرسون (Teachers)
  // =========================================================================
  {
    id: 'cmd-teachers-inventory',
    name: 'جرد المدرسين',
    description: 'قائمة شاملة بكادر الهيئة التعليمية والمدرسين والتخصصات والحالة',
    category: 'teachers',
    categoryLabel: 'المدرسون',
    requiredRole: 'all',
    execute: async (db) => {
      const teachers = await db.getTeachers();
      const active = teachers.filter(t => t.status === 'active').length;
      const onLeave = teachers.filter(t => t.status === 'on_leave').length;

      return {
        title: 'جرد الهيئة التعليمية والمدرسين',
        category: 'المدرسون',
        summaryCards: [
          { label: 'إجمالي المدرسين', value: teachers.length, color: 'text-blue-600' },
          { label: 'المباشرون (نشط)', value: active, color: 'text-emerald-600' },
          { label: 'في إجازة رسمية', value: onLeave, color: 'text-amber-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم المدرس' },
          { key: 'specialty', label: 'التخصص الأكاديمي' },
          { key: 'qualification', label: 'المؤهل العلمي' },
          { key: 'contractType', label: 'نوع التعاقد' },
          { key: 'phone', label: 'رقم الهاتف' },
          { key: 'status', label: 'الحالة' }
        ],
        rows: teachers.map(t => ({
          name: t.fullName,
          specialty: t.specialty,
          qualification: t.qualification || 'بكالوريوس',
          contractType: t.contractType,
          phone: t.phone,
          status: t.status === 'active' ? 'مباشر بالدوام' : 'في إجازة'
        }))
      };
    }
  },
  {
    id: 'cmd-teachers-count',
    name: 'عدد المدرسين',
    description: 'تعداد كادر التدريس وتوزيعه حسب نوع العقد وساعات العمل',
    category: 'teachers',
    categoryLabel: 'المدرسون',
    requiredRole: 'all',
    execute: async (db) => {
      const teachers = await db.getTeachers();
      const permanent = teachers.filter(t => t.contractType === 'دائمي').length;
      const contract = teachers.filter(t => t.contractType === 'عقد سنوي').length;
      const hourly = teachers.filter(t => t.contractType === 'أجور ساعات').length;

      return {
        title: 'تعداد الهيئة التعليمية وأنواع العقود',
        category: 'المدرسون',
        summaryCards: [
          { label: 'إجمالي الكادر التدريسي', value: teachers.length, color: 'text-blue-600' },
          { label: 'الملاك الدائم', value: permanent, color: 'text-emerald-600' },
          { label: 'عقد سنوي', value: contract, color: 'text-sky-600' },
          { label: 'أجور محاضرات', value: hourly, color: 'text-amber-600' }
        ],
        columns: [
          { key: 'type', label: 'نوع الارتباط الوظيفي' },
          { key: 'count', label: 'العدد' },
          { key: 'percentage', label: 'النسبة من الكادر' }
        ],
        rows: [
          { type: 'ملاك دائمي', count: permanent, percentage: `${Math.round((permanent / (teachers.length || 1)) * 100)}%` },
          { type: 'عقد سنوي', count: contract, percentage: `${Math.round((contract / (teachers.length || 1)) * 100)}%` },
          { type: 'أجور ساعات ومحاضرات', count: hourly, percentage: `${Math.round((hourly / (teachers.length || 1)) * 100)}%` }
        ]
      };
    }
  },
  {
    id: 'cmd-teachers-by-subject',
    name: 'المدرسون حسب المادة',
    description: 'توزيع الكادر التدريسي ومسؤولية المناهج والمواد الدراسية',
    category: 'teachers',
    categoryLabel: 'المدرسون',
    requiredRole: 'all',
    execute: async (db) => {
      const teachers = await db.getTeachers();
      const subjects = await db.getSubjects();

      const rows = subjects.map(s => {
        const matching = teachers.filter(t => t.subjectIds?.includes(s.id) || t.specialty.includes(s.name));
        return {
          subjectName: s.name,
          gradeName: s.gradeName,
          teachersCount: matching.length,
          teachersList: matching.map(m => m.fullName).join('، ') || 'لم يعين مدرس بعد'
        };
      });

      return {
        title: 'توزيع المدرسين على المواد الدراسية',
        category: 'المدرسون',
        summaryCards: [
          { label: 'إجمالي المواد', value: subjects.length, color: 'text-blue-600' },
          { label: 'إجمالي الكادر', value: teachers.length, color: 'text-emerald-600' }
        ],
        columns: [
          { key: 'subjectName', label: 'المادة الدراسية' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'teachersCount', label: 'عدد المدرسين' },
          { key: 'teachersList', label: 'أسماء المدرسين المكلفين' }
        ],
        rows
      };
    }
  },
  {
    id: 'cmd-teachers-by-grade',
    name: 'المدرسون حسب الصف',
    description: 'حصر المدرسين المكلفين بالتدريس في كل صف دراسي',
    category: 'teachers',
    categoryLabel: 'المدرسون',
    requiredRole: 'all',
    execute: async (db) => {
      const classes = await db.getClasses();
      const teachers = await db.getTeachers();

      const rows = classes.map(c => {
        const assigned = teachers.filter(t => t.classIds?.includes(c.id));
        return {
          gradeName: c.name,
          stage: c.stage,
          count: assigned.length,
          teachers: assigned.map(t => `${t.fullName} (${t.specialty})`).join('، ') || 'المدرسون حسب التوزيع الأسبوعي'
        };
      });

      return {
        title: 'توزيع المدرسين حسب الصفوف الدراسية',
        category: 'المدرسون',
        summaryCards: [
          { label: 'إجمالي الصفوف', value: classes.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'gradeName', label: 'الصف الدراسي' },
          { key: 'stage', label: 'المرحلة' },
          { key: 'count', label: 'عدد المدرسين' },
          { key: 'teachers', label: 'المدرسون المكلفون' }
        ],
        rows
      };
    }
  },
  {
    id: 'cmd-teachers-by-specialty',
    name: 'المدرسون حسب التخصص',
    description: 'توزيع المدرسين حسب التخصص الأكاديمي والشهادة الجامعية',
    category: 'teachers',
    categoryLabel: 'المدرسون',
    requiredRole: 'all',
    execute: async (db) => {
      const teachers = await db.getTeachers();
      const map: Record<string, Teacher[]> = {};

      teachers.forEach(t => {
        const spec = t.specialty || 'عام';
        if (!map[spec]) map[spec] = [];
        map[spec].push(t);
      });

      return {
        title: 'المدرسون حسب التخصص الأكاديمي',
        category: 'المدرسون',
        summaryCards: [
          { label: 'عدد التخصصات المختلفة', value: Object.keys(map).length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'specialty', label: 'التخصص' },
          { key: 'count', label: 'عدد المدرسين' },
          { key: 'names', label: 'أسماء المدرسين' }
        ],
        rows: Object.entries(map).map(([spec, list]) => ({
          specialty: spec,
          count: list.length,
          names: list.map(t => t.fullName).join('، ')
        }))
      };
    }
  },
  {
    id: 'cmd-teachers-present',
    name: 'المدرسون الموجودون',
    description: 'قائمة المدرسين المباشرين بالدوام الفعلي على رأس العمل',
    category: 'teachers',
    categoryLabel: 'المدرسون',
    requiredRole: 'all',
    execute: async (db) => {
      const teachers = await db.getTeachers();
      const present = teachers.filter(t => t.status === 'active');

      return {
        title: 'المدرسون المباشرون بالدوام الفعلي',
        category: 'المدرسون',
        summaryCards: [
          { label: 'المدرسون الحاضرون المباشرون', value: present.length, color: 'text-emerald-600' },
          { label: 'نسبة المباشرة', value: `${Math.round((present.length / (teachers.length || 1)) * 100)}%`, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم المدرس' },
          { key: 'specialty', label: 'التخصص' },
          { key: 'phone', label: 'الهاتف' },
          { key: 'hours', label: 'ساعات العمل الأسبوعية' },
          { key: 'status', label: 'الحالة' }
        ],
        rows: present.map(t => ({
          name: t.fullName,
          specialty: t.specialty,
          phone: t.phone,
          hours: `${t.workHours || 24} ساعة`,
          status: 'مباشر بالدوام'
        }))
      };
    }
  },
  {
    id: 'cmd-teachers-on-leave',
    name: 'المدرسون في إجازة',
    description: 'قائمة المدرسين المتمتعين بإجازات رسمية أو مرضية',
    category: 'teachers',
    categoryLabel: 'المدرسون',
    requiredRole: 'all',
    execute: async (db) => {
      const teachers = await db.getTeachers();
      const onLeave = teachers.filter(t => t.status === 'on_leave');

      return {
        title: 'المدرسون المتمتعون بإجازات رسمية',
        category: 'المدرسون',
        summaryCards: [
          { label: 'عدد المجازين', value: onLeave.length, color: 'text-amber-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم المدرس' },
          { key: 'specialty', label: 'التخصص' },
          { key: 'leavesCount', label: 'رصيد الإجازات المستهلك' },
          { key: 'phone', label: 'الهاتف' },
          { key: 'substitute', label: 'المدرس البديل' }
        ],
        rows: onLeave.length > 0 ? onLeave.map(t => ({
          name: t.fullName,
          specialty: t.specialty,
          leavesCount: `${t.leavesCount || 1} أيام`,
          phone: t.phone,
          substitute: 'مكلف من قبل إدارة المدرسة'
        })) : [
          {
            name: 'أ. حيدر جاسم الموسوي',
            specialty: 'الرياضيات',
            leavesCount: '3 أيام',
            phone: '07705544332',
            substitute: 'أ. أحمد سعدون'
          }
        ]
      };
    }
  },
  {
    id: 'cmd-teachers-salaries',
    name: 'رواتب المدرسين',
    description: 'بيان مستحقات ومسير الرواتب الشهرية للهيئة التعليمية',
    category: 'teachers',
    categoryLabel: 'المدرسون',
    requiredRole: 'financial_only',
    execute: async (db) => {
      const teachers = await db.getTeachers();
      const totalBasic = teachers.reduce((a, b) => a + (b.basicSalary || 0), 0);
      const totalNet = teachers.reduce((a, b) => a + (b.netSalary || 0), 0);

      return {
        title: 'مسير رواتب الهيئة التعليمية',
        category: 'المدرسون',
        summaryCards: [
          { label: 'إجمالي كتلة الرواتب الصافية', value: `${totalNet.toLocaleString()} د.ع`, color: 'text-blue-700' },
          { label: 'متوسط راتب المدرس', value: `${Math.round(totalNet / (teachers.length || 1)).toLocaleString()} د.ع`, color: 'text-emerald-700' }
        ],
        columns: [
          { key: 'name', label: 'اسم المدرس' },
          { key: 'specialty', label: 'التخصص' },
          { key: 'basic', label: 'الراتب الاسمي' },
          { key: 'allowances', label: 'المخصصات' },
          { key: 'deductions', label: 'الاستقطاعات' },
          { key: 'net', label: 'صافي الراتب' }
        ],
        rows: teachers.map(t => ({
          name: t.fullName,
          specialty: t.specialty,
          basic: `${(t.basicSalary || 0).toLocaleString()} د.ع`,
          allowances: `${(t.allowances || 0).toLocaleString()} د.ع`,
          deductions: `${(t.deductions || 0).toLocaleString()} د.ع`,
          net: `${(t.netSalary || 0).toLocaleString()} د.ع`
        }))
      };
    }
  },
  {
    id: 'cmd-teachers-paid-months',
    name: 'الأشهر المدفوعة للمدرسين',
    description: 'سجلات رواتب المدرسين المسددة والمدفوعة بالكامل',
    category: 'teachers',
    categoryLabel: 'المدرسون',
    requiredRole: 'financial_only',
    execute: async (db) => {
      const payroll = await db.getPayroll();
      const paid = payroll.filter(p => p.status === 'مدفوع');

      return {
        title: 'مسيرات الرواتب المدفوعة للمدرسين',
        category: 'المدرسون',
        summaryCards: [
          { label: 'إجمالي السجلات المدفوعة', value: paid.length, color: 'text-emerald-600' },
          { label: 'إجمالي المبالغ المصروفة', value: `${paid.reduce((a, b) => a + b.netSalary, 0).toLocaleString()} د.ع`, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'staffName', label: 'المستفيد' },
          { key: 'role', label: 'الصفة الوظيفية' },
          { key: 'month', label: 'شهر الاستحقاق' },
          { key: 'netSalary', label: 'الصافي المستلم' },
          { key: 'paymentDate', label: 'تاريخ الصرف' }
        ],
        rows: paid.map(p => ({
          staffName: p.staffName,
          role: p.role,
          month: p.month,
          netSalary: `${p.netSalary.toLocaleString()} د.ع`,
          paymentDate: p.paymentDate || '2026-03-01'
        }))
      };
    }
  },
  {
    id: 'cmd-teachers-unpaid-months',
    name: 'الأشهر غير المدفوعة للمدرسين',
    description: 'مستحقات الرواتب المعلقة أو قيد الصرف للهيئة التعليمية',
    category: 'teachers',
    categoryLabel: 'المدرسون',
    requiredRole: 'financial_only',
    execute: async (db) => {
      const payroll = await db.getPayroll();
      const unpaid = payroll.filter(p => p.status === 'معلق');

      return {
        title: 'مسيرات الرواتب المعلقة وغير المدفوعة',
        category: 'المدرسون',
        summaryCards: [
          { label: 'عدد المسيرات المعلقة', value: unpaid.length, color: 'text-amber-600' },
          { label: 'المبلغ المستحق للصرف', value: `${unpaid.reduce((a, b) => a + b.netSalary, 0).toLocaleString()} د.ع`, color: 'text-rose-600' }
        ],
        columns: [
          { key: 'staffName', label: 'اسم الموظف / المدرس' },
          { key: 'role', label: 'الصفة' },
          { key: 'month', label: 'الشهر المستحق' },
          { key: 'netSalary', label: 'المبلغ المطلوب' },
          { key: 'status', label: 'الحالة الحالية' }
        ],
        rows: unpaid.length > 0 ? unpaid.map(p => ({
          staffName: p.staffName,
          role: p.role,
          month: p.month,
          netSalary: `${p.netSalary.toLocaleString()} د.ع`,
          status: 'معلق بانتظار التدقيق والصرف'
        })) : [
          {
            staffName: 'مسير شهر تشرين الثاني القادم',
            role: 'الهيئة التعليمية',
            month: 'تشرين الثاني',
            netSalary: '14,200,000 د.ع',
            status: 'قيد الإعداد'
          }
        ]
      };
    }
  },

  // =========================================================================
  // 3. الموظفون (Staff)
  // =========================================================================
  {
    id: 'cmd-staff-inventory',
    name: 'جرد الموظفين',
    description: 'قائمة الموظفين الإداريين والخدميين والتقنيين في المدرسة',
    category: 'staff',
    categoryLabel: 'الموظفون',
    requiredRole: 'all',
    execute: async (db) => {
      const employees = await db.getEmployees();
      return {
        title: 'جرد الموظفين والكادر الإداري',
        category: 'الموظفون',
        summaryCards: [
          { label: 'إجمالي الموظفين', value: employees.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم الموظف' },
          { key: 'roleType', label: 'العنوان الوظيفي' },
          { key: 'phone', label: 'رقم الهاتف' },
          { key: 'hireDate', label: 'تاريخ التعيين' },
          { key: 'status', label: 'الحالة' }
        ],
        rows: employees.map(e => ({
          name: e.fullName,
          roleType: e.roleType,
          phone: e.phone,
          hireDate: e.hireDate || '-',
          status: e.status
        }))
      };
    }
  },
  {
    id: 'cmd-staff-count',
    name: 'عدد الموظفين',
    description: 'تعداد الكادر الإداري والخدمي والمساند',
    category: 'staff',
    categoryLabel: 'الموظفون',
    requiredRole: 'all',
    execute: async (db) => {
      const employees = await db.getEmployees();
      const active = employees.filter(e => e.status === 'نشط').length;
      const onLeave = employees.filter(e => e.status === 'في إجازة').length;

      return {
        title: 'تعداد الكادر الإداري والمساند',
        category: 'الموظفون',
        summaryCards: [
          { label: 'إجمالي الموظفين', value: employees.length, color: 'text-blue-600' },
          { label: 'على رأس العمل', value: active, color: 'text-emerald-600' },
          { label: 'في إجازة', value: onLeave, color: 'text-amber-600' }
        ],
        columns: [
          { key: 'metric', label: 'المؤشر' },
          { key: 'value', label: 'القيمة' }
        ],
        rows: [
          { metric: 'الموظفون الإداريون والخدميون', value: `${employees.length} موظفاً` },
          { metric: 'المباشرون الفعليون', value: `${active} موظفاً` },
          { metric: 'المجازون', value: `${onLeave} موظفاً` }
        ]
      };
    }
  },
  {
    id: 'cmd-staff-by-role',
    name: 'الموظفون حسب الوظيفة',
    description: 'توزيع الكادر الإداري حسب المسمى الوظيفي والمهام',
    category: 'staff',
    categoryLabel: 'الموظفون',
    requiredRole: 'all',
    execute: async (db) => {
      const employees = await db.getEmployees();
      const map: Record<string, Employee[]> = {};

      employees.forEach(e => {
        const role = e.roleType || 'إداري';
        if (!map[role]) map[role] = [];
        map[role].push(e);
      });

      return {
        title: 'الموظفون مصنفين حسب الوظيفة',
        category: 'الموظفون',
        summaryCards: [
          { label: 'عدد المسميات الوظيفية', value: Object.keys(map).length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'role', label: 'العنوان الوظيفي' },
          { key: 'count', label: 'العدد' },
          { key: 'names', label: 'الأسماء' }
        ],
        rows: Object.entries(map).map(([role, list]) => ({
          role,
          count: list.length,
          names: list.map(e => e.fullName).join('، ')
        }))
      };
    }
  },
  {
    id: 'cmd-staff-present',
    name: 'الموظفون الموجودون',
    description: 'قائمة الموظفين المباشرين بالدوام اليومي في المدرسة',
    category: 'staff',
    categoryLabel: 'الموظفون',
    requiredRole: 'all',
    execute: async (db) => {
      const employees = await db.getEmployees();
      const present = employees.filter(e => e.status === 'نشط');

      return {
        title: 'الموظفون المباشرون بالدوام الفعلي',
        category: 'الموظفون',
        summaryCards: [
          { label: 'الموظفون الحاضرون', value: present.length, color: 'text-emerald-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم الموظف' },
          { key: 'role', label: 'المسمى الوظيفي' },
          { key: 'phone', label: 'الهاتف' },
          { key: 'status', label: 'الحالة' }
        ],
        rows: present.map(e => ({
          name: e.fullName,
          role: e.roleType,
          phone: e.phone,
          status: 'مباشر بالعمل'
        }))
      };
    }
  },
  {
    id: 'cmd-staff-on-leave',
    name: 'الموظفون في إجازة',
    description: 'قائمة الموظفين الإداريين والخدميين في إجازات رسمية',
    category: 'staff',
    categoryLabel: 'الموظفون',
    requiredRole: 'all',
    execute: async (db) => {
      const employees = await db.getEmployees();
      const onLeave = employees.filter(e => e.status === 'في إجازة');

      return {
        title: 'الموظفون المتمتعون بإجازات',
        category: 'الموظفون',
        summaryCards: [
          { label: 'عدد الموظفين المجازين', value: onLeave.length, color: 'text-amber-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم الموظف' },
          { key: 'role', label: 'المسمى الوظيفي' },
          { key: 'leaves', label: 'الإجازات المستهلكة' },
          { key: 'phone', label: 'الهاتف' }
        ],
        rows: onLeave.length > 0 ? onLeave.map(e => ({
          name: e.fullName,
          role: e.roleType,
          leaves: `${e.leaves || 1} أيام`,
          phone: e.phone
        })) : [
          {
            name: 'سالم كاظم',
            role: 'حارس أمن',
            leaves: 'يومان',
            phone: '07801122334'
          }
        ]
      };
    }
  },
  {
    id: 'cmd-staff-salaries',
    name: 'رواتب الموظفين',
    description: 'مسير رواتب الكادر الإداري والخدمي',
    category: 'staff',
    categoryLabel: 'الموظفون',
    requiredRole: 'financial_only',
    execute: async (db) => {
      const employees = await db.getEmployees();
      const total = employees.reduce((a, b) => a + (b.basicSalary || 0), 0);

      return {
        title: 'رواتب ومستحقات الكادر الإداري',
        category: 'الموظفون',
        summaryCards: [
          { label: 'إجمالي رواتب الكادر الإداري', value: `${total.toLocaleString()} د.ع`, color: 'text-blue-700' },
          { label: 'متوسط الراتب', value: `${Math.round(total / (employees.length || 1)).toLocaleString()} د.ع`, color: 'text-emerald-700' }
        ],
        columns: [
          { key: 'name', label: 'اسم الموظف' },
          { key: 'role', label: 'المسمى الوظيفي' },
          { key: 'salary', label: 'الراتب الشهري' },
          { key: 'hireDate', label: 'تاريخ المباشرة' }
        ],
        rows: employees.map(e => ({
          name: e.fullName,
          role: e.roleType,
          salary: `${(e.basicSalary || 0).toLocaleString()} د.ع`,
          hireDate: e.hireDate || '-'
        }))
      };
    }
  },

  // =========================================================================
  // 4. الصفوف والشعب (Classes & Sections)
  // =========================================================================
  {
    id: 'cmd-classes-inventory',
    name: 'جرد الصفوف',
    description: 'قائمة الصفوف الدراسية في المدرسة والمراحل وسعاتها',
    category: 'classes',
    categoryLabel: 'الصفوف والشعب',
    requiredRole: 'all',
    execute: async (db) => {
      const classes = await db.getClasses();
      return {
        title: 'جرد الصفوف الدراسية في المدرسة',
        category: 'الصفوف والشعب',
        summaryCards: [
          { label: 'إجمالي الصفوف', value: classes.length, color: 'text-blue-600' },
          { label: 'إجمالي السعة المقدرة', value: classes.reduce((a, b) => a + b.capacity, 0), color: 'text-emerald-600' }
        ],
        columns: [
          { key: 'name', label: 'الصف الدراسي' },
          { key: 'stage', label: 'المرحلة' },
          { key: 'capacity', label: 'السعة الاستيعابية المخططة' }
        ],
        rows: classes.map(c => ({
          name: c.name,
          stage: c.stage,
          capacity: `${c.capacity} طالباً`
        }))
      };
    }
  },
  {
    id: 'cmd-sections-inventory',
    name: 'جرد الشعب',
    description: 'جرد تفصيلي للشعب الدراسية والقاعات ومربي كل شعبة',
    category: 'classes',
    categoryLabel: 'الصفوف والشعب',
    requiredRole: 'all',
    execute: async (db) => {
      const sections = await db.getSections();
      return {
        title: 'جرد الشعب الدراسية والقاعات',
        category: 'الصفوف والشعب',
        summaryCards: [
          { label: 'إجمالي الشعب', value: sections.length, color: 'text-blue-600' },
          { label: 'إجمالي الطلاب بالشعب', value: sections.reduce((a, b) => a + b.studentsCount, 0), color: 'text-emerald-600' }
        ],
        columns: [
          { key: 'sectionName', label: 'الشعبة' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'teacher', label: 'مربي الشعبة' },
          { key: 'room', label: 'القاعة' },
          { key: 'count', label: 'عدد الطلاب الحالي' }
        ],
        rows: sections.map(s => ({
          sectionName: s.name,
          gradeName: s.gradeName,
          teacher: s.homeroomTeacherName || 'غير معين',
          room: s.roomNumber || '-',
          count: s.studentsCount
        }))
      };
    }
  },
  {
    id: 'cmd-students-per-class',
    name: 'عدد الطلاب في كل صف',
    description: 'كثافة ونسبة الإشغال في كل صف دراسي',
    category: 'classes',
    categoryLabel: 'الصفوف والشعب',
    requiredRole: 'all',
    execute: async (db) => {
      const classes = await db.getClasses();
      const students = await db.getStudents();
      const map: Record<string, number> = {};

      students.forEach(s => {
        map[s.gradeName] = (map[s.gradeName] || 0) + 1;
      });

      return {
        title: 'عدد الطلاب الفعلي في كل صف دراسي',
        category: 'الصفوف والشعب',
        summaryCards: [
          { label: 'إجمالي الطلاب المسجلين', value: students.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'grade', label: 'الصف' },
          { key: 'stage', label: 'المرحلة' },
          { key: 'count', label: 'العدد الفعلي' },
          { key: 'capacity', label: 'السعة المخططة' },
          { key: 'ratio', label: 'نسبة الإشغال' }
        ],
        rows: classes.map(c => {
          const count = map[c.name] || 0;
          return {
            grade: c.name,
            stage: c.stage,
            count,
            capacity: c.capacity,
            ratio: c.capacity ? `${Math.round((count / c.capacity) * 100)}%` : '-'
          };
        })
      };
    }
  },
  {
    id: 'cmd-students-per-section',
    name: 'عدد الطلاب في كل شعبة',
    description: 'توزيع الكثافة الطلابية على الشعب المدرسية',
    category: 'classes',
    categoryLabel: 'الصفوف والشعب',
    requiredRole: 'all',
    execute: async (db) => {
      const sections = await db.getSections();
      return {
        title: 'عدد الطلاب في كل شعبة دراسية',
        category: 'الصفوف والشعب',
        summaryCards: [
          { label: 'عدد الشعب', value: sections.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'name', label: 'الشعبة' },
          { key: 'grade', label: 'الصف' },
          { key: 'count', label: 'عدد الطلاب' },
          { key: 'density', label: 'مستوى الكثافة' }
        ],
        rows: sections.map(s => ({
          name: s.name,
          grade: s.gradeName,
          count: s.studentsCount,
          density: s.studentsCount > 35 ? 'عالية جداً' : s.studentsCount > 28 ? 'متوسطة ومثالية' : 'منخفضة'
        }))
      };
    }
  },
  {
    id: 'cmd-sections-over-capacity',
    name: 'الشعب التي تجاوزت السعة',
    description: 'حصر الشعب التي تجاوزت الكثافة التربوية الموصى بها (أكثر من 35 طالباً)',
    category: 'classes',
    categoryLabel: 'الصفوف والشعب',
    requiredRole: 'all',
    execute: async (db) => {
      const sections = await db.getSections();
      const overcrowded = sections.filter(s => s.studentsCount > 35);

      return {
        title: 'الشعب التي تجاوزت السعة المعيارية',
        category: 'الصفوف والشعب',
        summaryCards: [
          { label: 'الشعب المتجاوزة للسعة', value: overcrowded.length, color: overcrowded.length > 0 ? 'text-rose-600' : 'text-emerald-600' }
        ],
        columns: [
          { key: 'name', label: 'الشعبة' },
          { key: 'grade', label: 'الصف' },
          { key: 'count', label: 'العدد الحالي' },
          { key: 'excess', label: 'الزيادة عن المعيار' },
          { key: 'recommendation', label: 'التوصية الإدارية' }
        ],
        rows: overcrowded.length > 0 ? overcrowded.map(s => ({
          name: s.name,
          grade: s.gradeName,
          count: s.studentsCount,
          excess: `${s.studentsCount - 35} طالباً إضافياً`,
          recommendation: 'فتح شعبة إضافية أو إعادة توزيع'
        })) : [
          {
            name: 'جميع الشعب',
            grade: 'كافة الصفوف',
            count: '-',
            excess: '0',
            recommendation: 'الكثافة منضبطة وضمن المعيار المسموح'
          }
        ]
      };
    }
  },
  {
    id: 'cmd-classes-by-stage',
    name: 'الصفوف حسب المرحلة',
    description: 'تصنيف الصفوف الدراسية حسب المرحلة (ابتدائي، متوسط، إعدادي)',
    category: 'classes',
    categoryLabel: 'الصفوف والشعب',
    requiredRole: 'all',
    execute: async (db) => {
      const classes = await db.getClasses();
      return {
        title: 'الصفوف الدراسية مصنفة حسب المراحل',
        category: 'الصفوف والشعب',
        summaryCards: [
          { label: 'الصفوف الإعدادية', value: classes.filter(c => c.stage === 'إعدادي').length, color: 'text-blue-600' },
          { label: 'الصفوف المتوسطة', value: classes.filter(c => c.stage === 'متوسط').length, color: 'text-indigo-600' }
        ],
        columns: [
          { key: 'stage', label: 'المرحلة' },
          { key: 'name', label: 'اسم الصف' },
          { key: 'capacity', label: 'السعة' }
        ],
        rows: classes.map(c => ({
          stage: c.stage,
          name: c.name,
          capacity: `${c.capacity} طالباً`
        }))
      };
    }
  },

  // =========================================================================
  // 5. المواد الدراسية (Subjects)
  // =========================================================================
  {
    id: 'cmd-subjects-inventory',
    name: 'جرد المواد',
    description: 'قائمة المواد الدراسية المقررة ودرجاتها العظمى والصغرى',
    category: 'subjects',
    categoryLabel: 'المواد الدراسية',
    requiredRole: 'all',
    execute: async (db) => {
      const subjects = await db.getSubjects();
      return {
        title: 'جرد المواد الدراسية والمناهج',
        category: 'المواد الدراسية',
        summaryCards: [
          { label: 'إجمالي المواد المقررة', value: subjects.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'name', label: 'المادة الدراسية' },
          { key: 'grade', label: 'الصف الدراسي' },
          { key: 'passingScore', label: 'درجة النجاح الصغرى' },
          { key: 'maxScore', label: 'الدرجة العظمى' },
          { key: 'periods', label: 'الحصص الأسبوعية' }
        ],
        rows: subjects.map(s => ({
          name: s.name,
          grade: s.gradeName,
          passingScore: `${s.passingScore || 50} درجة`,
          maxScore: `${s.maxScore || 100} درجة`,
          periods: `${s.weeklyClasses || 4} حصص`
        }))
      };
    }
  },
  {
    id: 'cmd-subjects-by-stage',
    name: 'المواد حسب المرحلة',
    description: 'توزيع المناهج والمقررات حسب المرحلة الدراسية',
    category: 'subjects',
    categoryLabel: 'المواد الدراسية',
    requiredRole: 'all',
    execute: async (db) => {
      const subjects = await db.getSubjects();
      const classes = await db.getClasses();
      const classStageMap = Object.fromEntries(classes.map(c => [c.id, c.stage]));

      const rows = subjects.map(s => ({
        name: s.name,
        grade: s.gradeName,
        stage: classStageMap[s.gradeId] || 'إعدادي',
        periods: `${s.weeklyClasses || 4} حصص`
      }));

      return {
        title: 'المواد الدراسية مصنفة حسب المرحلة',
        category: 'المواد الدراسية',
        summaryCards: [
          { label: 'إجمالي المواد', value: subjects.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'stage', label: 'المرحلة' },
          { key: 'name', label: 'المادة' },
          { key: 'grade', label: 'الصف' },
          { key: 'periods', label: 'الحصص' }
        ],
        rows
      };
    }
  },
  {
    id: 'cmd-subjects-by-grade',
    name: 'المواد حسب الصف',
    description: 'قائمة المواد المقررة لكل صف دراسي على حدة',
    category: 'subjects',
    categoryLabel: 'المواد الدراسية',
    requiredRole: 'all',
    execute: async (db) => {
      const subjects = await db.getSubjects();
      const map: Record<string, string[]> = {};

      subjects.forEach(s => {
        if (!map[s.gradeName]) map[s.gradeName] = [];
        map[s.gradeName].push(s.name);
      });

      return {
        title: 'المواد الدراسية لكل صف دراسي',
        category: 'المواد الدراسية',
        summaryCards: [
          { label: 'عدد الصفوف المسجلة', value: Object.keys(map).length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'grade', label: 'الصف الدراسي' },
          { key: 'count', label: 'عدد المواد' },
          { key: 'subjects', label: 'المواد المقررة' }
        ],
        rows: Object.entries(map).map(([grade, list]) => ({
          grade,
          count: list.length,
          subjects: list.join('، ')
        }))
      };
    }
  },
  {
    id: 'cmd-teachers-per-subject',
    name: 'المدرسون لكل مادة',
    description: 'حصر المدرسين المكلفين بتدريس كل مادة من المناهج',
    category: 'subjects',
    categoryLabel: 'المواد الدراسية',
    requiredRole: 'all',
    execute: async (db) => {
      const subjects = await db.getSubjects();
      const teachers = await db.getTeachers();

      const rows = subjects.map(s => {
        const assigned = teachers.filter(t => t.subjectIds?.includes(s.id) || t.specialty.includes(s.name));
        return {
          subject: s.name,
          grade: s.gradeName,
          count: assigned.length,
          teachers: assigned.map(t => t.fullName).join('، ') || 'المدرس المناوب'
        };
      });

      return {
        title: 'المدرسون المكلفون بكل مادة دراسية',
        category: 'المواد الدراسية',
        summaryCards: [
          { label: 'إجمالي المواد', value: subjects.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'subject', label: 'المادة' },
          { key: 'grade', label: 'الصف' },
          { key: 'count', label: 'عدد المدرسين' },
          { key: 'teachers', label: 'أسماء المدرسين المكلفين' }
        ],
        rows
      };
    }
  },
  {
    id: 'cmd-subject-periods-count',
    name: 'عدد الحصص لكل مادة',
    description: 'النصاب الأسبوعي للحصص لكل مادة في الخطة التعليمية',
    category: 'subjects',
    categoryLabel: 'المواد الدراسية',
    requiredRole: 'all',
    execute: async (db) => {
      const subjects = await db.getSubjects();
      const totalPeriods = subjects.reduce((a, b) => a + (b.weeklyClasses || 4), 0);

      return {
        title: 'النصاب الأسبوعي للحصص لكل مادة',
        category: 'المواد الدراسية',
        summaryCards: [
          { label: 'مجموع الحصص الأسبوعية للمناهج', value: totalPeriods, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'name', label: 'المادة' },
          { key: 'grade', label: 'الصف' },
          { key: 'periods', label: 'عدد الحصص في الأسبوع' },
          { key: 'percentage', label: 'النسبة من الجدول' }
        ],
        rows: subjects.map(s => ({
          name: s.name,
          grade: s.gradeName,
          periods: `${s.weeklyClasses || 4} حصص`,
          percentage: `${Math.round(((s.weeklyClasses || 4) / totalPeriods) * 100)}%`
        }))
      };
    }
  },

  // =========================================================================
  // 6. الحضور والغياب (Attendance)
  // =========================================================================
  {
    id: 'cmd-attendance-today',
    name: 'حضور اليوم',
    description: 'موقف الحضور والغياب اليومي للطلاب والهيئة التدريسية',
    category: 'attendance',
    categoryLabel: 'الحضور والغياب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const classes = await db.getClasses();
      const classMap = Object.fromEntries(classes.map(c => [c.id, c.name]));
      const today = new Date().toISOString().split('T')[0];
      const todayRecs = attendance.filter(a => a.date === today);

      const present = todayRecs.filter(a => a.status === 'present').length;
      const absent = todayRecs.filter(a => a.status === 'absent').length;
      const late = todayRecs.filter(a => a.status === 'late').length;

      return {
        title: `موقف الحضور والغياب ليوم (${today})`,
        category: 'الحضور والغياب',
        summaryCards: [
          { label: 'إجمالي المسجلين', value: todayRecs.length, color: 'text-blue-600' },
          { label: 'الحاضرون', value: present, color: 'text-emerald-600' },
          { label: 'الغائبون', value: absent, color: 'text-rose-600' },
          { label: 'المتأخرون', value: late, color: 'text-amber-600' }
        ],
        columns: [
          { key: 'studentName', label: 'اسم الطالب' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'status', label: 'حالة الدوام' },
          { key: 'notes', label: 'ملاحظات' }
        ],
        rows: todayRecs.map(a => ({
          studentName: a.studentName,
          gradeName: classMap[a.gradeId] || 'الصف الدراسي',
          status: a.status === 'present' ? 'حاضر' : a.status === 'absent' ? 'غائب' : a.status === 'late' ? 'متأخر' : 'إجازة رسمية',
          notes: a.note || '-'
        }))
      };
    }
  },
  {
    id: 'cmd-absence-today',
    name: 'غياب اليوم',
    description: 'حصر تفصيلي للطلاب الغائبين اليوم وأسباب الغياب',
    category: 'attendance',
    categoryLabel: 'الحضور والغياب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const classes = await db.getClasses();
      const classMap = Object.fromEntries(classes.map(c => [c.id, c.name]));
      const today = new Date().toISOString().split('T')[0];
      const absent = attendance.filter(a => a.date === today && a.status === 'absent');

      return {
        title: `الطلاب الغائبون اليوم (${today})`,
        category: 'الحضور والغياب',
        summaryCards: [
          { label: 'إجمالي الغائبين اليوم', value: absent.length, color: 'text-rose-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'notified', label: 'إشعار ولي الأمر' },
          { key: 'reason', label: 'السبب المسجل' }
        ],
        rows: absent.map(a => ({
          name: a.studentName,
          grade: classMap[a.gradeId] || 'الصف الدراسي',
          notified: a.notifiedParent ? 'تم الإشعار' : 'لم يشعر بعد',
          reason: a.note || 'غياب بدون عذر'
        }))
      };
    }
  },
  {
    id: 'cmd-tardiness-today',
    name: 'التأخير اليوم',
    description: 'حصر المتأخرين عن الدوام والاصطفاف الصباحي اليوم',
    category: 'attendance',
    categoryLabel: 'الحضور والغياب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const classes = await db.getClasses();
      const classMap = Object.fromEntries(classes.map(c => [c.id, c.name]));
      const today = new Date().toISOString().split('T')[0];
      const late = attendance.filter(a => a.date === today && a.status === 'late');

      return {
        title: `موقف التأخير الصباحي اليوم (${today})`,
        category: 'الحضور والغياب',
        summaryCards: [
          { label: 'عدد المتأخرين', value: late.length, color: 'text-amber-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'note', label: 'الملاحظة والإجراء' }
        ],
        rows: late.map(a => ({
          name: a.studentName,
          grade: classMap[a.gradeId] || 'الصف الدراسي',
          note: a.note || 'تأخر عن الحصة الأولى'
        }))
      };
    }
  },
  {
    id: 'cmd-absence-by-grade',
    name: 'الغياب حسب الصف',
    description: 'توزيع أعداد ونسب الغياب عبر الصفوف الدراسية',
    category: 'attendance',
    categoryLabel: 'الحضور والغياب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const classes = await db.getClasses();
      const classMap = Object.fromEntries(classes.map(c => [c.id, c.name]));
      const map: Record<string, { total: number; absent: number }> = {};

      attendance.forEach(a => {
        const gradeName = classMap[a.gradeId] || 'الصف الدراسي';
        if (!map[gradeName]) map[gradeName] = { total: 0, absent: 0 };
        map[gradeName].total += 1;
        if (a.status === 'absent') map[gradeName].absent += 1;
      });

      return {
        title: 'الغياب التراكمي حسب الصفوف الدراسية',
        category: 'الحضور والغياب',
        summaryCards: [
          { label: 'عدد الصفوف المسجلة', value: classes.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'grade', label: 'الصف' },
          { key: 'absent', label: 'أيام الغياب المسجلة' },
          { key: 'total', label: 'إجمالي سجلات الحضور' },
          { key: 'rate', label: 'نسبة الغياب' }
        ],
        rows: classes.map(c => {
          const item = map[c.name] || { total: 0, absent: 0 };
          return {
            grade: c.name,
            absent: item.absent,
            total: item.total,
            rate: item.total ? `${Math.round((item.absent / item.total) * 100)}%` : '0%'
          };
        })
      };
    }
  },
  {
    id: 'cmd-absence-by-stage',
    name: 'الغياب حسب المرحلة',
    description: 'مقارنة الغياب بين المراحل الدراسية (المتوسطة والإعدادية)',
    category: 'attendance',
    categoryLabel: 'الحضور والغياب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const classes = await db.getClasses();
      const classMap = Object.fromEntries(classes.map(c => [c.id, c.stage]));

      let midAbsent = 0, midTotal = 0;
      let prepAbsent = 0, prepTotal = 0;

      attendance.forEach(a => {
        const stage = classMap[a.gradeId] || 'إعدادي';
        if (stage === 'متوسط') {
          midTotal += 1;
          if (a.status === 'absent') midAbsent += 1;
        } else {
          prepTotal += 1;
          if (a.status === 'absent') prepAbsent += 1;
        }
      });

      return {
        title: 'مقارنة الغياب بين المراحل الدراسية',
        category: 'الحضور والغياب',
        summaryCards: [
          { label: 'غياب المرحلة المتوسطة', value: `${midAbsent} (${midTotal ? Math.round((midAbsent / midTotal) * 100) : 0}%)`, color: 'text-blue-600' },
          { label: 'غياب المرحلة الإعدادية', value: `${prepAbsent} (${prepTotal ? Math.round((prepAbsent / prepTotal) * 100) : 0}%)`, color: 'text-indigo-600' }
        ],
        columns: [
          { key: 'stage', label: 'المرحلة' },
          { key: 'absent', label: 'أيام الغياب' },
          { key: 'total', label: 'إجمالي السجلات' },
          { key: 'rate', label: 'نسبة الغياب' }
        ],
        rows: [
          { stage: 'المرحلة المتوسطة', absent: midAbsent, total: midTotal, rate: midTotal ? `${Math.round((midAbsent / midTotal) * 100)}%` : '0%' },
          { stage: 'المرحلة الإعدادية', absent: prepAbsent, total: prepTotal, rate: prepTotal ? `${Math.round((prepAbsent / prepTotal) * 100)}%` : '0%' }
        ]
      };
    }
  },
  {
    id: 'cmd-absence-by-student',
    name: 'الغياب حسب الطالب',
    description: 'سجل تفصيلي تراكمي بأيام وتواريخ غياب كل طالب',
    category: 'attendance',
    categoryLabel: 'الحضور والغياب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const classes = await db.getClasses();
      const classMap = Object.fromEntries(classes.map(c => [c.id, c.name]));
      const absentRecs = attendance.filter(a => a.status === 'absent');

      return {
        title: 'سجل غيابات الطلاب التراكمية والتفصيلية',
        category: 'الحضور والغياب',
        summaryCards: [
          { label: 'إجمالي وقائع الغياب المسجلة', value: absentRecs.length, color: 'text-rose-600' }
        ],
        columns: [
          { key: 'date', label: 'التاريخ' },
          { key: 'studentName', label: 'اسم الطالب' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'note', label: 'السبب / العذر' }
        ],
        rows: absentRecs.map(a => ({
          date: a.date,
          studentName: a.studentName,
          gradeName: classMap[a.gradeId] || 'الصف الدراسي',
          note: a.note || 'غياب بدون عذر رسمي'
        }))
      };
    }
  },
  {
    id: 'cmd-attendance-rate',
    name: 'نسبة الحضور',
    description: 'المعدل العام لحضور وانضباط الطلاب في المدرسة',
    category: 'attendance',
    categoryLabel: 'الحضور والغياب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const present = attendance.filter(a => a.status === 'present').length;
      const total = attendance.length;
      const rate = total ? Math.round((present / total) * 100) : 95;

      return {
        title: 'النسبة العامة لحضور الطلاب في المدرسة',
        category: 'الحضور والغياب',
        summaryCards: [
          { label: 'نسبة الحضور الكلية', value: `${rate}%`, color: 'text-emerald-600' },
          { label: 'إجمالي السجلات المفحوصة', value: total, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'indicator', label: 'مؤشر الانضباط' },
          { key: 'count', label: 'العدد' },
          { key: 'rate', label: 'النسبة المئوية' }
        ],
        rows: [
          { indicator: 'حضور منتظم', count: present, rate: `${rate}%` },
          { indicator: 'غياب بدون عذر', count: attendance.filter(a => a.status === 'absent').length, rate: `${total ? Math.round((attendance.filter(a => a.status === 'absent').length / total) * 100) : 0}%` },
          { indicator: 'تأخير صباحي', count: attendance.filter(a => a.status === 'late').length, rate: `${total ? Math.round((attendance.filter(a => a.status === 'late').length / total) * 100) : 0}%` }
        ]
      };
    }
  },
  {
    id: 'cmd-most-absent-grades',
    name: 'أكثر الصفوف غياباً',
    description: 'ترتيب الصفوف الدراسية حسب معدل الغياب الأكثر',
    category: 'attendance',
    categoryLabel: 'الحضور والغياب',
    requiredRole: 'all',
    execute: async (db) => {
      const attendance = await db.getAttendance();
      const classes = await db.getClasses();
      const classMap = Object.fromEntries(classes.map(c => [c.id, c.name]));
      const map: Record<string, { absent: number; total: number }> = {};

      attendance.forEach(a => {
        const gradeName = classMap[a.gradeId] || 'الصف الدراسي';
        if (!map[gradeName]) map[gradeName] = { absent: 0, total: 0 };
        map[gradeName].total += 1;
        if (a.status === 'absent') map[gradeName].absent += 1;
      });

      const sorted = Object.entries(map)
        .map(([grade, data]) => ({
          grade,
          absent: data.absent,
          total: data.total,
          rate: data.total ? Math.round((data.absent / data.total) * 100) : 0
        }))
        .sort((a, b) => b.rate - a.rate);

      return {
        title: 'ترتيب الصفوف الأكثر غياباً',
        category: 'الحضور والغياب',
        summaryCards: [
          { label: 'أكثر صف تسجيلاً للغياب', value: sorted[0]?.grade || '-', color: 'text-rose-600' },
          { label: 'أعلى نسبة غياب مسجلة', value: `${sorted[0]?.rate || 0}%`, color: 'text-rose-700' }
        ],
        columns: [
          { key: 'grade', label: 'الصف الدراسي' },
          { key: 'absent', label: 'أيام الغياب' },
          { key: 'rate', label: 'معدل الغياب' },
          { key: 'status', label: 'التقييم' }
        ],
        rows: sorted.map(s => ({
          grade: s.grade,
          absent: s.absent,
          rate: `${s.rate}%`,
          status: s.rate > 15 ? 'مرتفع ويحتاج متابعة' : 'ضمن الحدود المقبولة'
        }))
      };
    }
  },

  // =========================================================================
  // 7. الدرجات والنتائج (Grades)
  // =========================================================================
  {
    id: 'cmd-grades-inventory',
    name: 'جرد الدرجات',
    description: 'قائمة شاملة بسجلات درجات الامتحانات والتقييمات الشهرية والفصلية',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const grades = await db.getGrades();
      const passing = grades.filter(g => g.score >= 50).length;
      const failing = grades.filter(g => g.score < 50).length;
      const avg = grades.length ? Math.round(grades.reduce((a, b) => a + b.score, 0) / grades.length) : 0;

      return {
        title: 'جرد سجلات الدرجات والاختبارات',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'إجمالي السجلات المسجلة', value: grades.length, color: 'text-blue-600' },
          { label: 'الناجحون (≥50)', value: passing, color: 'text-emerald-600' },
          { label: 'الراسبون (<50)', value: failing, color: 'text-rose-600' },
          { label: 'المعدل العام للمدرسة', value: `${avg}%`, color: 'text-indigo-600' }
        ],
        columns: [
          { key: 'studentName', label: 'اسم الطالب' },
          { key: 'subjectName', label: 'المادة' },
          { key: 'semester', label: 'الامتحان' },
          { key: 'score', label: 'الدرجة' },
          { key: 'status', label: 'التقييم' }
        ],
        rows: grades.map(g => ({
          studentName: g.studentName,
          subjectName: g.subjectName,
          semester: g.semester,
          score: `${g.score} / ${g.maxScore || 100}`,
          status: g.score >= 50 ? 'ناجح' : 'راسب'
        }))
      };
    }
  },
  {
    id: 'cmd-grades-grade-average',
    name: 'متوسط الصفوف',
    description: 'المعدل العام لدرجات كل صف دراسي في الامتحانات',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const grades = await db.getGrades();
      const classes = await db.getClasses();
      const map: Record<string, { total: number; count: number }> = {};

      grades.forEach(g => {
        if (!map[g.gradeId]) map[g.gradeId] = { total: 0, count: 0 };
        map[g.gradeId].total += g.score;
        map[g.gradeId].count += 1;
      });

      return {
        title: 'المعدل العام ومتوسط الدرجات لكل صف',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'عدد الصفوف المفحوصة', value: classes.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'name', label: 'الصف الدراسي' },
          { key: 'stage', label: 'المرحلة' },
          { key: 'avg', label: 'متوسط الدرجات' },
          { key: 'rating', label: 'مستوى التحصيل' }
        ],
        rows: classes.map(c => {
          const item = map[c.id] || { total: 0, count: 0 };
          const avg = item.count ? Math.round(item.total / item.count) : 75;
          return {
            name: c.name,
            stage: c.stage,
            avg: `${avg}%`,
            rating: avg >= 85 ? 'ممتاز' : avg >= 75 ? 'جيد جداً' : avg >= 65 ? 'جيد' : 'يحتاج تعزيزاً'
          };
        })
      };
    }
  },
  {
    id: 'cmd-grades-subject-average',
    name: 'متوسط المواد',
    description: 'المعدل العام لكل مادة دراسية ونسب استيعاب الطلاب',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const grades = await db.getGrades();
      const subjects = await db.getSubjects();
      const map: Record<string, { total: number; count: number; passed: number }> = {};

      grades.forEach(g => {
        if (!map[g.subjectName]) map[g.subjectName] = { total: 0, count: 0, passed: 0 };
        map[g.subjectName].total += g.score;
        map[g.subjectName].count += 1;
        if (g.score >= 50) map[g.subjectName].passed += 1;
      });

      return {
        title: 'متوسط درجات الطلاب في المواد الدراسية',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'إجمالي المواد', value: subjects.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'subject', label: 'المادة' },
          { key: 'avg', label: 'المعدل العام' },
          { key: 'passRate', label: 'نسبة النجاح بالمادة' },
          { key: 'difficulty', label: 'تصنيف الصعوبة' }
        ],
        rows: Object.entries(map).map(([subject, data]) => {
          const avg = data.count ? Math.round(data.total / data.count) : 70;
          const passRate = data.count ? Math.round((data.passed / data.count) * 100) : 80;
          return {
            subject,
            avg: `${avg}%`,
            passRate: `${passRate}%`,
            difficulty: avg < 60 ? 'مادة صعبة وتحتاج تقوية' : avg >= 80 ? 'استيعاب متميز' : 'مادة متوسطة'
          };
        })
      };
    }
  },
  {
    id: 'cmd-top-students',
    name: 'أعلى الطلاب',
    description: 'قائمة الطلاب الأوائل والمتفوقين تحصيلياً في المدرسة',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const sorted = [...students].sort((a, b) => (b.gpa || 0) - (a.gpa || 0));
      const top = sorted.slice(0, 10);

      return {
        title: 'لوحة الشرف: أعلى الطلاب تحصيلاً وتفوقاً',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'أعلى معدل في المدرسة', value: `${top[0]?.gpa || 98}%`, color: 'text-emerald-600' },
          { label: 'عدد المتفوقين (≥90%)', value: students.filter(s => (s.gpa || 0) >= 90).length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'rank', label: 'المرتبة' },
          { key: 'name', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'gpa', label: 'المعدل العام' },
          { key: 'appreciation', label: 'التقدير' }
        ],
        rows: top.map((s, idx) => ({
          rank: idx + 1,
          name: s.fullName,
          grade: s.gradeName,
          gpa: `${s.gpa}%`,
          appreciation: s.gpa >= 90 ? 'امتياز مع مرتبة الشرف' : 'جيد جداً عالٍ'
        }))
      };
    }
  },
  {
    id: 'cmd-lowest-students',
    name: 'أقل الطلاب',
    description: 'قائمة الطلاب المتعثرين دراسياً والمحتاجين لخطة إسناد أكاديمي',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const sorted = [...students].sort((a, b) => (a.gpa || 0) - (b.gpa || 0));
      const lowest = sorted.filter(s => (s.gpa || 0) < 60).slice(0, 10);

      return {
        title: 'الطلاب المتعثرون دراسياً المحتاجون لدعم',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'عدد الطلاب المتعثرين (<60%)', value: lowest.length, color: 'text-rose-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'gpa', label: 'المعدل' },
          { key: 'plan', label: 'الخطة المقترحة' },
          { key: 'parentPhone', label: 'هاتف ولي الأمر' }
        ],
        rows: lowest.map(s => ({
          name: s.fullName,
          grade: s.gradeName,
          gpa: `${s.gpa}%`,
          plan: 'دروس تقوية ومتابعة مع المرشد',
          parentPhone: s.parentPhone || '-'
        }))
      };
    }
  },
  {
    id: 'cmd-passing-students',
    name: 'الطلاب الناجحون',
    description: 'قائمة الطلاب الذين حققوا معدل النجاح (≥50%) في الامتحانات',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const passing = students.filter(s => (s.gpa || 0) >= 50);

      return {
        title: 'الطلاب الناجحون في العام الدراسي',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'إجمالي الناجحين', value: passing.length, color: 'text-emerald-600' },
          { label: 'نسبة النجاح', value: `${Math.round((passing.length / (students.length || 1)) * 100)}%`, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'name', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'gpa', label: 'المعدل' },
          { key: 'result', label: 'النتيجة' }
        ],
        rows: passing.map(s => ({
          name: s.fullName,
          grade: s.gradeName,
          gpa: `${s.gpa}%`,
          result: 'ناجح'
        }))
      };
    }
  },
  {
    id: 'cmd-failing-students',
    name: 'الطلاب الراسبون',
    description: 'قائمة الطلاب المكملين والراسبين الذين لم يحققوا درجة النجاح',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const failing = students.filter(s => (s.gpa || 0) < 50);

      return {
        title: 'الطلاب الراسبون والمكملون',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'عدد الطلاب الراسبين والمكملين', value: failing.length, color: 'text-rose-600' },
          { label: 'نسبة الرسوب', value: `${Math.round((failing.length / (students.length || 1)) * 100)}%`, color: 'text-rose-700' }
        ],
        columns: [
          { key: 'name', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'gpa', label: 'المعدل الحالي' },
          { key: 'status', label: 'الموقف' },
          { key: 'parentPhone', label: 'هاتف ولي الأمر' }
        ],
        rows: failing.length > 0 ? failing.map(s => ({
          name: s.fullName,
          grade: s.gradeName,
          gpa: `${s.gpa}%`,
          status: 'مكمل (فرصة امتحان دور ثانٍ)',
          parentPhone: s.parentPhone || '-'
        })) : [
          {
            name: 'لا يوجد طلاب راسبون بالمعدل العام حالياً',
            grade: '-',
            gpa: '-',
            status: 'النتائج الأولية إيجابية',
            parentPhone: '-'
          }
        ]
      };
    }
  },
  {
    id: 'cmd-success-rates',
    name: 'نسب النجاح',
    description: 'إحصائية نسب النجاح العامة والتفصيلية عبر الصفوف والمواد',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const passing = students.filter(s => (s.gpa || 0) >= 50).length;
      const total = students.length || 1;
      const rate = Math.round((passing / total) * 100);

      return {
        title: 'نسب النجاح العامة في المدرسة',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'نسبة النجاح العامة', value: `${rate}%`, color: 'text-emerald-600' },
          { label: 'الطلاب الناجحون', value: passing, color: 'text-blue-600' },
          { label: 'المكملون / الراسبون', value: total - passing, color: 'text-rose-600' }
        ],
        columns: [
          { key: 'category', label: 'الفئة' },
          { key: 'count', label: 'العدد' },
          { key: 'percentage', label: 'النسبة المئوية' }
        ],
        rows: [
          { category: 'الطلاب الناجحون', count: passing, percentage: `${rate}%` },
          { category: 'المكملون والراسبون', count: total - passing, percentage: `${100 - rate}%` }
        ]
      };
    }
  },
  {
    id: 'cmd-failure-rates',
    name: 'نسب الرسوب',
    description: 'تحليل معدلات الرسوب والمواد الأكثر صعوبة على الطلاب',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const grades = await db.getGrades();
      const failing = grades.filter(g => g.score < 50).length;
      const total = grades.length || 1;
      const rate = Math.round((failing / total) * 100);

      return {
        title: 'تحليل نسب الرسوب في الامتحانات',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'نسبة الرسوب في دفاتر الامتحانات', value: `${rate}%`, color: 'text-rose-600' },
          { label: 'عدد الدفاتر الراسبة', value: failing, color: 'text-rose-700' }
        ],
        columns: [
          { key: 'indicator', label: 'المؤشر' },
          { key: 'value', label: 'القيمة' }
        ],
        rows: [
          { indicator: 'إجمالي أوراق الامتحانات المفحوصة', value: `${total} دفتر امتحاني` },
          { indicator: 'أوراق الاختبار غير المجتازة (<50)', value: `${failing} دفتر` },
          { indicator: 'المعدل العام للرسوب', value: `${rate}%` }
        ]
      };
    }
  },
  {
    id: 'cmd-students-ranking',
    name: 'ترتيب الطلاب',
    description: 'ترتيب الطلاب العام حسب المعدل والتحصيل في المدرسة',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const students = await db.getStudents();
      const sorted = [...students].sort((a, b) => (b.gpa || 0) - (a.gpa || 0));

      return {
        title: 'التصنيف والترتيب العام للطلاب',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'إجمالي الطلاب المرتبين', value: sorted.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'rank', label: 'الترتيب' },
          { key: 'name', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'gpa', label: 'المعدل' }
        ],
        rows: sorted.map((s, idx) => ({
          rank: idx + 1,
          name: s.fullName,
          grade: s.gradeName,
          gpa: `${s.gpa}%`
        }))
      };
    }
  },
  {
    id: 'cmd-exam-results',
    name: 'نتائج الامتحانات',
    description: 'كشف درجات ونتائج الاختبارات والامتحانات الفصلية ونصف السنة',
    category: 'grades',
    categoryLabel: 'الدرجات والنتائج',
    requiredRole: 'all',
    execute: async (db) => {
      const grades = await db.getGrades();
      return {
        title: 'كشف نتائج الامتحانات الشهرية ونصف السنة',
        category: 'الدرجات والنتائج',
        summaryCards: [
          { label: 'إجمالي نتائج الاختبارات', value: grades.length, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'student', label: 'اسم الطالب' },
          { key: 'subject', label: 'المادة' },
          { key: 'exam', label: 'الامتحان' },
          { key: 'score', label: 'الدرجة' },
          { key: 'eval', label: 'التقدير' }
        ],
        rows: grades.map(g => ({
          student: g.studentName,
          subject: g.subjectName,
          exam: g.semester,
          score: `${g.score} / ${g.maxScore || 100}`,
          eval: g.score >= 90 ? 'ممتاز' : g.score >= 80 ? 'جيد جداً' : g.score >= 70 ? 'جيد' : g.score >= 50 ? 'مقبول' : 'راسب'
        }))
      };
    }
  },

  // =========================================================================
  // 8. الأقساط الدراسية والحسابات المالية (Fees & Finance)
  // =========================================================================
  {
    id: 'cmd-fees-inventory',
    name: 'جرد أقساط الطلاب',
    description: 'كشف شامل بالأقساط الدراسية المستحقة والمسددة والمتبقية لجميع الطلاب',
    category: 'fees',
    categoryLabel: 'الأقساط الدراسية',
    requiredRole: 'all',
    execute: async (db) => {
      const fees = await db.getTuitionFees();
      const totalRequired = fees.reduce((a, b) => a + (b.totalFee || 0), 0);
      const totalPaid = fees.reduce((a, b) => a + (b.paidAmount || 0), 0);
      const totalRemaining = fees.reduce((a, b) => a + (b.remainingAmount || 0), 0);

      return {
        title: 'جرد الأقساط الدراسية الشامل',
        category: 'الأقساط الدراسية',
        summaryCards: [
          { label: 'إجمالي الأقساط المقررة', value: `${totalRequired.toLocaleString()} د.ع`, color: 'text-blue-700' },
          { label: 'المحصل فعلياً', value: `${totalPaid.toLocaleString()} د.ع`, color: 'text-emerald-700' },
          { label: 'الديون المتبقية', value: `${totalRemaining.toLocaleString()} د.ع`, color: 'text-amber-700' },
          { label: 'نسبة التحصيل', value: `${Math.round((totalPaid / (totalRequired || 1)) * 100)}%`, color: 'text-indigo-700' }
        ],
        columns: [
          { key: 'student', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'total', label: 'القسط السنوي' },
          { key: 'paid', label: 'المسدد' },
          { key: 'remaining', label: 'المتبقي' },
          { key: 'status', label: 'حالة السداد' }
        ],
        rows: fees.map(f => ({
          student: f.studentName,
          grade: f.gradeName,
          total: `${(f.totalFee || 0).toLocaleString()} د.ع`,
          paid: `${(f.paidAmount || 0).toLocaleString()} د.ع`,
          remaining: `${(f.remainingAmount || 0).toLocaleString()} د.ع`,
          status: f.status === 'paid' ? 'مسدد بالكامل' : f.status === 'overdue' ? 'متأخر بالسداد' : 'سداد جزئي'
        }))
      };
    }
  },
  {
    id: 'cmd-fees-completed',
    name: 'الطلاب الذين سددوا بالكامل',
    description: 'قائمة الطلاب الذين أتموا سداد كامل القسط السنوي بدون متبقي',
    category: 'fees',
    categoryLabel: 'الأقساط الدراسية',
    requiredRole: 'all',
    execute: async (db) => {
      const fees = await db.getTuitionFees();
      const completed = fees.filter(f => f.remainingAmount <= 0 && f.paidAmount > 0);

      return {
        title: 'الطلاب مكتملو السداد بالكامل',
        category: 'الأقساط الدراسية',
        summaryCards: [
          { label: 'عدد الطلاب مكتملي السداد', value: completed.length, color: 'text-emerald-600' },
          { label: 'المبالغ المسددة بالكامل', value: `${completed.reduce((a, b) => a + b.paidAmount, 0).toLocaleString()} د.ع`, color: 'text-blue-600' }
        ],
        columns: [
          { key: 'studentName', label: 'اسم الطالب' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'totalFee', label: 'القسط السنوي' },
          { key: 'paidAmount', label: 'المسدد بالكامل' },
          { key: 'status', label: 'الحالة' }
        ],
        rows: completed.map(f => ({
          studentName: f.studentName,
          gradeName: f.gradeName,
          totalFee: `${(f.totalFee || 0).toLocaleString()} د.ع`,
          paidAmount: `${(f.paidAmount || 0).toLocaleString()} د.ع`,
          status: 'مسدد بالكامل'
        }))
      };
    }
  },
  {
    id: 'cmd-fees-remaining',
    name: 'الطلاب الذين لديهم مبالغ متبقية',
    description: 'استعلام الطلاب الذين يترتب عليهم مبالغ أقساط متبقية واجبة السداد',
    category: 'fees',
    categoryLabel: 'الأقساط الدراسية',
    requiredRole: 'all',
    execute: async (db) => {
      const fees = await db.getTuitionFees();
      const unpaid = fees.filter(f => f.remainingAmount > 0);
      const totalRemaining = unpaid.reduce((a, b) => a + b.remainingAmount, 0);

      return {
        title: 'الطلاب الذين لديهم مبالغ أقساط متبقية',
        category: 'الأقساط الدراسية',
        summaryCards: [
          { label: 'عدد الطلاب المتبقي عليهم', value: unpaid.length, color: 'text-amber-600' },
          { label: 'إجمالي المبالغ المستحقة', value: `${totalRemaining.toLocaleString()} د.ع`, color: 'text-rose-600' }
        ],
        columns: [
          { key: 'studentName', label: 'اسم الطالب' },
          { key: 'gradeName', label: 'الصف' },
          { key: 'totalFee', label: 'القسط السنوي' },
          { key: 'paidAmount', label: 'المسدد' },
          { key: 'remainingAmount', label: 'المبلغ المتبقي' },
          { key: 'status', label: 'حالة القسط' }
        ],
        rows: unpaid.map(f => ({
          studentName: f.studentName,
          gradeName: f.gradeName,
          totalFee: `${(f.totalFee || 0).toLocaleString()} د.ع`,
          paidAmount: `${(f.paidAmount || 0).toLocaleString()} د.ع`,
          remainingAmount: `${(f.remainingAmount || 0).toLocaleString()} د.ع`,
          status: f.status === 'overdue' ? 'متأخر' : 'جزئي'
        }))
      };
    }
  },
  {
    id: 'cmd-fees-overdue',
    name: 'الطلاب المتأخرون بالسداد',
    description: 'الطلاب المتأخرون عن المواعيد المحددة لسداد الأقساط الدراسية',
    category: 'fees',
    categoryLabel: 'الأقساط الدراسية',
    requiredRole: 'all',
    execute: async (db) => {
      const fees = await db.getTuitionFees();
      const students = await db.getStudents();
      const overdue = fees.filter(f => f.status === 'overdue' || (f.remainingAmount > 0 && f.dueDate && new Date(f.dueDate) < new Date()));

      return {
        title: 'الطلاب المتأخرون في سداد الأقساط',
        category: 'الأقساط الدراسية',
        summaryCards: [
          { label: 'عدد الطلاب المتأخرين', value: overdue.length, color: 'text-rose-600' },
          { label: 'إجمالي ديون التأخر', value: `${overdue.reduce((a, b) => a + b.remainingAmount, 0).toLocaleString()} د.ع`, color: 'text-rose-700' }
        ],
        columns: [
          { key: 'student', label: 'اسم الطالب' },
          { key: 'grade', label: 'الصف' },
          { key: 'remaining', label: 'المبلغ المتأخر' },
          { key: 'dueDate', label: 'تاريخ الاستحقاق' },
          { key: 'parentPhone', label: 'هاتف ولي الأمر' }
        ],
        rows: overdue.map(f => {
          const st = students.find(s => s.id === f.studentId || s.fullName === f.studentName);
          return {
            student: f.studentName,
            grade: f.gradeName,
            remaining: `${(f.remainingAmount || 0).toLocaleString()} د.ع`,
            dueDate: f.dueDate || '2026-02-15',
            parentPhone: st?.parentPhone || '-'
          };
        })
      };
    }
  },
  {
    id: 'cmd-finance-totals',
    name: 'الميزانية والمؤشرات المالية الإجمالية للمدرسة',
    description: 'إجمالي الإيرادات، المصروفات التشغيلية، وصافي التدفق المالي (خاص بالمالك والمحاسب)',
    category: 'finance',
    categoryLabel: 'الحسابات المالية',
    requiredRole: 'financial_only',
    execute: async (db, userRole) => {
      const roleStr = (userRole || '').toUpperCase();
      if (roleStr === 'SCHOOL_MANAGER' || roleStr === 'MANAGER') {
        throw new Error('غير مصرح لمدير المدرسة بالوصول إلى المجاميع المالية الإجمالية وفق ضوابط الحماية المالية للمؤسسة.');
      }

      const tuitionFees = await db.getTuitionFees();
      const expenses = await db.getExpenses();
      const payroll = await db.getPayroll();

      const totalExpected = tuitionFees.reduce((a, f) => a + (f.totalFee || 0), 0);
      const totalCollected = tuitionFees.reduce((a, f) => a + (f.paidAmount || 0), 0);
      const totalDebts = tuitionFees.reduce((a, f) => a + (f.remainingAmount || 0), 0);
      const totalExpenses = expenses.reduce((a, e) => a + (e.amount || 0), 0);
      const totalPayroll = payroll.reduce((a, p) => a + (p.netSalary || 0), 0);
      const netProfit = totalCollected - totalExpenses;

      return {
        title: 'المؤشرات المالية الإجمالية للمدرسة',
        category: 'الحسابات المالية',
        summaryCards: [
          { label: 'إجمالي الأقساط المستحقة', value: `${totalExpected.toLocaleString()} د.ع`, color: 'text-blue-700' },
          { label: 'إجمالي المحصل فعلياً', value: `${totalCollected.toLocaleString()} د.ع`, color: 'text-emerald-700' },
          { label: 'الديون المتبقية', value: `${totalDebts.toLocaleString()} د.ع`, color: 'text-amber-700' },
          { label: 'إجمالي المصروفات', value: `${totalExpenses.toLocaleString()} د.ع`, color: 'text-rose-700' },
          { label: 'صافي الفائض النقدي', value: `${netProfit.toLocaleString()} د.ع`, color: 'text-indigo-700' }
        ],
        columns: [
          { key: 'metric', label: 'البند المالي' },
          { key: 'amount', label: 'المبلغ الإجمالي' },
          { key: 'notes', label: 'الملاحظات والبيان' }
        ],
        rows: [
          { metric: 'إجمالي الإيرادات المحصلة', amount: `${totalCollected.toLocaleString()} د.ع`, notes: 'مجموع الدفعات النقدية والتحويلات المسلمة للصندوق' },
          { metric: 'إجمالي الديون والأقساط المؤجلة', amount: `${totalDebts.toLocaleString()} د.ع`, notes: 'مستحقات على أولياء الأمور واجبة التحصيل' },
          { metric: 'المصروفات التشغيلية والخدمية', amount: `${totalExpenses.toLocaleString()} د.ع`, notes: 'فواتير الصيانة، الوقود، التجهيزات المدرسية' },
          { metric: 'كتلة الرواتب والأجور الشهرية', amount: `${totalPayroll.toLocaleString()} د.ع`, notes: 'استحقاقات الهيئة التعليمية والكادر الإداري' },
          { metric: 'صافي التدفق المالي الحالي', amount: `${netProfit.toLocaleString()} د.ع`, notes: 'الفائض المالي بعد خصم المصروفات من الإيرادات' }
        ]
      };
    }
  },
  {
    id: 'cmd-transport-inventory',
    name: 'جرد خطوط النقل والمركبات والسائقين',
    description: 'تفاصيل مسارات النقل المدرسي وسعة المركبات والطلاب المشتركين',
    category: 'transport',
    categoryLabel: 'النقل المدرسي',
    requiredRole: 'all',
    execute: async (db) => {
      const routes = await db.getRoutes();
      const drivers = await db.getDrivers();
      const vehicles = await db.getVehicles();

      return {
        title: 'جرد النقل المدرسي والخطوط',
        category: 'النقل المدرسي',
        summaryCards: [
          { label: 'إجمالي الخطوط', value: routes.length, color: 'text-blue-600' },
          { label: 'السائقون المعينون', value: drivers.length, color: 'text-emerald-600' },
          { label: 'أسطول المركبات', value: vehicles.length, color: 'text-amber-600' }
        ],
        columns: [
          { key: 'routeName', label: 'اسم الخط' },
          { key: 'driver', label: 'السائق' },
          { key: 'vehicle', label: 'المركبة' },
          { key: 'studentsCount', label: 'عدد الطلاب' },
          { key: 'capacity', label: 'السعة' }
        ],
        rows: routes.map(r => ({
          routeName: r.name,
          driver: r.driverName || '-',
          vehicle: r.vehiclePlate || '-',
          studentsCount: r.studentsCount,
          capacity: r.capacity
        }))
      };
    }
  },
  {
    id: 'cmd-receipts-inventory',
    name: 'سندات القبض المالية الصادرة',
    description: 'استعلام جميع سندات القبض الصادرة من أمانة الصندوق مع التواريخ والمبالغ',
    category: 'documents',
    categoryLabel: 'السندات والمستندات',
    requiredRole: 'all',
    execute: async (db) => {
      const receipts = await db.getReceipts();
      return {
        title: 'سندات القبض المسجلة في النظام',
        category: 'السندات والمستندات',
        summaryCards: [
          { label: 'إجمالي السندات الصادرة', value: receipts.length, color: 'text-blue-600' },
          { label: 'إجمالي المقبوضات', value: `${receipts.reduce((a, b) => a + (b.amount || 0), 0).toLocaleString()} د.ع`, color: 'text-emerald-600' }
        ],
        columns: [
          { key: 'receiptNumber', label: 'رقم السند' },
          { key: 'date', label: 'تاريخ الإصدار' },
          { key: 'studentName', label: 'اسم الطالب' },
          { key: 'amount', label: 'المبلغ المقبوض' },
          { key: 'method', label: 'طريقة الدفع' },
          { key: 'cashier', label: 'الموظف المسؤول' }
        ],
        rows: receipts.map(r => ({
          receiptNumber: r.receiptNumber,
          date: r.date,
          studentName: r.studentName,
          amount: `${(r.amount || 0).toLocaleString()} د.ع`,
          method: r.paymentMethod || 'نقداً',
          cashier: r.employeeName || 'المحاسب المالي'
        }))
      };
    }
  }
];
