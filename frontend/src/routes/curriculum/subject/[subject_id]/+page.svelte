<script lang="ts">
  import { page } from '$app/stores';

  // Placeholder data - in a real app, this would be fetched based on subjectId
  const lessonsDatabase: { [key: string]: { id: string, name: string, subjectName: string, lessons: any[] } } = {
    'grade-5-math': {
      id: 'grade-5-math',
      name: 'Grade 5 Math - Common Core',
      lessons: [
        { id: 'ch1-fractions', title: 'Chapter 1: Introduction to Fractions' },
        { id: 'ch2-decimals', title: 'Chapter 2: Understanding Decimals' },
        { id: 'ch3-geometry', title: 'Chapter 3: Basic Geometry' },
      ],
    },
    'intro-to-biology': {
      id: 'intro-to-biology',
      name: 'Introduction to Biology',
      lessons: [
        { id: 'unit1-cells', title: 'Unit 1: Cell Biology' },
        { id: 'unit2-genetics', title: 'Unit 2: Basics of Genetics' },
        { id: 'unit3-ecology', title: 'Unit 3: Introduction to Ecology' },
      ],
    },
    'world-history': {
      id: 'world-history',
      name: 'World History 101',
      lessons: [
        { id: 'epoch1-ancient', title: 'Epoch 1: Ancient Civilizations' },
        { id: 'epoch2-middle-ages', title: 'Epoch 2: The Middle Ages' },
        { id: 'epoch3-modern', title: 'Epoch 3: The Modern Era' },
      ],
    },
    'physics-mechanics': {
        id: 'physics-mechanics',
        name: 'Physics: Mechanics',
        lessons: [
            { id: 'topic1-kinematics', title: 'Topic 1: Kinematics' },
            { id: 'topic2-dynamics', title: 'Topic 2: Newton\'s Laws of Motion' },
            { id: 'topic3-energy', title: 'Topic 3: Work and Energy' },
        ]
    }
  };

  $: subjectId = $page.params.subject_id;
  $: currentSubject = lessonsDatabase[subjectId] || { name: 'Unknown Subject', lessons: [] };
  $: subjectName = currentSubject.name;
  $: lessons = currentSubject.lessons;

</script>

<div class="container">
  <h1>Lessons for {subjectName}</h1>

  {#if lessons.length > 0}
    <ul class="lesson-list">
      {#each lessons as lesson}
        <li>
          <a href={`/curriculum/subject/${subjectId}/lesson/${lesson.id}`}>{lesson.title}</a>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No lessons found for this subject, or subject ID is invalid.</p>
  {/if}

  <div class="navigation-links">
    <a href="/curriculum">Back to Curriculum Selection</a>
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

  .lesson-list {
    list-style: none;
    padding: 0;
  }

  .lesson-list li {
    margin-bottom: 1rem;
  }

  .lesson-list li a {
    display: block;
    padding: 0.75rem 1rem;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    text-decoration: none;
    color: #0056b3;
    transition: background-color 0.2s ease-in-out;
  }

  .lesson-list li a:hover {
    background-color: #e9e9e9;
  }
  
  .navigation-links {
    margin-top: 2rem;
    text-align: center;
  }

  .navigation-links a {
    color: #007bff;
    text-decoration: none;
  }

  .navigation-links a:hover {
    text-decoration: underline;
  }
</style>
