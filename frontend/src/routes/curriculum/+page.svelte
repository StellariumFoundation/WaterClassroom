<script lang="ts">
  // Placeholder data for curriculum/subjects
  const subjects = [
    { id: 'grade-5-math', name: 'Grade 5 Math - Common Core' },
    { id: 'intro-to-biology', name: 'Introduction to Biology' },
    { id: 'world-history', name: 'World History 101' },
    { id: 'physics-mechanics', name: 'Physics: Mechanics' },
  ];
</script>

<div class="container">
  <h1>Select Your Curriculum</h1>

  <ul class="subject-list">
    {#each subjects as subject}
      <li>
        <a href={`/curriculum/subject/${subject.id}`}>{subject.name}</a>
      </li>
    {/each}
  </ul>

  <!-- Placeholder for future search/filter functionality -->
  <div class="future-features">
    <p><em>Future: Search or filter curricula</em></p>
  </div>
</div>

<style>
  .container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  .subject-list {
    list-style: none;
    padding: 0;
  }

  .subject-list li {
    margin-bottom: 1rem;
  }

  .subject-list li a {
    display: block;
    padding: 1rem;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-decoration: none;
    color: #0056b3;
    font-size: 1.1rem;
    transition: background-color 0.2s ease-in-out;
  }

  .subject-list li a:hover {
    background-color: #e0e0e0;
  }

  .future-features {
    margin-top: 2rem;
    text-align: center;
    color: #777;
  }
</style>
