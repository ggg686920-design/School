/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Data Layer Architecture:
 * Database Adapter Interface & Implementations
 * يدعم التبديل السلس بين Local Storage Provider و Firebase Firestore مستقبلاً
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

import {
  INITIAL_SCHOOL_SETTINGS,
  INITIAL_CLASSES,
  INITIAL_SECTIONS,
  INITIAL_PARENTS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  INITIAL_GRADES,
  INITIAL_CERTIFICATES,
  INITIAL_TUITION_FEES,
  INITIAL_RECEIPTS,
  INITIAL_EXPENSES,
  INITIAL_PAYROLL,
  INITIAL_EMPLOYEES,
  INITIAL_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_ROUTES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS,
  INITIAL_SMART_ALERTS
} from './seedData';

export interface IDatabaseAdapter {
  getSettings(): Promise<SchoolSettings>;
  saveSettings(settings: SchoolSettings): Promise<void>;

  getStudents(): Promise<Student[]>;
  saveStudent(student: Student): Promise<void>;
  deleteStudent(id: string): Promise<void>;

  getParents(): Promise<Parent[]>;
  saveParent(parent: Parent): Promise<void>;

  getTeachers(): Promise<Teacher[]>;
  saveTeacher(teacher: Teacher): Promise<void>;
  deleteTeacher(id: string): Promise<void>;

  getEmployees(): Promise<Employee[]>;
  saveEmployee(employee: Employee): Promise<void>;

  getClasses(): Promise<ClassGrade[]>;
  saveClass(cls: ClassGrade): Promise<void>;

  getSections(): Promise<Section[]>;
  saveSection(section: Section): Promise<void>;

  getSubjects(): Promise<Subject[]>;
  saveSubject(subject: Subject): Promise<void>;

  getTimetable(): Promise<TimetableSlot[]>;
  saveTimetableSlot(slot: TimetableSlot): Promise<void>;
  deleteTimetableSlot(id: string): Promise<void>;

  getAttendance(): Promise<AttendanceRecord[]>;
  recordAttendance(records: AttendanceRecord[]): Promise<void>;

  getGrades(): Promise<GradeRecord[]>;
  saveGrade(grade: GradeRecord): Promise<void>;

  getCertificates(): Promise<Certificate[]>;
  saveCertificate(cert: Certificate): Promise<void>;

  getTuitionFees(): Promise<TuitionFee[]>;
  saveTuitionFee(fee: TuitionFee): Promise<void>;

  getReceipts(): Promise<PaymentReceipt[]>;
  saveReceipt(receipt: PaymentReceipt): Promise<void>;

  getExpenses(): Promise<Expense[]>;
  saveExpense(expense: Expense): Promise<void>;

  getPayroll(): Promise<PayrollRecord[]>;
  savePayroll(payroll: PayrollRecord): Promise<void>;

  getRoutes(): Promise<TransportRoute[]>;
  saveRoute(route: TransportRoute): Promise<void>;

  getDrivers(): Promise<Driver[]>;
  saveDriver(driver: Driver): Promise<void>;

  getVehicles(): Promise<Vehicle[]>;
  saveVehicle(vehicle: Vehicle): Promise<void>;

  getAnnouncements(): Promise<Announcement[]>;
  saveAnnouncement(announcement: Announcement): Promise<void>;
  deleteAnnouncement(id: string): Promise<void>;

  getNotifications(): Promise<NotificationItem[]>;
  markNotificationRead(id: string): Promise<void>;
  addNotification(notif: NotificationItem): Promise<void>;

  getMessages(): Promise<MessageItem[]>;
  sendMessage(message: MessageItem): Promise<void>;

  getAuditLogs(): Promise<AuditLog[]>;
  addAuditLog(log: AuditLog): Promise<void>;

  getSmartAlerts(): Promise<SmartAlert[]>;
  resolveSmartAlert(id: string): Promise<void>;

  resetToInitialDemo(): Promise<void>;
}

const STORAGE_PREFIX = 'noor_alkamal_school_db_';

