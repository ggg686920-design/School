/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Timetable View — Section 15: الجداول الأسبوعية للحصص المدرسية
 */

import React, { useState, useEffect } from 'react';
import { CalendarDays, Printer, Plus, Clock, MapPin, User, BookOpen } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { TimetableSlot, ClassGrade } from '../../types';

export const TimetableView: React.FC = () => {
  const { db, settings } = useSchool();
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('cls-6');

  useEffect(() => {
    db.getTimetable().then(setTimetable);
    db.getClasses().then(setClasses);
  }, [db]);

  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const periods = [1, 2, 3, 4, 5];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            الجدول الأسبوعي للدروس والحصص
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            توزيع الحصص والكوادر التدريسية والقاعات في {settings.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-hidden"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة الجدول</span>
          </button>
        </div>
      </div>

      {/* Printable Area */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs printable-area">
        {/* Print Header */}
        <div className="text-center pb-6 border-b border-slate-200 mb-6">
          <h2 className="text-lg font-bold text-slate-900 font-['Alexandria',sans-serif]">
            {settings.name}
          </h2>
          <p className="text-xs text-slate-500">
            الجدول الأسبوعي المعتمد — {classes.find(c => c.id === selectedGrade)?.name || 'السادس العلمي'} (الشعبة أ)
          </p>
          <p className="text-[11px] text-slate-400 mt-1">العام الدراسي {settings.currentAcademicYear}</p>
        </div>

        {/* Timetable Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-200 text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="border border-slate-200 p-3 font-bold w-28">اليوم</th>
                {periods.map(p => (
                  <th key={p} className="border border-slate-200 p-3 font-bold">
                    <div>الحصة {p}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-normal">
                      {p === 1 ? '08:00 - 08:45' : p === 2 ? '08:50 - 09:35' : p === 3 ? '09:50 - 10:35' : p === 4 ? '10:40 - 11:25' : '11:35 - 12:20'}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day} className="hover:bg-slate-50/50">
                  <td className="border border-slate-200 p-3 font-bold text-slate-800 bg-slate-50/60">
                    {day}
                  </td>
                  {periods.map(p => {
                    const slot = timetable.find(
                      t => t.day === day && t.period === p && (t.gradeId === selectedGrade || selectedGrade === 'cls-6')
                    );
                    return (
                      <td key={p} className="border border-slate-200 p-3 align-top min-w-[130px]">
                        {slot ? (
                          <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-2 text-right space-y-0.5">
                            <div className="font-bold text-[#2563EB]">{slot.subjectName}</div>
                            <div className="text-[11px] text-slate-600 font-medium">{slot.teacherName}</div>
                            <div className="text-[10px] text-slate-400">{slot.roomNumber}</div>
                          </div>
                        ) : (
                          <div className="text-slate-300 py-3 text-[11px]">استراحة / شاغر</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>مدير المدرسة: {settings.principalName}</div>
          <div>ختم الإدارة المدرسية المعتمد</div>
        </div>
      </div>
    </div>
  );
};
