/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * نظام إدارة المدارس الذكي — نماذج البيانات والأنواع الأساسية
 */

export type UserRole = 
  | 'SCHOOL_OWNER' 
  | 'SCHOOL_MANAGER' 
  | 'ACCOUNTANT' 
  | 'admin' 
  | 'owner'
  | 'manager'
  | 'accountant' 
  | 'teacher' 
  | 'student' 
  | 'parent';

export interface SchoolSettings {
  name: string;
  logoUrl: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  province: string;
  city: string;
  currentAcademicYear: string;
  currency: string;
  currencyCode: string;
  gradingSystem: string;
  principalName: string;
  workHours: string;
  schoolAccessCode: string; // كود الدخول السري الموحد للمدرسة
  schoolAccessCodeCreatedAt?: string;
}

export interface LoginAttemptLog {
  id: string;
  email: string;
  role: string;
  timestamp: string;
  success: boolean;
  failureReason?: string;
}

export interface SchoolCommandResult {
  title: string;
  category: string;
  summaryCards: { label: string; value: string | number; color?: string }[];
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
  notes?: string;
}

export interface HomeworkAssignment {
  id: string;
  title: string;
  subjectName: string;
  gradeName: string;
  sectionName: string;
  teacherName: string;
  dueDate: string;
  createdAt: string;
  description: string;
  submissionsCount: number;
}

export interface StudentAchievement {
  id: string;
  studentId: string;
  studentName: string;
  badge: 'الطالب المثالي' | 'متفوق دراسياً' | 'حضور كامل' | 'أعلى معدل' | 'طالب ملتزم';
  points: number;
  dateAwarded: string;
  reason: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'امتحان' | 'واجب' | 'عطلة' | 'اجتماع' | 'فعالية' | 'قسط' | 'نشاط';
  date: string;
  time?: string;
  description?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  title: string;
}

export interface Student {
  id: string;
  studentNumber: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  avatar: string;
  birthDate: string;
  gender: 'male' | 'female';
  nationality: string;
  bloodType: string;
  nationalId: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  province: string;
  
  // البيانات الأكاديمية
  stage: 'ابتدائي' | 'متوسط' | 'إعدادي';
  gradeId: string;
  gradeName: string;
  sectionId: string;
  sectionName: string;
  academicYear: string;
  registrationDate: string;
  status: 'active' | 'graduated' | 'archived' | 'transferred';
  gpa: number;
  rank: number;
  
  // البيانات الصحية
  healthStatus: string;
  allergies: string;
  chronicDiseases: string;
  medications: string;
  emergencyContact: string;
  
  // ولي الأمر
  parentId: string;
  parentName: string;
  parentPhone: string;
  
  // النقل
  transportRouteId?: string;
  
  // المستمسكات
  documents: {
    id: string;
    title: string;
    type: string;
    date: string;
  }[];
}

export interface Parent {
  id: string;
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
  job: string;
  address: string;
  nationalId: string;
  childrenIds: string[];
}

export interface Teacher {
  id: string;
  fullName: string;
  avatar: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  nationalId: string;
  qualification: string;
  specialty: string;
  university: string;
  graduationYear: string;
  hireDate: string;
  contractType: 'دائمي' | 'عقد سنوي' | 'أجور ساعات';
  subjectIds: string[];
  classIds: string[];
  workHours: number;
  basicSalary: number;
  allowances: number;
  bonuses: number;
  deductions: number;
  advances: number;
  netSalary: number;
  status: 'active' | 'on_leave';
  leavesCount: number;
}

export interface Employee {
  id: string;
  fullName: string;
  roleType: 'إداري' | 'محاسب' | 'استقبال' | 'مشرف' | 'عامل' | 'حارس' | 'سائق';
  phone: string;
  email: string;
  avatar: string;
  basicSalary: number;
  hireDate: string;
  status: 'نشط' | 'في إجازة';
  leaves: number;
}

export interface ClassGrade {
  id: string;
  stage: 'متوسط' | 'إعدادي' | 'ابتدائي';
  name: string;
  capacity: number;
  currentStudentsCount: number;
}

