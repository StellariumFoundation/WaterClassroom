import React from 'react';
import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom'; // ProfilePage uses useNavigate
import { AuthProvider, AuthContextType } from '../../contexts/AuthContext'; // Adjust path
import ProfilePage from '../ProfilePage'; // Adjust path

// Mock constants used by the page
jest.mock('../../constants', () => ({
  ...jest.requireActual('../../constants'), // Preserve other constants
  APP_ROUTES: {
    AUTH: '/auth',
    HOME: '/',
    PRICING: '/pricing', // Make sure this is defined if navigate to pricing is used
    CURRICULUM_SELECT: '/curriculum-select',
  },
  MOCK_BADGES: [ // Provide mock badges if the component relies on them
    { id: 'badge1', name: 'Initiator', icon: 'Star', description: 'Started learning' },
    { id: 'badge2', name: 'Committed', icon: 'CheckCircle', description: 'Completed 5 lessons' },
  ],
}));

// Mock implementation for useAuth hook
const mockUser = {
  id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  avatarUrl: 'https://example.com/avatar.png',
  onboarding_complete: true,
  // Mock subscription data as expected by the component
  subscription: {
    planName: 'Homeschool Plan',
    isActive: true,
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), // 30 days from now
  },
  // Mock other user properties if needed by the page
  badges: [{ id: 'badge1', name: 'Initiator', icon: 'Star', description: 'Started learning' }],
  progress: { overallProgress: 75 },
  streak: 10,
};

const mockAuthContextValue: AuthContextType = {
  user: mockUser,
  loading: false,
  isAuthenticated: true,
  selectedCurriculumId: 'curr_123',
  selectedCurriculumDetails: { id: 'curr_123', name: 'Math Basics', description: 'Fundamental math concepts', subject: 'Math', gradeLevel: '5th Grade', tags: [], lectures: [] },
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
  fetchCurrentUser: jest.fn(),
  updateUserOnboarding: jest.fn(),
  updateUserCurriculum: jest.fn(),
  handleOAuthCallback: jest.fn(),
};

