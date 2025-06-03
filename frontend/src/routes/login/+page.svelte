<script lang="ts">
  let email = '';
  let password = '';

  function handleSubmit() {
    // Basic form handling logic will go here in later tasks
    console.log('Login attempt with:', { email, password });
    alert(`Login attempt with Email: ${email}`);
  }
</script>

<div class="container">
  <h1>Login</h1>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} required />
    </div>

    <button type="submit">Login</button>
  </form>

  <div class="links">
    <p><a href="/signup">Don't have an account? Sign Up</a></p>
    <p><a href="/password-reset">Forgot Password?</a></p>
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
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  button:hover {
    background-color: #0056b3;
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
