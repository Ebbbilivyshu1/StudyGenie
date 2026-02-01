import { useState, useEffect } from 'react';
import { studyAPI } from '../services/api';
import { GitBranch, Loader } from 'lucide-react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const MindMap = () => {
    const [content, setContent] = useState('');
    const [mindMap, setMindMap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const handleGenerate = async () => {
        if (content.trim().length < 50) {
            setError('Please provide at least 50 characters of text');
            return;
        }

        setLoading(true);
        setError('');
        setMindMap(null);

        try {
            const response = await studyAPI.generateMindMap(content);
            setMindMap(response.data);

            // Convert to React Flow format
            if (response.data.nodes) {
                const flowNodes = response.data.nodes.map((node, idx) => ({
                    id: node.id,
                    data: { label: node.label },
                    position: calculatePosition(idx, response.data.nodes.length, node.type),
                    style: {
                        background: node.type === 'central' ? '#7c3aed' : node.type === 'primary' ? '#3b82f6' : '#10b981',
                        color: 'white',
                        border: '2px solid #fff',
                        borderRadius: '12px',
                        padding: '10px 20px',
                        fontSize: node.type === 'central' ? '16px' : '14px',
                        fontWeight: node.type === 'central' ? 'bold' : 'normal'
                    }
                }));

                const flowEdges = response.data.edges?.map((edge, idx) => ({
                    id: `e-${idx}`,
                    source: edge.from,
                    target: edge.to,
                    animated: true,
                    style: { stroke: '#94a3b8' }
                })) || [];

                setNodes(flowNodes);
                setEdges(flowEdges);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate mind map');
        } finally {
            setLoading(false);
        }
    };

    const calculatePosition = (index, total, type) => {
        if (type === 'central') {
            return { x: 400, y: 250 };
        }

        const radius = type === 'primary' ? 250 : 180;
        const angle = (index / total) * 2 * Math.PI;
        return {
            x: 400 + radius * Math.cos(angle),
            y: 250 + radius * Math.sin(angle)
        };
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 text-white animate-fade-in">
                    <GitBranch className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-2">Mind Map Generator</h1>
                    <p className="text-white/80">Visualize concepts hierarchically</p>
                </div>

                <div className="card mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Input Content</h2>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your text here..."
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
                                Generating Mind Map...
                            </span>
                        ) : (
                            'Generate Mind Map'
                        )}
                    </button>
                </div>

                {/* Mind Map Visualization */}
                {nodes.length > 0 && (
                    <div className="card" style={{ height: '600px' }}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            fitView
                            attributionPosition="bottom-left"
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MindMap;
