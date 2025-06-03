<script lang="ts">
  let email = '';
  let password = '';
  let confirmPassword = '';
  let isStudent = false;

  function handleSubmit() {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Basic form handling logic will go here in later tasks
    console.log('Sign Up attempt with:', { email, password, isStudent });
    alert(`Sign Up attempt with Email: ${email}, Student: ${isStudent}`);
  }
</script>

<div class="container">
  <h1>Sign Up</h1>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={password} required />
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirm Password</label>
      <input type="password" id="confirmPassword" bind:value={confirmPassword} required />
    </div>

    <div class="form-group checkbox-group">
      <input type="checkbox" id="isStudent" bind:checked={isStudent} />
      <label for="isStudent" class="checkbox-label">I am a Water School student</label>
    </div>

    <button type="submit">Sign Up</button>
  </form>

  <div class="links">
    <p><a href="/login">Already have an account? Login</a></p>
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
  .checkbox-group {
    display: flex;
    align-items: center;
  }
  input[type="checkbox"] {
    margin-right: 0.5rem;
  }
  .checkbox-label {
    margin-bottom: 0; /* Override default block label margin */
  }
  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #28a745; /* Green for sign up */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  button:hover {
    background-color: #218838;
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
