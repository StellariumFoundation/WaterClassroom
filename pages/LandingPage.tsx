
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import FeatureCard from '../components/FeatureCard';
import { Lightbulb, Rocket, ShieldCheck, Users, Home, Cpu, Bot, Award, ClipboardCheck } from 'lucide-react'; // Updated icons

// Hero Section Component
const HeroSection: React.FC = () => (
  <section className="bg-white py-20 md:py-32"> {/* Light theme background */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
      <div className="text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight">
          Water Classroom:
          <span className="block text-blue-600">Your World-Class Online School for Fun, AI-Powered Learning.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0">
          Experience a revolutionary K-12 to undergraduate online school designed for deep understanding and real achievement. Personalized paths, exciting interactive lessons, and AI-verified exams await.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to={APP_ROUTES.AUTH}
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-600 hover:via-blue-700 hover:to-blue-900 shadow-lg transform transition hover:scale-105 relative overflow-hidden button-shimmer"
          >
            Start Your Learning Adventure
          </Link>
          <Link
            to="#core-features" // Updated anchor link
            onClick={(e) => { e.preventDefault(); document.getElementById('core-features')?.scrollIntoView({ behavior: 'smooth' });}}
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Explore Features
          </Link>
        </div>
      </div>
      <div className="mt-12 md:mt-0">
        <img 
          src="https://picsum.photos/seed/learning-future/700/500" 
          alt="Students engaged in AI-powered learning with Water Classroom"
          className="rounded-xl shadow-2xl"
        />
      </div>
    </div>
  </section>
);

// Key Benefits Section
const KeyBenefitsSection: React.FC = () => (
  <section className="py-16 md:py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12 md:mb-16">The Ultimate Online School Experience</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard 
          icon={<Lightbulb />}
          title="Learn Your Way"
          description="AI crafts unique learning journeys for every student, adapting to your pace and style. Perfect for homeschoolers and self-starters."
        />
        <FeatureCard 
          icon={<Rocket />}
          title="Seriously Fun Learning"
          description="Dive into interactive lessons, captivating games, and collaborative projects. Who said world-class education can't be exciting?"
        />
        <FeatureCard 
          icon={<ShieldCheck />}
          title="Real Achievements, Verified by AI"
          description="More than just grades. Take verifiable exams proctored by AI, earning credentials that truly matter for your future."
        />
        <FeatureCard
          icon={<Users />}
          title="Join the Creator Economy"
          description="Unleash your inner educator! Create, share, and even monetize your own lessons and mini-games in our unique marketplace."
        />
      </div>
    </div>
  </section>
);

// For Homeschoolers Section
const ForHomeschoolersSection: React.FC = () => (
  <section className="py-16 md:py-20 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <Home size={48} className="mx-auto text-blue-600 mb-6" />
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">Empowering Homeschoolers & Independent Learners</h2>
      <div className="space-y-6 text-lg text-slate-600 max-w-3xl mx-auto">
        <p>
          Water Classroom offers unparalleled flexibility for homeschool schedules, providing a comprehensive K-12 to undergraduate curriculum aligned with global standards.
        </p>
        <p>
          Our platform gives parents insightful progress analytics and provides students with a safe, engaging, and collaborative online learning environment.
        </p>
        <p>
          Bridge the gap to higher education with AI-verified credentials and a portfolio of work built on real achievements.
        </p>
      </div>
    </div>
  </section>
);

// Core Features Section (formerly KeyFeaturesSection)
const CoreFeaturesSection: React.FC = () => (
  <section id="core-features" className="py-16 md:py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12 md:mb-16">Explore the Core of Water Classroom</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<Cpu />}
          title="AI-Personalized Curriculum"
          description="Our intelligent RAG engine and dynamic knowledge graphs ensure your learning path is always optimized for you, adapting to your needs in real-time."
        />
        <FeatureCard
          icon={<Bot />}
          title="Aqua - Your 24/7 AI Tutor"
          description="Stuck on a tricky concept or homework problem? Aqua provides instant, step-by-step guidance via text or voice, anytime."
        />
        <FeatureCard
          icon={<Award />}
          title="Gamified Universe"
          description="Learning made addictive! Earn points, unlock prestigious badges, compete on leaderboards, and maintain your learning streaks."
        />
        <FeatureCard
          icon={<ClipboardCheck />} // Changed icon from ShieldCheck for variety
          title="AI-Secured Assessments"
          description="From auto-graded quizzes to AI-scored essays and cutting-edge webcam proctoring for formal exams. Trustworthy feedback and verifiable results."
        />
      </div>
    </div>
  </section>
);

// Final CTA Section
const FinalCTASection: React.FC = () => (
  <section className="py-20 md:py-28 bg-blue-600">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Redefine Your Learning Journey?</h2>
      <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
        Sign up for free to explore core lessons and experience the future of education. Your adventure in knowledge starts now with Water Classroom!
      </p>
      <Link
        to={APP_ROUTES.AUTH}
        className="inline-block px-10 py-4 border border-transparent text-lg font-semibold rounded-lg text-blue-700 bg-white hover:bg-slate-100 shadow-lg transform transition hover:scale-105 relative overflow-hidden button-shimmer"
      >
        Create Your Free Account
      </Link>
    </div>
  </section>
);


const LandingPage: React.FC = () => {
  return (
    <div> {/* Removed bg-brand-navy, page bg is now from index.css */}
      <HeroSection />
      <KeyBenefitsSection />
      <ForHomeschoolersSection />
      <CoreFeaturesSection />
      <FinalCTASection />
    </div>
  );
};

export default LandingPage;
