<script lang="ts">
  import { appState } from '../lib/store.svelte';
  import { Award, Flame, CheckCircle, Shield, Sparkles, Cpu, Building, Compass, Lock, Check } from 'lucide-svelte';
  import { BADGES } from '../lib/lessonsData';
  import { fade, scale, slide } from 'svelte/transition';
  import StreakCounter from '../components/gamification/StreakCounter.svelte';
  import BadgeDisplay from '../components/gamification/BadgeDisplay.svelte';
  import ProgressBar from '../components/gamification/ProgressBar.svelte';

  const badgeIconMap: Record<string, any> = {
    Sparkles, Cpu, Building, Compass,
  };

  const xpProgress = $derived(Math.min(100, (appState.progress.points / (Math.pow(appState.progress.level, 2) * 100 + 300)) * 100));
  const xpWidthClass = $derived(xpProgress >= 100 ? 'w-full' : xpProgress >= 75 ? 'w-3/4' : xpProgress >= 50 ? 'w-1/2' : xpProgress >= 25 ? 'w-1/4' : 'w-0');

  const earnedBadges = $derived((appState.progress.unlockedBadges || []).map(key => {
    const def = BADGES.find(b => b.key === key);
    return def ? { key: def.key, name: def.name, icon: def.icon, color: def.color || 'bg-blue-900/40 text-blue-300' } : null;
  }).filter(Boolean) as Array<{ key: string; name: string; icon: string; color: string }>);

  const widthClass = (value: string | number) => {
    const pct = typeof value === 'string' ? Number.parseFloat(value) : value;
    return pct >= 100 ? 'h-full' : pct >= 80 ? 'h-4/5' : pct >= 66 ? 'h-2/3' : pct >= 50 ? 'h-1/2' : pct >= 33 ? 'h-1/3' : pct > 0 ? 'h-1/4' : 'h-0';
  };
</script>

