// <== IMPORTS ==>
import {
  Sparkles,
  FileText,
  GitCommit,
  Lightbulb,
  X,
  Loader2,
  AlertCircle,
  ChevronRight,
  Flag,
  Save,
  RefreshCw,
  CheckSquare,
  Square,
} from "lucide-react";
import { JSX, useState, useCallback } from "react";
import {
  useAIStatus,
  useGenerateTasksFromReadme,
  useGenerateTasksFromCommits,
  useSuggestNextTasks,
  useSaveGeneratedTasks,
  GeneratedTask,
} from "../../hooks/useAI";
import { GitHubRepoLink } from "../../hooks/useProjects";

// <== PROPS TYPE ==>
type AITaskGeneratorProps = {
  // <== PROJECT ID ==>
  projectId: string;
  // <== GITHUB REPO ==>
  githubRepo?: GitHubRepoLink;
  // <== ON CLOSE ==>
  onClose: () => void;
};
// <== GENERATION SOURCE TYPE ==>
type GenerationSource = "readme" | "commits" | "suggestions" | null;

// <== PRIORITY COLORS ==>
const priorityColors: Record<string, { bg: string; text: string }> = {
  // <== LOW PRIORITY ==>
  low: {
    bg: "color-mix(in srgb, #22c55e 15%, var(--cards-bg))",
    text: "var(--accent-green-500)",
  },
  // <== MEDIUM PRIORITY ==>
  medium: {
    bg: "color-mix(in srgb, #eab308 15%, var(--cards-bg))",
    text: "#eab308",
  },
  // <== HIGH PRIORITY ==>
  high: {
    bg: "color-mix(in srgb, #ef4444 15%, var(--cards-bg))",
    text: "#ef4444",
  },
};

