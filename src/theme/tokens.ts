/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * نظام إدارة المدارس الذكي — Design Tokens المركزية
 * الالتزام التام بقواعد التصميم: لون أساسي واحد (#2563EB) ولون تمييز واحد (#F59E0B)
 * وألوان الحالات الأربعة فقط.
 */

export const DESIGN_TOKENS = {
  colors: {
    primary: '#2563EB',       // اللون الأساسي: الأزرار، الشريط الجانبي، العناصر النشطة
    primaryDark: '#1E3A8A',   // اللون الأساسي الداكن: Header والعناوين الرئيسية
    accent: '#F59E0B',        // لون التمييز: الإجراءات الهامة، زر إضافة طالب، التنبيهات
    pageBackground: '#F8FAFC',// خلفية الصفحة
    cardBackground: '#FFFFFF',// خلفية البطاقات
    border: '#E2E8F0',        // الحدود والفواصل
    textPrimary: '#1F2937',   // النص الأساسي
    textSecondary: '#64748B', // النص الثانوي
    
    // ألوان الحالات (Status Colors فقط)
    status: {
      success: '#16A34A',     // حاضر / نجاح / مدفوع بالكامل
      error: '#DC2626',       // غائب / رسوب / متأخر جداً
      warning: '#EAB308',     // متأخر / تنبيه / مستحق قريباً
      info: '#0EA5E9',        // بعذر / معلومة / جاري المعالجة
    }
  },
  typography: {
    fontFamily: "'Cairo', sans-serif",
    displayFont: "'Alexandria', 'Cairo', sans-serif",
  },
  currency: {
    code: 'IQD',
    symbol: 'د.ع',
    name: 'دينار عراقي'
  }
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
