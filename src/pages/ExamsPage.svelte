<script lang="ts">
  import { appState, handleStartExam, stopVerifiedProctorExam } from '../lib/store.svelte';
  import { Shield, Play, CheckCircle } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import ProctorCamera from '../components/exams/ProctorCamera.svelte';
  import ExamPlayer from '../components/exams/ExamPlayer.svelte';

  const proctoredExams = $derived(
    appState.trackLessons
      .map((l, idx) => ({
        ...l,
        lessonId: l.id,
        examId: `exam-${l.id}`,
        duration: l.estimated_minutes * 60 || 600,
        isProctored: l.lesson_type === 'assessment',
      }))
      .filter(e => e.isProctored)
  );
</script>

<div transition:fade={{ duration: 300 }} class="space-y-6 animate-fade-in text-white">
  <div class="frosted-glass rounded-3xl p-6 border border-red-900/30 space-y-4">
    <h2 class="text-2xl font-extrabold uppercase tracking-tight flex items-center gap-3">
      <Shield class="w-7 h-7 text-red-400" /> Verified Proctored Exams
    </h2>
    <p class="text-xs text-slate-400">AI camera-verified assessments for your course track. You must enable your camera before starting.</p>
  </div>

  {#if appState.isExamProctoring}
    <div class="space-y-4">
      <ProctorCamera active={true} />
      <ExamPlayer active={true} />
      <button onclick={() => stopVerifiedProctorExam(0, 0)} class="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition">Cancel Exam</button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each proctoredExams as exam (exam.id)}
        <div transition:fly={{ y: 20, duration: 300 }} class="frosted-glass-dark rounded-2xl p-5 border border-red-900/50 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[9px] uppercase font-mono font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">Proctored</span>
            <span class="text-[10px] font-mono text-slate-400">{Math.floor(exam.duration / 60)} min</span>
          </div>
          <h4 class="font-extrabold text-white text-sm">{exam.title}</h4>
           <p class="text-[11px] text-slate-400 line-clamp-2">{(exam as any).description || 'Formal assessment for this curriculum track.'}</p>
          <button
            onclick={() => handleStartExam(exam.examId)}
            class="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <Play class="w-3.5 h-3.5" /> Start Verified Exam
          </button>
        </div>
      {/each}
      {#if proctoredExams.length === 0}
        <div class="col-span-full text-center py-12 text-xs text-slate-600">
          <Shield class="w-8 h-8 mx-auto mb-2 text-slate-800" />
          <p>No proctored exams available for your current track yet.</p>
        </div>
      {/if}
    </div>

    {#if appState.verifiedExamsList.length > 0}
      <div class="space-y-3">
        <h3 class="text-sm font-bold text-white uppercase tracking-wide">Verified Exam History</h3>
        {#each appState.verifiedExamsList as vExam (vExam.id)}
          <div class="frosted-glass rounded-xl p-4 border border-emerald-900/30 flex items-center justify-between">
            <div>
              <strong class="text-xs text-white block">{vExam.lessonTitle}</strong>
              <span class="text-[10px] text-slate-400 font-mono">{vExam.timestamp}</span>
            </div>
            <div class="text-right">
              <span class="text-sm font-extrabold text-emerald-400 font-mono">{vExam.score}</span>
              <span class="block text-[9px] font-mono text-slate-500">{vExam.hash}</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
