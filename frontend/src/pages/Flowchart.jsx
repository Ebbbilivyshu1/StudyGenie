import { useState, useEffect } from 'react';
import { studyAPI } from '../services/api';
import { Workflow, Loader } from 'lucide-react';
import mermaid from 'mermaid';

const Flowchart = () => {
    const [content, setContent] = useState('');
    const [flowchart, setFlowchart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    }, []);

    useEffect(() => {
        if (flowchart?.mermaid) {
            try {
                mermaid.contentLoaded();
            } catch (err) {
                console.error('Mermaid render error:', err);
            }
        }
    }, [flowchart]);

    const handleGenerate = async () => {
        if (content.trim().length < 50) {
            setError('Please provide at least 50 characters of text');
            return;
        }

        setLoading(true);
        setError('');
        setFlowchart(null);

        try {
            const response = await studyAPI.generateFlowchart(content);
            setFlowchart(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate flowchart');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 text-white animate-fade-in">
                    <Workflow className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-2">Flowchart Generator</h1>
                    <p className="text-white/80">Create visual process flowcharts</p>
                </div>

                <div className="card mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Input Content</h2>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your process description here..."
                        className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                    />

                    {error && (
                        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={loading || content.trim().length < 50}
                        className="btn-primary w-full mt-4 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader className="w-5 h-5 animate-spin" />
                                Generating Flowchart...
                            </span>
                        ) : (
                            'Generate Flowchart'
                        )}
                    </button>
                </div>

                {/* Flowchart Visualization */}
                {flowchart?.mermaid && (
                    <div className="card overflow-x-auto">
                        <div className="mermaid" key={flowchart.mermaid}>
                            {flowchart.mermaid}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Flowchart;
