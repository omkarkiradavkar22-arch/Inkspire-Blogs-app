import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import VideoBackground from "./components/VideoBackground";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import MyBlogs from "./pages/MyBlogs";
import SavedBlogs from "./pages/SavedBlogs";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import BlogDetails from "./pages/BlogDetails";
import AuthorProfile from "./pages/AuthorProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <VideoBackground>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/blog/:id" element={
            <ProtectedRoute><BlogDetails /></ProtectedRoute>
          } />
          <Route path="/author/:userId" element={
            <ProtectedRoute><AuthorProfile /></ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute><CreatePost /></ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute><EditPost /></ProtectedRoute>
          } />
          <Route path="/myblogs" element={
            <ProtectedRoute><MyBlogs /></ProtectedRoute>
          } />
          <Route path="/saved-blogs" element={
            <ProtectedRoute><SavedBlogs /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/profile/edit" element={
            <ProtectedRoute><EditProfile /></ProtectedRoute>
          } />
        </Routes>
      </VideoBackground>
    </Router>
  );
}

export default App;