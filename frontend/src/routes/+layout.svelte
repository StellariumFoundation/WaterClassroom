<script lang="ts">
  // Optional: Import global styles or components if needed in the future
  // import '$lib/styles/global.css'; // Example if you add global styles
</script>

<header class="app-header">
  <nav class="main-nav">
    <a href="/" class="nav-logo">WaterClassroom</a>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/dashboard">Dashboard</a></li>
      <li><a href="/curriculum">Curriculum</a></li>
      <li><a href="/profile">Profile</a></li>
      <li><a href="/login" class="nav-login">Login</a></li> 
      <!-- Login/Logout link would be conditional based on auth state later -->
    </ul>
  </nav>
</header>

<main class="app-content">
  <slot />
</main>

<footer class="app-footer">
  <p>&copy; {new Date().getFullYear()} Water Classroom. All rights reserved.</p>
  <!-- Add other footer links or info here if needed -->
</footer>

<style>
  /* Basic Reset & Global Styles (very minimal) */
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f7f6; /* Light off-white background */
  }

  :global(a) {
    color: #007bff; /* Primary link color */
    text-decoration: none;
  }
  :global(a:hover) {
    text-decoration: underline;
  }
  
  :global(h1, h2, h3, h4, h5, h6) {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    color: #2c3e50; /* Darker heading color */
  }
  :global(h1) { font-size: 2.2rem; }
  :global(h2) { font-size: 1.8rem; }
  :global(h3) { font-size: 1.5rem; }


  /* Layout Structure */
  .app-header {
    background-color: #ffffff; /* White header */
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #e0e0e0; /* Subtle border */
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    position: sticky; /* Keep header at top */
    top: 0;
    z-index: 100; /* Ensure header stays above content */
  }

  .main-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px; /* Max width for content within header */
    margin: 0 auto; /* Center nav content */
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
  }

  .nav-logo {
    font-weight: bold;
    font-size: 1.5rem;
    color: #0056b3; /* Darker blue for logo */
    text-decoration: none;
  }
  .nav-logo:hover {
    text-decoration: none;
  }

  .main-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap; /* Allow nav items to wrap */
  }

  .main-nav li {
    margin-left: 1rem;
  }
  .main-nav li:first-child {
    margin-left: 0;
  }

  .main-nav a {
    color: #333; /* Standard nav link color */
    text-decoration: none;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  }

  .main-nav a:hover,
  .main-nav a.active { /* Concept for active link styling */
    background-color: #e9ecef; /* Light gray background on hover/active */
    color: #0056b3;
  }
  
  .nav-login {
    /* Optional: style login link differently */
    /* background-color: #007bff;
    color: white; */
  }
  /* .nav-login:hover {
    background-color: #0056b3;
    color: white;
  } */


  .app-content {
    padding: 1rem; 
    max-width: 1200px; /* Consistent max-width */
    margin: 1rem auto; /* Centering content and adding space from header/footer */
    min-height: calc(100vh - 150px); /* Approximate height to push footer down */
  }

  .app-footer {
    text-align: center;
    padding: 1rem;
    background-color: #343a40; /* Dark footer */
    color: #f8f9fa; /* Light text on dark background */
    border-top: 1px solid #495057;
    font-size: 0.9rem;
  }
  .app-footer p {
    margin: 0;
  }
</style>