export interface Section {
  id: string;
  gradeId: string;
  gradeName: string;
  name: string;
  homeroomTeacherId?: string;
  homeroomTeacherName?: string;
  roomNumber: string;
  studentsCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  stage: string;
  gradeId: string;
  gradeName: string;
  teacherId?: string;
  teacherName?: string;
  weeklyClasses?: number;
  maxScore?: number;
  passingScore?: number;
  description?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس';
  period: number; // 1 to 6
  startTime: string;
  endTime: string;
  gradeId: string;
  sectionId: string;
  subjectName: string;
  teacherName: string;
  roomNumber: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  gradeId: string;
  sectionId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
  notifiedParent: boolean;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  gradeId: string;
  semester: 'شهر أول' | 'نصف السنة' | 'شهر ثاني' | 'الامتحان النهائي' | 'واجبات ونشاط';
  score: number;
  maxScore: number;
  date: string;
  notes?: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  studentName: string;
  gradeName: string;
  sectionName: string;
  academicYear: string;
  date: string;
  grades: {
    subjectName: string;
    maxScore: number;
    score: number;
    passingScore: number;
    evaluation: string;
  }[];
  totalScore: number;
  maxTotalScore: number;
  percentage: number;
  overallEvaluation: string;
  status: 'passed' | 'failed';
  principalSignature: string;
  qrCodeData: string;
}

export interface TuitionFee {
  id: string;
  studentId: string;
  studentName: string;
  gradeName: string;
  academicYear: string;
  totalFee: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
  installments: {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'unpaid';
    paidDate?: string;
  }[];
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  gradeName: string;
  amount: number;
  reason: 'قسط دراسي' | 'كتب وقرطاسية' | 'زي مدرسي' | 'نقل مدرسي' | 'رسوم امتحانات' | 'رسوم إضافية';
  date: string;
  employeeName: string;
  receivedByName?: string;
  paymentMethod: 'نقدي' | 'تحويل زين كاش' | 'بطاقة كي كارد' | 'حساب مصرفي';
  remainingBalance: number;
  qrCodeData: string;
  notes?: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  category: 'الرواتب والأجور' | 'الكهرباء والمولدات' | 'الماء والخدمات' | 'الإنترنت والاتصالات' | 'الصيانة والترميم' | 'القرطاسية والكتب' | 'الأثاث والتجهيزات' | 'الوقود والنقل' | 'النظافة ومواد التعقيم' | 'النشاطات والفعاليات' | 'الإيجار السنوي' | 'أخرى';
  amount: number;
  date: string;
  beneficiary: string;
  paymentMethod: 'نقدي' | 'تحويل بنكي' | 'شيك';
  description: string;
  employeeName: string;
  invoiceNumber?: string;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  month: string;
  basicSalary: number;
  transportAllowance: number;
  otherAllowances: number;
  bonuses: number;
  overtime: number;
  deductions: number;
  advances: number;
  absencesDeduction: number;
  netSalary: number;
  status: 'مدفوع' | 'معلق';
  paymentDate?: string;
}

export interface TransportRoute {
  id: string;
  routeNumber: string;
  name: string;
  startPoint: string;
  endPoint: string;
  neighborhoods: string[];
  morningTime: string;
  afternoonTime: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleId: string;
  vehiclePlate: string;
  studentsCount: number;
  capacity: number;
}

export interface Driver {
  id: string;
  fullName: string;
  phone: string;
  avatar: string;
  address: string;
  nationalId: string;
  licenseNumber: string;
  licenseType: 'عمومي' | 'فئة رابعة' | 'فئة ثالثة';
  licenseExpiryDate: string;
  hireDate: string;
  salary: number;
  routeId?: string;
}

export interface Vehicle {
  id: string;
  type: string;
  model: string;
  makeYear: string;
  color: string;
  plateNumber: string;
  seatsCapacity: number;
  status: 'نشطة' | 'في الصيانة' | 'فحص دوري مطلوب';
  inspectionExpiryDate: string;
  insuranceExpiryDate: string;
}

export interface Announcement {
  id: string;
  type: 'خبر' | 'إعلان' | 'تنبيه' | 'فعالية' | 'عطلة' | 'اجتماع';
  title: string;
  content: string;
  date: string;
  expiryDate: string;
  author: string;
  targetAudience: 'الجميع' | 'المدرسين' | 'الطلاب' | 'أولياء الأمور';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'attendance' | 'fees' | 'grades' | 'exam' | 'announcement' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  receiverRole: UserRole;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  department: string;
  affectedData: string;
  timestamp: string;
}

export interface SmartAlert {
  id: string;
  type: 'attendance_drop' | 'overdue_fee' | 'license_expiring' | 'low_grade' | 'high_expenses';
  title: string;
  description: string;
  severity: 'warning' | 'error' | 'info';
  date: string;
  targetSection?: string;
}
