import { lazy, Suspense } from "react";
import { AppProvider, useApp } from "./contexts/AppContext";
import Header from "./components/layout/Header";
import OnboardingDialog from "./components/layout/OnboardingDialog";
import DonateModal from "./components/modals/DonateModal";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import SchoolDashboardPage from "./pages/SchoolDashboardPage";
import { BookOpen, Cpu, ClipboardList, MessageSquare, LayoutDashboard, Building } from "lucide-react";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AcademyPage = lazy(() => import("./pages/AcademyPage"));
const AITutorPage = lazy(() => import("./pages/AITutorPage"));
const TasksPage = lazy(() => import("./pages/TasksPage"));
const ForumsPage = lazy(() => import("./pages/ForumsPage"));

function AppContent() {
  const { activeTab, setActiveTab, isLoggedIn, landingAuthRole } = useApp();

  const isInstitution = landingAuthRole === "institution";

  const navTabs = isInstitution
    ? [
        { key: "dashboard", label: "School", icon: Building },
        { key: "academy", label: "Academy", icon: BookOpen },
        { key: "tutor", label: "AI Tutor", icon: Cpu },
        { key: "tasks", label: "Tasks", icon: ClipboardList },
        { key: "collaborate", label: "Forums", icon: MessageSquare },
      ]
    : [
        { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { key: "academy", label: "Academy", icon: BookOpen },
        { key: "tutor", label: "AI Tutor", icon: Cpu },
        { key: "tasks", label: "Tasks", icon: ClipboardList },
        { key: "collaborate", label: "Forums", icon: MessageSquare },
      ];

  return (
    <div className="min-h-screen bg-[#030712] deep-space-bg flex flex-col pb-24 md:pb-6 text-slate-100 antialiased font-sans transition-all duration-500">
      <Header />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!isLoggedIn ? (
          <LandingPage />
        ) : (
          <>
            <OnboardingDialog />
            <DonateModal />
            <Suspense fallback={
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <ErrorBoundary>
                {activeTab === "dashboard" && (isInstitution ? <SchoolDashboardPage /> : <DashboardPage />)}
                {activeTab === "academy" && <AcademyPage />}
                {activeTab === "tutor" && <AITutorPage />}
                {activeTab === "tasks" && <TasksPage />}
                {activeTab === "collaborate" && <ForumsPage />}
              </ErrorBoundary>
            </Suspense>
          </>
        )}
      </main>

      {/* Bottom Navigation (mobile) */}
      {isLoggedIn && (
        <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#060b18]/95 backdrop-blur-lg border-t border-blue-950/60 safe-area-bottom">
          <div className="flex justify-around items-center py-2 px-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-blue-400 scale-105"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
                  {isActive && <span className="w-4 h-0.5 bg-blue-500 rounded-full mt-0.5" />}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
