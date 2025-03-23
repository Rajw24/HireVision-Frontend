import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/Toaster';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MockInterview from './pages/MockInterview';
import MockInterviewLanding from './pages/MockInterviewLanding';
import ResumeBuilder from './pages/ResumeBuilder';
import QuestionBank from './pages/QuestionBank';
import AptitudeTest from './pages/AptitudeTest';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function AppContent() {
  const location = useLocation();

  // Function to check if the current route should show footer
  const shouldShowFooter = () => {
    return !['/mock-interview/start', '/login', '/signup'].includes(location.pathname);
  };

  // Function to check if the current route should show navbar
  const shouldShowNavbar = () => {
    return !['/mock-interview/start'].includes(location.pathname);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar() && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mock-interview" element={<MockInterviewLanding />} />
        <Route path="/mock-interview/start" element={<MockInterview />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/aptitude-test" element={<AptitudeTest />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      {shouldShowFooter() && <Footer />}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;