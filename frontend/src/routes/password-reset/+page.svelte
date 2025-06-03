<script lang="ts">
  let email = '';

  function handleSubmit() {
    // Basic form handling logic will go here in later tasks
    console.log('Password reset request for:', email);
    alert(`Password reset link would be sent to: ${email}`);
  }
</script>

<div class="container">
  <h1>Reset Password</h1>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required />
    </div>

    <button type="submit">Send Reset Link</button>
  </form>

  <div class="links">
    <p><a href="/login">Back to Login</a></p>
  </div>
</div>

<style>
  .container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  label {
    display: block;
    margin-bottom: 0.25rem;
  }
  input[type="email"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #ffc107; /* Yellow for warning/reset */
    color: #212529;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  button:hover {
    background-color: #e0a800;
  }
  .links {
    margin-top: 1.5rem;
    text-align: center;
  }
  .links a {
    color: #007bff;
    text-decoration: none;
  }
  .links a:hover {
    text-decoration: underline;
  }
</style>
