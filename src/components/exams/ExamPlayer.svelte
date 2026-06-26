<script lang="ts">
  import { appState, setQuizAnswers, handleSubmitExam } from '../../lib/store.svelte';
  import { Shield, Send } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  type Props = { active?: boolean };
  let { active = false }: Props = $props();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const timerWidthClass = $derived(appState.examTimer / 600 >= 1 ? 'w-full' : appState.examTimer / 600 >= 0.75 ? 'w-3/4' : appState.examTimer / 600 >= 0.5 ? 'w-1/2' : appState.examTimer / 600 >= 0.25 ? 'w-1/4' : 'w-0');
</script>

{#if active && appState.currentExamQuestions.length > 0}
  <div transition:fade={{ duration: 300 }} class="frosted-glass-dark rounded-3xl p-6 sm:p-8 border border-red-900/50 space-y-6">
    <div class="flex justify-between items-center border-b border-red-900/50 pb-4">
      <h3 class="font-extrabold text-white text-lg uppercase flex items-center gap-2">
        <Shield class="w-5 h-5 text-red-400 animate-pulse" /> Proctored Assessment
      </h3>
      <span class="px-3 py-1 rounded bg-red-950 border border-red-500/30 text-red-300 text-xs font-mono">
        {formatTime(appState.examTimer)}
      </span>
    </div>

    {#if appState.isExamProctoring}
      <div class="bg-slate-950 rounded-xl p-3 space-y-2">
        <div class="flex items-center gap-3">
          <div class="w-20 h-14 rounded-lg bg-black border border-blue-900 object-cover overflow-hidden">
            <video
              autoplay
              muted
              playsinline
              class="w-full h-full object-cover"
              srcObject={appState.streamRef ?? undefined}
            ></video>
          </div>
          <div class="text-[10px] font-mono text-slate-400 space-y-0.5 flex-1">
            {#each appState.proctorLogs.slice(-3) as log}
              <p class={log.includes('WARNING') ? 'text-amber-400' : 'text-emerald-400'}>{log}</p>
            {/each}
          </div>
        </div>
        <div class="w-full bg-slate-900 h-1 rounded overflow-hidden">
          <div class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full transition-all duration-1000 {timerWidthClass}"></div>
        </div>
      </div>
    {/if}

    <div class="space-y-6">
      {#each appState.currentExamQuestions as q, qIdx}
        <div transition:fly={{ y: 20, duration: 300 }} class="space-y-3">
          <h4 class="text-sm font-bold text-white">{qIdx + 1}. {q.text}</h4>
          <div class="space-y-2">
            {#each q.options as opt, oIdx}
              <button
                onclick={() => { const copy = [...appState.quizAnswers]; copy[qIdx] = oIdx; setQuizAnswers(copy); }}
                class="w-full text-left p-3 rounded-xl border text-xs transition {appState.quizAnswers[qIdx] === oIdx ? 'bg-red-600 border-red-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}">{opt}</button>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <button
      onclick={() => handleSubmitExam(appState.quizAnswers)}
      disabled={appState.quizAnswers.length < appState.currentExamQuestions.length || appState.quizAnswers.some(a => a === undefined)}
      class="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 {appState.quizAnswers.length < appState.currentExamQuestions.length || appState.quizAnswers.some(a => a === undefined) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'}">
      <Send class="w-4 h-4" /> Submit Exam
    </button>
  </div>
{:else if active && appState.currentExamQuestions.length === 0 && !appState.isExamProctoring}
  <div class="text-center py-12 text-xs text-slate-500">
    <p>No active exam. Select an assessment from Academy to begin.</p>
  </div>
{/if}
