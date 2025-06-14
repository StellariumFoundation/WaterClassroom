<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Checkbox from '$lib/components/ui/Checkbox.svelte';

  let email = '';
  let password = '';
  let confirmPassword = '';
  let isStudent = false;

  function handleSubmit() {
    if (password !== confirmPassword) {
      alert("Passwords do not match!"); // Replace with a better notification later
      return;
    }
    // Basic form handling logic will go here in later tasks
    console.log('Sign Up attempt with:', { email, isStudent });
    alert(`Sign Up with Email: ${email}, Student: ${isStudent}. This is a placeholder action.`);
  }
</script>

<svelte:head>
  <title>Sign Up - Water Classroom</title>
</svelte:head>

<div class="auth-page-container">
  <Card>
    <h1 slot="header" class="card-title">Create Your Account</h1>

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
        placeholder="Create a strong password"
        bind:value={password}
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Re-enter your password"
        bind:value={confirmPassword}
        required
      />
      <Checkbox
        label="I am a Water School student"
        name="isStudent"
        id="isStudent"
        bind:checked={isStudent}
      />
      <Button type="submit" variant="primary" class="submit-button">Create Account</Button>
    </form>

    <div slot="footer" class="auth-links">
      <a href="/login">Already have an account? Login</a>
    </div>
  </Card>
</div>

<style>
  .auth-page-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 70vh;
    padding: var(--spacing-xxl) var(--spacing-lg);
  }

  :global(.auth-page-container .card) {
    width: 100%;
    max-width: 420px;
  }

  .card-title {
    font-size: var(--font-size-h3);
    font-weight: var(--font-weight-semibold);
    text-align: center;
    margin:0;
  }

  .submit-button {
    width: 100%;
    margin-top: var(--spacing-lg);
  }

  /* Ensure checkbox is spaced correctly */
  :global(.auth-page-container .checkbox-control) {
    margin-top: var(--spacing-md);
    margin-bottom: var(--spacing-xl); /* More space before button */
  }

  .auth-links {
    display: flex;
    justify-content: center; /* Center single link */
    align-items: center;
    font-size: var(--font-size-small);
    width: 100%;
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
