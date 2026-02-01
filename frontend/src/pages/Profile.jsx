import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, TrendingUp, Calendar } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await userAPI.getResults();
                setResults(response.data);
            } catch (err) {
                console.error('Failed to fetch results:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const totalQuizzes = results.length;
    const averageScore = results.length > 0
        ? results.reduce((sum, r) => sum + (r.score / r.total) * 100, 0) / results.length
        : 0;

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="card mb-6 animate-fade-in">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
                            <p className="text-gray-600">{user?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-blue-600 mb-2">
                                <TrendingUp className="w-5 h-5" />
                                <span className="font-semibold">Average Score</span>
                            </div>
                            <p className="text-3xl font-bold text-blue-700">{averageScore.toFixed(1)}%</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-purple-600 mb-2">
                                <Calendar className="w-5 h-5" />
                                <span className="font-semibold">Total Quizzes</span>
                            </div>
                            <p className="text-3xl font-bold text-purple-700">{totalQuizzes}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-green-600 mb-2">
                                <TrendingUp className="w-5 h-5" />
                                <span className="font-semibold">Best Score</span>
                            </div>
                            <p className="text-3xl font-bold text-green-700">
                                {results.length > 0
                                    ? Math.max(...results.map(r => (r.score / r.total) * 100)).toFixed(0)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz History</h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 mx-auto"></div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-3">
                            {results.map((result) => (
                                <div key={result._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{result.quizTitle}</h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(result.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-purple-600">
                                            {result.score}/{result.total}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {Math.round((result.score / result.total) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No quiz results yet. Start taking quizzes to see your progress!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
