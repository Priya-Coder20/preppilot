import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("practiceQuestions");
    localStorage.removeItem("practiceSettings");
    localStorage.removeItem("practiceResult");
    localStorage.removeItem("attemptId");

    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">

      {/* Logo */}

      <div
        className="navbar-logo"
        onClick={() => navigate("/dashboard")}
      >
        PrepPilot
      </div>

      {/* Navigation */}

      <div className="navbar-links">

        {/* Dashboard */}

        <button
          className={
            isActive("/dashboard")
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        {/* Practice */}

        <button
          className={
            location.pathname.startsWith("/practice")
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() => navigate("/practice")}
        >
          Practice
        </button>

        {/* Question Bank */}

        <button
          className={
            isActive("/question-bank")
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() => navigate("/question-bank")}
        >
          Question Bank
        </button>

        {/* Resume Analyzer */}

        <button
          className={
            isActive("/resume-analyzer")
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() => navigate("/resume-analyzer")}
        >
          Resume Analyzer
        </button>

        {/* User */}

        <div className="navbar-user">

          <div className="navbar-avatar">
            P
          </div>

          <span>
            Candidate
          </span>

        </div>

        {/* Account */}

        <button
          className={
            isActive("/account")
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() => navigate("/account")}
        >
          Account
        </button>

        {/* Logout */}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;