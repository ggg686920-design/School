/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Payroll View — Section 22: كشف الرواتب والأجور الشهرية
 */

import React, { useState, useEffect } from 'react';
import { Briefcase, Printer, CheckCircle, Clock } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { PayrollRecord } from '../../types';

export const PayrollView: React.FC = () => {
  const { db, settings } = useSchool();
  const [payroll, setPayroll] = useState<PayrollRecord[]>([]);

  useEffect(() => {
    db.getPayroll().then(setPayroll);
  }, [db]);

  const totalNet = payroll.reduce((acc, p) => acc + p.netSalary, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            جدول الرواتب والأجور الشهرية (Payroll)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            كشف استحقاقات الكادر التعليمي والإداري لشهر أيلول/سبتمبر 2026 في {settings.name}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>طباعة كشف الرواتب المعتمد</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs printable-area">
        <div className="text-center pb-4 border-b border-slate-200 mb-4">
          <h2 className="text-base font-bold text-slate-900 font-['Alexandria',sans-serif]">
            {settings.name} — كشف الرواتب والأجور المعتمد
          </h2>
          <p className="text-xs text-slate-500">
            عن شهر 2026-09 · إجمالي صافي الرواتب: <span className="font-bold text-[#16A34A] font-mono">{totalNet.toLocaleString()} {settings.currency}</span>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-2.5 px-3">الاسم والصفة</th>
                <th className="py-2.5 px-3">الراتب الاساسي</th>
                <th className="py-2.5 px-3">بدل النقل</th>
                <th className="py-2.5 px-3">البدلات والمكافآت</th>
                <th className="py-2.5 px-3">الخصومات والسلف</th>
                <th className="py-2.5 px-3">صافي الراتب</th>
                <th className="py-2.5 px-3">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payroll.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{p.staffName}</div>
                    <div className="text-[11px] text-slate-400">{p.role}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{p.basicSalary.toLocaleString()} د.ع</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{p.transportAllowance.toLocaleString()} د.ع</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600">+{(p.otherAllowances + p.bonuses).toLocaleString()} د.ع</td>
                  <td className="py-2.5 px-3 font-mono text-rose-600">-{(p.deductions + p.advances).toLocaleString()} د.ع</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#16A34A] text-sm">
                    {p.netSalary.toLocaleString()} د.ع
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      <span>{p.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-200 grid grid-cols-2 text-center text-xs text-slate-500">
          <div>المحاسب المالي: عثمان فؤاد الدليمي</div>
          <div>مدير المدرسة: {settings.principalName}</div>
        </div>
      </div>
    </div>
  );
};
