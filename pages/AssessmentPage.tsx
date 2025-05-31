
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Fix: Import ToastType
import { Assessment, AssessmentQuestion, Curriculum, Subject as SubjectType, ToastType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { APP_ROUTES, MOCK_CURRICULA_DATA } from '../constants';
import { generateAssessmentQuestions } from '../services/geminiService';
import { useToastContext } from '../hooks/useToast';
import { CheckSquare, ShieldAlert, Camera, FileText, AlertCircle, BarChartHorizontalBig, HelpCircle } from 'lucide-react';

interface Answer {
  questionId: string;
  answer: string;
}

const AssessmentPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToastContext();
  const { user, loading: authLoading, selectedCurriculumId: userSelectedCurriculumId } = useAuth();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  
  const queryParams = new URLSearchParams(location.search);
  const curriculumIdParam = queryParams.get('curriculumId');
  const subjectIdParam = queryParams.get('subjectId');

  // Fetch or find assessment details
  const loadAssessmentDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    if (!assessmentId || !curriculumIdParam || !subjectIdParam) {
        // This case handles when user navigates to /assessment directly, show list of assessments.
        // For now, let's just show a message or redirect.
        // A more robust solution would list available assessments here.
        setError("Please select an assessment from your curriculum.");
        setIsLoading(false);
        // For a demo, if no ID, we can't load a specific assessment.
        // Let's mock a list of assessments or use a default one if no ID is provided.
        // For now, if no specific assessment ID, it will show available ones.
        // If assessmentId is present, load that specific one.
        if (!assessmentId) return; // Wait for specific assessment to be chosen.
    }

    const curriculum = MOCK_CURRICULA_DATA.find(c => c.id === curriculumIdParam) as Curriculum | undefined;
    if (!curriculum) { setError("Curriculum not found."); setIsLoading(false); return; }
    
    const subject = curriculum.subjects.find(s => s.id === subjectIdParam) as SubjectType | undefined;
    if (!subject) { setError("Subject not found."); setIsLoading(false); return; }
    
    const foundAssessment = subject.assessments?.find(a => a.id === assessmentId);
    if (!foundAssessment) { setError("Assessment not found."); setIsLoading(false); return; }
    
    setAssessment(foundAssessment as Assessment); // Cast here as MOCK_CURRICULA_DATA might not be strictly typed as Curriculum[]

    if (foundAssessment.questions && foundAssessment.questions.length > 0) {
        setQuestions(foundAssessment.questions as AssessmentQuestion[]); // Cast here as well
    } else {
        // Try to generate questions if none are predefined
        try {
            // Fix: Use ToastType.Info instead of "info"
            addToast("Generating assessment questions using AI...", ToastType.Info);
            const questionsJsonString = await generateAssessmentQuestions(foundAssessment.title, subject.name, 5, "multiple_choice");
            const parsedQuestions = JSON.parse(questionsJsonString) as AssessmentQuestion[];
            setQuestions(parsedQuestions.map((q, idx) => ({...q, id: `${foundAssessment.id}-q${idx}`})));
            // Fix: Use ToastType.Success instead of "success"
            addToast("AI Questions generated!", ToastType.Success);
        } catch (genError) {
            console.error("Failed to generate questions:", genError);
            setError("Failed to generate assessment questions. Please try again later.");
            // Fix: Use ToastType.Error instead of "error"
            addToast("AI Question generation failed.", ToastType.Error);
        }
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId, curriculumIdParam, subjectIdParam, addToast]);


  useEffect(() => {
    if (assessmentId) { // Only load if a specific assessment ID is provided
        loadAssessmentDetails();
    } else {
        setIsLoading(false); // No specific assessment, nothing to load, show assessment list view.
    }
  }, [assessmentId, loadAssessmentDetails]);

  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to resolve
    }

    // Only apply this check if a specific assessment is being viewed
    if (assessmentId && user && !userSelectedCurriculumId) {
      // Only redirect if no assessment-specific error has occurred yet.
      // This prevents redirecting away from an "assessment not found" or "invalid params" error.
      if (!error) {
        addToast("Please select a curriculum before accessing assessments.", ToastType.Info);
        navigate(APP_ROUTES.CURRICULUM_SELECT, { replace: true });
      }
    }
  }, [user, authLoading, userSelectedCurriculumId, assessmentId, navigate, addToast, error]);

  const handleAnswerChange = (questionId: string, answerValue: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, answer: answerValue } : a);
      }
      return [...prev, { questionId, answer: answerValue }];
    });
  };

  const handleSubmit = () => {
    // Mock submission and grading
    setIsLoading(true);
    let correctAnswers = 0;
    questions.forEach(q => {
      const userAnswer = answers.find(a => a.questionId === q.id)?.answer;
      if (userAnswer && q.correctAnswer && userAnswer.toLowerCase() === q.correctAnswer.toLowerCase()) {
        correctAnswers++;
      }
    });
    const calculatedScore = (correctAnswers / questions.length) * 100;
    setScore(parseFloat(calculatedScore.toFixed(2)));
    setIsSubmitted(true);
    setIsLoading(false);
    // Fix: Use ToastType.Success instead of "success"
    addToast(`Assessment submitted! Your score: ${calculatedScore.toFixed(0)}%`, ToastType.Success);
  };

  if (authLoading) { // Always show auth loading first if it's happening
    return (
        <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
            <LoadingSpinner text="Verifying user session..." size="lg" />
        </div>
    );
  }
  // If auth is done, then consider lecture-specific loading:
  if (isLoading && assessmentId) { // Only show "Loading assessment..." if we are fetching a specific one
    return (
        <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
            <LoadingSpinner text="Loading assessment..." size="lg" />
        </div>
    );
  }
  
  if (error) return (
    <div className="max-w-3xl mx-auto p-8 text-center">
      <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold text-red-400 mb-2">Error Loading Assessment</h2>
      <p className="text-brand-slate-medium">{error}</p>
      <button onClick={() => navigate(APP_ROUTES.DASHBOARD)} className="mt-6 px-6 py-2 bg-brand-light-blue text-brand-navy rounded-lg font-medium hover:bg-opacity-80">
        Back to Dashboard
      </button>
    </div>
  );

  // If no assessment ID, show a list of available assessments (simplified)
  if (!assessmentId) {
    const availableAssessments: (Assessment & { curriculumId: string, subjectId: string})[] = [];
    MOCK_CURRICULA_DATA.forEach(curr => {
        curr.subjects.forEach(subj => {
            if (subj.assessments) {
                subj.assessments.forEach(ass => {
                    // Fix: Cast ass.type to Assessment['type'] to ensure type compatibility.
                    availableAssessments.push({
                        ...ass,
                        type: ass.type as Assessment['type'], // Ensure the type is one of 'homework' | 'quiz' | 'exam'
                        curriculumId: curr.id, 
                        subjectId: subj.id
                    });
                });
            }
        });
    });

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8 text-center">
                <BarChartHorizontalBig size={48} className="mx-auto text-brand-light-blue mb-4" />
                <h1 className="text-4xl font-bold text-brand-slate-light">Available Assessments</h1>
                <p className="text-brand-slate-medium mt-2">Choose an assessment to begin.</p>
            </header>
            {availableAssessments.length > 0 ? (
                <div className="space-y-4">
                    {availableAssessments.map(ass => (
                        <div key={ass.id} className="bg-brand-slate-dark p-4 rounded-lg shadow hover:shadow-brand-light-blue/20">
                            <h2 className="text-xl font-semibold text-brand-light-blue">{ass.title}</h2>
                            <p className="text-sm text-brand-slate-medium">{ass.description}</p>
                            <p className="text-xs text-brand-slate-medium mt-1">Type: {ass.type} {ass.requiresProctoring ? '(Proctored)' : ''}</p>
                            <button 
                                onClick={() => navigate(`${APP_ROUTES.ASSESSMENT}/${ass.id}?curriculumId=${ass.curriculumId}&subjectId=${ass.subjectId}`)}
                                className="mt-3 px-4 py-2 bg-brand-purple text-white rounded-md text-sm font-medium hover:bg-opacity-80"
                            >
                                Start Assessment
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-brand-slate-medium">No assessments currently available.</p>
            )}
        </div>
    );
  }


  // Specific assessment view
  if (!assessment) return <p className="text-center text-brand-slate-medium py-10">Assessment details not found.</p>;

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <FileText size={48} className="mx-auto text-brand-light-blue mb-4" />
        <h1 className="text-3xl font-bold text-brand-slate-light mb-3">{assessment.title}</h1>
        <p className="text-brand-slate-medium mb-2">Type: {assessment.type}</p>
        <p className="text-brand-slate-medium mb-6">{assessment.description}</p>
        {assessment.requiresProctoring && (
          <div className="my-6 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg text-yellow-300 text-sm">
            <div className="flex items-center justify-center mb-2">
              <ShieldAlert size={24} className="mr-2 text-yellow-400" />
              <h3 className="font-semibold">Proctored Exam Notice</h3>
            </div>
            <p>This exam requires camera access for proctoring. Please ensure your camera is working and you are in a well-lit environment. By starting this exam, you consent to proctoring.</p>
          </div>
        )}
        <button 
          onClick={() => setIsStarted(true)}
          className="w-full px-8 py-3 bg-brand-light-blue text-brand-navy rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-colors flex items-center justify-center"
        >
          {assessment.requiresProctoring && <Camera size={20} className="mr-2" />}
          Start Assessment
        </button>
      </div>
    );
  }

  if (isSubmitted && score !== null) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <CheckSquare size={48} className="mx-auto text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-brand-slate-light mb-3">Assessment Complete!</h1>
        <p className="text-brand-slate-medium mb-4">You scored: <span className="text-4xl font-bold text-brand-light-blue">{score}%</span></p>
        {/* Could show breakdown of answers here */}
        <button onClick={() => navigate(APP_ROUTES.DASHBOARD)} className="mt-8 px-6 py-2 bg-brand-purple text-white rounded-lg font-medium hover:bg-opacity-80">
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const currentQ = questions[currentQuestionIndex];
  if (!currentQ) return <p className="text-center text-brand-slate-medium py-10">No questions available for this assessment.</p>;


  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-brand-slate-light">{assessment.title}</h1>
        <p className="text-brand-slate-medium">Question {currentQuestionIndex + 1} of {questions.length}</p>
      </header>

      {assessment.requiresProctoring && (
        <div className="mb-4 p-2 bg-red-700 text-white text-xs rounded flex items-center justify-center">
            <Camera size={14} className="mr-2" /> Proctoring Active
        </div>
      )}

      <div className="bg-brand-slate-dark p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-brand-slate-light mb-4">{currentQ.text}</h2>
        <div className="space-y-3">
          {currentQ.type === 'multiple_choice' && currentQ.options?.map((option, index) => (
            <label key={index} className="flex items-center p-3 bg-brand-navy hover:bg-brand-indigo rounded-lg cursor-pointer transition-colors">
              <input
                type="radio"
                name={currentQ.id}
                value={option}
                checked={answers.find(a => a.questionId === currentQ.id)?.answer === option}
                onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                className="form-radio h-5 w-5 text-brand-light-blue bg-gray-700 border-gray-600 focus:ring-brand-light-blue"
              />
              <span className="ml-3 text-brand-slate-light">{option}</span>
            </label>
          ))}
          {currentQ.type === 'short_answer' && (
            <textarea
              value={answers.find(a => a.questionId === currentQ.id)?.answer || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              rows={3}
              className="w-full p-2 bg-brand-navy border border-brand-slate-medium rounded-md text-brand-slate-light focus:ring-brand-light-blue focus:border-brand-light-blue"
              placeholder="Your answer..."
            />
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-opacity-80 disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
            className="px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-opacity-80"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Assessment'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;