/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * البحث الشامل في النظام — Section 32
 */

import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Briefcase, Users2, Receipt, BookOpen, X, ArrowLeft } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Student, Teacher, Parent, PaymentReceipt, Subject } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntity: (type: string, id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectEntity }) => {
  const { db, setActiveTab, setSelectedStudentId } = useSchool();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'students' | 'teachers' | 'receipts'>('all');

  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    if (isOpen) {
      db.getStudents().then(setStudents);
      db.getTeachers().then(setTeachers);
      db.getReceipts().then(setReceipts);
      db.getSubjects().then(setSubjects);
    }
  }, [isOpen, db]);

  if (!isOpen) return null;

  const term = searchTerm.trim().toLowerCase();

  const filteredStudents = students.filter(s =>
    term === '' ||
    s.fullName.toLowerCase().includes(term) ||
    s.studentNumber.includes(term) ||
    s.nationalId.includes(term) ||
    s.phone.includes(term)
  );

  const filteredTeachers = teachers.filter(t =>
    term === '' ||
    t.fullName.toLowerCase().includes(term) ||
    t.specialty.toLowerCase().includes(term) ||
    t.phone.includes(term)
  );

  const filteredReceipts = receipts.filter(r =>
    term === '' ||
    r.receiptNumber.toLowerCase().includes(term) ||
    r.studentName.toLowerCase().includes(term)
  );

  const handleStudentClick = (id: string) => {
    setSelectedStudentId(id);
    setActiveTab('students');
    onClose();
  };

  const handleTeacherClick = (id: string) => {
    setActiveTab('teachers');
    onClose();
  };

  const handleReceiptClick = (id: string) => {
    setActiveTab('receipts');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث بالاسم، الرقم التعريفي، الهاتف، أو رقم السند..."
            className="flex-1 bg-transparent border-0 outline-hidden text-sm text-slate-900 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 bg-slate-200/60 rounded"
          >
            إلغاء [ESC]
          </button>
        </div>

        {/* Filter Pills / Tabs */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-slate-100 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterType === 'all' ? 'bg-[#2563EB] text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilterType('students')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterType === 'students' ? 'bg-[#2563EB] text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            الطلاب ({filteredStudents.length})
          </button>
          <button
            onClick={() => setFilterType('teachers')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterType === 'teachers' ? 'bg-[#2563EB] text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            المدرسون ({filteredTeachers.length})
          </button>
          <button
            onClick={() => setFilterType('receipts')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterType === 'receipts' ? 'bg-[#2563EB] text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            سندات القبض ({filteredReceipts.length})
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Students section */}
          {(filterType === 'all' || filterType === 'students') && filteredStudents.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-2">الطلاب</div>
              <div className="space-y-1">
                {filteredStudents.map(std => (
                  <div
                    key={std.id}
                    onClick={() => handleStudentClick(std.id)}
                    className="p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{std.fullName}</div>
                        <div className="text-[11px] text-slate-500">
                          {std.gradeName} · رقم الطالب: {std.studentNumber} · هاتف: {std.phone}
                        </div>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teachers section */}
          {(filterType === 'all' || filterType === 'teachers') && filteredTeachers.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-2">المدرسون</div>
              <div className="space-y-1">
                {filteredTeachers.map(tch => (
                  <div
                    key={tch.id}
                    onClick={() => handleTeacherClick(tch.id)}
                    className="p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{tch.fullName}</div>
                        <div className="text-[11px] text-slate-500">
                          تخصص {tch.specialty} · هاتف: {tch.phone}
                        </div>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Receipts section */}
          {(filterType === 'all' || filterType === 'receipts') && filteredReceipts.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 mb-2">سندات القبض</div>
              <div className="space-y-1">
                {filteredReceipts.map(rec => (
                  <div
                    key={rec.id}
                    onClick={() => handleReceiptClick(rec.id)}
                    className="p-2.5 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{rec.receiptNumber} — {rec.studentName}</div>
                        <div className="text-[11px] text-slate-500">
                          {rec.amount.toLocaleString()} د.ع ({rec.reason}) · {rec.date}
                        </div>
                      </div>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredStudents.length === 0 && filteredTeachers.length === 0 && filteredReceipts.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              لا توجد نتائج مطابقة لبحثك "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
