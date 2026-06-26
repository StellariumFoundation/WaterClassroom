<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Capital Cities Globe Trot"
  story="You are a globe-trotting reporter filing stories from each capital."
  prompt="What is the capital city of France?"
  options={["Paris", "Madrid", "Rome", "Berlin"]}
  correctAnswerIndex={0}
  onScore={award}
/>
