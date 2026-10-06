/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * نظام إدارة المدارس الذكي — Main Application Container
 */

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { SearchModal } from './components/common/SearchModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { StudentsView } from './components/views/StudentsView';
import { TeachersView } from './components/views/TeachersView';
import { TimetableView } from './components/views/TimetableView';
import { AttendanceView } from './components/views/AttendanceView';
import { CertificatesView } from './components/views/CertificatesView';
import { FeesPaymentsView } from './components/views/FeesPaymentsView';
import { ReceiptsView } from './components/views/ReceiptsView';
import { ExpensesView } from './components/views/ExpensesView';
import { PayrollView } from './components/views/PayrollView';
import { TransportView } from './components/views/TransportView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { SettingsView } from './components/views/SettingsView';
import {
  ParentsView,
  ClassesView,
  SubjectsView,
  ExamsGradesView,
  StaffView,
  AnnouncementsView,
  NotificationsView,
  MessagesView,
  ReportsView,
  AuditLogView
} from './components/views/AdditionalViews';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedStudentId } = useSchool();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickAddStudent, setQuickAddStudent] = useState(false);

  const handleEntitySelect = (type: string, id: string) => {
    if (type === 'students') {
      setSelectedStudentId(id);
      setActiveTab('students');
    } else if (type === 'teachers') {
      setActiveTab('teachers');
    } else if (type === 'receipts') {
      setActiveTab('receipts');
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onQuickAddStudent={() => {
              setActiveTab('students');
              setQuickAddStudent(true);
            }}
            onQuickRecordPayment={() => setActiveTab('fees')}
          />
        );
      case 'students':
        return <StudentsView initialOpenAdd={quickAddStudent} />;
      case 'parents':
        return <ParentsView />;
      case 'teachers':
        return <TeachersView />;
      case 'staff':
        return <StaffView />;
      case 'classes':
        return <ClassesView />;
      case 'subjects':
        return <SubjectsView />;
      case 'timetable':
        return <TimetableView />;
      case 'attendance':
        return <AttendanceView />;
      case 'exams':
        return <ExamsGradesView />;
      case 'certificates':
        return <CertificatesView />;
      case 'fees':
        return <FeesPaymentsView />;
      case 'receipts':
        return <ReceiptsView />;
      case 'expenses':
        return <ExpensesView />;
      case 'payroll':
        return <PayrollView />;
      case 'transport':
        return <TransportView />;
      case 'announcements':
        return <AnnouncementsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'messages':
        return <MessagesView />;
      case 'reports':
        return <ReportsView />;
      case 'ai_assistant':
        return <AIAssistantView />;
      case 'audit_log':
        return <AuditLogView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onQuickAddStudent={() => setActiveTab('students')} onQuickRecordPayment={() => setActiveTab('fees')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900" dir="rtl">
      {/* Dynamic Header */}
      <Header
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onQuickAddStudent={() => {
          setActiveTab('students');
          setQuickAddStudent(true);
        }}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex w-full">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectEntity={handleEntitySelect}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SchoolProvider>
        <AppContent />
      </SchoolProvider>
    </AuthProvider>
  );
}
