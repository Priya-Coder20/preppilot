import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    targetRole: "",
    experienceLevel: "Beginner",
    preferredLanguage: "Java",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await api.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.user;

        setUser(data);

        setFormData({
          name: data.name || "",
          email: data.email || "",
          targetRole: data.profile?.targetRole || "",
          experienceLevel:
            data.profile?.experienceLevel || "Beginner",
          preferredLanguage:
            data.profile?.preferredLanguage || "Java",
        });

      } catch (error) {
        console.error("Account error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load account."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await api.put(
        "/profile",
        {
          name: formData.name,
          targetRole: formData.targetRole,
          experienceLevel: formData.experienceLevel,
          preferredLanguage:
            formData.preferredLanguage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        targetRole:
          updatedUser.profile?.targetRole || "",
        experienceLevel:
          updatedUser.profile?.experienceLevel ||
          "Beginner",
        preferredLanguage:
          updatedUser.profile?.preferredLanguage ||
          "Java",
      });

      setSuccess("Account updated successfully.");

    } catch (error) {
      console.error("Update account error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to update account."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="profile-page">
          <div className="profile-message">
            <h2>Loading account...</h2>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <div className="profile-page">
          <div className="profile-message">
            <h2>
              {error || "Account not found."}
            </h2>

            <button
              className="primary-button"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const initial =
    formData.name.charAt(0).toUpperCase() || "P";

  return (
    <>
      <Navbar />

      <div className="profile-page">

        <div className="profile-header">
          <p className="profile-label">
            ACCOUNT
          </p>

          <h1>My Account</h1>

          <p>
            Manage your personal information and
            preparation preferences.
          </p>
        </div>

        <div className="profile-layout">

          <aside className="profile-summary">

            <div className="profile-avatar">
              {initial}
            </div>

            <h2>{formData.name}</h2>

            <p>{formData.email}</p>

            <div className="profile-summary-divider" />

            <div className="profile-summary-item">
              <span>Target Role</span>

              <strong>
                {formData.targetRole ||
                  "Not specified"}
              </strong>
            </div>

            <div className="profile-summary-item">
              <span>Experience</span>

              <strong>
                {formData.experienceLevel}
              </strong>
            </div>

            <div className="profile-summary-item">
              <span>Preferred Language</span>

              <strong>
                {formData.preferredLanguage}
              </strong>
            </div>

          </aside>

          <main className="profile-card">

            <div className="profile-card-header">
              <h2>Account Information</h2>

              <p>
                Update your preparation preferences.
              </p>
            </div>

            <form
              className="profile-form"
              onSubmit={handleSubmit}
            >

              <div className="profile-field">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-field">
                <label>Email Address</label>

                <input
                  type="email"
                  value={formData.email}
                  disabled
                />

                <small>
                  Email address cannot be changed.
                </small>
              </div>

              <div className="profile-field">
                <label>Target Role</label>

                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  placeholder="e.g. Software Developer"
                />
              </div>

              <div className="profile-field">
                <label>Experience Level</label>

                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                >
                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>
                </select>
              </div>

              <div className="profile-field">
                <label>
                  Preferred Programming Language
                </label>

                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                >
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                  <option value="C++">C++</option>
                  <option value="JavaScript">
                    JavaScript
                  </option>
                  <option value="C">C</option>
                </select>
              </div>

              {error && (
                <div className="profile-error">
                  {error}
                </div>
              )}

              {success && (
                <div className="profile-success">
                  {success}
                </div>
              )}

              <div className="profile-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </main>

        </div>

      </div>
    </>
  );
}

export default Account;