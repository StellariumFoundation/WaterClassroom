<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Revolutionary Decisions"
  story="You are a printer in Boston, 1773. The British are coming; your choices shape the revolution."
  prompt="A fair civic response to an unjust law is to..."
  options={["Start a reasoned petition and peaceful debate", "Ignore every rule", "Hide all information", "Refuse to think"]}
  correctAnswerIndex={0}
  onScore={award}
/>
