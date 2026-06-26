<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Continent Cartographer"
  story="A mysterious sea-level rise has redrawn the world map. Place each continent in its correct location."
  prompt="Which continent contains Brazil?"
  options={["Africa", "South America", "Europe", "Asia"]}
  correctAnswerIndex={1}
  onScore={award}
/>