<div transition:fade={{ duration: 300 }} class="space-y-8 animate-fade-in text-white">
    <!-- Level Rank Card -->
    <div class="frosted-glass rounded-3xl p-6 sm:p-8 border border-blue-950 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
      <div class="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
      <div class="space-y-4 w-full sm:w-1/2">
        <div>
          <span class="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold block">Student Profile Register</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none uppercase">Active Sovereign Student</h2>
          <span class="text-[10px] text-slate-400 block mt-1 tracking-wide">CURRICULUM: {appState.onboardingCurriculum}</span>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>XP Tracker to Level {appState.progress.level + 1}</span>
            <span>{appState.progress.points} / {Math.pow(appState.progress.level, 2) * 100 + 300} XP</span>
          </div>
          <div class="w-full bg-[#050b18] h-2.5 rounded-full overflow-hidden border border-blue-950/80">
            <div class="blue-gradient-bg h-full transition-all duration-500 shadow-[0_0_8px_#3b82f6] {xpWidthClass}"></div>
          </div>
        </div>
      </div>
      <div class="flex gap-4 sm:gap-6 w-full sm:w-auto shrink-0 justify-around sm:justify-start">
        <div transition:scale={{ duration: 300 }} class="text-center bg-slate-950 p-4 rounded-2xl border border-blue-900/30 min-w-24 sm:min-w-28 shadow-inner">
          <Award class="w-5 h-5 text-blue-400 mx-auto mb-1.5 animate-bounce" />
          <strong class="text-xl sm:text-2xl font-extrabold block text-white">{appState.progress.level}</strong>
          <span class="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Class Rank</span>
        </div>
        <StreakCounter days={appState.progress.streakDays} />
        <div transition:scale={{ duration: 300 }} class="text-center bg-slate-950 p-4 rounded-2xl border border-blue-900/30 min-w-24 sm:min-w-28 shadow-inner">
          <CheckCircle class="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
          <strong class="text-xl sm:text-2xl font-extrabold block text-white">{appState.progress.completedLessons.length}</strong>
          <span class="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Passed Tests</span>
        </div>
      </div>
    </div>

    <!-- Subject Progress -->
    <div class="frosted-glass rounded-3xl p-6 border border-blue-950 space-y-4">
      <h3 class="text-sm font-bold text-white uppercase tracking-wide">Subject Mastery</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each Object.entries(appState.subjectProgress || {}) as [subject, pct] (subject)}
          <ProgressBar {subject} percent={pct} />
        {/each}
        {#if Object.keys(appState.subjectProgress || {}).length === 0}
          <div class="col-span-full text-center py-6 text-xs text-slate-600 italic">Complete lessons to see subject progress.</div>
        {/if}
      </div>
    </div>

    <!-- Certificates & Study Hours -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="frosted-glass rounded-3xl p-6 border border-blue-950 space-y-6">
        <div>
          <h3 class="text-lg font-bold text-white uppercase tracking-wide">VERIFIED PROCTOR CERTIFICATES</h3>
          <p class="text-xs text-slate-400">Verified proctored exam transcripts recorded onto the Water Classroom registry.</p>
        </div>
        <div class="space-y-3 max-h-64 overflow-y-auto pr-1">
          {#if appState.verifiedExamsList.length > 0}
            {#each appState.verifiedExamsList as c (c.id)}
              <div class="p-3.5 bg-slate-950/80 border border-blue-900/40 rounded-xl space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <strong class="text-blue-300 font-bold">{c.lessonTitle}</strong>
                  <span class="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950 px-2 rounded border border-emerald-900">Passed ({c.score})</span>
                </div>
                <div class="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Verification Hash: <strong class="text-white select-all">{c.hash}</strong></span>
                  <span>{c.timestamp}</span>
                </div>
              </div>
            {/each}
          {:else}
            <div class="text-center py-6 text-xs text-slate-500 italic space-y-2">
              <Shield class="w-8 h-8 text-blue-900 mx-auto opacity-70" />
              <p>No verified exams completed yet.</p>
            </div>
          {/if}
        </div>
      </div>

      <div class="frosted-glass rounded-3xl p-6 border border-blue-950 space-y-6">
        <div>
          <h3 class="text-lg font-bold text-white tracking-tight uppercase">Core Study Hours Tracking</h3>
          <p class="text-xs text-slate-400">Classroom analytics synced with local device sensors.</p>
        </div>
        <div class="h-44 flex items-end justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-blue-950">
          {#each [{ day: "Mon", hrs: 2.5, percent: "45%" }, { day: "Tue", hrs: 4.8, percent: "80%" }, { day: "Wed", hrs: 3.2, percent: "60%" }, { day: "Thu", hrs: 5.6, percent: "95%" }, { day: "Fri", hrs: 2.1, percent: "35%" }, { day: "Sat", hrs: 1.2, percent: "25%" }, { day: "Sun", hrs: 3.9, percent: "70%" }] as bar, idx (idx)}
            <div class="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative">
              <div class="bg-slate-900 text-white text-[9px] font-mono px-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 absolute -translate-y-12 shadow-lg border border-slate-700 z-10 pointer-events-none">{bar.hrs} hrs</div>
              <div class="w-full blue-gradient-bg rounded-t-lg transition-all duration-700 relative overflow-hidden shadow-[0_0_8px_rgba(59,130,246,0.3)] {widthClass(bar.percent)}">
                <div class="absolute inset-0 bg-white/5 animate-pulse"></div>
              </div>
              <span class="text-[10.5px] font-bold text-slate-400 font-mono block">{bar.day}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Badges -->
    <div class="frosted-glass rounded-3xl p-6 border border-blue-950 space-y-6">
      <div>
        <h3 class="text-lg font-bold text-white uppercase">Sovereign Badge Collection</h3>
        <p class="text-xs text-slate-400">Demonstrate conceptual mastery across curricula to activate permanent badges.</p>
      </div>
      <BadgeDisplay badges={earnedBadges} />
    </div>
  </div>
