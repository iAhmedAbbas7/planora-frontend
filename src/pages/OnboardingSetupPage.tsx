// <== IMPORTS ==>
import {
  Rocket,
  GitBranch,
  FolderGit2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  Github,
  Plus,
  Sparkles,
  Zap,
  Shield,
  Code2,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "../lib/toast";
import useTitle from "../hooks/useTitle";
import { useGitHubStatus } from "../hooks/useGitHub";
import { useState, JSX, useEffect, useRef } from "react";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";
import { useCompleteOnboarding } from "../hooks/useOnboarding";
import { useNavigate, useSearchParams } from "react-router-dom";

// <== STEP TYPE ==>
type Step = "welcome" | "github" | "complete";

// <== STEP CONFIG ==>
const STEPS_CONFIG = [
  // WELCOME STEP
  {
    key: "welcome" as Step,
    label: "Welcome",
    description: "Get started",
    icon: Rocket,
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-500",
    glowColor: "shadow-violet-500/50",
  },
  // GITHUB STEP
  {
    key: "github" as Step,
    label: "Connect GitHub",
    description: "Link your repos",
    icon: Github,
    color: "from-slate-600 to-slate-800",
    bgColor: "bg-slate-700",
    glowColor: "shadow-slate-500/50",
  },
  // COMPLETE STEP
  {
    key: "complete" as Step,
    label: "Done",
    description: "Ready to go",
    icon: Check,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500",
    glowColor: "shadow-emerald-500/50",
  },
];

// <== FEATURE CARDS CONFIG ==>
const FEATURES = [
  // GITHUB INTEGRATION FEATURE
  {
    icon: GitBranch,
    title: "GitHub Integration",
    description: "Connect your repos and manage code directly",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "group-hover:border-blue-500/50",
  },
  // PROJECT MANAGEMENT FEATURE
  {
    icon: FolderGit2,
    title: "Project Management",
    description: "Organize tasks, track progress, and collaborate",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "group-hover:border-purple-500/50",
  },
  // AI-POWERED FEATURES FEATURE
  {
    icon: Sparkles,
    title: "AI-Powered Features",
    description: "Get smart suggestions and automate workflows",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "group-hover:border-amber-500/50",
  },
  // FOCUS MODE FEATURE
  {
    icon: Zap,
    title: "Focus Mode",
    description: "Deep work sessions with Pomodoro timer",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "group-hover:border-emerald-500/50",
  },
];

// <== GITHUB BENEFITS ==>
const GITHUB_BENEFITS = [
  // AI-POWERED CODE REVIEWS FEATURE
  { icon: Code2, text: "AI-powered code reviews" },
  // BRANCH & PR MANAGEMENT FEATURE
  { icon: GitBranch, text: "Branch & PR management" },
  // SECURE OAUTH CONNECTION FEATURE
  { icon: Shield, text: "Secure OAuth connection" },
];

// <== ONBOARDING SETUP PAGE COMPONENT ==>
const OnboardingSetupPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Setup");
  // NAVIGATION
  const navigate = useNavigate();
  // SEARCH PARAMS
  const [searchParams, setSearchParams] = useSearchParams();
  // REF TO TRACK IF CALLBACK HAS BEEN HANDLED (PREVENT DUPLICATE TOASTS)
  const callbackHandledRef = useRef(false);
  // HEADER SCROLL STATE
  const [isScrolled, setIsScrolled] = useState(false);
  // CURRENT STEP STATE
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  // ANIMATION STATE
  const [isTransitioning, setIsTransitioning] = useState(false);
  // COMPLETE ONBOARDING MUTATION
  const { mutate: completeOnboarding, isPending: isCompleting } =
    useCompleteOnboarding();
  // GITHUB STATUS
  const { status: githubStatus, isLoading: isLoadingGitHub, refetchStatus } = useGitHubStatus();
  // CHECK IF GITHUB IS CONNECTED
  const isGitHubConnected = githubStatus?.isConnected ?? false;
  // GET CURRENT STEP INDEX
  const currentStepIndex = STEPS_CONFIG.findIndex((s) => s.key === currentStep);
  // HANDLE SCROLL FOR HEADER EFFECT
  useEffect(() => {
    // HANDLE SCROLL FOR HEADER EFFECT
    const handleScroll = () => {
      // SET IS SCROLLED STATE
      setIsScrolled(window.scrollY > 10);
    };
    // ADD SCROLL EVENT LISTENER
    window.addEventListener("scroll", handleScroll);
    // REMOVE SCROLL EVENT LISTENER
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // HANDLE GITHUB CALLBACK SUCCESS/ERROR FROM URL PARAMS
  useEffect(() => {
    // PREVENT DUPLICATE HANDLING (REACT STRICT MODE RUNS EFFECTS TWICE)
    if (callbackHandledRef.current) return;
    // GET GITHUB SUCCESS AND ERROR FROM URL PARAMS
    const githubSuccess = searchParams.get("github_success");
    // GET GITHUB ERROR FROM URL PARAMS
    const githubError = searchParams.get("github_error");
    // IF GITHUB SUCCESS IS TRUE
    if (githubSuccess === "true") {
      // MARK AS HANDLED IMMEDIATELY
      callbackHandledRef.current = true;
      // CLEAR URL PARAMS FIRST TO PREVENT RE-TRIGGER
      setSearchParams({}, { replace: true });
      // GITHUB CONNECTED SUCCESSFULLY - SHOW TOAST AND REFETCH STATUS
      toast.success("GitHub connected successfully! 🎉");
      // REFETCH GITHUB STATUS
      refetchStatus();
      // GO TO GITHUB STEP TO SHOW SUCCESS
      setCurrentStep("github");
    } else if (githubError) {
      // MARK AS HANDLED IMMEDIATELY
      callbackHandledRef.current = true;
      // CLEAR URL PARAMS FIRST TO PREVENT RE-TRIGGER
      setSearchParams({}, { replace: true });
      // GITHUB CONNECTION FAILED - SHOW ERROR TOAST
      const errorMessages: Record<string, string> = {
        invalid_code: "GitHub authentication failed. Please try again.",
        invalid_state: "Session expired. Please try connecting again.",
        token_error: "Failed to get access token from GitHub.",
        no_token: "GitHub did not provide an access token.",
        user_not_found: "User session not found. Please log in again.",
        account_linked: "This GitHub account is already linked to another user.",
        callback_error: "An error occurred during GitHub connection.",
      };
      toast.error(errorMessages[githubError] || "Failed to connect GitHub. Please try again.");
      // STAY ON GITHUB STEP
      setCurrentStep("github");
    }
  }, [searchParams, setSearchParams, refetchStatus]);
  // HANDLE STEP TRANSITION WITH ANIMATION
  const transitionToStep = (newStep: Step) => {
    // SET IS TRANSITIONING STATE
    setIsTransitioning(true);
    // SET CURRENT STEP
    setTimeout(() => {
      // SET CURRENT STEP
      setCurrentStep(newStep);
      // SET IS TRANSITIONING STATE
      setIsTransitioning(false);
    }, 150);
  };
  // HANDLE NEXT STEP
  const handleNextStep = () => {
    // IF CURRENT STEP IS WELCOME
    if (currentStep === "welcome") {
      // TRANSITION TO GITHUB STEP
      transitionToStep("github");
    // IF CURRENT STEP IS GITHUB
    } else if (currentStep === "github") {
      // TRANSITION TO COMPLETE STEP
      transitionToStep("complete");
    }
  };
  // HANDLE PREVIOUS STEP
  const handlePrevStep = () => {
    // IF CURRENT STEP IS GITHUB
    if (currentStep === "github") {
      // TRANSITION TO WELCOME STEP
      transitionToStep("welcome");
    // IF CURRENT STEP IS COMPLETE
    } else if (currentStep === "complete") {
      // TRANSITION TO GITHUB STEP
      transitionToStep("github");
    }
  };
  // HANDLE COMPLETE ONBOARDING
  const handleComplete = () => {
    // COMPLETE ONBOARDING
    completeOnboarding(undefined, {
      // ON SUCCESS
      onSuccess: () => {
        // SHOW SUCCESS TOAST
        toast.success("Welcome to PlanOra! 🎉");
        // NAVIGATE TO DASHBOARD
        navigate("/dashboard");
      },
    });
  };
  // HANDLE CONNECT GITHUB
  const handleConnectGitHub = () => {
    // GET BACKEND URL
    const backendUrl =
      import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1";
    // USE THE CORRECT ENDPOINT FOR LINKING (NOT SIGNUP/LOGIN)
    window.location.href = `${backendUrl}/auth/github/link?redirect=/onboarding/setup`;
  };
  // HANDLE SKIP TO DASHBOARD
  const handleSkipToDashboard = () => {
    // COMPLETE ONBOARDING
    completeOnboarding(undefined, {
      // ON SUCCESS
      onSuccess: () => {
        // NAVIGATE TO DASHBOARD
        navigate("/dashboard");
      },
    });
  };
  // HANDLE STEP CLICK (ALLOW GOING TO PREVIOUS STEPS)
  const handleStepClick = (stepKey: Step, stepIndex: number) => {
    // IF STEP INDEX IS LESS THAN CURRENT STEP INDEX
    if (stepIndex < currentStepIndex) {
      // TRANSITION TO STEP
      transitionToStep(stepKey);
    }
  };
  // RETURN COMPONENT
  return (
    <div className="min-h-screen bg-[var(--bg)] overflow-hidden">
      {/* ANIMATED BACKGROUND FOR THE PAGE */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--accent-color)]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[var(--accent-color)]/3 to-transparent rounded-full blur-3xl" />
      </div>
      {/* FIXED INTERACTIVE HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[var(--bg)]/95 backdrop-blur-xl shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* LEFT: LOGO AND BRANDING */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <img
                  src={PURPLE_LOGO}
                  alt="PlanOra"
                  className="h-8 sm:h-9"
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl font-semibold text-[#562aae]">
                  PlanOra
                </span>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-5 w-px bg-[var(--border)]" />
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Setup Wizard
                  </span>
                </div>
              </div>
            </div>
            {/* RIGHT: PROGRESS INDICATOR AND SKIP */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* STEP INDICATOR (MOBILE) */}
              <div className="flex sm:hidden items-center gap-1.5">
                {STEPS_CONFIG.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index < currentStepIndex
                        ? "bg-emerald-500"
                        : index === currentStepIndex
                          ? "bg-[var(--accent-color)] scale-125"
                          : "bg-[var(--border)]"
                    }`}
                  />
                ))}
              </div>
              {/* STEP COUNTER (DESKTOP) */}
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-[var(--light-text)]">Step</span>
                <span className="font-semibold text-[var(--accent-color)]">
                  {currentStepIndex + 1}
                </span>
                <span className="text-[var(--light-text)]">of {STEPS_CONFIG.length}</span>
              </div>
              {/* DIVIDER */}
              <div className="hidden sm:block h-5 w-px bg-[var(--border)]" />
              {/* SKIP BUTTON */}
              <button
                onClick={handleSkipToDashboard}
                disabled={isCompleting}
                className="group flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--cards-bg)] border border-transparent hover:border-[var(--border)] transition-all duration-200 disabled:opacity-50"
              >
                {isCompleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Skip setup</span>
                    <span className="sm:hidden">Skip</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* SPACER FOR FIXED HEADER */}
      <div className="h-16 sm:h-18" />
      {/* ENHANCED PROGRESS STEPPER */}
      <div className="relative py-8 px-6 sm:px-8">
        <div className="max-w-3xl mx-auto">
          {/* STEPS */}
          <div className="relative flex items-start justify-between">
            {/* PROGRESS BAR - POSITIONED BEHIND STEP CIRCLES */}
            <div className="absolute top-7 sm:top-8 left-0 right-0 flex items-center justify-center pointer-events-none">
              <div className="w-full max-w-[calc(100%-7rem)] sm:max-w-[calc(100%-9rem)] mx-auto">
                <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden">
                  {/* ANIMATED PROGRESS FILL */}
                  <div
                    className="h-full bg-gradient-to-r from-[var(--accent-color)] via-purple-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStepIndex / (STEPS_CONFIG.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            {STEPS_CONFIG.map((step, index) => {
              // GET STEP ICON
              const StepIcon = step.icon;
              // GET IS COMPLETED
              const isCompleted = index < currentStepIndex;
              // GET IS CURRENT
              const isCurrent = index === currentStepIndex;
              // GET IS CLICKABLE
              const isClickable = index < currentStepIndex;
              // RETURN STEP COMPONENT
              return (
                <div
                  key={step.key}
                  className={`flex flex-col items-center relative z-10 ${isClickable ? "cursor-pointer" : ""}`}
                  onClick={() => handleStepClick(step.key, index)}
                >
                  {/* STEP INDICATOR */}
                  <div className="relative">
                    {/* BACKGROUND MASK TO HIDE PROGRESS LINE */}
                    <div className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[var(--bg)] scale-125" />

                    {/* GLOW EFFECT FOR CURRENT STEP */}
                    {isCurrent && (
                      <div className={`absolute inset-0 rounded-full ${step.bgColor} blur-xl opacity-40 animate-pulse scale-150`} />
                    )}

                    {/* RING ANIMATION FOR CURRENT STEP */}
                    {isCurrent && (
                      <div className="absolute -inset-2 rounded-full border-2 border-[var(--accent-color)]/30 animate-ping" />
                    )}

                    {/* STEP CIRCLE */}
                    <div
                      className={`
                        relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
                        transition-all duration-500 ease-out transform
                        ${isCompleted
                          ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 scale-100"
                          : isCurrent
                            ? `bg-gradient-to-br ${step.color} shadow-lg ${step.glowColor} scale-110`
                            : "bg-[var(--bg)] border-2 border-[var(--border)] scale-95 opacity-60"
                        }
                        ${isClickable ? "hover:scale-105 hover:opacity-100" : ""}
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={3} />
                      ) : (
                        <StepIcon
                          className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                            isCurrent ? "text-white" : "text-[var(--light-text)]"
                          }`}
                        />
                      )}
                    </div>
                    {/* CHECKMARK BADGE FOR COMPLETED */}
                    {isCompleted && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-[var(--bg)] flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 text-emerald-500" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  {/* STEP LABEL */}
                  <div className="mt-4 text-center">
                    <p
                      className={`font-semibold text-sm sm:text-base transition-colors ${
                        isCurrent
                          ? "text-[var(--text-primary)]"
                          : isCompleted
                            ? "text-emerald-500"
                            : "text-[var(--light-text)]"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-xs sm:text-sm mt-0.5 transition-colors ${
                        isCurrent || isCompleted
                          ? "text-[var(--light-text)]"
                          : "text-[var(--light-text)]/50"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* MAIN CONTENT */}
      <main className="relative py-8 sm:py-12 px-6 sm:px-8">
        <div
          className={`max-w-2xl mx-auto transition-all duration-300 ${
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
        >
          {/* WELCOME STEP */}
          {currentStep === "welcome" && (
            <div className="text-center">
              {/* ANIMATED ICON */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-purple-600 blur-xl opacity-30 animate-pulse" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[var(--accent-color)] to-purple-600 flex items-center justify-center shadow-xl shadow-[var(--accent-color)]/30">
                  <Rocket className="w-12 h-12 text-white animate-bounce" style={{ animationDuration: "2s" }} />
                </div>
              </div>
              {/* WELCOME TITLE */}
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-[var(--accent-color)] to-purple-600 bg-clip-text text-transparent">
                  PlanOra
                </span>
                !
              </h1>
              {/* WELCOME DESCRIPTION */}
              <p className="text-lg text-[var(--light-text)] mb-10 max-w-lg mx-auto">
                Let's get you set up in just a few steps. We'll help you connect your tools and supercharge your workflow.
              </p>
              {/* FEATURE CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {FEATURES.map((feature, index) => {
                  // GET FEATURE ICON
                  const FeatureIcon = feature.icon;
                  // RETURN FEATURE CARD
                  return (
                    <div
                      key={index}
                      className={`group p-5 rounded-2xl bg-[var(--cards-bg)] border border-[var(--border)] ${feature.borderColor} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left cursor-default`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <FeatureIcon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[var(--light-text)]">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* CTA BUTTON */}
              <button
                onClick={handleNextStep}
                className="group px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-[var(--accent-color)] to-purple-600 text-white transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent-color)]/30 hover:scale-105 flex items-center gap-3 mx-auto"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
          {/* GITHUB STEP */}
          {currentStep === "github" && (
            <div className="text-center">
              {/* GITHUB ICON */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-slate-600 blur-xl opacity-20 dark:opacity-40 animate-pulse" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center shadow-xl">
                  <Github className="w-12 h-12 text-white" />
                </div>
              </div>
              {/* GITHUB TITLE */}
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                Connect{" "}
                <span className="bg-gradient-to-r from-slate-600 to-slate-800 dark:from-slate-400 dark:to-slate-200 bg-clip-text text-transparent">
                  GitHub
                </span>
              </h1>
              {/* GITHUB DESCRIPTION */}
              <p className="text-lg text-[var(--light-text)] mb-8 max-w-lg mx-auto">
                Link your GitHub account to unlock powerful developer features and seamless code integration.
              </p>
              {/* BENEFITS LIST */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {GITHUB_BENEFITS.map((benefit, index) => {
                  // GET BENEFIT ICON
                  const BenefitIcon = benefit.icon;
                  // RETURN BENEFIT CARD
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--cards-bg)] border border-[var(--border)] text-sm"
                    >
                      <BenefitIcon className="w-4 h-4 text-[var(--accent-color)]" />
                      <span className="text-[var(--text-primary)]">{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
              {/* GITHUB LOADING STATE */}
              {isLoadingGitHub ? (
                <div className="flex items-center justify-center py-8">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 text-[var(--accent-color)] animate-spin" />
                    <div className="absolute inset-0 rounded-full bg-[var(--accent-color)] blur-xl opacity-20 animate-pulse" />
                  </div>
                </div>
              ) : isGitHubConnected ? (
                <div className="mb-8">
                  <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">GitHub Connected</p>
                      <p className="text-sm text-[var(--light-text)]">Your account is linked successfully</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <button
                    onClick={handleConnectGitHub}
                    className="group px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 text-white transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/20 hover:scale-105 flex items-center gap-3 mx-auto"
                  >
                    <Github className="w-6 h-6" />
                    Connect GitHub
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-sm text-[var(--light-text)] mt-4">
                    Secure OAuth connection • We only request necessary permissions
                  </p>
                </div>
              )}
              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3 rounded-xl font-medium text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all flex items-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-xl font-medium bg-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] text-white transition-all flex items-center gap-2 group hover:shadow-lg hover:shadow-[var(--accent-color)]/30"
                >
                  {isGitHubConnected ? "Continue" : "Skip for now"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}
          {/* COMPLETE STEP */}
          {currentStep === "complete" && (
            <div className="text-center">
              {/* SUCCESS ANIMATION */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-emerald-500 blur-xl opacity-30 animate-pulse" />
                <div className="absolute -inset-4 rounded-full border-2 border-emerald-500/30 animate-ping" style={{ animationDuration: "2s" }} />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
              </div>
              {/* COMPLETE TITLE */}
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
                You're{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                  All Set
                </span>
                ! 🎉
              </h1>
              {/* COMPLETE DESCRIPTION */}
              <p className="text-lg text-[var(--light-text)] mb-10 max-w-lg mx-auto">
                Your workspace is ready. Start building something amazing or explore what PlanOra has to offer.
              </p>
              {/* QUICK ACTION CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-lg mx-auto">
                <button
                  onClick={() => {
                    completeOnboarding(undefined, {
                      onSuccess: () => navigate("/projects"),
                    });
                  }}
                  disabled={isCompleting}
                  className="group p-6 rounded-2xl bg-[var(--cards-bg)] border border-[var(--border)] hover:border-[var(--accent-color)]/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left disabled:opacity-50"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-color)]/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[var(--accent-color)]/20 transition-all">
                    <Plus className="w-6 h-6 text-[var(--accent-color)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                    Create Project
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    Start your first project now
                  </p>
                </button>
                {/* GO TO DASHBOARD BUTTON */}
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="group p-6 rounded-2xl bg-[var(--cards-bg)] border border-[var(--border)] hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left disabled:opacity-50"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                    <LayoutDashboard className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                    Go to Dashboard
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    Explore your workspace
                  </p>
                </button>
              </div>
              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3 rounded-xl font-medium text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all flex items-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="group px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-emerald-500 to-green-600 text-white transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Finishing...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OnboardingSetupPage;
