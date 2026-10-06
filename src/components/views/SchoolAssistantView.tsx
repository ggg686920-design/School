/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * School Assistant (مساعد المدرسة):
 * مركز أوامر برمجية واستعلامات إحصائية لقاعدة بيانات المدرسة
 * نظام برمجيات دقيق ومباشر (Command Registry) بدون أي استخدام للذكاء الاصطناعي
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Terminal,
  Search,
  Star,
  Play,
  RotateCcw,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  Users,
  GraduationCap,
  Briefcase,
  School,
  BookOpen,
  CheckSquare,
  Award,
  CreditCard,
  DollarSign,
  Bus,
  FileText,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  SCHOOL_COMMANDS,
  COMMAND_CATEGORIES,
  CommandDefinition,
  CommandCategory
} from '../../services/SchoolCommandRegistry';
import { SchoolCommandResult } from '../../types';

export const SchoolAssistantView: React.FC = () => {
  const { db, currentRole } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState<CommandCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommand, setSelectedCommand] = useState<CommandDefinition>(SCHOOL_COMMANDS[0]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('noor_assistant_favorites');
      return saved ? JSON.parse(saved) : ['cmd-students-inventory', 'cmd-attendance-today'];
    } catch {
      return [];
    }
  });
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeResult, setActiveResult] = useState<SchoolCommandResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters inside result table
  const [tableSearch, setTableSearch] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Save favorites to storage
  const toggleFavorite = (cmdId: string) => {
    setFavorites(prev => {
      const next = prev.includes(cmdId) ? prev.filter(id => id !== cmdId) : [...prev, cmdId];
      localStorage.setItem('noor_assistant_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Filter commands by category, role access, and search
  const visibleCommands = useMemo(() => {
    const isManager = currentRole === 'SCHOOL_MANAGER' || currentRole === 'manager';

    return SCHOOL_COMMANDS.filter(cmd => {
      // Hide financial aggregate commands from Manager
      if (isManager && cmd.requiredRole === 'financial_only') return false;

      if (selectedCategory !== 'all' && cmd.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return cmd.name.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategory, searchQuery, currentRole]);

  // Execute Command
  const handleExecute = async (cmd: CommandDefinition) => {
    setIsRunning(true);
    setErrorMessage(null);
    setSelectedCommand(cmd);

    // Track recently used
    setRecentCommandIds(prev => [cmd.id, ...prev.filter(id => id !== cmd.id)].slice(0, 5));

    try {
      const res = await cmd.execute(db, currentRole);
      setActiveResult(res);
      setTableSearch('');
      setSortCol(null);
    } catch (err) {
      console.error('Command execution error:', err);
      setActiveResult(null);
      setErrorMessage(err instanceof Error ? err.message : 'حدث خطأ أثناء تنفيذ الأمر البرمجي');
    } finally {
      setIsRunning(false);
    }
  };

  // Initial execution of the first command
  useEffect(() => {
    if (visibleCommands.length > 0 && !activeResult) {
      handleExecute(visibleCommands[0]);
    }
  }, []);

  // Filtered and sorted rows for active result
  const processedRows = useMemo(() => {
    if (!activeResult) return [];
    let rows = [...activeResult.rows];

    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      rows = rows.filter(r => 
        Object.values(r).some(val => String(val).toLowerCase().includes(q))
      );
    }

    if (sortCol) {
      rows.sort((a, b) => {
        const valA = a[sortCol] ?? '';
        const valB = b[sortCol] ?? '';
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc 
          ? String(valA).localeCompare(String(valB), 'ar') 
          : String(valB).localeCompare(String(valA), 'ar');
      });
    }

    return rows;
  }, [activeResult, tableSearch, sortCol, sortAsc]);

  // Export to CSV
  const handleExportCSV = () => {
    if (!activeResult || activeResult.rows.length === 0) return;
    const headers = activeResult.columns.map(c => `"${c.label}"`).join(',');
    const rows = activeResult.rows.map(r => 
      activeResult.columns.map(c => `"${(r[c.key] ?? '').toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const csvContent = '\uFEFF' + headers + '\n' + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeResult.title}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'students': return <Users className="w-4 h-4 text-blue-600" />;
      case 'teachers': return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'staff': return <Briefcase className="w-4 h-4 text-amber-600" />;
      case 'classes': return <School className="w-4 h-4 text-indigo-600" />;
      case 'subjects': return <BookOpen className="w-4 h-4 text-sky-600" />;
      case 'attendance': return <CheckSquare className="w-4 h-4 text-teal-600" />;
      case 'grades': return <Award className="w-4 h-4 text-purple-600" />;
      case 'fees': return <CreditCard className="w-4 h-4 text-amber-600" />;
      case 'finance': return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'transport': return <Bus className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5 text-xl font-bold text-slate-900 font-['Alexandria',sans-serif]">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <span>مساعد المدرسة (School Assistant)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            مركز أوامر برمجية وإحصاءات دقيقة مشتقة من قاعدة بيانات المدرسة مباشرة بدون أي تخمين أو ذكاء اصطناعي
          </p>
        </div>

        {/* Global Action Tools */}
        {activeResult && (
          <div className="flex items-center gap-2 no-print self-start sm:self-auto">
            <button
              onClick={() => handleExecute(selectedCommand)}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>تحديث البيانات</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة التقرير</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Command Sidebar & Execution Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Command Directory */}
        <div className="lg:col-span-4 space-y-4 no-print">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أمر أو استعلام إحصائي..."
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Categories Horizontal Scroller */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              الكل ({SCHOOL_COMMANDS.length})
            </button>
            {COMMAND_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Commands List Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs max-h-[620px] flex flex-col">
            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>سجل الأوامر المتاحة ({visibleCommands.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">Command Registry</span>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto flex-1 p-1 space-y-0.5">
              {visibleCommands.map(cmd => {
                const isSelected = selectedCommand?.id === cmd.id;
                const isFav = favorites.includes(cmd.id);

                return (
                  <div
                    key={cmd.id}
                    onClick={() => handleExecute(cmd)}
                    className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {getCategoryIcon(cmd.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {cmd.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(cmd.id);
                          }}
                          className="text-slate-300 hover:text-amber-400 p-0.5"
                          title="حفظ في المفضلة"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                        {cmd.description}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px]">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          {cmd.categoryLabel}
                        </span>
                        {isSelected && (
                          <span className="text-blue-600 font-bold flex items-center gap-0.5">
                            نشط الآن
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {visibleCommands.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  لا توجد أوامر مطابقة لخيارات البحث المحددة
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Execution Output Area */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Command Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold text-blue-600 mb-0.5 flex items-center gap-1">
                <span>الأمر المنفذ حالياً:</span>
                <span className="bg-blue-50 px-2 py-0.5 rounded font-mono text-[10px]">{selectedCommand.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-['Alexandria',sans-serif]">
                {selectedCommand.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedCommand.description}
              </p>
            </div>

            <button
              onClick={() => handleExecute(selectedCommand)}
              disabled={isRunning}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-60 shrink-0 self-start sm:self-auto"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'جاري الاستعلام...' : 'إعادة التنفيذ'}</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Result Output Card */}
          {activeResult && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-5 printable-area">
              {/* Summary Metric Cards */}
              {activeResult.summaryCards && activeResult.summaryCards.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {activeResult.summaryCards.map((card, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] font-semibold text-slate-500 mb-1">{card.label}</div>
                      <div className={`text-lg sm:text-xl font-bold font-['Alexandria',sans-serif] ${card.color || 'text-slate-900'}`}>
                        {card.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Table Controls (Search & Filter inside Results) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 no-print border-t border-slate-100">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={e => setTableSearch(e.target.value)}
                    placeholder="تصفية والبحث في النتائج الحالية..."
                    className="w-full pr-8 pl-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="text-[11px] text-slate-400">
                  عرض {processedRows.length} من أصل {activeResult.rows.length} نتيجة
                </div>
              </div>

              {/* Detailed Data Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      {activeResult.columns.map(col => (
                        <th
                          key={col.key}
                          onClick={() => {
                            if (sortCol === col.key) setSortAsc(!sortAsc);
                            else { setSortCol(col.key); setSortAsc(true); }
                          }}
                          className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>{col.label}</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {processedRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors">
                        {activeResult.columns.map(col => (
                          <td key={col.key} className="px-4 py-3 whitespace-nowrap font-medium">
                            {row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {processedRows.length === 0 && (
                      <tr>
                        <td colSpan={activeResult.columns.length} className="px-4 py-8 text-center text-slate-400">
                          لا توجد سجلات مطابقة في قاعدة البيانات حالياً
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {activeResult.notes && (
                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{activeResult.notes}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
