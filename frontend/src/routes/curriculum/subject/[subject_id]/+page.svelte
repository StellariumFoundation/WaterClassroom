<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/Button.svelte'; // For back button

  // Placeholder data - in a real app, this would be fetched based on subjectId
  // (Assuming the same lessonsDatabase structure as before)
  const lessonsDatabase: { [key: string]: { id: string, name: string, lessons: Array<{id: string, title: string, shortDesc?: string}> } } = {
    'grade-5-math': {
      id: 'grade-5-math', name: 'Grade 5 Math - Common Core', lessons: [
        { id: 'ch1-fractions', title: 'Chapter 1: Introduction to Fractions', shortDesc: 'Understanding parts of a whole.' },
        { id: 'ch2-decimals', title: 'Chapter 2: Understanding Decimals', shortDesc: 'Exploring decimal points and values.' },
        { id: 'ch3-geometry', title: 'Chapter 3: Basic Geometry', shortDesc: 'Learning about shapes and angles.' },
      ],
    },
    'intro-to-biology': {
      id: 'intro-to-biology', name: 'Introduction to Biology', lessons: [
        { id: 'unit1-cells', title: 'Unit 1: Cell Biology', shortDesc: 'The basic building blocks of life.' },
        { id: 'unit2-genetics', title: 'Unit 2: Basics of Genetics', shortDesc: 'How traits are passed down.' },
        { id: 'unit3-ecology', title: 'Unit 3: Introduction to Ecology', shortDesc: 'Interactions in the natural world.' },
      ],
    },
    'world-history': {
      id: 'world-history', name: 'World History 101', lessons: [
        { id: 'epoch1-ancient', title: 'Epoch 1: Ancient Civilizations', shortDesc: 'Empires of the past.' },
        { id: 'epoch2-middle-ages', title: 'Epoch 2: The Middle Ages', shortDesc: 'Knights, castles, and change.' },
        { id: 'epoch3-modern', title: 'Epoch 3: The Modern Era', shortDesc: 'From exploration to today.' },
      ],
    },
    'physics-mechanics': {
        id: 'physics-mechanics', name: 'Physics: Mechanics', lessons: [
            { id: 'topic1-kinematics', title: 'Topic 1: Kinematics', shortDesc: 'Describing motion.' },
            { id: 'topic2-dynamics', title: 'Topic 2: Newton\'s Laws', shortDesc: 'Forces and motion.' },
            { id: 'topic3-energy', title: 'Topic 3: Work and Energy', shortDesc: 'Energy in its various forms.' },
        ]
    }
  };

  $: subjectId = $page.params.subject_id;
  $: currentSubject = lessonsDatabase[subjectId] || { name: 'Unknown Subject', lessons: [] };
  $: subjectName = currentSubject.name;
  $: lessons = currentSubject.lessons;

</script>

<svelte:head>
  <title>Lessons for {subjectName} - Water Classroom</title>
</svelte:head>

<div class="lesson-list-container">
  <div class="page-header">
    <Button href="/curriculum" variant="tertiary" class="back-button">&larr; Curricula</Button>
    <h1 class="page-title">Lessons for {subjectName}</h1>
  </div>

  {#if lessons.length > 0}
    <ul class="lessons">
      {#each lessons as lesson (lesson.id)}
        <li>
          <a href={`/curriculum/subject/${subjectId}/lesson/${lesson.id}`} class="lesson-link">
            <span class="lesson-title">{lesson.title}</span>
            {#if lesson.shortDesc}
              <span class="lesson-short-desc">{lesson.shortDesc}</span>
            {/if}
            <span class="lesson-cta">Start Lesson &rarr;</span>
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <div class="no-lessons-message">
      <p>No lessons found for this subject, or the subject ID is invalid.</p>
      <p>Please return to the curriculum selection page to choose another subject.</p>
      <Button href="/curriculum" variant="primary">Back to Curriculum</Button>
    </div>
  {/if}
</div>

<style>
  .page-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }
  .page-title {
    margin-bottom: 0; /* Handled by page-header */
    margin-top: 0; /* Handled by page-header */
    flex-grow: 1;
    text-align: left; /* Align with back button */
  }


  .lessons {
    list-style: none;
    padding: 0;
  }

  .lessons li {
    margin-bottom: var(--spacing-lg); /* 16px */
  }

  .lesson-link {
    display: block;
    padding: var(--spacing-lg) var(--spacing-xl); /* 16px 24px */
    background-color: var(--neutral-white);
    border: 1px solid var(--neutral-border);
    border-radius: var(--border-radius-lg); /* 8px */
    text-decoration: none;
    color: var(--neutral-text-body);
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }
  .lesson-link:hover {
    border-color: var(--primary-blue);
    box-shadow: var(--box-shadow-sm);
    transform: translateY(-1px);
    text-decoration: none;
  }

  .lesson-title {
    display: block;
    font-size: var(--font-size-h5); /* 1.25rem */
    font-weight: var(--font-weight-medium);
    color: var(--primary-blue-darker);
    margin-bottom: var(--spacing-xs); /* 4px */
  }

  .lesson-short-desc {
    display: block;
    font-size: var(--font-size-body);
    color: var(--neutral-text-subtle);
    margin-bottom: var(--spacing-md); /* 12px */
    line-height: var(--line-height-base);
  }

  .lesson-cta {
    font-size: var(--font-size-body);
    color: var(--primary-blue);
    font-weight: var(--font-weight-medium);
  }
  .lesson-link:hover .lesson-cta {
    text-decoration: underline;
  }

  .no-lessons-message {
    text-align: center;
    padding: var(--spacing-xxxl); /* 48px */
    background-color: var(--neutral-white);
    border: 1px solid var(--neutral-border);
    border-radius: var(--border-radius-lg);
  }
  .no-lessons-message p {
    font-size: var(--font-size-body);
    color: var(--neutral-text-subtle);
  }
</style>
