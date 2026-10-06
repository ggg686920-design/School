/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Receipt Voucher Modal — Section 20: سند القبض المالي الرسمي القابل للطباعة
 */

import React from 'react';
import { Printer, X, School as SchoolIcon } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { PaymentReceipt } from '../../types';
import { QRCode } from '../common/QRCode';

interface ReceiptVoucherModalProps {
  receipt: PaymentReceipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptVoucherModal: React.FC<ReceiptVoucherModalProps> = ({
  receipt,
  isOpen,
  onClose
}) => {
  const { settings } = useSchool();

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 no-print">
          <div className="text-xs font-bold text-slate-700">معاينة سند القبض الرسمي</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة السند</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voucher Body (Printable Area) */}
        <div className="p-8 overflow-y-auto printable-area bg-white">
          <div className="border-2 border-slate-900 rounded-xl p-6 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-4">
              <div className="space-y-0.5 text-right">
                <div className="text-sm font-bold text-[#1E3A8A] font-['Alexandria',sans-serif]">
                  {settings.name}
                </div>
                <div className="text-[11px] text-slate-500">قسم الحسابات والمالية</div>
                <div className="text-[10px] text-slate-400">هاتف: {settings.phone}</div>
              </div>

              <div className="text-center">
                <div className="text-base font-black text-slate-900 font-['Alexandria',sans-serif] px-4 py-1 border border-slate-900 rounded-lg bg-slate-50">
                  سند قبض مالي
                </div>
                <div className="text-[10px] text-slate-500 mt-1">RECEIPT VOUCHER</div>
              </div>

              <div className="text-left flex flex-col items-end">
                <QRCode data={receipt.qrCodeData} size={64} />
                <div className="text-[11px] font-mono font-bold text-slate-800 mt-1">
                  رقم: {receipt.receiptNumber}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">التاريخ: {receipt.date}</div>
              </div>
            </div>

            {/* Voucher Details Table */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-800">
              <div className="flex border-b border-slate-200 py-1.5">
                <span className="text-slate-500 w-32 shrink-0">استلمنا من الطالب/ة:</span>
                <span className="font-bold text-slate-900">{receipt.studentName} ({receipt.gradeName})</span>
              </div>

              <div className="flex border-b border-slate-200 py-1.5">
                <span className="text-slate-500 w-32 shrink-0">المبلغ رقماً:</span>
                <span className="font-mono font-black text-slate-900 text-sm">
                  {receipt.amount.toLocaleString()} {settings.currency}
                </span>
              </div>

              <div className="flex border-b border-slate-200 py-1.5">
                <span className="text-slate-500 w-32 shrink-0">وذلك عن:</span>
                <span className="font-semibold text-slate-800">{receipt.reason} (للعام الدراسي {settings.currentAcademicYear})</span>
              </div>

              <div className="flex border-b border-slate-200 py-1.5">
                <span className="text-slate-500 w-32 shrink-0">طريقة الدفع:</span>
                <span className="font-medium text-slate-800">{receipt.paymentMethod}</span>
              </div>

              <div className="flex border-b border-slate-200 py-1.5">
                <span className="text-slate-500 w-32 shrink-0">المتبقي بذمة الطالب:</span>
                <span className="font-mono font-bold text-[#DC2626]">
                  {receipt.remainingBalance.toLocaleString()} {settings.currency}
                </span>
              </div>

              {receipt.notes && (
                <div className="flex border-b border-slate-200 py-1.5">
                  <span className="text-slate-500 w-32 shrink-0">ملاحظات:</span>
                  <span className="text-slate-600">{receipt.notes}</span>
                </div>
              )}
            </div>

            {/* Signatures */}
            <div className="pt-8 mt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <div className="text-slate-400 mb-6">المستلم (المحاسب)</div>
                <div className="font-bold text-slate-800">{receipt.employeeName}</div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-dashed border-red-700/60 flex items-center justify-center text-red-700 font-bold rotate-[-10deg] text-[9px]">
                  ختم الحسابات
                </div>
              </div>

              <div>
                <div className="text-slate-400 mb-6">المدير المفوض</div>
                <div className="font-bold text-slate-800">{settings.principalName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
