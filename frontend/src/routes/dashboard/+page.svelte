<script lang="ts">
  // Placeholder data - will be fetched or managed by state later
  let completedLessons = 5;
  let earnedBadges = 2;
  let currentLessonTitle = "Chapter 1: Introduction to Fractions";
  let upcomingActivity = "Quiz on Fractions";
</script>

<div class="dashboard-container">
  <h1>Student Dashboard</h1>

  <section class="dashboard-section">
    <h2>My Progress</h2>
    <p>You have completed {completedLessons} lessons and earned {earnedBadges} badges.</p>
    <!-- Future Link: View Detailed Progress -->
  </section>

  <section class="dashboard-section">
    <h2>Current Lesson</h2>
    <p>Your current lesson is: <strong>{currentLessonTitle}</strong>.</p>
    <!-- Future Link: Go to Lesson -->
  </section>

  <section class="dashboard-section">
    <h2>Upcoming Activities</h2>
    <p>Next up: {upcomingActivity}.</p>
    <!-- Future Link: View Activity Details -->
  </section>

  <nav class="future-navigation">
    <p><em>Future navigation links:</em></p>
    <ul>
      <li>View Full Curriculum</li>
      <li>AI Tutor</li>
      <li>My Profile</li>
      <li>Settings</li>
    </ul>
  </nav>
</div>

<style>
  .dashboard-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  .dashboard-section {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .dashboard-section h2 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    color: #0056b3; /* A theme color */
  }

  .dashboard-section p {
    line-height: 1.6;
    color: #555;
  }

  .future-navigation {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px dashed #ccc;
  }

  .future-navigation p {
    font-weight: bold;
  }

  .future-navigation ul {
    list-style: none;
    padding-left: 0;
  }

  .future-navigation li {
    margin-bottom: 0.5rem;
    color: #777; /* Indicate they are not active links yet */
  }
</style>
