<script lang="ts">
  import { fade } from 'svelte/transition';
  let { fallback, children }: { fallback?: string; children?: any } = $props();

  let hasError = $state(false);
  let error = $state<Error | null>(null);

  $effect(() => {
    const handleError = (event: ErrorEvent) => {
      hasError = true;
      error = event.error || new Error(event.message);
      console.error("ErrorBoundary caught:", error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  });
</script>

{#if hasError}
  {#if fallback}
    <p>{fallback}</p>
  {:else}
    <div transition:fade class="frosted-glass-dark rounded-3xl p-8 max-w-lg mx-auto mt-12 text-center space-y-4 border border-red-500/30">
      <div class="w-14 h-14 rounded-full bg-red-950 border border-red-500/30 flex items-center justify-center mx-auto">
        <span class="text-red-400 text-2xl font-extrabold">!</span>
      </div>
      <h3 class="text-xl font-extrabold text-white">Something went wrong</h3>
      <p class="text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-left select-all">
        {error?.message || "Unknown error"}
      </p>
      <button
        onclick={() => window.location.reload()}
        class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase transition"
      >
        Reload Page
      </button>
    </div>
  {/if}
{:else}
  {@render children?.()}
{/if}
