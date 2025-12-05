// <== IMPORTS ==>
import {
  X,
  Sparkles,
  Code,
  FileCode,
  Shield,
  Zap,
  ChevronDown,
  Check,
  Loader2,
  AlertCircle,
  Lightbulb,
  Package,
  Layers,
} from "lucide-react";
import {
  useExplainCode,
  CodeExplanationType,
  GeneralCodeExplanation,
  LineByLineExplanation,
  FunctionExplanation,
  SecurityExplanation,
  PerformanceExplanation,
} from "../../hooks/useAI";
import { toast } from "@/lib/toast";
import { useState, JSX, useRef, useEffect } from "react";

// <== EXPLANATION TYPE OPTIONS ==>
const explanationTypes: {
  // <== VALUE ==>
  value: CodeExplanationType;
  // <== LABEL ==>
  label: string;
  // <== DESCRIPTION ==>
  description: string;
  // <== ICON ==>
  icon: typeof Code;
}[] = [
  {
    value: "general",
    label: "General",
    description: "Overview of the code",
    icon: Code,
  },
  {
    value: "line-by-line",
    label: "Line by Line",
    description: "Detailed explanation",
    icon: FileCode,
  },
  {
    value: "function",
    label: "Functions",
    description: "Analyze functions",
    icon: Layers,
  },
  {
    value: "security",
    label: "Security",
    description: "Security analysis",
    icon: Shield,
  },
  {
    value: "performance",
    label: "Performance",
    description: "Performance tips",
    icon: Zap,
  },
];

// <== GENERAL EXPLANATION VIEW ==>
const GeneralExplanationView = ({
  explanation,
}: {
  explanation: GeneralCodeExplanation;
}): JSX.Element => (
  <div className="space-y-4">
    {/* SUMMARY */}
    <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
      <h4 className="text-xs font-medium text-[var(--accent-color)] mb-1">
        Summary
      </h4>
      <p className="text-sm text-[var(--text-primary)]">
        {explanation.summary}
      </p>
    </div>
    {/* PURPOSE */}
    <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
      <h4 className="text-xs font-medium text-[var(--accent-color)] mb-1">
        Purpose
      </h4>
      <p className="text-sm text-[var(--text-primary)]">
        {explanation.purpose}
      </p>
    </div>
    {/* COMPLEXITY */}
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--light-text)]">Complexity:</span>
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          explanation.complexity === "low"
            ? "bg-green-500/15 text-green-500"
            : explanation.complexity === "medium"
            ? "bg-yellow-500/15 text-yellow-500"
            : "bg-red-500/15 text-red-500"
        }`}
      >
        {explanation.complexity}
      </span>
    </div>
    {/* KEY COMPONENTS */}
    {explanation.keyComponents?.length > 0 && (
      <div>
        <h4 className="text-xs font-medium text-[var(--text-primary)] mb-2 flex items-center gap-1">
          <Package size={12} className="text-[var(--accent-color)]" />
          Key Components
        </h4>
        <div className="space-y-2">
          {explanation.keyComponents.map((comp, idx) => (
            <div
              key={idx}
              className="p-2 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {comp.name}
                </span>
                <span className="text-[10px] text-[var(--light-text)]">
                  {comp.lineRange}
                </span>
              </div>
              <p className="text-xs text-[var(--light-text)]">
                {comp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}
    {/* DEPENDENCIES */}
    {explanation.dependencies && explanation.dependencies.length > 0 && (
      <div>
        <h4 className="text-xs font-medium text-[var(--text-primary)] mb-2">
          Dependencies
        </h4>
        <div className="flex flex-wrap gap-1">
          {explanation.dependencies.map((dep, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 rounded-full bg-[var(--inside-card-bg)] text-[var(--light-text)]"
            >
              {dep}
            </span>
          ))}
        </div>
      </div>
    )}
    {/* SUGGESTIONS */}
    {explanation.suggestions && explanation.suggestions.length > 0 && (
      <div>
        <h4 className="text-xs font-medium text-[var(--text-primary)] mb-2 flex items-center gap-1">
          <Lightbulb size={12} className="text-yellow-500" />
          Suggestions
        </h4>
        <ul className="space-y-1">
          {explanation.suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="text-xs text-[var(--light-text)] flex items-start gap-2"
            >
              <span className="text-[var(--accent-color)]">•</span>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// <== LINE BY LINE EXPLANATION VIEW ==>
const LineByLineExplanationView = ({
  explanation,
}: {
  explanation: LineByLineExplanation;
}): JSX.Element => (
  <div className="space-y-4">
    {/* SUMMARY */}
    <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
      <p className="text-sm text-[var(--text-primary)]">
        {explanation.summary}
      </p>
    </div>
    {/* LINE EXPLANATIONS */}
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {explanation.explanations.map((item, idx) => (
        <div
          key={idx}
          className="p-2 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono bg-[var(--accent-color)]/15 text-[var(--accent-color)] px-1.5 py-0.5 rounded">
              L{item.lineNumber}
            </span>
            <code className="text-xs text-[var(--light-text)] truncate flex-1">
              {item.code}
            </code>
          </div>
          <p className="text-xs text-[var(--text-primary)]">
            {item.explanation}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// <== FUNCTION EXPLANATION VIEW ==>
const FunctionExplanationView = ({
  explanation,
}: {
  explanation: FunctionExplanation;
}): JSX.Element => (
  <div className="space-y-4">
    {/* FUNCTIONS */}
    <div className="space-y-3 max-h-[400px] overflow-y-auto">
      {explanation.functions.map((func, idx) => (
        <div
          key={idx}
          className="p-3 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--accent-color)]">
              {func.name}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                func.complexity === "low"
                  ? "bg-green-500/15 text-green-500"
                  : func.complexity === "medium"
                  ? "bg-yellow-500/15 text-yellow-500"
                  : "bg-red-500/15 text-red-500"
              }`}
            >
              {func.complexity}
            </span>
          </div>
          <p className="text-xs text-[var(--text-primary)] mb-2">
            {func.purpose}
          </p>
          {/* PARAMETERS */}
          {func.parameters.length > 0 && (
            <div className="mb-2">
              <span className="text-[10px] text-[var(--light-text)]">
                Parameters:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {func.parameters.map((param, pIdx) => (
                  <span
                    key={pIdx}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--hover-bg)] text-[var(--text-primary)]"
                    title={param.description}
                  >
                    {param.name}: {param.type}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* RETURN TYPE */}
          <div className="text-[10px] text-[var(--light-text)]">
            Returns:{" "}
            <span className="text-[var(--text-primary)]">
              {func.returnType}
            </span>
          </div>
        </div>
      ))}
    </div>
    {/* RELATIONSHIPS */}
    {explanation.relationships && (
      <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
        <h4 className="text-xs font-medium text-[var(--text-primary)] mb-1">
          Relationships
        </h4>
        <p className="text-xs text-[var(--light-text)]">
          {explanation.relationships}
        </p>
      </div>
    )}
  </div>
);

