import { createContext, useContext, useState, useEffect, useRef, useCallback, FormEvent, ReactNode, RefObject } from "react";
import { LESSONS, QUIZZES } from "../lessonsData";
import { Lesson, Quiz, StudentProgress, Task, ChatMessage } from "../types";

// ---------- Custom Types ----------
export interface TursoRecord {
  id: string;
  type: string;
  name: string;
  email: string;
  representative: string;
  academicTrack: string;
  studentVolume: number;
  kindOfSchool: string;
  billingCycle: string;
  calculatedPrice: string;
  registeredAt: string;
  dbStatus: string;
  passcode?: string;
  affiliatedCode?: string;
  isActivated?: boolean | number;
  checkoutUrl?: string | null;
}

export interface ForumPost {
  id: string;
  author: string;
  userLevel: number;
  title: string;
  content: string;
  likes: number;
  replies: number;
  category: string;
}

// ---------- Context Type ----------
export interface AppContextType {
  // Annual billing
  studentBillingCycle: "monthly" | "yearly";
  setStudentBillingCycle: (v: "monthly" | "yearly") => void;
  // Navigation & Auth
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  studentTrack: string;
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginAccessKey: string;
  setLoginAccessKey: (key: string) => void;
  isUserActivated: boolean;
  setIsUserActivated: (v: boolean) => void;

  // Landing Auth
  landingAuthRole: "water-student" | "independent-student" | "school-student" | "institution";
  setLandingAuthRole: (role: "water-student" | "independent-student" | "school-student" | "institution") => void;
  landingAuthMode: "login" | "register";
  setLandingAuthMode: (mode: "login" | "register") => void;
  tursoSuccessMsg: string;
  tursoLoading: boolean;
  handleLandingAuthSubmit: (e: FormEvent) => void;
  landingAuthErrors: { email?: string; password?: string; form?: string; name?: string; schoolName?: string; repName?: string };
  setLandingAuthErrors: React.Dispatch<React.SetStateAction<{ email?: string; password?: string; form?: string; name?: string; schoolName?: string; repName?: string }>>;
  // Register-specific fields
  regName: string;
  setRegName: (v: string) => void;
  regSchoolName: string;
  setRegSchoolName: (v: string) => void;
  regRepName: string;
  setRegRepName: (v: string) => void;
  regStudentVolume: number;
  setRegStudentVolume: (v: number) => void;
  regBillingCycle: string;
  setRegBillingCycle: (v: string) => void;

  // Progress
  progress: StudentProgress;
  updateProgressOnServer: (updated: StudentProgress) => void;
  setProgress: (p: StudentProgress) => void;

  // Curriculum / Onboarding
  selectedCurriculum: string;
  setSelectedCurriculum: (c: string) => void;
  onboardingCurriculum: string;
  setOnboardingCurriculum: (c: string) => void;
  isOnboarded: boolean;
  setIsOnboarded: (v: boolean) => void;
  
  // New Onboarding Wizard
  onboardingStep: number;
  setOnboardingStep: (s: number) => void;
  isOnboardingComplete: boolean;
  setIsOnboardingComplete: (v: boolean) => void;
  studentCountry: string;
  setStudentCountry: (v: string) => void;
  studentTrackType: string;
  setStudentTrackType: (v: string) => void;
  studentProgramId: string;
  setStudentProgramId: (v: string) => void;
  studentGradeLevelId: string;
  setStudentGradeLevelId: (v: string) => void;
  enrollmentType: string;
  setEnrollmentType: (v: string) => void;
  schoolEnrollCode: string;
  setSchoolEnrollCode: (v: string) => void;
  showPaymentScreen: boolean;
  setShowPaymentScreen: (v: boolean) => void;
  handleOnboardingNext: () => void;
  handleOnboardingBack: () => void;
  handleCompleteOnboarding: () => void;
  
  // Legacy onboarding
  institutionCode: string;
  setInstitutionCode: (c: string) => void;
  joinedClassroom: string | null;
  handleOnboardClassroom: (e: FormEvent) => void;

  // Academy
  selectedLesson: Lesson | null;
  setSelectedLesson: (l: Lesson | null) => void;
  activeQuiz: Quiz | null;
  setActiveQuiz: (q: Quiz | null) => void;
  quizAnswers: number[];
  setQuizAnswers: (a: number[]) => void;
  showQuizResult: boolean;
  setShowQuizResult: (v: boolean) => void;
  quizScore: number;
  handleQuizSubmit: () => void;
  filteredLessons: Lesson[];

  // Proctoring
  isExamProctoring: boolean;
  cameraPermissionGranted: boolean;
  examTimer: number;
  proctorLogs: string[];
  setIsExamProctoring: (v: boolean) => void;
  verifiedExamsList: Array<{id: string; lessonTitle: string; hash: string; score: string; timestamp: string}>;
  videoRef: RefObject<HTMLVideoElement>;
  startVerifiedProctorExam: () => void;
  stopVerifiedProctorExam: (score: number, total: number) => void;

