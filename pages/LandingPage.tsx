
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import FeatureCard from '../components/FeatureCard';
import { Lightbulb, Rocket, ShieldCheck, Users, Home, Cpu, Bot, Award, ClipboardCheck, CheckCircle, UserCircle, Globe, LayoutDashboard } from 'lucide-react'; // Added new icons

// Hero Section Component
const HeroSection: React.FC = () => (
  <section className="bg-white py-20 md:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center"> {/* Increased gap */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight"> {/* Darker main headline */}
          Water Classroom:
          <span className="block text-blue-600 mt-2">The Future of Education is Here. AI-Driven, Engaging, and Radically Effective.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-700 max-w-xl mx-auto md:mx-0"> {/* Darker paragraph text */}
          Discover a K-12 to undergraduate online learning platform that truly understands you. Our AI-powered curriculum adapts to your unique pace, while interactive lessons and verifiable credentials pave your path to success. Join us and experience education reimagined.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to={APP_ROUTES.AUTH}
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-600 hover:via-blue-700 hover:to-blue-900 shadow-lg transform transition hover:scale-105 relative overflow-hidden button-shimmer"
          >
            Start Your Free Trial
          </Link>
          <Link
            to="#core-features"
            onClick={(e) => { e.preventDefault(); document.getElementById('core-features')?.scrollIntoView({ behavior: 'smooth' });}}
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            Explore Features
          </Link>
        </div>
      </div>
      <div className="mt-12 md:mt-0">
        <img 
          src="https://picsum.photos/seed/learning-campus/700/550" // Slightly different seed for variety
          alt="Students collaborating and learning with Water Classroom's AI technology"
          className="rounded-xl shadow-2xl"
        />
      </div>
    </div>
  </section>
);

// Key Benefits Section (The Water Classroom Advantage)
const KeyBenefitsSection: React.FC = () => (
  <section className="py-16 md:py-20 bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12 md:mb-16">The Water Classroom Advantage</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard 
          icon={<Lightbulb />}
          title="Learn Your Way"
          description="Escape one-size-fits-all education. Our AI meticulously analyzes your learning patterns, crafting a bespoke curriculum that targets your knowledge gaps and accelerates your strengths. It's education that evolves with you, ensuring optimal understanding and retention."
        />
        <FeatureCard 
          icon={<Rocket />}
          title="Seriously Fun Learning"
          description="Say goodbye to dull textbooks. Dive into a universe of interactive lessons, story-driven modules, educational games, and hands-on projects that make learning genuinely exciting. We believe curiosity is the best teacher, and our content is designed to spark it daily."
        />
        <FeatureCard 
          icon={<ShieldCheck />}
          title="Real Achievements, Verified by AI"
          description="Your hard work deserves recognition that counts. Water Classroom offers AI-proctored assessments and exams, leading to verifiable credentials. Build a portfolio of achievements that showcases your true capabilities to universities and employers worldwide."
        />
        <FeatureCard
          icon={<Users />}
          title="Join the Creator Economy"
          description="Become part of a vibrant learning community. Our platform empowers students and educators alike to design, share, and even monetize innovative educational content. Teach, learn, and earn in a collaborative ecosystem."
        />
      </div>
    </div>
  </section>
);

// The Water School Experience Section (formerly ForHomeschoolersSection)
const TheWaterSchoolExperienceSection: React.FC = () => (
  <section className="py-16 md:py-20 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <Home size={48} className="mx-auto text-blue-600 mb-6" />
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">The Premier Water School Experience: Beyond Homeschooling</h2>
      <div className="space-y-6 text-lg text-slate-700 max-w-3xl mx-auto"> {/* Darker text for readability */}
        <p>
          Water Classroom provides a comprehensive, full-spectrum curriculum from Kindergarten through undergraduate studies, meticulously aligned with international standards while offering the customization homeschoolers need. Our platform isn't just an alternative; it's an upgrade to traditional online schooling.
        </p>
        <p>
          Parents transform into true educational partners with our intuitive dashboards, offering deep insights into student progress, engagement analytics, and areas for focus. We empower you with the tools to guide, support, and celebrate your child's unique learning journey effectively.
        </p>
        <p>
          Experience academic excellence supercharged by AI. From adaptive learning paths that cater to individual student needs, to AI tutors that provide instant support, and AI-proctored exams that ensure integrity, we're setting a new standard for personalized, effective online education.
        </p>
         <p>
          Learning is a social experience, even online. Water Classroom fosters a vibrant global community where students can collaborate on projects, participate in moderated discussions, and join interest-based clubs, all within a safe and inspiring digital campus.
        </p>
        <p>
          We're not just teaching for today; we're preparing students for tomorrow. Our AI-verified credentials, coupled with a portfolio of sophisticated project work and critical thinking skills, provide a robust bridge to higher education and future career opportunities.
        </p>
      </div>
    </div>
  </section>
);

// Onboarding Process Section
const OnboardingProcessSection: React.FC = () => (
  <section className="py-16 md:py-20 bg-slate-50"> {/* Alternating background */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
          Your Personalized Journey Starts Here
        </h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Getting started with Water Classroom is quick and easy. In just a few steps, we'll gather what we need to build a learning experience perfectly suited to your goals and needs.
        </p>
      </div>
      <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-8 md:gap-12 text-center">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <UserCircle size={48} className="text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Step 1: Tell Us About Yourself</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Are you a homeschool parent setting up a family account, a K-12 student ready to dive in, an undergraduate exploring new subjects, or an individual learner charting your own course? Letting us know your role helps us point you to the right features and support from day one.
          </p>
        </div>
        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <Globe size={48} className="text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Step 2: Choose Your Learning Universe</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Select your country to see relevant curriculum alignments (like Common Core, GCSE, IB, and more), or explore our extensive range of globally applicable subjects. Pick your initial areas of interest, and we'll prepare your personalized academic dashboard.
          </p>
        </div>
        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <LayoutDashboard size={48} className="text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Step 3: Launch Your Personalized Dashboard!</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            That's it! With these key insights, Water Classroom instantly configures your personalized dashboard, recommends starting points in your chosen curricula, and ensures your AI Tutor, Aqua, is ready to assist with your specific learning objectives. Your tailored education adventure begins now!
          </p>
        </div>
      </div>
      <p className="mt-12 md:mt-16 text-center text-slate-600 max-w-3xl mx-auto">
        This initial setup is just the beginning. As you learn, Water Classroom continuously adapts, ensuring your educational journey remains relevant, engaging, and incredibly effective.
      </p>
    </div>
  </section>
);

// Core Features Section
const CoreFeaturesSection: React.FC = () => (
  <section id="core-features" className="py-16 md:py-20 bg-white"> {/* Adjusted to bg-white for alternating pattern */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12 md:mb-16">The Technology Fueling Your Success</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<Cpu />}
          title="AI-Personalized Curriculum"
          description="At the heart of Water Classroom lies our advanced AI, leveraging Retrieval Augmented Generation (RAG) and dynamic knowledge graphs. This isn't just adaptive learning; it's a deeply personalized educational experience that intelligently curates and sequences content based on your unique learning profile, ensuring you're always learning what you need, when you need it, in the most effective way."
        />
        <FeatureCard
          icon={<Bot />}
          title="Aqua - Your 24/7 AI Tutor"
          description="Meet Aqua, your personal AI academic guide, available 24/7. Whether you're grappling with complex calculus or exploring the nuances of Shakespeare, Aqua offers patient, step-by-step explanations via text or voice. It understands context, clarifies doubts, and helps you build a solid foundation of understanding, making learning support instantaneous and always accessible."
        />
        <FeatureCard
          icon={<Award />}
          title="Gamified Universe"
          description="Transform your education into an epic adventure! Water Classroom integrates sophisticated gamification across all learning modules. Earn experience points (XP) for completing lessons, unlock achievement badges for mastering skills, rise through the ranks on competitive leaderboards, and maintain daily learning streaks to build lasting habits. It's motivation, redefined."
        />
        <FeatureCard
          icon={<ClipboardCheck />}
          title="AI-Secured Assessments"
          description="Demonstrate your knowledge with confidence. Our assessment suite ranges from AI-driven auto-graded quizzes and AI-assisted essay scoring to cutting-edge webcam proctoring for formal examinations. This multi-layered approach ensures academic integrity, provides trustworthy feedback, and generates verifiable results that truly reflect your learning."
        />
      </div>
    </div>
  </section>
);

// Pricing Section
const PricingSection: React.FC = () => (
  <section className="py-16 md:py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          We offer flexible plans to suit your learning style, whether you're looking for a comprehensive online school experience or powerful tools for individual study.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Water School Plan Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 flex flex-col border-t-4 border-blue-600">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Water School Plan</h3>
          <div className="flex items-baseline justify-center mb-6">
            <span className="text-4xl md:text-5xl font-extrabold text-slate-800">$49.99</span>
            <span className="text-slate-500 ml-1">/month</span>
          </div>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Full K-12 to Undergraduate Curriculum</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Personalized AI Learning Paths</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">24/7 AI Tutoring with Aqua</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">AI-Verified Exams & Credentials</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Parent/Guardian Progress Dashboards</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Collaborative Study Tools</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Full Gamified Learning Universe</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Creator Marketplace Access</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Priority Support</span>
            </li>
          </ul>
          <Link
            to={APP_ROUTES.AUTH}
            className="block w-full py-3 px-6 text-center text-white font-semibold rounded-lg shadow-md mt-auto bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-600 hover:via-blue-700 hover:to-blue-900 relative overflow-hidden button-shimmer transition-all duration-150 ease-in-out"
          >
            Choose Water School Plan
          </Link>
        </div>

        {/* Individual Learner Plan Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 flex flex-col border border-slate-200">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Individual Learner Plan</h3>
          <div className="flex items-baseline justify-center mb-6">
            <span className="text-4xl md:text-5xl font-extrabold text-slate-800">$39.99</span>
            <span className="text-slate-500 ml-1">/month</span>
          </div>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Full K-12 to Undergraduate Curriculum</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Personalized AI Learning Paths</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">24/7 AI Tutoring with Aqua</span>
            </li>
            {/* AI-Verified Exams & Credentials feature removed from Individual Learner Plan */}
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Personal Progress Tracking</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Full Gamified Learning Universe</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Creator Marketplace Access</span>
            </li>
            <li className="flex items-start">
              <CheckCircle size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-600">Standard Support</span>
            </li>
          </ul>
          <Link
            to={APP_ROUTES.AUTH}
            className="block w-full py-3 px-6 text-center text-white font-semibold rounded-lg shadow-md mt-auto bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:from-blue-600 hover:via-blue-700 hover:to-blue-900 relative overflow-hidden button-shimmer transition-all duration-150 ease-in-out"
          >
            Choose Individual Plan
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// Final CTA Section
const FinalCTASection: React.FC = () => (
  <section className="py-20 md:py-28 bg-blue-600">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Begin Your Extraordinary Learning Odyssey Today!</h2>
      <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
        Step into Water Classroom and unlock a world of knowledge tailored just for you. With our free trial, you can explore core K-12 lessons, interact with our AI tutor Aqua, and get a taste of the gamified learning that makes education an adventure. Don't just learn – thrive. Your future self will thank you.
      </p>
      <Link
        to={APP_ROUTES.AUTH}
        className="inline-block px-10 py-4 border border-transparent text-lg font-semibold rounded-lg text-blue-700 bg-white hover:bg-slate-100 shadow-lg transform transition hover:scale-105 relative overflow-hidden button-shimmer"
      >
        Start My Free Trial & Explore
      </Link>
    </div>
  </section>
);


const LandingPage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <KeyBenefitsSection />
      <TheWaterSchoolExperienceSection />
      <OnboardingProcessSection /> {/* Added new section */}
      <CoreFeaturesSection />
      <PricingSection />
      <FinalCTASection />
    </div>
  );
};

export default LandingPage;
