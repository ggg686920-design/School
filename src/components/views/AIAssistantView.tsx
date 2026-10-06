/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AI School Assistant View — Section 29 & Section 30
 * مساعد الإدارة والمعلمين الذكي المدعوم بالذكاء الاصطناعي
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  BookOpen,
  FileQuestion,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AIQuestionResult } from '../../services/AIService';

export const AIAssistantView: React.FC = () => {
  const { aiService, settings } = useSchool();
  const [activeTab, setActiveTab] = useState<'admin' | 'exam_generator' | 'study_plan'>('admin');

  // Admin query chat
  const [queryInput, setQueryInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: `مرحباً بك في المساعد الذكي لمدرسة **${settings.name}**! أستطيع مساعدتك في تحليل بيانات الحضور، التدفقات المالية، الأقساط المتأخرة، توليد الاختبارات للمدرسين، وتتبع الأداء الأكاديمي. يمكنك اختيار أحد الأسئلة السريعة أدناه أو كتابة استفسارك مباشرة.`
    }
  ]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  // Exam generator
  const [selectedSubject, setSelectedSubject] = useState('الفيزياء الحديثة');
  const [selectedTopic, setSelectedTopic] = useState('الكهرومغناطيسية والفيزياء الذرية');
  const [generatedExam, setGeneratedExam] = useState<AIQuestionResult | null>(null);
  const [generatingExam, setGeneratingExam] = useState(false);
  const [copiedExam, setCopiedExam] = useState(false);

  // Study plan
  const [studentName, setStudentName] = useState('علي عمر فاضل');
  const [planSubject, setPlanSubject] = useState('الرياضيات التطبيقية');
  const [planWeakness, setPlanWeakness] = useState('التفاضل والتكامل وحل المسائل الهندسية');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const handleAsk = async (text: string) => {
    if (!text.trim() || loadingAnswer) return;
    const q = text.trim();
    setQueryInput('');
    setChatHistory(prev => [...prev, { sender: 'user', text: q }]);
    setLoadingAnswer(true);

    try {
      const ans = await aiService.askSchoolAssistant(q);
      setChatHistory(prev => [...prev, { sender: 'ai', text: ans }]);
    } catch {
      setChatHistory(prev => [...prev, { sender: 'ai', text: 'عذراً، حدث خطأ أثناء معالجة الاستعلام.' }]);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleGenerateExam = async () => {
    setGeneratingExam(true);
    try {
      const res = await aiService.generateExamQuiz(selectedSubject, selectedTopic, 'السادس العلمي');
      setGeneratedExam(res);
    } finally {
      setGeneratingExam(false);
    }
  };

  const handleGenerateStudyPlan = async () => {
    setGeneratingPlan(true);
    try {
      const res = await aiService.generateStudentStudyPlan(studentName, planSubject, planWeakness);
      setGeneratedPlan(res);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const quickAdminQuestions = [
    'كم طالب غائب اليوم في المدرسة؟',
    'كم مجموع الأقساط المتأخرة والديون؟',
    'ما هو الصف والشعبة الأعلى تحصيلاً دراسياً؟',
    'ما إجمالي المصروفات والسيولة المتوفرة؟',
    'ملخص إحصائيات المدرسة الشامل'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
              AI School Assistant — المساعد الذكي
            </h1>
            <p className="text-xs text-slate-500">
              تحليل البيانات الحية لـ {settings.name} وتوليد المحتوى التعليمي الذكي
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'admin' ? 'bg-[#2563EB] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            المساعد الإداري والتحليلي
          </button>
          <button
            onClick={() => setActiveTab('exam_generator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'exam_generator' ? 'bg-[#2563EB] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            توليد الأسئلة والاختبارات
          </button>
          <button
            onClick={() => setActiveTab('study_plan')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'study_plan' ? 'bg-[#2563EB] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            خطط المراجعة والدعم الأكاديمي
          </button>
        </div>
      </div>

      {/* Tab 1: Administrative Intelligence */}
      {activeTab === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Questions Sidebar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 h-fit">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
              <HelpCircle className="w-4 h-4 text-[#2563EB]" />
              <span>أسئلة إدارية سريعة</span>
            </div>
            <div className="space-y-1.5">
              {quickAdminQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  className="w-full text-right p-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2563EB] text-xs text-slate-700 transition-colors border border-slate-100 leading-relaxed block"
                >
                  «{q}»
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Stream */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 flex flex-col h-[560px] shadow-2xs overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-800">محادثة تحليل البيانات المدرسية الفورية</span>
              <span className="text-[11px] text-emerald-600 font-medium">● متصل بقاعدة بيانات المدرسة</span>
            </div>

            {/* Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#1E3A8A] text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loadingAnswer && (
                <div className="flex justify-end">
                  <div className="bg-slate-100 p-3 rounded-2xl text-xs text-slate-500 animate-pulse">
                    جاري استخراج البيانات وتحليل الإحصائيات...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk(queryInput)}
                placeholder="اكتب سؤالك الإداري أو الاستفسار هنا..."
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB] bg-slate-50"
              />
              <button
                onClick={() => handleAsk(queryInput)}
                disabled={loadingAnswer || !queryInput.trim()}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Exam & Quiz Generator for Teachers */}
      {activeTab === 'exam_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              إعدادات توليد الأسئلة الامتحانية
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">المادة الدراسية</label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                >
                  <option value="الفيزياء الحديثة">الفيزياء الحديثة</option>
                  <option value="الرياضيات التطبيقية">الرياضيات التطبيقية</option>
                  <option value="الكيمياء العامة">الكيمياء العامة والعضوية</option>
                  <option value="اللغة العربية والأدب">اللغة العربية والأدب</option>
                  <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">الموضوع أو الفصل الدراسي</label>
                <input
                  type="text"
                  value={selectedTopic}
                  onChange={e => setSelectedTopic(e.target.value)}
                  placeholder="مثال: الحث الكهرومغناطيسي، التفاضل والتكامل..."
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">المرحلة والصف</label>
                <input
                  type="text"
                  disabled
                  value="السادس العلمي (الوزاري)"
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
                />
              </div>

              <button
                onClick={handleGenerateExam}
                disabled={generatingExam}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs mt-4"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generatingExam ? 'جاري التوليد بواسطة الذكاء الاصطناعي...' : 'توليد أسئلة نموذجية مع الإجابة'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 font-['Alexandria',sans-serif]">
                النموذج الامتحاني المولد
              </h2>
              {generatedExam && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(generatedExam, null, 2));
                    setCopiedExam(true);
                    setTimeout(() => setCopiedExam(false), 2000);
                  }}
                  className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-semibold"
                >
                  {copiedExam ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedExam ? 'تم النسخ!' : 'نسخ الأسئلة'}</span>
                </button>
              )}
            </div>

            {generatedExam ? (
              <div className="space-y-4 text-xs">
                <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-100 text-[#1E3A8A] font-bold">
                  {generatedExam.title} ({generatedExam.stage})
                </div>

                <div className="space-y-4">
                  {generatedExam.questions.map(q => (
                    <div key={q.number} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-slate-900">س{q.number}: {q.text}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-semibold">{q.type}</span>
                      </div>

                      {q.options && (
                        <div className="grid grid-cols-2 gap-2 pt-1 text-slate-700">
                          {q.options.map((opt, i) => (
                            <div key={i} className="p-2 rounded bg-white border border-slate-200">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 text-slate-700 space-y-1">
                        <div>
                          <span className="font-bold text-emerald-800">الإجابة النموذجية: </span>
                          <span className="text-slate-900">{q.correctAnswer}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <span className="font-bold">التفسير: </span>
                          {q.explanation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                اختر المادة والموضوع واضغط على "توليد أسئلة نموذجية" لعرض بنك الأسئلة المعتمد.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Study Plan Generator */}
      {activeTab === 'study_plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              بيانات خطة الدعم الأكاديمي
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">اسم الطالب</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">المادة التي تحتاج تعزيزاً</label>
                <input
                  type="text"
                  value={planSubject}
                  onChange={e => setPlanSubject(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">نقاط الضعف الملحوظة</label>
                <textarea
                  rows={3}
                  value={planWeakness}
                  onChange={e => setPlanWeakness(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg outline-hidden focus:border-[#2563EB]"
                />
              </div>

              <button
                onClick={handleGenerateStudyPlan}
                disabled={generatingPlan}
                className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generatingPlan ? 'جاري بناء الخطة...' : 'توليد الخطة العلاجية الذكية'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 font-['Alexandria',sans-serif] pb-3 border-b border-slate-200 mb-4">
              الخطة الأكاديمية الاستدراكية المقترحة
            </h2>

            {generatedPlan ? (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 whitespace-pre-line">
                {generatedPlan}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                اضغط على زر التوليد لبناء خطة علاجية مخصصة ومجدولة زمنياً للطالب.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
