// <== IMPORTS ==>
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useEffect, useState, JSX, ChangeEvent } from "react";

// <== ACCOUNT COMPONENT ==>
const Account = (): JSX.Element => {
  // SHOW PASSWORD STATE
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // SHOW NEW PASSWORD STATE
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  // SHOW CONFIRM PASSWORD STATE
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  // LOADING STATE
  const [loading, setLoading] = useState<boolean>(false);
  // ERROR STATE
  const [error, setError] = useState<string | null>(null);
  // FORM DATA STATE
  const [formData, setFormData] = useState({
    email: "",
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  // FETCH USER INFO EFFECT (MOCK DATA - NO API)
  useEffect(() => {
    // SET LOADING
    setLoading(true);
    // SIMULATE API CALL
    setTimeout(() => {
      // GET USER FROM LOCAL STORAGE (UI ONLY)
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
      // SET EMAIL
      setFormData((prev) => ({ ...prev, email: authUser.email || "" }));
      // SET LOADING TO FALSE
      setLoading(false);
      // SET ERROR TO NULL
      setError(null);
    }, 500);
  }, []);
  // HANDLE CHANGE FUNCTION
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // GET NAME AND VALUE FROM EVENT
    const { name, value } = e.target;
    // UPDATE FORM DATA STATE
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // HANDLE SAVE FUNCTION
  const handleSave = (): void => {
    // CHECK IF NEW PASSWORD EXISTS
    if (formData.newPassword) {
      // CHECK IF CURRENT PASSWORD IS ENTERED
      if (!formData.currentPassword) {
        alert("Please enter your current password to change it.");
        return;
      }
      // CHECK IF PASSWORDS MATCH
      if (formData.newPassword !== formData.confirmPassword) {
        alert("New password and confirmation password do not match.");
        return;
      }
    }
    // SET LOADING
    setLoading(true);
    // SIMULATE API CALL (UI ONLY)
    setTimeout(() => {
      // LOG UPDATE DATA (UI ONLY)
      console.log("Account update data:", {
        newEmail: formData.newEmail || undefined,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined,
      });
      // UPDATE EMAIL IF NEW EMAIL PROVIDED
      if (formData.newEmail) {
        setFormData((prev) => ({
          ...prev,
          email: formData.newEmail,
          newEmail: "",
        }));
      }
      // CLEAR PASSWORD FIELDS
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      // SHOW SUCCESS MESSAGE
      alert("Account details updated successfully!");
      // SET LOADING TO FALSE
      setLoading(false);
    }, 500);
  };
  // HANDLE CANCEL FUNCTION
  const handleCancel = (): void => {
    // RESET INPUT FIELDS
    setFormData((prev) => ({
      ...prev,
      newEmail: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    // SHOW INFO MESSAGE
    alert("Changes cancelled and form fields reset.");
  };
  // HANDLE DELETE USER FUNCTION
  const handleDeleteUser = (): void => {
    // CONFIRM DELETION
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      return;
    }
    // SET LOADING
    setLoading(true);
    // SIMULATE API CALL (UI ONLY)
    setTimeout(() => {
      // CLEAR USER DATA FROM LOCAL STORAGE
      localStorage.removeItem("authUser");
      // LOG DELETION (UI ONLY)
      console.log("Account deleted");
      // SHOW SUCCESS MESSAGE
      alert("Your account has been successfully deleted.");
      // SET LOADING TO FALSE
      setLoading(false);
      // REDIRECT TO REGISTER PAGE
      window.location.href = "/register";
    }, 500);
  };
  // PASSWORD FIELDS ARRAY
  const passwordFields = [
    {
      label: "Current Password",
      name: "currentPassword",
      state: showPassword,
      setState: setShowPassword,
      value: formData.currentPassword,
      placeholder: "Enter current password...",
    },
    {
      label: "New Password",
      name: "newPassword",
      state: showNewPassword,
      setState: setShowNewPassword,
      value: formData.newPassword,
      placeholder: "Enter new password...",
    },
    {
      label: "Confirm New Password",
      name: "confirmPassword",
      state: showConfirmPassword,
      setState: setShowConfirmPassword,
      value: formData.confirmPassword,
      placeholder: "Re-enter new password...",
    },
  ];
  // CHECK IF HAS CHANGES
  const hasChanges = Boolean(
    formData.newEmail ||
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
  );
  // RETURNING THE ACCOUNT COMPONENT
  return (
    // ACCOUNT MAIN CONTAINER
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-10 shadow-sm">
      {/* HEADER SECTION */}
      <div>
        {/* TITLE */}
        <p className="text-xl font-semibold">Account</p>
        {/* DESCRIPTION */}
        <p className="text-sm text-[var(--light-text)]">
          Update your personal information and security details.
        </p>
      </div>
      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {/* CHANGE EMAIL SECTION */}
      <section className="space-y-4">
        {/* SECTION TITLE */}
        <p className="text-lg font-medium border-b border-[var(--border)] pb-2">
          Change Email
        </p>
        {/* CURRENT EMAIL INFO */}
        <p className="text-[var(--light-text)]">
          Your current email is{" "}
          <span className="font-medium">{formData.email || "N/A"}</span>
        </p>
        {/* NEW EMAIL INPUT */}
        <div className="flex flex-col sm:w-1/2">
          {/* NEW EMAIL LABEL */}
          <label
            htmlFor="newEmail"
            className="block text-sm font-medium text-[var(--light-text)] mb-1"
          >
            New Email Address
          </label>
          {/* NEW EMAIL INPUT */}
          <input
            type="email"
            id="newEmail"
            name="newEmail"
            value={formData.newEmail}
            onChange={handleChange}
            placeholder="Enter new email..."
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500 bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
            disabled={loading}
          />
        </div>
      </section>
      {/* CHANGE PASSWORD SECTION */}
      <section className="space-y-5">
        {/* SECTION TITLE */}
        <p className="text-lg font-medium border-b border-[var(--border)] pb-2">
          Change Password
        </p>
        {/* PASSWORD FIELDS */}
        {/* MAPPING THROUGH PASSWORD FIELDS */}
        {passwordFields.map((field, i) => (
          // PASSWORD FIELD CONTAINER
          <div key={i} className="flex flex-col sm:w-1/2">
            {/* PASSWORD LABEL */}
            <label
              htmlFor={field.name}
              className="block text-sm font-medium mb-1"
            >
              {field.label}
            </label>
            {/* PASSWORD INPUT CONTAINER */}
            <div className="relative">
              {/* PASSWORD INPUT */}
              <input
                type={field.state ? "text" : "password"}
                id={field.name}
                name={field.name}
                value={field.value}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-violet-500 bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                disabled={loading}
              />
              {/* SHOW/HIDE PASSWORD BUTTON */}
              <button
                type="button"
                onClick={() => field.setState((prev) => !prev)}
                className="absolute cursor-pointer right-3 top-2.5 text-[var(--light-text)] hover:text-gray-700"
                disabled={loading}
              >
                {/* EYE ICON */}
                {field.state ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        ))}
      </section>
      {/* DELETE ACCOUNT SECTION */}
      <section className="space-y-3">
        {/* SECTION TITLE */}
        <p className="font-medium border-b text-lg border-[var(--border)] pb-2">
          Delete Account
        </p>
        {/* WARNING MESSAGE */}
        <p className="text-[var(--light-text)]">
          Once you delete your account, there's{" "}
          <span className="font-semibold text-[var(--high-priority-color)]">
            no going back
          </span>
          . Please be certain.
        </p>
        {/* DELETE BUTTON */}
        <button
          type="button"
          onClick={handleDeleteUser}
          className="flex items-center gap-2 text-[var(--high-priority-color)] hover:text-white border border-red-500 cursor-pointer hover:bg-red-500 transition rounded-lg px-4 py-2 font-medium w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {/* TRASH ICON */}
          <Trash2 size={16} />
          {/* BUTTON TEXT */}
          {loading ? "Deleting..." : "Delete your account"}
        </button>
      </section>
      {/* FOOTER BUTTONS */}
      <div className="pt-6 flex justify-end gap-3 border-t border-[var(--border)]">
        {/* CANCEL BUTTON */}
        <button
          type="button"
          className="w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--hover-bg)] px-6 py-2.5 cursor-pointer rounded-lg font-medium transition disabled:opacity-50"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
        {/* SAVE BUTTON */}
        <button
          type="button"
          className="w-full sm:w-auto text-white px-6 py-2.5 rounded-lg cursor-pointer font-medium transition disabled:opacity-50 disabled:bg-violet-400"
          style={{ backgroundColor: "var(--accent-color)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--accent-btn-hover-color)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--accent-color)")
          }
          onClick={handleSave}
          disabled={loading || !hasChanges}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Account;
