/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * طبقة البيانات المركزية لنظام إدارة المدارس العراقي
 * يدعم التخزين المحلي الآمن وقاعدة بيانات Firebase الحقيقية
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
  SmartAlert,
  LoginAttemptLog,
  HomeworkAssignment,
  StudentAchievement,
  CalendarEvent
} from '../types';

import {
  INITIAL_SCHOOL_SETTINGS,
  INITIAL_CLASSES,
  INITIAL_SECTIONS,
  INITIAL_SUBJECTS,
  INITIAL_PARENTS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_EMPLOYEES,
  INITIAL_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_ROUTES,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  INITIAL_GRADES,
  INITIAL_CERTIFICATES,
  INITIAL_TUITION_FEES,
  INITIAL_RECEIPTS,
  INITIAL_EXPENSES,
  INITIAL_PAYROLL,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SMART_ALERTS
} from './seedData';

export interface IDatabaseAdapter {
  getSettings(): Promise<SchoolSettings>;
  saveSettings(settings: SchoolSettings): Promise<void>;

  // كود أمان دخول المدرسة
  getSchoolAccessCode(): Promise<string>;
  verifySchoolAccessCode(inputCode: string): Promise<boolean>;
  regenerateSchoolAccessCode(): Promise<string>;

  // سجل محاولات الدخول الحساسة
  getLoginAttempts(): Promise<LoginAttemptLog[]>;
  logLoginAttempt(attempt: LoginAttemptLog): Promise<void>;

  // الطلبة
  getStudents(): Promise<Student[]>;
  saveStudent(student: Student): Promise<void>;
  deleteStudent(id: string): Promise<void>;

  // أولياء الأمور
  getParents(): Promise<Parent[]>;
  saveParent(parent: Parent): Promise<void>;

  // الهيئة التعليمية
  getTeachers(): Promise<Teacher[]>;
  saveTeacher(teacher: Teacher): Promise<void>;
  deleteTeacher(id: string): Promise<void>;

  // الموظفون
  getEmployees(): Promise<Employee[]>;
  saveEmployee(employee: Employee): Promise<void>;

  // الصفوف والشعب
  getClasses(): Promise<ClassGrade[]>;
  saveClass(cls: ClassGrade): Promise<void>;

  getSections(): Promise<Section[]>;
  saveSection(section: Section): Promise<void>;

  // المواد
  getSubjects(): Promise<Subject[]>;
  saveSubject(subject: Subject): Promise<void>;

  // الجدول الدراسي
  getTimetable(): Promise<TimetableSlot[]>;
  saveTimetableSlot(slot: TimetableSlot): Promise<void>;
  deleteTimetableSlot(id: string): Promise<void>;

  // الحضور والغياب
  getAttendance(): Promise<AttendanceRecord[]>;
  recordAttendance(records: AttendanceRecord[]): Promise<void>;

  // الدرجات والامتحانات
  getGrades(): Promise<GradeRecord[]>;
  saveGrade(grade: GradeRecord): Promise<void>;

  // الشهادات
  getCertificates(): Promise<Certificate[]>;
  saveCertificate(cert: Certificate): Promise<void>;

  // الأقساط والمدفوعات وسندات القبض
  getTuitionFees(): Promise<TuitionFee[]>;
  saveTuitionFee(fee: TuitionFee): Promise<void>;

  getReceipts(): Promise<PaymentReceipt[]>;
  saveReceipt(receipt: PaymentReceipt): Promise<void>;

  // المصروفات
  getExpenses(): Promise<Expense[]>;
  saveExpense(expense: Expense): Promise<void>;

  // الرواتب والأجور
  getPayroll(): Promise<PayrollRecord[]>;
  savePayroll(payroll: PayrollRecord): Promise<void>;

  // النقل والمركبات
  getRoutes(): Promise<TransportRoute[]>;
  saveRoute(route: TransportRoute): Promise<void>;

  getDrivers(): Promise<Driver[]>;
  saveDriver(driver: Driver): Promise<void>;

  getVehicles(): Promise<Vehicle[]>;
  saveVehicle(vehicle: Vehicle): Promise<void>;

  // الواجبات والأنشطة
  getHomework(): Promise<HomeworkAssignment[]>;
  saveHomework(hw: HomeworkAssignment): Promise<void>;

  // إنجازات وتحفيز الطلبة
  getAchievements(): Promise<StudentAchievement[]>;
  saveAchievement(ach: StudentAchievement): Promise<void>;

  // التقويم المدرسي
  getCalendarEvents(): Promise<CalendarEvent[]>;
  saveCalendarEvent(ev: CalendarEvent): Promise<void>;

  // الإشعارات وسجل العمليات
  getNotifications(): Promise<NotificationItem[]>;
  markNotificationRead(id: string): Promise<void>;
  addNotification(notif: NotificationItem): Promise<void>;