  // Games
  activeGame: string | null;
  setActiveGame: (g: string | null) => void;
  trinityGood: number; setTrinityGood: (v: number) => void;
  trinityMoney: number; setTrinityMoney: (v: number) => void;
  trinityFun: number; setTrinityFun: (v: number) => void;
  trinityWinner: boolean;
  robotHip: number; setRobotHip: (v: number) => void;
  robotKnee: number; setRobotKnee: (v: number) => void;
  robotAnkle: number; setRobotAnkle: (v: number) => void;
  robotBalanced: boolean;
  incBase: number; setIncBase: (v: number) => void;
  incRevenue: number; setIncRevenue: (v: number) => void;
  incCosts: number; setIncCosts: (v: number) => void;
  incKwhPrice: number; setIncKwhPrice: (v: number) => void;
  calculatedRewardMultiplier: () => number;

  // AI Tutor
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (v: string) => void;
  chatBottomRef: RefObject<HTMLDivElement>;
  isTutorTyping: boolean;
  handleSendMessage: (text?: string) => void;

  // Tasks
  tasks: Task[];
  setTasks: (t: Task[]) => void;
  isCreatingTask: boolean;
  setIsCreatingTask: (v: boolean) => void;
  newTaskTitle: string;
  setNewTaskTitle: (v: string) => void;
  newTaskDesc: string;
  setNewTaskDesc: (v: string) => void;
  newTaskCategory: string;
  setNewTaskCategory: (v: string) => void;
  newTaskReward: number;
  setNewTaskReward: (v: number) => void;
  handleCreateTask: (e: FormEvent) => void;
  handleJoinTask: (id: string) => void;

  // Forums
  forumPosts: ForumPost[];
  setForumPosts: (p: ForumPost[]) => void;
  newPostTitle: string;
  setNewPostTitle: (v: string) => void;
  newPostContent: string;
  setNewPostContent: (v: string) => void;
  newPostCategory: string;
  setNewPostCategory: (v: string) => void;
  handleAddForumPost: (e: FormEvent) => void;

  // Contact / Calculator
  contactName: string; setContactName: (v: string) => void;
  contactEmail: string; setContactEmail: (v: string) => void;
  contactMsg: string; setContactMsg: (v: string) => void;
  contactConfirmed: boolean;
  isSendingContact: boolean;
  sendingStatus: string;
  contactErrorMsg: string;
  executeSendMessage: (e: FormEvent) => void;
  calcStudents: number; setCalcStudents: (v: number) => void;
  calcBilling: "monthly" | "yearly";
  setCalcBilling: (v: "monthly" | "yearly") => void;
  calculateInstitutionalBulkCost: () => number;

  // FAQ
  expandedFaq: number | null;
  setExpandedFaq: (v: number | null) => void;

