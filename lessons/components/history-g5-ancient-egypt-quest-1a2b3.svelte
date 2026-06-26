<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Ancient Egypt Tomb Raider"
  story="You are an archaeologist who just discovered a hidden tomb. Collect hieroglyphs and answer history questions to unlock its secrets."
  prompt="What river supported ancient Egyptian farming?"
  options={["Nile", "Amazon", "Mississippi", "Thames"]}
  correctAnswerIndex={0}
  onScore={award}
/>
