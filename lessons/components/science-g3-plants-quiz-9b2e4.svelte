<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Plant Lifecycle Quest"
  story="You are a botanist exploring the Amazon rainforest. Grow plants by answering lifecycle questions correctly."
  prompt="What do plants need most to make food from sunlight?"
  options={["Soil only", "Sunlight, water, and air", "Rocks only", "Darkness"]}
  correctAnswerIndex={1}
  onScore={award}
/>
