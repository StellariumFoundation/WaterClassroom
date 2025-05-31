
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, MOCK_BADGES } from '../constants';
import { User as UserIconLucide, Mail, BookOpenCheck, CalendarDays, ShieldCheck, Edit, Save, TrendingUp, Award } from 'lucide-react';
import BadgeIconDisplay from '../components/BadgeIconDisplay';

const ProfilePage: React.FC = () => {
  // Ensure useAuth provides 'token' and an 'updateUserInContext' function or similar
  const { user, logout, selectedCurriculumDetails, token, updateUserInContext } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(user?.name || user?.displayName || '');
  const [editableAvatarUrl, setEditableAvatarUrl] = useState(user?.avatarUrl?.String || ''); // Initialize from .String
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');


  if (!user) {
    navigate(APP_ROUTES.AUTH);
    return null;
  }

  const handleSave = async () => {
    setApiError(null);
    setSaveSuccessMessage('');
    setIsSaving(true);

    const payload: { display_name?: string; avatar_url?: string } = {};
    const currentDisplayName = user.displayName || '';
    const currentAvatarUrl = user.avatarUrl?.String || '';

    if (editableName !== currentDisplayName) {
      payload.display_name = editableName;
    }
    if (editableAvatarUrl !== currentAvatarUrl) {
      payload.avatar_url = editableAvatarUrl;
    }

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      setIsSaving(false);
      setSaveSuccessMessage("No changes to save."); // Or just close without message
      setTimeout(() => setSaveSuccessMessage(''), 3000);
      return;
    }

    if (!token) {
      setApiError("Authentication token not found. Please log in again.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/v1/user/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update profile. Please try again.' }));
        throw new Error(errorData.message || `HTTP error ${response.status}`);
      }

      const updatedUserData = await response.json();

      if (updateUserInContext) {
         updateUserInContext(updatedUserData);
      } else {
        console.warn("updateUserInContext function not available in AuthContext. User state might be stale.");
      }

      setEditableName(updatedUserData.display_name || '');
      setEditableAvatarUrl(updatedUserData.avatar_url?.String || '');
      setIsEditing(false);
      setSaveSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSaveSuccessMessage(''), 3000); // Clear message after 3 seconds

    } catch (error: any) {
      console.error('Failed to update user profile:', error);
      setApiError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const userBadges = user.badges?.length ? user.badges : MOCK_BADGES.slice(0, Math.floor(Math.random() * MOCK_BADGES.length) + 1);
  const displayName = user.displayName || user.name || 'User'; // Prioritize displayName from CurrentUserResponse
  const displayAvatarUrl = user.avatarUrl?.Valid ? user.avatarUrl.String : `https://i.pravatar.cc/150?u=${user.email}`;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-brand-slate-light">Your Profile</h1>
      </header>

      <div className="bg-brand-slate-dark shadow-xl rounded-xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mb-8">
          <img
            src={isEditing ? (editableAvatarUrl || `https://i.pravatar.cc/150?u=${user.email}`) : displayAvatarUrl}
            alt="User Avatar"
            className="w-32 h-32 rounded-full shadow-lg border-4 border-brand-light-blue mb-6 md:mb-0 object-cover"
          />
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-brand-slate-medium">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    value={editableName}
                    onChange={(e) => { setEditableName(e.target.value); setSaveSuccessMessage(''); }}
                    className="text-xl font-bold text-brand-slate-light bg-brand-navy border-b-2 border-brand-light-blue focus:outline-none focus:border-brand-purple px-2 py-1 w-full md:w-auto transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-brand-slate-medium mt-1">Avatar URL</label>
                  <input
                    type="text"
                    id="avatarUrl"
                    value={editableAvatarUrl}
                    onChange={(e) => { setEditableAvatarUrl(e.target.value); setSaveSuccessMessage(''); }}
                    placeholder="https://example.com/avatar.png"
                    className="text-sm text-brand-slate-light bg-brand-navy border-b-2 border-brand-light-blue focus:outline-none focus:border-brand-purple px-2 py-1 w-full transition-colors"
                  />
                </div>
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-brand-slate-light mb-1">{displayName}</h2>
            )}
            <p className="text-brand-slate-medium flex items-center justify-center md:justify-start mt-2">
              <Mail size={16} className="mr-2" /> {user.email}
            </p>
            <div className="mt-4">
              {isEditing ? (
                <div className="space-y-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`px-4 py-2 text-white rounded-lg flex items-center text-sm w-full md:w-auto justify-center transition-colors
                                ${isSaving ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-400'}`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <><Save size={16} className="mr-2" /> Save Changes</>
                    )}
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setApiError(null); setEditableName(displayName); setEditableAvatarUrl(displayAvatarUrl);}}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 flex items-center text-sm w-full md:w-auto justify-center"
                  >
                    Cancel
                  </button>
                  {apiError && <p className="text-red-400 text-sm mt-2">{apiError}</p>}
                </div>
              ) : (
                <button
                  onClick={() => { setIsEditing(true); setApiError(null); setEditableName(displayName); setEditableAvatarUrl(displayAvatarUrl); }}
                  className="px-4 py-2 bg-brand-light-blue text-brand-navy rounded-lg hover:bg-opacity-80 flex items-center text-sm"
                >
                  <Edit size={16} className="mr-2" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Curriculum Info */}
          <div className="bg-brand-navy p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-brand-light-blue mb-3 flex items-center">
              <BookOpenCheck size={22} className="mr-2" /> Current Curriculum
            </h3>
            {selectedCurriculumDetails ? (
              <>
                <p className="text-brand-slate-light font-medium">{selectedCurriculumDetails.name}</p>
                <p className="text-sm text-brand-slate-medium mt-1">{selectedCurriculumDetails.description}</p>
                <button onClick={() => navigate(APP_ROUTES.CURRICULUM_SELECT)} className="mt-3 text-sm text-brand-light-blue hover:underline">
                  Change Curriculum
                </button>
              </>
            ) : (
              <>
                <p className="text-brand-slate-medium">No curriculum selected.</p>
                <button onClick={() => navigate(APP_ROUTES.CURRICULUM_SELECT)} className="mt-3 text-sm text-brand-light-blue hover:underline">
                  Select a Curriculum
                </button>
              </>
            )}
          </div>

          {/* Subscription Info */}
          <div className="bg-brand-navy p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-brand-light-blue mb-3 flex items-center">
              <ShieldCheck size={22} className="mr-2" /> Subscription Status
            </h3>
            {/* Data for this section would typically be fetched from an API endpoint like /api/users/me/subscription */}
            {user.subscription ? (
              <>
                <p className="text-brand-slate-light font-medium">Current Plan: {user.subscription.planName}</p>
                <p className={`text-sm ${user.subscription.isActive ? 'text-green-400' : 'text-red-400'}`}>
                  Status: {user.subscription.isActive ? 'Active' : 'Inactive'}
                </p>
                {user.subscription.expiryDate && (
                  <p className="text-sm text-brand-slate-medium mt-1 flex items-center">
                    <CalendarDays size={14} className="mr-1" /> Renews on: {new Date(user.subscription.expiryDate).toLocaleDateString()}
                  </p>
                )}
                {/* TODO: Link to actual subscription management page if/when available (e.g. Stripe Customer Portal) */}
                <button
                  onClick={() => navigate(APP_ROUTES.PRICING)} // Or a dedicated manage subscription page
                  className="mt-3 text-sm text-brand-light-blue hover:underline"
                >
                  Manage Subscription
                </button>
              </>
            ) : (
              <>
                <p className="text-brand-slate-medium">No active subscription found.</p>
                <button
                  onClick={() => navigate(APP_ROUTES.PRICING)}
                  className="mt-3 text-sm text-brand-light-blue hover:underline"
                >
                  View Plans
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Payment History Section */}
        <div className="bg-brand-navy p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-brand-light-blue mb-4">Payment History</h3>
          {/* Data for this section would be fetched from an API endpoint like /api/payments/history */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-brand-slate-light">
              <thead className="bg-brand-slate-dark text-xs text-brand-slate-medium uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3">Amount</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {/* Placeholder Rows - Replace with dynamic data */}
                <tr className="border-b border-brand-slate-medium/50">
                  <td className="px-4 py-3">2024-05-01</td>
                  <td className="px-4 py-3">$49.99</td>
                  <td className="px-4 py-3 text-green-400">Succeeded</td>
                  <td className="px-4 py-3">Homeschool Plan - Monthly</td>
                </tr>
                <tr className="border-b border-brand-slate-medium/50">
                  <td className="px-4 py-3">2024-04-01</td>
                  <td className="px-4 py-3">$49.99</td>
                  <td className="px-4 py-3 text-green-400">Succeeded</td>
                  <td className="px-4 py-3">Homeschool Plan - Monthly</td>
                </tr>
                {/* Add more placeholder rows or a message if history is empty */}
                {/* Example of an empty state:
                <tr>
                  <td colSpan="4" className="text-center py-4 text-brand-slate-medium">
                    No payment history found.
                  </td>
                </tr>
                */}
              </tbody>
            </table>
          </div>
          {/* Optionally, add pagination if the list can be long */}
        </div>

        {/* Progress & Achievements */}
        <div className="bg-brand-navy p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-brand-light-blue mb-4">Progress & Achievements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
                <div className="bg-brand-slate-dark p-4 rounded">
                    <TrendingUp size={24} className="mx-auto text-brand-purple mb-1"/>
                    <p className="text-2xl font-bold text-brand-slate-light">{user.progress?.overallProgress || 0}%</p>
                    <p className="text-xs text-brand-slate-medium">Overall Progress</p>
                </div>
                <div className="bg-brand-slate-dark p-4 rounded">
                    <Award size={24} className="mx-auto text-yellow-400 mb-1"/>
                    <p className="text-2xl font-bold text-brand-slate-light">{userBadges.length}</p>
                    <p className="text-xs text-brand-slate-medium">Badges Earned</p>
                </div>
                <div className="bg-brand-slate-dark p-4 rounded">
                    <TrendingUp size={24} className="mx-auto text-green-400 mb-1"/>
                    <p className="text-2xl font-bold text-brand-slate-light">{user.streak || 0} Days</p>
                    <p className="text-xs text-brand-slate-medium">Learning Streak</p>
                </div>
            </div>
            <h4 className="text-lg font-medium text-brand-slate-light mb-3">Your Badges:</h4>
            {userBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {userBadges.map(badge => <BadgeIconDisplay key={badge.id} badge={badge} />)}
                </div>
            ) : (
                <p className="text-sm text-brand-slate-medium">Keep learning to earn badges!</p>
            )}
        </div>


        <div className="mt-10 text-center">
          <button
            onClick={() => { logout(); navigate(APP_ROUTES.HOME); }}
            className="px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
