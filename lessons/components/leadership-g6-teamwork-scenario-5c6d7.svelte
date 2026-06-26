<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Captain of the Storm"
  story="You are the captain of a research vessel caught in a deadly storm. Your crew looks to you for decisions that will save everyone."
  prompt="Your team disagrees during the storm. What is the best first step?"
  options={["Listen, assign roles, and communicate the plan", "Blame the loudest person", "Stop all decisions", "Ignore the crew"]}
  correctAnswerIndex={0}
  onScore={award}
/>
