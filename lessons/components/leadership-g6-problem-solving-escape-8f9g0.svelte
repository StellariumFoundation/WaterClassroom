<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Laboratory Escape"
  story="You are an inventor trapped in your own laboratory. Solve logic puzzles to escape before the self-destruct sequence completes."
  prompt="A clue reads: 2, 4, 8, 16. What number comes next?"
  options={["24", "28", "32", "36"]}
  correctAnswerIndex={2}
  onScore={award}
/>
