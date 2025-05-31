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
  it('renders user information correctly', () => {
    renderProfilePage();

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    // Add more assertions for other user details if necessary
  });

  it('renders subscription status section with placeholder data', () => {
    renderProfilePage();

    // Assert: Presence of the section title
    expect(screen.getByRole('heading', { name: /Subscription Status/i })).toBeInTheDocument();

    // Assert: Presence of placeholder plan name (using data from mockUser)
    expect(screen.getByText(`Current Plan: ${mockUser.subscription.planName}`)).toBeInTheDocument();

    // Assert: Presence of placeholder status
    expect(screen.getByText(`Status: ${mockUser.subscription.isActive ? 'Active' : 'Inactive'}`)).toBeInTheDocument();

    // Assert: Presence of placeholder renewal date
    const expectedDate = new Date(mockUser.subscription.expiryDate).toLocaleDateString();
    expect(screen.getByText(`Renews on: ${expectedDate}`)).toBeInTheDocument();

    // Assert: Presence of "Manage Subscription" button
    expect(screen.getByRole('button', { name: /Manage Subscription/i })).toBeInTheDocument();

    // Assert that API call comment is present (optional, could be fragile)
    // This might require a more specific way to find the comment if it's not part of visible text.
    // For now, we assume the important part is rendering the data elements.
  });

  it('renders payment history section with placeholder table', () => {
    renderProfilePage();

    // Assert: Presence of the section title
    expect(screen.getByRole('heading', { name: /Payment History/i })).toBeInTheDocument();

    // Assert: Presence of table headers
    expect(screen.getByRole('columnheader', { name: /Date/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Amount/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Description/i })).toBeInTheDocument();

    // Assert: Presence of placeholder payment data (example from the component)
    expect(screen.getByText('2024-05-01')).toBeInTheDocument();
    expect(screen.getAllByText('$49.99').length).toBeGreaterThanOrEqual(1); // Can be multiple
    expect(screen.getAllByText('Succeeded').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Homeschool Plan - Monthly').length).toBeGreaterThanOrEqual(1);

    // Assert that API call comment is present (optional)
  });

  it('shows "View Plans" button if no subscription is active', () => {
    const userWithoutSubscription = {
      ...mockUser,
      subscription: null, // Or undefined, depending on how your AuthContext handles it
    };
    renderProfilePage({ ...mockAuthContextValue, user: userWithoutSubscription });

    expect(screen.getByText(/No active subscription found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Plans/i })).toBeInTheDocument();
  });

  // Add more tests:
  // - Test editing profile functionality (if "Edit Profile" button is part of this page's scope).
  // - Test interactions with "Manage Subscription" or "View Plans" buttons (e.g., navigation).
  // - Test different states of subscription (e.g., inactive, different plan).
  // - Test empty payment history state.
});
