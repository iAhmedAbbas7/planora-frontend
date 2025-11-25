// <== IMPORTS ==>
import { useProfile } from "../../hooks/useProfile";
import ProfileSkeleton from "../skeletons/ProfileSkeleton";
import ConfirmationModal from "../common/ConfirmationModal";
import type { ModalType } from "../common/ConfirmationModal";
import { useState, useEffect, useMemo, JSX, ChangeEvent } from "react";
import { Camera, Trash2 } from "lucide-react";

// <== INPUT PROPS TYPE INTERFACE ==>
type InputProps = {
  // <== LABEL ==>
  label: string;
  // <== NAME ==>
  name: string;
  // <== TYPE ==>
  type?: string;
  // <== VALUE ==>
  value: string;
  // <== ON CHANGE FUNCTION ==>
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  // <== PLACEHOLDER ==>
  placeholder?: string;
  // <== READ ONLY ==>
  readOnly?: boolean;
};

// <== INPUT COMPONENT ==>
const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly = false,
}: InputProps): JSX.Element => {
  // RETURNING THE INPUT COMPONENT
  return (
    // INPUT CONTAINER
    <div className="flex flex-col gap-1">
      {/* INPUT LABEL */}
      <label
        htmlFor={name}
        className="text-sm font-medium text-[var(--primary-text)]"
      >
        {label}
      </label>
      {/* INPUT FIELD */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
      />
    </div>
  );
};

// <== PROFILE COMPONENT ==>
const Profile = (): JSX.Element => {
  // PROFILE HOOK
  const { profile, isLoading, isError, updateProfile, isUpdating } =
    useProfile();
  // FORM DATA STATE
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    profilePic: "",
  });
  // ORIGINAL DATA STATE (TO TRACK CHANGES)
  const [originalData, setOriginalData] = useState({
    name: "",
    role: "",
    bio: "",
    profilePic: "",
  });
  // DELETE PROFILE PIC FLAG
  const [deleteProfilePic, setDeleteProfilePic] = useState<boolean>(false);
  // PROFILE PIC FILE STATE
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  // CONFIRMATION MODAL STATE
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  // INITIALIZE FORM DATA FROM PROFILE
  useEffect(() => {
    if (profile) {
      const initialData = {
        name: profile.name || "",
        role: profile.role || "",
        bio: profile.bio || "",
        profilePic: profile.profilePic || "",
      };
      setFormData(initialData);
      setOriginalData(initialData);
      setDeleteProfilePic(false);
    }
  }, [profile]);
  // HANDLE CHANGE FUNCTION
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    // GET NAME AND VALUE FROM EVENT
    const { name, value } = e.target;
    // UPDATE FORM DATA STATE
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // HANDLE IMAGE UPLOAD FUNCTION
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    // GET FILE FROM EVENT
    const file = e.target.files?.[0];
    // CHECK IF FILE EXISTS
    if (file) {
      // SET PROFILE PIC FILE
      setProfilePicFile(file);
      // CLEAR DELETE FLAG
      setDeleteProfilePic(false);
      // CREATE FILE READER
      const reader = new FileReader();
      // ON LOAD END
      reader.onloadend = () => {
        // UPDATE FORM DATA WITH PROFILE PIC (FOR PREVIEW ONLY)
        setFormData((prev) => ({
          ...prev,
          profilePic: reader.result as string,
        }));
      };
      // READ FILE AS DATA URL (FOR PREVIEW ONLY)
      reader.readAsDataURL(file);
    }
  };
  // HANDLE DELETE PIC FUNCTION
  const handleDeletePic = (): void => {
    // REMOVE PROFILE PIC FROM FORM DATA
    setFormData((prev) => ({ ...prev, profilePic: "" }));
    // CLEAR PROFILE PIC FILE
    setProfilePicFile(null);
    // SET DELETE FLAG
    setDeleteProfilePic(true);
  };
  // CHECK IF FORM HAS CHANGES
  const hasChanges = useMemo(() => {
    return (
      formData.name !== originalData.name ||
      formData.role !== originalData.role ||
      formData.bio !== originalData.bio ||
      profilePicFile !== null ||
      deleteProfilePic
    );
  }, [formData, originalData, profilePicFile, deleteProfilePic]);
  // HANDLE SAVE FUNCTION
  const handleSave = (): void => {
    // PREPARE UPDATE PARAMS
    const updateParams: {
      name?: string;
      role?: string;
      bio?: string;
      profilePicFile?: File;
      deleteProfilePic?: boolean;
    } = {};
    // ADD NAME IF CHANGED
    if (formData.name !== originalData.name) {
      updateParams.name = formData.name;
    }
    // ADD ROLE IF CHANGED
    if (formData.role !== originalData.role) {
      updateParams.role = formData.role;
    }
    // ADD BIO IF CHANGED
    if (formData.bio !== originalData.bio) {
      updateParams.bio = formData.bio;
    }
    // ADD PROFILE PIC FILE IF UPLOADED
    if (profilePicFile) {
      updateParams.profilePicFile = profilePicFile;
    }
    // ADD DELETE FLAG IF PROFILE PIC IS DELETED
    if (deleteProfilePic) {
      updateParams.deleteProfilePic = true;
    }
    // UPDATE PROFILE
    updateProfile(updateParams)
      .then((updatedProfile) => {
        // UPDATE ORIGINAL DATA
        setOriginalData({
          name: updatedProfile.name || "",
          role: updatedProfile.role || "",
          bio: updatedProfile.bio || "",
          profilePic: updatedProfile.profilePic || "",
        });
        // CLEAR PROFILE PIC FILE
        setProfilePicFile(null);
        // CLEAR DELETE FLAG
        setDeleteProfilePic(false);
        // SHOW SUCCESS MODAL
        setModalState({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Profile updated successfully!",
        });
      })
      .catch((error) => {
        // SHOW ERROR MODAL
        setModalState({
          isOpen: true,
          type: "error",
          title: "Error",
          message:
            error.response?.data?.message ||
            "Failed to update profile. Please try again.",
        });
      });
  };
  // HANDLE CANCEL FUNCTION
  const handleCancel = (): void => {
    // RESET FORM DATA TO ORIGINAL
    setFormData({ ...originalData });
    // CLEAR PROFILE PIC FILE
    setProfilePicFile(null);
    // CLEAR DELETE FLAG
    setDeleteProfilePic(false);
    // SHOW INFO MODAL
    setModalState({
      isOpen: true,
      type: "info",
      title: "Changes Reverted",
      message: "All changes have been reverted to original values.",
    });
  };
  // CLOSE MODAL FUNCTION
  const closeModal = (): void => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };
  // IF LOADING, SHOW SKELETON
  if (isLoading) {
    return <ProfileSkeleton />;
  }
  // IF ERROR, SHOW ERROR MESSAGE
  if (isError) {
    return (
      <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)]">
        <p className="text-red-500">
          Failed to load profile. Please try again.
        </p>
      </div>
    );
  }
  // RETURNING THE PROFILE COMPONENT
  return (
    <>
      {/* FORM CONTAINER */}
      <form className="m-4 border border-[var(--border)] rounded-2xl p-6 space-y-6 bg-[var(--cards-bg)]">
        {/* TITLE SECTION */}
        <div>
          {/* TITLE */}
          <p className="text-xl font-semibold">Profile</p>
          {/* DESCRIPTION */}
          <p className="text-sm text-[var(--light-text)]">
            Update your personal information and profile details
          </p>
        </div>
        {/* PROFILE PHOTO SECTION */}
        <div className="flex items-center gap-4">
          {/* CHECK IF PROFILE PIC EXISTS */}
          {formData.profilePic ? (
            // PROFILE PIC IMAGE
            <img
              src={formData.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-[var(--border)] shadow-md object-cover"
            />
          ) : (
            // PROFILE PIC PLACEHOLDER
            <span
              className="w-24 h-24 border-4 border-[var(--border)] rounded-full shadow-md flex items-center justify-center text-white text-xl font-semibold"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              {formData.name
                ? formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "?"}
            </span>
          )}
          {/* CIRCULAR ACTION BUTTONS (NEXT TO PROFILE PICTURE) */}
          <div className="flex gap-2">
            {/* CHANGE PICTURE BUTTON */}
            <label
              htmlFor="profilePic"
              style={{ backgroundColor: "var(--accent-color)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--accent-btn-hover-color)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--accent-color)")
              }
              className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer transition shadow-md hover:scale-110"
              title="Change Picture"
            >
              {/* CAMERA ICON */}
              <Camera size={16} />
              {/* HIDDEN FILE INPUT */}
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            {/* DELETE PICTURE BUTTON */}
            {formData.profilePic && (
              <button
                type="button"
                onClick={handleDeletePic}
                className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white cursor-pointer transition shadow-md hover:scale-110"
                title="Delete Picture"
              >
                {/* TRASH ICON */}
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* FULL NAME INPUT */}
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ahmed Abbas"
          />
          {/* PROFESSION INPUT */}
          <Input
            label="Profession"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Full Stack Developer"
          />
        </div>
        {/* BIO TEXTAREA */}
        <div className="flex flex-col gap-1">
          {/* BIO LABEL */}
          <label
            htmlFor="bio"
            className="text-sm font-medium text-[var(--primary-text)]"
          >
            Bio
          </label>
          {/* BIO TEXTAREA */}
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Write something about yourself..."
            className="border border-[var(--border)] rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[var(--accent-color)]"
          ></textarea>
        </div>
        {/* BUTTONS CONTAINER */}
        <div className="pt-2 flex justify-end gap-3">
          {/* CANCEL BUTTON */}
          <button
            type="button"
            onClick={handleCancel}
            disabled={isUpdating || !hasChanges}
            className="w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--hover-bg)] cursor-pointer px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          {/* SAVE BUTTON */}
          <button
            type="button"
            onClick={handleSave}
            style={{ backgroundColor: "var(--accent-color)" }}
            onMouseEnter={(e) => {
              if (!isUpdating && hasChanges) {
                e.currentTarget.style.backgroundColor =
                  "var(--accent-btn-hover-color)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isUpdating && hasChanges) {
                e.currentTarget.style.backgroundColor = "var(--accent-color)";
              }
            }}
            disabled={isUpdating || !hasChanges}
            className="w-full sm:w-auto text-white px-6 py-2 rounded-lg cursor-pointer font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={closeModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText="OK"
        showCancel={false}
      />
    </>
  );
};

export default Profile;
