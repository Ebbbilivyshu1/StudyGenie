import { useNavigate } from 'react-router-dom';
import { BookOpen, Key, Brain, GitBranch, Workflow, Sparkles } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: BookOpen,
            title: 'Summarizer',
            description: 'Get concise summaries of long texts',
            path: '/summarizer',
            color: 'from-blue-500 to-blue-600'
        },
        {
            icon: Key,
            title: 'Key Points',
            description: 'Extract the most important points',
            path: '/key-points',
            color: 'from-green-500 to-green-600'
        },
        {
            icon: Brain,
            title: 'Quiz Generator',
            description: 'Test your knowledge with AI quizzes',
            path: '/quiz',
            color: 'from-purple-500 to-purple-600'
        },
        {
            icon: GitBranch,
            title: 'Mind Map',
            description: 'Visualize concepts hierarchically',
            path: '/mind-map',
            color: 'from-orange-500 to-orange-600'
        },
        {
            icon: Workflow,
            title: 'Flowchart',
            description: 'Create process flowcharts',
            path: '/flowchart',
            color: 'from-pink-500 to-pink-600'
        },
    ];

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <Sparkles className="w-12 h-12" />
                        AI Study Companion
                    </h1>
                    <p className="text-xl text-white/90">
                        Supercharge your learning with AI-powered study tools
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate(feature.path)}
                            className="card cursor-pointer group hover:-translate-y-2 animate-fade-in"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                            <div className="mt-4 text-purple-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                Get Started →
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 card text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">✨ Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <div>
                            <h3 className="font-semibold text-purple-600 mb-2">📄 Multi-format Support</h3>
                            <p className="text-sm text-gray-600">Text, PDFs, images, audio, and video</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-purple-600 mb-2">🤖 AI-Powered</h3>
                            <p className="text-sm text-gray-600">Powered by Groq AI for accuracy</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-purple-600 mb-2">💬 24/7 Help Bot</h3>
                            <p className="text-sm text-gray-600">Ask questions anytime with our AI assistant</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
