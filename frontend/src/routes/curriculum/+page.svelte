<script lang="ts">
  // Placeholder data for curriculum/subjects
  const subjects = [
    { id: 'grade-5-math', name: 'Grade 5 Math - Common Core', description: 'Master core mathematical concepts for 5th grade.' },
    { id: 'intro-to-biology', name: 'Introduction to Biology', description: 'Explore the fascinating world of living organisms.' },
    { id: 'world-history', name: 'World History 101', description: 'A survey of major historical events and civilizations.' },
    { id: 'physics-mechanics', name: 'Physics: Mechanics', description: 'Understand the principles of motion, force, and energy.' },
  ];
</script>

<svelte:head>
  <title>Select Curriculum - Water Classroom</title>
</svelte:head>

<div class="curriculum-container">
  <h1 class="page-title">Select Your Curriculum</h1>

  <div class="subject-grid">
    {#each subjects as subject (subject.id)}
      <a href={`/curriculum/subject/${subject.id}`} class="subject-card-link">
        <div class="subject-card">
          <h2 class="subject-name">{subject.name}</h2>
          <p class="subject-description">{subject.description}</p>
          <span class="subject-cta">View Lessons &rarr;</span>
        </div>
      </a>
    {/each}
  </div>

  <div class="future-features">
    <p><em>Future functionality: Search or filter curricula, view progress per curriculum.</em></p>
  </div>
</div>

<style>
  .page-title {
    text-align: center;
    margin-bottom: var(--spacing-xxl); /* 32px */
  }

  .subject-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: var(--spacing-xl); /* 24px */
    margin-bottom: var(--spacing-xxl);
  }

  .subject-card-link {
    text-decoration: none;
    color: inherit; /* Inherit color from parent, link styling handled by card content */
    display: block; /* Ensure the link takes up the whole grid cell for clickability */
    height: 100%; /* Make cards in a row same height if grid allows */
  }
  .subject-card-link:hover .subject-card { /* Hover effect on the card */
    border-color: var(--primary-blue);
    box-shadow: var(--box-shadow-md);
    transform: translateY(-2px); /* Subtle lift effect */
  }

  .subject-card {
    background-color: var(--neutral-white);
    border: 1px solid var(--neutral-border);
    border-radius: var(--border-radius-lg); /* 8px */
    padding: var(--spacing-xl); /* 24px */
    display: flex;
    flex-direction: column;
    height: 100%; /* Ensure cards in the same row take up same height */
    box-sizing: border-box; /* Include padding and border in height calculation */
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }

  .subject-name {
    font-size: var(--font-size-h4); /* 1.5rem */
    color: var(--primary-blue-darker);
    margin-top: 0;
    margin-bottom: var(--spacing-md); /* 12px */
  }

  .subject-description {
    font-size: var(--font-size-body);
    color: var(--neutral-text-subtle);
    line-height: var(--line-height-base);
    flex-grow: 1; /* Allow description to take available space */
    margin-bottom: var(--spacing-lg); /* 16px */
  }

  .subject-cta {
    font-size: var(--font-size-body);
    color: var(--primary-blue);
    font-weight: var(--font-weight-medium);
    align-self: flex-start; /* Align to the left */
  }
  .subject-card-link:hover .subject-cta {
    text-decoration: underline;
  }


  .future-features {
    margin-top: var(--spacing-xxxl); /* 48px */
    text-align: center;
    font-size: var(--font-size-small);
    color: var(--neutral-text-subtle);
  }
</style>
