<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Solar System Navigator"
  story="You are a space pilot navigating the asteroid belt by ordering planets correctly."
  prompt="Which planet is closest to the Sun?"
  options={["Mercury", "Venus", "Earth", "Mars"]}
  correctAnswerIndex={0}
  onScore={award}
/>
