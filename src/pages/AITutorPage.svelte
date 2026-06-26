<script lang="ts">
  import { appState, handleSendMessage, setChatInput } from '../lib/store.svelte';
  import { Cpu, User, Send } from 'lucide-svelte';
  import { fly, scale } from 'svelte/transition';



  let chatBottomEl: HTMLDivElement | null = $state(null);

  $effect(() => {
    (appState as any).chatBottomRef = chatBottomEl;
    chatBottomEl?.scrollIntoView({ behavior: 'smooth' });
  });
</script>

<div class="frosted-glass rounded-3xl shadow-2xl border border-blue-950 max-w-4xl mx-auto h-[70vh] flex flex-col overflow-hidden animate-fade-in relative">
  <div class="absolute inset-0 pr-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

  <!-- Header -->
  <div class="bg-[#050b18]/80 p-4 border-b border-blue-950 flex justify-between items-center shrink-0">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-blue-950 border border-blue-500/20 flex items-center justify-center text-blue-400 relative">
        <Cpu class="w-5 h-5 animate-pulse" />
        <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-slate-900"></span>
      </div>
      <div>
        <h3 class="font-extrabold text-white text-sm uppercase tracking-wide">Water Tutor v1.4 Fluid</h3>
        <p class="text-[10px] text-emerald-400 font-mono tracking-wide">● SEED ACTIVE (LATENCY 45ms)</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-[10px] uppercase font-mono tracking-wider font-bold bg-[#1e1b4b] border border-blue-800/40 text-blue-300 px-2.5 py-1 rounded">24/7 Socratic Aid</span>
    </div>
  </div>

  <!-- Messages -->
  <div class="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
    {#each appState.chatMessages as msg, idx (msg.id || idx)}
      {@const isTutor = msg.sender === "tutor"}
      <div transition:fly={{ y: 10, duration: 200 }} class="flex gap-3 max-w-3xl {isTutor ? '' : 'ml-auto flex-row-reverse'}">
        <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 {isTutor ? 'bg-blue-950 border border-blue-500/30 text-blue-400' : 'bg-cyan-950 border border-cyan-500/30 text-cyan-400'}">
          {#if isTutor}<Cpu class="w-4 h-4" />{:else}<User class="w-4 h-4" />{/if}
        </div>
        <div class="space-y-1">
          <div class="rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed {isTutor ? 'bg-slate-950/85 border border-blue-950 text-slate-200' : 'bg-blue-600 text-white'}">
            {#each msg.text.split("\n\n") as para, pIdx}
              {#if para.startsWith("###")}
                <h4 class="font-bold text-white text-xs sm:text-sm mb-1 uppercase tracking-wide">{para.replace("###", "").trim()}</h4>
              {:else if para.startsWith("- **") || para.startsWith("- ")}
                <p class="pl-3 border-l border-blue-800/70 font-mono text-xs">{para}</p>
              {:else}
                <p class="mb-1.5 last:mb-0">{para}</p>
              {/if}
            {/each}
          </div>
          <span class="text-[9px] font-mono text-slate-500 block px-1 text-right">{msg.timestamp}</span>
        </div>
      </div>
    {/each}
    {#if appState.isTutorTyping}
      <div transition:scale={{ duration: 200 }} class="flex gap-3 max-w-lg">
        <div class="w-8 h-8 rounded-full bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <Cpu class="w-4 h-4 animate-spin" />
        </div>
        <div class="bg-slate-950 border border-blue-950 rounded-2xl px-4 py-3 text-xs font-mono text-slate-400 flex items-center gap-1">
          <span>Socratic processing</span>
          <span class="animate-ping text-blue-400">...</span>
        </div>
      </div>
    {/if}
    <div bind:this={chatBottomEl}></div>
  </div>

  <!-- Input -->
  <div class="p-4 bg-[#050b18]/80 border-t border-blue-950/70 shrink-0">
    <div class="flex gap-2.5">
      <input type="text" placeholder="Ask standard Common Core math, Unitree kinetics, or Abundance creed logic..."
        value={appState.chatInput} oninput={(e) => setChatInput((e.target as HTMLInputElement).value)} onkeydown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
        class="flex-grow rounded-xl bg-slate-900 border border-slate-700/60 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500" />
      <button onclick={() => handleSendMessage()}
        class="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center shadow shadow-blue-500/20">
        <Send class="w-4 h-4" />
      </button>
    </div>
  </div>
</div>
