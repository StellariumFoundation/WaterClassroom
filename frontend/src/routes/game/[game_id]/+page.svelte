<script lang="ts">
  import { page } from '$app/stores';

  // Placeholder data - in a real app, this would be fetched based on gameId
  const gameDatabase: { [key: string]: { name: string, description: string } } = {
    'fraction-fling': { name: 'Fraction Fling', description: 'Fling fractions to hit the correct targets!' },
    'algebra-adventure': { name: 'Algebra Adventure', description: 'Solve algebraic equations to navigate a mysterious island.' },
    'history-explorer': { name: 'History Explorer', description: 'Travel through time and answer historical questions.' },
  };

  $: gameId = $page.params.game_id;
  $: game = gameDatabase[gameId] || { name: 'Unknown Game', description: 'No description available.' };
  $: gameName = game.name;
  $: score = 0; // Placeholder score

  function startGame() {
    alert(`Starting ${gameName}! (This is a placeholder)`);
    // Actual game start logic would go here
  }
</script>

<div class="game-container">
  <h1>Playing {gameName}</h1>

  <section class="game-area">
    <h2>Game Zone</h2>
    <p>Game content for <strong>{gameName}</strong> will be displayed here.</p>
    <p>{game.description}</p>
    
    <div class="game-controls">
      <button on:click={startGame}>Start Game</button>
    </div>
    
    <div class="score-display">
      Score: {score}
    </div>
  </section>

  <nav class="game-navigation">
    <!-- Assuming games are typically launched from a lesson context -->
    <a href="/curriculum">Back to Curriculum / Lessons</a> 
    <!-- Or a more specific link if context is available, e.g., back to previous lesson -->
    <button on:click={() => alert('Quitting game... (placeholder)')}>Quit Game</button>
  </nav>
</div>

<style>
  .game-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    text-align: center;
  }

  h1 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .game-area {
    background-color: #f0f0f0; /* Light grey background for game area */
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    min-height: 300px; /* Placeholder height */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .game-area h2 {
    margin-top: 0;
    color: #0056b3;
  }
  
  .game-controls button {
    padding: 0.75rem 1.5rem;
    font-size: 1.2rem;
    background-color: #28a745; /* Green for start */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 1rem 0;
  }
  .game-controls button:hover {
    background-color: #218838;
  }

  .score-display {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 1rem;
  }

  .game-navigation a, .game-navigation button {
    display: inline-block;
    margin: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    border: none;
    cursor: pointer;
  }
  .game-navigation button {
    background-color: #dc3545; /* Red for quit */
  }

  .game-navigation a:hover, .game-navigation button:hover {
    opacity: 0.8;
  }
</style>
