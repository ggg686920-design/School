/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Application / Business Logic Layer:
 * SchoolService
 * يقوم بحساب الإحصائيات، فحص التنبيهات، وتربيط البيانات بين الكيانات المختلفة
 */

import { IDatabaseAdapter } from '../repositories/DatabaseAdapter';
import {
  Student,
  Teacher,
  TuitionFee,
  Expense,
  AttendanceRecord,
  GradeRecord,
  SmartAlert
} from '../types';

export interface DashboardMetrics {
  totalStudents: number;
  activeStudents: number;
  maleStudents: number;
  femaleStudents: number;
  
  totalTeachers: number;
  activeTeachers: number;
  onLeaveTeachers: number;
  
  totalEmployees: number;
  
  // المالية
  totalRevenueExpected: number;
  totalRevenueCollected: number;
  totalDebtsRemaining: number;
  totalExpenses: number;
  netCashFlow: number;
  
  // الحضور اليوم
  todayDate: string;
  todayPresentCount: number;
  todayAbsentCount: number;
  todayLateCount: number;
  todayExcusedCount: number;
  todayAttendanceRate: number;
  
  // النقل
  totalRoutes: number;
  transportStudentsCount: number;
  
  // التنبيهات الذكية
  alertsCount: number;
}

export class SchoolService {
  constructor(private db: IDatabaseAdapter) {}

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const students = await this.db.getStudents();
    const teachers = await this.db.getTeachers();
    const employees = await this.db.getEmployees();
    const tuitionFees = await this.db.getTuitionFees();
    const expenses = await this.db.getExpenses();
    const attendance = await this.db.getAttendance();
    const routes = await this.db.getRoutes();
    const alerts = await this.db.getSmartAlerts();

    const maleStudents = students.filter(s => s.gender === 'male').length;
    const femaleStudents = students.filter(s => s.gender === 'female').length;
    const activeStudents = students.filter(s => s.status === 'active').length;

    const activeTeachers = teachers.filter(t => t.status === 'active').length;
    const onLeaveTeachers = teachers.filter(t => t.status === 'on_leave').length;

    // المالية
    let totalRevenueExpected = 0;
    let totalRevenueCollected = 0;
    let totalDebtsRemaining = 0;

    for (const f of tuitionFees) {
      totalRevenueExpected += f.totalFee;
      totalRevenueCollected += f.paidAmount;
      totalDebtsRemaining += f.remainingAmount;
    }

    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const netCashFlow = totalRevenueCollected - totalExpenses;

    // الحضور لليوم الأحدث
    const today = '2026-10-06';
    const todayRecords = attendance.filter(a => a.date === today);
    
    let todayPresentCount = 0;
    let todayAbsentCount = 0;
    let todayLateCount = 0;
    let todayExcusedCount = 0;

    for (const r of todayRecords) {
      if (r.status === 'present') todayPresentCount++;
      else if (r.status === 'absent') todayAbsentCount++;
      else if (r.status === 'late') todayLateCount++;
      else if (r.status === 'excused') todayExcusedCount++;
    }

    const totalTracked = todayRecords.length;
    const todayAttendanceRate = totalTracked > 0 
      ? Math.round(((todayPresentCount + todayLateCount) / totalTracked) * 100) 
      : 95;

    const transportStudentsCount = students.filter(s => !!s.transportRouteId).length;

    return {
      totalStudents: students.length,
      activeStudents,
      maleStudents,
      femaleStudents,
      totalTeachers: teachers.length,
      activeTeachers,
      onLeaveTeachers,
      totalEmployees: employees.length,
      totalRevenueExpected,
      totalRevenueCollected,
      totalDebtsRemaining,
      totalExpenses,
      netCashFlow,
      todayDate: today,
      todayPresentCount,
      todayAbsentCount,
      todayLateCount,
      todayExcusedCount,
      todayAttendanceRate,
      totalRoutes: routes.length,
      transportStudentsCount,
      alertsCount: alerts.length
    };
  }

  async getStudentFullProfile(studentId: string) {
    const students = await this.db.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const parents = await this.db.getParents();
    const parent = parents.find(p => p.id === student.parentId);

    const tuitionFees = await this.db.getTuitionFees();
    const fee = tuitionFees.find(f => f.studentId === studentId);

    const receipts = await this.db.getReceipts();
    const studentReceipts = receipts.filter(r => r.studentId === studentId);

    const attendance = await this.db.getAttendance();
    const studentAttendance = attendance.filter(a => a.studentId === studentId);

    const grades = await this.db.getGrades();
    const studentGrades = grades.filter(g => g.studentId === studentId);

    const routes = await this.db.getRoutes();
    const route = routes.find(r => r.id === student.transportRouteId);

    const certs = await this.db.getCertificates();
    const certificate = certs.find(c => c.studentId === studentId);

    return {
      student,
      parent,
      fee,
      receipts: studentReceipts,
      attendance: studentAttendance,
      grades: studentGrades,
      route,
      certificate
    };
  }

  async recordNewPayment(
    studentId: string,
    amount: number,
    reason: any,
    paymentMethod: any,
    employeeName: string,
    notes?: string
  ) {
    const students = await this.db.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) throw new Error('الطالب غير موجود');

    const tuitionFees = await this.db.getTuitionFees();
    const fee = tuitionFees.find(f => f.studentId === studentId);

    let remainingBalance = 0;
    if (fee) {
      fee.paidAmount += amount;
      fee.remainingAmount = Math.max(0, fee.totalFee - fee.paidAmount);
      if (fee.remainingAmount === 0) {
        fee.status = 'paid';
      } else {
        fee.status = 'partial';
      }
      remainingBalance = fee.remainingAmount;
      await this.db.saveTuitionFee(fee);
    }

    const receiptNum = `RCPT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt = {
      id: `rec-${Date.now()}`,
      receiptNumber: receiptNum,
      studentId: student.id,
      studentName: student.fullName,
      gradeName: student.gradeName,
      amount,
      reason,
      date: new Date().toISOString().split('T')[0],
      employeeName,
      paymentMethod,
      remainingBalance,
      qrCodeData: `RCPT:${receiptNum}|STD:${student.studentNumber}|AMT:${amount}|BAL:${remainingBalance}`,
      notes
    };

    await this.db.saveReceipt(newReceipt);

    // إضافة في سجل العمليات
    await this.db.addAuditLog({
      id: `aud-${Date.now()}`,
      userName: employeeName,
      userRole: 'Accountant',
      action: 'إصدار سند قبض',
      department: 'المالية والحسابات',
      affectedData: `سند قبض رقم ${receiptNum} للطالب ${student.fullName} بمبلغ ${amount.toLocaleString()} د.ع`,
      timestamp: new Date().toLocaleString('ar-IQ')
    });

    return newReceipt;
  }
}
