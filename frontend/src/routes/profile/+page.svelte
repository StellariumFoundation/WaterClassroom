<script lang="ts">
  // Placeholder data - in a real app, this would be fetched or from a store
  let userName = "Jane Doe";
  let userEmail = "jane.doe@example.com";
  let accountType = "Water School Student";
  let currentCurriculum = "Grade 5 Math - Common Core";

  // Placeholder for settings
  let emailNotifications = true;
  let languagePreference = "English";

  function saveChanges() {
    alert("Saving changes... (This is a placeholder)");
    // Actual save logic would go here
  }

  function logout() {
    alert("Logging out... (This is a placeholder)");
    // Actual logout logic would go here, likely redirecting to /login
  }

  function changePassword() {
    alert("Change Password functionality not implemented yet.");
    // Would typically navigate to a new page or show a modal
  }
</script>

<div class="profile-container">
  <h1>User Profile & Settings</h1>

  <section class="profile-section info-section">
    <h2>My Information</h2>
    <div class="info-item">
      <span class="info-label">Name:</span>
      <span class="info-value">{userName}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Email:</span>
      <span class="info-value">{userEmail}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Account Type:</span>
      <span class="info-value">{accountType}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Current Curriculum:</span>
      <span class="info-value">{currentCurriculum}</span>
      <!-- Placeholder link to change curriculum -->
      <a href="/curriculum" class="change-link">(Change)</a>
    </div>
  </section>

  <section class="profile-section settings-section">
    <h2>Settings</h2>
    
    <div class="setting-item">
      <span class="setting-label">Password:</span>
      <button class="inline-button" on:click={changePassword}>Change Password</button>
    </div>

    <div class="setting-item">
      <label for="notifications">
        <input type="checkbox" id="notifications" bind:checked={emailNotifications} />
        Email me about platform updates and news.
      </label>
    </div>

    <div class="setting-item">
      <label for="language">Language Preference:</label>
      <!-- In a real app, this would be a select dropdown -->
      <select id="language" bind:value={languagePreference} disabled>
        <option value="English">English</option>
        <option value="Spanish">Español (Placeholder)</option>
        <option value="French">Français (Placeholder)</option>
      </select>
      <span class="field-note">(Language selection coming soon)</span>
    </div>
  </section>

  <section class="profile-actions">
    <button class="save-btn" on:click={saveChanges}>Save Changes</button>
    <button class="logout-btn" on:click={logout}>Logout</button>
  </section>
</div>

<style>
  .profile-container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }

  .profile-section {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .profile-section h2 {
    margin-top: 0;
    margin-bottom: 1.25rem;
    color: #0056b3;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }

  .info-item, .setting-item {
    margin-bottom: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .info-label, .setting-label {
    font-weight: bold;
    color: #555;
    margin-right: 0.5rem;
    min-width: 150px; /* Align values */
  }
  
  .info-value {
    color: #333;
  }

  .change-link {
    font-size: 0.85em;
    margin-left: 0.5rem;
    color: #007bff;
    text-decoration: none;
  }
  .change-link:hover {
    text-decoration: underline;
  }

  .setting-item label {
    display: flex;
    align-items: center;
    width: 100%; /* Full width for checkbox label */
  }
  
  .setting-item input[type="checkbox"] {
    margin-right: 0.5rem;
  }
  
  .setting-item select {
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-left: 0.5rem;
  }
  .setting-item select:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
  .field-note {
    font-size: 0.8em;
    color: #777;
    margin-left: 0.5rem;
  }

  .inline-button {
    padding: 0.3rem 0.8rem;
    font-size: 0.9em;
    background-color: #6c757d; /* Secondary button color */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .inline-button:hover {
    background-color: #5a6268;
  }
  
  .profile-actions {
    text-align: center;
    margin-top: 2rem;
  }

  .profile-actions button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 0.5rem;
  }

  .save-btn {
    background-color: #007bff; /* Primary action */
    color: white;
  }
  .save-btn:hover {
    background-color: #0056b3;
  }

  .logout-btn {
    background-color: #dc3545; /* Destructive action */
    color: white;
  }
  .logout-btn:hover {
    background-color: #c82333;
  }
</style>
