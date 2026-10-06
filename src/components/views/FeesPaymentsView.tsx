/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fees & Payments View — Section 19: النظام المالي للأقساط والمدفوعات
 */

import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Filter, Receipt, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { TuitionFee, PaymentReceipt, Student } from '../../types';
import { Modal } from '../common/Modal';
import { ReceiptVoucherModal } from './ReceiptVoucherModal';

interface FeesPaymentsViewProps {
  initialOpenPayment?: boolean;
}

export const FeesPaymentsView: React.FC<FeesPaymentsViewProps> = ({ initialOpenPayment = false }) => {
  const { db, schoolService, settings, refreshData } = useSchool();
  const [fees, setFees] = useState<TuitionFee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Payment Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(initialOpenPayment);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number>(500000);
  const [paymentReason, setPaymentReason] = useState<any>('قسط دراسي');
  const [paymentMethod, setPaymentMethod] = useState<any>('نقدي');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Voucher preview modal
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(null);

  const loadData = async () => {
    const [fList, sList] = await Promise.all([db.getTuitionFees(), db.getStudents()]);
    setFees(fList);
    setStudents(sList);
    if (sList.length > 0 && !selectedStudentId) {
      setSelectedStudentId(sList[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || paymentAmount <= 0) return;

    try {
      const receipt = await schoolService.recordNewPayment(
        selectedStudentId,
        paymentAmount,
        paymentReason,
        paymentMethod,
        'المحاسب عثمان فؤاد',
        paymentNotes
      );

      setPaymentModalOpen(false);
      setActiveReceipt(receipt);
      setVoucherModalOpen(true);
      await loadData();
      await refreshData();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء تسجيل الدفعة');
    }
  };

  const filteredFees = fees.filter(f =>
    searchQuery === '' ||
    f.studentName.includes(searchQuery) ||
    f.gradeName.includes(searchQuery)
  );

  const totalExpected = fees.reduce((acc, f) => acc + f.totalFee, 0);
  const totalCollected = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalDebts = fees.reduce((acc, f) => acc + f.remainingAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            الأقساط المدرسية والتحصيل المالي
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            متابعة استحقاق الأقساط، الديون المتبقية، وسندات القبض في {settings.name}
          </p>
        </div>

        <button
          onClick={() => setPaymentModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل دفعة وإصدار سند قبض</span>
        </button>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-xs text-slate-500 block">إجمالي الأقساط المقررة للعام:</span>
          <span className="text-xl font-bold text-slate-900 font-mono mt-1 block">
            {totalExpected.toLocaleString()} {settings.currency}
          </span>
        </div>
        <div className="bg-emerald-50/70 rounded-xl border border-emerald-200 p-4 shadow-2xs">
          <span className="text-xs text-emerald-800 block">إجمالي المبالغ المحصلة (🟢):</span>
          <span className="text-xl font-bold text-[#16A34A] font-mono mt-1 block">
            {totalCollected.toLocaleString()} {settings.currency}
          </span>
        </div>
        <div className="bg-rose-50/70 rounded-xl border border-rose-200 p-4 shadow-2xs">
          <span className="text-xs text-rose-800 block">الديون والأقساط المتأخرة (🔴):</span>
          <span className="text-xl font-bold text-[#DC2626] font-mono mt-1 block">
            {totalDebts.toLocaleString()} {settings.currency}
          </span>
        </div>
      </div>

      {/* Table list */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="البحث باسم الطالب أو الصف..."
              className="w-full pr-9 pl-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#2563EB] outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">اسم الطالب</th>
                <th className="py-3 px-4">الصف</th>
                <th className="py-3 px-4">إجمالي القسط</th>
                <th className="py-3 px-4">المدفوع</th>
                <th className="py-3 px-4">المتبقي</th>
                <th className="py-3 px-4">حالة الدفع</th>
                <th className="py-3 px-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">{f.studentName}</td>
                  <td className="py-3 px-4 text-slate-600">{f.gradeName}</td>
                  <td className="py-3 px-4 font-mono font-medium">{f.totalFee.toLocaleString()} د.ع</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#16A34A]">{f.paidAmount.toLocaleString()} د.ع</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#DC2626]">{f.remainingAmount.toLocaleString()} د.ع</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      f.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      f.status === 'partial' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {f.status === 'paid' ? 'مسدد بالكامل' : f.status === 'partial' ? 'مسدد جزئياً' : 'متأخر الدفع'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedStudentId(f.studentId);
                        setPaymentModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded font-semibold text-xs transition-colors"
                    >
                      تسديد قسط
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="تسجيل دفعة مالية وإصدار سند قبض"
        subtitle={`إيداع مالي رسمي في حسابات ${settings.name}`}
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 mb-1">اختر الطالب المستفيد *</label>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.gradeName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">المبلغ المدفوع (د.ع) *</label>
              <input
                type="number"
                required
                value={paymentAmount}
                onChange={e => setPaymentAmount(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB] font-mono text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">سبب الدفع *</label>
              <select
                value={paymentReason}
                onChange={e => setPaymentReason(e.target.value as any)}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              >
                <option value="قسط دراسي">قسط دراسي</option>
                <option value="كتب وقرطاسية">كتب وقرطاسية</option>
                <option value="زي مدرسي">زي مدرسي</option>
                <option value="نقل مدرسي">نقل مدرسي</option>
                <option value="رسوم إضافية">رسوم إضافية</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1">طريقة الدفع *</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              >
                <option value="نقدي">نقدي</option>
                <option value="تحويل زين كاش">تحويل زين كاش</option>
                <option value="بطاقة كي كارد">بطاقة كي كارد</option>
                <option value="حساب مصرفي">حساب مصرفي</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1">المحاسب المسؤول</label>
              <input
                type="text"
                disabled
                value="عثمان فؤاد الدليمي"
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">ملاحظات إضافية على السند</label>
            <input
              type="text"
              value={paymentNotes}
              onChange={e => setPaymentNotes(e.target.value)}
              placeholder="مثال: تسديد دفعة الفصل الأول مع استلام الكتب"
              className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPaymentModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-xs"
            >
              اعتماد الدفع وتوليد السند المطبوع
            </button>
          </div>
        </form>
      </Modal>

      {/* Voucher Modal */}
      <ReceiptVoucherModal
        receipt={activeReceipt}
        isOpen={voucherModalOpen}
        onClose={() => setVoucherModalOpen(false)}
      />
    </div>
  );
};
