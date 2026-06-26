<script lang="ts">
  let { badges = [] }: { badges?: Array<{ key: string; name: string; icon: string; color: string }> } = $props();
  import { scale } from 'svelte/transition';
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
  {#each badges as badge, idx (badge.key)}
    <div in:scale={{ duration: 300, delay: idx * 60 }} class="bg-slate-950/70 border border-blue-900/40 rounded-xl p-3 text-center space-y-1.5">
      <div class="w-10 h-10 rounded-full mx-auto flex items-center justify-center {badge.color}">
        <span class="text-sm">{badge.icon}</span>
      </div>
      <span class="text-[10px] font-bold text-white block leading-tight">{badge.name}</span>
    </div>
  {/each}
  {#if badges.length === 0}
    <div class="col-span-full text-center py-4 text-xs text-slate-600 italic">No badges earned yet. Complete lessons to start collecting.</div>
  {/if}
</div>
