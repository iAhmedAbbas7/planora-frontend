// <== IMPORTS ==>
import { toast } from "@/lib/toast";
import { JSX, useState, FormEvent } from "react";
import { useCreateWorkspace } from "../../hooks/useWorkspace";
import { X, Building2, FileText, Lock, Globe, Loader2 } from "lucide-react";

// <== PROPS TYPE ==>
type Props = {
  // <== ON CLOSE ==>
  onClose: () => void;
};

// <== CREATE WORKSPACE MODAL COMPONENT ==>
const CreateWorkspaceModal = ({ onClose }: Props): JSX.Element => {
  // CREATE WORKSPACE MUTATION
  const createWorkspace = useCreateWorkspace();
  // WORKSPACE NAME STATE
  const [name, setName] = useState("");
  // WORKSPACE DESCRIPTION STATE
  const [description, setDescription] = useState("");
  // WORKSPACE VISIBILITY STATE
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  // HANDLE SUBMIT
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // VALIDATE NAME
    if (!name.trim()) {
      // SHOW ERROR TOAST
      toast.error("Workspace name is required!");
      // RETURN
      return;
    }
    // CREATE WORKSPACE
    createWorkspace.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        visibility,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: () => {
          // CLOSE MODAL
          onClose();
        },
      }
    );
  };
  // RETURNING THE MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-md bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--accent-color)]/10 flex items-center justify-center">
              <Building2 size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--primary-text)]">
                Create Workspace
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                Set up a new collaborative space
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--light-text)] hover:text-[var(--primary-text)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* NAME FIELD */}
          <div className="space-y-1.5">
            <label
              htmlFor="workspace-name"
              className="text-sm font-medium text-[var(--primary-text)]"
            >
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
              />
              <input
                type="text"
                id="workspace-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Product Team"
                maxLength={100}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:border-[var(--accent-color)] transition-colors"
              />
            </div>
          </div>
          {/* DESCRIPTION FIELD */}
          <div className="space-y-1.5">
            <label
              htmlFor="workspace-description"
              className="text-sm font-medium text-[var(--primary-text)]"
            >
              Description
            </label>
            <div className="relative">
              <FileText
                size={18}
                className="absolute left-3 top-3 text-[var(--light-text)]"
              />
              <textarea
                id="workspace-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this workspace for?"
                maxLength={500}
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-transparent focus:outline-none focus:border-[var(--accent-color)] transition-colors resize-none"
              />
            </div>
          </div>
          {/* VISIBILITY FIELD */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--primary-text)]">
              Visibility
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* PRIVATE OPTION */}
              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  visibility === "private"
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5"
                    : "border-[var(--border)] hover:border-[var(--light-text)]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    visibility === "private"
                      ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                      : "bg-[var(--hover-bg)] text-[var(--light-text)]"
                  }`}
                >
                  <Lock size={16} />
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-medium ${
                      visibility === "private"
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--primary-text)]"
                    }`}
                  >
                    Private
                  </p>
                  <p className="text-xs text-[var(--light-text)]">
                    Invite only
                  </p>
                </div>
              </button>
              {/* PUBLIC OPTION */}
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  visibility === "public"
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5"
                    : "border-[var(--border)] hover:border-[var(--light-text)]"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    visibility === "public"
                      ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                      : "bg-[var(--hover-bg)] text-[var(--light-text)]"
                  }`}
                >
                  <Globe size={16} />
                </div>
                <div className="text-left">
                  <p
                    className={`text-sm font-medium ${
                      visibility === "public"
                        ? "text-[var(--accent-color)]"
                        : "text-[var(--primary-text)]"
                    }`}
                  >
                    Public
                  </p>
                  <p className="text-xs text-[var(--light-text)]">
                    Anyone can view
                  </p>
                </div>
              </button>
            </div>
          </div>
        </form>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--border)] bg-[var(--hover-bg)]/30">
          <button
            type="button"
            onClick={onClose}
            disabled={createWorkspace.isPending}
            className="px-4 py-2 text-sm font-medium text-[var(--primary-text)] border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="workspace-form"
            onClick={(e) => {
              e.preventDefault();
              const form = document.querySelector("form");
              if (form) {
                form.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              }
            }}
            disabled={createWorkspace.isPending || !name.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--accent-color)] rounded-lg hover:bg-[var(--accent-btn-hover-color)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createWorkspace.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Workspace"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
