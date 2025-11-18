// <== IMPORTS ==>
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect, JSX, ChangeEvent } from "react";

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
  // SHOW PASSWORD STATE
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // FORM DATA STATE
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    bio: "",
    profilePic: "",
  });
  // LOADING STATE
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // SAVING STATE
  const [isSaving, setIsSaving] = useState<boolean>(false);
  // PROFILE PIC FILE STATE
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  // FETCH PROFILE EFFECT (MOCK DATA - NO API)
  useEffect(() => {
    // SIMULATE API CALL
    setTimeout(() => {
      // GET USER FROM LOCAL STORAGE (UI ONLY)
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
      // SET FORM DATA
      setFormData({
        firstName: authUser.name?.split(" ")[0] || "",
        lastName: authUser.name?.split(" ")[1] || "",
        email: authUser.email || "",
        password: "",
        role: "",
        bio: "",
        profilePic: profilePicFile ? URL.createObjectURL(profilePicFile) : "",
      });
      // SET LOADING TO FALSE
      setIsLoading(false);
    }, 500);
  }, [profilePicFile]);
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
      // CREATE FILE READER
      const reader = new FileReader();
      // ON LOAD END
      reader.onloadend = () => {
        // UPDATE FORM DATA WITH PROFILE PIC
        setFormData((prev) => ({
          ...prev,
          profilePic: reader.result as string,
        }));
      };
      // READ FILE AS DATA URL
      reader.readAsDataURL(file);
    }
  };
  // HANDLE DELETE PIC FUNCTION
  const handleDeletePic = (): void => {
    // REMOVE PROFILE PIC FROM FORM DATA
    setFormData((prev) => ({ ...prev, profilePic: "" }));
    // CLEAR PROFILE PIC FILE
    setProfilePicFile(null);
  };
  // HANDLE SAVE FUNCTION
  const handleSave = (): void => {
    // SET SAVING STATE
    setIsSaving(true);
    // SIMULATE API CALL (UI ONLY)
    setTimeout(() => {
      // LOG FORM DATA (UI ONLY)
      console.log("Profile data:", formData);
      // SHOW SUCCESS MESSAGE
      alert("Profile saved successfully");
      // SET SAVING TO FALSE
      setIsSaving(false);
    }, 500);
  };
  // HANDLE CANCEL FUNCTION
  const handleCancel = (): void => {
    // RESET FORM DATA (UI ONLY)
    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    // RESET FORM DATA
    setFormData({
      firstName: authUser.name?.split(" ")[0] || "",
      lastName: authUser.name?.split(" ")[1] || "",
      email: authUser.email || "",
      password: "",
      role: "",
      bio: "",
      profilePic: "",
    });
    // CLEAR PROFILE PIC FILE
    setProfilePicFile(null);
    // SHOW INFO MESSAGE
    alert("Changes reverted");
  };
  // RETURNING THE PROFILE COMPONENT
  return (
    // FORM CONTAINER
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
            {formData.firstName
              ? formData.firstName[0].toUpperCase() +
                (formData.lastName ? formData.lastName[0].toUpperCase() : "")
              : "?"}
          </span>
        )}
        {/* PROFILE PIC ACTIONS */}
        <div className="flex flex-col gap-2">
          {/* CHANGE PICTURE BUTTON */}
          <label
            htmlFor="profilePic"
            style={{ backgroundColor: "var(--accent-color)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--accent-btn-hover-color)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent-color)")
            }
            className="px-3 py-1.5 rounded text-white text-sm transition cursor-pointer text-center"
          >
            Change Picture
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
              className="border border-[var(--border)] hover:bg-[var(--hover-bg)] px-3 py-1.5 rounded text-sm transition cursor-pointer"
            >
              Delete Picture
            </button>
          )}
        </div>
      </div>
      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* FIRST NAME INPUT */}
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Ahmed"
        />
        {/* LAST NAME INPUT */}
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Abbas"
        />
        {/* EMAIL INPUT */}
        <Input
          label="Email"
          name="email"
          type="email"
          readOnly={true}
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        {/* PASSWORD INPUT */}
        <div className="flex flex-col gap-1 relative">
          {/* PASSWORD LABEL */}
          <label
            htmlFor="password"
            className="text-sm font-medium text-[var(--light-text)]"
          >
            Password
          </label>
          {/* PASSWORD INPUT CONTAINER */}
          <div className="relative">
            {/* PASSWORD INPUT */}
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              readOnly={true}
              value={formData.password}
              onChange={handleChange}
              placeholder="•••••••"
              className="border border-[var(--border)] rounded-lg px-3 py-2 w-full focus:outline-none focus:border-[var(--accent-color)] pr-10"
            />
            {/* SHOW/HIDE PASSWORD BUTTON */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-[var(--light-text)] cursor-pointer hover:text-[var(--accent-color)]"
            >
              {/* EYE ICON */}
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
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
          disabled={isLoading || isSaving}
          className="w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--hover-bg)] cursor-pointer px-6 py-2.5 rounded-lg font-medium transition"
        >
          {isLoading ? "Loading..." : "Cancel"}
        </button>
        {/* SAVE BUTTON */}
        <button
          type="button"
          onClick={handleSave}
          style={{ backgroundColor: "var(--accent-color)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--accent-btn-hover-color)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--accent-color)")
          }
          disabled={isSaving || isLoading}
          className="w-full sm:w-auto text-white px-6 py-2 rounded-lg cursor-pointer font-medium transition"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default Profile;
