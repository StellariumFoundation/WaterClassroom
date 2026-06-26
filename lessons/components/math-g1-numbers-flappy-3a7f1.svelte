<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Numbers Take Flight"
  story="You are a young pilot learning to fly through a sky of numbers. Each correct answer keeps you soaring higher."
  prompt="Which number is greater?"
  options={["7", "4", "3", "2"]}
  correctAnswerIndex={0}
  onScore={award}
/>
