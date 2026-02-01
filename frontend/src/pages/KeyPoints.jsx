import { useState } from 'react';
import { studyAPI } from '../services/api';
import { Key, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const KeyPoints = () => {
    const [content, setContent] = useState('');
    const [keyPoints, setKeyPoints] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleExtract = async () => {
        if (content.trim().length < 50) {
            setError('Please provide at least 50 characters of text');
            return;
        }

        setLoading(true);
        setError('');
        setKeyPoints('');

        try {
            const response = await studyAPI.extractKeyPoints(content);
            setKeyPoints(response.data.keyPoints);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to extract key points');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8 text-white animate-fade-in">
                    <Key className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-2">Key Points Extractor</h1>
                    <p className="text-white/80">Extract the most important insights</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Input Content</h2>

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste your text here..."
                            className="w-full h-64 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                        />

                        {error && (
                            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleExtract}
                            disabled={loading || content.trim().length < 50}
                            className="btn-primary w-full mt-4 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Extracting...
                                </span>
                            ) : (
                                'Extract Key Points'
                            )}
                        </button>
                    </div>

                    {/* Output Section */}
                    <div className="card">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Key Points</h2>

                        {keyPoints ? (
                            <div className="prose prose-sm max-w-none">
                                <ReactMarkdown>{keyPoints}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <Key className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>Key points will appear here</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyPoints;
