/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * طبقة منطق الأعمال والخدمات الإدارية:
 * SchoolService
 * تطبق ضوابط الوصول الصارمة (RBAC) لحماية البيانات المالية ومنع المدير من الوصول للمجاميع
 */

import { IDatabaseAdapter } from '../repositories/DatabaseAdapter';
import {
  Student,
  Teacher,
  TuitionFee,
  Expense,
  AttendanceRecord,
  GradeRecord,
  SmartAlert,
  UserRole,
  PaymentReceipt
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
  
  // المؤشرات المالية الإجمالية — محجوبة تماماً على مستوى منطق الخدمة عن مدير المدرسة
  canViewFinancialTotals: boolean;
  totalRevenueExpected?: number;
  totalRevenueCollected?: number;
  totalDebtsRemaining?: number;
  totalExpenses?: number;
  netCashFlow?: number;
  totalPayroll?: number;
  
  // الحضور والغياب اليومي
  todayDate: string;
  todayPresentCount: number;
  todayAbsentCount: number;
  todayLateCount: number;
  todayExcusedCount: number;
  todayAttendanceRate: number;
  
  // النقل والمركبات
  totalRoutes: number;
  transportStudentsCount: number;
  
  // تنبيهات النظام البرمجية (Rules-based)
  alertsCount: number;
}

export class SchoolService {
  constructor(private db: IDatabaseAdapter) {}

  /**
   * فحص الصلاحية المالية: المالك والمحاسب فقط يحق لهما رؤية المجاميع المالية
   */
  private canAccessFinancialAggregates(role: UserRole): boolean {
    const r = (role || '').toUpperCase();
    return r === 'SCHOOL_OWNER' || r === 'OWNER' || r === 'ADMIN' || r === 'ACCOUNTANT';
  }

