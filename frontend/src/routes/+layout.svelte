<script lang="ts">
  import '$lib/styles/theme.css'; // Import the CSS variables
  import { page } from '$app/stores'; // For active link styling

  // Define navigation links to make it easier to manage
  const navLinks = [
    { href: '/', text: 'Home' },
    { href: '/dashboard', text: 'Dashboard' },
    { href: '/curriculum', text: 'Curriculum' },
    { href: '/profile', text: 'Profile' },
    // Login/Auth link would typically be conditional
    { href: '/login', text: 'Login', class: 'nav-auth-link' }
  ];
</script>

<div class="app-container">
  <header class="app-header">
    <div class="header-content">
      <a href="/" class="nav-logo">
        <!-- Placeholder for a potential SVG logo later -->
        <span class="logo-text">WaterClassroom</span>
      </a>
      <nav class="main-nav">
        <ul>
          {#each navLinks as link}
            <li>
              <a
                href={link.href}
                class="{link.class || ''} {$page.url.pathname === link.href ? 'active' : ''}"
              >
                {link.text}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </div>
  </header>

  <main class="app-content">
    <slot />
  </main>

  <footer class="app-footer">
    <div class="footer-content">
      <p>&copy; {new Date().getFullYear()} Water Classroom Platform. All rights reserved.</p>
      <nav class="footer-nav">
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
      </nav>
    </div>
  </footer>
</div>

<style>
  :global(:root) {
    /* Ensure theme variables are loaded. Redundant if theme.css is always first, but safe. */
    /* Actual variables are in theme.css */
    font-size: var(--font-size-base, 16px); /* Fallback if theme.css not loaded */
  }

  :global(body) {
    margin: 0;
    font-family: var(--font-family-system);
    font-size: var(--font-size-body);
    line-height: var(--line-height-base);
    color: var(--neutral-text-body);
    background-color: var(--neutral-white); /* Changed to white for a cleaner Apple-like canvas */
    -webkit-font-smoothing: antialiased; /* Smoother fonts on WebKit */
    -moz-osx-font-smoothing: grayscale; /* Smoother fonts on Firefox */
  }

  /* More refined global link styling */
  :global(a) {
    color: var(--primary-blue);
    text-decoration: none;
    transition: color 0.15s ease-in-out;
  }
  :global(a:hover) {
    color: var(--primary-blue-darker);
    text-decoration: underline; /* Keep underline on hover for accessibility */
  }

  /* Consistent heading styles */
  :global(h1), :global(h2), :global(h3), :global(h4), :global(h5), :global(h6) {
    margin-top: var(--spacing-xxl); /* More top margin */
    margin-bottom: var(--spacing-lg);
    color: var(--neutral-text-body);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-heading);
  }
  :global(h1) { font-size: var(--font-size-h1); font-weight: var(--font-weight-bold); }
  :global(h2) { font-size: var(--font-size-h2); font-weight: var(--font-weight-bold); }
  :global(h3) { font-size: var(--font-size-h3); }
  :global(h4) { font-size: var(--font-size-h4); }
  :global(h5) { font-size: var(--font-size-h5); }
  :global(h6) { font-size: var(--font-size-h6); }

  :global(p) {
    margin-top: 0;
    margin-bottom: var(--spacing-lg);
  }

  /* Overall app container for potential future full-height layouts */
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Header Redesign */
  .app-header {
    background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white for a subtle effect */
    backdrop-filter: saturate(180%) blur(20px); /* Frosted glass effect (Apple-like) */
    -webkit-backdrop-filter: saturate(180%) blur(20px); /* For Safari */
    border-bottom: 1px solid var(--neutral-border);
    position: sticky;
    top: 0;
    z-index: 100;
    width: 100%;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1280px; /* Slightly wider max-width */
    margin: 0 auto;
    padding: var(--spacing-md) var(--spacing-xl); /* 12px 24px */
    flex-wrap: wrap;
  }

  .nav-logo {
    font-weight: var(--font-weight-semibold); /* Semibold for a more refined look */
    font-size: var(--font-size-h5); /* 1.25rem */
    color: var(--neutral-text-body); /* Use body text color for logo for subtlety */
    text-decoration: none;
    display: flex;
    align-items: center;
  }
  .nav-logo:hover {
    text-decoration: none;
    color: var(--primary-blue); /* Highlight on hover */
  }

  .main-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap; /* Ensure nav items wrap on smaller screens */
  }

  .main-nav li {
    margin-left: var(--spacing-sm); /* 8px - tighter spacing for sophisticated look */
  }
  .main-nav li:first-child {
    margin-left: 0;
  }

  .main-nav a {
    font-family: var(--font-family-system);
    font-weight: var(--font-weight-medium); /* Medium weight for nav links */
    font-size: var(--font-size-body); /* Standard body size for nav links */
    color: var(--neutral-text-subtle); /* Subtler color for nav links */
    text-decoration: none;
    padding: var(--spacing-sm) var(--spacing-md); /* 8px 12px */
    border-radius: var(--border-radius-base); /* 6px */
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .main-nav a:hover {
    color: var(--primary-blue);
    background-color: var(--primary-blue-lighter); /* Subtle background on hover */
    text-decoration: none;
  }
  .main-nav a.active {
    color: var(--primary-blue-darker); /* More prominent for active link */
    font-weight: var(--font-weight-semibold);
    background-color: var(--primary-blue-lighter);
  }

  /* Main Content Area */
  .app-content {
    flex-grow: 1; /* Ensures content area takes up available space */
    padding: var(--spacing-xxl) var(--spacing-xl); /* 32px 24px */
    max-width: 1200px; /* Max content width */
    width: 100%;
    margin: 0 auto; /* Centering content */
    box-sizing: border-box;
  }

  /* Footer Redesign */
  .app-footer {
    text-align: center;
    padding: var(--spacing-xl) var(--spacing-xl); /* 24px */
    background-color: var(--neutral-bg); /* Light gray background */
    border-top: 1px solid var(--neutral-border);
    font-size: var(--font-size-small); /* 14px */
    color: var(--neutral-text-subtle);
  }
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column; /* Stack copyright and nav */
    align-items: center;
    gap: var(--spacing-md); /* 12px gap */
  }
  .app-footer p {
    margin: 0;
  }
  .footer-nav {
    display: flex;
    gap: var(--spacing-lg); /* 16px */
  }
  .footer-nav a {
    color: var(--neutral-text-subtle);
  }
  .footer-nav a:hover {
    color: var(--primary-blue);
  }
</style>
