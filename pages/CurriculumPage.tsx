
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
// Fix: Import Link component
import { useNavigate, Link } from 'react-router-dom';
// Fix: Import ToastType
import { Curriculum, Subject as SubjectType, ToastType } from '../types';
import { MOCK_CURRICULA_DATA } from '../constants';
import { APP_ROUTES } from '../constants';
import { BookMarked, ChevronDown, ChevronUp, Search, ArrowRight } from 'lucide-react';
import { useToastContext } from '../hooks/useToast';

interface CurriculumCardProps {
  curriculum: Curriculum;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const CurriculumCard: React.FC<CurriculumCardProps> = ({ curriculum, onSelect, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-brand-slate-dark p-6 rounded-xl shadow-lg transition-all duration-300 border-2 ${isSelected ? 'border-brand-light-blue scale-105' : 'border-transparent hover:border-brand-purple'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-semibold text-brand-light-blue mb-1">{curriculum.name}</h3>
          <p className="text-sm text-brand-slate-medium mb-1">Target: {curriculum.targetAudience}</p>
          <p className="text-sm text-brand-slate-medium mb-3">{curriculum.description}</p>
        </div>
        <button onClick={() => onSelect(curriculum.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isSelected ? 'bg-brand-light-blue text-brand-navy cursor-default' : 'bg-brand-purple text-white hover:bg-opacity-80'}`}>
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
      
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 text-sm text-brand-slate-medium hover:text-brand-light-blue flex items-center"
      >
        {isExpanded ? 'Hide Subjects' : 'Show Subjects'}
        {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-2 pl-4 border-l-2 border-brand-purple">
          {curriculum.subjects.map(subject => (
            <div key={subject.id} className="p-2 bg-brand-navy rounded">
              <h4 className="font-medium text-brand-slate-light">{subject.name}</h4>
              <p className="text-xs text-brand-slate-medium">{subject.lectures.length} lectures</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CurriculumPage: React.FC = () => {
  const { user, updateUserCurriculum, selectedCurriculumDetails } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToastContext();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectCurriculum = (id: string) => {
    updateUserCurriculum(id);
    const selected = MOCK_CURRICULA_DATA.find(c=>c.id === id);
    // Fix: Use ToastType.Success instead of "success"
    addToast(`Curriculum "${selected?.name}" selected!`, ToastType.Success);
    navigate(APP_ROUTES.DASHBOARD); // Navigate to dashboard after selection
  };
  
  const filteredCurricula = MOCK_CURRICULA_DATA.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-10 text-center">
        <BookMarked size={48} className="mx-auto text-brand-light-blue mb-4" />
        <h1 className="text-4xl font-bold text-brand-slate-light">Select Your Curriculum</h1>
        <p className="text-brand-slate-medium mt-2">Choose the learning path that's right for you.</p>
      </header>

      <div className="mb-8 relative">
        <input 
          type="text"
          placeholder="Search curricula (e.g., GCSE, Math, Grade 9)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 bg-brand-slate-dark border border-brand-slate-medium rounded-lg text-brand-slate-light focus:ring-2 focus:ring-brand-light-blue focus:outline-none"
        />
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-slate-medium" />
      </div>

      {selectedCurriculumDetails && (
        <div className="mb-8 p-4 bg-brand-indigo rounded-lg text-center">
          <p className="text-brand-slate-light">Currently selected: <span className="font-semibold">{selectedCurriculumDetails.name}</span></p>
          {/* Fix: Link component is now imported */}
          <Link to={APP_ROUTES.DASHBOARD} className="text-sm text-brand-light-blue hover:underline mt-1 inline-block">
            Go to Dashboard <ArrowRight size={14} className="inline-block ml-1" />
          </Link>
        </div>
      )}

      {filteredCurricula.length > 0 ? (
        <div className="space-y-6">
          {filteredCurricula.map(curriculum => (
            <CurriculumCard 
              key={curriculum.id} 
              curriculum={curriculum as Curriculum} 
              onSelect={handleSelectCurriculum}
              isSelected={user?.selectedCurriculumId === curriculum.id}
            />
          ))}
        </div>
      ) : (
         <p className="text-center text-brand-slate-medium py-10">No curricula found matching your search. Try a different term.</p>
      )}
    </div>
  );
};

export default CurriculumPage;