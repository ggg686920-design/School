/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Receipts View — Section 20: سجل سندات القبض المالي
 */

import React, { useState, useEffect } from 'react';
import { Receipt, Printer, Search, Eye } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { PaymentReceipt } from '../../types';
import { ReceiptVoucherModal } from './ReceiptVoucherModal';

export const ReceiptsView: React.FC = () => {
  const { db, settings } = useSchool();
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    db.getReceipts().then(setReceipts);
  }, [db]);

  const filtered = receipts.filter(r =>
    searchQuery === '' ||
    r.receiptNumber.includes(searchQuery) ||
    r.studentName.includes(searchQuery) ||
    r.employeeName.includes(searchQuery)
  );

  const openVoucher = (r: PaymentReceipt) => {
    setSelectedReceipt(r);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            سجل سندات القبض المالية
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            سندات القبض المعتمدة والمزودة بالباركود والختم الرسمي في {settings.name}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="البحث برقم السند أو اسم الطالب..."
            className="w-full pr-9 pl-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#2563EB] outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">رقم السند</th>
                <th className="py-3 px-4">اسم الطالب</th>
                <th className="py-3 px-4">الصف</th>
                <th className="py-3 px-4">المبلغ المستلم</th>
                <th className="py-3 px-4">السبب</th>
                <th className="py-3 px-4">طريقة الدفع</th>
                <th className="py-3 px-4">تاريخ السند</th>
                <th className="py-3 px-4">المحاسب</th>
                <th className="py-3 px-4 text-center">معاينة وطباعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-[#1E3A8A]">{r.receiptNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.studentName}</td>
                  <td className="py-3 px-4 text-slate-600">{r.gradeName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#16A34A]">{r.amount.toLocaleString()} د.ع</td>
                  <td className="py-3 px-4 text-slate-700">{r.reason}</td>
                  <td className="py-3 px-4 text-slate-600">{r.paymentMethod}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{r.date}</td>
                  <td className="py-3 px-4 text-slate-600">{r.employeeName}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openVoucher(r)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>السند</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptVoucherModal
        receipt={selectedReceipt}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
