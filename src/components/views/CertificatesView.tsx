/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Certificates View — Section 18: الشهادات الرسمية والوثائق الأكاديمية
 */

import React, { useState, useEffect } from 'react';
import { Award, Printer, ShieldCheck, Download, School as SchoolIcon, CheckCircle2 } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Certificate, Student } from '../../types';
import { QRCode } from '../common/QRCode';

export const CertificatesView: React.FC = () => {
  const { db, settings } = useSchool();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    db.getCertificates().then(certs => {
      setCertificates(certs);
      if (certs.length > 0) setSelectedCert(certs[0]);
    });
  }, [db]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            الشهادات المدرسية والوثائق الرسمية
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            إصدار واعتماد الشهادات الأكاديمية الرسمية المزودة برمز QR والختم المعتمد لـ {settings.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {certificates.length > 1 && (
            <select
              value={selectedCert?.id}
              onChange={e => {
                const found = certificates.find(c => c.id === e.target.value);
                if (found) setSelectedCert(found);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-hidden"
            >
              {certificates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.studentName} ({c.certificateNumber})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الشهادة الرسمية</span>
          </button>
        </div>
      </div>

      {selectedCert && (
        <div className="bg-white rounded-2xl border-4 border-slate-800 p-8 sm:p-12 shadow-sm printable-area max-w-4xl mx-auto relative overflow-hidden">
          {/* Ornate Inner Frame */}
          <div className="border border-slate-300 p-6 sm:p-8 rounded-xl relative">
            {/* Certificate Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-6">
              <div className="text-right space-y-1">
                <div className="text-xs font-bold text-slate-600">جمهورية العراق</div>
                <div className="text-xs font-bold text-slate-600">وزارة التربية والتعليم</div>
                <div className="text-xs text-slate-500">المديرية العامة للتربية / {settings.province}</div>
                <div className="text-base font-bold text-[#1E3A8A] font-['Alexandria',sans-serif] pt-1">
                  {settings.name}
                </div>
              </div>

              {/* School Crest / Emblem */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-900 text-white flex items-center justify-center border-2 border-amber-400 shadow-xs mb-1">
                  <SchoolIcon className="w-8 h-8 text-amber-400" />
                </div>
                <div className="text-[10px] text-slate-400 font-mono tracking-wider">EST. 2012</div>
              </div>

              {/* Certificate Metadata & QR */}
              <div className="text-left flex flex-col items-end">
                <QRCode data={selectedCert.qrCodeData} size={70} />
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  رقم الوثيقة: {selectedCert.certificateNumber}
                </div>
                <div className="text-[10px] text-slate-400">تاريخ الإصدار: {selectedCert.date}</div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-6 space-y-1">
              <h2 className="text-2xl font-black text-slate-900 font-['Alexandria',sans-serif] tracking-wide">
                شهادة درجات وتقدير عام
              </h2>
              <p className="text-xs text-slate-600">
                تشهد إدارة المدرسة بأن الطالب أدناه قد أتم متطلبات الفصل الدراسي للعام {selectedCert.academicYear}
              </p>
            </div>

            {/* Student Info Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
              <div>
                <span className="text-slate-400 block text-[11px]">اسم الطالب الرباعي:</span>
                <span className="font-bold text-slate-900">{selectedCert.studentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">الصف الدراسي:</span>
                <span className="font-semibold text-slate-800">{selectedCert.gradeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">الشعبة:</span>
                <span className="font-semibold text-slate-800">{selectedCert.sectionName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">النتيجة النهائية:</span>
                <span className="font-bold text-[#16A34A]">{selectedCert.status === 'passed' ? 'ناجح ومؤهل' : 'مكمل'}</span>
              </div>
            </div>

            {/* Grades Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden mb-6 text-xs">
              <table className="w-full text-right border-collapse">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">ت</th>
                    <th className="p-2.5">المادة الدراسية</th>
                    <th className="p-2.5 text-center">الدرجة العظمى</th>
                    <th className="p-2.5 text-center">درجة النجاح</th>
                    <th className="p-2.5 text-center">الدرجة المستحقة</th>
                    <th className="p-2.5 text-center">التقدير</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedCert.grades.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-mono text-slate-400">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">{g.subjectName}</td>
                      <td className="p-2.5 text-center font-mono text-slate-500">{g.maxScore}</td>
                      <td className="p-2.5 text-center font-mono text-slate-500">{g.passingScore}</td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-900 text-sm">
                        {g.score}
                      </td>
                      <td className="p-2.5 text-center font-medium text-emerald-700">
                        {g.evaluation}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-blue-50/60 font-bold border-t-2 border-slate-200 text-slate-900">
                  <tr>
                    <td colSpan={2} className="p-3 text-right">المجموع والمعدل العام:</td>
                    <td className="p-3 text-center font-mono">{selectedCert.maxTotalScore}</td>
                    <td className="p-3 text-center font-mono">—</td>
                    <td className="p-3 text-center font-mono text-base text-[#2563EB]">
                      {selectedCert.totalScore}
                    </td>
                    <td className="p-3 text-center font-bold text-[#16A34A] text-sm">
                      {selectedCert.percentage}% ({selectedCert.overallEvaluation})
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Signatures & Seal */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <div className="text-slate-400 mb-8">معاون شؤون الامتحانات</div>
                <div className="font-bold text-slate-800">أ. حيدر جاسم</div>
              </div>

              {/* Official Seal Graphic */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-red-700/60 flex items-center justify-center text-red-700 font-bold rotate-[-12deg] p-1 text-[10px] select-none">
                  <div className="text-center leading-tight">
                    ختم الإدارة<br />
                    {settings.name}<br />
                    معتمد رسمياً
                  </div>
                </div>
              </div>

              <div>
                <div className="text-slate-400 mb-8">مدير المدرسة</div>
                <div className="font-bold text-slate-900 text-sm font-['Alexandria',sans-serif]">
                  {settings.principalName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
