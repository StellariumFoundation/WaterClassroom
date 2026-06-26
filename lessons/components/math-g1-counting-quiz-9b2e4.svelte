<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Counting Cloud City"
  story="You are the mayor of Cloud City. Citizens need your help counting their treasures to build the next tower."
  prompt="Count the apples: one, two, three, four."
  options={["3", "4", "5", "6"]}
  correctAnswerIndex={1}
  onScore={award}
/>