  getAuditLogs(): Promise<AuditLog[]>;
  addAuditLog(log: AuditLog): Promise<void>;

  getSmartAlerts(): Promise<SmartAlert[]>;
  resolveSmartAlert(id: string): Promise<void>;

  // الإعلانات والفعاليات
  getAnnouncements(): Promise<Announcement[]>;
  saveAnnouncement(announcement: Announcement): Promise<void>;

  // الرسائل والتواصل
  getMessages(): Promise<MessageItem[]>;
  sendMessage(message: MessageItem): Promise<void>;

  // تنظيف شامل
  resetToInitialClean(): Promise<void>;
}

const STORAGE_PREFIX = 'noor_alkamal_school_db_';
const CLEAN_VERSION_FLAG = 'school_iraq_clean_v3_ready';

export class LocalStorageDatabaseAdapter implements IDatabaseAdapter {
  constructor() {
    this.ensureCleanDataOnBoot();
  }

  private ensureCleanDataOnBoot(): void {
    try {
      if (typeof localStorage === 'undefined') return;
      // إذا كانت التخزينات السابقة تحتوي على بيانات تجريبية وهمية قديمة، نقوم بمسحها لتبدأ المدرسة نظيفة وحقيقية
      const isClean = localStorage.getItem(CLEAN_VERSION_FLAG);
      if (!isClean) {
        // تنظيف النسخ القديمة بالكامل: تبدأ كل مدرسة بمساحة فارغة وحقيقية.
        const keys = Object.keys(localStorage);
        for (const k of keys) {
          if (k.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k);
        }
        localStorage.setItem(CLEAN_VERSION_FLAG, 'true');
      }
    } catch {
      // ignore
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage:`, e);
    }
  }

  async getSettings(): Promise<SchoolSettings> {
    const s = this.getItem('settings', INITIAL_SCHOOL_SETTINGS);
    if (!s.schoolAccessCode) {
      s.schoolAccessCode = 'NK-SEC-94721-KML';
      this.setItem('settings', s);
    }
    return s;
  }

  async saveSettings(settings: SchoolSettings): Promise<void> {
    this.setItem('settings', settings);
  }

  async getSchoolAccessCode(): Promise<string> {
    const s = await this.getSettings();
    return s.schoolAccessCode || 'NK-SEC-94721-KML';
  }

  async verifySchoolAccessCode(inputCode: string): Promise<boolean> {
    if (!inputCode) return false;
    const currentCode = await this.getSchoolAccessCode();
    return inputCode.trim() === currentCode.trim();
  }

  async regenerateSchoolAccessCode(): Promise<string> {
    const randPart1 = Math.floor(10000 + Math.random() * 90000);
    const randChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `NK-SEC-${randPart1}-${randChars}`;
    const s = await this.getSettings();
    s.schoolAccessCode = newCode;
    s.schoolAccessCodeCreatedAt = new Date().toISOString();
    await this.saveSettings(s);
    return newCode;
  }

  async getLoginAttempts(): Promise<LoginAttemptLog[]> {
    return this.getItem('login_attempts', []);
  }

  async logLoginAttempt(attempt: LoginAttemptLog): Promise<void> {
    const list = await this.getLoginAttempts();
    list.unshift(attempt);
    if (list.length > 100) list.pop(); // keep last 100
    this.setItem('login_attempts', list);
  }

  async getStudents(): Promise<Student[]> {
    return this.getItem('students', INITIAL_STUDENTS);
  }

  async saveStudent(student: Student): Promise<void> {
    const list = await this.getStudents();
    const index = list.findIndex(s => s.id === student.id);
    if (index >= 0) {
      list[index] = student;
    } else {
      list.unshift(student);
    }
    this.setItem('students', list);
  }

  async deleteStudent(id: string): Promise<void> {
    const list = await this.getStudents();
    this.setItem('students', list.filter(s => s.id !== id));
  }

  async getParents(): Promise<Parent[]> {
    return this.getItem('parents', INITIAL_PARENTS);
  }

  async saveParent(parent: Parent): Promise<void> {
    const list = await this.getParents();
    const index = list.findIndex(p => p.id === parent.id);
    if (index >= 0) {
      list[index] = parent;
    } else {
      list.unshift(parent);
    }
    this.setItem('parents', list);
  }

  async getTeachers(): Promise<Teacher[]> {
    return this.getItem('teachers', INITIAL_TEACHERS);
  }

  async saveTeacher(teacher: Teacher): Promise<void> {
    const list = await this.getTeachers();
    const index = list.findIndex(t => t.id === teacher.id);
    if (index >= 0) {
      list[index] = teacher;
    } else {
      list.unshift(teacher);
    }
    this.setItem('teachers', list);
  }

  async deleteTeacher(id: string): Promise<void> {
    const list = await this.getTeachers();
    this.setItem('teachers', list.filter(t => t.id !== id));
  }

  async getEmployees(): Promise<Employee[]> {
    return this.getItem('employees', INITIAL_EMPLOYEES);
  }

  async saveEmployee(employee: Employee): Promise<void> {
    const list = await this.getEmployees();
    const index = list.findIndex(e => e.id === employee.id);
    if (index >= 0) {
      list[index] = employee;
    } else {
      list.unshift(employee);
    }
    this.setItem('employees', list);
  }

  async getClasses(): Promise<ClassGrade[]> {
    return this.getItem('classes', INITIAL_CLASSES);
  }

  async saveClass(cls: ClassGrade): Promise<void> {
    const list = await this.getClasses();
    const index = list.findIndex(c => c.id === cls.id);
    if (index >= 0) {
      list[index] = cls;
    } else {
      list.push(cls);
    }
    this.setItem('classes', list);
  }

  async getSections(): Promise<Section[]> {
    return this.getItem('sections', INITIAL_SECTIONS);
  }

  async saveSection(section: Section): Promise<void> {
    const list = await this.getSections();
    const index = list.findIndex(s => s.id === section.id);
    if (index >= 0) {
      list[index] = section;
    } else {
      list.push(section);
    }
    this.setItem('sections', list);
  }

  async getSubjects(): Promise<Subject[]> {
    return this.getItem('subjects', INITIAL_SUBJECTS);
  }

  async saveSubject(subject: Subject): Promise<void> {
    const list = await this.getSubjects();
    const index = list.findIndex(s => s.id === subject.id);
    if (index >= 0) {
      list[index] = subject;
    } else {
      list.push(subject);
    }
    this.setItem('subjects', list);
  }

  async getTimetable(): Promise<TimetableSlot[]> {
    return this.getItem('timetable', INITIAL_TIMETABLE);
  }

  async saveTimetableSlot(slot: TimetableSlot): Promise<void> {
    const list = await this.getTimetable();
    const index = list.findIndex(s => s.id === slot.id);
    if (index >= 0) {
      list[index] = slot;
    } else {
      list.push(slot);
    }
    this.setItem('timetable', list);
  }

  async deleteTimetableSlot(id: string): Promise<void> {
    const list = await this.getTimetable();
    this.setItem('timetable', list.filter(s => s.id !== id));
  }

  async getAttendance(): Promise<AttendanceRecord[]> {
    return this.getItem('attendance', INITIAL_ATTENDANCE);
  }

  async recordAttendance(records: AttendanceRecord[]): Promise<void> {
    const list = await this.getAttendance();
    for (const rec of records) {
      const idx = list.findIndex(a => a.studentId === rec.studentId && a.date === rec.date);
      if (idx >= 0) {
        list[idx] = rec;
      } else {
        list.unshift(rec);
      }
    }
    this.setItem('attendance', list);
  }

  async getGrades(): Promise<GradeRecord[]> {
    return this.getItem('grades', INITIAL_GRADES);
  }

  async saveGrade(grade: GradeRecord): Promise<void> {
    const list = await this.getGrades();
    const index = list.findIndex(g => g.id === grade.id);
    if (index >= 0) {
      list[index] = grade;
    } else {
      list.unshift(grade);
    }
    this.setItem('grades', list);
  }

  async getCertificates(): Promise<Certificate[]> {
    return this.getItem('certificates', INITIAL_CERTIFICATES);
  }

  async saveCertificate(cert: Certificate): Promise<void> {
    const list = await this.getCertificates();
    const index = list.findIndex(c => c.id === cert.id);
    if (index >= 0) {
      list[index] = cert;
    } else {
      list.unshift(cert);
    }
    this.setItem('certificates', list);
  }

  async getTuitionFees(): Promise<TuitionFee[]> {
    return this.getItem('tuitionFees', INITIAL_TUITION_FEES);
  }

  async saveTuitionFee(fee: TuitionFee): Promise<void> {
    const list = await this.getTuitionFees();
    const index = list.findIndex(f => f.id === fee.id);
    if (index >= 0) {
      list[index] = fee;
    } else {
      list.unshift(fee);
    }
    this.setItem('tuitionFees', list);
  }

  async getReceipts(): Promise<PaymentReceipt[]> {
    return this.getItem('receipts', INITIAL_RECEIPTS);
  }

  async saveReceipt(receipt: PaymentReceipt): Promise<void> {
    const list = await this.getReceipts();
    list.unshift(receipt);
    this.setItem('receipts', list);
  }

  async getExpenses(): Promise<Expense[]> {
    return this.getItem('expenses', INITIAL_EXPENSES);
  }

  async saveExpense(expense: Expense): Promise<void> {
    const list = await this.getExpenses();
    const index = list.findIndex(e => e.id === expense.id);
    if (index >= 0) {
      list[index] = expense;
    } else {
      list.unshift(expense);
    }
    this.setItem('expenses', list);
  }

  async getPayroll(): Promise<PayrollRecord[]> {
    return this.getItem('payroll', INITIAL_PAYROLL);
  }

  async savePayroll(payroll: PayrollRecord): Promise<void> {
    const list = await this.getPayroll();
    const index = list.findIndex(p => p.id === payroll.id);
    if (index >= 0) {
      list[index] = payroll;
    } else {
      list.unshift(payroll);
    }
    this.setItem('payroll', list);
  }

  async getRoutes(): Promise<TransportRoute[]> {
    return this.getItem('routes', INITIAL_ROUTES);
  }

  async saveRoute(route: TransportRoute): Promise<void> {
    const list = await this.getRoutes();
    const index = list.findIndex(r => r.id === route.id);
    if (index >= 0) {
      list[index] = route;
    } else {
      list.push(route);
    }
    this.setItem('routes', list);
  }

  async getDrivers(): Promise<Driver[]> {
    return this.getItem('drivers', INITIAL_DRIVERS);
  }

  async saveDriver(driver: Driver): Promise<void> {
    const list = await this.getDrivers();
    const index = list.findIndex(d => d.id === driver.id);
    if (index >= 0) {
      list[index] = driver;
    } else {
      list.push(driver);
    }
    this.setItem('drivers', list);
  }

  async getVehicles(): Promise<Vehicle[]> {
    return this.getItem('vehicles', INITIAL_VEHICLES);
  }

  async saveVehicle(vehicle: Vehicle): Promise<void> {
    const list = await this.getVehicles();
    const index = list.findIndex(v => v.id === vehicle.id);
    if (index >= 0) {
      list[index] = vehicle;
    } else {
      list.push(vehicle);
    }
    this.setItem('vehicles', list);
  }

  async getHomework(): Promise<HomeworkAssignment[]> {
    return this.getItem('homework', []);
  }

  async saveHomework(hw: HomeworkAssignment): Promise<void> {
    const list = await this.getHomework();
    const index = list.findIndex(h => h.id === hw.id);
    if (index >= 0) list[index] = hw;
    else list.unshift(hw);
    this.setItem('homework', list);
  }

  async getAchievements(): Promise<StudentAchievement[]> {
    return this.getItem('achievements', []);
  }

  async saveAchievement(ach: StudentAchievement): Promise<void> {
    const list = await this.getAchievements();
    list.unshift(ach);
    this.setItem('achievements', list);
  }

  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return this.getItem('calendar_events', []);
  }

  async saveCalendarEvent(ev: CalendarEvent): Promise<void> {
    const list = await this.getCalendarEvents();
    list.push(ev);
    this.setItem('calendar_events', list);
  }

  async getNotifications(): Promise<NotificationItem[]> {
    return this.getItem('notifications', INITIAL_NOTIFICATIONS);
  }

  async markNotificationRead(id: string): Promise<void> {
    const list = await this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      this.setItem('notifications', list);
    }
  }

  async addNotification(notif: NotificationItem): Promise<void> {
    const list = await this.getNotifications();
    list.unshift(notif);
    this.setItem('notifications', list);
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.getItem('auditLogs', INITIAL_AUDIT_LOGS);
  }

  async addAuditLog(log: AuditLog): Promise<void> {
    const list = await this.getAuditLogs();
    list.unshift(log);
    this.setItem('auditLogs', list);
  }

  async getSmartAlerts(): Promise<SmartAlert[]> {
    return this.getItem('smartAlerts', INITIAL_SMART_ALERTS);
  }

  async resolveSmartAlert(id: string): Promise<void> {
    const list = await this.getSmartAlerts();
    this.setItem('smartAlerts', list.filter(a => a.id !== id));
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return this.getItem('announcements', INITIAL_ANNOUNCEMENTS);
  }

  async saveAnnouncement(announcement: Announcement): Promise<void> {
    const list = await this.getAnnouncements();
    list.unshift(announcement);
    this.setItem('announcements', list);
  }

  async getMessages(): Promise<MessageItem[]> {
    return this.getItem('messages', INITIAL_MESSAGES);
  }

  async sendMessage(message: MessageItem): Promise<void> {
    const list = await this.getMessages();
    list.push(message);
    this.setItem('messages', list);
  }

  async resetToInitialClean(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (k.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(k);
        }
      }
      localStorage.setItem(CLEAN_VERSION_FLAG, 'true');
    } catch {
      // ignore
    }
  }
}