const renderProfilePage = (authContextValue = mockAuthContextValue) => {
  return render(
    <BrowserRouter>
      <AuthProvider value={authContextValue}> {/* Custom AuthProvider that accepts a value prop for testing */}
        <ProfilePage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProfilePage', () => {
  // Existing tests for rendering user info, subscription, payment history
  it('renders user information correctly', () => {
    renderProfilePage();
    // User's display name might be user.displayName or user.name depending on context setup
    expect(screen.getByText(mockUser.displayName || mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('renders subscription status section with placeholder data', () => {
    renderProfilePage();
    expect(screen.getByRole('heading', { name: /Subscription Status/i })).toBeInTheDocument();
    expect(screen.getByText(`Current Plan: ${mockUser.subscription.planName}`)).toBeInTheDocument();
    expect(screen.getByText(`Status: ${mockUser.subscription.isActive ? 'Active' : 'Inactive'}`)).toBeInTheDocument();
    const expectedDate = new Date(mockUser.subscription.expiryDate).toLocaleDateString();
    expect(screen.getByText(`Renews on: ${expectedDate}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Manage Subscription/i })).toBeInTheDocument();
  });

  it('renders payment history section with placeholder table', () => {
    renderProfilePage();
    expect(screen.getByRole('heading', { name: /Payment History/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Date/i })).toBeInTheDocument();
    expect(screen.getByText('2024-05-01')).toBeInTheDocument(); // Example data
  });

  it('shows "View Plans" button if no subscription is active', () => {
    const userWithoutSubscription = { ...mockUser, subscription: null };
    renderProfilePage({ ...mockAuthContextValue, user: userWithoutSubscription });
    expect(screen.getByText(/No active subscription found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Plans/i })).toBeInTheDocument();
  });


  describe('Profile Editing Functionality', () => {
    // Mock global fetch before tests in this suite
    const mockFetch = jest.fn();
    beforeEach(() => {
      global.fetch = mockFetch;
      mockFetch.mockClear(); // Clear mock usage history before each test
    });
    afterEach(() => {
      jest.restoreAllMocks(); // Restore original fetch if needed, or ensure it's reset
    });

    it('toggles editing mode when "Edit Profile" and "Cancel" buttons are clicked', () => {
      renderProfilePage();
      const editButton = screen.getByRole('button', { name: /Edit Profile/i });

      // Enter editing mode
      fireEvent.click(editButton);
      expect(screen.getByLabelText(/Display Name/i)).toBeInTheDocument(); // Input field now visible
      expect(screen.getByLabelText(/Avatar URL/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      expect(cancelButton).toBeInTheDocument();

      // Exit editing mode using Cancel
      fireEvent.click(cancelButton);
      expect(screen.queryByLabelText(/Display Name/i)).not.toBeInTheDocument(); // Input field hidden
      expect(screen.queryByLabelText(/Avatar URL/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument(); // Edit button back
    });

    it('allows inputting new name and avatar URL in editing mode', () => {
      renderProfilePage();
      fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));

      const nameInput = screen.getByLabelText(/Display Name/i) as HTMLInputElement;
      const avatarUrlInput = screen.getByLabelText(/Avatar URL/i) as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: 'New Name' } });
      expect(nameInput.value).toBe('New Name');

      fireEvent.change(avatarUrlInput, { target: { value: 'http://example.com/new.png' } });
      expect(avatarUrlInput.value).toBe('http://example.com/new.png');
    });

    it('calls API and AuthContext on successful save with only name changed', async () => {
      const mockUpdateUserInContext = jest.fn();
      // Initial user has name 'Test User' (from mockUser.displayName or mockUser.name)
      // We need to use mockUser.displayName as that's what the backend gives us in CurrentUserResponse
      const initialUserForContext = { ...mockUser, displayName: 'Test User DisplayName', avatarUrl: { String: 'http://example.com/avatar.png', Valid: true }};

      renderProfilePage({ ...mockAuthContextValue, user: initialUserForContext, updateUserInContext: mockUpdateUserInContext, token: 'fake-token' });
      fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));

      const nameInput = screen.getByLabelText(/Display Name/i);
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

      // Mock fetch response for successful update
      const updatedUserDataFromApi = { ...initialUserForContext, display_name: 'Updated Name' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedUserDataFromApi,
      });

      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

      // Assertions
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/v1/user/me', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer fake-token',
          },
          body: JSON.stringify({ display_name: 'Updated Name' }),
        });
      });

      await waitFor(() => {
        expect(mockUpdateUserInContext).toHaveBeenCalledWith(updatedUserDataFromApi);
      });

      // Check for success message (disappears after timeout, so might need careful handling or to remove timeout in test env)
      // For simplicity, check if it appears briefly
      // await screen.findByText('Profile updated successfully!'); // findByText waits for appearance

      // Check if editing mode is exited
      expect(screen.queryByRole('button', { name: /Save Changes/i })).not.toBeInTheDocument();
      expect(screen.getByText('Updated Name')).toBeInTheDocument(); // Display updated name
    });

    it('calls API and AuthContext on successful save with only avatar URL changed', async () => {
        const mockUpdateUserInContext = jest.fn();
        const initialUserForContext = { ...mockUser, displayName: 'Test User DisplayName', avatarUrl: { String: 'http://example.com/avatar.png', Valid: true }};
        renderProfilePage({ ...mockAuthContextValue, user: initialUserForContext, updateUserInContext: mockUpdateUserInContext, token: 'fake-token' });
        fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));

        const avatarUrlInput = screen.getByLabelText(/Avatar URL/i);
        fireEvent.change(avatarUrlInput, { target: { value: 'http://example.com/new_avatar.png' } });

        const updatedUserDataFromApi = { ...initialUserForContext, avatar_url: { String: 'http://example.com/new_avatar.png', Valid: true } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => updatedUserDataFromApi,
        });

        fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledWith('/api/v1/user/me',expect.objectContaining({
            body: JSON.stringify({ avatar_url: 'http://example.com/new_avatar.png' }),
          }));
          expect(mockUpdateUserInContext).toHaveBeenCalledWith(updatedUserDataFromApi);
        });
        // Check if the new avatar URL is reflected (e.g., in an img src if applicable, or by re-setting editable state)
        // For now, just checking the call is enough as per outline
      });

    it('calls API and AuthContext on successful save with both name and avatar URL changed', async () => {
        const mockUpdateUserInContext = jest.fn();
        const initialUserForContext = { ...mockUser, displayName: 'Test User DisplayName', avatarUrl: { String: 'http://example.com/avatar.png', Valid: true }};
        renderProfilePage({ ...mockAuthContextValue, user: initialUserForContext, updateUserInContext: mockUpdateUserInContext, token: 'fake-token' });
        fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));

        fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: 'Both Changed Name' } });
        fireEvent.change(screen.getByLabelText(/Avatar URL/i), { target: { value: 'http://example.com/both_changed.png' } });

        const updatedUserDataFromApi = {
            ...initialUserForContext,
            display_name: 'Both Changed Name',
            avatar_url: { String: 'http://example.com/both_changed.png', Valid: true }
        };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => updatedUserDataFromApi,
        });

        fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledWith('/api/v1/user/me', expect.objectContaining({
            body: JSON.stringify({
                display_name: 'Both Changed Name',
                avatar_url: 'http://example.com/both_changed.png'
            }),
          }));
          expect(mockUpdateUserInContext).toHaveBeenCalledWith(updatedUserDataFromApi);
        });
    });

    it('does not call API if no changes are made and save is clicked', () => {
      const mockUpdateUserInContext = jest.fn(); // This should not be called
      const initialUserForContext = { ...mockUser, displayName: 'No Change Name', avatarUrl: { String: 'http://nochange.com/avatar.png', Valid: true }};
      renderProfilePage({ ...mockAuthContextValue, user: initialUserForContext, updateUserInContext: mockUpdateUserInContext, token: 'fake-token' });

      fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));
      // Inputs already have initial values, no fireEvent.change needed

      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockUpdateUserInContext).not.toHaveBeenCalled();
      // Check if success message "No changes to save" appears (optional)
      // await screen.findByText('No changes to save.');
    });

    it('displays an error message if API call fails on save', async () => {
      renderProfilePage({ ...mockAuthContextValue, token: 'fake-token' });
      fireEvent.click(screen.getByRole('button', { name: /Edit Profile/i }));
      fireEvent.change(screen.getByLabelText(/Display Name/i), { target: { value: 'Error Case Name' } });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Network Error Test' }), // Simulate error response from API
      });

      fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));

      // Wait for error message to appear
      const errorMessage = await screen.findByText('Network Error Test');
      expect(errorMessage).toBeInTheDocument();
      // Editing mode should still be active
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    });
  });
});
