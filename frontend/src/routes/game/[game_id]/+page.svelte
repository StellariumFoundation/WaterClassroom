<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  // Placeholder data
  const gameDatabase: { [key: string]: { name: string, description: string, themeColor?: string } } = {
    'fraction-fling': { name: 'Fraction Fling', description: 'Fling fractions to hit the correct targets!', themeColor: 'var(--status-success)'},
    'algebra-adventure': { name: 'Algebra Adventure', description: 'Solve algebraic equations to navigate a mysterious island.', themeColor: 'var(--primary-blue)' },
    'history-explorer': { name: 'History Explorer', description: 'Travel through time and answer historical questions.', themeColor: '#A06A42' /* Example custom color */ },
  };

  $: gameId = $page.params.game_id;
  $: game = gameDatabase[gameId] || { name: 'Unknown Game', description: 'No description available.' };
  $: gameName = game.name;
  $: score = 0; // Placeholder score

  function startGame() {
    alert(`Starting ${gameName}! (This is a placeholder for actual game logic)`);
  }
  function quitGame() {
    alert(`Quitting ${gameName}... (Placeholder)`);
    // Potentially: await goto('/curriculum'); or previous lesson page
  }
</script>

<svelte:head>
  <title>Playing {gameName} - Water Classroom</title>
</svelte:head>

<div class="game-page-container">
  <div class="page-header">
    <!-- Conceptual: Breadcrumb or back to lesson link might go here -->
    <!-- <Button href="/curriculum" variant="tertiary">&larr; Back to Lessons</Button> -->
  </div>

  <h1 class="page-title">Playing: {gameName}</h1>

  <Card class="game-card" style="--game-theme-color: {game.themeColor || 'var(--primary-blue)'};">
    <div slot="header" class="game-card-header">
      <h2 class="game-title-in-card">{gameName}</h2>
      <div class="score-display">Score: {score}</div>
    </div>

    <div class="game-content-area">
      <p>{game.description}</p>
      <p><em>(Game interface will load here...)</em></p>
      <Button variant="primary" class="start-game-button" onClick={startGame}>Start Game</Button>
    </div>

    <div slot="footer" class="game-actions-footer">
      <Button variant="danger" onClick={quitGame}>Quit Game</Button>
      <Button variant="tertiary" href="/curriculum">Back to Curriculum</Button>
    </div>
  </Card>

</div>

<style>
  .game-page-container {
    /* Max width handled by .app-content */
    text-align: center; /* Center content like title and card */
  }
  .page-header {
    text-align: left; /* Align back button to left if used */
    margin-bottom: var(--spacing-md);
  }
  .page-title {
    margin-bottom: var(--spacing-xl);
  }

  .game-card {
    width: 100%;
    max-width: 720px; /* Max width for the game card */
    margin: 0 auto; /* Center the card */
    border-top: 4px solid var(--game-theme-color, var(--primary-blue)); /* Theme color accent */
  }

  .game-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--spacing-md); /* Add some space if Card doesn't add enough */
  }
  .game-title-in-card {
    font-size: var(--font-size-h4);
    color: var(--game-theme-color, var(--primary-blue-darker));
    margin:0;
  }
  .score-display {
    font-size: var(--font-size-h5);
    font-weight: var(--font-weight-semibold);
    color: var(--neutral-text-body);
  }

  .game-content-area {
    padding: var(--spacing-xxl) 0; /* Generous padding */
    min-height: 250px; /* Placeholder for game content */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .game-content-area p {
    color: var(--neutral-text-subtle);
    margin-bottom: var(--spacing-lg);
  }
  .start-game-button {
    padding: var(--spacing-lg) var(--spacing-xxl);
    font-size: var(--font-size-h5);
  }

  :global(.game-card .game-actions-footer) {
    display: flex;
    justify-content: space-between; /* Space out quit and back buttons */
  }
</style>
