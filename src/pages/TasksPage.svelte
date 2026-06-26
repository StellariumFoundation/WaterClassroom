<script lang="ts">
  import { appState, handleCreateTask, handleJoinTask, setIsCreatingTask, setNewTaskTitle, setNewTaskDesc, setNewTaskCategory, setNewTaskReward } from '../lib/store.svelte';
  import { ClipboardList, Plus, Check } from 'lucide-svelte';
  import { slide, fade } from 'svelte/transition';

  const openTasks = $derived(appState.tasks.filter(t => t.status === "Open"));
  const activeTasks = $derived(appState.tasks.filter(t => t.status === "In Progress"));
  const completedTasks = $derived(appState.tasks.filter(t => t.status === "Completed"));
</script>

<div class="space-y-8 animate-fade-in text-white">
  <!-- Header -->
  <div class="bg-gradient-to-r from-blue-950 to-[#0b2545] p-6 sm:p-8 rounded-3xl border border-blue-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div class="space-y-2.5 max-w-2xl">
      <div class="flex items-center gap-2">
        <ClipboardList class="w-5 h-5 text-blue-400 animate-pulse" />
        <span class="text-xs font-bold uppercase tracking-widest text-purple-400">Decentralized Microtask Terminal</span>
      </div>
      <h3 class="text-xl sm:text-2xl font-extrabold uppercase">Classroom Board of Tasks</h3>
      <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">Apply first-principles learning directly. Earn verified points by claiming open policy, robotic, or community building tasks.</p>
    </div>
    <button onclick={() => setIsCreatingTask(!appState.isCreatingTask)}
      class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shrink-0">
      <Plus class="w-4 h-4" /> Propose New Project
    </button>
  </div>

  <!-- Create Form -->
  {#if appState.isCreatingTask}
    <form transition:fade={{ duration: 300 }} onsubmit={handleCreateTask} class="frosted-glass rounded-2xl p-6 border border-blue-500/20 space-y-4 max-w-xl mx-auto animate-fade-in">
      <div class="flex justify-between items-center pb-2 border-b border-slate-800">
        <h4 class="font-extrabold text-white text-sm uppercase">Propose Ecosystem Task</h4>
        <button type="button" onclick={() => setIsCreatingTask(false)} class="text-slate-400 hover:text-white font-bold text-xs">✕</button>
      </div>
      <div class="space-y-1">
        <label class="text-[10px] uppercase font-mono text-slate-400 block font-bold">Project Title</label>
        <input type="text" required placeholder="e.g. Hydro-electric Microgrid controller mapping" value={appState.newTaskTitle} oninput={(e) => setNewTaskTitle((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl bg-slate-900 border border-slate-700/60 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-[10px] uppercase font-mono text-slate-400 block font-bold">Category</label>
          <select value={appState.newTaskCategory} onchange={(e) => setNewTaskCategory((e.target as HTMLSelectElement).value)}
            class="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2.5 text-xs text-white focus:outline-none focus:border-blue-500">
            <option value="Policy">Policy & Creed</option>
            <option value="Tech">Tech & Simulation</option>
            <option value="Philanthropy">Philanthropy Mesh</option>
            <option value="Community">Community Admin</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-[10px] uppercase font-mono text-slate-400 block font-bold">Reward XP</label>
          <input type="number" value={appState.newTaskReward} oninput={(e) => setNewTaskReward(Math.max(100, parseInt((e.target as HTMLInputElement).value) || 0))}
            class="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none focus:border-blue-500" />
        </div>
      </div>
      <div class="space-y-1">
        <label class="text-[10px] uppercase font-mono text-slate-400 block font-bold">Description</label>
        <textarea required rows={3} placeholder="Provide clear criteria to determine successful delivery." value={appState.newTaskDesc} oninput={(e) => setNewTaskDesc((e.target as HTMLTextAreaElement).value)}
          class="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-3 text-xs text-white focus:outline-none focus:border-blue-500"></textarea>
      </div>
      <button type="submit" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase transition shadow active:scale-98">Broadcast Proposal</button>
    </form>
  {/if}

  <!-- Task Columns -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Open -->
    <div class="space-y-4">
      <span class="px-3 py-1 font-mono text-[9px] uppercase tracking-wider font-bold text-blue-400 bg-blue-950 border border-blue-900/30 rounded-full">
        🔓 Open ({openTasks.length})
      </span>
      {#each openTasks as t (t.id)}
        <div transition:slide={{ duration: 300 }} class="frosted-glass-dark rounded-xl p-4 border border-slate-800 space-y-3">
          <div class="flex justify-between items-center gap-2">
            <span class="text-[9px] uppercase font-mono tracking-widest bg-blue-950/60 p-1 rounded font-bold text-blue-400">{t.category}</span>
            <span class="text-[10px] font-mono text-emerald-400">{t.rewardPoints} XP</span>
          </div>
          <h4 class="font-extrabold text-white text-sm">{t.title}</h4>
          <p class="text-slate-400 text-xs leading-relaxed">{t.description}</p>
          <div class="flex justify-between items-center pt-2 border-t border-slate-900/60">
            <span class="text-[9px] text-slate-500">By {t.createdBy}</span>
            <button onclick={() => handleJoinTask(t.id)}
              class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white transition flex items-center gap-1"><Plus class="w-3 h-3" /> Commit</button>
          </div>
        </div>
      {/each}
    </div>

    <!-- In Progress -->
    <div class="space-y-4">
      <span class="px-3 py-1 font-mono text-[9px] uppercase tracking-wider font-bold text-amber-400 bg-amber-950/40 border border-amber-900/40 rounded-full">
        ⚙️ Active ({activeTasks.length})
      </span>
      {#each activeTasks as t (t.id)}
        <div transition:slide={{ duration: 300 }} class="frosted-glass rounded-xl p-4 border border-blue-900/10 space-y-3">
          <div class="flex justify-between items-center gap-2">
            <span class="text-[9px] uppercase font-mono tracking-widest bg-amber-950 text-amber-400 p-1 rounded font-bold">{t.category}</span>
            <span class="text-[10px] font-mono text-purple-400">{t.rewardPoints} XP</span>
          </div>
          <h4 class="font-extrabold text-white text-sm">{t.title}</h4>
          <p class="text-slate-300 text-xs leading-relaxed">{t.description}</p>
          <div class="flex justify-between items-center pt-2 border-t border-slate-900">
            <span class="text-[9px] text-slate-400">Assigned: {t.assignee}</span>
            <button onclick={() => handleJoinTask(t.id)}
              class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white transition flex items-center gap-1"><Check class="w-3 h-3" /> Complete</button>
          </div>
        </div>
      {/each}
    </div>

    <!-- Completed -->
    <div class="space-y-4">
      <span class="px-3 py-1 font-mono text-[9px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 rounded-full">
        ✓ Completed ({completedTasks.length})
      </span>
      {#each completedTasks as t (t.id)}
        <div transition:slide={{ duration: 300 }} class="bg-slate-900/30 rounded-xl p-4 border border-[#0d2550] space-y-3 opacity-75">
          <div class="flex justify-between items-center gap-2">
            <span class="text-[9px] uppercase font-mono tracking-widest bg-slate-950 p-1 rounded font-bold text-slate-500">{t.category}</span>
            <span class="text-[10px] font-mono text-emerald-400">Claimed</span>
          </div>
          <h4 class="font-bold text-slate-300 text-sm line-through">{t.title}</h4>
          <p class="text-slate-500 text-xs line-through">{t.description}</p>
          <div class="flex justify-between items-center pt-2 border-t border-slate-900/60">
            <span class="text-[9px] text-slate-500">Archived</span>
            <span class="text-[10px] text-emerald-400 font-bold block">Done</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
