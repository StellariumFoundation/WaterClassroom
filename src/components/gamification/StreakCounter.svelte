<script lang="ts">
  let { days = 0 }: { days?: number } = $props();
  import { Flame } from 'lucide-svelte';
  import { scale } from 'svelte/transition';
</script>

<div in:scale={{ duration: 300 }} class="text-center bg-slate-950 p-4 rounded-2xl border border-blue-900/30 min-w-24 sm:min-w-28 shadow-inner">
  <Flame class="w-5 h-5 text-amber-500 fill-amber-400 mx-auto mb-1.5 animate-pulse" />
  <strong class="text-xl sm:text-2xl font-extrabold block text-white">{days}</strong>
  <span class="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Day Streak</span>
</div>
