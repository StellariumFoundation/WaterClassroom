<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let email = '';

  function handleSubmit() {
    // Basic form handling logic will go here in later tasks
    console.log('Password reset request for:', email);
    alert(`Password reset link would be sent to: ${email}. This is a placeholder action.`);
  }
</script>

<svelte:head>
  <title>Reset Password - Water Classroom</title>
</svelte:head>

<div class="auth-page-container">
  <Card>
    <h1 slot="header" class="card-title">Reset Your Password</h1>

    <form on:submit|preventDefault={handleSubmit}>
      <p class="reset-instructions">
        Enter the email address associated with your account, and we'll send you a link to reset your password.
      </p>
      <Input
        label="Email Address"
        type="email"
        name="email"
        id="email"
        placeholder="you@example.com"
        bind:value={email}
        required
      />
      <Button type="submit" variant="primary" class="submit-button">Send Reset Link</Button>
    </form>

    <div slot="footer" class="auth-links">
      <a href="/login">Back to Login</a>
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

  .reset-instructions {
    font-size: var(--font-size-body);
    color: var(--neutral-text-subtle);
    text-align: center;
    margin-bottom: var(--spacing-xl); /* Space before input */
  }

  .submit-button {
    width: 100%;
    margin-top: var(--spacing-lg);
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
