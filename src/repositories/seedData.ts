/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * البنية الهيكلية الأولية لنظام إدارة المدارس العراقي
 * نظام جاهز للإدخال الحقيقي بدون بيانات تجريبية أو وهمية
 */

import {
  SchoolSettings,
  Student,
  Parent,
  Teacher,
  Employee,
  ClassGrade,
  Section,
  Subject,
  TimetableSlot,
  AttendanceRecord,
  GradeRecord,
  Certificate,
  TuitionFee,
  PaymentReceipt,
  Expense,
  PayrollRecord,
  TransportRoute,
  Driver,
  Vehicle,
  Announcement,
  NotificationItem,
  MessageItem,
  AuditLog,
  SmartAlert
} from '../types';

export const INITIAL_SCHOOL_SETTINGS: SchoolSettings = {
  name: '', logoUrl: '', description: '', address: '', phone: '', email: '', website: '',
  province: '', city: '', currentAcademicYear: '', currency: 'د.ع', currencyCode: 'IQD',
  gradingSystem: '100', principalName: '', workHours: '7:30 ص - 2:00 م', schoolAccessCode: '',
  schoolAccessCodeCreatedAt: ''
};

// الصفوف الدراسية المعتمدة في المنهج العراقي
export const INITIAL_CLASSES: ClassGrade[] = [
  { id: 'cls-1', stage: 'متوسط', name: 'الصف الأول المتوسط', capacity: 120, currentStudentsCount: 0 },
  { id: 'cls-2', stage: 'متوسط', name: 'الصف الثاني المتوسط', capacity: 120, currentStudentsCount: 0 },
  { id: 'cls-3', stage: 'متوسط', name: 'الصف الثالث المتوسط (الوزاري)', capacity: 120, currentStudentsCount: 0 },
  { id: 'cls-4', stage: 'إعدادي', name: 'الصف الرابع العلمي', capacity: 100, currentStudentsCount: 0 },
  { id: 'cls-5', stage: 'إعدادي', name: 'الصف الخامس العلمي', capacity: 100, currentStudentsCount: 0 },
  { id: 'cls-6', stage: 'إعدادي', name: 'الصف السادس العلمي (الوزاري)', capacity: 100, currentStudentsCount: 0 },
];

// الشعب الدراسية
export const INITIAL_SECTIONS: Section[] = [
  { id: 'sec-1', gradeId: 'cls-1', gradeName: 'الصف الأول المتوسط', name: 'أ', roomNumber: 'قاعة 1', studentsCount: 0 },
  { id: 'sec-2', gradeId: 'cls-2', gradeName: 'الصف الثاني المتوسط', name: 'أ', roomNumber: 'قاعة 2', studentsCount: 0 },
  { id: 'sec-3', gradeId: 'cls-3', gradeName: 'الصف الثالث المتوسط (الوزاري)', name: 'أ', roomNumber: 'قاعة 3', studentsCount: 0 },
  { id: 'sec-4', gradeId: 'cls-4', gradeName: 'الصف الرابع العلمي', name: 'أ', roomNumber: 'قاعة 4', studentsCount: 0 },
  { id: 'sec-5', gradeId: 'cls-5', gradeName: 'الصف الخامس العلمي', name: 'أ', roomNumber: 'قاعة 5', studentsCount: 0 },
  { id: 'sec-6', gradeId: 'cls-6', gradeName: 'الصف السادس العلمي (الوزاري)', name: 'أ', roomNumber: 'قاعة 6', studentsCount: 0 },
];

// المواد الدراسية الرسمية للمنهج العراقي
export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'التربية الإسلامية والقرآن الكريم', code: 'ISL-101', stage: 'متوسط', gradeId: 'cls-1', gradeName: 'الصف الأول المتوسط', weeklyClasses: 2 },
  { id: 'sub-2', name: 'اللغة العربية وقواعدها', code: 'ARB-101', stage: 'متوسط', gradeId: 'cls-1', gradeName: 'الصف الأول المتوسط', weeklyClasses: 5 },
  { id: 'sub-3', name: 'اللغة الإنكليزية', code: 'ENG-101', stage: 'متوسط', gradeId: 'cls-1', gradeName: 'الصف الأول المتوسط', weeklyClasses: 4 },
  { id: 'sub-4', name: 'الرياضيات العامة', code: 'MTH-101', stage: 'متوسط', gradeId: 'cls-1', gradeName: 'الصف الأول المتوسط', weeklyClasses: 5 },
  { id: 'sub-5', name: 'العلوم العامة', code: 'SCI-101', stage: 'متوسط', gradeId: 'cls-1', gradeName: 'الصف الأول المتوسط', weeklyClasses: 4 },
  { id: 'sub-6', name: 'الاجتماعيات (التاريخ والجغرافية والوطنية)', code: 'SOC-101', stage: 'متوسط', gradeId: 'cls-1', gradeName: 'الصف الأول المتوسط', weeklyClasses: 3 },
  { id: 'sub-7', name: 'الفيزياء', code: 'PHY-301', stage: 'إعدادي', gradeId: 'cls-6', gradeName: 'الصف السادس العلمي (الوزاري)', weeklyClasses: 5 },
  { id: 'sub-8', name: 'الكيمياء', code: 'CHM-301', stage: 'إعدادي', gradeId: 'cls-6', gradeName: 'الصف السادس العلمي (الوزاري)', weeklyClasses: 5 },
  { id: 'sub-9', name: 'الأحياء', code: 'BIO-301', stage: 'إعدادي', gradeId: 'cls-6', gradeName: 'الصف السادس العلمي (الوزاري)', weeklyClasses: 4 },
  { id: 'sub-10', name: 'الرياضيات التطبيقية والتفاضل والتكامل', code: 'MTH-301', stage: 'إعدادي', gradeId: 'cls-6', gradeName: 'الصف السادس العلمي (الوزاري)', weeklyClasses: 6 },
];

// جداول بيانات حقيقية فارغة جاهزة للتسجيل والإدخال
export const INITIAL_PARENTS: Parent[] = [];
export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_TEACHERS: Teacher[] = [];
export const INITIAL_EMPLOYEES: Employee[] = [];
export const INITIAL_TIMETABLE: TimetableSlot[] = [];
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];
export const INITIAL_GRADES: GradeRecord[] = [];
export const INITIAL_CERTIFICATES: Certificate[] = [];
export const INITIAL_TUITION_FEES: TuitionFee[] = [];
export const INITIAL_RECEIPTS: PaymentReceipt[] = [];
export const INITIAL_EXPENSES: Expense[] = [];
export const INITIAL_PAYROLL: PayrollRecord[] = [];
export const INITIAL_DRIVERS: Driver[] = [];
export const INITIAL_VEHICLES: Vehicle[] = [];
export const INITIAL_ROUTES: TransportRoute[] = [];
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_MESSAGES: MessageItem[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
export const INITIAL_SMART_ALERTS: SmartAlert[] = [];
