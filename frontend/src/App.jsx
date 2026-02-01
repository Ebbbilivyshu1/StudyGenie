import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AIHelpBot from './components/AIHelpBot';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Study Pages
import Home from './pages/Home';
import Summarizer from './pages/Summarizer';
import KeyPoints from './pages/KeyPoints';
import QuizGenerator from './pages/QuizGenerator';
import MindMap from './pages/MindMap';
import Flowchart from './pages/Flowchart';
import Profile from './pages/Profile';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen">
                    <Navbar />

                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Protected Routes */}
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/summarizer"
                            element={
                                <ProtectedRoute>
                                    <Summarizer />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/key-points"
                            element={
                                <ProtectedRoute>
                                    <KeyPoints />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/quiz"
                            element={
                                <ProtectedRoute>
                                    <QuizGenerator />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/mind-map"
                            element={
                                <ProtectedRoute>
                                    <MindMap />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/flowchart"
                            element={
                                <ProtectedRoute>
                                    <Flowchart />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirect root to login/home */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>

                    {/* AI Help Bot available on all pages */}
                    <AIHelpBot />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
