<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';

  // (Assuming the same lessonDetailsDatabase structure as before)
  const lessonDetailsDatabase: { [key: string]: { [key: string]: { title: string, content: string, gameId?: string, gameName?: string, quizId?: string } } } = {
    'grade-5-math': {
      'ch1-fractions': { title: 'Chapter 1: Introduction to Fractions', content: 'Detailed content about fractions, including examples, diagrams, and practice problems...', quizId: 'ch1-fractions-quiz' },
      'ch2-decimals': { title: 'Chapter 2: Understanding Decimals', content: 'Exploring decimal places, addition, subtraction, and real-world use of decimals...' },
      'ch3-geometry': { title: 'Chapter 3: Basic Geometry', content: 'Introduction to shapes, angles, and spatial reasoning...' },
    },
    'intro-to-biology': {
      'unit1-cells': { title: 'Unit 1: Cell Biology', content: 'The structure and function of cells, organelles, and cell processes.', gameId: 'cell-explorer', gameName: 'Cell Explorer Game', quizId: 'biology-cell-basics' },
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
  $: gameId = lesson.gameId;
  $: gameName = lesson.gameName || 'Educational Game';
  $: quizId = lesson.quizId;

</script>

<svelte:head>
  <title>{lessonTitle} - Water Classroom</title>
</svelte:head>

<div class="lesson-view-container">
  <div class="page-header">
     <Button href={`/curriculum/subject/${subjectId}`} variant="tertiary" class="back-button">&larr; Back to Lessons</Button>
  </div>

  <h1 class="lesson-main-title">{lessonTitle}</h1>

  <Card class="lesson-content-card">
    <h2 slot="header">Lesson Material</h2>
    <div class="prose">
      <!-- In a real app, lessonContent might be HTML or Markdown to be rendered -->
      <p>{lessonContent}</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  </Card>

  {#if quizId}
  <Card class="related-activity-card">
    <h2 slot="header">Check Your Understanding</h2>
    <p>Test your knowledge with a short quiz on the concepts covered in this lesson.</p>
    <div slot="footer">
      <Button href={`/quiz/${quizId}`} variant="primary">Start Quiz: {lessonTitle}</Button>
    </div>
  </Card>
  {/if}

  {#if gameId}
  <Card class="related-activity-card">
    <h2 slot="header">Reinforce Learning</h2>
    <p>Play an interactive game to practice the skills from this lesson!</p>
    <div slot="footer">
      <Button href={`/game/${gameId}`} variant="secondary">Play {gameName}</Button>
    </div>
  </Card>
  {/if}

</div>

<style>
  .lesson-view-container {
    /* Max width handled by .app-content */
  }
  .page-header {
    margin-bottom: var(--spacing-lg);
  }
  .lesson-main-title {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }

  /* Ensure card headers on this page have a consistent style */
  :global(.lesson-content-card .card-header h2),
  :global(.related-activity-card .card-header h2) {
    font-size: var(--font-size-h4);
    color: var(--primary-blue-darker);
    margin:0;
  }

  .prose {
    font-size: var(--font-size-body);
    line-height: var(--line-height-base);
    color: var(--neutral-text-body);
  }
  .prose p {
    margin-bottom: var(--spacing-lg);
  }
  .prose p:last-child {
    margin-bottom: 0;
  }

  .related-activity-card {
    margin-top: var(--spacing-xl);
  }
  .related-activity-card p {
    font-size: var(--font-size-body);
    color: var(--neutral-text-subtle);
  }
  :global(.related-activity-card .card-footer) {
    justify-content: flex-start;
  }

</style>