  async getDashboardMetrics(userRole: UserRole = 'SCHOOL_OWNER'): Promise<DashboardMetrics> {
    const students = await this.db.getStudents();
    const teachers = await this.db.getTeachers();
    const employees = await this.db.getEmployees();
    const attendance = await this.db.getAttendance();
    const routes = await this.db.getRoutes();
    const alerts = await this.getSystemRuleAlerts();

    const maleStudents = students.filter(s => s.gender === 'male').length;
    const femaleStudents = students.filter(s => s.gender === 'female').length;

    const activeTeachers = teachers.filter(t => t.status === 'active').length;
    const onLeaveTeachers = teachers.filter(t => t.status === 'on_leave').length;

    // الحضور لليوم الحالي
    const today = new Date().toISOString().split('T')[0];
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

    const totalMarkedToday = todayPresentCount + todayAbsentCount + todayLateCount + todayExcusedCount;
    const todayAttendanceRate = totalMarkedToday > 0 
      ? Math.round(((todayPresentCount + todayLateCount) / totalMarkedToday) * 100) 
      : 100;

    const transportStudentsCount = routes.reduce((acc, r) => acc + (r.studentsCount || 0), 0);

    const baseMetrics: DashboardMetrics = {
      totalStudents: students.length,
      activeStudents: students.filter(s => s.status === 'active').length,
      maleStudents,
      femaleStudents,
      totalTeachers: teachers.length,
      activeTeachers,
      onLeaveTeachers,
      totalEmployees: employees.length,
      canViewFinancialTotals: false,
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

    // حماية أمنية صارمة: لا يتم استعلام أو حساب أو إرجاع المجاميع المالية لمدير المدرسة إطلاقاً
    if (this.canAccessFinancialAggregates(userRole)) {
      const tuitionFees = await this.db.getTuitionFees();
      const expenses = await this.db.getExpenses();
      const payroll = await this.db.getPayroll();

      let totalRevenueExpected = 0;
      let totalRevenueCollected = 0;
      let totalDebtsRemaining = 0;

      for (const f of tuitionFees) {
        totalRevenueExpected += f.totalFee || 0;
        totalRevenueCollected += f.paidAmount || 0;
        totalDebtsRemaining += f.remainingAmount || 0;
      }

      const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
      const totalPayroll = payroll.reduce((acc, p) => acc + (p.netSalary || 0), 0);
      const netCashFlow = totalRevenueCollected - totalExpenses;

      baseMetrics.canViewFinancialTotals = true;
      baseMetrics.totalRevenueExpected = totalRevenueExpected;
      baseMetrics.totalRevenueCollected = totalRevenueCollected;
      baseMetrics.totalDebtsRemaining = totalDebtsRemaining;
      baseMetrics.totalExpenses = totalExpenses;
      baseMetrics.totalPayroll = totalPayroll;
      baseMetrics.netCashFlow = netCashFlow;
    }

    return baseMetrics;
  }

  /**
   * تنبيهات النظام البرمجية (Rule-Based Alerts Engine — خوارزميات برمجية بحتة بدون أي ذكاء اصطناعي)
   */
  async getSystemRuleAlerts(): Promise<SmartAlert[]> {
    const alerts: SmartAlert[] = [];
    const students = await this.db.getStudents();
    const fees = await this.db.getTuitionFees();
    const sections = await this.db.getSections();
    const routes = await this.db.getRoutes();
    const payroll = await this.db.getPayroll();

    // 1. قاعدة التحقق من تجاوز سعة الشعبة
    for (const sec of sections) {
      if (sec.studentsCount > 35) {
        alerts.push({
          id: `sec-cap-${sec.id}`,
          type: 'attendance_drop',
          severity: 'warning',
          title: `تجاوز الكثافة الطلابية في شعبة (${sec.name})`,
          description: `الشعبة تحتوي على ${sec.studentsCount} طالباً في ${sec.gradeName} وهو ما يتجاوز المعيار التربوي (35 طالباً).`,
          date: new Date().toISOString().split('T')[0],
          targetSection: sec.name
        });
      }
    }

    // 2. قاعدة الطلاب أصحاب الأقساط المتأخرة
    const overdueFees = fees.filter(f => f.status === 'overdue' || (f.remainingAmount > 0 && f.dueDate && new Date(f.dueDate) < new Date()));
    if (overdueFees.length > 0) {
      alerts.push({
        id: 'fees-overdue-alert',
        type: 'overdue_fee',
        severity: 'error',
        title: `مستحقات وأقساط متأخرة الدفع (${overdueFees.length} قسط)`,
        description: `يوجد ${overdueFees.length} من الطلبة تجاوزت أقساطهم تاريخ الاستحقاق المحدد.`,
        date: new Date().toISOString().split('T')[0]
      });
    }

    // 3. قاعدة رواتب الكادر غير المدفوعة
    const pendingPayroll = payroll.filter(p => p.status === 'معلق');
    if (pendingPayroll.length > 0) {
      alerts.push({
        id: 'payroll-pending-alert',
        type: 'high_expenses',
        severity: 'warning',
        title: `رواتب وأجور معلقة (${pendingPayroll.length} كادر)`,
        description: `هناك استحقاقات رواتب للشهر الحالي في انتظار الصرف والاعتماد المالي.`,
        date: new Date().toISOString().split('T')[0]
      });
    }

    // 4. قاعدة حمولة مركبات النقل
    for (const r of routes) {
      if (r.capacity && r.studentsCount > r.capacity) {
        alerts.push({
          id: `route-cap-${r.id}`,
          type: 'license_expiring',
          severity: 'warning',
          title: `تجاوز سعة الركاب في خط (${r.name})`,
          description: `المركبة المخصصة للخط تحمل ${r.studentsCount} طالباً بينما السعة الاستيعابية ${r.capacity} مقعداً.`,
          date: new Date().toISOString().split('T')[0]
        });
      }
    }

    return alerts;
  }

  /**
   * استخراج الملف الشامل للطالب مع كافة السجلات المالية والأكاديمية والصحية
   */
  async getStudentFullProfile(studentId: string) {
    const students = await this.db.getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const [parents, fees, receipts, grades, attendance, routes] = await Promise.all([
      this.db.getParents(),
      this.db.getTuitionFees(),
      this.db.getReceipts(),
      this.db.getGrades(),
      this.db.getAttendance(),
      this.db.getRoutes()
    ]);

    const parent = parents.find(p => p.id === student.parentId || p.fullName === student.parentName);
    const fee = fees.find(f => f.studentId === student.id || f.studentName === student.fullName);
    const studentReceipts = receipts.filter(r => r.studentId === student.id || r.studentName === student.fullName);
    const studentGrades = grades.filter(g => g.studentId === student.id || g.studentName === student.fullName);
    const studentAttendance = attendance.filter(a => a.studentId === student.id || a.studentName === student.fullName);
    const route = routes.find(r => r.id === student.transportRouteId);

    return {
      student,
      parent,
      fee,
      receipts: studentReceipts,
      grades: studentGrades,
      attendance: studentAttendance,
      route
    };
  }

  /**
   * تسجيل دفعة مالية جديدة وإصدار سند قبض وتحديث سجل القسط الدراسي
   */
  async recordNewPayment(
    studentId: string,
    amount: number,
    reason: any,
    paymentMethod: any,
    employeeName: string,
    notes?: string
  ): Promise<PaymentReceipt> {
    const students = await this.db.getStudents();
    const student = students.find(s => s.id === studentId);
    const fees = await this.db.getTuitionFees();
    const feeIndex = fees.findIndex(f => f.studentId === studentId || (student && f.studentName === student.fullName));

    let remainingBalance = 0;
    if (feeIndex !== -1) {
      const fee = fees[feeIndex];
      const newPaid = (fee.paidAmount || 0) + amount;
      const newRemaining = Math.max(0, (fee.totalFee || 0) - newPaid);
      remainingBalance = newRemaining;

      const updatedFee: TuitionFee = {
        ...fee,
        paidAmount: newPaid,
        remainingAmount: newRemaining,
        status: newRemaining <= 0 ? 'paid' : 'partial'
      };
      await this.db.saveTuitionFee(updatedFee);
    }

    const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt: PaymentReceipt = {
      id: `rcp-${Date.now()}`,
      receiptNumber,
      studentId,
      studentName: student?.fullName || 'الطالب',
      gradeName: student?.gradeName || 'الصف الدراسي',
      amount,
      reason,
      date: new Date().toISOString().split('T')[0],
      employeeName: employeeName || 'المحاسب المالي',
      receivedByName: employeeName || 'المحاسب المالي',
      paymentMethod,
      remainingBalance,
      qrCodeData: `RECEIPT:${receiptNumber}|AMOUNT:${amount}|STUDENT:${student?.fullName || ''}`,
      notes
    };

    await this.db.saveReceipt(newReceipt);
    return newReceipt;
  }
}
