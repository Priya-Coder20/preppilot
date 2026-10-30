import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import PracticeQuestions from "./pages/PracticeQuestions";
import Result from "./pages/Result";
import AttemptDetails from "./pages/AttemptDetails";
import QuestionBank from "./pages/QuestionBank";
import Account from "./pages/Account";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
            path="/resume-analyzer"
            element={
                <ProtectedRoute>
                    <ResumeAnalyzer />
                </ProtectedRoute>
            }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/practice/questions"
          element={
            <ProtectedRoute>
              <PracticeQuestions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attempt/:attemptId"
          element={
            <ProtectedRoute>
              <AttemptDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/question-bank"
          element={
            <ProtectedRoute>
              <QuestionBank />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;