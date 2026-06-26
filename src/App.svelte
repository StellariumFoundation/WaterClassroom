<script>
  import { appState, navigateTo } from './lib/store.svelte';
  import Header from './components/layout/Header.svelte';
  import OnboardingDialog from './components/layout/OnboardingDialog.svelte';
  import DonateModal from './components/modals/DonateModal.svelte';
  import ErrorBoundary from './components/ErrorBoundary.svelte';
  import LandingPage from './pages/LandingPage.svelte';
  import DashboardPage from './pages/DashboardPage.svelte';
  import SchoolDashboardPage from './school/SchoolDashboardPage.svelte';
  import AcademyPage from './pages/AcademyPage.svelte';
  import AITutorPage from './pages/AITutorPage.svelte';
  import TasksPage from './pages/TasksPage.svelte';
  import ForumsPage from './pages/ForumsPage.svelte';
  import ProfilePage from './pages/ProfilePage.svelte';
  import ExamsPage from './pages/ExamsPage.svelte';
  import { BookOpen, Cpu, ClipboardList, MessageSquare, LayoutDashboard, Building, User, Shield } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';

  const isInstitution = $derived(appState.landingAuthRole === 'institution');

  const navTabs = $derived(isInstitution
    ? [
        { key: 'dashboard', label: 'School', icon: Building },
        { key: 'academy', label: 'Academy', icon: BookOpen },
        { key: 'tutor', label: 'AI Tutor', icon: Cpu },
        { key: 'tasks', label: 'Tasks', icon: ClipboardList },
        { key: 'exams', label: 'Exams', icon: Shield },
        { key: 'collaborate', label: 'Forums', icon: MessageSquare },
      ]
    : [
        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'academy', label: 'Academy', icon: BookOpen },
        { key: 'tutor', label: 'AI Tutor', icon: Cpu },
        { key: 'tasks', label: 'Tasks', icon: ClipboardList },
        { key: 'exams', label: 'Exams', icon: Shield },
        { key: 'collaborate', label: 'Forums', icon: MessageSquare },
      ]);
</script>

<div class="min-h-screen bg-[#030712] deep-space-bg flex flex-col pb-24 md:pb-6 text-slate-100 antialiased font-sans transition-all duration-500">
  <Header />
  <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {#if !appState.isLoggedIn}
      <LandingPage />
    {:else}
      <OnboardingDialog />
      <DonateModal />
      <ErrorBoundary>
        <div transition:fade={{ duration: 200 }} class="animate-fade-in">
            {#if appState.activeTab === 'dashboard'}
              {#if isInstitution}
                <SchoolDashboardPage />
              {:else}
                <DashboardPage />
              {/if}
            {:else if appState.activeTab === 'academy'}
              <AcademyPage />
            {:else if appState.activeTab === 'tutor'}
              <AITutorPage />
            {:else if appState.activeTab === 'tasks'}
              <TasksPage />
            {:else if appState.activeTab === 'exams'}
              <ExamsPage />
            {:else if appState.activeTab === 'collaborate'}
              <ForumsPage />
            {:else if appState.activeTab === 'profile'}
              <ProfilePage />
            {/if}
        </div>
      </ErrorBoundary>
    {/if}
  </main>

  {#if appState.isLoggedIn}
    <nav class="fixed bottom-0 left-0 right-0 z-30 bg-[#060b18]/95 backdrop-blur-lg border-t border-blue-950/60 safe-area-bottom">
      <div class="max-w-2xl mx-auto flex justify-around items-center py-2 px-1">
        {#each navTabs as tab}
          {@const Icon = tab.icon}
          {@const isActive = appState.activeTab === tab.key}
          <button
            onclick={() => navigateTo(tab.key)}
            class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 {isActive ? 'text-blue-400 scale-105' : 'text-slate-500 hover:text-slate-300'}"
          >
            <Icon class="w-5 h-5" />
            <span class="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
            {#if isActive}
              <span transition:scale={{ duration: 120 }} class="w-4 h-0.5 bg-blue-500 rounded-full mt-0.5"></span>
            {/if}
          </button>
        {/each}
      </div>
    </nav>
  {/if}
</div>
