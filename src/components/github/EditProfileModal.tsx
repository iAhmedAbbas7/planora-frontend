// <== IMPORTS ==>
import {
  X,
  User,
  Building2,
  MapPin,
  Link2,
  Twitter,
  Briefcase,
  Mail,
  Loader2,
  Camera,
  ExternalLink,
  UserCog,
} from "lucide-react";
import {
  ExtendedProfile,
  ProfileUpdateInput,
  useUpdateProfile,
  useUserEmails,
  UserEmail,
} from "../../hooks/useGitHub";
import { JSX, useState, useEffect } from "react";

// <== EDIT PROFILE MODAL PROPS ==>
type EditProfileModalProps = {
  // <== IS OPEN ==>
  isOpen: boolean;
  // <== ON CLOSE ==>
  onClose: () => void;
  // <== PROFILE ==>
  profile: ExtendedProfile | undefined;
};

// <== EDIT PROFILE MODAL COMPONENT ==>
const EditProfileModal = ({
  isOpen,
  onClose,
  profile,
}: EditProfileModalProps): JSX.Element | null => {
  // FORM STATE
  const [formData, setFormData] = useState<ProfileUpdateInput>({
    name: "",
    bio: "",
    company: "",
    location: "",
    blog: "",
    twitterUsername: "",
    hireable: false,
  });
  // UPDATE PROFILE MUTATION
  const updateProfile = useUpdateProfile();
  // FETCH USER EMAILS
  const { emails, isLoading: isEmailsLoading } = useUserEmails(isOpen);
  // INITIALIZE FORM DATA WHEN PROFILE CHANGES
  useEffect(() => {
    // CHECK IF PROFILE IS PROVIDED
    if (profile) {
      // SET FORM DATA
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        company: profile.company || "",
        location: profile.location || "",
        blog: profile.websiteUrl || "",
        twitterUsername: profile.twitterUsername || "",
        hireable: profile.isHireable || false,
      });
    }
  }, [profile]);
  // LOCK BODY SCROLL AND RESET ON CLOSE
  useEffect(() => {
    // CHECK IF MODAL IS OPEN
    if (isOpen) {
      // LOCK BODY SCROLL
      document.body.style.overflow = "hidden";
    } else {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
      // RESET FORM DATA
      if (profile) {
        setFormData({
          name: profile.name || "",
          bio: profile.bio || "",
          company: profile.company || "",
          location: profile.location || "",
          blog: profile.websiteUrl || "",
          twitterUsername: profile.twitterUsername || "",
          hireable: profile.isHireable || false,
        });
      }
    }
    // RETURN FUNCTION TO UNLOCK BODY SCROLL
    return () => {
      // UNLOCK BODY SCROLL
      document.body.style.overflow = "";
    };
  }, [isOpen, profile]);
  // HANDLE INPUT CHANGE
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // GET NAME AND VALUE FROM TARGET
    const { name, value } = e.target;
    // SET FORM DATA
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // HANDLE TOGGLE CHANGE
  const handleToggleChange = (name: string) => {
    // SET FORM DATA
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }));
  };
  // HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    // PREVENT DEFAULT FORM SUBMISSION
    e.preventDefault();
    // UPDATE PROFILE USING MUTATION
    await updateProfile.mutateAsync(formData);
    // CLOSE MODAL ON SUCCESS
    onClose();
  };
  // IF NOT OPEN, RETURN NULL
  if (!isOpen) return null;
  // RENDER EDIT PROFILE MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent-color) 15%, transparent)",
              }}
            >
              <UserCog size={20} className="text-[var(--accent-color)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Edit Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--light-text)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {/* AVATAR SECTION */}
          <div className="flex items-center gap-4 p-3 bg-[var(--cards-bg)] rounded-xl border border-[var(--border)]">
            <div className="relative">
              <img
                src={profile?.avatarUrl}
                alt={profile?.login}
                className="w-16 h-16 rounded-full border-2 border-[var(--border)]"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--cards-bg)] border border-[var(--border)] rounded-full flex items-center justify-center">
                <Camera className="w-3 h-3 text-[var(--text-secondary)]" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--light-text)] mb-1.5">
                Profile pictures can only be changed on GitHub
              </p>
              <a
                href="https://github.com/settings/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-color)] hover:underline"
              >
                Change on GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          {/* NAME */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-1.5">
              <User className="w-4 h-4 text-[var(--light-text)]" />
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your display name"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
            />
          </div>
          {/* BIO */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              rows={3}
              maxLength={160}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30 resize-none"
            />
            <p className="text-xs text-[var(--light-text)] mt-1 text-right">
              {formData.bio?.length || 0}/160
            </p>
          </div>
          {/* COMPANY */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-1.5">
              <Building2 className="w-4 h-4 text-[var(--light-text)]" />
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company or organization"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
            />
          </div>
          {/* LOCATION */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-1.5">
              <MapPin className="w-4 h-4 text-[var(--light-text)]" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Where are you based?"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
            />
          </div>
          {/* WEBSITE */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-1.5">
              <Link2 className="w-4 h-4 text-[var(--light-text)]" />
              Website
            </label>
            <input
              type="url"
              name="blog"
              value={formData.blog}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
            />
          </div>
          {/* TWITTER */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-1.5">
              <Twitter className="w-4 h-4 text-[var(--light-text)]" />
              Twitter username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--light-text)]">
                @
              </span>
              <input
                type="text"
                name="twitterUsername"
                value={formData.twitterUsername}
                onChange={handleInputChange}
                placeholder="username"
                className="w-full pl-7 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--cards-bg)] text-[var(--text-primary)] placeholder:text-[var(--light-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/30"
              />
            </div>
          </div>
          {/* EMAIL PREVIEW */}
          {!isEmailsLoading && emails.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] mb-1.5">
                <Mail className="w-4 h-4 text-[var(--light-text)]" />
                Public email
              </label>
              <div className="p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg">
                <p className="text-sm text-[var(--light-text)]">
                  {emails.find((e: UserEmail) => e.primary)?.email ||
                    emails[0]?.email ||
                    "No public email"}
                </p>
                <a
                  href="https://github.com/settings/emails"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--accent-color)] hover:underline mt-1"
                >
                  Manage emails on GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
          {/* HIREABLE */}
          <div className="flex items-center justify-between p-3 bg-[var(--cards-bg)] border border-[var(--border)] rounded-lg">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[var(--light-text)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Available for hire
                </p>
                <p className="text-xs text-[var(--light-text)]">
                  Let others know you're open to job opportunities
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggleChange("hireable")}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                formData.hireable
                  ? "bg-[var(--accent-color)]"
                  : "bg-[var(--border)]"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.hireable ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </form>
        {/* FOOTER */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border)] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={updateProfile.isPending}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--accent-color)] text-white hover:bg-[var(--accent-btn-hover-color)] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updateProfile.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
