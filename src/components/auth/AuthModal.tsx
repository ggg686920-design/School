/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AuthModal:
 * نافذة تسجيل الدخول وإنشاء الحساب مع حماية كود المدرسة السري الإلزامية للمدير والمحاسب
 */

import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Users,
  Wallet,
  KeyRound,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin'
}) => {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    switchDemoUser
  } = useAuth();

  const { verifyAccessCode, recordLoginAttempt } = useSchool();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(initialTab);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInRole, setSignInRole] = useState<UserRole>('SCHOOL_OWNER');
  const [signInAccessCode, setSignInAccessCode] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('teacher');
  const [signUpAccessCode, setSignUpAccessCode] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [showDomainHelp, setShowDomainHelp] = useState(false);

  if (!isOpen) return null;

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTabChange = (tab: 'signin' | 'signup' | 'forgot') => {
    clearMessages();
    setActiveTab(tab);
  };

  // Sign in submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    
    if (!signInEmail.trim() || !signInPassword.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    // فحص كود المدرسة الإلزامي لحسابات مدير المدرسة والمحاسب
    const isSensitiveRole = signInRole === 'SCHOOL_MANAGER' || signInRole === 'ACCOUNTANT';
    if (isSensitiveRole) {
      if (!signInAccessCode.trim()) {
        await recordLoginAttempt({
          email: signInEmail.trim(),
          role: signInRole,
          success: false,
          failureReason: 'يرجى إدخال كود المدرسة لإكمال تسجيل الدخول.'
        });
        setErrorMessage('يرجى إدخال كود المدرسة لإكمال تسجيل الدخول.');
        return;
      }

      const isValidCode = await verifyAccessCode(signInAccessCode.trim());
      if (!isValidCode) {
        await recordLoginAttempt({
          email: signInEmail.trim(),
          role: signInRole,
          success: false,
          failureReason: 'محاولة تسجيل دخول فاشلة — كود مدرسة غير صحيح.'
        });
        setErrorMessage('كود المدرسة غير صحيح. يرجى مراجعة مالك المدرسة للحصول على كود الدخول المعتمد.');
        return;
      }
    }

    setLoading(true);
    const res = await signInWithEmail(signInEmail.trim(), signInPassword);
    setLoading(false);

    if (res.success) {
      await recordLoginAttempt({
        email: signInEmail.trim(),
        role: signInRole,
        success: true
      });
      setSuccessMessage('تم تسجيل الدخول بنجاح! مرحباً بك في النظام.');
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      await recordLoginAttempt({
        email: signInEmail.trim(),
        role: signInRole,
        success: false,
        failureReason: res.error || 'فشل التحقق من كلمة المرور'
      });
      setErrorMessage(res.error || 'تعذر تسجيل الدخول، يرجى مراجعة البريد وكلمة المرور');
    }
  };

  // Sign up submit
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!signUpName.trim()) {
      setErrorMessage('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!signUpEmail.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMessage('يجب أن تتكون كلمة المرور من 6 خانات على الأقل');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين');
      return;
    }

    // التحقق من كود المدرسة عند إنشاء حساب مدير أو محاسب
    const isSensitiveRole = signUpRole === 'SCHOOL_MANAGER' || signUpRole === 'ACCOUNTANT';
    if (isSensitiveRole) {
      if (!signUpAccessCode.trim()) {
        setErrorMessage('يرجى إدخال كود المدرسة لإنشاء هذا النوع من الحسابات الإدارية.');
        return;
      }
      const isValidCode = await verifyAccessCode(signUpAccessCode.trim());
      if (!isValidCode) {
        setErrorMessage('كود المدرسة غير صحيح. لا يمكن إنشاء حساب إداري بدون كود المالك.');
        return;
      }
    }

    setLoading(true);
    const res = await signUpWithEmail(signUpEmail.trim(), signUpPassword, signUpName.trim(), signUpRole);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('تم إنشاء حسابك بنجاح ومزامنة الصلاحيات!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMessage(res.error || 'تعذر إنشاء الحساب');
    }
  };

  // Google sign in
  const handleGoogleSignIn = async () => {
    clearMessages();
    setShowDomainHelp(false);
    setLoading(true);
    const res = await signInWithGoogle(signUpRole);
    setLoading(false);
    if (res.success) {
      setSuccessMessage('تم تسجيل الدخول عبر Google بنجاح!');
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      setErrorMessage(res.error || 'تعذر تسجيل الدخول عبر Google');
      if (res.isUnauthorizedDomain) {
        setShowDomainHelp(true);
      }
    }
  };

  // Reset password submit
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!forgotEmail.trim()) {
      setErrorMessage('يرجى كتابة البريد الإلكتروني');
      return;
    }

    setLoading(true);
    const res = await resetPassword(forgotEmail.trim());
    setLoading(false);
    if (res.success) {
      setSuccessMessage(res.message || 'تم إرسال رابط التعيين بنجاح');
    } else {
      setErrorMessage(res.error || 'فشل إرسال الرابط');
    }
  };

  const accountRoles: { id: UserRole; label: string; desc: string; icon: any; requiresCode: boolean }[] = [
    { id: 'SCHOOL_OWNER', label: 'مالك المدرسة (SCHOOL_OWNER)', desc: 'صلاحيات مطلقة وإدارة كود المدرسة', icon: ShieldCheck, requiresCode: false },
    { id: 'SCHOOL_MANAGER', label: 'مدير المدرسة (SCHOOL_MANAGER)', desc: 'إدارة تشغيلية (محجوبة عن المجاميع المالية)', icon: UserCheck, requiresCode: true },
    { id: 'ACCOUNTANT', label: 'المحاسب المالي (ACCOUNTANT)', desc: 'إدارة الأقساط والرواتب والمصروفات', icon: Wallet, requiresCode: true },
    { id: 'teacher', label: 'الهيئة التعليمية (المدرسون)', desc: 'إدارة المواد والدرجات والغياب', icon: GraduationCap, requiresCode: false },
    { id: 'parent', label: 'ولي أمر طالب', desc: 'متابعة الأبناء والأقساط والنتائج', icon: Users, requiresCode: false },
    { id: 'student', label: 'طالب / طالبة', desc: 'استعراض الجدول والشهادات والواجبات', icon: UserCheck, requiresCode: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-[#1E3A8A] text-white p-5 flex items-center justify-between relative">
          <div>
            <h2 className="text-base font-bold font-['Alexandria',sans-serif] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
              بوابة الدخول الموحدة للمدرسة
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              نظام إدارة المدارس العراقي المتكامل
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => handleTabChange('signin')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'signin'
                ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'signup'
                ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Notification Banners */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col gap-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            </div>
          )}

          {showDomainHelp && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-2.5 animate-in fade-in">
              <div className="font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-900 font-semibold">
                  ⚡ خطوة لمرة واحدة في Firebase Console لتفعيل Google:
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-850">
                لحماية حسابك، يطلب Firebase إضافة نطاق التطبيق إلى قائمة <strong>Authorized domains</strong>:
              </p>
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-amber-200">
                <span className="font-mono text-[11px] text-slate-800 flex-1 truncate select-all" dir="ltr">
                  {typeof window !== 'undefined' ? window.location.hostname : ''}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.hostname);
                      setCopiedDomain(true);
                      setTimeout(() => setCopiedDomain(false), 2000);
                    }
                  }}
                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                >
                  {copiedDomain ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedDomain ? 'تم النسخ!' : 'نسخ النطاق'}</span>
                </button>
              </div>
              <div className="text-[11px] text-amber-800 space-y-0.5">
                <div>• اذهب إلى: Firebase Console ⬅️ مشروع <strong>school-86c0b</strong>.</div>
                <div>• اختر <strong>Authentication</strong> ⬅️ <strong>Settings</strong> ⬅️ <strong>Authorized domains</strong>.</div>
                <div>• اضغط <strong>Add domain</strong> والصق النطاق المنسوخ أعلاه.</div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' && (
            <div>
              <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    صفة ونوع الحساب *
                  </label>
                  <select
                    value={signInRole}
                    onChange={e => setSignInRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900 bg-white"
                  >
                    {accountRoles.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    البريد الإلكتروني / اسم المستخدم *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={e => setSignInEmail(e.target.value)}
                      placeholder="user@nooralkamal.iq"
                      required
                      className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">كلمة المرور *</label>
                    <button
                      type="button"
                      onClick={() => handleTabChange('forgot')}
                      className="text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={e => setSignInPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pr-9 pl-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 text-left"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* كود المدرسة السري الإلزامي لمدير المدرسة والمحاسب */}
                {(signInRole === 'SCHOOL_MANAGER' || signInRole === 'ACCOUNTANT') && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1.5 animate-in fade-in">
                    <label className="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      <span>كود المدرسة السري (مطلوب لإكمال الدخول) *</span>
                    </label>
                    <input
                      type="text"
                      value={signInAccessCode}
                      onChange={e => setSignInAccessCode(e.target.value)}
                      placeholder="مثال: NK-SEC-••••-••••"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-mono text-slate-900 text-left"
                      dir="ltr"
                    />
                    <p className="text-[10px] text-amber-800">
                      يُمنح هذا الكود السري من قِبل مالك المدرسة فقط للتحقق من انتسابك لهذه المدرسة.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>تسجيل الدخول للنظام</span>
                  )}
                </button>
              </form>

              {/* Google Sign In */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>المتابعة عبر حساب Google</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'signup' && (
            <div>
              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    الاسم الكامل ثلاثياً *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={signUpName}
                      onChange={e => setSignUpName(e.target.value)}
                      placeholder="مثال: د. كمال الحديثي"
                      required
                      className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    البريد الإلكتروني *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={signUpEmail}
                      onChange={e => setSignUpEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    نوع وصلاحية الحساب *
                  </label>
                  <select
                    value={signUpRole}
                    onChange={e => setSignUpRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 bg-white"
                  >
                    {accountRoles.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* كود المدرسة عند إنشاء حساب مدير أو محاسب */}
                {(signUpRole === 'SCHOOL_MANAGER' || signUpRole === 'ACCOUNTANT') && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5 animate-in fade-in">
                    <label className="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      <span>كود المدرسة السري (مطلوب للاعتماد) *</span>
                    </label>
                    <input
                      type="text"
                      value={signUpAccessCode}
                      onChange={e => setSignUpAccessCode(e.target.value)}
                      placeholder="أدخل كود المدرسة المستلم من المالك"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-mono text-left"
                      dir="ltr"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      كلمة المرور *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={e => setSignUpPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      تأكيد كلمة المرور *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        value={signUpConfirmPassword}
                        onChange={e => setSignUpConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>إنشاء الحساب الآن</span>
                  )}
                </button>
              </form>

              <div className="mt-3 text-center">
                <button
                  onClick={() => handleTabChange('signin')}
                  className="text-xs text-slate-500 hover:text-blue-600 font-medium"
                >
                  لديك حساب بالفعل؟ <span className="text-blue-600 font-bold underline">تسجيل الدخول</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <div>
              <div className="mb-4 text-center">
                <h3 className="text-sm font-bold text-slate-800">استعادة كلمة المرور</h3>
                <p className="text-xs text-slate-500 mt-1">
                  أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    البريد الإلكتروني المسجل
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="user@nooralkamal.iq"
                      required
                      className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm text-slate-900 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
                >
                  إرسال رابط التعيين
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('signin')}
                  className="w-full py-2 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  العودة لتسجيل الدخول
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-400">
          نظام إدارة المدارس العراقي المتكامل · مصادقة آمنة ومشفرة
        </div>
      </div>
    </div>
  );
};
