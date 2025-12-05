// <== IMPORTS ==>
import {
  X,
  Github,
  FileText,
  Lock,
  Globe,
  ChevronDown,
  Check,
  Loader2,
  Copy,
  Terminal,
  BookOpen,
  Scale,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { useState, JSX, FormEvent, useEffect, useRef } from "react";
import { useCreateRepository, CreatedRepository } from "../../hooks/useGitHub";

// <== GITIGNORE TEMPLATES ==>
const gitignoreTemplates = [
  { value: "", label: "None" },
  { value: "Node", label: "Node.js / React / Vue / Angular" },
  { value: "Python", label: "Python" },
  { value: "Java", label: "Java" },
  { value: "Go", label: "Go" },
  { value: "Rust", label: "Rust" },
  { value: "C++", label: "C++" },
  { value: "VisualStudio", label: "C# / .NET" },
  { value: "Ruby", label: "Ruby" },
  { value: "Swift", label: "Swift" },
  { value: "Kotlin", label: "Kotlin" },
  { value: "Dart", label: "Dart / Flutter" },
  { value: "Android", label: "Android" },
  { value: "Unity", label: "Unity" },
];

// <== LICENSE TEMPLATES ==>
const licenseTemplates = [
  { value: "", label: "None" },
  { value: "mit", label: "MIT License" },
  { value: "apache-2.0", label: "Apache License 2.0" },
  { value: "gpl-3.0", label: "GNU GPLv3" },
  { value: "bsd-3-clause", label: "BSD 3-Clause" },
  { value: "unlicense", label: "The Unlicense" },
  { value: "isc", label: "ISC License" },
];

// <== CREATE REPOSITORY MODAL PROPS ==>
type CreateRepositoryModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== ON CREATED ==>
  onCreated?: (repo: CreatedRepository) => void;
};

