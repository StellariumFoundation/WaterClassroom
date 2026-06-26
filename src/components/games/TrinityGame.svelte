<script lang="ts">
  let { title = 'Game', onClose }: { title?: string; onClose?: () => void } = $props();
</script>

<div class="frosted-glass rounded-2xl p-6 border border-blue-950 space-y-3 text-center">
  <h3 class="text-sm font-bold text-white uppercase tracking-wide">{title}</h3>
  <p class="text-[10px] text-slate-400">Game module placeholder — Phaser integration coming in lesson component build-out.</p>
  <div class="h-32 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-center">
    <span class="text-[10px] font-mono text-slate-600">[Phaser canvas mount point]</span>
  </div>
  {#if onClose}
    <button onclick={onClose} class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition">Close Game</button>
  {/if}
</div>
