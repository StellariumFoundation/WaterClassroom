<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte'; // For potential future actions

  // Placeholder data
  let completedLessons = 5;
  let earnedBadges = 2;
  let currentLessonTitle = "Chapter 1: Introduction to Fractions";
  let upcomingActivity = "Quiz on Fractions";

  // Placeholder for future navigation items
  const futureNavigations = [
    { href: '/curriculum', text: 'View Full Curriculum' },
    { href: '/ai-tutor', text: 'AI Tutor Access (Coming Soon)' },
    { href: '/profile', text: 'My Profile & Settings' },
  ];
</script>

<svelte:head>
  <title>Student Dashboard - Water Classroom</title>
</svelte:head>

<div class="dashboard-container">
  <h1 class="page-title">Student Dashboard</h1>

  <div class="dashboard-grid">
    <Card class="dashboard-card">
      <h2 slot="header">My Progress</h2>
      <p>You have completed <strong>{completedLessons}</strong> lessons and earned <strong>{earnedBadges}</strong> badges.</p>
      <!-- Example of a button for future use -->
      <div slot="footer">
        <Button variant="tertiary" onClick={() => alert('Detailed progress view coming soon!')}>
          View Detailed Progress
        </Button>
      </div>
    </Card>

    <Card class="dashboard-card">
      <h2 slot="header">Current Lesson</h2>
      <p>Your current lesson is: <strong>{currentLessonTitle}</strong>.</p>
      <div slot="footer">
        <Button variant="primary" onClick={() => alert('Navigating to lesson: ' + currentLessonTitle)}>
          Go to Lesson
        </Button>
      </div>
    </Card>

    <Card class="dashboard-card">
      <h2 slot="header">Upcoming Activities</h2>
      <p>Next up: <strong>{upcomingActivity}</strong>.</p>
      <div slot="footer">
        <Button variant="tertiary" onClick={() => alert('Activity details for: ' + upcomingActivity)}>
          View Activity Details
        </Button>
      </div>
    </Card>
  </div>

  <section class="future-nav-section">
    <h2 class="section-title">Quick Access</h2>
    <ul class="future-nav-list">
      {#each futureNavigations as navItem}
        <li>
          <a href={navItem.href} class="future-nav-link">{navItem.text}</a>
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .page-title {
    /* Global h1 styling will apply. Specific overrides if needed: */
    text-align: center;
    margin-bottom: var(--spacing-xxl); /* 32px */
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: var(--spacing-xl); /* 24px */
    margin-bottom: var(--spacing-xxl);
  }

  /* Styling for h2 within Card headers on this page */
  :global(.dashboard-card .card-header h2) {
    font-size: var(--font-size-h4); /* Adjust size as needed */
    color: var(--primary-blue-darker);
    margin:0;
  }

  .dashboard-card p {
    font-size: var(--font-size-body);
    color: var(--neutral-text-subtle);
    line-height: var(--line-height-base);
  }

  .dashboard-card strong {
    color: var(--neutral-text-body);
    font-weight: var(--font-weight-medium);
  }

  /* Styling for button alignment in card footer */
  :global(.dashboard-card .card-footer) {
    justify-content: flex-start; /* Align buttons to the left in this context */
  }
  :global(.dashboard-card .card-footer .btn) {
    font-size: var(--font-size-small);
  }


  .future-nav-section {
    margin-top: var(--spacing-xxxl); /* 48px */
    padding: var(--spacing-xl); /* 24px */
    background-color: var(--neutral-bg); /* Light background for this section */
    border-radius: var(--border-radius-lg);
  }

  .section-title {
    font-size: var(--font-size-h3);
    color: var(--neutral-text-body);
    margin-top: 0;
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }

  .future-nav-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-md);
  }

  .future-nav-link {
    display: inline-block;
    padding: var(--spacing-sm) var(--spacing-lg);
    background-color: var(--neutral-white);
    border: 1px solid var(--neutral-border);
    border-radius: var(--border-radius-base);
    color: var(--primary-blue);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    transition: all 0.2s ease;
  }
  .future-nav-link:hover {
    background-color: var(--primary-blue-lighter);
    border-color: var(--primary-blue);
    color: var(--primary-blue-darker);
    text-decoration: none;
  }
</style>
