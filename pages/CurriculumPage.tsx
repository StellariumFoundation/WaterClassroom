
import React, { useState, useEffect } from 'react'; // Added useEffect
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Curriculum, ToastType } from '../types'; // Removed SubjectType as it's not directly used in this component's logic
import { MOCK_CURRICULA_DATA, MOCK_COUNTRIES } from '../constants'; // Added MOCK_COUNTRIES
import { APP_ROUTES } from '../constants';
import { BookMarked, ChevronDown, ChevronUp, Search, ArrowRight, Globe } from 'lucide-react'; // Added Globe
import { useToastContext } from '../hooks/useToast';

interface CurriculumCardProps {
  curriculum: Curriculum;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const CurriculumCard: React.FC<CurriculumCardProps> = ({ curriculum, onSelect, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${isSelected ? 'border-blue-500 scale-105' : 'border-slate-200 hover:border-blue-300'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-semibold text-blue-700 mb-1">{curriculum.name}</h3>
          <p className="text-sm text-slate-500 mb-1">Target: {curriculum.targetAudience}</p>
          <p className="text-sm text-slate-600 mb-3">{curriculum.description}</p>
        </div>
        <button
          onClick={() => onSelect(curriculum.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isSelected ? 'bg-blue-600 text-white cursor-default' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
      
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 text-sm text-slate-600 hover:text-blue-600 flex items-center"
      >
        {isExpanded ? 'Hide Subjects' : 'Show Subjects'}
        {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-2 pl-4 border-l-2 border-blue-300">
          {curriculum.subjects.map(subject => (
            <div key={subject.id} className="p-2 bg-slate-50 rounded">
              <h4 className="font-medium text-slate-700">{subject.name}</h4>
              <p className="text-xs text-slate-500">{subject.lectures.length} lectures</p>
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
  const [selectedCountryKey, setSelectedCountryKey] = useState<string>(MOCK_COUNTRIES[0]?.key || 'generic');
  const [filteredCurricula, setFilteredCurricula] = useState<Curriculum[]>([]);

  useEffect(() => {
    let curricula = MOCK_CURRICULA_DATA;

    if (selectedCountryKey !== 'generic') {
      curricula = curricula.filter(c => c.countryKey === selectedCountryKey);
    }

    if (searchTerm) {
      curricula = curricula.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCurricula(curricula);
  }, [selectedCountryKey, searchTerm]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountryKey(event.target.value);
  };

  const handleSelectCurriculum = (id: string) => {
    updateUserCurriculum(id);
    const selected = MOCK_CURRICULA_DATA.find(c => c.id === id);
    addToast(`Curriculum "${selected?.name}" selected!`, ToastType.Success);
    navigate(APP_ROUTES.DASHBOARD);
  };
  
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8"> {/* Page background is bg-slate-100 from index.css */}
      <header className="mb-10 text-center">
        <BookMarked size={48} className="mx-auto text-blue-600 mb-4" />
        <h1 className="text-4xl font-bold text-slate-800">Select Your Curriculum</h1>
        <p className="text-slate-600 mt-2">Tailor your learning path by selecting a country and curriculum.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <label htmlFor="countrySelect" className="block text-sm font-medium text-slate-700 mb-1">
            Filter by Country
          </label>
          <div className="relative">
            <select
              id="countrySelect"
              value={selectedCountryKey}
              onChange={handleCountryChange}
              className="w-full p-3 pl-10 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              {MOCK_COUNTRIES.map(country => (
                <option key={country.key} value={country.key}>
                  {country.name}
                </option>
              ))}
            </select>
            <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="md:col-span-2 relative">
           <label htmlFor="searchCurricula" className="block text-sm font-medium text-slate-700 mb-1">
            Search Curricula
          </label>
          <input
            id="searchCurricula"
            type="text"
            placeholder="Search selected country's curricula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400"
          />
          <Search size={18} className="absolute left-3 top-1/2 mt-px -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {selectedCurriculumDetails && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg text-center"> {/* Light blue accent box */}
          <p className="text-blue-800">Currently selected: <span className="font-semibold">{selectedCurriculumDetails.name}</span></p>
          <Link to={APP_ROUTES.DASHBOARD} className="text-sm text-blue-600 hover:underline mt-1 inline-block">
            Go to Dashboard <ArrowRight size={14} className="inline-block ml-1" />
          </Link>
        </div>
      )}

      {filteredCurricula.length > 0 ? (
        <div className="space-y-6">
          {filteredCurricula.map(curriculum => (
            <CurriculumCard 
              key={curriculum.id} 
              curriculum={curriculum}
              onSelect={handleSelectCurriculum}
              isSelected={user?.selectedCurriculumId === curriculum.id}
            />
          ))}
        </div>
      ) : (
         <p className="text-center text-slate-500 py-10">No curricula found matching your criteria. Try adjusting filters or search term.</p>
      )}
    </div>
  );
};

export default CurriculumPage;