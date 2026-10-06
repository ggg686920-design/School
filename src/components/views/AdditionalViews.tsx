/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * الأقسام التكميلية المترابطة:
 * 1. أولياء الأمور (ParentsView)
 * 2. الصفوف والشعب (ClassesView)
 * 3. المواد الدراسية (SubjectsView)
 * 4. الامتحانات والدرجات (ExamsGradesView)
 * 5. الموظفون (StaffView)
 * 6. الإعلانات (AnnouncementsView)
 * 7. الإشعارات (NotificationsView)
 * 8. الرسائل والتواصل (MessagesView)
 * 9. التقارير المدرسية (ReportsView)
 * 10. سجل العمليات (AuditLogView)
 */

import React, { useState, useEffect } from 'react';
import {
  Users2,
  Layers,
  BookOpen,
  FileSpreadsheet,
  Megaphone,
  Bell,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Plus,
  Search,
  Phone,
  Mail,
  Printer,
  Send,
  Calendar,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  Parent,
  ClassGrade,
  Section,
  Subject,
  GradeRecord,
  Employee,
  Announcement,
  NotificationItem,
  MessageItem,
  AuditLog
} from '../../types';
import { Modal } from '../common/Modal';

/* -------------------------------------------------------------------------- */
/* 1. أولياء الأمور (ParentsView)                                             */
/* -------------------------------------------------------------------------- */
export const ParentsView: React.FC = () => {
  const { db, settings } = useSchool();
  const [parents, setParents] = useState<Parent[]>([]);

  useEffect(() => {
    db.getParents().then(setParents);
  }, [db]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
          سجل أولياء الأمور
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          بيانات التواصل مع أولياء أمور طلبة {settings.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parents.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">{p.fullName}</h3>
              <span className="px-2 py-0.5 rounded text-[11px] bg-blue-50 text-[#2563EB] font-semibold">{p.relationship}</span>
            </div>
            <p className="text-slate-500">{p.job} · {p.address}</p>
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">الهاتف:</span>
                <span className="font-mono text-slate-800 font-semibold">{p.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">البريد:</span>
                <span className="font-mono text-slate-600">{p.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. الصفوف والشعب (ClassesView)                                             */
/* -------------------------------------------------------------------------- */
export const ClassesView: React.FC = () => {
  const { db, settings } = useSchool();
  const [classes, setClasses] = useState<ClassGrade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    Promise.all([db.getClasses(), db.getSections()]).then(([c, s]) => {
      setClasses(c);
      setSections(s);
    });
  }, [db]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
          الصفوف والمراحل الدراسية والشعب
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          هيكل المراحل والشعب المعتمد للعام {settings.currentAcademicYear}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map(c => {
          const classSections = sections.filter(s => s.gradeId === c.id);
          return (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-semibold">{c.stage}</span>
              </div>
              <div className="text-xs text-slate-500 flex justify-between">
                <span>الطلاب الحاليون: {c.currentStudentsCount}</span>
                <span>الطاقة الاستيعابية: {c.capacity}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block">الشعب الدراسية:</span>
                {classSections.map(s => (
                  <div key={s.id} className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">شعبة ({s.name}) — {s.roomNumber}</span>
                    <span className="text-slate-500 text-[11px]">{s.homeroomTeacherName}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. المواد الدراسية (SubjectsView)                                          */
/* -------------------------------------------------------------------------- */
export const SubjectsView: React.FC = () => {
  const { db, settings } = useSchool();
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    db.getSubjects().then(setSubjects);
  }, [db]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
          المناهج والمواد الدراسية
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          المناهج المعتمدة من وزارة التربية العراقية في {settings.name}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="py-3 px-4">رمز المادة</th>
              <th className="py-3 px-4">اسم المادة</th>
              <th className="py-3 px-4">المرحلة والصف</th>
              <th className="py-3 px-4">المدرس المسؤول</th>
              <th className="py-3 px-4">الحصص الأسبوعية</th>
              <th className="py-3 px-4">درجة النجاح / النهاية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjects.map(sub => (
              <tr key={sub.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-mono font-bold text-blue-700">{sub.code}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{sub.name}</td>
                <td className="py-3 px-4 text-slate-600">{sub.gradeName}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{sub.teacherName}</td>
                <td className="py-3 px-4 font-mono">{sub.weeklyClasses} حصص</td>
                <td className="py-3 px-4 font-mono font-bold text-emerald-600">{sub.passingScore} / {sub.maxScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. الامتحانات والدرجات (ExamsGradesView)                                    */
/* -------------------------------------------------------------------------- */
export const ExamsGradesView: React.FC = () => {
  const { db, settings } = useSchool();
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  useEffect(() => {
    db.getGrades().then(setGrades);
  }, [db]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
          رصد الامتحانات والدرجات الأكاديمية
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          سجل النتائج والتقييمات للعام الدراسي {settings.currentAcademicYear}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="py-3 px-4">اسم الطالب</th>
              <th className="py-3 px-4">المادة</th>
              <th className="py-3 px-4">نوع الامتحان / الفصل</th>
              <th className="py-3 px-4">الدرجة</th>
              <th className="py-3 px-4">الدرجة العظمى</th>
              <th className="py-3 px-4">التاريخ</th>
              <th className="py-3 px-4">التقييم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {grades.map(g => (
              <tr key={g.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">{g.studentName}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{g.subjectName}</td>
                <td className="py-3 px-4 text-slate-600">{g.semester}</td>
                <td className="py-3 px-4 font-mono font-bold text-[#16A34A] text-sm">{g.score}</td>
                <td className="py-3 px-4 font-mono text-slate-400">{g.maxScore}</td>
                <td className="py-3 px-4 font-mono text-slate-500">{g.date}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 font-semibold">
                    {g.score >= 90 ? 'امتياز' : g.score >= 80 ? 'جيد جداً' : 'ناجح'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. الموظفون (StaffView)                                                    */
/* -------------------------------------------------------------------------- */
export const StaffView: React.FC = () => {
  const { db, settings } = useSchool();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    db.getEmployees().then(setEmployees);
  }, [db]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
          الموظفون الإداريون والخدميون
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          سجل الكوادر المساندة في {settings.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {employees.map(e => (
          <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">{e.fullName}</h3>
              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-semibold">{e.roleType}</span>
            </div>
            <p className="text-slate-500">هاتف: {e.phone}</p>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-600">
              <span>الراتب الأساسي:</span>
              <span className="font-mono font-bold text-slate-900">{e.basicSalary.toLocaleString()} د.ع</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. الإعلانات (AnnouncementsView)                                           */
/* -------------------------------------------------------------------------- */
export const AnnouncementsView: React.FC = () => {
  const { db, settings, refreshData } = useSchool();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<any>('إعلان');

  useEffect(() => {
    db.getAnnouncements().then(setAnnouncements);
  }, [db]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await db.saveAnnouncement({
      id: `anc-${Date.now()}`,
      type,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      expiryDate: '2026-11-01',
      author: 'إدارة المدرسة',
      targetAudience: 'الجميع'
    });

    setAddModal(false);
    setTitle('');
    setContent('');
    const list = await db.getAnnouncements();
    setAnnouncements(list);
    await refreshData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            لوحة الإعلانات والفعاليات
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            التعاميم والأخبار الصادرة عن إدارة {settings.name}
          </p>
        </div>

        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة إعلان رسمي</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {a.type}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{a.date}</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug">{a.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{a.content}</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>المرسل: {a.author}</span>
              <span>الموجه: {a.targetAudience}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="نشر إعلان مدرسي جديد">
        <form onSubmit={handleCreate} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-600 mb-1">نوع الإعلان</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
            >
              <option value="إعلان">إعلان رسمي</option>
              <option value="خبر">خبر مدرسي</option>
              <option value="تنبيه">تنبيه هام</option>
              <option value="فعالية">فعالية أو نشاط</option>
              <option value="عطلة">عطلة رسمية</option>
              <option value="اجتماع">اجتماع أولياء أمور</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 mb-1">عنوان الإعلان *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1">نص وتفاصيل الإعلان</label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setAddModal(false)} className="px-3 py-1.5 border rounded">إلغاء</button>
            <button type="submit" className="px-4 py-1.5 bg-[#2563EB] text-white font-bold rounded">نشر الإعلان</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 7. الإشعارات (NotificationsView)                                           */
/* -------------------------------------------------------------------------- */
export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead } = useSchool();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
          مركز الإشعارات والتنبيهات
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          جاهز للربط مع Firebase Cloud Messaging (FCM) مستقبلاً
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors ${
              !n.read ? 'bg-blue-50/40' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`w-2.5 h-2.5 rounded-full mt-1.5 ${!n.read ? 'bg-[#2563EB]' : 'bg-slate-300'}`} />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
              </div>
            </div>
            {!n.read && (
              <span className="text-[11px] font-semibold text-[#2563EB] shrink-0">جديد</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 8. الرسائل (MessagesView)                                                  */
/* -------------------------------------------------------------------------- */
export const MessagesView: React.FC = () => {
  const { db } = useSchool();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    db.getMessages().then(setMessages);
  }, [db]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    const msg: MessageItem = {
      id: `msg-${Date.now()}`,
      senderId: 'admin',
      senderName: 'إدارة المدرسة',
      senderRole: 'admin',
      receiverId: 'prt-1',
      receiverName: 'أحمد كاظم العبيدي',
      receiverRole: 'parent',
      content: newMsg,
      timestamp: 'الآن',
      isRead: true
    };
    await db.sendMessage(msg);
    setNewMsg('');
    const updated = await db.getMessages();
    setMessages(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
          الرسائل والتواصل الداخلي
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          قنوات المحادثة بين الإدارة ↔ المدرسين ↔ أولياء الأمور
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 h-[500px] flex flex-col overflow-hidden shadow-2xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700">
          محادثة: ولي أمر الطالب مصطفى العبيدي (أحمد كاظم)
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.senderRole === 'admin'
                    ? 'bg-[#1E3A8A] text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}
              >
                <div className="text-[10px] font-semibold opacity-80 mb-0.5">{m.senderName}</div>
                <div>{m.content}</div>
                <div className="text-[9px] opacity-60 text-left mt-1 font-mono">{m.timestamp}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رد الإدارة هنا..."
            className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إرسال</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 9. التقارير والإحصائيات (ReportsView)                                      */
/* -------------------------------------------------------------------------- */
export const ReportsView: React.FC = () => {
  const { metrics, settings } = useSchool();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            التقارير والإحصائيات الإدارية والمالية
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            التقارير التحليلية المعتمدة لـ {settings.name} للعام {settings.currentAcademicYear}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة تقرير شامل</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs printable-area space-y-6 text-xs">
        <div className="text-center pb-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900 font-['Alexandria',sans-serif]">
            {settings.name} — التقرير الفصلي المجمع
          </h2>
          <p className="text-slate-500">تاريخ الإصدار: 2026-10-06 · الكرخ / بغداد</p>
        </div>

        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">إجمالي الطلاب:</span>
              <span className="text-lg font-bold text-slate-900 font-mono">{metrics.totalStudents}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">إجمالي الإيرادات المحصلة:</span>
              <span className="text-lg font-bold text-[#16A34A] font-mono">{metrics.totalRevenueCollected.toLocaleString()} د.ع</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">الديون المتأخرة:</span>
              <span className="text-lg font-bold text-[#DC2626] font-mono">{metrics.totalDebtsRemaining.toLocaleString()} د.ع</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">نسبة الحضور اليومية:</span>
              <span className="text-lg font-bold text-blue-700 font-mono">{metrics.todayAttendanceRate}%</span>
            </div>
          </div>
        )}

        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <h3 className="font-bold text-slate-900 mb-2">توصيات المساعد الذكي والإدارة:</h3>
          <p className="text-slate-600 leading-relaxed">
            تشير الإحصائيات إلى استقرار تام في العملية التربوية ونسب حضور تتجاوز 95%. يوصى بتكثيف المتابعة المالية للديون المتبقية لضمان تحصيل الأقساط قبل انطلاق الامتحانات النهائية.
          </p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 10. سجل العمليات (AuditLogView)                                            */
/* -------------------------------------------------------------------------- */
export const AuditLogView: React.FC = () => {
  const { db } = useSchool();
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    db.getAuditLogs().then(setLogs);
  }, [db]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
          سجل العمليات والأمان (Audit Log)
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          سجل غير قابل للتعديل يوثق جميع التغييرات وعمليات المستخدمين في النظام
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="py-3 px-4">المستخدم</th>
              <th className="py-3 px-4">الصلاحية</th>
              <th className="py-3 px-4">العملية المنجزة</th>
              <th className="py-3 px-4">القسم</th>
              <th className="py-3 px-4">البيانات المتأثرة</th>
              <th className="py-3 px-4">الوقت والتاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map(l => (
              <tr key={l.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-900">{l.userName}</td>
                <td className="py-3 px-4 text-slate-600">{l.userRole}</td>
                <td className="py-3 px-4 font-semibold text-[#1E3A8A]">{l.action}</td>
                <td className="py-3 px-4 text-slate-500">{l.department}</td>
                <td className="py-3 px-4 text-slate-700 max-w-sm truncate">{l.affectedData}</td>
                <td className="py-3 px-4 font-mono text-slate-400">{l.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
