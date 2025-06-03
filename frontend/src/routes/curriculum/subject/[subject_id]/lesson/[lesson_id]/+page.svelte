<script lang="ts">
  import { page } from '$app/stores';

  // Placeholder data - in a real app, this would be fetched based on subjectId and lessonId
  const lessonDetailsDatabase: { [key: string]: { [key: string]: { title: string, content: string, gameLink?: string } } } = {
    'grade-5-math': {
      'ch1-fractions': { title: 'Chapter 1: Introduction to Fractions', content: 'Detailed content about fractions, including examples, diagrams, and practice problems...' },
      'ch2-decimals': { title: 'Chapter 2: Understanding Decimals', content: 'Exploring decimal places, addition, subtraction, and real-world use of decimals...' },
      'ch3-geometry': { title: 'Chapter 3: Basic Geometry', content: 'Introduction to shapes, angles, and spatial reasoning...' },
    },
    'intro-to-biology': {
      'unit1-cells': { title: 'Unit 1: Cell Biology', content: 'The structure and function of cells, organelles, and cell processes.', gameLink: 'CellExplorerGame' },
      'unit2-genetics': { title: 'Unit 2: Basics of Genetics', content: 'Understanding DNA, heredity, and genetic variation.' },
      'unit3-ecology': { title: 'Unit 3: Introduction to Ecology', content: 'Ecosystems, populations, and interactions between organisms.' },
    },
    'world-history': {
        'epoch1-ancient': { title: 'Epoch 1: Ancient Civilizations', content: 'A survey of major ancient civilizations and their contributions.'},
        'epoch2-middle-ages': { title: 'Epoch 2: The Middle Ages', content: 'Key events and developments during the Middle Ages.'},
        'epoch3-modern': { title: 'Epoch 3: The Modern Era', content: 'From the Renaissance to contemporary world history.'}
    },
    'physics-mechanics': {
        'topic1-kinematics': { title: 'Topic 1: Kinematics', content: 'Study of motion: displacement, velocity, and acceleration.'},
        'topic2-dynamics': { title: 'Topic 2: Newton\'s Laws of Motion', content: 'Understanding force, mass, and the laws governing motion.'},
        'topic3-energy': { title: 'Topic 3: Work and Energy', content: 'Concepts of work, kinetic energy, potential energy, and conservation of energy.'}
    }
  };

  $: subjectId = $page.params.subject_id;
  $: lessonId = $page.params.lesson_id;

  $: lesson = (lessonDetailsDatabase[subjectId] && lessonDetailsDatabase[subjectId][lessonId]) 
              ? lessonDetailsDatabase[subjectId][lessonId] 
              : { title: 'Lesson Not Found', content: 'Could not find details for this lesson.' };
  
  $: lessonTitle = lesson.title;
  $: lessonContent = lesson.content;
  $: gameLink = lesson.gameLink;

  function launchGame() {
    if (gameLink) {
      alert(`Launching game: ${gameLink}`);
      // In a real app: navigation or game embedding logic
    } else {
      alert('No game associated with this lesson.');
    }
  }
</script>

<div class="lesson-container">
  <h1>{lessonTitle}</h1>

  <section class="lesson-content">
    <h2>Lesson Material</h2>
    <p>{lessonContent}</p>
    <!-- Placeholder for rich text, images, videos -->
  </section>

  <section class="interactive-elements">
    <h2>Interactive Quiz</h2>
    <p><em>Placeholder for an interactive quiz related to {lessonTitle}.</em></p>
    <button disabled>Start Quiz (Coming Soon)</button>
  </section>

  {#if gameLink}
    <section class="game-launcher">
      <h2>Educational Game</h2>
      <p>Reinforce your learning with a fun game!</p>
      <button on:click={launchGame}>Play {gameLink.replace(/([A-Z])/g, ' $1').trim()} Game</button>
    </section>
  {/if}

  <div class="navigation-links">
    <a href={`/curriculum/subject/${subjectId}`}>Back to Lesson List ({subjectId})</a><br>
    <a href="/curriculum">Back to Curriculum Selection</a>
  </div>
</div>

<style>
  .lesson-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  h2 {
    color: #0056b3;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.25rem;
  }

  .lesson-content, .interactive-elements, .game-launcher {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .lesson-content p, .interactive-elements p, .game-launcher p {
    line-height: 1.6;
    color: #555;
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  
  .game-launcher button {
    background-color: #28a745; /* Green for games */
  }
  .game-launcher button:hover {
    background-color: #218838;
  }

  .navigation-links {
    margin-top: 2rem;
    text-align: center;
  }
  .navigation-links a {
    color: #007bff;
    text-decoration: none;
    margin: 0 0.5rem;
  }
  .navigation-links a:hover {
    text-decoration: underline;
  }
</style>
