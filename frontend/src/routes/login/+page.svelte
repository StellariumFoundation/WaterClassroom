<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let email = '';
  let password = '';

  function handleSubmit() {
    // Basic form handling logic will go here in later tasks
    console.log('Login attempt with:', { email, password });
    // Consider showing a notification component later instead of alert
    alert(`Login attempt with Email: ${email}. This is a placeholder action.`);
  }
</script>

<svelte:head>
  <title>Login - Water Classroom</title>
</svelte:head>

<div class="auth-page-container">
  <Card>
    <h1 slot="header" class="card-title">Welcome Back</h1>

    <form on:submit|preventDefault={handleSubmit}>
      <Input
        label="Email Address"
        type="email"
        name="email"
        id="email"
        placeholder="you@example.com"
        bind:value={email}
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        id="password"
        placeholder="Enter your password"
        bind:value={password}
        required
      />
      <Button type="submit" variant="primary" class="submit-button">Login</Button>
    </form>

    <div slot="footer" class="auth-links">
      <a href="/password-reset">Forgot Password?</a>
      <span>&bull;</span>
      <a href="/signup">Don't have an account? Sign Up</a>
    </div>
  </Card>
</div>

<style>
  .auth-page-container {
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Align to top if page is very tall */
    min-height: 70vh; /* Ensure card is somewhat centered vertically for short content */
    padding: var(--spacing-xxl) var(--spacing-lg); /* 32px 16px */
  }

  /* Make Card component take a specific width for auth forms */
  :global(.auth-page-container .card) {
    width: 100%;
    max-width: 420px; /* Max width for the auth card */
  }

  .card-title {
    font-size: var(--font-size-h3); /* Using theme variables for title size */
    font-weight: var(--font-weight-semibold);
    text-align: center;
    margin: 0; /* Reset margin if Card header adds its own */
  }

  .submit-button {
    width: 100%; /* Make button full width */
    margin-top: var(--spacing-lg); /* 16px space above button */
  }

  .auth-links {
    display: flex;
    justify-content: space-between; /* Space out links */
    align-items: center;
    font-size: var(--font-size-small); /* 14px */
    width: 100%; /* Ensure it takes full width of footer */
  }
  .auth-links span {
    color: var(--neutral-text-subtle);
  }
  .auth-links a {
    color: var(--primary-blue);
    text-decoration: none;
  }
  .auth-links a:hover {
    text-decoration: underline;
    color: var(--primary-blue-darker);
  }
</style>
