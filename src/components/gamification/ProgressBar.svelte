<script lang="ts">
  let { subject = '', percent = 0 }: { subject?: string; percent?: number } = $props();
  import { slide } from 'svelte/transition';

  const widthClass = $derived(percent >= 1 ? 'w-full' : percent >= 0.75 ? 'w-3/4' : percent >= 0.66 ? 'w-2/3' : percent >= 0.5 ? 'w-1/2' : percent >= 0.33 ? 'w-1/3' : percent > 0 ? 'w-1/4' : 'w-0');
</script>

<div in:slide={{ duration: 300 }} class="bg-slate-950/50 p-4 rounded-xl space-y-2">
  <div class="flex justify-between items-center">
    <span class="text-[10px] uppercase font-mono text-slate-400 font-bold">{subject}</span>
    <span class="text-[10px] font-mono text-blue-400">{Math.round(percent * 100)}%</span>
  </div>
  <div class="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
    <div class="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500 {widthClass}"></div>
  </div>
</div>
