// <== IMPORTS ==>
import {
  Tag,
  ArrowLeft,
  RefreshCw,
  Search,
  X,
  ExternalLink,
  Check,
  ChevronDown,
  Loader2,
  AlertCircle,
  GitBranch,
  User,
  Package,
  Plus,
  Trash2,
  Edit2,
  Download,
  FileText,
  Calendar,
  Archive,
  CheckCircle,
} from "lucide-react";
import {
  useRepositoryDetails,
  useReleases,
  useReleaseDetails,
  useLatestRelease,
  useCreateRelease,
  useUpdateRelease,
  useDeleteRelease,
  useTags,
  useTagDetails,
  useCreateTag,
  useDeleteTag,
  useGenerateReleaseNotes,
  useRepositoryBranches,
  useRepositoryCommits,
  Release,
  Tag as TagType,
} from "../hooks/useGitHub";
import { toast } from "@/lib/toast";
import useTitle from "../hooks/useTitle";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import { JSX, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/layout/DashboardHeader";

// <== RELEASE CARD COMPONENT ==>
type ReleaseCardProps = {
  // <== RELEASE ==>
  release: Release;
  // <== ON CLICK ==>
  onClick: () => void;
  // <== IS LATEST ==>
  isLatest?: boolean;
};

const ReleaseCard = ({
  release,
  onClick,
  isLatest,
}: ReleaseCardProps): JSX.Element => {
  // FORMAT DATE
  const formatDate = (date: string | null) => {
    // IF DATE IS NULL, RETURN N/A
    if (!date) return "N/A";
    // RETURN FORMATTED DATE
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };
  // RETURN RELEASE CARD
  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 transition text-left cursor-pointer"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Package
            size={18}
            className={
              release.prerelease
                ? "text-yellow-500"
                : "text-[var(--accent-color)]"
            }
          />
          <h3 className="text-sm font-medium text-[var(--text-primary)] truncate">
            {release.name}
          </h3>
          {isLatest && (
            <span className="px-2 py-0.5 text-xs font-medium bg-green-500/15 text-green-500 rounded-full flex-shrink-0">
              Latest
            </span>
          )}
          {release.draft && (
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-500/15 text-gray-500 rounded-full flex-shrink-0">
              Draft
            </span>
          )}
          {release.prerelease && (
            <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/15 text-yellow-500 rounded-full flex-shrink-0">
              Pre-release
            </span>
          )}
        </div>
        <span className="text-xs text-[var(--light-text)] flex-shrink-0">
          {release.tagName}
        </span>
      </div>
      {/* META */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--light-text)]">
        {release.author && (
          <span className="flex items-center gap-1">
            <User size={12} />
            {release.author.login}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(release.publishedAt || release.createdAt)}
        </span>
        {release.assets.length > 0 && (
          <span className="flex items-center gap-1">
            <Download size={12} />
            {release.assets.length} asset
            {release.assets.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </button>
  );
};

// <== TAG CARD COMPONENT ==>
type TagCardProps = {
  // <== TAG ==>
  tag: TagType;
  // <== ON CLICK ==>
  onClick: () => void;
  // <== ON DELETE ==>
  onDelete: () => void;
  // <== CAN MANAGE ==>
  canManage: boolean;
};

const TagCard = ({
  tag,
  onClick,
  onDelete,
  canManage,
}: TagCardProps): JSX.Element => {
  // RETURN TAG CARD
  return (
    <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 transition">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onClick}
          className="flex items-center gap-2 min-w-0 text-left cursor-pointer"
        >
          <Tag size={16} className="text-[var(--accent-color)] flex-shrink-0" />
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {tag.name}
          </span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--light-text)] font-mono">
            {tag.sha.substring(0, 7)}
          </span>
          {canManage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-lg text-[var(--light-text)] hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
              title="Delete tag"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// <== RELEASE DETAILS MODAL COMPONENT ==>
type ReleaseDetailsModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== RELEASE ID ==>
  releaseId: number;
  // <== CAN MANAGE ==>
  canManage: boolean;
  // <== ON EDIT ==>
  onEdit: (release: Release) => void;
  // <== ON DELETE ==>
  onDelete: (releaseId: number) => void;
};

const ReleaseDetailsModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  releaseId,
  canManage,
  onEdit,
  onDelete,
}: ReleaseDetailsModalProps): JSX.Element | null => {
  // FETCH RELEASE DETAILS
  const { release, isLoading } = useReleaseDetails(
    owner,
    repo,
    releaseId,
    isOpen
  );
  // FORMAT DATE
  const formatDate = (date: string | null) => {
    // IF DATE IS NULL, RETURN N/A
    if (!date) return "N/A";
    // RETURN FORMATTED DATE
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // FORMAT FILE SIZE
  const formatFileSize = (bytes: number) => {
    // IF SIZE IS LESS THAN 1024 BYTES, RETURN FORMATTED SIZE
    if (bytes < 1024) return `${bytes} B`;
    // IF SIZE IS LESS THAN 1024 * 1024 BYTES, RETURN FORMATTED SIZE
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    // RETURN FORMATTED SIZE
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  // LOCK BODY SCROLL
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* MODAL */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Package size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {release?.name || "Release Details"}
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                {release?.tagName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {release?.prerelease && (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-500/15 text-yellow-500 rounded-lg">
                Pre-release
              </span>
            )}
            {release?.draft && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-500/15 text-gray-500 rounded-lg">
                Draft
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2
                size={24}
                className="animate-spin text-[var(--accent-color)]"
              />
            </div>
          ) : release ? (
            <>
              {/* META INFO */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--light-text)]">
                {release.author && (
                  <a
                    href={release.author.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[var(--accent-color)] transition"
                  >
                    <img
                      src={release.author.avatarUrl}
                      alt={release.author.login}
                      className="w-5 h-5 rounded-full"
                    />
                    {release.author.login}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(release.publishedAt || release.createdAt)}
                </span>
              </div>
              {/* BODY */}
              {release.body && (
                <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <div className="prose prose-sm max-w-none text-[var(--text-primary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-color)] prose-code:text-[var(--accent-color)] prose-code:bg-[var(--hover-bg)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                    <ReactMarkdown>{release.body}</ReactMarkdown>
                  </div>
                </div>
              )}
              {/* ASSETS */}
              {release.assets.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-[var(--text-primary)]">
                    Assets ({release.assets.length})
                  </h3>
                  <div className="space-y-2">
                    {release.assets.map((asset) => (
                      <a
                        key={asset.id}
                        href={asset.browserDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl hover:border-[var(--accent-color)]/30 transition"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Archive
                            size={16}
                            className="text-[var(--accent-color)] flex-shrink-0"
                          />
                          <span className="text-sm text-[var(--text-primary)] truncate">
                            {asset.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[var(--light-text)]">
                          <span>{formatFileSize(asset.size)}</span>
                          <span className="flex items-center gap-1">
                            <Download size={12} />
                            {asset.downloadCount}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {/* DOWNLOAD LINKS */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  Source Code
                </h3>
                <div className="flex gap-2">
                  {release.zipballUrl && (
                    <a
                      href={release.zipballUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg hover:border-[var(--accent-color)]/30 transition"
                    >
                      <Download
                        size={14}
                        className="text-[var(--accent-color)]"
                      />
                      ZIP
                    </a>
                  )}
                  {release.tarballUrl && (
                    <a
                      href={release.tarballUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg hover:border-[var(--accent-color)]/30 transition"
                    >
                      <Download
                        size={14}
                        className="text-[var(--accent-color)]"
                      />
                      TAR.GZ
                    </a>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle size={40} className="text-red-500 mb-3" />
              <p className="text-sm text-[var(--text-primary)]">
                Release not found
              </p>
            </div>
          )}
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-between gap-3 p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            {canManage && release && (
              <>
                <button
                  onClick={() => onEdit(release)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition cursor-pointer"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(releaseId)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition cursor-pointer"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </>
            )}
          </div>
          <a
            href={release?.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg hover:bg-[var(--hover-bg)] transition"
          >
            <ExternalLink size={14} />
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

// <== TAG DETAILS MODAL COMPONENT ==>
type TagDetailsModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== TAG NAME ==>
  tagName: string;
};

const TagDetailsModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  tagName,
}: TagDetailsModalProps): JSX.Element | null => {
  // FETCH TAG DETAILS
  const { tagDetails, isLoading } = useTagDetails(owner, repo, tagName, isOpen);
  // LOCK BODY SCROLL
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* MODAL */}
      <div className="relative w-full max-w-md bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Tag size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {tagName}
              </h2>
              <p className="text-xs text-[var(--light-text)]">Tag Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        {/* CONTENT */}
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2
                size={24}
                className="animate-spin text-[var(--accent-color)]"
              />
            </div>
          ) : tagDetails ? (
            <>
              {/* SHA */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--light-text)]">
                  Commit SHA
                </p>
                <p className="text-sm font-mono text-[var(--text-primary)] bg-[var(--cards-bg)] px-3 py-2 rounded-lg break-all">
                  {tagDetails.sha}
                </p>
              </div>
              {/* TYPE */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-[var(--light-text)]">
                  Type
                </p>
                <p className="text-sm text-[var(--text-primary)] capitalize">
                  {tagDetails.type === "tag"
                    ? "Annotated Tag"
                    : "Lightweight Tag"}
                </p>
              </div>
              {/* MESSAGE */}
              {tagDetails.message && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[var(--light-text)]">
                    Message
                  </p>
                  <p className="text-sm text-[var(--text-primary)] bg-[var(--cards-bg)] px-3 py-2 rounded-lg whitespace-pre-wrap">
                    {tagDetails.message}
                  </p>
                </div>
              )}
              {/* TAGGER */}
              {tagDetails.tagger && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-[var(--light-text)]">
                    Tagged by
                  </p>
                  <p className="text-sm text-[var(--text-primary)]">
                    {tagDetails.tagger.name} ({tagDetails.tagger.email})
                  </p>
                  <p className="text-xs text-[var(--light-text)]">
                    {new Date(tagDetails.tagger.date).toLocaleDateString()}
                  </p>
                </div>
              )}
              {/* VERIFICATION */}
              {tagDetails.verified !== undefined && (
                <div className="flex items-center gap-2">
                  {tagDetails.verified ? (
                    <span className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-green-500/15 text-green-500 rounded-lg">
                      <CheckCircle size={12} />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-gray-500/15 text-gray-500 rounded-lg">
                      Unverified
                    </span>
                  )}
                </div>
              )}
              {/* ASSOCIATED RELEASE */}
              {tagDetails.release && (
                <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                  <p className="text-xs font-medium text-[var(--light-text)] mb-2">
                    Associated Release
                  </p>
                  <a
                    href={tagDetails.release.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[var(--accent-color)] hover:underline"
                  >
                    <Package size={14} />
                    {tagDetails.release.name || tagName}
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle size={40} className="text-red-500 mb-3" />
              <p className="text-sm text-[var(--text-primary)]">
                Tag not found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// <== CREATE RELEASE MODAL COMPONENT ==>
type CreateReleaseModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
  // <== EDIT RELEASE ==>
  editRelease?: Release | null;
};

const CreateReleaseModal = ({
  isOpen,
  onClose,
  owner,
  repo,
  editRelease,
}: CreateReleaseModalProps): JSX.Element | null => {
  // TAG NAME STATE
  const [tagName, setTagName] = useState("");
  // RELEASE NAME STATE
  const [name, setName] = useState("");
  // RELEASE BODY STATE
  const [body, setBody] = useState("");
  // TARGET COMMITISH STATE
  const [targetCommitish, setTargetCommitish] = useState("");
  // DRAFT STATE
  const [isDraft, setIsDraft] = useState(false);
  // PRERELEASE STATE
  const [isPrerelease, setIsPrerelease] = useState(false);
  // GENERATE NOTES STATE
  const [generateNotes, setGenerateNotes] = useState(false);
  // SHOW BRANCH DROPDOWN STATE
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  // FETCH BRANCHES
  const { branches } = useRepositoryBranches(owner, repo, isOpen);
  // CREATE RELEASE MUTATION
  const createRelease = useCreateRelease();
  // UPDATE RELEASE MUTATION
  const updateRelease = useUpdateRelease();
  // GENERATE RELEASE NOTES MUTATION
  const generateReleaseNotes = useGenerateReleaseNotes();
  // IS EDIT MODE
  const isEditMode = !!editRelease;
  // INITIALIZE FORM ON EDIT
  useEffect(() => {
    // IF EDIT MODE
    if (editRelease) {
      // SET TAG NAME
      setTagName(editRelease.tagName);
      // SET RELEASE NAME
      setName(editRelease.name);
      // SET RELEASE BODY
      setBody(editRelease.body || "");
      // SET TARGET COMMITISH
      setTargetCommitish(editRelease.targetCommitish || "");
      // SET DRAFT
      setIsDraft(editRelease.draft);
      // SET PRERELEASE
      setIsPrerelease(editRelease.prerelease);
    }
  }, [editRelease]);
  // RESET FORM ON CLOSE
  useEffect(() => {
    // IF MODAL IS NOT OPEN
    if (!isOpen) {
      // RESET TAG NAME
      setTagName("");
      // RESET RELEASE NAME
      setName("");
      // RESET RELEASE BODY
      setBody("");
      // RESET TARGET COMMITISH
      setTargetCommitish("");
      // RESET DRAFT
      setIsDraft(false);
      // RESET PRERELEASE
      setIsPrerelease(false);
      // RESET GENERATE NOTES
      setGenerateNotes(false);
      // RESET SHOW BRANCH DROPDOWN
      setShowBranchDropdown(false);
    }
  }, [isOpen]);
  // SET DEFAULT BRANCH
  useEffect(() => {
    // IF BRANCHES ARE LOADED AND NO BRANCH IS SELECTED
    if (branches.length > 0 && !targetCommitish && !isEditMode) {
      // FIND DEFAULT BRANCH
      const defaultBranch = branches.find(
        (b) => b.name === "main" || b.name === "master"
      );
      // SET DEFAULT BRANCH
      setTargetCommitish(defaultBranch?.name || branches[0].name);
    }
  }, [branches, targetCommitish, isEditMode]);
  // HANDLE GENERATE NOTES
  const handleGenerateNotes = () => {
    // IF TAG NAME IS NOT PROVIDED
    if (!tagName) {
      // SHOW ERROR TOAST
      toast.error("Please enter a tag name first");
      // RETURN FROM FUNCTION
      return;
    }
    // GENERATE RELEASE NOTES
    generateReleaseNotes.mutate(
      {
        owner,
        repo,
        tagName,
        targetCommitish: targetCommitish || undefined,
      },
      {
        // <== ON SUCCESS ==>
        onSuccess: (data) => {
          // SET NAME AND BODY
          if (!name) setName(data.name);
          setBody(data.body);
          // SHOW SUCCESS TOAST
          toast.success("Release notes generated!");
        },
      }
    );
  };
  // HANDLE SUBMIT
  const handleSubmit = () => {
    // IF TAG NAME IS NOT PROVIDED
    if (!tagName.trim()) {
      // SHOW ERROR TOAST
      toast.error("Tag name is required");
      // RETURN FROM FUNCTION
      return;
    }
    // IF EDIT MODE AND EDIT RELEASE IS PROVIDED
    if (isEditMode && editRelease) {
      // UPDATE RELEASE MUTATION
      updateRelease.mutate(
        {
          owner,
          repo,
          releaseId: editRelease.id,
          tagName,
          name: name || tagName,
          body,
          targetCommitish: targetCommitish || undefined,
          draft: isDraft,
          prerelease: isPrerelease,
        },
        {
          // <== ON SUCCESS ==>
          onSuccess: () => {
            // CLOSE MODAL
            onClose();
          },
        }
      );
    } else {
      // CREATE RELEASE
      createRelease.mutate(
        {
          owner,
          repo,
          tagName,
          name: name || tagName,
          body,
          targetCommitish: targetCommitish || undefined,
          draft: isDraft,
          prerelease: isPrerelease,
          generateReleaseNotes: generateNotes,
        },
        {
          // <== ON SUCCESS ==>
          onSuccess: () => {
            // CLOSE MODAL
            onClose();
          },
        }
      );
    }
  };
  // LOCK BODY SCROLL
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // IS PENDING
  const isPending = createRelease.isPending || updateRelease.isPending;
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* MODAL */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Package size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {isEditMode ? "Edit Release" : "Create Release"}
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                {isEditMode
                  ? "Update release details"
                  : "Create a new release for this repository"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAG NAME */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Tag Name *
            </label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g., v1.0.0"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
              disabled={isPending}
            />
          </div>
          {/* TARGET BRANCH */}
          {!isEditMode && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Target Branch
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                  disabled={isPending}
                >
                  <span className="flex items-center gap-2">
                    <GitBranch
                      size={14}
                      className="text-[var(--accent-color)]"
                    />
                    {targetCommitish || "Select branch"}
                  </span>
                  <ChevronDown size={14} className="text-[var(--light-text)]" />
                </button>
                {showBranchDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowBranchDropdown(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {branches.map((branch) => (
                        <button
                          key={branch.name}
                          onClick={() => {
                            setTargetCommitish(branch.name);
                            setShowBranchDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                            targetCommitish === branch.name
                              ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                              : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                          }`}
                        >
                          <GitBranch size={14} />
                          {branch.name}
                          {targetCommitish === branch.name && (
                            <Check size={14} className="ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          {/* RELEASE NAME */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Release Title
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Version 1.0.0"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
              disabled={isPending}
            />
          </div>
          {/* BODY */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Description
              </label>
              <button
                onClick={handleGenerateNotes}
                disabled={generateReleaseNotes.isPending || !tagName}
                className="flex items-center gap-1 text-xs text-[var(--accent-color)] hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generateReleaseNotes.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <FileText size={12} />
                )}
                Generate notes
              </button>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe this release..."
              rows={6}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none"
              disabled={isPending}
            />
          </div>
          {/* OPTIONS */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPrerelease}
                onChange={(e) => setIsPrerelease(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]/30"
                disabled={isPending}
              />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Pre-release
                </p>
                <p className="text-xs text-[var(--light-text)]">
                  Mark as a pre-release version
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isDraft}
                onChange={(e) => setIsDraft(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]/30"
                disabled={isPending}
              />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Draft
                </p>
                <p className="text-xs text-[var(--light-text)]">
                  Save as draft (not published)
                </p>
              </div>
            </label>
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !tagName.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isEditMode ? "Update Release" : "Create Release"}
          </button>
        </div>
      </div>
    </div>
  );
};

// <== CREATE TAG MODAL COMPONENT ==>
type CreateTagModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== OWNER ==>
  owner: string;
  // <== REPO ==>
  repo: string;
};

const CreateTagModal = ({
  isOpen,
  onClose,
  owner,
  repo,
}: CreateTagModalProps): JSX.Element | null => {
  // TAG NAME STATE
  const [tagName, setTagName] = useState("");
  // MESSAGE STATE
  const [message, setMessage] = useState("");
  // SELECTED BRANCH STATE
  const [selectedBranch, setSelectedBranch] = useState("");
  // SHOW BRANCH DROPDOWN STATE
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  // FETCH BRANCHES
  const { branches } = useRepositoryBranches(owner, repo, isOpen);
  // FETCH COMMITS FROM SELECTED BRANCH
  const { commits } = useRepositoryCommits(
    owner,
    repo,
    1,
    1,
    selectedBranch,
    isOpen && !!selectedBranch
  );
  // CREATE TAG MUTATION
  const createTag = useCreateTag();
  // SET DEFAULT BRANCH
  useEffect(() => {
    // CHECK IF BRANCHES ARE LOADED AND NO BRANCH IS SELECTED
    if (branches.length > 0 && !selectedBranch) {
      // FIND DEFAULT BRANCH
      const defaultBranch = branches.find(
        (b) => b.name === "main" || b.name === "master"
      );
      // SET DEFAULT BRANCH
      setSelectedBranch(defaultBranch?.name || branches[0].name);
    }
  }, [branches, selectedBranch]);
  // RESET ON CLOSE
  useEffect(() => {
    // IF MODAL IS NOT OPEN
    if (!isOpen) {
      // RESET TAG NAME
      setTagName("");
      // RESET MESSAGE
      setMessage("");
      // RESET SELECTED BRANCH
      setSelectedBranch("");
      // RESET SHOW BRANCH DROPDOWN
      setShowBranchDropdown(false);
    }
  }, [isOpen]);
  // HANDLE SUBMIT
  const handleSubmit = () => {
    // IF TAG NAME IS NOT PROVIDED
    if (!tagName.trim()) {
      // SHOW ERROR TOAST
      toast.error("Tag name is required");
      // RETURN FROM FUNCTION
      return;
    }
    // IF SHA IS NOT PROVIDED
    const sha = commits[0]?.sha;
    if (!sha) {
      // SHOW ERROR TOAST
      toast.error("Could not get commit SHA");
      // RETURN FROM FUNCTION
      return;
    }
    // CREATE TAG
    createTag.mutate(
      {
        owner,
        repo,
        tagName,
        sha,
        message: message || undefined,
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
  // LOCK BODY SCROLL
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* MODAL */}
      <div className="relative w-full max-w-md bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-4 p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <Tag size={20} className="text-[var(--accent-color)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Create Tag
              </h2>
              <p className="text-xs text-[var(--light-text)]">
                Create a new tag for this repository
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        {/* CONTENT */}
        <div className="p-4 space-y-4">
          {/* TAG NAME */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Tag Name *
            </label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="e.g., v1.0.0"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
              disabled={createTag.isPending}
            />
          </div>
          {/* TARGET BRANCH */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Target Branch
            </label>
            <div className="relative">
              <button
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                disabled={createTag.isPending}
              >
                <span className="flex items-center gap-2">
                  <GitBranch size={14} className="text-[var(--accent-color)]" />
                  {selectedBranch || "Select branch"}
                </span>
                <ChevronDown size={14} className="text-[var(--light-text)]" />
              </button>
              {showBranchDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowBranchDropdown(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {branches.map((branch) => (
                      <button
                        key={branch.name}
                        onClick={() => {
                          setSelectedBranch(branch.name);
                          setShowBranchDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition cursor-pointer ${
                          selectedBranch === branch.name
                            ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                            : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                        }`}
                      >
                        <GitBranch size={14} />
                        {branch.name}
                        {selectedBranch === branch.name && (
                          <Check size={14} className="ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* MESSAGE (OPTIONAL - FOR ANNOTATED TAG) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tag message for annotated tag..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none"
              disabled={createTag.isPending}
            />
            <p className="text-xs text-[var(--light-text)]">
              Adding a message creates an annotated tag
            </p>
          </div>
        </div>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            disabled={createTag.isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={createTag.isPending || !tagName.trim() || !selectedBranch}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createTag.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Create Tag
          </button>
        </div>
      </div>
    </div>
  );
};

// <== DELETE CONFIRMATION MODAL ==>
type DeleteConfirmModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== ON CONFIRM ==>
  onConfirm: () => void;
  // <== TITLE ==>
  title: string;
  // <== MESSAGE ==>
  message: string;
  // <== IS PENDING ==>
  isPending: boolean;
};

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isPending,
}: DeleteConfirmModalProps): JSX.Element | null => {
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RETURN MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* MODAL */}
      <div className="relative w-full max-w-sm bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
        {/* CONTENT */}
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {title}
          </h3>
          <p className="text-sm text-[var(--light-text)]">{message}</p>
        </div>
        {/* FOOTER */}
        <div className="flex items-center gap-3 p-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// <== SKELETON COMPONENTS ==>
const ReleaseSkeleton = (): JSX.Element => {
  return (
    <div className="p-4 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-32" />
        </div>
        <div className="h-4 bg-[var(--light-text)]/10 rounded w-16" />
      </div>
      <div className="flex gap-4">
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-20" />
        <div className="h-3 bg-[var(--light-text)]/10 rounded w-24" />
      </div>
    </div>
  );
};

const TagSkeleton = (): JSX.Element => {
  return (
    <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl animate-pulse">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--light-text)]/10 rounded" />
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-24" />
        </div>
        <div className="h-4 bg-[var(--light-text)]/10 rounded w-16" />
      </div>
    </div>
  );
};

// <== PAGE LOADING SKELETON ==>
const PageLoadingSkeleton = (): JSX.Element => {
  return (
    <div className="space-y-4">
      {/* HEADER SKELETON */}
      <div className="flex items-center justify-between gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 bg-[var(--light-text)]/10 rounded w-48" />
          <div className="h-4 bg-[var(--light-text)]/10 rounded w-32" />
        </div>
        <div className="h-10 bg-[var(--light-text)]/10 rounded w-32" />
      </div>
      {/* TABS SKELETON */}
      <div className="flex gap-2 animate-pulse">
        <div className="h-10 bg-[var(--light-text)]/10 rounded w-24" />
        <div className="h-10 bg-[var(--light-text)]/10 rounded w-24" />
      </div>
      {/* CONTENT SKELETON */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <ReleaseSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

// <== GITHUB RELEASES PAGE COMPONENT ==>
const GitHubReleasesPage = (): JSX.Element => {
  // GET OWNER AND REPO FROM PARAMS
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  // NAVIGATE
  const navigate = useNavigate();
  // SET TITLE
  useTitle(`PlanOra - Releases - ${owner}/${repo}`);
  // ACTIVE TAB STATE
  const [activeTab, setActiveTab] = useState<"releases" | "tags">("releases");
  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  // SELECTED RELEASE ID STATE
  const [selectedReleaseId, setSelectedReleaseId] = useState<number | null>(
    null
  );
  // SELECTED TAG NAME STATE
  const [selectedTagName, setSelectedTagName] = useState<string | null>(null);
  // CREATE RELEASE MODAL STATE
  const [showCreateReleaseModal, setShowCreateReleaseModal] = useState(false);
  // EDIT RELEASE STATE
  const [editRelease, setEditRelease] = useState<Release | null>(null);
  // CREATE TAG MODAL STATE
  const [showCreateTagModal, setShowCreateTagModal] = useState(false);
  // DELETE CONFIRMATION STATE
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "release" | "tag";
    id: number | string;
    name: string;
  } | null>(null);
  // FETCH REPOSITORY DETAILS
  const { repository, isLoading: isRepoLoading } = useRepositoryDetails(
    owner || "",
    repo || ""
  );
  // FETCH RELEASES
  const {
    releases,
    isLoading: isReleasesLoading,
    isFetching: isReleasesFetching,
    refetch: refetchReleases,
  } = useReleases(owner || "", repo || "");
  // FETCH LATEST RELEASE
  const { release: latestRelease } = useLatestRelease(owner || "", repo || "");
  // FETCH TAGS
  const {
    tags,
    isLoading: isTagsLoading,
    isFetching: isTagsFetching,
    refetch: refetchTags,
  } = useTags(owner || "", repo || "");
  // DELETE MUTATIONS
  const deleteRelease = useDeleteRelease();
  // DELETE TAG MUTATION
  const deleteTag = useDeleteTag();
  // FILTER RELEASES BY SEARCH
  const filteredReleases = useMemo(() => {
    // IF SEARCH QUERY IS EMPTY, RETURN ALL RELEASES
    if (!searchQuery.trim()) return releases;
    // SET QUERY TO SEARCH QUERY IN LOWERCASE
    const query = searchQuery.toLowerCase();
    // FILTER RELEASES BY QUERY
    return releases.filter(
      (release) =>
        release.name.toLowerCase().includes(query) ||
        release.tagName.toLowerCase().includes(query) ||
        release.body?.toLowerCase().includes(query)
    );
  }, [releases, searchQuery]);
  // FILTER TAGS BY SEARCH
  const filteredTags = useMemo(() => {
    // IF SEARCH QUERY IS EMPTY, RETURN ALL TAGS
    if (!searchQuery.trim()) return tags;
    // SET QUERY TO SEARCH QUERY IN LOWERCASE
    const query = searchQuery.toLowerCase();
    // FILTER TAGS BY QUERY
    return tags.filter((tag) => tag.name.toLowerCase().includes(query));
  }, [tags, searchQuery]);
  // HAS ADMIN PERMISSION
  const hasAdminPermission = repository?.permissions?.admin || false;
  // HANDLE REFRESH
  const handleRefresh = () => {
    // REFRESH RELEASES
    refetchReleases();
    // REFRESH TAGS
    refetchTags();
  };
  // HANDLE EDIT RELEASE
  const handleEditRelease = (release: Release) => {
    // SET EDIT RELEASE
    setEditRelease(release);
    // OPEN CREATE RELEASE MODAL
    setShowCreateReleaseModal(true);
    // CLOSE DETAILS MODAL
    setSelectedReleaseId(null);
  };
  // HANDLE DELETE RELEASE
  const handleDeleteRelease = (releaseId: number) => {
    // FIND RELEASE NAME
    const release = releases.find((r) => r.id === releaseId);
    // SET DELETE CONFIRM
    setDeleteConfirm({
      type: "release",
      id: releaseId,
      name: release?.name || "this release",
    });
    // CLOSE DETAILS MODAL
    setSelectedReleaseId(null);
  };
  // HANDLE DELETE TAG
  const handleDeleteTag = (tagName: string) => {
    // SET DELETE CONFIRM
    setDeleteConfirm({
      type: "tag",
      id: tagName,
      name: tagName,
    });
  };
  // HANDLE CONFIRM DELETE
  const handleConfirmDelete = () => {
    // CHECK DELETE TYPE
    if (!deleteConfirm) return;
    // DELETE RELEASE
    if (deleteConfirm.type === "release") {
      deleteRelease.mutate(
        {
          owner: owner || "",
          repo: repo || "",
          releaseId: deleteConfirm.id as number,
        },
        {
          // <== ON SUCCESS ==>
          onSuccess: () => {
            // CLOSE DELETE CONFIRM
            setDeleteConfirm(null);
          },
        }
      );
    } else {
      // DELETE TAG
      deleteTag.mutate(
        {
          owner: owner || "",
          repo: repo || "",
          tag: deleteConfirm.id as string,
        },
        {
          // <== ON SUCCESS ==>
          onSuccess: () => {
            // CLOSE DELETE CONFIRM
            setDeleteConfirm(null);
          },
        }
      );
    }
  };
  // RETURN PAGE
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* HEADER */}
      <DashboardHeader
        title="Releases & Tags"
        subtitle={`${owner}/${repo}`}
        showSearch={false}
      />
      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(`/github/${owner}/${repo}`)}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--light-text)] hover:text-[var(--text-primary)] transition mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Repository
        </button>
        {/* LOADING STATE */}
        {isRepoLoading || (isReleasesLoading && isTagsLoading) ? (
          <PageLoadingSkeleton />
        ) : !repository ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
            <AlertCircle size={40} className="text-red-500 mb-3" />
            <p className="text-sm text-[var(--text-primary)]">
              Repository not found
            </p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                  {activeTab === "releases" ? "Releases" : "Tags"}
                </h1>
                <p className="text-sm text-[var(--light-text)]">
                  {activeTab === "releases"
                    ? `${releases.length} release${
                        releases.length !== 1 ? "s" : ""
                      }`
                    : `${tags.length} tag${tags.length !== 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* REFRESH BUTTON */}
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw size={16} />
                </button>
                {/* CREATE BUTTON */}
                {hasAdminPermission && (
                  <button
                    onClick={() =>
                      activeTab === "releases"
                        ? setShowCreateReleaseModal(true)
                        : setShowCreateTagModal(true)
                    }
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
                  >
                    <Plus size={16} />
                    {activeTab === "releases" ? "New Release" : "New Tag"}
                  </button>
                )}
              </div>
            </div>
            {/* TABS */}
            <div className="flex items-center gap-1 mb-4 p-1 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg w-fit">
              <button
                onClick={() => {
                  setActiveTab("releases");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
                  activeTab === "releases"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Package size={14} />
                Releases
              </button>
              <button
                onClick={() => {
                  setActiveTab("tags");
                  setSearchQuery("");
                }}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
                  activeTab === "tags"
                    ? "bg-[var(--accent-color)] text-white"
                    : "text-[var(--light-text)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Tag size={14} />
                Tags
              </button>
            </div>
            {/* SEARCH */}
            <div className="relative mb-4">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--light-text)]"
              />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {/* RELEASES TAB */}
            {activeTab === "releases" && (
              <div className="space-y-3">
                {isReleasesFetching && !isReleasesLoading ? (
                  // SHOW SKELETONS DURING REFRESH
                  [1, 2, 3].map((i) => <ReleaseSkeleton key={i} />)
                ) : filteredReleases.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <Package
                      size={40}
                      className="text-[var(--light-text)] mb-3"
                    />
                    <p className="text-sm text-[var(--light-text)]">
                      {searchQuery
                        ? "No releases match your search"
                        : "No releases yet"}
                    </p>
                    {!searchQuery && hasAdminPermission && (
                      <button
                        onClick={() => setShowCreateReleaseModal(true)}
                        className="mt-3 flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
                      >
                        <Plus size={14} />
                        Create first release
                      </button>
                    )}
                  </div>
                ) : (
                  filteredReleases.map((release) => (
                    <ReleaseCard
                      key={release.id}
                      release={release}
                      onClick={() => setSelectedReleaseId(release.id)}
                      isLatest={latestRelease?.id === release.id}
                    />
                  ))
                )}
              </div>
            )}
            {/* TAGS TAB */}
            {activeTab === "tags" && (
              <div className="space-y-2">
                {isTagsFetching && !isTagsLoading ? (
                  // SHOW SKELETONS DURING REFRESH
                  [1, 2, 3, 4, 5].map((i) => <TagSkeleton key={i} />)
                ) : filteredTags.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-[var(--cards-bg)] border border-[var(--border)] rounded-xl">
                    <Tag size={40} className="text-[var(--light-text)] mb-3" />
                    <p className="text-sm text-[var(--light-text)]">
                      {searchQuery
                        ? "No tags match your search"
                        : "No tags yet"}
                    </p>
                    {!searchQuery && hasAdminPermission && (
                      <button
                        onClick={() => setShowCreateTagModal(true)}
                        className="mt-3 flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer"
                      >
                        <Plus size={14} />
                        Create first tag
                      </button>
                    )}
                  </div>
                ) : (
                  filteredTags.map((tag) => (
                    <TagCard
                      key={tag.name}
                      tag={tag}
                      onClick={() => setSelectedTagName(tag.name)}
                      onDelete={() => handleDeleteTag(tag.name)}
                      canManage={hasAdminPermission}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
      {/* RELEASE DETAILS MODAL */}
      {selectedReleaseId && (
        <ReleaseDetailsModal
          isOpen={!!selectedReleaseId}
          onClose={() => setSelectedReleaseId(null)}
          owner={owner || ""}
          repo={repo || ""}
          releaseId={selectedReleaseId}
          canManage={hasAdminPermission}
          onEdit={handleEditRelease}
          onDelete={handleDeleteRelease}
        />
      )}
      {/* TAG DETAILS MODAL */}
      {selectedTagName && (
        <TagDetailsModal
          isOpen={!!selectedTagName}
          onClose={() => setSelectedTagName(null)}
          owner={owner || ""}
          repo={repo || ""}
          tagName={selectedTagName}
        />
      )}
      {/* CREATE RELEASE MODAL */}
      <CreateReleaseModal
        isOpen={showCreateReleaseModal}
        onClose={() => {
          setShowCreateReleaseModal(false);
          setEditRelease(null);
        }}
        owner={owner || ""}
        repo={repo || ""}
        editRelease={editRelease}
      />
      {/* CREATE TAG MODAL */}
      <CreateTagModal
        isOpen={showCreateTagModal}
        onClose={() => setShowCreateTagModal(false)}
        owner={owner || ""}
        repo={repo || ""}
      />
      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${
          deleteConfirm?.type === "release" ? "Release" : "Tag"
        }?`}
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        isPending={deleteRelease.isPending || deleteTag.isPending}
      />
    </div>
  );
};

export default GitHubReleasesPage;
