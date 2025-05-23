
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, MOCK_BADGES } from '../constants';
import { User as UserIconLucide, Mail, BookOpenCheck, CalendarDays, ShieldCheck, Edit, Save, TrendingUp, Award } from 'lucide-react';
import BadgeIconDisplay from '../components/BadgeIconDisplay';

const ProfilePage: React.FC = () => {
  const { user, logout, selectedCurriculumDetails, updateUserCurriculum } = useAuth(); // Assuming updateUserCurriculum can be used for changes
  const navigate = useNavigate();
  
  // Mock editable fields, in real app this would update backend
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(user?.name || '');
  // const [editableEmail, setEditableEmail] = useState(user?.email || ''); // Email usually not easily changed

  if (!user) {
    navigate(APP_ROUTES.AUTH);
    return null;
  }

  const handleSave = () => {
    // Mock update user. In real app, call API then update context.
    if (user && user.name !== editableName) {
        // auth.updateUser({ ...user, name: editableName }); // Example if updateUser method existed
        console.log("Mock saving name:", editableName);
        // For demo, we can update local storage part of user if login logic in AuthContext is adapted
    }
    setIsEditing(false);
  };

  const userBadges = user.badges?.length ? user.badges : MOCK_BADGES.slice(0, Math.floor(Math.random() * MOCK_BADGES.length) + 1);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-brand-slate-light">Your Profile</h1>
      </header>

      <div className="bg-brand-slate-dark shadow-xl rounded-xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mb-8">
          <img
            src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`}
            alt="User Avatar"
            className="w-32 h-32 rounded-full shadow-lg border-4 border-brand-light-blue mb-6 md:mb-0"
          />
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <input 
                type="text"
                value={editableName}
                onChange={(e) => setEditableName(e.target.value)}
                className="text-3xl font-bold text-brand-slate-light bg-brand-navy border-b-2 border-brand-light-blue focus:outline-none px-2 py-1 mb-2 w-full md:w-auto"
              />
            ) : (
              <h2 className="text-3xl font-bold text-brand-slate-light mb-1">{user.name}</h2>
            )}
            <p className="text-brand-slate-medium flex items-center justify-center md:justify-start">
              <Mail size={16} className="mr-2" /> {user.email}
            </p>
            <div className="mt-4">
              {isEditing ? (
                <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 flex items-center text-sm">
                  <Save size={16} className="mr-2" /> Save Changes
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-brand-light-blue text-brand-navy rounded-lg hover:bg-opacity-80 flex items-center text-sm">
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
              <ShieldCheck size={22} className="mr-2" /> Subscription
            </h3>
            {user.subscription ? (
              <>
                <p className="text-brand-slate-light font-medium">{user.subscription.planName}</p>
                <p className={`text-sm ${user.subscription.isActive ? 'text-green-400' : 'text-red-400'}`}>
                  Status: {user.subscription.isActive ? 'Active' : 'Inactive'}
                </p>
                {user.subscription.expiryDate && (
                  <p className="text-sm text-brand-slate-medium mt-1 flex items-center">
                    <CalendarDays size={14} className="mr-1" /> Renews/Expires on: {new Date(user.subscription.expiryDate).toLocaleDateString()}
                  </p>
                )}
                <button onClick={() => alert('Manage subscription - Placeholder')} className="mt-3 text-sm text-brand-light-blue hover:underline">
                  Manage Subscription
                </button>
              </>
            ) : (
              <p className="text-brand-slate-medium">No subscription details found.</p>
            )}
          </div>
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
