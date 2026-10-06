/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Receipt Voucher Modal:
 * سند القبض المالي الرسمي المتوافق مع معايير وزارة التربية والطباعة المكتبية A4
 */

import React from 'react';
import { Printer, X, School as SchoolIcon, CheckCircle2 } from 'lucide-react';
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

  const receiptTime = new Date().toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print" dir="rtl">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 no-print">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>معاينة سند القبض المالي المعتمد</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>🖨️ طباعة السند (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voucher Body (Printable Area) */}
        <div className="p-6 sm:p-8 overflow-y-auto printable-area bg-white">
          <div className="border-2 border-slate-900 rounded-2xl p-6 sm:p-8 relative bg-white">
            {/* Header: School Info & Receipt Meta */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-5 gap-4">
              <div className="space-y-1 text-right">
                <div className="text-base sm:text-lg font-bold text-[#1E3A8A] font-['Alexandria',sans-serif]">
                  {settings.name}
                </div>
                <div className="text-xs font-semibold text-slate-700">قسم الحسابات والإدارة المالية</div>
                <div className="text-[11px] text-slate-500">العنوان: {settings.address} - {settings.province}</div>
                <div className="text-[11px] text-slate-500">هاتف: {settings.phone}</div>
                {settings.email && (
                  <div className="text-[11px] text-slate-500 font-mono" dir="ltr">{settings.email}</div>
                )}
              </div>

              <div className="text-center shrink-0">
                <div className="text-base sm:text-lg font-black text-slate-950 font-['Alexandria',sans-serif] px-4 py-1.5 border-2 border-slate-900 rounded-xl bg-slate-50 tracking-wide">
                  سند قبض مالي
                </div>
                <div className="text-[10px] text-slate-500 font-bold mt-1 tracking-wider uppercase">
                  Official Receipt Voucher
                </div>
                <div className="text-[11px] text-blue-900 font-bold mt-1">
                  العام الدراسي: {settings.currentAcademicYear}
                </div>
              </div>

              <div className="text-left flex flex-col items-end shrink-0">
                <QRCode data={receipt.qrCodeData || receipt.receiptNumber} size={64} />
                <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                  رقم السند: {receipt.receiptNumber}
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  التاريخ: {receipt.date}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  الوقت: {receiptTime}
                </div>
              </div>
            </div>

            {/* Voucher Details Table */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-900">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                <div className="flex">
                  <span className="text-slate-500 w-28 shrink-0 font-medium">اسم الطالب:</span>
                  <span className="font-bold text-slate-950 text-sm">{receipt.studentName}</span>
                </div>
                <div className="flex">
                  <span className="text-slate-500 w-28 shrink-0 font-medium">الصف والشعبة:</span>
                  <span className="font-bold text-slate-950">{receipt.gradeName}</span>
                </div>
              </div>

              <div className="flex border-b border-slate-200 py-2">
                <span className="text-slate-600 w-36 shrink-0 font-semibold">المبلغ المقبوض:</span>
                <span className="font-mono font-black text-slate-950 text-base text-emerald-700">
                  {(receipt.amount || 0).toLocaleString()} {settings.currency}
                </span>
              </div>

              <div className="flex border-b border-slate-200 py-2">
                <span className="text-slate-600 w-36 shrink-0 font-semibold">تفاصيل الرسوم / عن:</span>
                <span className="font-bold text-slate-800">{receipt.reason || 'قسط دراسي'}</span>
              </div>

              <div className="flex border-b border-slate-200 py-2">
                <span className="text-slate-600 w-36 shrink-0 font-semibold">طريقة التحصيل:</span>
                <span className="font-medium text-slate-800">{receipt.paymentMethod || 'نقداً'}</span>
              </div>

              <div className="flex border-b border-slate-200 py-2 bg-rose-50/40 px-2 rounded-lg">
                <span className="text-slate-600 w-36 shrink-0 font-semibold">المتبقي بذمة الطالب:</span>
                <span className="font-mono font-black text-[#DC2626] text-sm">
                  {(receipt.remainingBalance || 0).toLocaleString()} {settings.currency}
                </span>
              </div>

              {receipt.notes && (
                <div className="flex border-b border-slate-200 py-2">
                  <span className="text-slate-600 w-36 shrink-0 font-semibold">ملاحظات المحاسب:</span>
                  <span className="text-slate-700">{receipt.notes}</span>
                </div>
              )}
            </div>

            {/* Official Signatures & School Stamp */}
            <div className="pt-8 mt-6 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <div className="text-slate-500 font-semibold mb-6">المحاسب المالي (المستلم)</div>
                <div className="font-bold text-slate-900 text-sm border-b border-dashed border-slate-400 pb-1">
                  {receipt.receivedByName || receipt.employeeName || 'أمانة الصندوق'}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-red-700 flex flex-col items-center justify-center text-red-700 font-bold rotate-[-12deg] text-[9px] p-1">
                  <span>ختم الحسابات</span>
                  <span className="text-[8px] font-mono mt-0.5">{receipt.receiptNumber}</span>
                  <span className="text-[7px]">معتمد رسمياً</span>
                </div>
              </div>

              <div>
                <div className="text-slate-500 font-semibold mb-6">المدير المفوض / الإدارة</div>
                <div className="font-bold text-slate-900 text-sm border-b border-dashed border-slate-400 pb-1">
                  {settings.principalName}
                </div>
              </div>
            </div>

            {/* Print Footer note */}
            <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <span>نظام إدارة المدارس العراقي المتكامل</span>
              <span>وثيقة رسمية صادرة إلكترونياً</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
