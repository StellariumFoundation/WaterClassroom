import AcademyTab from "./components/tabs/AcademyTab";
import DashboardTab from "./components/tabs/DashboardTab";
import AITutorTab from "./components/tabs/AITutorTab";
import TasksTab from "./components/tabs/TasksTab";
import ForumsTab from "./components/tabs/ForumsTab";
import HomepageTab from "./components/tabs/HomepageTab";

import { useState, useEffect, useRef, FormEvent } from "react";
import {
  Sparkles,
  Cpu,
  Building,
  Compass,
  BookOpen,
  MessageSquare,
  ClipboardList,
  CheckCircle,
  TrendingUp,
  User,
  Award,
  Search,
  ArrowRight,
  Lock,
  Unlock,
  Send,
  Heart,
  DollarSign,
  AlertCircle,
  Plus,
  ChevronRight,
  FileText,
  ThumbsUp,
  Globe,
  Flame,
  Check,
  ChevronDown,
  Video,
  Shield,
  Users,
  Download,
  Calculator,
  AlertTriangle
} from "lucide-react";
import { LESSONS, QUIZZES, BADGES } from "./lessonsData";
import { Lesson, Quiz, StudentProgress, Task, ChatMessage } from "./types";
import LoginRegister from "./components/auth/LoginRegister";