// <== GENERATION OPTION CARD ==>
const GenerationOptionCard = ({
  icon: Icon,
  title,
  description,
  onClick,
  disabled,
  isLoading,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}): JSX.Element => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className="w-full flex items-start gap-3 p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg hover:border-[var(--accent-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-left group"
  >
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--accent-color) 15%, var(--cards-bg))",
      }}
    >
      {isLoading ? (
        <Loader2
          size={20}
          className="text-[var(--accent-color)] animate-spin"
        />
      ) : (
        <Icon size={20} className="text-[var(--accent-color)]" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">
          {title}
        </h3>
        <ChevronRight
          size={16}
          className="text-[var(--light-text)] group-hover:text-[var(--accent-color)] transition"
        />
      </div>
      <p className="text-xs text-[var(--light-text)] mt-1">{description}</p>
    </div>
  </button>
);

// <== TASK ITEM COMPONENT ==>
const TaskItem = ({
  task,
  isSelected,
  onToggle,
}: {
  task: GeneratedTask;
  isSelected: boolean;
  onToggle: () => void;
}): JSX.Element => (
  <div
    onClick={onToggle}
    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
      isSelected
        ? "bg-[color-mix(in_srgb,var(--accent-color)_10%,var(--cards-bg))] border-[var(--accent-color)]"
        : "bg-[var(--cards-bg)] border-[var(--border)] hover:border-[var(--accent-color)]"
    }`}
  >
    {/* CHECKBOX */}
    <div className="flex-shrink-0 mt-0.5">
      {isSelected ? (
        <CheckSquare size={18} className="text-[var(--accent-color)]" />
      ) : (
        <Square size={18} className="text-[var(--light-text)]" />
      )}
    </div>
    {/* CONTENT */}
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-2">
          {task.title}
        </p>
        {/* PRIORITY BADGE */}
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium flex-shrink-0"
          style={{
            backgroundColor: priorityColors[task.priority]?.bg,
            color: priorityColors[task.priority]?.text,
          }}
        >
          <Flag size={10} />
          {task.priority.toUpperCase()}
        </span>
      </div>
      {task.description && (
        <p className="text-xs text-[var(--light-text)] mt-1 line-clamp-2">
          {task.description}
        </p>
      )}
    </div>
  </div>
);

// <== LOADING SKELETON ==>
const TasksSkeleton = (): JSX.Element => (
  <div className="space-y-3">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg animate-pulse"
      >
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-[var(--inside-card-bg)] rounded" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="h-4 w-3/4 bg-[var(--inside-card-bg)] rounded" />
              <div className="h-4 w-12 bg-[var(--inside-card-bg)] rounded" />
            </div>
            <div className="h-3 w-full bg-[var(--inside-card-bg)] rounded mt-2" />
            <div className="h-3 w-2/3 bg-[var(--inside-card-bg)] rounded mt-1" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// <== AI TASK GENERATOR COMPONENT ==>
export const AITaskGenerator = ({
  projectId,
  githubRepo,
  onClose,
}: AITaskGeneratorProps): JSX.Element => {
  // AI STATUS
  const { status: aiStatus, isLoading: isAIStatusLoading } = useAIStatus();
  // GENERATED TASKS STATE
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  // SELECTED TASKS STATE
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  // CURRENT SOURCE STATE
  const [currentSource, setCurrentSource] = useState<GenerationSource>(null);
  // GENERATE TASKS FROM README MUTATION
  const readmeMutation = useGenerateTasksFromReadme();
  // GENERATE TASKS FROM COMMITS MUTATION
  const commitsMutation = useGenerateTasksFromCommits();
  // SUGGEST NEXT TASKS MUTATION
  const suggestionsMutation = useSuggestNextTasks();
  // SAVE GENERATED TASKS MUTATION
  const saveMutation = useSaveGeneratedTasks();
  // IS GENERATING
  const isGenerating =
    readmeMutation.isPending ||
    commitsMutation.isPending ||
    suggestionsMutation.isPending;
  // HAS GITHUB REPO LINKED
  const hasGitHubRepo = !!githubRepo?.fullName;
  // HANDLE GENERATE FROM README
  const handleGenerateFromReadme = useCallback(() => {
    // IF NO GITHUB REPO LINKED, RETURN
    if (!githubRepo) return;
    // SET CURRENT SOURCE TO README
    setCurrentSource("readme");
    // GENERATE TASKS FROM README MUTATION
    readmeMutation.mutate(
      { owner: githubRepo.owner, repo: githubRepo.name },
      {
        // ON SUCCESS
        onSuccess: (data) => {
          // SET GENERATED TASKS
          setGeneratedTasks(data.tasks);
          // SET SELECTED TASKS
          setSelectedTasks(new Set(data.tasks.map((_, i) => i)));
        },
      }
    );
  }, [githubRepo, readmeMutation]);
  // HANDLE GENERATE FROM COMMITS
  const handleGenerateFromCommits = useCallback(() => {
    // IF NO GITHUB REPO LINKED, RETURN
    if (!githubRepo) return;
    // SET CURRENT SOURCE TO COMMITS
    setCurrentSource("commits");
    commitsMutation.mutate(
      { owner: githubRepo.owner, repo: githubRepo.name },
      {
        // ON SUCCESS
        onSuccess: (data) => {
          // SET GENERATED TASKS
          setGeneratedTasks(data.tasks);
          // SET SELECTED TASKS
          setSelectedTasks(new Set(data.tasks.map((_, i) => i)));
        },
      }
    );
  }, [githubRepo, commitsMutation]);
  // HANDLE GET SUGGESTIONS
  const handleGetSuggestions = useCallback(() => {
    // SET CURRENT SOURCE TO SUGGESTIONS
    setCurrentSource("suggestions");
    // SUGGEST NEXT TASKS MUTATION
    suggestionsMutation.mutate(projectId, {
      // ON SUCCESS
      onSuccess: (data) => {
        // SET GENERATED TASKS
        setGeneratedTasks(data.tasks);
        // SET SELECTED TASKS
        setSelectedTasks(new Set(data.tasks.map((_, i) => i)));
      },
    });
  }, [projectId, suggestionsMutation]);
  // HANDLE TOGGLE TASK
  const handleToggleTask = useCallback((index: number) => {
    // SET SELECTED TASKS
    setSelectedTasks((prev) => {
      // CREATE NEW SET
      const newSet = new Set(prev);
      // IF TASK IS ALREADY SELECTED, DELETE IT
      if (newSet.has(index)) {
        // DELETE TASK
        newSet.delete(index);
      } else {
        // ADD TASK
        newSet.add(index);
      }
      // RETURN NEW SET
      return newSet;
    });
  }, []);
  // HANDLE SELECT ALL
  const handleSelectAll = useCallback(() => {
    // SET SELECTED TASKS
    setSelectedTasks(new Set(generatedTasks.map((_, i) => i)));
  }, [generatedTasks]);
  // HANDLE DESELECT ALL
  const handleDeselectAll = useCallback(() => {
    // SET SELECTED TASKS
    setSelectedTasks(new Set());
  }, []);
  // HANDLE SAVE TASKS
  const handleSaveTasks = useCallback(() => {
    // GET TASKS TO SAVE
    const tasksToSave = generatedTasks.filter((_, i) => selectedTasks.has(i));
    // IF NO TASKS TO SAVE, RETURN
    if (tasksToSave.length === 0) return;
    // SAVE GENERATED TASKS MUTATION
    saveMutation.mutate(
      { projectId, tasks: tasksToSave },
      {
        // ON SUCCESS
        onSuccess: () => {
          // CLOSE MODAL
          onClose();
        },
      }
    );
  }, [generatedTasks, selectedTasks, projectId, saveMutation, onClose]);
  // HANDLE BACK TO OPTIONS
  const handleBackToOptions = useCallback(() => {
    // SET GENERATED TASKS
    setGeneratedTasks([]);
    // SET SELECTED TASKS
    setSelectedTasks(new Set());
    // SET CURRENT SOURCE TO NULL
    setCurrentSource(null);
  }, []);
  // LOADING STATE
  if (isAIStatusLoading) {
    return (
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--inside-card-bg)] rounded-lg animate-pulse" />
            <div className="space-y-1">
              <div className="h-5 w-32 bg-[var(--inside-card-bg)] rounded animate-pulse" />
              <div className="h-3 w-48 bg-[var(--inside-card-bg)] rounded animate-pulse" />
            </div>
          </div>
        </header>
        <div className="flex-1 p-4">
          <TasksSkeleton />
        </div>
      </div>
    );
  }
  // AI NOT CONFIGURED STATE
  if (!aiStatus?.aiConfigured) {
    return (
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <Sparkles size={24} className="text-[var(--accent-color)]" />
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                AI Task Generator
              </h2>
              <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
                Generate tasks using AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3">
          <div className="w-14 h-14 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center">
            <AlertCircle size={28} className="text-[var(--light-text)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            AI Not Configured
          </p>
          <p className="text-xs text-[var(--light-text)] text-center max-w-[250px]">
            AI task generation requires the Gemini API key to be configured on
            the server.
          </p>
        </div>
      </div>
    );
  }
  // SHOW GENERATED TASKS
  if (generatedTasks.length > 0 || isGenerating) {
    return (
      <div className="flex flex-col h-full">
        {/* HEADER */}
        <header className="flex items-center justify-between p-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToOptions}
              disabled={isGenerating || saveMutation.isPending}
              className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={18} />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                {currentSource === "readme" && "Tasks from README"}
                {currentSource === "commits" && "Tasks from Commits"}
                {currentSource === "suggestions" && "Suggested Tasks"}
              </h2>
              <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
                {isGenerating
                  ? "Generating tasks..."
                  : `${generatedTasks.length} tasks generated`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={saveMutation.isPending}
            className="p-1.5 rounded-full bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={16} />
          </button>
        </header>
        {/* SELECTION CONTROLS */}
        {!isGenerating && generatedTasks.length > 0 && (
          <div className="flex items-center justify-between p-3 border-b border-[var(--border)] bg-[var(--inside-card-bg)]">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="text-xs text-[var(--accent-color)] hover:underline cursor-pointer"
              >
                Select All
              </button>
              <span className="text-[var(--light-text)]">|</span>
              <button
                onClick={handleDeselectAll}
                className="text-xs text-[var(--light-text)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Deselect All
              </button>
            </div>
            <span className="text-xs text-[var(--light-text)]">
              {selectedTasks.size} of {generatedTasks.length} selected
            </span>
          </div>
        )}
        {/* TASKS LIST */}
        <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-2">
          {isGenerating ? (
            <TasksSkeleton />
          ) : generatedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-14 h-14 rounded-full bg-[var(--inside-card-bg)] flex items-center justify-center">
                <AlertCircle size={28} className="text-[var(--light-text)]" />
              </div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                No tasks generated
              </p>
              <p className="text-xs text-[var(--light-text)] text-center">
                Try a different generation method
              </p>
              <button
                onClick={handleBackToOptions}
                className="mt-2 px-3 py-1.5 text-xs text-[var(--accent-color)] hover:underline cursor-pointer"
              >
                Back to options
              </button>
            </div>
          ) : (
            generatedTasks.map((task, index) => (
              <TaskItem
                key={index}
                task={task}
                isSelected={selectedTasks.has(index)}
                onToggle={() => handleToggleTask(index)}
              />
            ))
          )}
        </div>
        {/* FOOTER */}
        {!isGenerating && generatedTasks.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-[var(--border)] bg-[var(--bg)] flex-shrink-0">
            <button
              onClick={handleBackToOptions}
              disabled={saveMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={14} />
              Regenerate
            </button>
            <button
              onClick={handleSaveTasks}
              disabled={selectedTasks.size === 0 || saveMutation.isPending}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save {selectedTasks.size} Tasks
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }
  // SHOW GENERATION OPTIONS
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 border-b border-[var(--border)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <Sparkles size={24} className="text-[var(--accent-color)]" />
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
              AI Task Generator
            </h2>
            <p className="text-[10px] sm:text-xs text-[var(--light-text)]">
              Generate tasks using AI
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
        >
          <X size={16} />
        </button>
      </header>
      {/* OPTIONS */}
      <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-3">
        {/* INFO CARD */}
        <div className="p-3 bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg">
          <div className="flex items-start gap-2">
            <Sparkles
              size={16}
              className="text-[var(--accent-color)] flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-[var(--light-text)]">
              Use AI to automatically generate tasks based on your project's
              GitHub repository or get smart suggestions based on existing
              tasks.
            </p>
          </div>
        </div>
        {/* GENERATION OPTIONS */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-[var(--text-primary)] uppercase tracking-wide">
            From GitHub Repository
          </p>
          {/* README OPTION */}
          <GenerationOptionCard
            icon={FileText}
            title="Generate from README"
            description={
              hasGitHubRepo
                ? "Analyze the README file to create tasks"
                : "Link a GitHub repository first"
            }
            onClick={handleGenerateFromReadme}
            disabled={!hasGitHubRepo}
            isLoading={readmeMutation.isPending}
          />
          {/* COMMITS OPTION */}
          <GenerationOptionCard
            icon={GitCommit}
            title="Generate from Commits"
            description={
              hasGitHubRepo
                ? "Create tasks based on recent commit history"
                : "Link a GitHub repository first"
            }
            onClick={handleGenerateFromCommits}
            disabled={!hasGitHubRepo}
            isLoading={commitsMutation.isPending}
          />
        </div>
        {/* AI SUGGESTIONS */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-medium text-[var(--text-primary)] uppercase tracking-wide">
            Smart Suggestions
          </p>
          <GenerationOptionCard
            icon={Lightbulb}
            title="Get AI Suggestions"
            description="Get task suggestions based on your project's existing tasks and context"
            onClick={handleGetSuggestions}
            disabled={false}
            isLoading={suggestionsMutation.isPending}
          />
        </div>
        {/* LINKED REPO INFO */}
        {hasGitHubRepo && (
          <div className="pt-2">
            <p className="text-xs text-[var(--light-text)]">
              Linked repository:{" "}
              <span className="text-[var(--text-primary)] font-medium">
                {githubRepo?.fullName}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITaskGenerator;
