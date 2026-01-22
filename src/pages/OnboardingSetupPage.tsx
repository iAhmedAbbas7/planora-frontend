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
} from "lucide-react";
import { toast } from "../lib/toast";
import { useState, JSX } from "react";
import useTitle from "../hooks/useTitle";
import { useNavigate } from "react-router-dom";
import { useGitHubStatus } from "../hooks/useGitHub";
import PURPLE_LOGO from "../assets/images/LOGO-PURPLE.png";
import { useCompleteOnboarding } from "../hooks/useOnboarding";

// <== STEP TYPE ==>
type Step = "welcome" | "github" | "complete";

// <== ONBOARDING SETUP PAGE COMPONENT ==>
const OnboardingSetupPage = (): JSX.Element => {
  // SET PAGE TITLE
  useTitle("PlanOra - Setup");
  // NAVIGATION
  const navigate = useNavigate();
  // CURRENT STEP STATE
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  // COMPLETE ONBOARDING MUTATION
  const { mutate: completeOnboarding, isPending: isCompleting } =
    useCompleteOnboarding();
  // GITHUB STATUS
  const { status: githubStatus, isLoading: isLoadingGitHub } = useGitHubStatus();
  // CHECK IF GITHUB IS CONNECTED
  const isGitHubConnected = githubStatus?.isConnected ?? false;
  // HANDLE NEXT STEP
  const handleNextStep = () => {
    // IF WELCOME STEP, GO TO GITHUB STEP
    if (currentStep === "welcome") {
      // SET CURRENT STEP TO GITHUB STEP
      setCurrentStep("github");
    } else if (currentStep === "github") {
      // IF GITHUB STEP, GO TO COMPLETE STEP
      setCurrentStep("complete");
    }
  };
  // HANDLE PREVIOUS STEP
  const handlePrevStep = () => {
    // IF GITHUB STEP, GO TO WELCOME STEP
      if (currentStep === "github") {
        // SET CURRENT STEP TO WELCOME STEP
      setCurrentStep("welcome");
    } else if (currentStep === "complete") {
      // IF COMPLETE STEP, GO TO GITHUB STEP
      setCurrentStep("github");
    }
  };
  // HANDLE COMPLETE ONBOARDING
  const handleComplete = () => {
    // COMPLETE ONBOARDING
    completeOnboarding(undefined, {
      // ON SUCCESS, SHOW SUCCESS TOAST AND NAVIGATE TO DASHBOARD
      onSuccess: () => {
        // SHOW SUCCESS TOAST AND NAVIGATE TO DASHBOARD
        toast.success("Welcome to PlanOra! 🎉");
        // NAVIGATE TO DASHBOARD
        navigate("/dashboard");
      },
    });
  };
  // HANDLE CONNECT GITHUB
  const handleConnectGitHub = () => {
    // BUILD BACKEND URL
    const backendUrl =
      import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1";
    // REDIRECT TO GITHUB OAUTH URL
    window.location.href = `${backendUrl}/auth/github?mode=link&redirect=/onboarding/setup`;
  };
  // HANDLE SKIP TO DASHBOARD
  const handleSkipToDashboard = () => {
    // COMPLETE ONBOARDING
    completeOnboarding(undefined, {
      // ON SUCCESS, NAVIGATE TO DASHBOARD
      onSuccess: () => {
        // NAVIGATE TO DASHBOARD
        navigate("/dashboard");
      },
    });
  };
  // STEP INDICATOR
  const steps: { key: Step; label: string }[] = [
    { key: "welcome", label: "Welcome" },
    { key: "github", label: "Connect GitHub" },
    { key: "complete", label: "Done" },
  ];
  // GET CURRENT STEP INDEX
  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
  // RETURN COMPONENT
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* HEADER */}
      <header className="py-6 px-8 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <img src={PURPLE_LOGO} alt="PlanOra" className="h-8" />
          <button
            onClick={handleSkipToDashboard}
            disabled={isCompleting}
            className="text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition"
          >
            Skip setup
          </button>
        </div>
      </header>
      {/* PROGRESS BAR */}
      <div className="py-6 px-8 border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    index < currentStepIndex
                      ? "bg-green-500 text-white"
                      : index === currentStepIndex
                        ? "bg-[var(--accent-color)] text-white"
                        : "bg-[var(--inside-card-bg)] text-[var(--light-text)]"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-2 text-sm hidden sm:block ${
                    index === currentStepIndex
                      ? "text-[var(--text-primary)] font-medium"
                      : "text-[var(--light-text)]"
                  }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-0.5 mx-4 ${
                      index < currentStepIndex
                        ? "bg-green-500"
                        : "bg-[var(--border)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* MAIN CONTENT */}
      <main className="py-12 px-8">
        <div className="max-w-2xl mx-auto">
          {/* WELCOME STEP */}
          {currentStep === "welcome" && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center">
                <Rocket className="w-10 h-10 text-[var(--accent-color)]" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                Welcome to PlanOra!
              </h1>
              <p className="text-lg text-[var(--light-text)] mb-8 max-w-md mx-auto">
                Let's get you set up in just a few steps. We'll help you connect
                your tools and create your first project.
              </p>
              {/* FEATURES LIST */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-[var(--cards-bg)] border border-[var(--border)] text-left">
                  <GitBranch className="w-6 h-6 text-[var(--accent-color)] mb-2" />
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">
                    GitHub Integration
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    Connect your repos and manage code directly
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--cards-bg)] border border-[var(--border)] text-left">
                  <FolderGit2 className="w-6 h-6 text-[var(--accent-color)] mb-2" />
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">
                    Project Management
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    Organize tasks, track progress, and collaborate
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--cards-bg)] border border-[var(--border)] text-left">
                  <Sparkles className="w-6 h-6 text-[var(--accent-color)] mb-2" />
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">
                    AI-Powered Features
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    Get smart suggestions and automate workflows
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--cards-bg)] border border-[var(--border)] text-left">
                  <Rocket className="w-6 h-6 text-[var(--accent-color)] mb-2" />
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">
                    Focus Mode
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    Deep work sessions with Pomodoro timer
                  </p>
                </div>
              </div>
              <button
                onClick={handleNextStep}
                className="px-8 py-3 rounded-xl font-medium bg-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] text-white transition-all flex items-center gap-2 mx-auto"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
          {/* GITHUB STEP */}
          {currentStep === "github" && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#24292e]/10 dark:bg-white/10 flex items-center justify-center">
                <Github className="w-10 h-10 text-[#24292e] dark:text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                Connect GitHub
              </h1>
              <p className="text-lg text-[var(--light-text)] mb-8 max-w-md mx-auto">
                Link your GitHub account to access repositories, manage code,
                and enable AI-powered code reviews.
              </p>
              {isLoadingGitHub ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-[var(--accent-color)] animate-spin" />
                </div>
              ) : isGitHubConnected ? (
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 text-green-500 border border-green-500/30">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">GitHub Connected</span>
                  </div>
                  <p className="text-sm text-[var(--light-text)] mt-3">
                    Your GitHub account is already connected. You're all set!
                  </p>
                </div>
              ) : (
                <div className="mb-8">
                  <button
                    onClick={handleConnectGitHub}
                    className="px-8 py-3 rounded-xl font-medium bg-[#24292e] hover:bg-[#1a1e22] text-white transition-all flex items-center gap-2 mx-auto"
                  >
                    <Github className="w-5 h-5" />
                    Connect GitHub
                  </button>
                  <p className="text-sm text-[var(--light-text)] mt-3">
                    We'll request access to your repositories
                  </p>
                </div>
              )}
              {/* NAVIGATION BUTTONS */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-2.5 rounded-xl font-medium text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl font-medium bg-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] text-white transition-all flex items-center gap-2"
                >
                  {isGitHubConnected ? "Continue" : "Skip for now"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {/* COMPLETE STEP */}
          {currentStep === "complete" && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                You're All Set!
              </h1>
              <p className="text-lg text-[var(--light-text)] mb-8 max-w-md mx-auto">
                Your workspace is ready. Start by creating your first project or
                exploring the dashboard.
              </p>
              {/* QUICK ACTIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                <button
                  onClick={() => {
                    // COMPLETE ONBOARDING
                    completeOnboarding(undefined, {
                      // ON SUCCESS, NAVIGATE TO PROJECTS
                      onSuccess: () => navigate("/projects"),
                    });
                  }}
                  disabled={isCompleting}
                  className="p-4 rounded-xl bg-[var(--cards-bg)] border border-[var(--border)] hover:border-[var(--accent-color)] transition-all text-left group"
                >
                  <Plus className="w-6 h-6 text-[var(--accent-color)] mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-[var(--text-primary)]">
                    Create Project
                  </h3>
                  <p className="text-sm text-[var(--light-text)]">
                    Start your first project
                  </p>
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="p-4 rounded-xl bg-[var(--cards-bg)] border border-[var(--border)] hover:border-[var(--accent-color)] transition-all text-left group"
                >
                  <Rocket className="w-6 h-6 text-[var(--accent-color)] mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-[var(--text-primary)]">
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
                  className="px-6 py-2.5 rounded-xl font-medium text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="px-8 py-3 rounded-xl font-medium bg-[var(--accent-color)] hover:bg-[var(--accent-btn-hover-color)] text-white transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isCompleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Finishing...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-5 h-5" />
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