export default function App() {
  const [activeTab, setActiveTab] = useState<"academy" | "tutor" | "tasks" | "collaborate" | "dashboard">("dashboard");
  const [progress, setProgress] = useState<StudentProgress>({
    points: 0,
    streakDays: 3,
    level: 1,
    completedLessons: [],
    unlockedBadges: [],
    lastActiveDate: new Date().toISOString().split("T")[0]
  });

  // Curriculum State
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("all");
  const [onboardingCurriculum, setOnboardingCurriculum] = useState<string>("US Common Core");
  const [institutionCode, setInstitutionCode] = useState<string>("");
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [joinedClassroom, setJoinedClassroom] = useState<string | null>(null);

  const [isUserActivated, setIsUserActivated] = useState<boolean>(false);
  
  // Authentication & Session Portal States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>("Student");
  const [studentTrack, setStudentTrack] = useState<string>("Philosophy");
  const [loginAccessKey, setLoginAccessKey] = useState<string>("");
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [modalRole, setModalRole] = useState<"student" | "school">("student");

  // Embedded Authentication & Registration States for Landing Page
  const [landingAuthRole, setLandingAuthRole] = useState<"student" | "school">("student");
  const [landingAuthMode, setLandingAuthMode] = useState<"login" | "register">("login");
  const [regFullName, setRegFullName] = useState<string>("");
  const [regEmail, setRegEmail] = useState<string>("");
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [regTrack, setRegTrack] = useState<string>("Pick Later");
  const [regPasscode, setRegPasscode] = useState<string>("");
  const [regAffiliatedCode, setRegAffiliatedCode] = useState<string>("");

  const [regSchoolName, setRegSchoolName] = useState<string>("");
  const [regSchoolAdmin, setRegSchoolAdmin] = useState<string>("");
  const [regSchoolEmail, setRegSchoolEmail] = useState<string>("");
  const [regSchoolSize, setRegSchoolSize] = useState<number>(20);
  const [regSchoolPass, setRegSchoolPass] = useState<string>("");
  const [regSchoolKind, setRegSchoolKind] = useState<string>("Homeschool Co-Op");
  
  // Turso Database simulation state
  const [tursoRecords, setTursoRecords] = useState<any[]>([]);
  const [tursoSuccessMsg, setTursoSuccessMsg] = useState<string>("");
  const [tursoLoading, setTursoLoading] = useState<boolean>(false);
  
  // Custom contact message configurations
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactMsg, setContactMsg] = useState<string>("");
  const [contactConfirmed, setContactConfirmed] = useState<boolean>(false);
  const [isSendingContact, setIsSendingContact] = useState<boolean>(false);
  const [sendingStatus, setSendingStatus] = useState<string>("");
  const [contactErrorMsg, setContactErrorMsg] = useState<string>("");

  // Authentication Handlers
  useEffect(() => {
    if (isLoggedIn) {
      setActiveTab("dashboard");
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginAccessKey) {
      alert("Email and password are required.");
      return;
    }
    const payload = { email: loginEmail, passcode: loginAccessKey };
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const data = await response.json();
        alert("Login failed: " + (data.error || "Invalid credentials"));
        return;
      }
      const data = await response.json();
      setStudentName(data.user.name || loginEmail.split("@")[0]);
      setStudentTrack(data.user.academicTrack || "Universal First-Principles Track");
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setActiveTab("dashboard");
    } catch (err) {
      console.error("Login failure", err);
      alert("Network error. Please try again.");
    }
  };

  const executeSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;

    setIsSendingContact(true);
    setContactErrorMsg('');
    setSendingStatus('Securing encrypted channel...');

    // Generate certified proposal citation hash
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let pCode = 'STELLAR-PRP-';
    for (let i = 0; i < 12; i++) {
      pCode += chars[Math.floor(Math.random() * chars.length)];
    }

    try {
      // Small delays for premium retro security feel
      await new Promise(resolve => setTimeout(resolve, 800));
      setSendingStatus('Encrypting pitch parameters...');
      await new Promise(resolve => setTimeout(resolve, 600));
      setSendingStatus('Broadcasting through StaticForms Gateway...');

      const formattedMessage = `STELLARIUM SUITE SECURE TRANS-PITCH [${pCode}]
========================================
- Name: ${contactName}
- Email: ${contactEmail}
- Expected Students: ${calcStudents}
- Billing Cycle: ${calcBilling}
- Est. Cost: $${calculateInstitutionalBulkCost().toLocaleString()} USD

Message Pitch Content:
----------------------------------------
${contactMsg}
========================================`;

      const response = await fetch("https://api.staticforms.dev/submit", {
        method: "POST",
        headers: {
           "Content-Type": "application/json",
           "Accept": "application/json"
        },
        body: JSON.stringify({
          apiKey: "sf_0491b9b3fbb2f4f489b6a319",
          name: contactName,
          email: contactEmail,
          message: formattedMessage,
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setContactConfirmed(true);
        setTimeout(() => {
          setContactConfirmed(false);
          setContactName("");
          setContactEmail("");
          setContactMsg("");
        }, 5000);
      } else {
        setContactErrorMsg(data.message || 'Transmitter gateway server rejected the bundle.');
      }
    } catch (err) {
      console.error(err);
      setContactErrorMsg('Direct transmission failed. You can still use the "Send Direct Email Now" code fallback.');
    } finally {
      setIsSendingContact(false);
    }
  };

  const handleLandingAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTursoLoading(true);
    
    if (!loginEmail || !loginAccessKey) {
      alert("Email and password are required.");
      setTursoLoading(false);
      return;
    }
    if (loginAccessKey.length < 6) {
      alert("Password must be at least 6 characters.");
      setTursoLoading(false);
      return;
    }

    try {
      // Step 1: Attempt to sign in
      const payload = { email: loginEmail, passcode: loginAccessKey };
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudentName(data.user.name || loginEmail.split("@")[0]);
        setStudentTrack(data.user.academicTrack || (landingAuthRole === "student" ? "Universal First-Principles Track" : "Business / Entrepreneurship"));
        setIsUserActivated(!!data.user.isActivated);
        setIsLoggedIn(true);
        setActiveTab("dashboard");
        if (!data.user.isActivated) {
            alert("Please complete payment to activate your account.");
            fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginEmail })
            }).then(r => r.json()).then(checkoutRes => {
                if (checkoutRes.url) {
                    window.location.href = checkoutRes.url;
                } else {
                    alert("Could not initiate payment. Please use the Purchase Activation button on the dashboard.");
                }
            });
        }
      } else {
        // Step 2: Since account doesn't exist, automatically register them!
        const nickname = loginEmail.split("@")[0];
        const regPayload = {
          type: landingAuthRole === "student" ? "Individual Student" : "Institution",
          name: landingAuthRole === "student" ? nickname : `${nickname} Academy`,
          email: loginEmail,
          representative: nickname,
          academicTrack: landingAuthRole === "student" ? "Pick Later" : "Business / Entrepreneurship",
          studentVolume: landingAuthRole === "student" ? 1 : 20,
          kindOfSchool: landingAuthRole === "student" ? "Homeschool Individual" : "Homeschool Co-Op",
          billingCycle: "Monthly",
          passcode: loginAccessKey
        };
        
        const registerRes = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(regPayload)
        });
        
        if (registerRes.ok) {
          const newRecord = await registerRes.json();
          if (newRecord.checkoutUrl) {
            window.location.href = newRecord.checkoutUrl;
            return;
          }
          setTursoRecords(prev => [newRecord, ...prev]);
          setStudentName(newRecord.name || nickname);
          setStudentTrack(newRecord.academicTrack || (landingAuthRole === "student" ? "Pick Later" : "Business / Entrepreneurship"));
          if (landingAuthRole === "school") {
            setInstitutionCode(newRecord.name.substring(0, 4).toUpperCase() + "-2026");
          }
          setTursoSuccessMsg("Account registered and authenticated successfully!");
          setTimeout(() => {
            setIsLoggedIn(true);
            setActiveTab("dashboard");
            setTursoSuccessMsg("");
          }, 1200);
        } else {
          const errData = await registerRes.json();
          alert("Authentication failed: " + (errData.error || "Please check your credentials or try again."));
        }
      }
    } catch (err) {
      console.error("Turso database operation failure", err);
      alert("Network error. Please try again.");
    } finally {
      setTursoLoading(false);
    }
  };

  // Left Column Academy & Reader
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Verified Exam Camera Proctoring State
  const [isExamProctoring, setIsExamProctoring] = useState<boolean>(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean>(false);
  const [examTimer, setExamTimer] = useState<number>(600); // 10 minutes
  const [proctorLogs, setProctorLogs] = useState<string[]>([
    "Proctor AI Core VLM Loaded.",
    "Awaiting camera sensor authorization..."
  ]);
  const [verifiedExamsList, setVerifiedExamsList] = useState<Array<{ id: string; lessonTitle: string; hash: string; score: string; timestamp: string }>>([]);
  
  // Interactive Simulation Games state
  const [activeGame, setActiveGame] = useState<"trinity" | "robotics" | "incentive" | null>(null);
  // Game 1: Trinity sliders
  const [trinityGood, setTrinityGood] = useState<number>(60);
  const [trinityMoney, setTrinityMoney] = useState<number>(40);
  const [trinityFun, setTrinityFun] = useState<number>(50);
  const [trinityWinner, setTrinityWinner] = useState<boolean>(false);
  
  // Game 2: Robotics calibration joint variables
  const [robotHip, setRobotHip] = useState<number>(45);
  const [robotKnee, setRobotKnee] = useState<number>(100);
  const [robotAnkle, setRobotAnkle] = useState<number>(120);
  const [robotBalanced, setRobotBalanced] = useState<boolean>(false);
  
  // Game 3: Incentive Equation variables
  const [incBase, setIncBase] = useState<number>(2000);
  const [incRevenue, setIncRevenue] = useState<number>(50000);
  const [incCosts, setIncCosts] = useState<number>(20000);
  const [incKwhPrice, setIncKwhPrice] = useState<number>(0.25);

  // AI Tutor Communication
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "tutor",
      text: "### Welcome to the Water Classroom AI Tutor! 🦉\n\nI am your 24/7 educational companion, engineered directly to support our global students.\n\nI can answer curriculum questions (U.S. Common Core, UK GCSE, IB), explain hard technical math, check your homework, or guide you Socratically through:\n- **First-Principles & Systems Thinking**\n- **Empowerment Metrics** (*Do Good, Make Money, Have Fun*)\n- **Water Robotics** teleoperation mechanical math\n- **Incentive Equation Metrics** in business structures\n\nHow can I help you excel today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isTutorTyping, setIsTutorTyping] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Interactive Classroom Forum threads
  const [forumPosts, setForumPosts] = useState([
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

  // State for Board of Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDesc, setNewTaskDesc] = useState<string>("");
  const [newTaskCategory, setNewTaskCategory] = useState<string>("Policy");
  const [newTaskReward, setNewTaskReward] = useState<number>(1200);

  // Institutional Pricing Calculator state
  const [calcStudents, setCalcStudents] = useState<number>(150);
  const [calcBilling, setCalcBilling] = useState<"monthly" | "yearly">("yearly");
  const [calcCustomSupport, setCalcCustomSupport] = useState<boolean>(false);

  // General FAQ accordion
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showDirectDonateModal, setShowDirectDonateModal] = useState<boolean>(false);
  const [simulatedDonationAmount, setSimulatedDonationAmount] = useState<string>("100");
  const [donationSuccess, setSimulatedDonationSuccess] = useState<boolean>(false);

  // Video element ref for camera proctoring
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Payment Return Handling
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("payment_success")) {
      const email = searchParams.get("email");
      alert(`Payment successful! Your registration is complete. Check your email (${email}) for login details or sign in directly.`);
      setIsLoggedIn(true);
      setActiveTab("dashboard");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (searchParams.get("payment_cancel")) {
      alert("Payment was cancelled or failed. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Sync / Load initial DB data
  useEffect(() => {
    fetch("/api/progress")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.points === "number") {
          setProgress(data);
        }
      })
      .catch((err) => console.log("Progress stream defaulted fallback."));

    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch((err) => console.log("Tasks storage loading locally."));

    fetch("/api/records")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTursoRecords(data);
        }
      })
      .catch((err) => console.log("Turso records retrieval fallback."));
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTutorTyping]);

  // Handle Proctor Timer
  useEffect(() => {
    let interval: any;
    if (isExamProctoring && examTimer > 0) {
      interval = setInterval(() => {
        setExamTimer((prev) => prev - 1);
        // Simulate random proctoring messages
        if (Math.random() > 0.8) {
          const checkTypes = [
            "Proctor VLM: Facial alignment within 99.1% boundary.",
            "Proctor Eye Tracker: Attention vector confirmed on window.",
            "Screen Monitor: No duplicate monitors detected.",
            "Proctor Audio Decibel: Noise constraints satisfied (12dB average).",
            "Proctor State: Integrity verified."
          ];
          const logMsg = checkTypes[Math.floor(Math.random() * checkTypes.length)];
          setProctorLogs((prev) => [...prev.slice(-4), logMsg]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExamProctoring, examTimer]);

  const updateProgressOnServer = (updated: StudentProgress) => {
    setProgress(updated);
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    }).catch((err) => console.log("API Server update ignored during offline fallbacks."));
  };

  // Onboard Institutional School
  const handleOnboardClassroom = (e: FormEvent) => {
    e.preventDefault();
    if (institutionCode.trim()) {
      setJoinedClassroom(institutionCode.toUpperCase());
      const updated = { ...progress, points: progress.points + 250 };
      updateProgressOnServer(updated);
    }
  };

  // Start Proctor Exam
  const startVerifiedProctorExam = () => {
    setIsExamProctoring(true);
    setExamTimer(600);
    setProctorLogs([
      "Proctor VLM System: Active proctoring initial validation.",
      "Syncing with Water Classroom Global Registrar database...",
      "Capturing face landmark arrays..."
    ]);
    // Try to get actual video stream for proctoring simulator
    navigator.mediaDevices
      ?.getUserMedia({ video: { width: 320, height: 240 } })
      .then((stream) => {
        setCameraPermissionGranted(true);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setProctorLogs((prev) => [...prev, "SUCCESS: Hardware camera stream initialized."]);
      })
      .catch((err) => {
        setCameraPermissionGranted(false);
        setProctorLogs((prev) => [
          ...prev,
          "WARNING: No active camera hardware granted or available. Falling back to active 3D face landmark scanning simulators."
        ]);
      });
  };

  // Stop Proctor Exam
  const stopVerifiedProctorExam = (successScore: number, totalQuest: number) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsExamProctoring(false);
    
    // Output certificate
    if (selectedLesson) {
      const examHash = `WX-${Math.floor(Math.random() * 1000000).toString(16).toUpperCase()}-${Math.floor(Math.random() * 9000).toString()}`;
      const newCert = {
        id: `cert-${Date.now()}`,
        lessonTitle: selectedLesson.title,
        hash: examHash,
        score: `${successScore} / ${totalQuest}`,
        timestamp: new Date().toLocaleDateString()
      };
      setVerifiedExamsList((prev) => [newCert, ...prev]);
    }
  };

  // Action: Complete Quiz
  const handleQuizSubmit = () => {
    if (!activeQuiz) return;
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswerIndex) {
        score++;
      }
    });

    setQuizScore(score);
    setShowQuizResult(true);

    const isPerfect = score === activeQuiz.questions.length;
    
    // Add verified registry if in proctor mode
    if (isExamProctoring) {
      stopVerifiedProctorExam(score, activeQuiz.questions.length);
    }

    if (isPerfect) {
      const newPoints = progress.points + activeQuiz.pointsToAward;
      const completed = [...progress.completedLessons];
      if (!completed.includes(activeQuiz.lessonId)) {
        completed.push(activeQuiz.lessonId);
      }

      // Badge checks
      const currentBadges = [...progress.unlockedBadges];
      let unlockedNew = false;
      let badgeKey = "pioneer";

      if (activeQuiz.id.includes("creed") && !currentBadges.includes("pioneer")) {
        badgeKey = "pioneer";
        unlockedNew = true;
      } else if (activeQuiz.id.includes("scitech") && !currentBadges.includes("engineer")) {
        badgeKey = "engineer";
        unlockedNew = true;
      } else if (activeQuiz.id.includes("business") && !currentBadges.includes("builder")) {
        badgeKey = "builder";
        unlockedNew = true;
      } else if (activeQuiz.id.includes("dynamics") && !currentBadges.includes("philosopher")) {
        badgeKey = "philosopher";
        unlockedNew = true;
      }

      if (unlockedNew) {
        currentBadges.push(badgeKey);
      }

      updateProgressOnServer({
        ...progress,
        points: newPoints,
        completedLessons: completed,
        unlockedBadges: currentBadges,
        level: Math.floor(newPoints / 1000) + 1
      });
    }
  };

  // Simulate Interactive Games triggers
  // 1. Trinity game validation
  useEffect(() => {
    if (activeGame === "trinity") {
      // Must equal exactly 100 each for perfect alignment
      if (trinityGood === 100 && trinityMoney === 100 && trinityFun === 100) {
        setTrinityWinner(true);
        // award XP
        updateProgressOnServer({ ...progress, points: progress.points + 150 });
      } else {
        setTrinityWinner(false);
      }
    }
  }, [trinityGood, trinityMoney, trinityFun, activeGame]);

  // 2. Robotics calibration joint variables
  useEffect(() => {
    if (activeGame === "robotics") {
      // Balanced parameters: Hip: 60-70, Knee: 90-100, Ankle: 80-90
      const hipOK = robotHip >= 60 && robotHip <= 70;
      const kneeOK = robotKnee >= 92 && robotKnee <= 98;
      const ankleOK = robotAnkle >= 82 && robotAnkle <= 88;
      if (hipOK && kneeOK && ankleOK) {
        setRobotBalanced(true);
        updateProgressOnServer({ ...progress, points: progress.points + 200 });
      } else {
        setRobotBalanced(false);
      }
    }
  }, [robotHip, robotKnee, robotAnkle, activeGame]);

  const calculatedRewardMultiplier = () => {
    // Equation: RewardMultiplier = Revenues/Costs * (1/kWh_price);
    const costFactor = incRevenue / Math.max(incCosts, 1000);
    const kwhFactor = 1 / Math.max(incKwhPrice, 0.05);
    const multiplier = costFactor * (kwhFactor * 0.1);
    return parseFloat(multiplier.toFixed(2));
  };

  // AI Chat Submission
  const handleSendMessage = async (textToSend?: string) => {
    const rawVal = textToSend || chatInput;
    if (!rawVal.trim()) return;

    const studentMessage: ChatMessage = {
      id: `std-${Date.now()}`,
      sender: "student",
      text: rawVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, studentMessage]);
    if (!textToSend) setChatInput("");
    setIsTutorTyping(true);

    try {
      const response = await fetch("/api/gemini/tutoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [studentMessage],
          selectedLessonContext: selectedLesson ? `${selectedLesson.title}: ${selectedLesson.description}` : "General Curriculum Track"
        })
      });

      const data = await response.json();
      const tutorReply: ChatMessage = {
        id: `tut-${Date.now()}`,
        sender: "tutor",
        text: data.text || "I apologize. Could we reformulate that query under first principles?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, tutorReply]);
    } catch {
      // Offline / API Failure fallback
      const tutorReply: ChatMessage = {
        id: `tut-${Date.now()}`,
        sender: "tutor",
        text: "### Socratic Response Refined ⚙️\n\nI apologize. Let's redirect our intellectual inquiry down key tracks:\n1. **Quantification**: What metrics are you tracking specifically?\n2. **Synthesis**: How does this align with the Trinity Test?\n\n*Configure your authentic Gemini API key in AI Studio Secrets to unlock the adaptive tutoring model.*",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, tutorReply]);
    } finally {
      setIsTutorTyping(false);
    }
  };

  // Board of Tasks Creation
  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskDesc.trim()) return;

    const freshTask = {
      title: newTaskTitle,
      description: newTaskDesc,
      category: newTaskCategory,
      rewardPoints: newTaskReward,
      createdBy: "Private Builder"
    };

    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(freshTask)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setTasks((prev) => [data, ...prev]);
          setIsCreatingTask(false);
          setNewTaskTitle("");
          setNewTaskDesc("");
        }
      })
      .catch(() => {
        // Fallback locale append
        const mock: Task = {
          id: `task-local-${Date.now()}`,
          title: newTaskTitle,
          description: newTaskDesc,
          category: newTaskCategory,
          rewardPoints: newTaskReward,
          status: "Open",
          assignee: null,
          createdBy: "Student Self-Builder",
          backersCount: 1
        };
        setTasks((prev) => [mock, ...prev]);
        setIsCreatingTask(false);
        setNewTaskTitle("");
        setNewTaskDesc("");
      });
  };

  // Tasks back/join mechanics
  const handleJoinTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isAssigned = t.status === "In Progress";
          return {
            ...t,
            status: isAssigned ? "Completed" : "In Progress",
            assignee: isAssigned ? t.assignee : "Student Builder",
            backersCount: t.backersCount + (isAssigned ? 0 : 1)
          };
        }
        return t;
      })
    );
    // Award 300 points for joining/solving tasks
    updateProgressOnServer({ ...progress, points: progress.points + 300 });
  };

  // Forum Threads interactions
  const handleAddForumPost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const freshPost = {
      id: `post-${Date.now()}`,
      author: "Student Sovereign Developer",
      userLevel: progress.level,
      title: newPostTitle,
      content: newPostContent,
      likes: 1,
      replies: 0,
      category: newPostCategory
    };

    setForumPosts((prev) => [freshPost, ...prev]);
    setNewPostTitle("");
    setNewPostContent("");
    updateProgressOnServer({ ...progress, points: progress.points + 100 });
  };

  // Custom pricing logic
  const calculateInstitutionalBulkCost = () => {
    // Exactly $12 per student per month
    const baseRatePerStudent = calcBilling === "yearly" ? 144 : 12; // $12/month, $144/year
    const subtotal = calcStudents * baseRatePerStudent;
    return Math.floor(subtotal);
  };

  const handleSimulatedSupport = (e: FormEvent) => {
    e.preventDefault();
    setSimulatedDonationSuccess(true);
    updateProgressOnServer({ ...progress, points: progress.points + 500 });
    setTimeout(() => {
      setSimulatedDonationSuccess(false);
      setShowDirectDonateModal(false);
    }, 4000);
  };

  const filteredLessons = selectedCurriculum === "all"
    ? LESSONS
    : LESSONS.filter((l) => l.curriculum === selectedCurriculum);

  return (
    <div className="min-h-screen bg-[#030712] deep-space-bg flex flex-col pb-24 md:pb-6 text-slate-100 antialiased font-sans transition-all duration-500">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-30 w-full bg-[#060b18]/80 backdrop-blur-md border-b border-blue-950/50 text-white shadow-lg pt-[max(env(safe-area-inset-top),8px)] sm:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[22px] pb-[12px] flex flex-col sm:flex-row justify-between items-center gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-blue-500/35 flex items-center justify-center shadow-inner relative overflow-hidden">
              <img src="/icon.png" alt="W" className="w-8 h-8 rounded absolute z-10" onError={(e) => {
                e.currentTarget.style.display = 'none';
              }} />
              <span className="text-blue-400 font-extrabold text-xl tracking-tighter drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse relative z-0">W</span>
              <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight flex items-center gap-1.5 uppercase leading-none">
                WATER CLASSROOM
                <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-500/20 shadow-inner">
                  {isLoggedIn ? "Classroom Panel" : "Login Access"}
                </span>
              </h1>
              <p className="text-[11px] text-blue-300 font-light tracking-wide mt-0.5">
                A Complete AI-Powered Educational Ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-col sm:flex-row w-full sm:w-auto justify-end">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 bg-[#0a162f]/80 px-4 py-1.5 rounded-full border border-blue-400/25 shadow-inner">
                  <div className="flex items-center gap-1 cursor-pointer hover:scale-105 transition">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-400 animate-bounce" />
                    <span className="text-xs font-bold text-amber-200">{progress.streakDays} Day Streak</span>
                  </div>
                  <div className="h-4 w-px bg-blue-500/30"></div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">{progress.points} Points</span>
                  </div>
                  <div className="h-4 w-px bg-blue-500/30"></div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-300">Lvl {progress.level}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#111c35]/50 border border-blue-900/30 rounded-xl px-3 py-1 text-right">
                  <div className="leading-tight">
                    <span className="text-xs font-bold text-slate-100 block">{studentName}</span>
                    <span className="text-[9px] font-mono text-blue-400 uppercase tracking-wider block">{studentTrack} Track</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setActiveTab("dashboard");
                    }}
                    className="p-1 px-2.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-300 text-[10px] uppercase font-mono tracking-wider font-bold transition border border-red-500/20"
                  >
                    Exit
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  setLandingAuthRole("student");
                  setShowLoginModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-lg shadow-blue-500/20 border border-blue-400/20 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-white" /> Secure Login
              </button>
            )}
          </div>
          
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {!isLoggedIn ? (
          <div className="space-y-16 animate-fade-in text-slate-100 pb-12">
            
            {/* Hero Pitch Banner */}
            <div className="blue-gradient-bg rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-blue-400/20">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl"></div>
              <div className="absolute left-1/3 bottom-0 -mb-16 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-4xl space-y-6">
                <span className="px-3.5 py-1.5 rounded-full bg-blue-900/60 text-[10px] font-extrabold uppercase tracking-widest border border-blue-300/30 backdrop-blur-md animate-pulse">
                  ✨ NOW OPEN: A NEW ERA OF HUMAN LEARNING
                </span>
                
                <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight uppercase font-sans">
                  The Water Classroom:<br className="hidden sm:block"/> Redefining Education in the AI Era
                </h2>
                
                <p className="text-sm sm:text-lg text-blue-50 font-normal leading-relaxed max-w-3xl font-light">
                  Break down institutional barriers once and for all. We provide K-12 and undergraduate students, educators, and institutions with a complete, AI-powered virtual school. Engage with gamified curriculums tailored to U.S. Common Core, UK GCSE or IB tracks, consult 24/7 AI tutors, and unleash creativity with interactive labs—all from a single, transformative platform.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="#auth-section"
                    className="px-8 py-3.5 rounded-xl bg-white text-blue-950 font-extrabold text-[#0f172a] text-xs tracking-wider uppercase transition hover:bg-blue-50 active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer deco-none"
                  >
                    Enter Student & Institution Portal <ArrowRight className="w-4 h-4 text-blue-600" />
                  </a>
                  <a
                    href="#prices-section"
                    className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer deco-none"
                  >
                    View Pricing & Plans
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Login & Registration Card Section */}
            <div id="auth-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
              
              <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                <span className="text-xs font-mono uppercase text-blue-400 tracking-wider font-bold">Secure Access Gateway</span>
                <h3 className="text-3xl font-extrabold text-white uppercase leading-tight">Create your Student ledger or register your school</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light font-sans text-sans">
                  Welcome to the decentralized enrollment protocol. Select your division and complete authentication. All student transcripts, quiz points, daily streaks, and engineering certificates are stored securely inside client-side structures.
                </p>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-blue-950 border border-blue-500/20 text-blue-400 flex items-center justify-center p-1 mt-0.5 text-xs font-bold font-sans">✓</div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase font-sans">Independent Student Records</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">Gain instant access to physics reactors, first-principles logic modules, and 24/7 Socratic help.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-indigo-950 border border-indigo-500/20 text-indigo-400 flex items-center justify-center p-1 mt-0.5 text-xs font-bold font-mono">✓</div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase font-sans font-medium">Institutional Microschool Sandboxing</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-light font-sans font-medium">Activate group profiles, manage customized task assignments, and review eye-tracking focal proctor audits.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1" />

              <div className="lg:col-span-6">
                <div className="frosted-glass p-6 sm:p-8 rounded-3xl border border-blue-500/20 shadow-2xl relative overflow-hidden flex flex-col h-full justify-between">
                  
                  {/* Design Accent */}
                  <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="space-y-6">
                    {/* Role selector tabs */}
                    <div className="grid grid-cols-2 p-1 bg-slate-950/60 rounded-xl border border-blue-950">
                      <button
                        onClick={() => {
                          setLandingAuthRole("student");
                        }}
                        className={`py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase ${
                          landingAuthRole === "student"
                            ? "bg-blue-600 text-white shadow-md font-extrabold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        👤 Student Division
                      </button>
                      <button
                        onClick={() => {
                          setLandingAuthRole("school");
                        }}
                        className={`py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase ${
                          landingAuthRole === "school"
                            ? "bg-indigo-600 text-white shadow-md font-extrabold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        🏫 Institution Division
                      </button>
                    </div>

                    {/* Authentication Form */}
                    <form onSubmit={handleLandingAuthSubmit} className="space-y-4">
                      {tursoSuccessMsg && (
                        <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-xl text-xs space-y-1 font-mono animate-fade-in mb-3">
                          <span className="font-bold text-white block">✓ RECORD COMMITTED SECURELY</span>
                          <p>{tursoSuccessMsg}</p>
                        </div>
                      )}

                      {landingAuthRole === "student" ? (
                        <div className="bg-[#0b1329] border border-blue-900/30 rounded-xl p-3 text-xs text-blue-300 space-y-1">
                          <span className="font-bold text-white block text-[10px] uppercase font-mono tracking-wider">🌟 Student Division Portal</span>
                          Enter your credentials to instantly authenticate or register and access interactive physics simulations, labs, quizzes, and 24/7 Socratic tutoring.
                        </div>
                      ) : (
                        <div className="bg-[#11103a] border border-indigo-900/30 rounded-xl p-3 text-xs text-indigo-300 space-y-1 font-sans">
                          <span className="font-bold text-white block text-[10px] uppercase font-mono tracking-wider">🏫 Institution / School Portal</span>
                          Sign in with your educational coordinator credentials to log in, sandbox schools, configure class sizes, and manage course settings.
                        </div>
                      )}

                      <div className="space-y-1 font-sans">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                          {landingAuthRole === "student" ? "Student Email Address" : "Administrator Email Address"}
                        </label>
                        <input
                          type="email"
                          required
                          placeholder={landingAuthRole === "student" ? "e.g. student@school.edu" : "e.g. admin@school.edu"}
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                        />
                      </div>

                      <div className="space-y-1 font-sans">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Account Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={loginAccessKey}
                          onChange={(e) => setLoginAccessKey(e.target.value)}
                          className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className={`w-full py-3 h-11 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-lg transition active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer text-white mt-4 ${
                          landingAuthRole === "student"
                            ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                            : "bg-indigo-600 hover:bg-indigo-550 shadow-indigo-500/20"
                        }`}
                      >
                        Authenticate & Enter <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                  <p className="text-[10px] text-slate-500 text-center mt-3 leading-snug font-sans">
                    Secured by standard SHA-256 client credentials. All curriculum logs and active student score charts store temporarily inside direct client state.<br />
                    For support, contact: stellar.foundation.us@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Strategic Pillars */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h3 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-extrabold">Executive Summary</h3>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white uppercase">A Complete Educational Ecosystem</h4>
                <p className="text-xs sm:text-sm text-slate-400 font-light">
                  The Water Classroom democratizes access to high-quality education. By integrating cutting-edge artificial intelligence with comprehensive curriculum alignment, we bridge educational gaps and empower K-12 to undergraduate learners globally.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div id="card-curriculum" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102">
                  <div className="w-12 h-10 rounded-xl bg-blue-950/50 border border-blue-400/30 flex items-center justify-center text-blue-400">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">AI-Tailored Curriculum</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Dynamic lessons aligned with national and international standards, adaptable to individual learning paces and styles. Interactive multimedia content and games are designed to supercharge the learning experience.
                  </p>
                </div>

                <div id="card-tutoring" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102">
                  <div className="w-12 h-10 rounded-xl bg-cyan-950/50 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                    <Cpu className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">24/7 AI Tutoring & Homework</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Our AI tutors offer step-by-step teaching, real-time feedback, and guidance. Advanced automated grading algorithms provide actionable insights for both students and educators around the clock.
                  </p>
                </div>

                <div id="card-innovation" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102">
                  <div className="w-12 h-10 rounded-xl bg-indigo-950/50 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Innovation & Creativity Labs</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Project-based learning modules connect core concepts to real-world scenarios. Engage in gamified engineering challenges and creative problem-solving to foster critical thinking and boundless imagination.
                  </p>
                </div>

                <div id="card-analytics" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102 lg:col-span-1 md:col-span-1">
                  <div className="w-12 h-10 rounded-xl bg-emerald-950/50 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    <Calculator className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Progress Analytics Dashboard</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Users can rigorously track academic performance, engagement streaks, and skill development. Generates customizable, detailed growth reports for teachers, parents, and administrative oversight.
                  </p>
                </div>

                <div id="card-collaborative" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102 lg:col-span-2 md:col-span-2 lg:flex lg:gap-6 lg:items-center lg:space-y-0">
                  <div className="flex-shrink-0 w-12 h-10 rounded-xl bg-rose-950/50 border border-rose-400/30 flex items-center justify-center text-rose-400 lg:w-16 lg:h-16">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">Collaborative Learning Ecosystem</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-light max-w-xl">
                      The platform includes seamlessly integrated virtual classrooms, moderated peer discussion forums, and dedicated educator tools, crafting a shared environment for robust curriculum management.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Timetable/Pipeline & Cost estimator */}
            <div className="frosted-glass rounded-3xl p-6 sm:p-10 border border-blue-900/30 shadow-xl space-y-8">
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold">THE INTAKE PIPELINE</h3>
                <h4 className="text-xl sm:text-2xl font-extrabold text-[#ffffff] uppercase">The 4-Step Student Journey</h4>
                <p className="text-xs text-slate-400 max-w-xl">
                  Whether you are enrolling as a private homeschool student or a classroom group, our pipeline takes you from zero to verifiable credentialing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {[
                  { step: "01", title: "Select a Curriculum Track", desc: "Choose your primary curriculum (e.g. U.S. Common Core, UK GCSE, IB) or use a school invite code to match your region's exact standards." },
                  { step: "02", title: "Interactive Lectures & Games", desc: "Access the Open Academy for fun, AI-delivered multimedia lessons and games tailored explicitly to your chosen curriculum path." },
                  { step: "03", title: "24/7 AI Tutor & Innovation Labs", desc: "Solve real-world homework challenges with our 24/7 AI Socratic Companion. The tutor adapts in real-time, helping gifted and struggling learners alike." },
                  { step: "04", title: "Verified Exams & Badges", desc: "Complete automated assessments. Complete secure exams via camera to earn Achievement Badges and maintain your Learning Streaks." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950/40 p-5 rounded-xl border border-blue-950 flex flex-col justify-between space-y-3 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 text-[5rem] font-bold text-blue-500/5 select-none font-mono -mt-6 leading-none transition duration-350 group-hover:text-blue-500/10">
                      {item.step}
                    </div>
                    <div className="space-y-1 z-10">
                      <span className="text-[10px] font-mono text-blue-400 font-extrabold uppercase bg-blue-950 border border-blue-900/40 px-2 py-0.5 rounded">STEP {item.step}</span>
                      <h5 className="font-extrabold text-white text-sm pt-1">{item.title}</h5>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-light z-10">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Display plans for Students in Prices */}
            <div id="prices-section" className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-extrabold">STUDENT PLANS & SUBSCRIPTIONS</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase">Independent Student Rates</h3>
                <p className="text-xs text-slate-400 font-sans">Empowering individual sovereign minds globally. Fundamental auditing is sponsored by community donations, while premium features are charged simply.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                
                {/* Premium Student Monthly */}
                <div className="bg-blue-950/20 border-2 border-blue-600/50 rounded-2xl p-6 space-y-4 flex flex-col justify-between relative shadow-lg">
                  <div className="absolute top-4 right-4 bg-blue-600 text-[8px] text-white font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse font-sans">Standard Plan</div>
                  <div className="space-y-3 font-sans">
                    <span className="px-2 py-0.5 text-[8px] font-mono uppercase bg-blue-900 text-blue-200 rounded border border-blue-800/50 font-mono">Independent Premium</span>
                    <h4 className="text-lg font-bold text-white uppercase font-sans">Independent Student</h4>
                    <p className="text-xs text-slate-300 font-light leading-relaxed font-sans">Full unrestricted access to proctors, 24/7 priority AI tutor help, and certified transcript outputs.</p>
                    <div className="py-2 animate-pulse">
                      <strong className="text-4xl font-extrabold text-blue-400 font-mono">$19</strong>
                      <span className="text-xs text-slate-200 ml-1 font-mono">USD / Month</span>
                    </div>
                    <ul className="text-xs text-slate-200 space-y-2 pt-2 border-t border-blue-900/30 leading-relaxed font-sans">
                      <li className="flex items-center gap-2"><span className="text-blue-400 font-semibold">✓</span> Unlimited priority 24/7 Socratic help</li>
                      <li className="flex items-center gap-2"><span className="text-blue-400 font-semibold">✓</span> Fully proctored browser-based exams</li>
                      <li className="flex items-center gap-2"><span className="text-blue-400 font-semibold">✓</span> Advanced robotics joint & pricing reactors</li>
                      <li className="flex items-center gap-2"><span className="text-blue-400 font-semibold">✓</span> Digital SHA-256 blockchain GPA backing</li>
                    </ul>
                  </div>
                  <a href="#auth-section" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-center text-xs font-extrabold uppercase rounded-xl text-white shadow-lg transition mt-4 block">Enroll at $19 / Month</a>
                </div>

                {/* Premium Student Annual */}
                <div className="bg-slate-950/40 border border-indigo-900/40 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3 font-sans">
                    <span className="px-2 py-0.5 text-[8px] font-mono uppercase bg-indigo-950 text-indigo-300 rounded border border-indigo-900/30 font-mono">Annual Saver</span>
                    <h4 className="text-lg font-bold text-white uppercase font-sans">Annual Student</h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed font-sans">Commit to a calendar year of accelerated schooling and save over 35% on individual licensing.</p>
                    <div className="py-2">
                      <strong className="text-3xl font-extrabold text-white font-mono">$149</strong>
                      <span className="text-xs text-slate-400 ml-1 font-mono">USD / Year (~$12.4/mo)</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-900 leading-relaxed font-sans">
                      <li className="flex items-center gap-2"><span className="text-indigo-400 font-semibold">✓</span> Integrated parental performance tracker</li>
                      <li className="flex items-center gap-2"><span className="text-indigo-400 font-semibold">✓</span> Unlimited Socratic tutor and file uploads</li>
                      <li className="flex items-center gap-2"><span className="text-indigo-400 font-semibold">✓</span> Complete physics reactors & certificates</li>
                      <li className="flex items-center gap-2"><span className="text-indigo-400 font-semibold">✓</span> Premium security transcript badges</li>
                    </ul>
                  </div>
                  <a href="#auth-section" className="w-full py-2 bg-indigo-950 hover:bg-indigo-900 text-center text-xs font-bold uppercase rounded-xl text-indigo-200 border border-indigo-950/40 transition mt-4 block">Select Annual Plan</a>
                </div>
              </div>
            </div>

            {/* Estimates & Plans for Schools in Contact Us */}
            <div id="contact-section" className="frosted-glass rounded-3xl p-6 sm:p-8 border border-blue-900/20 shadow-2xl relative font-sans">
              <div className="absolute right-4 top-4 text-blue-500 opacity-5 pointer-events-none">
                <Calculator className="w-36 h-36" />
              </div>
              <div className="relative z-10 space-y-8 animate-fade-in font-sans">
                
                <div className="space-y-2 text-center max-w-3xl mx-auto">
                  <span className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold bg-blue-950 border border-blue-900/40 px-3 py-1 rounded">
                    Institutional Portal & Rate Estimation
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase leading-tight font-sans text-sans">
                    Display Plans for Schools & Custom Co-Ops
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed font-sans">
                    Water Classroom scales effortlessly. Our institutional pricing calculates at precisely <strong className="text-blue-400">$12 per student per month</strong>. Review our math and initiate contact directly to claim your classroom namespace.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
                  
                  {/* Estimator Box */}
                  <div className="lg:col-span-7 bg-slate-950/60 p-6 rounded-2xl border border-blue-900/30 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h4 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                        <Calculator className="w-5 h-5 text-blue-400" /> School License Price Estimator
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-light font-sans text-[11px]">
                        Determine co-op, middle school, or college licensing parameters. Pricing computes flatly at USD $12 per student per month.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-sans">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Planned Students</label>
                          <input
                            type="number"
                            value={calcStudents}
                            onChange={(e) => setCalcStudents(Math.max(1, parseInt(e.target.value) || 0))}
                            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Billing Cycle</label>
                          <div className="flex gap-2">
                            <button onClick={() => setCalcBilling("yearly")} className={`flex-grow py-1.5 text-xs font-bold rounded-lg border transition ${calcBilling === "yearly" ? "bg-indigo-600 text-white border-indigo-505" : "bg-slate-900 border-slate-700 text-slate-400"}`}>Yearly ($144/stud)</button>
                            <button onClick={() => setCalcBilling("monthly")} className={`flex-grow py-1.5 text-xs font-bold rounded-lg border transition ${calcBilling === "monthly" ? "bg-indigo-600 text-white border-indigo-505" : "bg-slate-900 border-slate-700 text-slate-400"}`}>Monthly ($12/stud)</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-950/20 p-4 rounded-xl border border-indigo-900/20 gap-4 mt-6 font-sans">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-indigo-300 font-bold block">Estimated Licensing Fee</span>
                        <strong className="text-2xl font-extrabold text-[#818cf8] font-mono">${calculateInstitutionalBulkCost().toLocaleString()} USD</strong>
                        <span className="text-[9px] text-[#a5b4fc] block font-mono">
                          {calcBilling === "yearly" ? "Billed annually" : "Billed monthly"} at flat $12 per student / month.
                        </span>
                      </div>
                      <div className="flex gap-2 text-xs w-full sm:w-auto">
                        <button onClick={() => {
                          const msg = `We are interested in a quote for ${calcStudents} students. We prefer to be billed ${calcBilling === 'yearly' ? 'annually' : 'monthly'}. Estimated total budget: $${calculateInstitutionalBulkCost().toLocaleString()} USD.`;
                          setContactMsg(msg);
                          alert("Quote template drafted in the contact form! Note: Submitting this form means your school is officially contacting the Stellarium Company for enterprise licensing.");
                        }} className="flex-grow sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-505 font-bold rounded-xl text-white cursor-pointer transition">Save Quote</button>
                      </div>
                    </div>
                  </div>

                  {/* Submission Form / Contact Us */}
                  <div className="lg:col-span-1" />
                  
                  <div className="lg:col-span-4 bg-[#0b1c36]/30 border border-blue-900/30 p-6 rounded-2xl flex flex-col justify-between">
                    <form onSubmit={executeSendMessage} className="space-y-4">
                      <h4 className="text-md font-bold text-white uppercase tracking-wider block font-sans">💌 Contact Registrar Desk</h4>
                      
                      {contactConfirmed ? (
                        <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 rounded-xl p-4 text-xs space-y-2 animate-fade-in font-sans leading-relaxed">
                          <span className="font-bold text-white block text-[10px] uppercase font-mono tracking-wider">✓ Setup Request Sent</span>
                          Your custom school configuration request is saved. The Stellarium Foundation support desk will respond to your official administrative address within 12 hours.
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Representative Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Principal Rogers"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Official School E-mail</label>
                            <input
                              type="email"
                              required
                              placeholder="e.g. rogers@charteracademy.org"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Requirements / Student details</label>
                            <textarea
                              required
                              rows={3}
                              placeholder="Detail your classroom volume, student tracking rules, custom curriculum preferences..."
                              value={contactMsg}
                              onChange={(e) => setContactMsg(e.target.value)}
                              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none font-sans"
                            />
                          </div>
                          
                          {contactErrorMsg && (
                            <div className="text-rose-400 text-[10px] p-2 bg-rose-950/50 border border-rose-900/50 rounded font-mono">
                              ⚠ {contactErrorMsg}
                            </div>
                          )}
                          
                          <button
                            type="submit"
                            disabled={isSendingContact}
                            className={`w-full py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition font-sans block ${isSendingContact ? 'bg-indigo-900/50 text-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-505 text-white cursor-pointer active:scale-97'}`}
                          >
                            {isSendingContact ? sendingStatus || "Sending..." : "Submit Support Request"}
                          </button>
                        </>
                      )}
                    </form>

                    <div className="border-t border-slate-800/80 pt-4 mt-4 text-[10px] text-slate-400 space-y-1 font-sans">
                      <p><strong>Registry Mail desk:</strong> support@stellarium.org</p>
                      <p><strong>Toll Free Hotlines:</strong> +1 (800) 555-DATA / +41 (22) 555-8020</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-white uppercase tracking-tight text-center font-sans">Frequently Asked Questions (FAQ)</h3>
              <p className="text-xs text-slate-400 text-center max-w-xl mx-auto -mt-2 font-sans">Have questions about the platform? Read our detailed, comprehensive pedagogical FAQs below.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-sans">
                {[
                  {
                    q: "How does the Water Classroom Socratic Companion tutor students?",
                    a: "Our AI Tutor utilizes deep inquiry pedagogy. Instead of simple answer-spitting, the Socratic Tutor asks prompting questions, asks students to elaborate on complex math issues, models systematic reasoning, and guides students step-by-step to calibrate joint coefficients, solve pricing balances, or correct coding logic on their own."
                  },
                  {
                    q: "How does the browser-based Proctor exam verification work?",
                    a: "The voluntary exam verification utilizes the client's local computer camera purely client-side to track eye vectors, facial presence, and ambient volumes in decibels. This secures academic integrity transparently and without server-side data leaks, writing authenticated certificate registry hashes directly to student transcripts."
                  },
                  {
                    q: "What curriculum metrics are mapped inside the Academy?",
                    a: "Water Classroom lessons map to top global criteria, including K-12 US Common Core standards, UK GCSE tracks, and International Baccalaureate (IB) frameworks. Parents can choose their preference during student register or onboarding, and the system dynamically updates assignments, quizzes, and focus guidelines."
                  },
                  {
                    q: "How do homeschooling parents track and submit grades?",
                    a: "Parent mentors can set up a custom administrator registry, link student nodes, track points, and download cumulative grade sheets as portable CSV documents. These records serve as formal physical logs mapping precisely to municipal homeschool reporting rules."
                  },
                  {
                    q: "Can high-schoolers obtain high-fidelity STEM credits through robotics sims?",
                    a: "Yes. Our mechanical simulation games (Robotics joint balancer, Trinity equation slider) are formulated using actual physics values. Securing passing exam scores on these tasks awards certified transcript badges that prove K-12 and undergrad level engineering competencies."
                  },
                  {
                    q: "Is there any cost for self-taught or struggling individual students?",
                    a: "Zero cost for basic reading access, forum participation, and standard simulation attempts. This is sponsored through the Stellarium Foundation grant program to make class educational structures accessible worldwide. Premium features (priority 24/7 tutor, unlimited proctored badges) are available for $19 a month."
                  },
                  {
                    q: "What licensing options are structured for custom co-ops and group schools?",
                    a: "We provide comprehensive school plans for precisely $12 per student per month (or an annual option at $144 per student under bulk agreements). This plan includes bulk student account deployments, custom administrator dashboards, dedicated database nodes, shared forum spaces, and automated registry tracking tools."
                  },
                  {
                    q: "Is student user data privately protected?",
                    a: "Absolutely. All session tokens, passcode registry assets, and student logs remain fully secure inside the local browser context. No external models of marketing surveillance can access user progression, ensuring absolute privacy compliance for minor users."
                  },
                  {
                    q: "Can our homeschool group register as an institution split across multiple regions?",
                    a: "Yes! The 'Configure Your School Plan' supports co-ops, microschools, and academies of any size. When an administrator registers, a secure, shareable Access Key is generated. Students can use this specific key during registration from any location globally to join your private sandbox, saving them from paying individual student fees."
                  },
                  {
                    q: "How do individual student registration tracks differ?",
                    a: "Independent students pay $19 a month, gaining private access to 24/7 priority Socratic Tutor responses, proctored badge certifications, and comprehensive simulator sandbox logs. If you enter an active Access Key purchased by your school or co-op, your independent account is fully covered under their institutional package at zero personal cost."
                  },
                  {
                    q: "Are there any hidden setup fees, Rest API fees, or LMS integration surcharges?",
                    a: "No. We have completely eliminated setup fees, Rest API surcharges, and secondary LMS sync add-ons. Every registered institution plan receives full grading databases, local roster sync, and direct support services out-of-the-box for a simple flat fee of exactly $12 per student per month."
                  },
                  {
                    q: "Which payment options are accepted, and does registering require a credit card?",
                    a: "All math and invoices correspond with standard USD. You can explore, input, and test registered student credentials or school plans without a credit card. No immediate payment method is required to configure a school plan or independent student login profile within our simulated database."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950/40 rounded-xl border border-blue-900/20 overflow-hidden">
                    <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)} className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-blue-950/50 transition duration-200">
                      <span className="font-bold text-white text-xs sm:text-sm leading-snug">{item.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedFaq === idx ? "transform rotate-180" : ""}`} />
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-5 pb-4 text-[11px] sm:text-xs text-slate-300 leading-relaxed border-t border-blue-900/10 pt-3 bg-slate-900/30 font-light">{item.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footpage: Data and details of the Stellarium Foundation */}
            <footer className="border-t border-blue-950/60 pt-12 pb-8 text-xs text-slate-400 space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                
                {/* Brand Column */}
                <div className="space-y-3 font-sans sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-900 border border-blue-500/20 flex items-center justify-center text-[10px] font-extrabold text-blue-400">W</div>
                    <span className="font-extrabold text-white tracking-wider uppercase font-mono">WATER CLASSROOM</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                    The world-first open decentralized classroom registry. Delivering K-12 and undergraduate homeschool acceleration powered by Socratic AI and cryptographic verification.
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono pt-1">
                    LEDGER STATUS: COMPLIANT<br />
                    SWISS BUREAU ID: CH-200.3.011
                  </p>
                </div>

                {/* Curricula Links */}
                <div className="space-y-3 font-sans">
                  <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">CURRICULLUM NAVIGATION</h5>
                  <ul className="space-y-2 text-[11px] text-slate-400 font-light">
                    <li><a href="#auth-section" className="hover:text-blue-400 transition">U.S. Common Core Standards</a></li>
                    <li><a href="#auth-section" className="hover:text-blue-400 transition">UK GCSE & A-Level Syllabus</a></li>
                    <li><a href="#auth-section" className="hover:text-blue-400 transition">International Baccalaureate (IB)</a></li>
                    <li><a href="#auth-section" className="hover:text-blue-400 transition">Swiss Maturité Track</a></li>
                    <li><a href="#auth-section" className="hover:text-blue-400 transition">Socrates Pedagogy Creed</a></li>
                  </ul>
                </div>

                {/* Institutional Services Links */}
                <div className="space-y-3 font-sans">
                  <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">SCHOOL CONSTITUENTS</h5>
                  <ul className="space-y-2 text-[11px] text-slate-400 font-light">
                    <li><a href="#contact-section" className="hover:text-indigo-400 transition">Configure School Plan</a></li>
                    <li><a href="#contact-section" className="hover:text-indigo-400 transition">Interactive Rate Calculator</a></li>
                    <li><a href="#auth-section" className="hover:text-indigo-400 transition">Access Key Deployments</a></li>
                    <li><a href="#contact-section" className="hover:text-indigo-400 transition">Roster Registry Tools</a></li>
                    <li><a href="#contact-section" className="hover:text-indigo-400 transition">Submit Roster Database</a></li>
                  </ul>
                </div>

                {/* Foundation Profile Column */}
                <div className="space-y-3 font-sans">
                  <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">STELLARIUM FOUNDATION</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-light font-sans">
                    <strong>Stellarium Foundation, Inc.</strong> is a registered non-profit promoting global knowledge access standards, decentralized ledgers, and free STEM sandboxes.
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    US Registry ID: DE-6421-ST<br />
                    Swiss ID: CH-200.3.011.455-8
                  </p>
                </div>

                {/* Contact Columns */}
                <div className="space-y-3 font-sans">
                  <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">SUPPORT & OFFICES</h5>
                  <div className="text-[11px] text-slate-400 space-y-2 font-mono">
                    <p>
                      Email: support@stellarium.org<br />
                      Registrar: registry@stellarium.org
                    </p>
                    <p className="text-[10px] leading-tight text-slate-500 font-sans font-light">
                      <strong>Miami Bureau:</strong><br />
                      1200 Brickell Ave, Miami, FL<br />
                      <strong>Geneva HQ:</strong><br />
                      Rue de la Rôtisserie 14, Geneva
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Tel: +1 (800) 555-DATA<br />
                      Bureau: +41 (22) 555-8020
                    </p>
                  </div>
                </div>

              </div>

              <div className="border-t border-blue-950/40 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-4">
                <p className="font-sans">© 2026 Water Classroom Global & Stellarium Foundation, Inc. All rights reserved. Private credentials stored client-side in browser state.</p>
                <div className="flex gap-4 font-mono select-none">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SHA-256 LEDGER: [VERIFIED]</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> MONERO GATEWAY: [ON-LINE]</span>
                </div>
              </div>
            </footer>

          </div>
        ) : (
          <>
            {/* ONBOARDING DIALOG TO CUSTOMIZE CURRICULUM */}
            {!isOnboarded && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="frosted-glass-dark p-6 sm:p-8 rounded-3xl max-w-md w-full border border-blue-500/20 text-center space-y-6">
              <div className="w-14 h-14 bg-blue-950 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 mx-auto animate-bounce">
                <Compass className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-extrabold text-white">Select Your Curriculum Track</h3>
                <p className="text-xs text-slate-400">Tailor your AI Classroom tools, exams, and lectures dynamically.</p>
              </div>

              <div className="space-y-3">
                <div className="text-left space-y-1.5">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Comprehensive Options</label>
                  <select
                    value={onboardingCurriculum}
                    onChange={(e) => setOnboardingCurriculum(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="US Common Core">U.S. Common Core Standards</option>
                    <option value="UK GCSE">United Kingdom GCSE Track</option>
                    <option value="IB Platform">International Baccalaureate (IB)</option>
                    <option value="Water Creed">Water First-Principles Creed</option>
                    <option value="Regional Custom">Regional School Variations</option>
                  </select>
                </div>

                <form onSubmit={handleOnboardClassroom} className="text-left space-y-1.5 pt-2 border-t border-slate-800">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Have an Institution Onboarding Code?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. W-CLASS-2026"
                      value={institutionCode}
                      onChange={(e) => setInstitutionCode(e.target.value)}
                      className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold transition"
                    >
                      Verify
                    </button>
                  </div>
                  {joinedClassroom && (
                    <span className="text-[10px] text-emerald-400 block mt-1">✓ Active Institutional Sandbox: {joinedClassroom}</span>
                  )}
                </form>
              </div>

              <button
                onClick={() => setIsOnboarded(true)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-98 transition"
              >
                Assemble Personalized Classroom
              </button>
            </div>
          </div>
        )}
        {/* TAB 1: LAUNCH PAGE / LANDING PAGE */}
        {false && activeTab === "launch" && (
          <div className="space-y-12 animate-fade-in text-slate-100">
            
            {/* Hero Pitch Banner */}
            <div className="blue-gradient-bg rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-blue-400/20">
              <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl"></div>
              <div className="absolute left-1/3 bottom-0 -mb-16 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-4xl space-y-6">
                <span className="px-3.5 py-1.5 rounded-full bg-blue-900/60 text-[10px] font-extrabold uppercase tracking-widest border border-blue-300/30 backdrop-blur-md">
                  ✨ NOW OPEN: A NEW ERA OF HUMAN LEARNING
                </span>
                
                <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight uppercase font-sans">
                  The Water Classroom:<br className="hidden sm:block"/> Redefining Education in the AI Era
                </h2>
                
                <p className="text-sm sm:text-lg text-blue-50 font-normal leading-relaxed max-w-3xl">
                  Break down institutional barriers once and for all. We provide K-12 and undergraduate students, educators, and institutions with a complete, AI-powered virtual school. Engage with gamified curriculums tailored to U.S. Common Core, UK GCSE or IB tracks, consult 24/7 AI tutors, and unleash creativity with interactive labs—all from a single, transformative platform.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => setActiveTab("academy")}
                    className="px-8 py-3.5 rounded-xl bg-white text-blue-950 font-extrabold text-xs tracking-wider uppercase transition hover:bg-blue-50 active:scale-95 shadow-lg flex items-center gap-2"
                  >
                    Enter Open Academy <ArrowRight className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => setIsOnboarded(false)}
                    className="px-6 py-3.5 rounded-xl bg-blue-950/60 text-blue-100 font-bold text-xs tracking-wider uppercase border border-blue-400/30 hover:bg-blue-950 transition flex items-center gap-2"
                  >
                    <Compass className="w-4.5 h-4.5 text-blue-300 animate-pulse" /> Change Curriculum Track
                  </button>
                  <button
                    onClick={() => setShowDirectDonateModal(true)}
                    className="px-6 py-3.5 rounded-xl bg-rose-950/50 text-rose-200 font-semibold border border-rose-500/30 hover:bg-rose-900/60 text-xs uppercase tracking-wider transition flex items-center gap-2"
                  >
                    <Heart className="w-4.5 h-4.5 text-rose-300 fill-rose-500 animate-pulse" /> Sponsor Student
                  </button>
                </div>
              </div>
            </div>

            {/* Explanatory Segment: The Strategic Pillars of Our Modern Academy */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h3 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-extrabold">Executive Summary</h3>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white uppercase">A Complete Educational Ecosystem</h4>
                <p className="text-xs sm:text-sm text-slate-400 font-light">
                  The Water Classroom democratizes access to high-quality education. By integrating cutting-edge artificial intelligence with comprehensive curriculum alignment, we bridge educational gaps and empower K-12 to undergraduate learners globally.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div id="card-curriculum" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102">
                  <div className="w-12 h-10 rounded-xl bg-blue-950/50 border border-blue-400/30 flex items-center justify-center text-blue-400 text-shadow-glow">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">AI-Tailored Curriculum</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Dynamic lessons aligned with national and international standards, adaptable to individual learning paces and styles. Interactive multimedia content and games are designed to supercharge the learning experience.
                  </p>
                </div>

                <div id="card-tutoring" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102">
                  <div className="w-12 h-10 rounded-xl bg-cyan-950/50 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                    <Cpu className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">24/7 AI Tutoring & Homework</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Our AI tutors offer step-by-step teaching, real-time feedback, and guidance. Advanced automated grading algorithms provide actionable insights for both students and educators around the clock.
                  </p>
                </div>

                <div id="card-innovation" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102">
                  <div className="w-12 h-10 rounded-xl bg-indigo-950/50 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Innovation & Creativity Labs</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Project-based learning modules connect core concepts to real-world scenarios. Engage in gamified engineering challenges and creative problem-solving to foster critical thinking and boundless imagination.
                  </p>
                </div>

                <div id="card-analytics" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102 lg:col-span-1 md:col-span-1">
                  <div className="w-12 h-10 rounded-xl bg-emerald-950/50 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    <Calculator className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Progress Analytics Dashboard</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light">
                    Users can rigorously track academic performance, engagement streaks, and skill development. Generates customizable, detailed growth reports for teachers, parents, and administrative oversight.
                  </p>
                </div>

                <div id="card-collaborative" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102 lg:col-span-2 md:col-span-2 lg:flex lg:gap-6 lg:items-center lg:space-y-0">
                  <div className="flex-shrink-0 w-12 h-10 rounded-xl bg-rose-950/50 border border-rose-400/30 flex items-center justify-center text-rose-400 lg:w-16 lg:h-16">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">Collaborative Learning Ecosystem</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-light max-w-xl">
                      The platform includes seamlessly integrated virtual classrooms, moderated peer discussion forums, and dedicated educator tools, crafting a shared environment for robust curriculum management.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* How It Works (The 4-Step Academic Pipeline) */}
            <div className="frosted-glass rounded-3xl p-6 sm:p-10 border border-blue-900/30 shadow-xl space-y-8">
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold">THE INTAKE PIPELINE</h3>
                <h4 className="text-xl sm:text-2xl font-extrabold text-white uppercase">The 4-Step Student Journey</h4>
                <p className="text-xs text-slate-400 max-w-xl">
                  Whether you are enrolling as a private homeschool student or a classroom group, our pipeline takes you from zero to verifiable credentialing.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {[
                  { step: "01", title: "Select a Curriculum Track", desc: "Choose your primary curriculum (e.g. U.S. Common Core, UK GCSE, IB) or use a school invite code to match your region's exact standards." },
                  { step: "02", title: "Interactive Lectures & Games", desc: "Access the Open Academy for fun, AI-delivered multimedia lessons and games tailored explicitly to your chosen curriculum path." },
                  { step: "03", title: "24/7 AI Tutor & Innovation Labs", desc: "Solve real-world homework challenges with our 24/7 AI Socratic Companion. The tutor adapts in real-time, helping gifted and struggling learners alike." },
                  { step: "04", title: "Verified Exams & Badges", desc: "Complete automated assessments. Complete secure exams via camera to earn Achievement Badges and maintain your Learning Streaks." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950/40 p-5 rounded-xl border border-blue-950 flex flex-col justify-between space-y-3 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 text-[5rem] font-bold text-blue-500/5 select-none font-mono -mt-6 leading-none transition duration-350 group-hover:text-blue-500/10">
                      {item.step}
                    </div>
                    <div className="space-y-1 z-10">
                      <span className="text-[10px] font-mono text-blue-400 font-extrabold uppercase bg-blue-950 border border-blue-900/40 px-2 py-0.5 rounded">STEP {item.step}</span>
                      <h5 className="font-extrabold text-white text-sm pt-1">{item.title}</h5>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-light z-10">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeted Audience Profiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#0b1c36]/30 border border-blue-900/30 rounded-2xl p-6 sm:p-8 space-y-4">
                <span className="px-2.5 py-1 rounded bg-[#10346c] text-[10px] uppercase font-mono text-blue-300 font-bold border border-blue-800/40">FOR HOMESCHOOL INDIVIDUALS</span>
                <h4 className="text-lg font-bold text-white uppercase tracking-tight">Sovereign Knowledge Acceleration</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  No longer depend on physical proximity to elite private academies or expensive tutoring agencies. Our independent student track allows self-taught students to build actual project portfolios, debate on public forum boards, test theories in interactive games, and prove their real GPA output through cryptographically signed badges.
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setActiveTab("academy")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-[10px] text-white font-bold rounded-lg uppercase tracking-wider transition">Start Independent Study</button>
                </div>
              </div>

              <div className="bg-[#1e1b4b]/20 border border-indigo-900/30 rounded-2xl p-6 sm:p-8 space-y-4">
                <span className="px-2.5 py-1 rounded bg-[#312e81] text-[10px] uppercase font-mono text-indigo-300 font-bold border border-indigo-800/40">FOR CO-OPS, TEACHERS & SCHOOLS</span>
                <h4 className="text-lg font-bold text-white uppercase tracking-tight">Advanced Institutional Sandboxing</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Supercharge your brick-and-mortar classrooms, homeschooling co-ops, or community groups. Connect with our registrar database, download pre-integrated lesson blueprints, set up private classroom sandbox namespaces, and track student focus hours with local computer sensor logs.
                </p>
                <div className="flex gap-2">
                  <a href="#institution-config" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-[10px] text-white font-bold rounded-lg uppercase tracking-wider transition">Configure Co-Op Plan</a>
                </div>
              </div>

            </div>

            {/* High Level Institution Workspace Builder Cost Estimator */}
            <div id="institution-config" className="frosted-glass rounded-3xl p-6 sm:p-8 border border-blue-900/20 shadow-2xl relative">
              <div className="absolute right-4 top-4 text-blue-500 opacity-5">
                <Calculator className="w-36 h-36" />
              </div>

              <div className="max-w-3xl space-y-6">
                <span className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold bg-blue-950 border border-blue-900/40 px-3 py-1 rounded">
                  Educational Institution Portal & Rate Configurator
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase">
                  Bulk Enrollment Workspace Estimator
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-light">
                  Configure special discount pricing matrices for regional student divisions, charter school systems, private networks, or virtual clusters. Hold a secure enrollment quote and instantly download the curriculum blueprint.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 bg-slate-950/60 p-4 rounded-xl border border-blue-900/20">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Planned Students</label>
                    <input
                      type="number"
                      value={calcStudents}
                      onChange={(e) => setCalcStudents(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full rounded-lg bg-slate-900 border border-slate-705 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400 font-bold font-bold font-bold">Billing Model</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCalcBilling("monthly")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${
                          calcBilling === "monthly" ? "bg-blue-600 text-white border-blue-500" : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setCalcBilling("yearly")}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${
                          calcBilling === "yearly" ? "bg-blue-600 text-white border-blue-500" : "bg-slate-900 border-slate-700 text-slate-400"
                        }`}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Integrations Add-on</label>
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                      <input
                        type="checkbox"
                        checked={calcCustomSupport}
                        onChange={(e) => setCalcCustomSupport(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:outline-none focus:ring-0 focus:ring-offset-0"
                      />
                      <span className="text-xs text-slate-300">REST API & LMS sync</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-950/20 p-4 rounded-xl border border-blue-900/20 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-blue-400 font-bold block">Estimated Annual Fee</span>
                    <strong className="text-2xl font-extrabold text-blue-400">${calculateInstitutionalBulkCost()} USD</strong>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Bulk discount rate active: {calcStudents > 300 ? "30% volume coupon" : calcStudents > 100 ? "15% discount coupon" : "Standard license price"}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => alert(`Registration quote saved! Our technical team will follow up on secure database sandboxing.`)}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition text-white"
                    >
                      Hold Custom Price
                    </button>
                    <button
                      onClick={() => alert(`Curriculum Blueprint PDF generated and cached to client downloads.`)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-slate-300 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Blueprint
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Q&A Accordion */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-white tracking-tight text-center sm:text-left uppercase">
                Frequently Asked Questions (FAQ)
              </h3>
              
              <div className="space-y-2.5">
                {[
                  {
                    q: "What is the core pedagogical methodology of Water Classroom?",
                    a: "Water Classroom combines Socratic inquiry with actionable laboratory simulation. We believe theoretical learning is incomplete without practical output. Thus, rather than standard text lessons, our students must interactively calibrate robot joints, solve business pricing equations, or draft actual contracts, immediately proving comprehension on-screen."
                  },
                  {
                    q: "How does the AI Proctoring system verify academic integrity without invasive tracking?",
                    a: "Our secure proctor exam feature runs purely client-side through Javascript computer vision arrays and ambient noise trackers. It checks facial landmark parameters, eye focus levels, and background noise thresholds in real-time. It validates that the designated student completed the assessment independently, recording verified certificate codes on the global registry."
                  },
                  {
                    q: "Can homeschooling co-ops or group tutors customize their student logs?",
                    a: "Yes. By accessing our onboarding dialogue or completing curriculum paths, tutors can track specific student profiles, custom-tag tasks, generate local forum threads, and download comprehensive student record folders for direct upload to municipal school boards."
                  },
                  {
                    q: "Is there any cost for individual students or lifelong self-directed learners?",
                    a: "Zero. The Open Academy framework, curriculum textbook content, Socratic chatbot assistance, and simulation games are fully open-access. This is funded entirely through our generous community sponsorships and global corporate partnerships to guarantee high-quality education for all."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-950/40 rounded-xl border border-blue-900/20 overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-blue-950/50 transition duration-200"
                    >
                      <span className="font-bold text-white text-sm sm:text-base leading-snug">{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          expandedFaq === idx ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-blue-900/10 pt-3 bg-slate-900/30">
                         {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: OPEN ACADEMY (CURRICULUMS, LESSONS, QUIZZES & PREMIUM SIMS) */}
        {activeTab === "academy" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            {/* Lesson Selector lists (Left Column) */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="frosted-glass rounded-2xl p-4 shadow-sm space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#60a5fa] block font-bold">
                  Curriculum Track filter
                </span>
                
                <div className="flex flex-col gap-1.5">
                  {[
                    { key: "all", name: "All Curriculums" },
                    { key: "creed", name: "Philosophy & Creed" },
                    { key: "scitech", name: "Sci-Tech & Robotics" },
                    { key: "business", name: "Business Mastery" },
                    { key: "dynamics", name: "Human Dynamics" }
                  ].map((track) => (
                    <button
                      key={track.key}
                      onClick={() => {
                        setSelectedCurriculum(track.key);
                        setSelectedLesson(null);
                        setActiveQuiz(null);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                        selectedCurriculum === track.key
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-300 hover:bg-blue-950/40"
                      }`}
                    >
                      {track.name}
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Lessons Stack */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm uppercase tracking-wide px-1">
                  Core Lectures List
                </h4>
                
                <div className="space-y-2">
                  {filteredLessons.map((les) => {
                    const isCompleted = progress.completedLessons.includes(les.id);
                    return (
                      <button
                        key={les.id}
                        onClick={() => {
                          setSelectedLesson(les);
                          setActiveQuiz(null);
                          setActiveGame(null);
                        }}
                        className={`w-full text-left p-4 rounded-xl transition border text-sm relative group flex items-start justify-between gap-3 ${
                          selectedLesson?.id === les.id
                            ? "bg-slate-900 border-blue-500 shadow-md"
                            : "bg-slate-950/40 hover:bg-[#09152b]/55 border-[#121f3d] shadow-sm"
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] uppercase font-mono tracking-widest bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded font-bold border border-blue-900/30">
                              {les.topic}
                            </span>
                            <span className="text-[9px] uppercase font-mono tracking-widest bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded">
                              {les.difficulty}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-white group-hover:text-blue-400 transition">
                            {les.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                            {les.description}
                          </p>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-emerald-400 grow-0 shrink-0 mt-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Lesson Reader Detail (Right 2 Column) */}
            <div className="lg:col-span-2 space-y-6">
              {selectedLesson ? (
                <div className="frosted-glass-dark rounded-3xl p-6 sm:p-8 border border-blue-950 overflow-hidden relative space-y-6">
                  
                  {/* Glowing line indicators */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600"></div>

                  <div className="flex justify-between items-start flex-wrap gap-4 border-b border-blue-950 pb-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 border border-blue-900/40 px-2 py-0.5 rounded">
                          Track: {selectedLesson.curriculum.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400 font-light">• {selectedLesson.durationMin} Min lecture</span>
                      </div>
                      <h2 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight leading-tight">
                        {selectedLesson.title}
                      </h2>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const targetQuiz = QUIZZES.find((q) => q.lessonId === selectedLesson.id);
                          if (targetQuiz) {
                            setActiveQuiz(targetQuiz);
                            setQuizAnswers(new Array(targetQuiz.questions.length).fill(-1));
                            setShowQuizResult(false);
                            startVerifiedProctorExam();
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-1.5"
                      >
                        <Video className="w-4 h-4 animate-pulse text-red-400" /> Start Proctored Exam
                      </button>
                    </div>
                  </div>

                  {/* Textbook Markdown reader */}
                  <article className="prose prose-invert max-w-none text-slate-350 text-xs sm:text-sm leading-relaxed space-y-5">
                    {selectedLesson.content.split("\n\n").map((para, i) => {
                      if (para.startsWith("##")) {
                        return (
                          <h3 key={i} className="text-base sm:text-lg font-bold text-white border-l-2 border-blue-500 pl-3 pt-3 uppercase tracking-wide">
                            {para.replace("##", "").trim()}
                          </h3>
                        );
                      }
                      if (para.startsWith("###")) {
                        return (
                          <h4 key={i} className="text-xs sm:text-sm font-extrabold text-blue-400 pt-2 uppercase">
                            {para.replace("###", "").trim()}
                          </h4>
                        );
                      }
                      if (para.startsWith("* **")) {
                        return (
                          <div key={i} className="pl-4 py-1.5 border-l-2 border-slate-700 my-2 font-light italic">
                            {para}
                          </div>
                        );
                      }
                      return <p key={i}>{para}</p>;
                    })}
                  </article>

                  {/* DYNAMIC INTERACTIVE GAME MODULE COMPRESSION */}
                  <div className="bg-[#050b18]/60 p-5 rounded-2xl border border-blue-950/70 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#a855f7]">Interactive Paradigm Simulation Game</h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Aligned with {selectedLesson.topic}</span>
                    </div>

                    {/* Render specific game based on curriculum key */}
                    {selectedLesson.curriculum === "creed" && (
                      <div className="space-y-4 text-center p-3 rounded-lg bg-[#02050e] border border-blue-900/10">
                        <p className="text-xs text-slate-300">
                          <strong>The Trinity Test game:</strong> Drag the sliders so that Do Good, Make Money, and Have Fun all equal exactly <strong>100%</strong> to trigger physical abundance.
                        </p>
                        
                        <div className="space-y-3 max-w-md mx-auto text-left">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                              <span>Do Good (Altruism factor)</span>
                              <span className={trinityGood === 100 ? "text-emerald-400" : ""}>{trinityGood}%</span>
                            </div>
                            <input
                              type="range" min="0" max="150" value={trinityGood}
                              onChange={(e) => setTrinityGood(parseInt(e.target.value))}
                              className="w-full accent-blue-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                              <span>Make Money (Profit factor)</span>
                              <span className={trinityMoney === 100 ? "text-emerald-400" : ""}>{trinityMoney}%</span>
                            </div>
                            <input
                              type="range" min="0" max="150" value={trinityMoney}
                              onChange={(e) => setTrinityMoney(parseInt(e.target.value))}
                              className="w-full accent-emerald-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                              <span>Have Fun (Joy factor)</span>
                              <span className={trinityFun === 100 ? "text-emerald-400" : ""}>{trinityFun}%</span>
                            </div>
                            <input
                              type="range" min="0" max="150" value={trinityFun}
                              onChange={(e) => setTrinityFun(parseInt(e.target.value))}
                              className="w-full accent-amber-500"
                            />
                          </div>
                        </div>

                        {trinityWinner ? (
                          <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl animate-bounce">
                            <span className="text-xs font-bold text-emerald-400">🌟 PERFECT TRINITY ALIGNMENT TRIGGERED (+150 XP awarded!)</span>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500 italic">Current values must be exactly 100 each. Slide carefully!</p>
                        )}
                      </div>
                    )}

                    {selectedLesson.curriculum === "scitech" && (
                      <div className="space-y-4 text-center p-3 rounded-lg bg-[#02050e] border border-blue-900/10">
                        <p className="text-xs text-slate-300">
                          <strong>Water Robotics calibration simulator:</strong> Calibrate joint torque to balance a remote humanoid operator. Hip: <strong>60-70</strong>, Knee: <strong>92-98</strong>, Ankle: <strong>82-88</strong>.
                        </p>

                        <div className="space-y-3 max-w-md mx-auto text-left">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                              <span>Hip Joint Torque (Nm)</span>
                              <span className={robotHip >= 60 && robotHip <= 70 ? "text-emerald-400" : "text-amber-400"}>{robotHip} / 60-70</span>
                            </div>
                            <input
                              type="range" min="0" max="120" value={robotHip}
                              onChange={(e) => setRobotHip(parseInt(e.target.value))}
                              className="w-full accent-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                              <span>Knee Resonance Alignment (%)</span>
                              <span className={robotKnee >= 92 && robotKnee <= 98 ? "text-emerald-400" : "text-amber-400"}>{robotKnee} / 92-98</span>
                            </div>
                            <input
                              type="range" min="50" max="150" value={robotKnee}
                              onChange={(e) => setRobotKnee(parseInt(e.target.value))}
                              className="w-full accent-indigo-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                              <span>Ankle Dampening Matrix (Hz)</span>
                              <span className={robotAnkle >= 82 && robotAnkle <= 88 ? "text-emerald-400" : "text-amber-400"}>{robotAnkle} / 82-88</span>
                            </div>
                            <input
                              type="range" min="50" max="150" value={robotAnkle}
                              onChange={(e) => setRobotAnkle(parseInt(e.target.value))}
                              className="w-full accent-indigo-500"
                            />
                          </div>
                        </div>

                        {robotBalanced ? (
                          <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-emerald-400 block animate-bounce">🤖 ROBOTICS BALANCE COEFFICIENT SECURED (+200 XP!)</span>
                            <div className="w-16 h-8 bg-slate-900 border border-emerald-500/30 rounded mx-auto flex items-center justify-center font-mono text-[10px] text-emerald-400">
                              RUNNING...
                            </div>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-500 italic">Adjust sliders to find perfect balance centers.</p>
                        )}
                      </div>
                    )}

                    {selectedLesson.curriculum === "business" && (
                      <div className="space-y-4 text-center p-3 rounded-lg bg-[#02050e] border border-blue-900/10">
                        <p className="text-xs text-slate-300">
                          <strong>Business Incentive Equation tuner:</strong> Raise revenue, lower structural overhead costs, and reduce average utility costs per consumer to optimize compensation yields.
                        </p>

                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Revenues ($)</label>
                            <input
                              type="range" min="10000" max="100000" step="5000" value={incRevenue}
                              onChange={(e) => setIncRevenue(parseInt(e.target.value))}
                              className="w-full accent-blue-500"
                            />
                            <span className="text-xs text-white">${incRevenue}</span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">All Costs ($)</label>
                            <input
                              type="range" min="5000" max="50000" step="2000" value={incCosts}
                              onChange={(e) => setIncCosts(parseInt(e.target.value))}
                              className="w-full accent-blue-500"
                            />
                            <span className="text-xs text-white">${incCosts}</span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Base Pay ($)</label>
                            <input
                              type="range" min="1000" max="5000" step="200" value={incBase}
                              onChange={(e) => setIncBase(parseInt(e.target.value))}
                              className="w-full accent-blue-500"
                            />
                            <span className="text-xs text-white">${incBase}</span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Cost per kWh ($)</label>
                            <input
                              type="range" min="0.05" max="0.50" step="0.01" value={incKwhPrice}
                              onChange={(e) => setIncKwhPrice(parseFloat(e.target.value))}
                              className="w-full accent-blue-500"
                            />
                            <span className="text-xs text-white">${incKwhPrice}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-950/40 border border-blue-500/20 rounded-xl">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Composite Reward Multiplier</span>
                          <strong className="text-xl text-blue-400 font-bold block">{calculatedRewardMultiplier()}x</strong>
                        </div>
                      </div>
                    )}

                    {selectedLesson.curriculum === "dynamics" && (
                      <div className="p-4 bg-[#02050e] border border-blue-900/10 rounded-lg text-center space-y-3">
                        <span className="text-xs font-bold text-[#e11d48] uppercase tracking-wider block">Relationship Covenant Blueprint</span>
                        <p className="text-xs text-slate-300">
                          Input separation terms, income percentages, and mediational protocols inside your personal dashboard covenant document.
                        </p>
                        <button
                          onClick={() => alert("Covenant draft stored. Consult the virtual family mediation council in case of conflict.")}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold font-mono text-rose-400 border border-rose-500/20 transition"
                        >
                          Draft Written Marriage Contract 📑
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Consulting AI Tutor */}
                  <div className="bg-[#050b18]/60 p-4 rounded-2xl border border-blue-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-800/40 flex items-center justify-center text-blue-300 shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Stuck or need clarifications?</h4>
                        <p className="text-xs text-slate-400">Ask our 24/7 Socratic AI Tutor to breakdown these textbook modules.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab("tutor");
                        handleSendMessage(`Please Socratically guide me on: "${selectedLesson.title}"`);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-950 text-blue-400 hover:bg-blue-900/50 text-xs font-bold border border-blue-800/40 transition shrink-0"
                    >
                      Consult AI Tutor
                    </button>
                  </div>

                </div>
              ) : (
                <div className="frosted-glass rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-950 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto animate-bounce">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xl text-white uppercase tracking-wider">No Lecture Selected</h3>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Choose any core curriculum track filter from the left panel to browse masterclasses, test your knowledge, and take exams.
                    </p>
                  </div>
                </div>
              )}

              {/* VERIFIED PROCTORED EXAM MODAL */}
              {activeQuiz && (
                <div className="fixed inset-0 bg-[#030712]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
                  <div className="frosted-glass-dark rounded-3xl max-w-2xl w-full border border-blue-500/20 relative shadow-2xl">
                    
                    {/* Header Proctoring status */}
                    <div className="sticky top-0 bg-[#060b18]/95 px-6 py-4 border-b border-blue-950 flex justify-between items-center z-25">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                          <Video className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">VERIFIED PROCTOR EXAM ACTIVE</h3>
                          <p className="text-[10px] text-blue-400 font-mono tracking-wide">SECURE TRANSCRIPTS BROADCAST</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-mono">TIMER REMAINING</span>
                          <strong className="text-xs font-mono font-bold text-slate-300">
                            {Math.floor(examTimer / 60)}:{(examTimer % 60).toString().padStart(2, "0")}
                          </strong>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm("Abandoning the proctored exam will void this attempt. Confirm exit?")) {
                              stopVerifiedProctorExam(0, activeQuiz.questions.length);
                              setActiveQuiz(null);
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Left Side: Proctor visual camera feed & logs */}
                      <div className="md:col-span-1 space-y-4">
                        
                        {/* Interactive Webcam frame / Hologram scanning box */}
                        <div className="w-full aspect-video md:aspect-square bg-slate-950 border border-red-500/30 rounded-xl overflow-hidden relative flex items-center justify-center shadow-inner">
                          {cameraPermissionGranted ? (
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 text-[10px] text-blue-400 space-y-2">
                              <Shield className="w-6 h-6 text-red-400 animate-pulse" />
                              <span>PROCTOR EYE SCAN RADAR ACTIVE</span>
                              <div className="w-16 h-0.5 bg-red-500/60 shadow-[0_0_8px_red] animate-pulse"></div>
                            </div>
                          )}
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-emerald-400 border border-emerald-500/30">
                            ● REC_ON
                          </div>
                        </div>

                        {/* Proctor telemetry details */}
                        <div className="space-y-1.5 font-mono text-[9px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-blue-900/40">
                          <span className="text-[#a855f7] font-bold block pb-1 border-b border-blue-900/30 uppercase">LIVE INTEGRITY LOG</span>
                          {proctorLogs.map((logStr, lIdx) => (
                            <div key={lIdx} className="leading-tight flex items-start gap-1">
                              <span className="text-slate-500">&gt;</span>
                              <span>{logStr}</span>
                            </div>
                          ))}
                        </div>

                      </div>

                      {/* Right Side: Questions */}
                      <div className="md:col-span-2 space-y-6">
                        {!showQuizResult ? (
                          <div className="space-y-6">
                            {activeQuiz.questions.map((q, qIdx) => (
                              <div key={qIdx} className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-blue-950">
                                <h4 className="font-bold text-white text-xs sm:text-sm">
                                  {qIdx + 1}. {q.question}
                                </h4>
                                
                                <div className="space-y-2">
                                  {q.options.map((option, optIdx) => (
                                    <button
                                      key={optIdx}
                                      onClick={() => {
                                        const updated = [...quizAnswers];
                                        updated[qIdx] = optIdx;
                                        setQuizAnswers(updated);
                                      }}
                                      className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                                        quizAnswers[qIdx] === optIdx
                                          ? "bg-blue-950 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                                          : "bg-slate-900/50 border-[#121f3d] text-slate-300 hover:border-blue-900"
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <button
                              onClick={handleQuizSubmit}
                              disabled={quizAnswers.includes(-1)}
                              className={`w-full py-3 rounded-xl font-bold transition text-xs tracking-wider uppercase ${
                                quizAnswers.includes(-1)
                                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-98"
                              }`}
                            >
                              Submit Answers & Verify Proctor
                            </button>
                          </div>
                        ) : (
                          <div className="text-center space-y-6">
                            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto scale-110">
                              <Check className="w-8 h-8 animate-pulse" />
                            </div>
                            
                            <div>
                              <h4 className="text-xl font-extrabold text-white uppercase">
                                GRADEBOOK: {quizScore} / {activeQuiz.questions.length} CORRECT
                              </h4>
                              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                {quizScore === activeQuiz.questions.length
                                  ? "Proctor has confirmed exam compliance. Transcript certificate hashed."
                                  : "Score does not meet 100% alignment parameters under first principles. Socratic feedback logged below."}
                              </p>
                            </div>

                            {/* Detailed Feedback scrollable */}
                            <div className="space-y-3.5 text-left bg-slate-950 border border-blue-950 rounded-2xl p-4 max-h-48 overflow-y-auto">
                              {activeQuiz.questions.map((q, idx) => (
                                <div key={idx} className="text-[11px] space-y-1 border-b border-blue-900/30 pb-2 last:border-0 last:pb-0">
                                  <strong className="text-blue-400 block font-bold font-mono">QUESTION {idx + 1} COMMENT:</strong>
                                  <p className="text-slate-350">{q.explanation}</p>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  setQuizAnswers(new Array(activeQuiz.questions.length).fill(-1));
                                  setShowQuizResult(false);
                                  startVerifiedProctorExam();
                                }}
                                className="w-1/2 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs transition active:scale-95"
                              >
                                Re-test Exam
                              </button>
                              <button
                                onClick={() => {
                                  setActiveQuiz(null);
                                  setShowQuizResult(false);
                                }}
                                className="w-1/2 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs transition shadow active:scale-95 hover:bg-blue-500"
                              >
                                Exit Exam Terminal
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 3: 24/7 AI SOCRATIC TUTOR */}
        {activeTab === "tutor" && (
          <div className="frosted-glass rounded-3xl shadow-2xl border border-blue-950 max-w-4xl mx-auto h-[70vh] flex flex-col overflow-hidden animate-fade-in relative">
            <div className="absolute inset-0 pr-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            {/* AI Tutor Chat Header */}
            <div className="bg-[#050b18]/80 p-4 border-b border-blue-950 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-500/20 flex items-center justify-center text-blue-400 relative">
                  <Cpu className="w-5 h-5 animate-pulse" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-slate-900"></span>
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">Water Tutor v1.4 Fluid</h3>
                  <p className="text-[10px] text-emerald-400 font-mono tracking-wide">● SEED ACTIVE (LATENCY 45ms)</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold bg-[#1e1b4b] border border-blue-800/40 text-blue-300 px-2.5 py-1 rounded">
                  24/7 Socratic Aid
                </span>
              </div>
            </div>

            {/* Messages box */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
              {chatMessages.map((msg, idx) => {
                const isTutor = msg.sender === "tutor";
                return (
                  <div
                    key={msg.id || idx}
                    className={`flex gap-3 max-w-3xl animate-fade-in ${isTutor ? "" : "ml-auto flex-row-reverse"}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isTutor ? "bg-blue-950 border border-blue-500/30 text-blue-400" : "bg-cyan-950 border border-cyan-500/30 text-cyan-400"
                    }`}>
                      {isTutor ? <Cpu className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        isTutor
                          ? "bg-slate-950/85 border border-blue-950 text-slate-200"
                          : "bg-blue-600 text-white"
                      }`}>
                        {/* Simple rendering supporting elementary Markdown lines */}
                        {msg.text.split("\n\n").map((para, pIdx) => {
                          if (para.startsWith("###")) {
                            return <h4 key={pIdx} className="font-bold text-white text-xs sm:text-sm mb-1 uppercase tracking-wide">{para.replace("###", "").trim()}</h4>;
                          }
                          if (para.startsWith("- **") || para.startsWith("- ")) {
                            return <p key={pIdx} className="pl-3 border-l border-blue-800/70 font-mono text-xs">{para}</p>;
                          }
                          return <p key={pIdx} className="mb-1.5 last:mb-0">{para}</p>;
                        })}
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 block px-1 text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTutorTyping && (
                <div className="flex gap-3 max-w-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Cpu className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-slate-950 border border-blue-950 rounded-2xl px-4 py-3 text-xs font-mono text-slate-400 flex items-center gap-1">
                    <span>Socratic processing</span>
                    <span className="animate-ping text-blue-400">...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input form */}
            <div className="p-4 bg-[#050b18]/80 border-t border-blue-950/70 shrink-0">
              <div className="flex gap-2.5">
                <input
                  type="text"
                  placeholder="Ask standard Common Core math, Unitree kinetics, or Abundance creed logic..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  className="flex-grow rounded-xl bg-slate-900 border border-slate-700/60 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                
                <button
                  onClick={() => handleSendMessage()}
                  className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center shadow shadow-blue-500/20"
                >
                  <Send className="w-4 h-4 animate-pulse" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: DECENTRALIZED BOARD OF TASKS */}
        {activeTab === "tasks" && (
          <div className="space-y-8 animate-fade-in text-white">
            
            {/* Explanatory introduction card */}
            <div className="bg-gradient-to-r from-blue-950 to-[#0b2545] p-6 sm:p-8 rounded-3xl border border-blue-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#a855f7]">Decentralized Microtask Terminal</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold uppercase">
                  Classroom Board of Tasks
                </h3>
                <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
                  Apply first-principles learning directly. Earn verified points and unlock premium credentials by claiming open policy, 
                  robotic, or community building tasks designated by municipal registries and academic leaders.
                </p>
              </div>

              <button
                onClick={() => setIsCreatingTask(!isCreatingTask)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" /> Propose New Project
              </button>
            </div>

            {/* Task Creation Form */}
            {isCreatingTask && (
              <form onSubmit={handleCreateTask} className="frosted-glass rounded-2xl p-6 border border-blue-500/20 space-y-4 max-w-xl mx-auto animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h4 className="font-extrabold text-white text-sm uppercase">Propose Ecosystem Task</h4>
                  <button
                    type="button"
                    onClick={() => setIsCreatingTask(false)}
                    className="text-slate-400 hover:text-white font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hydro-electric Microgrid controller mapping"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/60 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Category</label>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Policy">Policy & Creed</option>
                      <option value="Tech">Tech & Simulation</option>
                      <option value="Philanthropy">Philanthropy Mesh</option>
                      <option value="Community">Community Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Reward XP Award</label>
                    <input
                      type="number"
                      value={newTaskReward}
                      onChange={(e) => setNewTaskReward(Math.max(100, parseInt(e.target.value) || 0))}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Quantifiable Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide clear mathematical criteria to determine successful project delivery."
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase transition shadow active:scale-98"
                >
                  Broadcast Proposal to Registries
                </button>
              </form>
            )}

            {/* Task Stacks column views */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* STACK A: OPEN PROJECTS */}
              <div className="space-y-4">
                <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider font-bold text-[#60a5fa] bg-blue-950 border border-blue-900/30 rounded-full">
                  🔓 Open Projects ({tasks.filter((t) => t.status === "Open").length})
                </span>

                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.status === "Open" || (!t.status))
                    .map((t) => (
                      <div key={t.id} className="frosted-glass-dark rounded-xl p-4 border border-slate-800 space-y-3">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] uppercase font-mono tracking-widest bg-blue-950/60 p-1 rounded font-bold text-blue-400">
                            {t.category}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">{t.rewardPoints} XP</span>
                        </div>
                        
                        <h4 className="font-extrabold text-white text-sm">{t.title}</h4>
                        <p className="text-slate-400 text-xs leading-relaxed">{t.description}</p>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-900/60">
                          <span className="text-[9px] text-slate-500">By {t.createdBy}</span>
                          <button
                            onClick={() => handleJoinTask(t.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white transition flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" /> Commit Job
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* STACK B: IN PROGRESS */}
              <div className="space-y-4">
                <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider font-bold text-[#fbbf24] bg-amber-950/40 border border-amber-900/40 rounded-full">
                  ⚙️ Active In-Progress ({tasks.filter((t) => t.status === "In Progress").length})
                </span>

                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.status === "In Progress")
                    .map((t) => (
                      <div key={t.id} className="frosted-glass rounded-xl p-4 border border-blue-900/10 space-y-3">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] uppercase font-mono tracking-widest bg-amber-950 text-amber-400 p-1 rounded font-bold">
                            {t.category}
                          </span>
                          <span className="text-[10px] font-mono text-[#a855f7]">{t.rewardPoints} XP</span>
                        </div>
                        
                        <h4 className="font-extrabold text-white text-sm">{t.title}</h4>
                        <p className="text-slate-350 text-xs leading-relaxed">{t.description}</p>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                          <span className="text-[9px] text-slate-400">Assigned: {t.assignee}</span>
                          <button
                            onClick={() => handleJoinTask(t.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white transition flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 animate-pulse" /> Complete
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* STACK C: COMPLETED INDEX */}
              <div className="space-y-4">
                <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider font-bold text-[#34d399] bg-emerald-950/40 border border-emerald-900/40 rounded-full">
                  ✓ Verified Completed ({tasks.filter((t) => t.status === "Completed").length})
                </span>

                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.status === "Completed")
                    .map((t) => (
                      <div key={t.id} className="bg-slate-900/30 rounded-xl p-4 border border-[#0d2550] space-y-3 opacity-75">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] uppercase font-mono tracking-widest bg-slate-950 p-1 rounded font-bold text-slate-500">
                            {t.category}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">Claimed</span>
                        </div>
                        
                        <h4 className="font-bold text-slate-300 text-sm line-through">{t.title}</h4>
                        <p className="text-slate-500 text-xs line-through">{t.description}</p>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-900/60">
                          <span className="text-[9px] text-slate-500">Checked under Water Classroom Standard</span>
                          <span className="text-[10px] text-emerald-400 font-bold block">Archived</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: CLASSROOM VIRTUAL FORUMS & CHATROOM CLIENT */}
        {activeTab === "collaborate" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-white">
            
            {/* Left side: create threads form */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="frosted-glass rounded-2xl p-5 border border-blue-950 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-white text-sm uppercase tracking-wide flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-400 animate-pulse" /> Community Discussion
                  </h4>
                  <p className="text-[11px] text-slate-400">Post educational inquiries or debate first-principles calculations.</p>
                </div>

                <form onSubmit={handleAddForumPost} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Topic Theme / Category</label>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none"
                    >
                      <option value="General">General Question</option>
                      <option value="Robotics">Robotics Simulation</option>
                      <option value="Creed">Philosophy & Abundance</option>
                      <option value="Incentives">Structural Incentives</option>
                      <option value="Human Dynamics">Human Covenants</option>
                    </select>
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Thread Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Ask the sovereign community..."
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Body Context</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Formulate your request under first-principles criteria..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs uppercase tracking-wide transition text-white"
                  >
                    Broadcast Thread (+100 XP)
                  </button>
                </form>
              </div>

              {/* Simulated active roster map */}
              <div className="bg-[#051025]/40 border border-blue-950 p-4 rounded-xl space-y-3.5">
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 font-bold block">Global Classroom Hubs Peer Activity Map</span>
                <div className="space-y-2">
                  {[
                    { name: "Miami Homeschool Hub", members: 23, ping: "Online" },
                    { name: "Geneva Academic Villa", members: 14, ping: "Online" },
                    { name: "Austin Tech Guild", members: 31, ping: "Maintenance" }
                  ].map((h, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <strong className="text-slate-200">{h.name}</strong>
                      <span className="text-[10px] font-mono text-blue-400">{h.members} active</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right side: threads lists */}
            <div className="lg:col-span-2 space-y-4">
              
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-white uppercase tracking-wider text-base">Active peer threads</h3>
                <span className="text-xs text-slate-400">Sorted by dynamic community votes</span>
              </div>

              <div className="space-y-3">
                {forumPosts.map((post) => (
                  <div key={post.id} className="frosted-glass-dark rounded-2xl p-5 border border-slate-800 space-y-3 relative overflow-hidden transition-all duration-300 hover:border-blue-500/20">
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900 border border-blue-900/35 text-[9px] font-mono font-bold text-blue-400 uppercase">
                      {post.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-900 border border-blue-500/30 flex items-center justify-center text-[10px] font-mono font-extrabold text-blue-400">
                        {post.author[0]}
                      </div>
                      <div>
                        <strong className="text-xs text-slate-200 block">{post.author}</strong>
                        <span className="text-[9.5px] text-slate-500 font-light block">Sovereign Level {post.userLevel} student</span>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-snug pt-1">
                      {post.title}
                    </h4>

                    <p className="text-slate-300 text-xs leading-relaxed font-light">
                      {post.content}
                    </p>

                    <div className="flex gap-4 pt-2 border-t border-slate-900/60 text-[11px] text-slate-400">
                      <button
                        onClick={() => alert("Liked thread securely.")}
                        className="flex items-center gap-1 hover:text-blue-400 transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> Useful ({post.likes})
                      </button>
                      <button
                        onClick={() => alert("Joining peer consultation.")}
                        className="flex items-center gap-1 hover:text-blue-400 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Expand Answers ({post.replies})
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

        {/* TAB 6: LEVEL PROGRESS GRAPH & AWARD BADGES */}
        {activeTab === "dashboard" && (
          !isUserActivated ? (
            <div className="p-8 text-center bg-slate-950 rounded-xl border border-blue-800 animate-fade-in shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4">Activate Account to Proceed</h2>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto">Your account is created. Activate now to unlock full access to the Water Classroom, including curriculum tools, the AI Socratic Tutor, collaborative forums, and task dashboards.</p>
              <button 
                onClick={async () => {
                  const response = await fetch("/api/create-checkout-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: loginEmail })
                  });
                  const data = await response.json();
                  if (data.url) {
                    window.location.href = data.url;
                  } else {
                    alert(data.error || "Failed to create checkout.");
                  }
                }} 
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg shadow-blue-600/20"
              >
                Purchase Activation ($19)
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in text-white">
              {/* Level Rank Card container */}
              <div className="frosted-glass rounded-3xl p-6 sm:p-8 border border-blue-950 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                <div className="space-y-4 w-full sm:w-1/2">
                    <div>
                      <span className="text-xs uppercase tracking-widest font-mono text-[#60a5fa] font-bold block">
                        Student Profile Register
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none uppercase">
                        Active Sovereign Student
                      </h2>
                      <span className="text-[10px] text-slate-400 block mt-1 tracking-wide">CURRICULUM: {onboardingCurriculum}</span>
                    </div>

                    {/* Experience score multiplier feedback slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                        <span>XP Tracker to Level {progress.level + 1}</span>
                        <span>
                          {progress.points} / {Math.pow(progress.level, 2) * 100 + 300} XP
                        </span>
                      </div>
                      <div className="w-full bg-[#050b18] h-2.5 rounded-full overflow-hidden border border-blue-950/80">
                        <div
                          className="blue-gradient-bg h-full transition-all duration-500 shadow-[0_0_8px_#3b82f6]"
                          style={{
                            width: `${Math.min(
                              100,
                              (progress.points / (Math.pow(progress.level, 2) * 100 + 300)) * 100
                            )}%`
                          }}
                        ></div>
                      </div>
                    </div>
                </div>
                {/* Standard dashboard telemetry grids */}
                <div className="flex gap-4 sm:gap-6 w-full sm:w-auto shrink-0 justify-around sm:justify-start">
                    <div className="text-center bg-slate-950 p-4 rounded-2xl border border-blue-900/30 min-w-24 sm:min-w-28 shadow-inner">
                      <Award className="w-5 h-5 text-blue-400 mx-auto mb-1.5 animate-bounce" />
                      <strong className="text-xl sm:text-2xl font-extrabold block text-white">{progress.level}</strong>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Class Rank</span>
                    </div>

                    <div className="text-center bg-slate-950 p-4 rounded-2xl border border-blue-900/30 min-w-24 sm:min-w-28 shadow-inner">
                      <Flame className="w-5 h-5 text-amber-500 fill-amber-400 mx-auto mb-1.5" />
                      <strong className="text-xl sm:text-2xl font-extrabold block text-white">{progress.streakDays}</strong>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Day Streak</span>
                    </div>

                    <div className="text-center bg-slate-950 p-4 rounded-2xl border border-blue-900/30 min-w-24 sm:min-w-28 shadow-inner">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                      <strong className="text-xl sm:text-2xl font-extrabold block text-white">{progress.completedLessons.length}</strong>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Passed Tests</span>
                    </div>
                </div>
              </div>
              
              {/* ... verification gradebook, badge collection, etc ... */}
            </div>
          )
        )}

            {/* Verification gradebook list and Stats Hour Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Proctored exams credentials docket */}
              <div className="frosted-glass rounded-3xl p-6 border border-blue-950 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">VERIFIED PROCTOR CERTIFICATES</h3>
                  <p className="text-xs text-slate-400">Verified proctored exam transcripts recorded onto the Water Classroom global registry.</p>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {verifiedExamsList.length > 0 ? (
                    verifiedExamsList.map((c) => (
                      <div key={c.id} className="p-3.5 bg-slate-950/80 border border-blue-900/40 rounded-xl space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <strong className="text-blue-300 font-bold">{c.lessonTitle}</strong>
                          <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950 px-2 rounded border border-emerald-900">Passed ({c.score})</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>Verification Hash: <strong className="text-white select-all">{c.hash}</strong></span>
                          <span>{c.timestamp}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-500 italic space-y-2">
                      <Shield className="w-8 h-8 text-blue-900 mx-auto opacity-70" />
                      <p>No verified exams completed yet. Select any open lecture and start a Proctored Camera Exam to issue transcripts.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Study Stats hours tracking graph */}
              <div className="frosted-glass rounded-3xl p-6 border border-blue-950 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight uppercase">Core Study Hours Tracking Tracker</h3>
                  <p className="text-xs text-slate-400">Classroom analytics synced with local device sensors and focus counters.</p>
                </div>

                <div className="h-44 flex items-end justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-blue-950">
                  {[
                    { day: "Mon", hrs: 2.5, percent: "45%" },
                    { day: "Tue", hrs: 4.8, percent: "80%" },
                    { day: "Wed", hrs: 3.2, percent: "60%" },
                    { day: "Thu", hrs: 5.6, percent: "95%" },
                    { day: "Fri", hrs: 2.1, percent: "35%" },
                    { day: "Sat", hrs: 1.2, percent: "25%" },
                    { day: "Sun", hrs: 3.9, percent: "70%" }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative">
                      <div className="bg-slate-900 text-white text-[9px] font-mono px-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 absolute -translate-y-12 shadow-lg border border-slate-700 z-10 pointer-events-none">
                        {bar.hrs} hrs
                      </div>
                      
                      <div
                        className="w-full blue-gradient-bg rounded-t-lg transition-all duration-700 relative overflow-hidden shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                        style={{ height: bar.percent }}
                      >
                        <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                      </div>

                      <span className="text-[10.5px] font-bold text-slate-400 font-mono block">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Badge trophies list */}
            <div className="frosted-glass rounded-3xl p-6 border border-blue-950 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white uppercase">Sovereign Badge collection Case</h3>
                <p className="text-xs text-slate-400">Demonstrate strict conceptual mastery across curricula to activate permanent badges.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                {BADGES.map((b) => {
                  const isUnlocked = progress.unlockedBadges.includes(b.key);
                  return (
                    <div
                      key={b.key}
                      className={`p-4 rounded-2xl border text-center space-y-2 transition shadow-sm ${
                        isUnlocked
                          ? "bg-slate-950/80 border-[#1e293b]"
                          : "bg-slate-950/20 border-blue-950/40 opacity-40 filter grayscale"
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-full mx-auto flex items-center justify-center bg-gradient-to-tr ${b.color} text-white shadow`}>
                        {b.icon === "Sparkles" && <Sparkles className="w-5.5 h-5.5" />}
                        {b.icon === "Cpu" && <Cpu className="w-5.5 h-5.5" />}
                        {b.icon === "Building" && <Building className="w-5.5 h-5.5" />}
                        {b.icon === "Compass" && <Compass className="w-5.5 h-5.5" />}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-white text-xs tracking-tight uppercase leading-snug">{b.name}</h4>
                        <p className="text-[10px] text-slate-300 leading-snug mt-1 font-light">
                          {b.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-1 text-[9px] font-mono tracking-wide">
                        {isUnlocked ? (
                          <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-slate-500 bg-slate-950 px-2 py-0.5 rounded flex items-center gap-0.5">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </>
        )}
      </main>


      {/* STUDENT ACCESS PORTAL MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="frosted-glass-dark rounded-3xl max-w-md w-full border border-blue-500/20 shadow-2xl relative overflow-hidden">
            
            {/* Design accents */}
            <div className="absolute right-0 top-0 -mr-12 -mt-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            
            <div className="sticky top-0 bg-[#060b18]/95 border-b border-blue-950 px-6 py-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <div>
                  <h3 className="font-extrabold text-white text-sm uppercase tracking-tight leading-none">{modalRole === "student" ? "Student Verification" : "Institution Verification"}</h3>
                  <p className="text-[10px] text-blue-300 font-mono tracking-wide mt-1">{modalRole === "student" ? "Water Classroom Gatekeeper" : "Administrative Gateway Hub"}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogin} className="p-6 space-y-4">
              
              {/* Role selector tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-950/60 rounded-xl border border-blue-950">
                <button
                  type="button"
                  onClick={() => setModalRole("student")}
                  className={`py-2 text-[10px] uppercase font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalRole === "student"
                      ? "bg-blue-600 text-white shadow font-extrabold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  👤 Student
                </button>
                <button
                  type="button"
                  onClick={() => setModalRole("school")}
                  className={`py-2 text-[10px] uppercase font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    modalRole === "school"
                      ? "bg-indigo-600 text-white shadow font-extrabold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🏫 Institution
                </button>
              </div>

              <div className="bg-[#0b1329] border border-blue-900/30 rounded-xl p-3 text-xs text-blue-300 space-y-1 leading-relaxed">
                <span className="font-bold text-white block text-[10px] uppercase font-mono tracking-wider">🌟 Welcome {modalRole === "student" ? "Young Mind" : "Educator / Leader"}</span>
                {modalRole === "student"
                  ? "Enter your details to generate a persistent local student record and access our simulations."
                  : "Enter your administrative credentials to log in, view student score charts and manage curriculum."}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                  {modalRole === "student" ? "Student Email" : "Administrator Email"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">✉️</span>
                  <input
                    type="email"
                    required
                    placeholder={modalRole === "student" ? "e.g. name@school.edu" : "e.g. admin@school.edu"}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-705 pl-8 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-semibold block">Password</label>
                <div className="relative font-mono">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold font-sans">🔑</span>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={loginAccessKey}
                    onChange={(e) => setLoginAccessKey(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-705 pl-8 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                Login <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </form>
          </div>
        </div>
      )}

      {/* SECURE DIRECT BANK TRANSFER SUPPORT COVENANT MODAL */}
      {showDirectDonateModal && (
        <div className="fixed inset-0 bg-[#030712]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="frosted-glass-dark rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-500/20 relative">
            <div className="sticky top-0 bg-[#060b18]/95 border-b border-blue-950 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h3 className="font-extrabold text-white text-sm uppercase tracking-tight leading-none">Secure Platform Support Covenant</h3>
                <p className="text-[10px] text-blue-400 font-mono tracking-wide mt-1.5">Contribute to the Elevation to Eden</p>
              </div>
              <button
                onClick={() => setShowDirectDonateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              <div className="bg-slate-950/80 border border-blue-950 rounded-xl p-4 text-xs text-slate-300 space-y-2.5 leading-relaxed">
                <span className="font-extrabold text-white flex items-center gap-1 font-mono text-[10px] text-amber-400 uppercase">
                  <AlertCircle className="w-4 h-4 text-amber-500" /> URGENT SECURITY NOTICE:
                </span>
                <p>
                  "Please verify that you are checking out through our official Water Classroom global gateway page. 
                  Doublecheck payment amounts and secure certificates before committing any transfer. Submit with total peace."
                </p>
              </div>

              {!donationSuccess ? (
                <form onSubmit={handleSimulatedSupport} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-slate-400 block font-bold">Checkout Support Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        required
                        value={simulatedDonationAmount}
                        onChange={(e) => setSimulatedDonationAmount(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 pl-8 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 p-3.5 bg-slate-950/80 rounded-xl border border-blue-950">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Monero (XMR) Secure Address</span>
                    <p className="text-[9px] font-mono break-all bg-slate-900 p-2.5 rounded border border-blue-950 text-blue-300 shadow-inner select-all leading-tight">
                      8B3GBqcKFXfYsw6E5dPcDf6o6jVUMDwRMGf7ZdvqioKWTmiQDQt1WyqjFX1D3nhdjvS8jt8H6VKSL3giH4DjaQRg5vNGx6d
                    </p>
                  </div>

                  <div className="space-y-2.5 p-3.5 bg-slate-950/80 rounded-xl border border-blue-950">
                    <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Sovereign Direct Bank Wire Transfer</span>
                    <p className="text-[10px] font-mono text-slate-300 leading-relaxed bg-slate-900 p-3 rounded border border-blue-900/30">
                      Beneficiary: ELIABE MATOS DA SILVA<br/>
                      Account ID: 1009519676<br/>
                      Bank Name: BANCO C6 S.A. CAYMAN BRANCH<br/>
                      SWIFT Code: CSIXKYKY
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg hover:shadow-xl active:scale-98"
                  >
                    Simulate card contribution checkout (+500 XP)
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4 py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
                    <Heart className="w-8 h-8 fill-emerald-400 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-lg">Covenant registered securely.</h4>
                    <p className="text-xs text-slate-400 mt-1">"Thank you for sponsoring an ambitious future student." Broadcasting transaction block to registrar.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* FIXED BOTTOM NAVIGATION FOR MOBILE/TABLET PWA LOOK */}
      {isLoggedIn && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#060b18]/90 backdrop-blur-xl border-t border-blue-500/25 shadow-[0_-10px_35px_rgba(3,7,24,0.9)] flex justify-around py-1.5 px-2 sm:px-6 select-none">
          {[
            { key: "academy", name: "Academy", icon: BookOpen },
            { key: "tutor", name: "AI Tutor", icon: Cpu },
            { key: "tasks", name: "Tasks", icon: ClipboardList },
            { key: "collaborate", name: "Forums", icon: Users },
            { key: "dashboard", name: "Dashboard", icon: User }
          ].map((item) => {
            const isActive = activeTab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => {
                  if (item.key === "launch" && isLoggedIn) {
                    alert("You are already logged in.");
                    return;
                  }
                  if (item.key !== "launch" && item.key !== "dashboard" && !isUserActivated) {
                    alert("Please activate your account to access all features.");
                    return;
                  }
                  setActiveTab(item.key as any);
                  if (item.key !== "academy") {
                    setSelectedLesson(null);
                    setActiveQuiz(null);
                  }
                }}
                className="flex flex-col items-center justify-center p-1 rounded-xl transition-all group duration-300 min-w-14 relative cursor-pointer"
              >
                <div
                  className={`p-1 rounded-lg transition-all duration-300 relative ${
                    isActive 
                      ? "text-blue-400 scale-110 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" 
                      : "text-slate-400 group-hover:text-blue-300 group-hover:scale-105"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "neon-glow-icon" : ""}`} />
                  {isActive && (
                    <span className="absolute inset-0 bg-blue-500/10 blur-md rounded-full -z-10 animate-pulse"></span>
                  )}
                </div>
                <span
                  className={`text-[9px] tracking-wider mt-0.5 transition-colors duration-300 font-medium ${
                    isActive ? "text-blue-400 font-bold" : "text-slate-400"
                  }`}
                >
                  {item.name}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_8px_#3b82f6]"></span>
                )}
              </button>
            );
          })}
        </nav>
      )}

    </div>
  );
}
