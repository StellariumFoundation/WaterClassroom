
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { APP_ROUTES, MOCK_BADGES } from '../constants';
import { Curriculum, Lecture, Subject as SubjectType, UserProgress, Badge } from '../types';
import BadgeIconDisplay from '../components/BadgeIconDisplay';
import { BookOpen, MessageSquare, Edit3, Settings, Zap, TrendingUp, Star, ArrowRight } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; bgColorClass?: string }> = ({ title, value, icon, bgColorClass = "bg-brand-indigo" }) => (
  <div className={`p-6 rounded-xl shadow-lg ${bgColorClass} text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-indigo-200">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="text-indigo-300">{icon}</div>
    </div>
  </div>
);

const SubjectCard: React.FC<{ subject: SubjectType; curriculumId: string }> = ({ subject, curriculumId }) => (
  <div className="bg-brand-slate-dark p-6 rounded-lg shadow-md hover:shadow-brand-light-blue/30 transition-shadow">
    <h3 className="text-xl font-semibold text-brand-light-blue mb-2">{subject.name}</h3>
    <p className="text-sm text-brand-slate-medium mb-3">
      {subject.lectures.length} lectures
      {subject.assessments && subject.assessments.length > 0 && `, ${subject.assessments.length} assessments`}
    </p>
    {subject.lectures.length > 0 && (
       <Link 
        to={`${APP_ROUTES.LECTURE}/${subject.lectures[0].id}?curriculumId=${curriculumId}&subjectId=${subject.id}`} 
        className="inline-flex items-center text-sm text-brand-light-blue hover:underline"
      >
        Start Learning <ArrowRight size={16} className="ml-1" />
      </Link>
    )}
  </div>
);


const DashboardPage: React.FC = () => {
  const { user, selectedCurriculumDetails, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !user.selectedCurriculumId) {
      navigate(APP_ROUTES.CURRICULUM_SELECT);
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-light-blue"></div></div>;
  }
  
  const userProgress = user.progress || { completedLectures: [], assessmentScores: {}, overallProgress: 0 };
  const userBadges = user.badges || MOCK_BADGES.slice(0,2); // Mock earned badges
  const userStreak = user.streak || 3; // Mock streak
  const userPoints = user.points || 150; // Mock points


  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-brand-slate-light">Welcome back, {user.name}!</h1>
        <p className="text-brand-slate-medium mt-1">Ready to continue your learning journey?</p>
      </header>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Overall Progress" value={`${userProgress.overallProgress || 0}%`} icon={<TrendingUp size={32} />} bgColorClass="bg-brand-purple" />
        <StatCard title="Lectures Completed" value={userProgress.completedLectures.length} icon={<BookOpen size={32} />} />
        <StatCard title="Learning Streak" value={`${userStreak} Days`} icon={<Zap size={32} />} />
        <StatCard title="Points Earned" value={userPoints} icon={<Star size={32} />} />
      </section>

      {/* Current Curriculum & Quick Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-brand-slate-dark p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-brand-slate-light mb-4">Your Learning Path</h2>
          {selectedCurriculumDetails ? (
            <div>
              <h3 className="text-xl font-medium text-brand-light-blue mb-2">{selectedCurriculumDetails.name}</h3>
              <p className="text-brand-slate-medium mb-4 text-sm">{selectedCurriculumDetails.description}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedCurriculumDetails.subjects.map(subject => (
                  <SubjectCard key={subject.id} subject={subject} curriculumId={selectedCurriculumDetails.id} />
                ))}
              </div>
               <Link to={APP_ROUTES.CURRICULUM_SELECT} className="mt-6 inline-block text-sm text-brand-light-blue hover:underline">
                Change Curriculum or View All Subjects
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-brand-slate-medium mb-4">You haven't selected a curriculum yet.</p>
              <Link to={APP_ROUTES.CURRICULUM_SELECT} className="px-6 py-3 bg-brand-light-blue text-brand-navy rounded-lg font-medium hover:bg-opacity-90">
                Choose Your Curriculum
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
            <div className="bg-brand-slate-dark p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-brand-slate-light mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <Link to={APP_ROUTES.TUTOR} className="flex items-center p-3 bg-brand-navy hover:bg-brand-indigo rounded-lg transition-colors">
                        <MessageSquare size={20} className="mr-3 text-brand-light-blue" />
                        <span className="text-brand-slate-light">Ask AI Tutor</span>
                    </Link>
                    <Link to={APP_ROUTES.ASSESSMENT} className="flex items-center p-3 bg-brand-navy hover:bg-brand-indigo rounded-lg transition-colors">
                        <Edit3 size={20} className="mr-3 text-brand-light-blue" />
                        <span className="text-brand-slate-light">View Assessments</span>
                    </Link>
                    <Link to={APP_ROUTES.PROFILE} className="flex items-center p-3 bg-brand-navy hover:bg-brand-indigo rounded-lg transition-colors">
                        <Settings size={20} className="mr-3 text-brand-light-blue" />
                        <span className="text-brand-slate-light">Profile & Settings</span>
                    </Link>
                </div>
            </div>
             <div className="bg-brand-slate-dark p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-brand-slate-light mb-4">Your Badges</h3>
                {userBadges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {userBadges.map(badge => <BadgeIconDisplay key={badge.id} badge={badge} />)}
                </div>
                ) : (
                <p className="text-sm text-brand-slate-medium">No badges earned yet. Keep learning!</p>
                )}
            </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