// <== CREATE REPOSITORY MODAL COMPONENT ==>
const CreateRepositoryModal = ({
  isOpen,
  onClose,
  onCreated,
}: CreateRepositoryModalProps): JSX.Element | null => {
  // CREATE REPOSITORY MUTATION
  const createRepositoryMutation = useCreateRepository();
  // REPOSITORY NAME STATE
  const [name, setName] = useState<string>("");
  // REPOSITORY DESCRIPTION STATE
  const [description, setDescription] = useState<string>("");
  // REPOSITORY VISIBILITY STATE
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  // REPOSITORY AUTO INIT STATE
  const [autoInit, setAutoInit] = useState<boolean>(true);
  // REPOSITORY GITIGNORE TEMPLATE STATE
  const [gitignoreTemplate, setGitignoreTemplate] = useState<string>("");
  // REPOSITORY LICENSE TEMPLATE STATE
  const [licenseTemplate, setLicenseTemplate] = useState<string>("");
  // REPOSITORY GITIGNORE DROPDOWN OPEN STATE
  const [isGitignoreOpen, setIsGitignoreOpen] = useState<boolean>(false);
  // REPOSITORY LICENSE DROPDOWN OPEN STATE
  const [isLicenseOpen, setIsLicenseOpen] = useState<boolean>(false);
  // CREATED REPOSITORY STATE (FOR SHOWING COMMANDS)
  const [createdRepo, setCreatedRepo] = useState<CreatedRepository | null>(
    null
  );
  // REPOSITORY GITIGNORE DROPDOWN REF
  const gitignoreRef = useRef<HTMLDivElement>(null);
  // REPOSITORY LICENSE DROPDOWN REF
  const licenseRef = useRef<HTMLDivElement>(null);
  // HANDLE OUTSIDE CLICK FOR DROPDOWNS
  useEffect(() => {
    // HANDLE CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      // CHECK GITIGNORE DROPDOWN
      if (
        gitignoreRef.current &&
        !gitignoreRef.current.contains(event.target as Node)
      ) {
        setIsGitignoreOpen(false);
      }
      // CHECK LICENSE DROPDOWN
      if (
        licenseRef.current &&
        !licenseRef.current.contains(event.target as Node)
      ) {
        setIsLicenseOpen(false);
      }
    };
    // ADD EVENT LISTENER
    document.addEventListener("mousedown", handleClickOutside);
    // CLEANUP
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // RESET FORM WHEN MODAL CLOSES
  useEffect(() => {
    // IF MODAL IS NOT OPEN, RESET FORM
    if (!isOpen) {
      // RESET REPOSITORY NAME
      setName("");
      // RESET REPOSITORY DESCRIPTION
      setDescription("");
      // RESET REPOSITORY VISIBILITY
      setIsPrivate(false);
      // RESET REPOSITORY AUTO INIT
      setAutoInit(true);
      // RESET REPOSITORY GITIGNORE TEMPLATE
      setGitignoreTemplate("");
      // RESET REPOSITORY LICENSE TEMPLATE
      setLicenseTemplate("");
      // RESET CREATED REPOSITORY
      setCreatedRepo(null);
    }
  }, [isOpen]);
  // VALIDATE NAME FUNCTION
  const validateName = (value: string): boolean => {
    // CHECK IF EMPTY
    if (!value.trim()) return false;
    // CHECK FOR VALID CHARACTERS
    const nameRegex = /^[a-zA-Z0-9._-]+$/;
    // RETURN IF VALID
    return nameRegex.test(value.trim());
  };
  // HANDLE SUBMIT FUNCTION
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // CHECK IF NAME IS VALID
    if (!validateName(name)) {
      toast.error(
        "Repository name can only contain alphanumeric characters, hyphens, underscores, and periods."
      );
      return;
    }
    // CREATE REPOSITORY USING MUTATION
    createRepositoryMutation.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        private: isPrivate,
        autoInit,
        gitignoreTemplate: gitignoreTemplate || undefined,
        licenseTemplate: licenseTemplate || undefined,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (repo) => {
          // SET CREATED REPO (TO SHOW COMMANDS)
          setCreatedRepo(repo);
          // SHOW SUCCESS TOAST
          toast.success(`Repository "${repo.name}" created successfully!`);
          // CALL ON CREATED CALLBACK
          onCreated?.(repo);
        },
        // <== ON ERROR ==>
        onError: (error) => {
          // GET ERROR MESSAGE FROM RESPONSE
          const errorMessage =
            error.response?.data?.message ||
            "Failed to create repository. Please try again.";
          // SHOW ERROR TOAST
          toast.error(errorMessage);
        },
      }
    );
  };
  // COPY TO CLIPBOARD FUNCTION
  const copyToClipboard = (text: string): void => {
    // COPY TEXT TO CLIPBOARD
    navigator.clipboard.writeText(text);
    // SHOW SUCCESS TOAST
    toast.success("Copied to clipboard!");
  };
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURNING THE CREATE REPOSITORY MODAL
  return (
    // MODAL OVERLAY
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* MODAL CONTENT */}
      <div
        className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Github size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {createdRepo ? "Repository Created!" : "Create New Repository"}
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                {createdRepo
                  ? "Your repository is ready"
                  : "Create a new GitHub repository"}
              </p>
            </div>
          </div>
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          {createdRepo ? (
            // SUCCESS VIEW - SHOW GIT COMMANDS
            <div className="space-y-4">
              {/* REPOSITORY INFO */}
              <div className="p-4 bg-[var(--inside-card-bg)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2">
                  <Github size={18} className="text-[var(--accent-color)]" />
                  <span className="font-medium text-[var(--text-primary)]">
                    {createdRepo.fullName}
                  </span>
                  {createdRepo.private ? (
                    <Lock size={14} className="text-[var(--light-text)]" />
                  ) : (
                    <Globe size={14} className="text-[var(--light-text)]" />
                  )}
                </div>
                <a
                  href={createdRepo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--accent-color)] hover:underline"
                >
                  {createdRepo.htmlUrl}
                </a>
              </div>
              {/* QUICK START COMMANDS */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                  <Terminal size={16} className="text-[var(--accent-color)]" />
                  Quick Start Commands
                </h3>
                {/* CREATE NEW REPO */}
                <div className="space-y-2">
                  <p className="text-xs text-[var(--light-text)]">
                    Create a new repository on the command line:
                  </p>
                  <div className="bg-[var(--inside-card-bg)] rounded-lg p-3 text-xs font-mono text-[var(--text-primary)] relative group">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `echo "# ${createdRepo.name}" >> README.md\ngit init\ngit add README.md\ngit commit -m "first commit"\ngit branch -M ${createdRepo.defaultBranch}\ngit remote add origin ${createdRepo.cloneUrl}\ngit push -u origin ${createdRepo.defaultBranch}`
                        )
                      }
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--light-text)] hover:text-[var(--accent-color)] transition opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Copy size={14} />
                    </button>
                    <pre className="whitespace-pre-wrap break-all">
                      {`echo "# ${createdRepo.name}" >> README.md
                        git init
                        git add README.md
                        git commit -m "first commit"
                        git branch -M ${createdRepo.defaultBranch}
                        git remote add origin ${createdRepo.cloneUrl}
                        git push -u origin ${createdRepo.defaultBranch}`}
                    </pre>
                  </div>
                </div>
                {/* PUSH EXISTING REPO */}
                <div className="space-y-2">
                  <p className="text-xs text-[var(--light-text)]">
                    Push an existing repository from the command line:
                  </p>
                  <div className="bg-[var(--inside-card-bg)] rounded-lg p-3 text-xs font-mono text-[var(--text-primary)] relative group">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `git remote add origin ${createdRepo.cloneUrl}\ngit branch -M ${createdRepo.defaultBranch}\ngit push -u origin ${createdRepo.defaultBranch}`
                        )
                      }
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--light-text)] hover:text-[var(--accent-color)] transition opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Copy size={14} />
                    </button>
                    <pre className="whitespace-pre-wrap break-all">
                      {`git remote add origin ${createdRepo.cloneUrl}
                        git branch -M ${createdRepo.defaultBranch}
                        git push -u origin ${createdRepo.defaultBranch}`}
                    </pre>
                  </div>
                </div>
                {/* CLONE COMMAND */}
                <div className="space-y-2">
                  <p className="text-xs text-[var(--light-text)]">Clone URL:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdRepo.cloneUrl}
                      className="flex-1 px-3 py-2 text-xs font-mono bg-[var(--inside-card-bg)] border border-[var(--border)] rounded-lg text-[var(--text-primary)]"
                    />
                    <button
                      onClick={() => copyToClipboard(createdRepo.cloneUrl)}
                      className="p-2 rounded-lg border border-[var(--border)] text-[var(--light-text)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] transition cursor-pointer"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // CREATE FORM
            <form id="create-repo-form" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* REPOSITORY NAME */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="repo-name"
                    className="text-sm font-medium text-[var(--text-primary)]"
                  >
                    Repository Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Github
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--light-text)]"
                    />
                    <input
                      required
                      type="text"
                      id="repo-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="my-awesome-project"
                      className="w-full pl-10 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
                    />
                  </div>
                  <p className="text-xs text-[var(--light-text)]">
                    Use letters, numbers, hyphens, underscores, or periods.
                  </p>
                </div>
                {/* DESCRIPTION */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="repo-description"
                    className="text-sm font-medium text-[var(--text-primary)]"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-3 top-3 text-[var(--light-text)]"
                    />
                    <textarea
                      id="repo-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="A short description of your repository..."
                      rows={2}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] bg-transparent text-[var(--text-primary)]"
                    />
                  </div>
                </div>
                {/* VISIBILITY TOGGLE */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Visibility
                  </label>
                  <div className="flex gap-3">
                    {/* PUBLIC OPTION */}
                    <button
                      type="button"
                      onClick={() => setIsPrivate(false)}
                      className={`flex-1 flex items-center gap-2 p-3 rounded-lg border transition cursor-pointer ${
                        !isPrivate
                          ? "border-[var(--accent-color)] bg-[color-mix(in_srgb,var(--accent-color)_10%,transparent)]"
                          : "border-[var(--border)] hover:border-[var(--light-text)]"
                      }`}
                    >
                      <Globe
                        size={18}
                        className={
                          !isPrivate
                            ? "text-[var(--accent-color)]"
                            : "text-[var(--light-text)]"
                        }
                      />
                      <div className="text-left">
                        <p
                          className={`text-sm font-medium ${
                            !isPrivate
                              ? "text-[var(--accent-color)]"
                              : "text-[var(--text-primary)]"
                          }`}
                        >
                          Public
                        </p>
                        <p className="text-xs text-[var(--light-text)]">
                          Anyone can see
                        </p>
                      </div>
                      {!isPrivate && (
                        <Check
                          size={16}
                          className="ml-auto text-[var(--accent-color)]"
                        />
                      )}
                    </button>
                    {/* PRIVATE OPTION */}
                    <button
                      type="button"
                      onClick={() => setIsPrivate(true)}
                      className={`flex-1 flex items-center gap-2 p-3 rounded-lg border transition cursor-pointer ${
                        isPrivate
                          ? "border-[var(--accent-color)] bg-[color-mix(in_srgb,var(--accent-color)_10%,transparent)]"
                          : "border-[var(--border)] hover:border-[var(--light-text)]"
                      }`}
                    >
                      <Lock
                        size={18}
                        className={
                          isPrivate
                            ? "text-[var(--accent-color)]"
                            : "text-[var(--light-text)]"
                        }
                      />
                      <div className="text-left">
                        <p
                          className={`text-sm font-medium ${
                            isPrivate
                              ? "text-[var(--accent-color)]"
                              : "text-[var(--text-primary)]"
                          }`}
                        >
                          Private
                        </p>
                        <p className="text-xs text-[var(--light-text)]">
                          Only you can see
                        </p>
                      </div>
                      {isPrivate && (
                        <Check
                          size={16}
                          className="ml-auto text-[var(--accent-color)]"
                        />
                      )}
                    </button>
                  </div>
                </div>
                {/* INITIALIZE OPTIONS */}
                <div className="flex items-center gap-3 p-3 bg-[var(--inside-card-bg)] rounded-lg border border-[var(--border)]">
                  <input
                    type="checkbox"
                    id="auto-init"
                    checked={autoInit}
                    onChange={(e) => setAutoInit(e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent-color)] cursor-pointer"
                  />
                  <label
                    htmlFor="auto-init"
                    className="text-sm text-[var(--text-primary)] cursor-pointer"
                  >
                    Initialize with a README
                  </label>
                </div>
                {/* GITIGNORE AND LICENSE DROPDOWNS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* GITIGNORE TEMPLATE */}
                  <div className="flex flex-col gap-1.5" ref={gitignoreRef}>
                    <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                      <BookOpen
                        size={14}
                        className="text-[var(--light-text)]"
                      />
                      .gitignore template
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsGitignoreOpen(!isGitignoreOpen);
                          setIsLicenseOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-transparent text-[var(--text-primary)] hover:border-[var(--light-text)] transition cursor-pointer"
                      >
                        <span
                          className={
                            !gitignoreTemplate ? "text-[var(--light-text)]" : ""
                          }
                        >
                          {gitignoreTemplates.find(
                            (t) => t.value === gitignoreTemplate
                          )?.label || "None"}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-[var(--light-text)] transition ${
                            isGitignoreOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {/* DROPDOWN MENU */}
                      {isGitignoreOpen && (
                        <div className="absolute z-20 top-full left-0 mt-1 w-full max-h-48 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
                          {gitignoreTemplates.map((template) => (
                            <button
                              key={template.value}
                              type="button"
                              onClick={() => {
                                setGitignoreTemplate(template.value);
                                setIsGitignoreOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                                gitignoreTemplate === template.value
                                  ? "text-[var(--accent-color)]"
                                  : "text-[var(--text-primary)]"
                              }`}
                            >
                              {template.label}
                              {gitignoreTemplate === template.value && (
                                <Check size={14} />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* LICENSE TEMPLATE */}
                  <div className="flex flex-col gap-1.5" ref={licenseRef}>
                    <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1.5">
                      <Scale size={14} className="text-[var(--light-text)]" />
                      License
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLicenseOpen(!isLicenseOpen);
                          setIsGitignoreOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-transparent text-[var(--text-primary)] hover:border-[var(--light-text)] transition cursor-pointer"
                      >
                        <span
                          className={
                            !licenseTemplate ? "text-[var(--light-text)]" : ""
                          }
                        >
                          {licenseTemplates.find(
                            (t) => t.value === licenseTemplate
                          )?.label || "None"}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-[var(--light-text)] transition ${
                            isLicenseOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {/* DROPDOWN MENU */}
                      {isLicenseOpen && (
                        <div className="absolute z-20 top-full left-0 mt-1 w-full max-h-48 overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg">
                          {licenseTemplates.map((template) => (
                            <button
                              key={template.value}
                              type="button"
                              onClick={() => {
                                setLicenseTemplate(template.value);
                                setIsLicenseOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--hover-bg)] transition cursor-pointer ${
                                licenseTemplate === template.value
                                  ? "text-[var(--accent-color)]"
                                  : "text-[var(--text-primary)]"
                              }`}
                            >
                              {template.label}
                              {licenseTemplate === template.value && (
                                <Check size={14} />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
        {/* MODAL FOOTER */}
        <div className="flex justify-end gap-2 p-4 border-t border-[var(--border)]">
          {createdRepo ? (
            // DONE BUTTON
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
            >
              Done
            </button>
          ) : (
            // CREATE/CANCEL BUTTONS
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-repo-form"
                disabled={
                  createRepositoryMutation.isPending || !validateName(name)
                }
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createRepositoryMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Github size={16} />
                    Create Repository
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRepositoryModal;
