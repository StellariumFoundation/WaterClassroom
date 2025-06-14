<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/ui/Button.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  // Conceptual: RadioGroup and RadioItem components would be ideal here.
  // For now, we'll style the native inputs within the Card.

  // Placeholder data
  const quizDatabase: { [key: string]: { name: string, instructions: string, questions: Array<{id: string, text: string, options?: string[], type: 'multiple-choice' | 'short-answer'}> } } = {
    'ch1-fractions-quiz': {
      name: 'Quiz: Chapter 1 Fractions',
      instructions: 'Read each question carefully and select the best answer. You have 30 minutes to complete this quiz.',
      questions: [
        { id: 'q1', text: 'What is 1/2 + 1/4?', options: ['3/4', '1/3', '2/6', '1/8'], type: 'multiple-choice' },
        { id: 'q2', text: 'Which fraction is larger: 2/3 or 3/5?', options: ['2/3', '3/5'], type: 'multiple-choice' },
        { id: 'q3', text: 'Define "numerator" in one sentence.', type: 'short-answer' },
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
  }
</script>

<svelte:head>
  <title>{quizName} - Water Classroom</title>
</svelte:head>

<div class="quiz-page-container">
  <div class="page-header">
    <!-- Conceptual: Back to lesson link -->
    <!-- <Button href="/curriculum" variant="tertiary">&larr; Back to Lesson</Button> -->
  </div>
  <h1 class="page-title">{quizName}</h1>

  <Card class="quiz-card">
    <div slot="header" class="quiz-card-header">
      <h2>Instructions</h2>
      <p>{quiz.instructions}</p>
    </div>

    <form on:submit|preventDefault={submitAnswers} class="quiz-form">
      {#if quiz.questions.length > 0}
        {#each quiz.questions as question, index}
          <fieldset class="question-block">
            <legend class="question-text">Question {index + 1}: {question.text}</legend>

            {#if question.type === 'multiple-choice'}
              <div class="options-group">
                {#each question.options as option, i (option)}
                  <label class="radio-label">
                    <input type="radio" name="q{question.id}" value={option} class="styled-radio" />
                    <span>{option}</span>
                  </label>
                {/each}
              </div>
            {:else if question.type === 'short-answer'}
              <!-- Using a simple textarea for now. A dedicated Input component for textarea might be better. -->
              <textarea rows="4" placeholder="Your answer here..." class="short-answer-textarea"></textarea>
            {/if}
          </fieldset>
        {/each}

        <Button type="submit" variant="primary" class="submit-quiz-button">Submit Answers</Button>
      {:else}
        <p class="no-questions-message">No questions available for this quiz or quiz ID is invalid.</p>
      {/if}
    </form>

    <div slot="footer" class="quiz-actions-footer">
        <Button href="/curriculum" variant="tertiary">Cancel and Back to Curriculum</Button>
    </div>
  </Card>
</div>

<style>
  .quiz-page-container {
    /* Max width handled by .app-content */
  }
  .page-header {
    /* For potential back button */
    margin-bottom: var(--spacing-md);
  }
  .page-title {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }

  .quiz-card {
    width: 100%;
    max-width: 780px; /* Wider card for quiz content */
    margin: 0 auto; /* Center the card */
  }

  .quiz-card-header {
    padding-bottom: var(--spacing-md);
  }
  .quiz-card-header h2 {
    font-size: var(--font-size-h5);
    color: var(--primary-blue-darker);
    margin: 0 0 var(--spacing-sm) 0;
  }
  .quiz-card-header p {
    font-size: var(--font-size-body);
    color: var(--neutral-text-subtle);
    margin:0;
  }

  .quiz-form {
    margin-top: var(--spacing-lg);
  }

  .question-block {
    margin-bottom: var(--spacing-xl); /* 24px */
    padding-bottom: var(--spacing-xl);
    border: none; /* Remove fieldset default border */
    padding: 0; /* Reset fieldset default padding */
    border-bottom: 1px solid var(--neutral-border); /* Separator line */
  }
  .question-block:last-of-type {
    border-bottom: none;
    margin-bottom: var(--spacing-xxl); /* More space before submit button */
  }

  .question-text {
    font-size: var(--font-size-h6); /* Using h6 size for question text */
    font-weight: var(--font-weight-medium);
    color: var(--neutral-text-body);
    margin-bottom: var(--spacing-lg); /* 16px */
    display: block; /* Make legend behave like a block */
  }

  .options-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md); /* 12px */
  }
  .radio-label {
    display: flex;
    align-items: center;
    padding: var(--spacing-md); /* 12px */
    background-color: var(--neutral-white);
    border: 1px solid var(--neutral-border);
    border-radius: var(--border-radius-base);
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease;
  }
  .radio-label:hover {
    border-color: var(--primary-blue-lighter);
    background-color: var(--primary-blue-lighter);
  }
  .radio-label input[type="radio"]:checked + span {
    font-weight: var(--font-weight-medium);
    color: var(--primary-blue-darker);
  }

  .styled-radio {
    width: 1.15em;
    height: 1.15em;
    margin-right: var(--spacing-md); /* 12px */
    accent-color: var(--primary-blue);
    flex-shrink: 0; /* Prevent radio from shrinking */
  }
  .styled-radio:focus-visible {
    outline: 2px solid var(--primary-blue-lighter);
    outline-offset: 2px;
  }
  .radio-label span {
    flex-grow: 1;
  }

  .short-answer-textarea {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--neutral-border);
    border-radius: var(--border-radius-base);
    font-family: var(--font-family-system);
    font-size: var(--font-size-body);
    line-height: var(--line-height-base);
    background-color: var(--neutral-white);
    color: var(--neutral-text-body);
    box-sizing: border-box;
    resize: vertical; /* Allow vertical resize */
    min-height: 80px;
  }
  .short-answer-textarea:focus {
    border-color: var(--primary-blue);
    outline: 0;
    box-shadow: 0 0 0 3px var(--primary-blue-lighter);
  }

  .submit-quiz-button {
    width: 100%;
    max-width: 300px; /* Max width for submit button */
    display: block;
    margin: var(--spacing-xl) auto 0 auto; /* Center button */
  }

  .no-questions-message {
    text-align: center;
    color: var(--neutral-text-subtle);
    padding: var(--spacing-xl) 0;
  }

  :global(.quiz-card .quiz-actions-footer) {
    justify-content: center; /* Center cancel button */
  }
</style>
