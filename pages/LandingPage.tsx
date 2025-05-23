
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import FeatureCard from '../components/FeatureCard';
import { GraduationCap, Lightbulb, BarChart3, Users, ShieldCheck, BookCopy, Bot, Award, CheckCircle, Rocket } from 'lucide-react';

// Hero Section Component
const HeroSection: React.FC = () => (
  <section className="bg-brand-navy py-20 md:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
      <div className="text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-slate-light tracking-tight">
          Water Classroom:
          <span className="block text-brand-light-blue">AI-Powered Learning Revolution</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-brand-slate-medium max-w-2xl mx-auto md:mx-0">
          A complete educational ecosystem with interactive content, games, and AI-based learning. Water Classroom transforms education through personalized experiences from K-12 to undergraduate levels.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to={APP_ROUTES.AUTH}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-navy bg-brand-light-blue hover:bg-opacity-90 shadow-lg transform transition hover:scale-105"
          >
            Get Started Free
          </Link>
          <Link
            to="#features" // Simple anchor link for now
            onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });}}
            className="inline-flex items-center justify-center px-8 py-3 border border-brand-light-blue text-base font-medium rounded-md text-brand-light-blue hover:bg-brand-light-blue hover:text-brand-navy shadow-lg transform transition hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </div>
      <div>
        <img 
          src="https://picsum.photos/seed/learning-future/700/500" 
          alt="AI Powered Learning" 
          className="rounded-xl shadow-2xl"
        />
      </div>
    </div>
  </section>
);

// Revolutionizing Education Section (Pyramid concept adapted to cards)
const RevolutionizingEducationSection: React.FC = () => (
  <section className="py-16 bg-brand-deep-blue">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-brand-slate-light mb-12">Revolutionizing Education</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<GraduationCap />} 
          title="Democratized Access" 
          description="High-quality education for all, breaking down geographical and economic barriers."
          className="bg-brand-navy"
        />
        <FeatureCard 
          icon={<Bot />} 
          title="AI-Powered Learning" 
          description="Personalized tutoring, adaptive content, and intelligent feedback systems."
          className="bg-brand-navy"
        />
        <FeatureCard 
          icon={<BookCopy />} 
          title="Complete Classroom" 
          description="Comprehensive curriculum, engaging lectures, automated assessments, and progress tracking."
          className="bg-brand-navy"
        />
      </div>
    </div>
  </section>
);

// Key Features Section
const KeyFeaturesSection: React.FC = () => (
  <section id="features" className="py-16 bg-brand-navy">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-brand-slate-light mb-12">Key Features</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard icon={<Lightbulb />} title="AI-Tailored Curriculum" description="Dynamic lessons aligned with global standards, adapting to individual learning styles." />
        <FeatureCard icon={<Bot />} title="24/7 AI Tutoring" description="Step-by-step teaching with real-time feedback. Automated grading with actionable insights." />
        <FeatureCard icon={<Rocket />} title="Real-World Application" description="Project-based learning connecting concepts to real scenarios. Gamified 'Innovation Labs'." />
        <FeatureCard icon={<BarChart3 />} title="Progress Analytics" description="Track performance, engagement, and skill development. Customizable reports." />
      </div>
    </div>
  </section>
);

// Subscription Options Section
const SubscriptionOptionsSection: React.FC = () => (
    <section className="py-16 bg-brand-deep-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-brand-slate-light mb-12">Subscription Options</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Individual Students Card */}
          <div className="bg-brand-navy p-8 rounded-xl shadow-lg border border-brand-purple">
            <h3 className="text-2xl font-semibold text-brand-light-blue mb-4">Individual Students</h3>
            <ul className="space-y-2 text-brand-slate-medium">
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> Monthly or yearly plans</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> 14-day free trial</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> Full access to curriculum</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> Unlimited AI tutoring</li>
            </ul>
            <Link to={APP_ROUTES.AUTH} className="mt-6 block w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-brand-navy bg-brand-light-blue hover:bg-opacity-90">
              Start Free Trial
            </Link>
          </div>
          {/* Educational Institutions Card */}
          <div className="bg-brand-navy p-8 rounded-xl shadow-lg border-2 border-brand-light-blue relative">
             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-light-blue text-brand-navy px-3 py-1 text-sm font-semibold rounded-full">Most Popular</div>
            <h3 className="text-2xl font-semibold text-brand-light-blue mb-4">Educational Institutions</h3>
            <ul className="space-y-2 text-brand-slate-medium">
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> Bulk access discounts</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> Custom curriculum options</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> Administrator dashboard</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> Integration with existing systems</li>
            </ul>
             <Link to="/contact-sales" onClick={(e) => e.preventDefault()} className="mt-6 block w-full text-center px-6 py-3 border border-brand-light-blue text-base font-medium rounded-md text-brand-light-blue hover:bg-brand-light-blue hover:text-brand-navy">
              Contact Sales
            </Link>
          </div>
          {/* Self-Taught Students Card */}
          <div className="bg-brand-navy p-8 rounded-xl shadow-lg border border-brand-purple">
            <h3 className="text-2xl font-semibold text-brand-light-blue mb-4">Self-Taught Students</h3>
            <ul className="space-y-2 text-brand-slate-medium">
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> Complete online school</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> Verified credentials</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> Flexible learning pace</li>
              <li className="flex items-center"><CheckCircle size={18} className="text-green-400 mr-2" /> On-app exams without oversight</li>
            </ul>
            <Link to={APP_ROUTES.AUTH} className="mt-6 block w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-brand-navy bg-brand-light-blue hover:bg-opacity-90">
              Explore Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
);


const LandingPage: React.FC = () => {
  return (
    <div className="bg-brand-navy">
      <HeroSection />
      <RevolutionizingEducationSection />
      <KeyFeaturesSection />
      <SubscriptionOptionsSection />
      {/* Optionally, add more sections like "Impact & Vision", "AI Tutoring Experience", "Motivation System" if time permits */}
    </div>
  );
};

export default LandingPage;
