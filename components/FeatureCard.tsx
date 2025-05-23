
import React from 'react';
import { LucideProps } from 'lucide-react'; // For icon type

interface FeatureCardProps {
  icon: React.ReactElement<LucideProps>; // Expect a Lucide icon component
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, className }) => {
  return (
    <div className={`bg-brand-slate-dark p-6 rounded-xl shadow-lg hover:shadow-brand-light-blue/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-brand-light-blue text-brand-navy">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-brand-slate-light">{title}</h3>
      <p className="text-brand-slate-medium text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
