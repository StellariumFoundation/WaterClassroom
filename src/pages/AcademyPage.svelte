<script lang="ts">
  import { appState, startVerifiedProctorExam, stopVerifiedProctorExam, handleQuizSubmit, setSelectedCurriculum, setSelectedLesson, setActiveQuiz, setQuizAnswers, setShowQuizResult, setActiveGame, setIsCurriculumLoading, setCurriculumError, loadCurriculumForStudent, loadLessonComponent } from '../lib/store.svelte';
  import { QUIZZES } from '../lib/lessonsData';
  import { CheckCircle, ChevronRight, Video, BookOpen, Shield, Check, Send, RefreshCw, X } from 'lucide-svelte';
  import TrinityGame from '../components/games/TrinityGame.svelte';
  import RoboticsGame from '../components/games/RoboticsGame.svelte';
  import IncentiveGame from '../components/games/IncentiveGame.svelte';
  import LessonComponentRenderer from '../components/lessons/LessonComponentRenderer.svelte';
  import { fly, fade, slide } from 'svelte/transition';

  let videoEl: HTMLVideoElement | null = $state(null);
  let selectedSubject: string | null = $state(null);

  $effect(() => {
    (appState as any).videoRef = videoEl;
  });

  $effect(() => {
    if (appState.isOnboarded && appState.currentTrackId === "" && appState.trackLessons.length === 0) {
      loadCurriculumForStudent();
    }
  });

  const formatExamTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const effectiveLessons = $derived(appState.trackLessons.length > 0 ? appState.trackLessons : appState.filteredLessons.map(l => ({
    id: l.id,
    title: l.title,
    lesson_type: "content",
    estimated_minutes: l.durationMin,
    subject: l.curriculum,
    grade_level: "",
    content_ref: l.id
  })));

  // Extract unique subjects from lessons
  const availableSubjects = $derived(Array.from(new Set(effectiveLessons.map(l => l.subject || 'General'))).filter(Boolean));

  // Recently played lessons (last 5 completed)
  const recentlyPlayedLessons = $derived(
    appState.trackLessons
      .filter(l => appState.progress.completedLessons.includes(l.id))
      .slice(0, 5)
  );

  // Filtered lessons by selected subject
  const filteredLessons = $derived(
    selectedSubject 
      ? effectiveLessons.filter(l => l.subject === selectedSubject)
      : effectiveLessons
  );

  // Subject progress calculation
  const subjectProgress = $derived(
    availableSubjects.reduce((acc, subject) => {
      const subjectLessons = effectiveLessons.filter(l => l.subject === subject);
      const completedCount = subjectLessons.filter(l => appState.progress.completedLessons.includes(l.id)).length;
      acc[subject] = {
        total: subjectLessons.length,
        completed: completedCount,
        percentage: subjectLessons.length > 0 ? Math.round((completedCount / subjectLessons.length) * 100) : 0
      };
      return acc;
    }, {} as Record<string, { total: number; completed: number; percentage: number }>)
  );

  // Find next incomplete lesson for "Continue" button
  const nextIncompleteLesson = $derived(
    selectedSubject
      ? filteredLessons.find(l => !appState.progress.completedLessons.includes(l.id))
      : null
  );

  const examTimerWidthClass = $derived(appState.examTimer / 600 >= 1 ? 'w-full' : appState.examTimer / 600 >= 0.75 ? 'w-3/4' : appState.examTimer / 600 >= 0.5 ? 'w-1/2' : appState.examTimer / 600 >= 0.25 ? 'w-1/4' : 'w-0');
</script>