export class LocalStorageDatabaseAdapter implements IDatabaseAdapter {
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
    return this.getItem('settings', INITIAL_SCHOOL_SETTINGS);
  }

  async saveSettings(settings: SchoolSettings): Promise<void> {
    this.setItem('settings', settings);
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

  async getAnnouncements(): Promise<Announcement[]> {
    return this.getItem('announcements', INITIAL_ANNOUNCEMENTS);
  }

  async saveAnnouncement(announcement: Announcement): Promise<void> {
    const list = await this.getAnnouncements();
    const index = list.findIndex(a => a.id === announcement.id);
    if (index >= 0) {
      list[index] = announcement;
    } else {
      list.unshift(announcement);
    }
    this.setItem('announcements', list);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const list = await this.getAnnouncements();
    this.setItem('announcements', list.filter(a => a.id !== id));
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

  async getMessages(): Promise<MessageItem[]> {
    return this.getItem('messages', INITIAL_MESSAGES);
  }

  async sendMessage(message: MessageItem): Promise<void> {
    const list = await this.getMessages();
    list.push(message);
    this.setItem('messages', list);
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

  async resetToInitialDemo(): Promise<void> {
    try {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (k.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(k);
        }
      }
    } catch {
      // ignore
    }
  }
}

/**
 * Firebase Firestore Adapter Stub (Ready to plug in real Firebase Firestore without altering Services or UI)
 */
export class FirebaseDatabaseAdapter implements IDatabaseAdapter {
  private fallback = new LocalStorageDatabaseAdapter();

  // In production, initialize Firebase Auth & Firestore here
  async getSettings() { return this.fallback.getSettings(); }
  async saveSettings(settings: SchoolSettings) { return this.fallback.saveSettings(settings); }
  async getStudents() { return this.fallback.getStudents(); }
  async saveStudent(student: Student) { return this.fallback.saveStudent(student); }
  async deleteStudent(id: string) { return this.fallback.deleteStudent(id); }
  async getParents() { return this.fallback.getParents(); }
  async saveParent(parent: Parent) { return this.fallback.saveParent(parent); }
  async getTeachers() { return this.fallback.getTeachers(); }
  async saveTeacher(teacher: Teacher) { return this.fallback.saveTeacher(teacher); }
  async deleteTeacher(id: string) { return this.fallback.deleteTeacher(id); }
  async getEmployees() { return this.fallback.getEmployees(); }
  async saveEmployee(employee: Employee) { return this.fallback.saveEmployee(employee); }
  async getClasses() { return this.fallback.getClasses(); }
  async saveClass(cls: ClassGrade) { return this.fallback.saveClass(cls); }
  async getSections() { return this.fallback.getSections(); }
  async saveSection(section: Section) { return this.fallback.saveSection(section); }
  async getSubjects() { return this.fallback.getSubjects(); }
  async saveSubject(subject: Subject) { return this.fallback.saveSubject(subject); }
  async getTimetable() { return this.fallback.getTimetable(); }
  async saveTimetableSlot(slot: TimetableSlot) { return this.fallback.saveTimetableSlot(slot); }
  async deleteTimetableSlot(id: string) { return this.fallback.deleteTimetableSlot(id); }
  async getAttendance() { return this.fallback.getAttendance(); }
  async recordAttendance(records: AttendanceRecord[]) { return this.fallback.recordAttendance(records); }
  async getGrades() { return this.fallback.getGrades(); }
  async saveGrade(grade: GradeRecord) { return this.fallback.saveGrade(grade); }
  async getCertificates() { return this.fallback.getCertificates(); }
  async saveCertificate(cert: Certificate) { return this.fallback.saveCertificate(cert); }
  async getTuitionFees() { return this.fallback.getTuitionFees(); }
  async saveTuitionFee(fee: TuitionFee) { return this.fallback.saveTuitionFee(fee); }
  async getReceipts() { return this.fallback.getReceipts(); }
  async saveReceipt(receipt: PaymentReceipt) { return this.fallback.saveReceipt(receipt); }
  async getExpenses() { return this.fallback.getExpenses(); }
  async saveExpense(expense: Expense) { return this.fallback.saveExpense(expense); }
  async getPayroll() { return this.fallback.getPayroll(); }
  async savePayroll(payroll: PayrollRecord) { return this.fallback.savePayroll(payroll); }
  async getRoutes() { return this.fallback.getRoutes(); }
  async saveRoute(route: TransportRoute) { return this.fallback.saveRoute(route); }
  async getDrivers() { return this.fallback.getDrivers(); }
  async saveDriver(driver: Driver) { return this.fallback.saveDriver(driver); }
  async getVehicles() { return this.fallback.getVehicles(); }
  async saveVehicle(vehicle: Vehicle) { return this.fallback.saveVehicle(vehicle); }
  async getAnnouncements() { return this.fallback.getAnnouncements(); }
  async saveAnnouncement(announcement: Announcement) { return this.fallback.saveAnnouncement(announcement); }
  async deleteAnnouncement(id: string) { return this.fallback.deleteAnnouncement(id); }
  async getNotifications() { return this.fallback.getNotifications(); }
  async markNotificationRead(id: string) { return this.fallback.markNotificationRead(id); }
  async addNotification(notif: NotificationItem) { return this.fallback.addNotification(notif); }
  async getMessages() { return this.fallback.getMessages(); }
  async sendMessage(message: MessageItem) { return this.fallback.sendMessage(message); }
  async getAuditLogs() { return this.fallback.getAuditLogs(); }
  async addAuditLog(log: AuditLog) { return this.fallback.addAuditLog(log); }
  async getSmartAlerts() { return this.fallback.getSmartAlerts(); }
  async resolveSmartAlert(id: string) { return this.fallback.resolveSmartAlert(id); }
  async resetToInitialDemo() { return this.fallback.resetToInitialDemo(); }
}
