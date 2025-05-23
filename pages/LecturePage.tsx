
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// Fix: Import ToastType
import { Lecture, Curriculum, Subject as SubjectType, ToastType } from '../types';
import { generateLectureContent } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { MOCK_CURRICULA_DATA } from '../constants';
import { APP_ROUTES } from '../constants';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Lightbulb, Video, Gamepad2, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useToastContext } from '../hooks/useToast';

const LecturePage: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToastContext();

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentCurriculum, setCurrentCurriculum] = useState<Curriculum | null>(null);
  const [currentSubject, setCurrentSubject] = useState<SubjectType | null>(null);
  const [lectureIndex, setLectureIndex] = useState(-1);

  const queryParams = new URLSearchParams(location.search);
  const curriculumId = queryParams.get('curriculumId');
  const subjectId = queryParams.get('subjectId');

  const fetchAndSetLecture = useCallback(async (lecId: string, cId: string | null, sId: string | null) => {
    setIsLoading(true);
    setError(null);

    if (!cId || !sId || !lecId) {
      setError("Missing curriculum, subject, or lecture information.");
      setIsLoading(false);
      return;
    }

    const curriculum = MOCK_CURRICULA_DATA.find(c => c.id === cId) as Curriculum | undefined;
    if (!curriculum) {
      setError("Curriculum not found.");
      setIsLoading(false);
      return;
    }
    setCurrentCurriculum(curriculum);

    const subject = curriculum.subjects.find(s => s.id === sId);
    if (!subject) {
      setError("Subject not found in curriculum.");
      setIsLoading(false);
      return;
    }
    setCurrentSubject(subject);
    
    const foundLecture = subject.lectures.find(l => l.id === lecId);
    const currentIndex = subject.lectures.findIndex(l => l.id === lecId);
    setLectureIndex(currentIndex);

    if (foundLecture) {
      if (foundLecture.content === 'Placeholder for AI generated content.' || foundLecture.aiGenerated) {
        try {
          const generatedLecture = await generateLectureContent(foundLecture.title, subject.name, curriculum.targetAudience);
          if (generatedLecture) {
            setLecture({ ...foundLecture, ...generatedLecture, id: foundLecture.id }); // Keep original ID
          } else {
            setLecture(foundLecture); // Fallback to placeholder if generation fails
            setError("Failed to generate lecture content from AI. Displaying placeholder.");
            // Fix: Use ToastType.Warning instead of "warning"
            addToast("AI content generation failed.", ToastType.Warning);
          }
        } catch (e) {
          console.error("Error generating lecture from AI:", e);
          const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while generating content.";
          setError(errorMessage);
          // Fix: Use ToastType.Error instead of "error"
          addToast(errorMessage, ToastType.Error);
          setLecture(foundLecture); // Fallback
        }
      } else {
        setLecture(foundLecture);
      }
    } else {
      setError("Lecture not found.");
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast]); // addToast is stable

  useEffect(() => {
    fetchAndSetLecture(lectureId!, curriculumId, subjectId);
  }, [lectureId, curriculumId, subjectId, fetchAndSetLecture]);

  const navigateLecture = (direction: 'next' | 'prev') => {
    if (!currentSubject || lectureIndex === -1) return;
    const newIndex = direction === 'next' ? lectureIndex + 1 : lectureIndex - 1;
    if (newIndex >= 0 && newIndex < currentSubject.lectures.length) {
      const nextLectureId = currentSubject.lectures[newIndex].id;
      navigate(`${APP_ROUTES.LECTURE}/${nextLectureId}?curriculumId=${curriculumId}&subjectId=${subjectId}`);
    }
  };


  const renderLectureContent = () => {
    if (!lecture) return <p className="text-brand-slate-medium">No lecture content available.</p>;

    switch (lecture.type) {
      case 'text':
        return (
          <div className="prose prose-lg prose-invert max-w-none lg:prose-xl text-brand-slate-light">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-brand-light-blue !mb-6 !mt-8" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-brand-light-blue !mb-4 !mt-6" {...props} />,
                p: ({node, ...props}) => <p className="!leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="!list-disc !ml-5" {...props} />,
                ol: ({node, ...props}) => <ol className="!list-decimal !ml-5" {...props} />,
                strong: ({node, ...props}) => <strong className="text-brand-light-blue" {...props} />,
                a: ({node, ...props}) => <a className="text-brand-light-blue hover:underline" {...props} />,
              }}
            >
              {lecture.content}
            </ReactMarkdown>
          </div>
        );
      case 'video':
        return (
          <div className="aspect-w-16 aspect-h-9">
            { lecture.content.startsWith('https://picsum.photos') ? 
                <img src={lecture.content} alt={lecture.title} className="w-full h-full object-cover rounded-lg shadow-lg" /> 
                : <iframe src={lecture.content} title={lecture.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full rounded-lg shadow-lg"></iframe>
            }
            <p className="mt-2 text-sm text-brand-slate-medium">Video lecture: {lecture.title}</p>
          </div>
        );
      case 'interactive':
      case 'game_placeholder':
        return (
          <div className="p-6 bg-brand-slate-dark rounded-lg text-center">
            {lecture.type === 'interactive' ? <Lightbulb size={48} className="mx-auto mb-4 text-brand-light-blue" /> : <Gamepad2 size={48} className="mx-auto mb-4 text-brand-light-blue" />}
            <h3 className="text-xl font-semibold text-brand-slate-light mb-2">Interactive Module: {lecture.title}</h3>
            <p className="text-brand-slate-medium">{lecture.content}</p>
            <p className="mt-4 text-xs text-yellow-400">(This is a placeholder for an interactive element or game.)</p>
          </div>
        );
      default:
        return <p className="text-brand-slate-medium">Unsupported lecture type.</p>;
    }
  };
  
  const lectureIcon = lecture?.type === 'video' ? <Video size={24} /> : lecture?.type === 'interactive' || lecture?.type === 'game_placeholder' ? <Lightbulb size={24} /> : <BookOpen size={24} />;


  if (isLoading) return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><LoadingSpinner text="Loading lecture..." size="lg" /></div>;
  
  if (error) return (
    <div className="max-w-3xl mx-auto p-8 text-center">
      <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold text-red-400 mb-2">Error Loading Lecture</h2>
      <p className="text-brand-slate-medium">{error}</p>
      <button onClick={() => navigate(APP_ROUTES.DASHBOARD)} className="mt-6 px-6 py-2 bg-brand-light-blue text-brand-navy rounded-lg font-medium hover:bg-opacity-80">
        Back to Dashboard
      </button>
    </div>
  );
  
  if (!lecture) return <p className="text-center text-brand-slate-medium py-10">Lecture not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8 pb-4 border-b border-brand-slate-medium">
        <div className="flex items-center text-brand-light-blue mb-2">
          {lectureIcon}
          <span className="ml-2 text-sm font-medium uppercase tracking-wider">{currentSubject?.name || 'Subject'} / {lecture.type}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-brand-slate-light leading-tight">{lecture.title}</h1>
        {lecture.estimatedDurationMinutes && (
          <p className="text-sm text-brand-slate-medium mt-1">Estimated duration: {lecture.estimatedDurationMinutes} minutes</p>
        )}
      </header>
      
      {lecture.imagePlaceholderUrl && lecture.type !== 'video' && (
        <img 
          src={lecture.imagePlaceholderUrl} 
          alt={`${lecture.title} visual representation`} 
          className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg mb-8" 
        />
      )}

      <article className="mb-12">
        {renderLectureContent()}
      </article>

      <nav className="flex justify-between items-center pt-6 border-t border-brand-slate-medium">
        <button
          onClick={() => navigateLecture('prev')}
          disabled={lectureIndex <= 0}
          className="flex items-center px-6 py-3 bg-brand-purple text-white rounded-lg hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Previous
        </button>
        <span className="text-sm text-brand-slate-medium">
          Lecture {lectureIndex + 1} of {currentSubject?.lectures.length || 0}
        </span>
        <button
          onClick={() => navigateLecture('next')}
          disabled={!currentSubject || lectureIndex >= currentSubject.lectures.length - 1}
          className="flex items-center px-6 py-3 bg-brand-purple text-white rounded-lg hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next <ArrowRight size={20} className="ml-2" />
        </button>
      </nav>
    </div>
  );
};

export default LecturePage;