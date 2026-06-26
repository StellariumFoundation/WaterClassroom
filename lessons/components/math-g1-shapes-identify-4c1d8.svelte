<script lang="ts">
  import { appState, updateProgressOnServer } from '../../src/lib/store.svelte';
  import PhaserLearningGame from './PhaserLearningGame.svelte';

  function award(points: number) {
    updateProgressOnServer({ ...appState.progress, points: appState.progress.points + points });
  }
</script>

<PhaserLearningGame
  title="Shape Detective"
  story="A mysterious thief has stolen the geometry jewels. Identify shapes to recover them and solve the case."
  prompt="Which shape has exactly three sides?"
  options={["Circle", "Triangle", "Square", "Rectangle"]}
  correctAnswerIndex={1}
  onScore={award}
/>
