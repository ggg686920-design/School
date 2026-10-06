/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Expenses View — Section 21: إدارة المصروفات التشغيلية للمدرسة
 */

import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Search, Filter, TrendingDown } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Expense } from '../../types';
import { Modal } from '../common/Modal';

export const ExpensesView: React.FC = () => {
  const { db, settings, refreshData } = useSchool();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<Expense>>({
    category: 'الكهرباء والمولدات',
    amount: 150000,
    beneficiary: '',
    paymentMethod: 'نقدي',
    description: '',
    employeeName: 'عثمان فؤاد (المحاسب)',
    invoiceNumber: ''
  });

  const loadExpenses = async () => {
    const list = await db.getExpenses();
    setExpenses(list);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.beneficiary || !formData.amount) return;

    const expNum = `EXP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      expenseNumber: expNum,
      category: formData.category as any || 'أخرى',
      amount: Number(formData.amount),
      date: new Date().toISOString().split('T')[0],
      beneficiary: formData.beneficiary || '',
      paymentMethod: formData.paymentMethod as any || 'نقدي',
      description: formData.description || '',
      employeeName: formData.employeeName || 'المحاسب',
      invoiceNumber: formData.invoiceNumber || ''
    };

    await db.saveExpense(newExp);
    await db.addAuditLog({
      id: `aud-${Date.now()}`,
      userName: 'المحاسب',
      userRole: 'Accountant',
      action: 'تسجيل مصروف تشغيلي',
      department: 'المالية',
      affectedData: `سند صرف ${expNum} بقيمة ${newExp.amount.toLocaleString()} د.ع (${newExp.category})`,
      timestamp: new Date().toLocaleString('ar-IQ')
    });

    setAddModalOpen(false);
    await loadExpenses();
    await refreshData();
  };

  const totalAmount = expenses.reduce((acc, e) => acc + e.amount, 0);

  const filtered = expenses.filter(e =>
    searchQuery === '' ||
    e.category.includes(searchQuery) ||
    e.beneficiary.includes(searchQuery) ||
    e.description.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            إدارة المصروفات التشغيلية
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            سجل النفقات والالتزامات التشغيلية في {settings.name} — إجمالي النفقات: {totalAmount.toLocaleString()} {settings.currency}
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة سند صرف / مصروف جديد</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="بحث بالتصنيف، الجهة المستفيدة، أو البيان..."
            className="w-full pr-9 pl-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#2563EB] outline-hidden"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">رقم الصرف</th>
                <th className="py-3 px-4">التصنيف</th>
                <th className="py-3 px-4">المبلغ</th>
                <th className="py-3 px-4">الجهة المستفيدة</th>
                <th className="py-3 px-4">البيان والتفاصيل</th>
                <th className="py-3 px-4">التاريخ</th>
                <th className="py-3 px-4">طريقة الدفع</th>
                <th className="py-3 px-4">المسؤول</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{e.expenseNumber}</td>
                  <td className="py-3 px-4 font-bold text-[#1E3A8A]">{e.category}</td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-600">{e.amount.toLocaleString()} د.ع</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{e.beneficiary}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{e.description}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{e.date}</td>
                  <td className="py-3 px-4 text-slate-600">{e.paymentMethod}</td>
                  <td className="py-3 px-4 text-slate-500">{e.employeeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="تسجيل مصروف تشغيلي جديد"
        subtitle={`إدراج سند صرف مالي في ${settings.name}`}
      >
        <form onSubmit={handleSaveExpense} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1">تصنيف المصروف *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              >
                <option value="الكهرباء والمولدات">الكهرباء والمولدات</option>
                <option value="الماء والخدمات">الماء والخدمات</option>
                <option value="الإنترنت والاتصالات">الإنترنت والاتصالات</option>
                <option value="الصيانة والترميم">الصيانة والترميم</option>
                <option value="القرطاسية والكتب">القرطاسية والكتب</option>
                <option value="الأثاث والتجهيزات">الأثاث والتجهيزات</option>
                <option value="الوقود والنقل">الوقود والنقل</option>
                <option value="النظافة ومواد التعقيم">النظافة ومواد التعقيم</option>
                <option value="النشاطات والفعاليات">النشاطات والفعاليات</option>
                <option value="الإيجار السنوي">الإيجار السنوي</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1">المبلغ (د.ع) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">الجهة المستفيدة / القابض *</label>
              <input
                type="text"
                required
                value={formData.beneficiary}
                onChange={e => setFormData({ ...formData, beneficiary: e.target.value })}
                placeholder="اسم الشركة أو الشخص أو الجهة"
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">طريقة الصرف</label>
              <select
                value={formData.paymentMethod}
                onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
              >
                <option value="نقدي">نقدي</option>
                <option value="تحويل بنكي">تحويل بنكي</option>
                <option value="شيك">شيك</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">البيان والشرح التفصيلي</label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="وصف تفصيلي للغرض من الصرف..."
              className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-xs"
            >
              حفظ المصروف
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
