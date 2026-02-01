import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, Key, Brain, GitBranch, Workflow, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    const navItems = [
        { to: '/home', icon: Home, label: 'Home' },
        { to: '/summarizer', icon: BookOpen, label: 'Summarizer' },
        { to: '/key-points', icon: Key, label: 'Key Points' },
        { to: '/quiz', icon: Brain, label: 'Quiz' },
        { to: '/mind-map', icon: GitBranch, label: 'Mind Map' },
        { to: '/flowchart', icon: Workflow, label: 'Flowchart' },
    ];

    return (
        <nav className="glass-effect sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/home" className="flex items-center space-x-2">
                        <Brain className="w-8 h-8 text-white" />
                        <span className="text-xl font-bold text-white">StudyGenie</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex space-x-4">
                        {navItems.map(({ to, icon: Icon, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/profile"
                            className="flex items-center space-x-2 text-white hover:bg-white/20 px-3 py-2 rounded-lg transition-all"
                        >
                            <User className="w-5 h-5" />
                            <span className="hidden md:inline">{user?.name}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1 text-white hover:bg-red-500/20 px-3 py-2 rounded-lg transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
