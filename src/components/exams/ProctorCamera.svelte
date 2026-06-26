<script lang="ts">
  import { appState, requestProctorCamera } from '../../lib/store.svelte';
  import { Camera, CameraOff } from 'lucide-svelte';
  import { fade } from 'svelte/transition';

  type Props = { active?: boolean };
  let { active = false }: Props = $props();

  let localVideo = $state<HTMLVideoElement | null>(null);

  $effect(() => {
    if (active && localVideo && appState.streamRef) {
      localVideo.srcObject = appState.streamRef;
    }
  });

  $effect(() => {
    if (active && !appState.streamRef) requestProctorCamera(localVideo);
    return () => {
      if (appState.streamRef && !active) {
        appState.streamRef.getTracks().forEach(t => t.stop());
        appState.streamRef = null;
        appState.cameraStreamActive = false;
      }
    };
  });
</script>

{#if active}
  <div transition:fade={{ duration: 200 }} class="bg-slate-950 rounded-2xl p-4 border border-blue-950 space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-[10px] uppercase font-mono font-bold text-blue-400">Proctor Camera Feed</span>
      <span class="text-[9px] font-mono {appState.cameraStreamActive ? 'text-emerald-400' : 'text-red-400'}">
        {appState.cameraStreamActive ? '● LIVE' : '● OFFLINE'}
      </span>
    </div>
    <div class="relative rounded-xl overflow-hidden bg-black aspect-video">
       <video
         bind:this={localVideo}
         autoplay
         muted
         playsinline
         class="w-full h-full object-cover"
       ></video>
      {#if !appState.cameraStreamActive}
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <CameraOff class="w-10 h-10 text-slate-700 mb-2" />
          <p class="text-[10px] text-slate-500">Initializing camera...</p>
        </div>
      {/if}
    </div>
  </div>
{/if}
