import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Leaderboard from "./pages/Leaderboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import QuestionList from "./pages/QuestionList";
import QuestionDetails from "./pages/QuestionDetails";
import Bookmarks from "./pages/Bookmarks";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import AdminLogin from "./pages/AdminLogin";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminQuestions from "./pages/AdminQuestions";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminUsers from "./pages/AdminUsers";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC PAGES */}
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/questions/:category" element={<QuestionList />} />
        <Route path="/questions/:category/:id" element={<QuestionDetails />} />

        {/* PROTECTED STUDENT PAGES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/take-test" element={<Quiz />} />
          <Route path="/take-test/result" element={<QuizResult />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/result" element={<QuizResult />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* PROTECTED ADMIN PAGES */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<AdminQuestions />} />
          <Route path="/admin/quizzes" element={<AdminQuizzes />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;