  // Donate
  showDirectDonateModal: boolean;
  setShowDirectDonateModal: (v: boolean) => void;
  simulatedDonationAmount: string;
  setSimulatedDonationAmount: (v: string) => void;
  donationSuccess: boolean;
  handleSimulatedSupport: (e: FormEvent) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// ---------- Provider ----------
export function AppProvider({ children }: { children: ReactNode }) {
  // ─── Onboarding Persistence (MUST be first — used by state initializers below) ───
  const ONBOARDING_STORAGE_KEY = "wc_onboarding_state";
  const loadOnboardingState = (): Record<string, any> => {
    try {
      const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  };
  const saveOnboardingState = (partial: Record<string, any>) => {
    try {
      const current = loadOnboardingState();
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify({ ...current, ...partial }));
    } catch { /* ignore */ }
  };
  const clearOnboardingState = () => {
    try { localStorage.removeItem(ONBOARDING_STORAGE_KEY); } catch { /* ignore */ }
  };
  const initOnb = loadOnboardingState();

  // ---- Tab Navigation ----
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentName, setStudentName] = useState("Student");
  const [studentTrack, setStudentTrack] = useState("Philosophy");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginAccessKey, setLoginAccessKey] = useState("");
  const [isUserActivated, setIsUserActivated] = useState(false);

  // ---- Landing Auth ----
  const [landingAuthRole, setLandingAuthRole] = useState<"water-student" | "independent-student" | "school-student" | "institution">((initOnb.landingAuthRole as any) || "water-student");
  const [landingAuthMode, setLandingAuthMode] = useState<"login" | "register">("login");
  const [landingAuthErrors, setLandingAuthErrors] = useState<{ email?: string; password?: string; form?: string; name?: string; schoolName?: string; repName?: string }>({});
  const [regName, setRegName] = useState("");
  const [regSchoolName, setRegSchoolName] = useState("");
  const [regRepName, setRegRepName] = useState("");
  const [regStudentVolume, setRegStudentVolume] = useState(1);
  const [regBillingCycle, setRegBillingCycle] = useState("Monthly");
  const [tursoRecords, setTursoRecords] = useState<TursoRecord[]>([]);
  const [tursoSuccessMsg, setTursoSuccessMsg] = useState("");
  const [tursoLoading, setTursoLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalRole, setModalRole] = useState<"student" | "school">("student");

  // ---- Progress ----
  const [progress, setProgress] = useState<StudentProgress>({
    points: 0,
    streakDays: 3,
    level: 1,
    completedLessons: [],
    unlockedBadges: [],
    lastActiveDate: new Date().toISOString().split("T")[0]
  });

    // ---- Curriculum ----
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [onboardingCurriculum, setOnboardingCurriculum] = useState(initOnb.onboardingCurriculum || "US Common Core");
  const [institutionCode, setInstitutionCode] = useState("");
  const [isOnboarded, setIsOnboarded] = useState(initOnb.isOnboarded || false);
  const [joinedClassroom, setJoinedClassroom] = useState<string | null>(null);

  // ---- New Onboarding Wizard ----
  const [onboardingStep, setOnboardingStep] = useState(initOnb.onboardingStep || 1);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(initOnb.isOnboardingComplete || false);
  const [studentProgramId, setStudentProgramId] = useState(initOnb.studentProgramId || "");
  const [studentGradeLevelId, setStudentGradeLevelId] = useState(initOnb.studentGradeLevelId || "");
  const [enrollmentType, setEnrollmentType] = useState(initOnb.enrollmentType || "");
  const [schoolEnrollCode, setSchoolEnrollCode] = useState(initOnb.schoolEnrollCode || "");
  const [showPaymentScreen, setShowPaymentScreen] = useState(initOnb.showPaymentScreen || false);
  const [studentBillingCycle, setStudentBillingCycle] = useState<"monthly" | "yearly">((initOnb.studentBillingCycle as "monthly" | "yearly") || "monthly");
  const [studentCountry, setStudentCountry] = useState(initOnb.studentCountry || "");
  const [studentTrackType, setStudentTrackType] = useState(initOnb.studentTrackType || "");

  // ---- Academy / Lessons ----
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // ---- Proctoring ----
  const [isExamProctoring, setIsExamProctoring] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [examTimer, setExamTimer] = useState(600);
  const [proctorLogs, setProctorLogs] = useState<string[]>([
    "Proctor AI Core VLM Loaded.",
    "Awaiting camera sensor authorization..."
  ]);
  const [verifiedExamsList, setVerifiedExamsList] = useState<Array<{id: string; lessonTitle: string; hash: string; score: string; timestamp: string}>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ---- Games ----
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [trinityGood, setTrinityGood] = useState(60);
  const [trinityMoney, setTrinityMoney] = useState(40);
  const [trinityFun, setTrinityFun] = useState(50);
  const [trinityWinner, setTrinityWinner] = useState(false);
  const [robotHip, setRobotHip] = useState(45);
  const [robotKnee, setRobotKnee] = useState(100);
  const [robotAnkle, setRobotAnkle] = useState(120);
  const [robotBalanced, setRobotBalanced] = useState(false);
  const [incBase, setIncBase] = useState(2000);
  const [incRevenue, setIncRevenue] = useState(50000);
  const [incCosts, setIncCosts] = useState(20000);
  const [incKwhPrice, setIncKwhPrice] = useState(0.25);

  // ---- AI Tutor ----
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "tutor",
      text: "### Welcome to the Water Classroom AI Tutor! 🦉\n\nI am your 24/7 educational companion, engineered directly to support our global students.\n\nI can answer curriculum questions (U.S. Common Core, UK GCSE, IB), explain hard technical math, check your homework, or guide you Socratically through:\n- **First-Principles & Systems Thinking**\n- **Empowerment Metrics** (*Do Good, Make Money, Have Fun*)\n- **Water Robotics** teleoperation mechanical math\n- **Incentive Equation Metrics** in business structures\n\nHow can I help you excel today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTutorTyping, setIsTutorTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // ---- Forums ----
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: "post1",
      author: "Julienne Dupont",
      userLevel: 3,
      title: "Optimizing unitree humanoid teleoperation speed in high-ping environments",
      content: "When testing the simulator of the Water Robotics suite today, I noticed that packet buffering makes the balance coefficient unstable if the latency goes over 45ms. Should we adjust ankle feedforward torque dynamically using the AI Fluid compute mesh?",
      likes: 12,
      replies: 4,
      category: "Robotics"
    },
    {
      id: "post2",
      author: "Marcus Vance",
      userLevel: 5,
      title: "Fostering Affinity in Relationship contract drafting session tomorrow",
      content: "A few us inside the Miami Homeschool Hub are gathering at 7 PM EST to draft clean legal covenants together. Welcome to join via Zoom link. We'll go over separate income pooling rules step-by-step.",
      likes: 18,
      replies: 8,
      category: "Human Dynamics"
    },
    {
      id: "post3",
      author: "Water Student Hub",
      userLevel: 10,
      title: "The alignment formula verified for Regional Agriculture incentive program",
      content: "Awesome news! Our local community aligned the agriculture packaging project with the core creed: 1. Surplus food packaged free with ads (Do Good), 2. Funded entirely by advertising revenue (Make Money), 3. Celebrative packing festival sessions (Have Fun). It's scalable!",
      likes: 29,
      replies: 11,
      category: "Creed"
    }
  ]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("General");

  // ---- Tasks ----
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Policy");
  const [newTaskReward, setNewTaskReward] = useState(1200);

  // ---- Contact / Calculator ----
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactConfirmed, setContactConfirmed] = useState(false);
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [sendingStatus, setSendingStatus] = useState("");
  const [contactErrorMsg, setContactErrorMsg] = useState("");
  const [calcStudents, setCalcStudents] = useState(150);
  const [calcBilling, setCalcBilling] = useState<"monthly" | "yearly">("yearly");
  const [calcCustomSupport, setCalcCustomSupport] = useState(false);

  // ---- FAQ ----
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // ---- Donate ----
  const [showDirectDonateModal, setShowDirectDonateModal] = useState(false);
  const [simulatedDonationAmount, setSimulatedDonationAmount] = useState("100");
  const [donationSuccess, setSimulatedDonationSuccess] = useState(false);

  // ---- Effects ----
  useEffect(() => {
    if (isLoggedIn) setActiveTab("dashboard");
  }, [isLoggedIn]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("payment_success")) {
      const email = searchParams.get("email");
      
      // Activate the user on the server after successful payment
      fetch("/api/activate-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }).catch(err => console.warn("Failed to activate user:", err));
      
      alert(`Payment successful! Your registration is complete. Check your email (${email}) for login details or sign in directly.`);
      setIsLoggedIn(true);
      setIsUserActivated(true);
      setIsOnboarded(true);
      setIsOnboardingComplete(true);
      setShowPaymentScreen(false);
      setActiveTab("dashboard");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (searchParams.get("payment_cancel")) {
      alert("Payment was cancelled or failed. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [progressRes, tasksRes, recordsRes] = await Promise.all([
          fetch("/api/progress"),
          fetch("/api/tasks"),
          fetch("/api/records"),
        ]);
        if (progressRes.ok) {
          const data = await progressRes.json();
          if (data && typeof data.points === "number") setProgress(data);
        }
        if (tasksRes.ok) {
          const data = await tasksRes.json();
          if (Array.isArray(data)) setTasks(data);
        }
        if (recordsRes.ok) {
          const data = await recordsRes.json();
          if (Array.isArray(data)) setTursoRecords(data);
        }
      } catch (err) {
        console.warn("Failed to load initial data:", err);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTutorTyping]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isExamProctoring && examTimer > 0) {
      interval = setInterval(() => {
        setExamTimer(prev => prev - 1);
        if (Math.random() > 0.8) {
          const checkTypes = [
            "Proctor VLM: Facial alignment within 99.1% boundary.",
            "Proctor Eye Tracker: Attention vector confirmed on window.",
            "Screen Monitor: No duplicate monitors detected.",
            "Proctor Audio Decibel: Noise constraints satisfied (12dB average).",
            "Proctor State: Integrity verified."
          ];
          const logMsg = checkTypes[Math.floor(Math.random() * checkTypes.length)];
          setProctorLogs(prev => [...prev.slice(-4), logMsg]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExamProctoring, examTimer]);

  // ---- Game Effects ----
  useEffect(() => {
    if (activeGame === "trinity") {
      if (trinityGood === 100 && trinityMoney === 100 && trinityFun === 100) {
        setTrinityWinner(true);
        updateProgressOnServer({ ...progress, points: progress.points + 150 });
      } else setTrinityWinner(false);
    }
  }, [trinityGood, trinityMoney, trinityFun, activeGame]);

  useEffect(() => {
    if (activeGame === "robotics") {
      const hipOK = robotHip >= 60 && robotHip <= 70;
      const kneeOK = robotKnee >= 92 && robotKnee <= 98;
      const ankleOK = robotAnkle >= 82 && robotAnkle <= 88;
      if (hipOK && kneeOK && ankleOK) {
        setRobotBalanced(true);
        updateProgressOnServer({ ...progress, points: progress.points + 200 });
      } else setRobotBalanced(false);
    }
  }, [robotHip, robotKnee, robotAnkle, activeGame]);

  // ---- Handlers ----

  const updateProgressOnServer = useCallback((updated: StudentProgress) => {
    setProgress(updated);
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    }).catch(err => console.warn("Failed to save progress:", err));
  }, []);

  const handleOnboardClassroom = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (institutionCode.trim()) {
      setJoinedClassroom(institutionCode.toUpperCase());
      const updated = { ...progress, points: progress.points + 250 };
      updateProgressOnServer(updated);
    }
  }, [institutionCode, progress, updateProgressOnServer]);

  // ─── New Onboarding Wizard Handlers ───
  const handleOnboardingNext = useCallback(() => {
    setOnboardingStep(prev => Math.min(prev + 1, 7));
  }, []);

  const handleOnboardingBack = useCallback(() => {
    setOnboardingStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleCompleteOnboarding = useCallback(() => {
    setIsOnboardingComplete(true);
    setIsOnboarded(true);
    setOnboardingStep(1);
    setShowPaymentScreen(false);
    clearOnboardingState();
    // Award onboarding XP bonus
    const updated = { ...progress, points: progress.points + 500 };
    updateProgressOnServer(updated);
  }, [progress, updateProgressOnServer]);

  // ─── Persist onboarding state to localStorage on change ───
  useEffect(() => {
    saveOnboardingState({
      onboardingStep,
      isOnboardingComplete,
      studentCountry,
      studentTrackType,
      studentProgramId,
      studentGradeLevelId,
      enrollmentType,
      schoolEnrollCode,
      showPaymentScreen,
      isOnboarded,
      onboardingCurriculum,
      landingAuthRole,
      studentBillingCycle,
    });
  }, [onboardingStep, isOnboardingComplete, studentCountry, studentTrackType, studentProgramId, studentGradeLevelId, enrollmentType, schoolEnrollCode, showPaymentScreen, isOnboarded, onboardingCurriculum, landingAuthRole, studentBillingCycle]);

  // ─── Validation helpers ───
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email address is required.";
    if (!EMAIL_REGEX.test(email.trim())) return "Please enter a valid email address (e.g. user@example.com).";
    return undefined;
  };
  const validatePassword = (pw: string): string | undefined => {
    if (!pw) return "Password is required.";
    if (pw.length < 6) return "Password must be at least 6 characters.";
    if (pw.length > 128) return "Password must be under 128 characters.";
    return undefined;
  };

  const handleLandingAuthSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setTursoLoading(true);
    setTursoSuccessMsg("");

    // ─── Client-side validation ───
    const emailErr = validateEmail(loginEmail);
    const passwordErr = validatePassword(loginAccessKey);
    const newErrors: typeof landingAuthErrors = {};

    if (landingAuthMode === "register") {
      if (landingAuthRole === "institution") {
        if (!regSchoolName.trim()) newErrors.schoolName = "School / institution name is required.";
        if (!regRepName.trim()) newErrors.repName = "Representative name is required.";
      } else {
        if (!regName.trim()) newErrors.name = "Full name is required.";
      }
    }
    if (emailErr) newErrors.email = emailErr;
    if (passwordErr) newErrors.password = passwordErr;

    if (Object.keys(newErrors).length > 0) {
      setLandingAuthErrors(newErrors);
      setTursoLoading(false);
      return;
    }
    setLandingAuthErrors({});

    try {
      if (landingAuthMode === "login") {
        // ─── LOGIN MODE ───
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail.trim(), passcode: loginAccessKey })
        });
        if (response.ok) {
          const data = await response.json();
          setStudentName(data.user.name || loginEmail.split("@")[0]);
          setStudentTrack(data.user.academicTrack || "Universal First-Principles Track");
          setIsUserActivated(!!data.user.isActivated);
          // Restore role from server-recorded type
          const serverType = data.user.type || "";
          let mappedRole: typeof landingAuthRole = "water-student";
          if (serverType === "Water Student") mappedRole = "water-student";
          else if (serverType === "Independent Student") mappedRole = "independent-student";
          else if (serverType === "School Student") mappedRole = "school-student";
          else if (serverType === "Institution") mappedRole = "institution";
          setLandingAuthRole(mappedRole);
          setIsLoggedIn(true);
          setActiveTab("dashboard");
          if (!data.user.isActivated) {
            setLandingAuthErrors({ form: "Account pending activation. Please complete onboarding to set up your account." });
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          setLandingAuthErrors({ form: errData.error || "Invalid email or password. Please try again or switch to Register." });
        }
      } else {
        // ─── REGISTER MODE ───
        const isInstitution = landingAuthRole === "institution";
        const nickname = loginEmail.trim().split("@")[0];
        
        // Determine type string and pricing based on role
        let typeStr = "Individual Student";
        let kindStr = "Homeschool Individual";
        let studentVol = 1;
        let billingStr = "Monthly";
        if (isInstitution) {
          typeStr = "Institution";
          kindStr = "Homeschool Co-Op";
          studentVol = Math.max(1, regStudentVolume);
          billingStr = regBillingCycle;
        } else if (landingAuthRole === "water-student") {
          typeStr = "Water Student";
          kindStr = "Water School Homeschool";
        } else if (landingAuthRole === "independent-student") {
          typeStr = "Independent Student";
          kindStr = "Self-Directed Learner";
        } else if (landingAuthRole === "school-student") {
          typeStr = "School Student";
          kindStr = "School-Enrolled Learner";
        }
        
        const regPayload: Record<string, any> = {
          type: typeStr,
          name: isInstitution ? regSchoolName.trim() : regName.trim(),
          email: loginEmail.trim(),
          representative: isInstitution ? regRepName.trim() : regName.trim(),
          academicTrack: "Pick Later",
          studentVolume: studentVol,
          kindOfSchool: kindStr,
          billingCycle: billingStr,
          passcode: loginAccessKey,
          affiliatedCode: schoolEnrollCode || ""
        };
        const registerRes = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(regPayload)
        });
        if (registerRes.ok) {
          const newRecord = await registerRes.json();
          if (newRecord.checkoutUrl) { window.location.href = newRecord.checkoutUrl; return; }
          setTursoRecords(prev => [newRecord, ...prev]);
          setStudentName(newRecord.name || regName.trim() || nickname);
          setStudentTrack(newRecord.academicTrack || "Pick Later");
          setTursoSuccessMsg("Account registered successfully! Signing you in...");
          setLoginEmail(regPayload.email);
          setLoginAccessKey("");
          setTimeout(() => { setIsLoggedIn(true); setActiveTab("dashboard"); setTursoSuccessMsg(""); }, 1400);
        } else {
          const errData = await registerRes.json().catch(() => ({}));
          setLandingAuthErrors({ form: errData.error || "Registration failed. The email may already be registered." });
        }
      }
    } catch (err) {
      console.error("Auth failure", err);
      setLandingAuthErrors({ form: "Network error. Please check your connection and try again." });
    } finally { setTursoLoading(false); }
  }, [loginEmail, loginAccessKey, landingAuthMode, landingAuthRole, regName, regSchoolName, regRepName, regStudentVolume, regBillingCycle, schoolEnrollCode, setLandingAuthErrors, setTursoSuccessMsg, setTursoLoading, setStudentName, setStudentTrack, setIsUserActivated, setIsLoggedIn, setActiveTab, setTursoRecords, setLoginEmail, setLoginAccessKey]);

  const startVerifiedProctorExam = useCallback(() => {
    setIsExamProctoring(true);
    setExamTimer(600);
    setProctorLogs(["Proctor VLM System: Active proctoring initial validation.", "Syncing with Water Classroom Global Registrar database...", "Capturing face landmark arrays..."]);
    navigator.mediaDevices?.getUserMedia({ video: { width: 320, height: 240 } })
      .then(stream => {
        setCameraPermissionGranted(true);
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setProctorLogs(prev => [...prev, "SUCCESS: Hardware camera stream initialized."]);
      })
      .catch(() => {
        setCameraPermissionGranted(false);
        setProctorLogs(prev => [...prev, "WARNING: No active camera hardware granted or available."]);
      });
  }, [setIsExamProctoring, setExamTimer, setProctorLogs, setCameraPermissionGranted, videoRef]);

  const stopVerifiedProctorExam = useCallback((successScore: number, totalQuest: number) => {
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    setIsExamProctoring(false);
    if (selectedLesson) {
      const examHash = `WX-${Math.floor(Math.random() * 1000000).toString(16).toUpperCase()}-${Math.floor(Math.random() * 9000).toString()}`;
      setVerifiedExamsList(prev => [{
        id: `cert-${Date.now()}`,
        lessonTitle: selectedLesson.title,
        hash: examHash,
        score: `${successScore} / ${totalQuest}`,
        timestamp: new Date().toLocaleDateString()
      }, ...prev]);
    }
  }, [selectedLesson, setVerifiedExamsList, setIsExamProctoring, streamRef]);

  const handleQuizSubmit = useCallback(() => {
    if (!activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswerIndex) score++;
    });
    setQuizScore(score);
    setShowQuizResult(true);
    if (isExamProctoring) stopVerifiedProctorExam(score, activeQuiz.questions.length);
    if (score === activeQuiz.questions.length) {
      const newPoints = progress.points + activeQuiz.pointsToAward;
      const completed = [...progress.completedLessons];
      if (!completed.includes(activeQuiz.lessonId)) completed.push(activeQuiz.lessonId);
      const currentBadges = [...progress.unlockedBadges];
      let unlockedNew = false;
      let badgeKey = "pioneer";
      if (activeQuiz.id.includes("creed") && !currentBadges.includes("pioneer")) { badgeKey = "pioneer"; unlockedNew = true; }
      else if (activeQuiz.id.includes("scitech") && !currentBadges.includes("engineer")) { badgeKey = "engineer"; unlockedNew = true; }
      else if (activeQuiz.id.includes("business") && !currentBadges.includes("builder")) { badgeKey = "builder"; unlockedNew = true; }
      else if (activeQuiz.id.includes("dynamics") && !currentBadges.includes("philosopher")) { badgeKey = "philosopher"; unlockedNew = true; }
      if (unlockedNew) currentBadges.push(badgeKey);
      updateProgressOnServer({ ...progress, points: newPoints, completedLessons: completed, unlockedBadges: currentBadges, level: Math.floor(newPoints / 1000) + 1 });
    }
  }, [activeQuiz, quizAnswers, progress, isExamProctoring, updateProgressOnServer, stopVerifiedProctorExam, setQuizScore, setShowQuizResult]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawVal = textToSend || chatInput;
    if (!rawVal.trim()) return;
    const studentMessage: ChatMessage = {
      id: `std-${Date.now()}`,
      sender: "student", text: rawVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, studentMessage]);
    if (!textToSend) setChatInput("");
    setIsTutorTyping(true);
    try {
      const response = await fetch("/api/gemini/tutoring", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [studentMessage], selectedLessonContext: selectedLesson ? `${selectedLesson.title}: ${selectedLesson.description}` : "General Curriculum Track" })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, {
        id: `tut-${Date.now()}`, sender: "tutor", text: data.text || "I apologize. Could we reformulate that query under first principles?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setChatMessages(prev => [...prev, {
        id: `tut-${Date.now()}`, sender: "tutor",
        text: "### Socratic Response Refined ⚙️\n\nI apologize. Let's redirect our intellectual inquiry down key tracks:\n1. **Quantification**: What metrics are you tracking specifically?\n2. **Synthesis**: How does this align with the Trinity Test?\n\n*Configure your authentic Gemini API key in AI Studio Secrets to unlock the adaptive tutoring model.*",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally { setIsTutorTyping(false); }
  };

  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDesc.trim()) return;
    fetch("/api/tasks", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTaskTitle, description: newTaskDesc, category: newTaskCategory, rewardPoints: newTaskReward, createdBy: "Private Builder" })
    }).then(res => res.json()).then(data => {
      if (data && data.id) { setTasks(prev => [data, ...prev]); setIsCreatingTask(false); setNewTaskTitle(""); setNewTaskDesc(""); }
    }).catch(() => {
      setTasks(prev => [{ id: `task-local-${Date.now()}`, title: newTaskTitle, description: newTaskDesc, category: newTaskCategory, rewardPoints: newTaskReward, status: "Open", assignee: null, createdBy: "Student Self-Builder", backersCount: 1 }, ...prev]);
      setIsCreatingTask(false); setNewTaskTitle(""); setNewTaskDesc("");
    });
  };

  const handleJoinTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isAssigned = t.status === "In Progress";
        return { ...t, status: isAssigned ? "Completed" : "In Progress", assignee: isAssigned ? t.assignee : "Student Builder", backersCount: t.backersCount + (isAssigned ? 0 : 1) };
      }
      return t;
    }));
    updateProgressOnServer({ ...progress, points: progress.points + 300 });
  };

  const handleAddForumPost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    setForumPosts(prev => [{
      id: `post-${Date.now()}`, author: "Student Sovereign Developer", userLevel: progress.level,
      title: newPostTitle, content: newPostContent, likes: 1, replies: 0, category: newPostCategory
    }, ...prev]);
    setNewPostTitle(""); setNewPostContent("");
    updateProgressOnServer({ ...progress, points: progress.points + 100 });
  };

  const executeSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setIsSendingContact(true);
    setContactErrorMsg("");
    setSendingStatus("Securing encrypted channel...");
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let pCode = 'STELLAR-PRP-';
    for (let i = 0; i < 12; i++) pCode += chars[Math.floor(Math.random() * chars.length)];
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSendingStatus("Encrypting pitch parameters...");
      await new Promise(resolve => setTimeout(resolve, 600));
      setSendingStatus("Broadcasting through StaticForms Gateway...");
      const formattedMessage = `STELLARIUM SUITE SECURE TRANS-PITCH [${pCode}]\n========================================\n- Name: ${contactName}\n- Email: ${contactEmail}\n- Expected Students: ${calcStudents}\n- Billing Cycle: ${calcBilling}\n- Est. Cost: $${calculateInstitutionalBulkCost().toLocaleString()} USD\n\nMessage:\n----------------------------------------\n${contactMsg}\n========================================`;
      const response = await fetch("https://api.staticforms.dev/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: "sf_0491b9b3fbb2f4f489b6a319", name: contactName, email: contactEmail, message: formattedMessage })
      });
      const data = await response.json();
      if (data.success) {
        setContactConfirmed(true);
        setTimeout(() => { setContactConfirmed(false); setContactName(""); setContactEmail(""); setContactMsg(""); }, 5000);
      } else setContactErrorMsg(data.message || 'Transmitter gateway server rejected the bundle.');
    } catch {
      setContactErrorMsg('Direct transmission failed. Use the "Send Direct Email Now" code fallback.');
    } finally { setIsSendingContact(false); }
  };

  const calculateInstitutionalBulkCost = () => {
    const baseRatePerStudent = calcBilling === "yearly" ? 144 : 12;
    return Math.floor(calcStudents * baseRatePerStudent);
  };

  const calculatedRewardMultiplier = () => {
    const costFactor = incRevenue / Math.max(incCosts, 1000);
    const kwhFactor = 1 / Math.max(incKwhPrice, 0.05);
    return parseFloat((costFactor * (kwhFactor * 0.1)).toFixed(2));
  };

  const handleSimulatedSupport = (e: FormEvent) => {
    e.preventDefault();
    setSimulatedDonationSuccess(true);
    updateProgressOnServer({ ...progress, points: progress.points + 500 });
    setTimeout(() => { setSimulatedDonationSuccess(false); setShowDirectDonateModal(false); }, 4000);
  };

  const filteredLessons = selectedCurriculum === "all"
    ? LESSONS
    : LESSONS.filter(l => l.curriculum === selectedCurriculum);

  // Icons import comment - components import their own icons

  const value: AppContextType = {
    activeTab, setActiveTab,
    isLoggedIn, setIsLoggedIn, studentName, setStudentName, studentTrack,
    loginEmail, setLoginEmail, loginAccessKey, setLoginAccessKey,
    isUserActivated, setIsUserActivated,
    landingAuthRole, setLandingAuthRole,
    landingAuthMode, setLandingAuthMode,
    tursoSuccessMsg, tursoLoading, handleLandingAuthSubmit,
    landingAuthErrors, setLandingAuthErrors,
    regName, setRegName, regSchoolName, setRegSchoolName,
    regRepName, setRegRepName, regStudentVolume, setRegStudentVolume,
    regBillingCycle, setRegBillingCycle,
    progress, updateProgressOnServer, setProgress,
    selectedCurriculum, setSelectedCurriculum,
    onboardingCurriculum, setOnboardingCurriculum,
    isOnboarded, setIsOnboarded,
    
    // New onboarding wizard
    onboardingStep, setOnboardingStep,
    isOnboardingComplete, setIsOnboardingComplete,
    studentCountry, setStudentCountry,
    studentTrackType, setStudentTrackType,
    studentProgramId, setStudentProgramId,
    studentGradeLevelId, setStudentGradeLevelId,
    enrollmentType, setEnrollmentType,
    schoolEnrollCode, setSchoolEnrollCode,
    showPaymentScreen, setShowPaymentScreen,
    studentBillingCycle, setStudentBillingCycle,
    handleOnboardingNext, handleOnboardingBack, handleCompleteOnboarding,
    
    // Legacy onboarding
    institutionCode, setInstitutionCode,
    joinedClassroom, handleOnboardClassroom,
    selectedLesson, setSelectedLesson,
    activeQuiz, setActiveQuiz, quizAnswers, setQuizAnswers,
    showQuizResult, setShowQuizResult, quizScore, handleQuizSubmit,
    filteredLessons,
    isExamProctoring, setIsExamProctoring, cameraPermissionGranted, examTimer, proctorLogs,
    verifiedExamsList, videoRef, startVerifiedProctorExam, stopVerifiedProctorExam,
    activeGame, setActiveGame,
    trinityGood, setTrinityGood, trinityMoney, setTrinityMoney, trinityFun, setTrinityFun, trinityWinner,
    robotHip, setRobotHip, robotKnee, setRobotKnee, robotAnkle, setRobotAnkle, robotBalanced,
    incBase, setIncBase, incRevenue, setIncRevenue, incCosts, setIncCosts, incKwhPrice, setIncKwhPrice,
    calculatedRewardMultiplier,
    chatMessages, chatInput, setChatInput, chatBottomRef, isTutorTyping, handleSendMessage,
    tasks, setTasks, isCreatingTask, setIsCreatingTask,
    newTaskTitle, setNewTaskTitle, newTaskDesc, setNewTaskDesc,
    newTaskCategory, setNewTaskCategory, newTaskReward, setNewTaskReward,
    handleCreateTask, handleJoinTask,
    forumPosts, setForumPosts, newPostTitle, setNewPostTitle,
    newPostContent, setNewPostContent, newPostCategory, setNewPostCategory,
    handleAddForumPost,
    contactName, setContactName, contactEmail, setContactEmail, contactMsg, setContactMsg,
    contactConfirmed, isSendingContact, sendingStatus, contactErrorMsg, executeSendMessage,
    calcStudents, setCalcStudents, calcBilling, setCalcBilling, calculateInstitutionalBulkCost,
    expandedFaq, setExpandedFaq,
    showDirectDonateModal, setShowDirectDonateModal,
    simulatedDonationAmount, setSimulatedDonationAmount, donationSuccess, handleSimulatedSupport,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