// <== SECURITY EXPLANATION VIEW ==>
const SecurityExplanationView = ({
  explanation,
}: {
  explanation: SecurityExplanation;
}): JSX.Element => (
  <div className="space-y-4">
    {/* SECURITY LEVEL */}
    <div className="flex items-center gap-2">
      <Shield
        size={16}
        className={
          explanation.securityLevel === "low"
            ? "text-green-500"
            : explanation.securityLevel === "medium"
            ? "text-yellow-500"
            : explanation.securityLevel === "high"
            ? "text-orange-500"
            : "text-red-500"
        }
      />
      <span className="text-sm font-medium text-[var(--text-primary)]">
        Security Level:{" "}
        <span
          className={
            explanation.securityLevel === "low"
              ? "text-green-500"
              : explanation.securityLevel === "medium"
              ? "text-yellow-500"
              : explanation.securityLevel === "high"
              ? "text-orange-500"
              : "text-red-500"
          }
        >
          {explanation.securityLevel.toUpperCase()}
        </span>
      </span>
    </div>
    {/* ISSUES */}
    {explanation.issues.length > 0 && (
      <div>
        <h4 className="text-xs font-medium text-red-500 mb-2 flex items-center gap-1">
          <AlertCircle size={12} />
          Security Issues ({explanation.issues.length})
        </h4>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {explanation.issues.map((issue, idx) => (
            <div
              key={idx}
              className="p-2 bg-red-500/5 rounded-lg border border-red-500/20"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {issue.type}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    issue.severity === "low"
                      ? "bg-green-500/15 text-green-500"
                      : issue.severity === "medium"
                      ? "bg-yellow-500/15 text-yellow-500"
                      : issue.severity === "high"
                      ? "bg-orange-500/15 text-orange-500"
                      : "bg-red-500/15 text-red-500"
                  }`}
                >
                  {issue.severity}
                </span>
              </div>
              <p className="text-xs text-[var(--light-text)] mb-1">
                {issue.description}
              </p>
              <p className="text-xs text-[var(--accent-color)]">
                💡 {issue.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}
    {/* GOOD PRACTICES */}
    {explanation.goodPractices.length > 0 && (
      <div>
        <h4 className="text-xs font-medium text-green-500 mb-2">
          ✓ Good Practices
        </h4>
        <ul className="space-y-1">
          {explanation.goodPractices.map((practice, idx) => (
            <li
              key={idx}
              className="text-xs text-[var(--light-text)] flex items-start gap-2"
            >
              <Check
                size={10}
                className="text-green-500 mt-0.5 flex-shrink-0"
              />
              {practice}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// <== PERFORMANCE EXPLANATION VIEW ==>
const PerformanceExplanationView = ({
  explanation,
}: {
  explanation: PerformanceExplanation;
}): JSX.Element => (
  <div className="space-y-4">
    {/* PERFORMANCE RATING */}
    <div className="flex items-center gap-2">
      <Zap
        size={16}
        className={
          explanation.performanceRating === "excellent"
            ? "text-green-500"
            : explanation.performanceRating === "good"
            ? "text-blue-500"
            : explanation.performanceRating === "fair"
            ? "text-yellow-500"
            : "text-red-500"
        }
      />
      <span className="text-sm font-medium text-[var(--text-primary)]">
        Performance:{" "}
        <span
          className={
            explanation.performanceRating === "excellent"
              ? "text-green-500"
              : explanation.performanceRating === "good"
              ? "text-blue-500"
              : explanation.performanceRating === "fair"
              ? "text-yellow-500"
              : "text-red-500"
          }
        >
          {explanation.performanceRating.toUpperCase()}
        </span>
      </span>
    </div>
    {/* BIG O */}
    {explanation.bigO && (
      <div className="p-2 bg-[var(--inside-card-bg)] rounded-lg">
        <span className="text-xs text-[var(--light-text)]">
          Time Complexity:{" "}
        </span>
        <code className="text-xs text-[var(--accent-color)]">
          {explanation.bigO}
        </code>
      </div>
    )}
    {/* ISSUES */}
    {explanation.issues.length > 0 && (
      <div>
        <h4 className="text-xs font-medium text-orange-500 mb-2">
          Performance Issues
        </h4>
        <div className="space-y-2 max-h-[150px] overflow-y-auto">
          {explanation.issues.map((issue, idx) => (
            <div
              key={idx}
              className="p-2 bg-orange-500/5 rounded-lg border border-orange-500/20"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {issue.type}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    issue.severity === "low"
                      ? "bg-green-500/15 text-green-500"
                      : issue.severity === "medium"
                      ? "bg-yellow-500/15 text-yellow-500"
                      : "bg-red-500/15 text-red-500"
                  }`}
                >
                  {issue.severity}
                </span>
              </div>
              <p className="text-xs text-[var(--light-text)]">
                {issue.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}
    {/* OPTIMIZATIONS */}
    {explanation.optimizations.length > 0 && (
      <div>
        <h4 className="text-xs font-medium text-[var(--accent-color)] mb-2">
          Suggested Optimizations
        </h4>
        <div className="space-y-2">
          {explanation.optimizations.map((opt, idx) => (
            <div
              key={idx}
              className="p-2 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]"
            >
              <div className="text-xs font-medium text-[var(--text-primary)] mb-1">
                {opt.title}
              </div>
              <p className="text-xs text-[var(--light-text)]">
                {opt.description}
              </p>
              <p className="text-[10px] text-[var(--accent-color)] mt-1">
                Impact: {opt.impact}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// <== AI EXPLAINER PANEL PROPS ==>
type AIExplainerPanelProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== CODE ==>
  code: string;
  // <== LANGUAGE ==>
  language?: string;
  // <== FILE NAME ==>
  fileName?: string;
};

// <== AI EXPLAINER PANEL COMPONENT ==>
const AIExplainerPanel = ({
  isOpen,
  onClose,
  code,
  language,
  fileName,
}: AIExplainerPanelProps): JSX.Element | null => {
  // SELECTED TYPE STATE
  const [selectedType, setSelectedType] =
    useState<CodeExplanationType>("general");
  // DROPDOWN OPEN STATE
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // DROPDOWN REF
  const dropdownRef = useRef<HTMLDivElement>(null);
  // EXPLAIN CODE MUTATION
  const explainMutation = useExplainCode();
  // HANDLE OUTSIDE CLICK
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK IF CLICK IS OUTSIDE DROPDOWN
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // CLOSE DROPDOWN
        setIsDropdownOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // REMOVE EVENT LISTENER ON CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // PREVENT BODY SCROLL
  useEffect(() => {
    // CHECK IF PANEL IS OPEN
    if (isOpen) {
      // PREVENT BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // ENABLE BODY SCROLL
      document.body.style.overflow = "";
    }
    // CLEANUP
    return () => {
      // ENABLE BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // HANDLE EXPLAIN
  const handleExplain = () => {
    // CHECK IF CODE IS EMPTY
    if (!code.trim()) {
      // SHOW ERROR TOAST
      toast.error("No code to explain");
      // RETURN
      return;
    }
    // EXPLAIN CODE
    explainMutation.mutate({
      code,
      language,
      fileName,
      explainType: selectedType,
    });
  };
  // GET CURRENT TYPE
  const currentType = explanationTypes.find((t) => t.value === selectedType)!;
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN PANEL
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Sparkles size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                AI Code Explainer
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                {fileName || "Analyze code with AI"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* TYPE SELECTOR */}
          <div className="flex items-center gap-3 mb-4">
            {/* DROPDOWN */}
            <div ref={dropdownRef} className="relative flex-1">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--inside-card-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <currentType.icon
                    size={16}
                    className="text-[var(--accent-color)]"
                  />
                  <span>{currentType.label}</span>
                  <span className="text-xs text-[var(--light-text)]">
                    - {currentType.description}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-10 py-1">
                  {explanationTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => {
                          setSelectedType(type.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                          selectedType === type.value
                            ? "text-[var(--accent-color)]"
                            : "text-[var(--text-primary)]"
                        }`}
                      >
                        <Icon
                          size={14}
                          className={
                            selectedType === type.value
                              ? "text-[var(--accent-color)]"
                              : "text-[var(--light-text)]"
                          }
                        />
                        <div className="flex-1 text-left">
                          <p className="font-medium">{type.label}</p>
                          <p className="text-xs text-[var(--light-text)]">
                            {type.description}
                          </p>
                        </div>
                        {selectedType === type.value && (
                          <Check
                            size={14}
                            className="text-[var(--accent-color)]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {/* EXPLAIN BUTTON */}
            <button
              onClick={handleExplain}
              disabled={explainMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50"
            >
              {explainMutation.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Explain
                </>
              )}
            </button>
          </div>
          {/* RESULTS */}
          {explainMutation.isError && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
              <AlertCircle size={24} className="mx-auto text-red-500 mb-2" />
              <p className="text-sm text-red-500">Failed to analyze code</p>
              <p className="text-xs text-[var(--light-text)] mt-1">
                Please try again later
              </p>
            </div>
          )}
          {explainMutation.data && (
            <div className="mt-4">
              {/* RENDER BASED ON TYPE */}
              {explainMutation.data.type === "general" && (
                <GeneralExplanationView
                  explanation={
                    explainMutation.data.explanation as GeneralCodeExplanation
                  }
                />
              )}
              {explainMutation.data.type === "line-by-line" && (
                <LineByLineExplanationView
                  explanation={
                    explainMutation.data.explanation as LineByLineExplanation
                  }
                />
              )}
              {explainMutation.data.type === "function" && (
                <FunctionExplanationView
                  explanation={
                    explainMutation.data.explanation as FunctionExplanation
                  }
                />
              )}
              {explainMutation.data.type === "security" && (
                <SecurityExplanationView
                  explanation={
                    explainMutation.data.explanation as SecurityExplanation
                  }
                />
              )}
              {explainMutation.data.type === "performance" && (
                <PerformanceExplanationView
                  explanation={
                    explainMutation.data.explanation as PerformanceExplanation
                  }
                />
              )}
              {/* RAW EXPLANATION FALLBACK */}
              {"rawExplanation" in explainMutation.data.explanation && (
                <div className="p-3 bg-[var(--inside-card-bg)] rounded-lg">
                  <pre className="text-xs text-[var(--text-primary)] whitespace-pre-wrap">
                    {
                      (
                        explainMutation.data.explanation as {
                          rawExplanation: string;
                        }
                      ).rawExplanation
                    }
                  </pre>
                </div>
              )}
            </div>
          )}
          {/* EMPTY STATE */}
          {!explainMutation.data &&
            !explainMutation.isPending &&
            !explainMutation.isError && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                  }}
                >
                  <Sparkles size={24} className="text-[var(--accent-color)]" />
                </div>
                <p className="text-sm text-[var(--text-primary)] mb-1">
                  Ready to analyze
                </p>
                <p className="text-xs text-[var(--light-text)] max-w-xs">
                  Select an analysis type and click "Explain" to get AI-powered
                  insights about this code.
                </p>
              </div>
            )}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-1 text-xs text-[var(--light-text)]">
            <Sparkles size={12} className="text-[var(--accent-color)]" />
            Powered by Gemini AI
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIExplainerPanel;
