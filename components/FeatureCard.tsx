
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
    <div className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-200 ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100 text-blue-600">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-blue-700">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
