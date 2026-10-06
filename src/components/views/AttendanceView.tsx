/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Attendance View — Section 16: سجل الحضور والغياب اليومي
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Info, Bell, Save, Calendar, UserCheck } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Student, AttendanceRecord, AttendanceStatus } from '../../types';

export const AttendanceView: React.FC = () => {
  const { db, settings, refreshData } = useSchool();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-06');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; note: string; notify: boolean }>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    Promise.all([db.getStudents(), db.getAttendance()]).then(([stds, records]) => {
      setStudents(stds);
      const map: Record<string, { status: AttendanceStatus; note: string; notify: boolean }> = {};
      stds.forEach(s => {
        const found = records.find(r => r.studentId === s.id && r.date === selectedDate);
        map[s.id] = {
          status: found?.status || 'present',
          note: found?.note || '',
          notify: found?.notifiedParent || false
        };
      });
      setAttendanceMap(map);
    });
  }, [db, selectedDate]);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        notify: status === 'absent' || status === 'late'
      }
    }));
  };

  const handleSaveAttendance = async () => {
    const records: AttendanceRecord[] = students.map(s => {
      const entry = attendanceMap[s.id] || { status: 'present', note: '', notify: false };
      return {
        id: `att-${s.id}-${selectedDate}`,
        studentId: s.id,
        studentName: s.fullName,
        gradeId: s.gradeId,
        sectionId: s.sectionId,
        date: selectedDate,
        status: entry.status,
        note: entry.note,
        notifiedParent: entry.notify
      };
    });

    await db.recordAttendance(records);

    // إضافة في سجل العمليات
    await db.addAuditLog({
      id: `aud-${Date.now()}`,
      userName: 'مدرس الصف / مشرف الحضور',
      userRole: 'Teacher',
      action: 'تثبيت حضور وغياب',
      department: 'شؤون الطلبة',
      affectedData: `سجل حضور يوم ${selectedDate} لـ ${students.length} طالب`,
      timestamp: new Date().toLocaleString('ar-IQ')
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    await refreshData();
  };

  // Stats calculation
  const total = students.length;
  const presentCount = Object.values(attendanceMap).filter(v => v.status === 'present').length;
  const absentCount = Object.values(attendanceMap).filter(v => v.status === 'absent').length;
  const lateCount = Object.values(attendanceMap).filter(v => v.status === 'late').length;
  const excusedCount = Object.values(attendanceMap).filter(v => v.status === 'excused').length;
  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            سجل الحضور والغياب اليومي
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            تثبيت حضور الطلاب في {settings.name} مع خيار الإشعار الفوري لولي الأمر
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-hidden font-mono"
          />

          <button
            onClick={handleSaveAttendance}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>حفظ واعتماد الحضور</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ سجل الحضور والغياب بنجاح، وتوليد إشعارات المتابعة تلقائياً.</span>
        </div>
      )}

      {/* Summary KPI stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <span className="text-[11px] text-slate-400 block">نسبة الحضور</span>
          <span className="text-lg font-bold text-[#16A34A] font-mono">{attendanceRate}%</span>
        </div>
        <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
          <span className="text-[11px] text-emerald-800 block">حاضر (🟢)</span>
          <span className="text-lg font-bold text-[#16A34A] font-mono">{presentCount}</span>
        </div>
        <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200">
          <span className="text-[11px] text-rose-800 block">غائب (🔴)</span>
          <span className="text-lg font-bold text-[#DC2626] font-mono">{absentCount}</span>
        </div>
        <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
          <span className="text-[11px] text-amber-800 block">متأخر (🟡)</span>
          <span className="text-lg font-bold text-[#EAB308] font-mono">{lateCount}</span>
        </div>
        <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-200">
          <span className="text-[11px] text-sky-800 block">بعذر (🔵)</span>
          <span className="text-lg font-bold text-[#0EA5E9] font-mono">{excusedCount}</span>
        </div>
      </div>

      {/* Roll Call Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4">رقم الطالب</th>
                <th className="py-3 px-4">اسم الطالب</th>
                <th className="py-3 px-4">الصف والشعبة</th>
                <th className="py-3 px-4 text-center">حالة الحضور</th>
                <th className="py-3 px-4">ملاحظة / سبب الغياب</th>
                <th className="py-3 px-4 text-center">إشعار ولي الأمر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(s => {
                const entry = attendanceMap[s.id] || { status: 'present', note: '', notify: false };
                return (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">{s.studentNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.fullName}</td>
                    <td className="py-3 px-4 text-slate-600">{s.gradeName} ({s.sectionName})</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setStatus(s.id, 'present')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                            entry.status === 'present'
                              ? 'bg-[#16A34A] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          حاضر
                        </button>
                        <button
                          onClick={() => setStatus(s.id, 'absent')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                            entry.status === 'absent'
                              ? 'bg-[#DC2626] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          غائب
                        </button>
                        <button
                          onClick={() => setStatus(s.id, 'late')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                            entry.status === 'late'
                              ? 'bg-[#EAB308] text-slate-950 shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          متأخر
                        </button>
                        <button
                          onClick={() => setStatus(s.id, 'excused')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                            entry.status === 'excused'
                              ? 'bg-[#0EA5E9] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          بعذر
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={entry.note}
                        onChange={e => {
                          const val = e.target.value;
                          setAttendanceMap(prev => ({
                            ...prev,
                            [s.id]: { ...prev[s.id], note: val }
                          }));
                        }}
                        placeholder="إجازة، عذر، مراجعة طبيب..."
                        className="w-full p-1 border border-slate-200 rounded text-xs bg-slate-50 focus:bg-white focus:border-blue-400 outline-hidden"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-600">
                        <input
                          type="checkbox"
                          checked={entry.notify}
                          onChange={e => {
                            const checked = e.target.checked;
                            setAttendanceMap(prev => ({
                              ...prev,
                              [s.id]: { ...prev[s.id], notify: checked }
                            }));
                          }}
                          className="rounded text-[#2563EB] focus:ring-0"
                        />
                        <span className="text-[11px]">إرسال SMS</span>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