<div class="animate-fade-in">
  <!-- Left: Recents + Subject Grid / Lessons List -->
  <div class="lg:col-span-1 space-y-6">
    <!-- Recently Played Section -->
    {#if recentlyPlayedLessons.length > 0 && !selectedSubject}
      <div class="space-y-4">
        <span class="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-bold px-1">Recently Played</span>
        <div class="flex gap-4 overflow-x-auto pb-2 scroll-smooth">
          {#each recentlyPlayedLessons as recent}
            <button transition:fly={{ y: 20, duration: 300 }} onclick={() => { setSelectedLesson(recent as any); setActiveQuiz(null); setActiveGame(null); loadLessonComponent(recent.id); }}
              class="flex-shrink-0 w-64 frosted-glass-dark rounded-2xl p-4 border border-blue-900/50 hover:border-blue-600 transition snap-start">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                  <BookOpen class="w-6 h-6 text-white" />
                </div>
                <div class="space-y-1 flex-1 text-left">
                  <h4 class="font-bold text-white text-sm line-clamp-2">{recent.title}</h4>
                  <div class="flex items-center gap-2">
                    <span class="text-[9px] uppercase font-mono tracking-widest bg-blue-950 text-blue-400 px-1 py-0.5 rounded">{recent.subject}</span>
                    <CheckCircle class="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Subject Grid View -->
    {#if !selectedSubject}
      <div class="space-y-3">
        <span class="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-bold px-1">Subjects</span>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
          {#each availableSubjects as subject}
            {@const progress = subjectProgress[subject]}
            <button transition:fly={{ y: 20, duration: 300, delay: availableSubjects.indexOf(subject) * 50 }} onclick={() => { selectedSubject = subject; setSelectedLesson(null); }}
              class="frosted-glass-dark rounded-2xl p-5 border border-blue-900/50 hover:border-blue-600 transition flex flex-col items-center text-center space-y-3">
              {#if progress && progress.percentage === 100}
                <div class="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
                  <CheckCircle class="w-6 h-6 text-white" />
                </div>
              {:else}
                <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <BookOpen class="w-6 h-6 text-white" />
                </div>
              {/if}
              <h3 class="font-bold text-white text-sm">{subject}</h3>
              {#if progress}
                <div class="w-full space-y-1">
                  <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-500" style="width: {progress.percentage}%"></div>
                  </div>
                  <p class="text-[10px] text-slate-400 font-mono">{progress.completed}/{progress.total} lessons</p>
                </div>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Subject Lessons List -->
      <div class="space-y-3" transition:fade={{ duration: 200 }}>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-bold">Subject: {selectedSubject}</span>
            {#if nextIncompleteLesson}
              <button onclick={() => { setSelectedLesson(nextIncompleteLesson as any); setActiveQuiz(null); setActiveGame(null); loadLessonComponent(nextIncompleteLesson.id); }}
                class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition">
                <span>Continue</span> <ChevronRight class="w-3 h-3" />
              </button>
            {/if}
          </div>
          <button onclick={() => { selectedSubject = null; setSelectedLesson(null); }}
            class="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition">
            <X class="w-3 h-3" /> Back
          </button>
        </div>
        <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {#each filteredLessons as les (les.id)}
            {@const isCompleted = appState.progress.completedLessons.includes(les.id)}
            <button transition:fly={{ x: -20, duration: 300 }} onclick={() => { setSelectedLesson(les as any); setActiveQuiz(null); setActiveGame(null); loadLessonComponent(les.id); }}
              class="w-full text-left p-3 rounded-xl transition border text-xs flex items-start justify-between gap-2 {isCompleted ? 'bg-slate-900/40 border-slate-800 opacity-60' : 'bg-slate-950/60 hover:bg-[#09152b]/55 border-blue-900/50'}">
              <div class="space-y-1 flex-1">
                <h4 class="font-bold {isCompleted ? 'text-slate-400 line-through' : 'text-white'}">{les.title}</h4>
                <p class="text-[10px] text-slate-400">{les.lesson_type} • {(les.estimated_minutes ?? 0)} min</p>
              </div>
              {#if isCompleted}
                <CheckCircle class="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              {:else}
                <span class="px-2 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold uppercase shrink-0">Start</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <!-- Right: Lesson Content / Quiz / Games -->
  <div class="lg:col-span-2 space-y-6 lg:pl-4">
    {#if !appState.selectedLesson && !appState.activeQuiz && !appState.activeGame}
      <div class="frosted-glass rounded-3xl p-12 text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-blue-950 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto animate-bounce">
          <BookOpen class="w-8 h-8" />
        </div>
        <div class="space-y-1">
          <h3 class="font-extrabold text-xl text-white uppercase tracking-wider">No Lecture Selected</h3>
          <p class="text-slate-400 text-xs max-w-sm mx-auto">Choose a curriculum track and lesson to get started.</p>
        </div>
      </div>
    {/if}

    {#if appState.selectedLesson && !appState.activeQuiz && !appState.activeGame}
      {@const lesson = appState.selectedLesson}
      <div class="frosted-glass-dark rounded-3xl p-6 sm:p-8 border border-blue-950 overflow-hidden relative space-y-6">
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600"></div>
        <div class="flex justify-between items-start flex-wrap gap-4 border-b border-blue-950 pb-5">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold text-blue-400 bg-blue-950 border border-blue-900/40 px-2 py-0.5 rounded">Track: {lesson.curriculum?.toUpperCase?.() ?? ''}</span>
              <span class="text-xs text-slate-400 font-light">• {(lesson.durationMin ?? 0)} Min lecture</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">{lesson.title}</h2>
          </div>
          <div class="flex gap-2">
            <button onclick={() => {
              const targetQuiz = QUIZZES.find(q => q.lessonId === lesson.id);
              if (targetQuiz) { setActiveQuiz(targetQuiz); setQuizAnswers(new Array(targetQuiz.questions.length).fill(-1)); setShowQuizResult(false); startVerifiedProctorExam(); }
            }} class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-1.5">
              <Video class="w-4 h-4 animate-pulse text-red-400" /> Start Proctored Exam
            </button>
          </div>
        </div>
        <div class="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-light">
          {lesson.content}
        </div>
        <div class="flex flex-wrap gap-3 pt-4 border-t border-blue-950">
          <button onclick={() => setActiveQuiz(QUIZZES.find(q => q.lessonId === lesson.id) || null)}
            class="px-4 py-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold transition">Take Quiz</button>
          <button onclick={() => setActiveGame("trinity")}
            class="px-4 py-2 rounded-lg bg-cyan-800/50 hover:bg-cyan-700 text-cyan-200 text-xs font-bold border border-cyan-700/50 transition">Trinity Game</button>
          <button onclick={() => setActiveGame("robotics")}
            class="px-4 py-2 rounded-lg bg-indigo-800/50 hover:bg-indigo-700 text-indigo-200 text-xs font-bold border border-indigo-700/50 transition">Robotics Calibration</button>
          <button onclick={() => setActiveGame("incentive")}
            class="px-4 py-2 rounded-lg bg-emerald-800/50 hover:bg-emerald-700 text-emerald-200 text-xs font-bold border border-emerald-700/50 transition">Incentive Equation</button>
        </div>
      </div>
    {/if}

    {#if appState.selectedLesson && appState.currentLessonComponent && !appState.activeQuiz && !appState.activeGame}
      <LessonComponentRenderer />
    {/if}

    <!-- Quiz -->
    {#if appState.activeQuiz && !appState.showQuizResult}
      <div transition:fade={{ duration: 300 }} class="frosted-glass-dark rounded-3xl p-6 sm:p-8 border border-blue-950 space-y-6">
        <div class="flex justify-between items-center border-b border-blue-950 pb-4">
          <h3 class="font-extrabold text-white text-lg uppercase">{appState.activeQuiz.title}</h3>
          {#if appState.isExamProctoring}
            <span class="px-3 py-1 rounded bg-red-950 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-1.5">
              <Shield class="w-3.5 h-3.5" /> Proctored: {formatExamTime(appState.examTimer)}
            </span>
          {/if}
        </div>
        {#if appState.isExamProctoring}
          <div class="bg-slate-950 rounded-xl p-3 space-y-2">
            <div class="flex items-center gap-3">
              <video bind:this={videoEl} autoplay muted playsinline class="w-20 h-16 rounded-lg bg-black border border-blue-900 object-cover"></video>
              <div class="text-[10px] font-mono text-slate-400 space-y-0.5 flex-1">
                {#each appState.proctorLogs.slice(-3) as log, i}
                  <p class={log.includes("WARNING") ? "text-amber-400" : "text-emerald-400"}>{log}</p>
                {/each}
              </div>
            </div>
            <div class="w-full bg-slate-900 h-1 rounded overflow-hidden">
              <div class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full transition-all duration-1000 {examTimerWidthClass}"></div>
            </div>
          </div>
        {/if}
        <div class="space-y-6">
          {#each appState.activeQuiz.questions as q, qIdx}
            <div class="space-y-3">
              <h4 class="text-sm font-bold text-white">{qIdx + 1}. {q.question}</h4>
              <div class="space-y-2">
                {#each q.options as opt, oIdx}
                  <button onclick={() => {
                    const copy = [...appState.quizAnswers]; copy[qIdx] = oIdx; setQuizAnswers(copy);
                  }} class="w-full text-left p-3 rounded-xl border text-xs transition {appState.quizAnswers[qIdx] === oIdx ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}">{opt}</button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
        <button onclick={handleQuizSubmit} disabled={appState.quizAnswers.includes(-1)}
          class="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition {appState.quizAnswers.includes(-1) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}">Submit & Verify Answers</button>
      </div>
    {/if}

    <!-- Quiz Result -->
    {#if appState.showQuizResult && appState.activeQuiz}
      <div transition:fade={{ duration: 300 }} class="frosted-glass-dark rounded-3xl p-8 border border-blue-500 text-center space-y-4 animate-fade-in">
        <h3 class="text-2xl font-extrabold text-white uppercase">Quiz Complete</h3>
        <div class="text-6xl font-extrabold text-blue-400 font-mono">{appState.quizScore}/{appState.activeQuiz.questions.length}</div>
        <p class="text-slate-400 text-sm">{appState.quizScore === appState.activeQuiz.questions.length ? "Perfect score! Badge unlocked!" : "Keep studying and try again!"}</p>
        <button onclick={() => setActiveQuiz(null)} class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition">Back to Lessons</button>
      </div>
    {/if}

    <!-- Games -->
    {#if appState.activeGame === "trinity" && !appState.activeQuiz}
      <div transition:fade={{ duration: 300 }}><TrinityGame onClose={() => setActiveGame(null)} /></div>
    {/if}
    {#if appState.activeGame === "robotics" && !appState.activeQuiz}
      <div transition:fade={{ duration: 300 }}><RoboticsGame onClose={() => setActiveGame(null)} /></div>
    {/if}
    {#if appState.activeGame === "incentive" && !appState.activeQuiz}
      <div transition:fade={{ duration: 300 }}><IncentiveGame onClose={() => setActiveGame(null)} /></div>
    {/if}

    <!-- Proctor Exam Button (when no quiz active) -->
    {#if appState.isExamProctoring && !appState.activeQuiz}
      <div class="frosted-glass rounded-2xl p-6 border border-red-900 text-center space-y-4">
        <Shield class="w-10 h-10 text-red-400 mx-auto animate-pulse" />
        <h3 class="font-bold text-white">Proctoring Active</h3>
        <p class="text-xs text-slate-400">Time remaining: {formatExamTime(appState.examTimer)}</p>
        <button onclick={() => stopVerifiedProctorExam(0, 0)} class="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs">Stop Proctoring</button>
      </div>
    {/if}
  </div>
</div>

{#if appState.isOnboarded && appState.currentTrackId && appState.isCurriculumLoading}
  <div class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 flex items-center justify-center">
    <div class="frosted-glass-dark p-8 rounded-3xl space-y-4 text-center">
      <RefreshCw class="w-10 h-10 text-blue-400 animate-spin mx-auto" />
      <p class="text-sm text-white font-bold">Loading your personalized curriculum...</p>
    </div>
  </div>
{/if}

{#if appState.isOnboarded && appState.curriculumError}
  <div class="fixed bottom-20 left-4 right-4 z-50 frosted-glass-dark border border-red-500/40 p-4 rounded-2xl flex items-start gap-3">
    <Shield class="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
    <div>
      <p class="text-xs text-red-300 font-bold">Curriculum load failed</p>
      <p class="text-[11px] text-slate-400">{appState.curriculumError}</p>
      <button onclick={() => { setCurriculumError(''); loadCurriculumForStudent(); }} class="mt-2 px-3 py-1.5 rounded-lg bg-red-900/40 text-red-300 text-[10px] font-bold uppercase tracking-wider">Retry</button>
    </div>
  </div>
{/if}