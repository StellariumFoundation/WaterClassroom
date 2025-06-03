<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Checkbox from '$lib/components/ui/Checkbox.svelte';

  // Placeholder data
  let userName = "Jane Doe";
  let userEmail = "jane.doe@example.com";
  let accountType = "Water School Student";
  let currentCurriculum = "Grade 5 Math - Common Core";

  let emailNotifications = true;
  let languagePreference = "English"; // This would ideally be an object {value: 'en', label: 'English'}

  function saveChanges() {
    alert("Saving changes... (Placeholder)");
  }

  function logout() {
    alert("Logging out... (Placeholder)");
    // Potentially: await goto('/login');
  }

  function changePassword() {
    alert("Change Password functionality would typically open a modal or navigate to a new page. (Placeholder)");
  }
</script>

<svelte:head>
  <title>User Profile & Settings - Water Classroom</title>
</svelte:head>

<div class="profile-page-container">
  <h1 class="page-title">Profile & Settings</h1>

  <Card class="profile-card">
    <h2 slot="header">My Information</h2>

    <div class="info-grid">
      <Input label="Full Name" name="userName" bind:value={userName} disabled />
      <Input label="Email Address" name="userEmail" type="email" bind:value={userEmail} disabled />
      <Input label="Account Type" name="accountType" bind:value={accountType} disabled />
      <div class="form-item-with-action">
        <Input label="Current Curriculum" name="currentCurriculum" bind:value={currentCurriculum} disabled />
        <Button href="/curriculum" variant="tertiary" class="inline-action-button">Change</Button>
      </div>
    </div>
  </Card>

  <Card class="profile-card">
    <h2 slot="header">Account Settings</h2>

    <div class="settings-section">
      <div class="setting-item">
        <span class="setting-label">Password</span>
        <Button variant="secondary" onClick={changePassword}>Change Password</Button>
      </div>

      <Checkbox
        label="Receive email notifications for important updates and news."
        name="emailNotifications"
        bind:checked={emailNotifications}
        class="setting-checkbox"
      />

      <!-- Language Preference - conceptual, would need a Select component -->
      <div class="setting-item">
        <span class="setting-label">Language Preference</span>
        <Input name="language" value="English (US)" disabled class="language-input-disabled"/>
        <span class="field-note">(Language selection coming soon)</span>
      </div>
    </div>

    <div slot="footer" class="profile-actions-footer">
      <Button variant="primary" onClick={saveChanges}>Save All Changes</Button>
    </div>
  </Card>

  <div class="logout-section">
    <Button variant="danger" onClick={logout} class="logout-button">Logout</Button>
  </div>

</div>

<style>
  .page-title {
    text-align: center;
    margin-bottom: var(--spacing-xxl);
  }

  :global(.profile-card .card-header h2) {
    font-size: var(--font-size-h4);
    color: var(--primary-blue-darker);
    margin: 0;
  }

  .profile-card {
    margin-bottom: var(--spacing-xl); /* 24px */
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive grid for info items */
    gap: var(--spacing-lg) var(--spacing-xl);
  }

  /* For Input components used as display fields */
  :global(.info-grid .form-control .styled-input:disabled) {
    background-color: var(--neutral-white); /* Make disabled inputs look like text */
    border-color: transparent; /* var(--neutral-border) if you want a subtle box */
    color: var(--neutral-text-body);
    opacity: 1;
    padding-left: 0; /* Remove padding for text-like appearance */
    padding-right: 0;
  }
  :global(.info-grid .form-control .input-label) {
    font-size: var(--font-size-tiny); /* Smaller label for "display" fields */
    color: var(--neutral-text-subtle);
    text-transform: uppercase;
    font-weight: var(--font-weight-medium);
  }

  .form-item-with-action {
    display: flex;
    align-items: flex-end; /* Align input bottom with button bottom */
    gap: var(--spacing-md);
  }
  :global(.form-item-with-action .form-control) {
    flex-grow: 1; /* Input takes available space */
    margin-bottom: 0; /* Remove default margin from Input component */
  }
  .inline-action-button {
    /* Adjust height or padding if needed to match input field height */
    white-space: nowrap;
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl); /* Spacing between setting items */
  }
  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between; /* Label on left, control on right */
    flex-wrap: wrap; /* Wrap if not enough space */
    gap: var(--spacing-md);
  }
  .setting-label {
    font-weight: var(--font-weight-medium);
    color: var(--neutral-text-body);
  }
  :global(.setting-checkbox.checkbox-control) { /* Target the specific checkbox */
    margin-bottom: 0; /* Override default if any */
    width: 100%; /* Take full width for consistent spacing */
  }
  .language-input-disabled {
    flex-grow: 1;
    max-width: 200px; /* Example max width */
  }
  :global(.language-input-disabled.styled-input:disabled) {
     background-color: var(--neutral-bg);
     border-color: var(--neutral-border);
  }
  .field-note {
    font-size: var(--font-size-small);
    color: var(--neutral-text-subtle);
  }

  :global(.profile-actions-footer) {
    justify-content: flex-end;
  }

  .logout-section {
    margin-top: var(--spacing-xxl);
    display: flex;
    justify-content: center; /* Center logout button */
  }
  .logout-button {
    min-width: 150px; /* Give logout some width */
  }
</style>
