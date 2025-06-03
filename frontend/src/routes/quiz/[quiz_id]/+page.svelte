<script lang="ts">
  import { page } from '$app/stores';

  // Placeholder data - in a real app, this would be fetched based on quizId
  const quizDatabase: { [key: string]: { name: string, instructions: string, questions: any[] } } = {
    'ch1-fractions-quiz': {
      name: 'Quiz: Chapter 1 Fractions',
      instructions: 'Read each question carefully and select the best answer. You have 30 minutes to complete this quiz.',
      questions: [
        { id: 'q1', text: 'What is 1/2 + 1/4?', options: ['3/4', '1/3', '2/6', '1/8'], type: 'multiple-choice' },
        { id: 'q2', text: 'Which fraction is larger: 2/3 or 3/5?', options: ['2/3', '3/5'], type: 'multiple-choice' },
        { id: 'q3', text: 'Define "numerator".', type: 'short-answer' },
      ],
    },
    'biology-cell-basics': {
      name: 'Cell Basics Quiz',
      instructions: 'Answer all questions to the best of your ability.',
      questions: [
        { id: 'q1', text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome'], type: 'multiple-choice' },
        { id: 'q2', text: 'Describe the function of the cell membrane.', type: 'short-answer' },
      ],
    },
  };

  $: quizId = $page.params.quiz_id;
  $: quiz = quizDatabase[quizId] || { name: 'Unknown Quiz', instructions: 'No instructions available.', questions: [] };
  $: quizName = quiz.name;

  function submitAnswers() {
    alert(`Submitting answers for ${quizName}... (This is a placeholder)`);
    // Actual submission logic would go here
  }
</script>

<div class="quiz-container">
  <h1>{quizName}</h1>

  <section class="quiz-instructions">
    <h2>Instructions</h2>
    <p>{quiz.instructions}</p>
  </section>

  <section class="quiz-questions">
    <h2>Questions</h2>
    {#if quiz.questions.length > 0}
      {#each quiz.questions as question, index}
        <div class="question-block">
          <p class="question-text"><strong>Question {index + 1}:</strong> {question.text}</p>
          {#if question.type === 'multiple-choice'}
            <ul class="options-list">
              {#each question.options as option}
                <li><label><input type="radio" name="q{question.id}" value={option}> {option}</label></li>
              {/each}
            </ul>
          {:else if question.type === 'short-answer'}
            <textarea rows="3" placeholder="Your answer here..." class="short-answer-input"></textarea>
          {/if}
        </div>
      {/each}
    {:else}
      <p>No questions available for this quiz or quiz ID is invalid.</p>
    {/if}
  </section>

  <div class="quiz-actions">
    <button on:click={submitAnswers} disabled={quiz.questions.length === 0}>Submit Answers</button>
  </div>
  
  <nav class="quiz-navigation">
    <a href="/curriculum">Back to Curriculum</a>
  </nav>
</div>

<style>
  .quiz-container {
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
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .quiz-instructions, .quiz-questions {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .question-block {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px dashed #ccc;
  }
  .question-block:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .question-text {
    margin-bottom: 0.75rem;
  }

  .options-list {
    list-style: none;
    padding-left: 0;
  }
  .options-list li {
    margin-bottom: 0.5rem;
  }
  
  .short-answer-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .quiz-actions {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .quiz-actions button {
    padding: 0.75rem 2rem;
    font-size: 1.2rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  .quiz-actions button:hover:not(:disabled) {
    background-color: #0056b3;
  }
  .quiz-actions button:disabled {
    background-color: #c0c0c0;
    cursor: not-allowed;
  }
  
  .quiz-navigation {
    text-align: center;
  }
  .quiz-navigation a {
    color: #007bff;
    text-decoration: none;
  }
  .quiz-navigation a:hover {
    text-decoration: underline;
  }
</style>
