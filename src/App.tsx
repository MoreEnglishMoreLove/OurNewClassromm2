import React, { useState, useEffect } from 'react';
import { LockScreen } from './components/LockScreen';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DialogueSection } from './components/sections/DialogueSection';
import { VocabularySection } from './components/sections/VocabularySection';
import { GrammarSection } from './components/sections/GrammarSection';
import { ListeningSection } from './components/sections/ListeningSection';
import { GamesSection } from './components/sections/GamesSection';
import { QuizSection } from './components/sections/QuizSection';
import { WorksheetsSection } from './components/sections/WorksheetsSection';
import { getActiveSession, logoutStudent } from './utils/cryptoAuth';

export default function App() {
  const [session, setSession] = useState(getActiveSession());
  const [isTeacherPortalOpen, setIsTeacherPortalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dialogue');

  // Pre-filled fields for testing from teacher dashboard
  const [prefilledName, setPrefilledName] = useState<string>('');
  const [prefilledCode, setPrefilledCode] = useState<string>('');

  // Update countdown ticker periodically
  useEffect(() => {
    const update = () => {
      const current = getActiveSession();
      setSession(current);
    };

    update();
    const interval = setInterval(update, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleActivationSuccess = (studentName: string) => {
    const current = getActiveSession();
    setSession(current);
  };

  const handleLogout = () => {
    logoutStudent();
    setSession(getActiveSession());
  };

  const handleStudentCodeSelectedFromTeacher = (name: string, code: string) => {
    setPrefilledName(name);
    setPrefilledCode(code);
  };

  // If not authenticated or expired, show Lock Screen
  if (!session.isValid || session.isExpired || !session.activation) {
    return (
      <>
        <LockScreen
          onSuccessActivation={handleActivationSuccess}
          onOpenTeacherPortal={() => setIsTeacherPortalOpen(true)}
          initialStudentName={prefilledName}
          initialCode={prefilledCode}
        />
        <TeacherDashboardModal
          isOpen={isTeacherPortalOpen}
          onClose={() => setIsTeacherPortalOpen(false)}
          onStudentCodeSelected={handleStudentCodeSelectedFromTeacher}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-900">
      {/* Top Sticky Header */}
      <Navbar
        studentName={session.activation.studentName}
        daysRemaining={session.daysRemaining}
        hoursRemaining={session.hoursRemaining}
        minutesRemaining={session.minutesRemaining}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTeacherPortal={() => setIsTeacherPortalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {activeTab === 'dialogue' && <DialogueSection />}
        {activeTab === 'vocabulary' && <VocabularySection />}
        {activeTab === 'grammar' && <GrammarSection />}
        {activeTab === 'listening' && <ListeningSection />}
        {activeTab === 'games' && <GamesSection />}
        {activeTab === 'quiz' && <QuizSection studentName={session.activation.studentName} />}
        {activeTab === 'worksheets' && <WorksheetsSection />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Teacher Dashboard Modal (Accessible from anywhere) */}
      <TeacherDashboardModal
        isOpen={isTeacherPortalOpen}
        onClose={() => setIsTeacherPortalOpen(false)}
        onStudentCodeSelected={handleStudentCodeSelectedFromTeacher}
      />
    </div>
  );
}
