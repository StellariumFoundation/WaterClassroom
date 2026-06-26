<script lang="ts">
  import { appState, handleSimulatedSupport, setShowDirectDonateModal, setSimulatedDonationAmount } from '../../lib/store.svelte';
  import { Heart } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';


</script>

{#if appState.showDirectDonateModal}
  <div transition:fade class="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div transition:scale={{ start: 0.9 }} class="frosted-glass-dark p-6 sm:p-8 rounded-3xl max-w-md w-full border border-rose-500/20 text-center space-y-6">
      <div class="w-14 h-14 bg-rose-950 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-400 mx-auto">
        <Heart class="w-7 h-7 fill-rose-500" />
      </div>
      <div class="space-y-1.5">
        <h3 class="text-2xl font-extrabold text-white">Sponsor a Student</h3>
        <p class="text-xs text-slate-400">Your contribution directly sponsors curriculum access for students in need.</p>
      </div>

      {#if appState.donationSuccess}
        <div class="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 p-6 rounded-xl text-center space-y-2 animate-fade-in">
          <span class="font-bold text-lg block">✓ DONATION COMMITTED</span>
          <p class="text-xs">+500 XP awarded for your generosity!</p>
        </div>
      {:else}
        <form onsubmit={handleSimulatedSupport} class="space-y-4">
          <div class="space-y-1">
            <label class="text-[10px] uppercase font-mono text-slate-400 block font-bold">Donation Amount (USD)</label>
            <input type="number" value={appState.simulatedDonationAmount} oninput={(e) => setSimulatedDonationAmount((e.target as HTMLInputElement).value)}
              class="w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-2xl font-extrabold text-white text-center focus:outline-none focus:border-rose-500 font-mono" />
          </div>
          <div class="flex gap-2 justify-center pt-2">
            {#each [50, 100, 250, 500] as amt}
              <button type="button" onclick={() => setSimulatedDonationAmount(String(amt))}
                class="px-4 py-1.5 rounded-lg text-xs font-bold border transition {appState.simulatedDonationAmount === String(amt) ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-rose-500'}">
                ${amt}
              </button>
            {/each}
          </div>
          <button type="submit" class="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-500/20">
            Donate ${parseInt(appState.simulatedDonationAmount) || 0}
          </button>
        </form>
      {/if}

      <button onclick={() => setShowDirectDonateModal(false)}
        class="text-xs text-slate-500 hover:text-slate-300 transition">
        {appState.donationSuccess ? "Close" : "Maybe later"}
      </button>
    </div>
  </div>
{/if}
