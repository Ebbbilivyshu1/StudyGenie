import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Mic, Paperclip, History, Plus, Trash2, StopCircle, Minus } from 'lucide-react';
import { studyAPI, historyAPI } from '../services/api';
import useVoiceInput from '../hooks/useVoiceInput';
import useImageOCR from '../hooks/useImageOCR';
import { useAuth } from '../context/AuthContext';

const AIHelpBot = () => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false); // Minimize state
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I\'m your AI study assistant. Ask me anything!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // History & Sidebar State
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    // Multi-modal Hooks
    const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceInput();
    const { extractText: extractImageText, isProcessing: isOCRProcessing } = useImageOCR();
    const fileInputRef = useRef(null);

    // Load sessions on open if logged in
    useEffect(() => {
        if (isOpen && isAuthenticated) {
            loadSessions();
        }
    }, [isOpen, isAuthenticated]);

    // Close/Minimize on navigation
    useEffect(() => {
        setIsOpen(false); // Close window on page change
        setIsMinimized(false);
    }, [location]);

    // Handle Voice Transcript
    useEffect(() => {
        if (transcript) {
            setInput(prev => prev + (prev ? ' ' : '') + transcript);
            resetTranscript();
        }
    }, [transcript]);

    const loadSessions = async () => {
        try {
            const { data } = await historyAPI.getSessions();
            setSessions(data);
        } catch (error) {
            console.error('Failed to load sessions', error);
        }
    };

    const loadSessionMessages = async (sessionId) => {
        try {
            setLoading(true);
            const { data } = await historyAPI.getMessages(sessionId);
            const formatted = data.map(msg => ({
                role: msg.role,
                content: msg.content
            }));
            setMessages(formatted.length ? formatted : [{ role: 'assistant', content: 'History loaded. Continue chatting!' }]);
            setCurrentSessionId(sessionId);
            setShowSidebar(false);
        } catch (error) {
            console.error('Failed to load messages', error);
        } finally {
            setLoading(false);
        }
    };

    const createNewSession = async () => {
        try {
            setMessages([{ role: 'assistant', content: 'Hi! New conversation started.' }]);
            setCurrentSessionId(null);
            const { data } = await historyAPI.createSession('New Chat');
            setCurrentSessionId(data._id);
            setSessions(prev => [data, ...prev]);
            setShowSidebar(false);
        } catch (error) {
            console.error('Failed to create session', error);
        }
    };

    const deleteSession = async (e, sessionId) => {
        e.stopPropagation();
        try {
            await historyAPI.deleteSession(sessionId);
            setSessions(prev => prev.filter(s => s._id !== sessionId));
            if (currentSessionId === sessionId) {
                setMessages([{ role: 'assistant', content: 'Session deleted. Start a new chat!' }]);
                setCurrentSessionId(null);
            }
        } catch (error) {
            console.error('Failed to delete session', error);
        }
    };

    const resetSession = () => {
        setMessages([{ role: 'assistant', content: 'Hi! I\'m your AI study assistant. Ask me anything!' }]);
        setCurrentSessionId(null);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            let text = '';
            if (file.type.startsWith('image/')) {
                text = await extractImageText(file);
            } else {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await studyAPI.extractText(formData);
                text = data.text;
            }

            if (text) {
                setInput(prev => prev + `\n[Context from ${file.name}]:\n${text}\n`);
            } else {
                alert('Could not extract text from file.');
            }
        } catch (error) {
            console.error('File processing failed', error);
            alert('Failed to process file.');
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading || isOCRProcessing) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const conversationHistory = messages
                .filter((_, i) => i !== 0)
                .map(msg => ({
                    role: msg.role === 'assistant' ? 'assistant' : 'user',
                    content: msg.content
                }));

            let activeSessionId = currentSessionId;
            if (isAuthenticated && !activeSessionId) {
                const { data } = await historyAPI.createSession(input.substring(0, 30) + '...');
                activeSessionId = data._id;
                setCurrentSessionId(activeSessionId);
                setSessions(prev => [data, ...prev]);
            }

            const response = await studyAPI.chat(input, conversationHistory, activeSessionId);
            const assistantMessage = { role: 'assistant', content: response.data.response };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => {
                        setIsOpen(true);
                        setIsMinimized(false);
                    }}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 z-50 animate-float"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && !isMinimized && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex overflow-hidden z-50 animate-fade-in font-sans">
                    {/* Sidebar (History) */}
                    {isAuthenticated && showSidebar && (
                        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300">
                            <div className="p-3 border-b flex justify-between items-center bg-purple-50">
                                <span className="font-bold text-gray-700">History</span>
                                <button onClick={() => setShowSidebar(false)}><X className="w-4 h-4" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2">
                                <button
                                    onClick={createNewSession}
                                    className="w-full flex items-center space-x-2 p-2 bg-white border border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 mb-2"
                                >
                                    <Plus className="w-4 h-4" /> <span>New Chat</span>
                                </button>
                                {sessions.map(session => (
                                    <div
                                        key={session._id}
                                        onClick={() => loadSessionMessages(session._id)}
                                        className={`group flex justify-between items-center p-2 rounded-lg cursor-pointer text-sm mb-1 ${currentSessionId === session._id ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-200 text-gray-700'}`}
                                    >
                                        <div className="truncate flex-1 pr-2">{session.title}</div>
                                        <button
                                            onClick={(e) => deleteSession(e, session._id)}
                                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col w-full">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex justify-between items-center shadow-md">
                            <div className="flex items-center space-x-2">
                                {isAuthenticated && (
                                    <button onClick={() => setShowSidebar(!showSidebar)} className="hover:bg-white/20 p-1 rounded transition-all">
                                        <History className="w-5 h-5" />
                                    </button>
                                )}
                                <MessageCircle className="w-5 h-5" />
                                <span className="font-semibold text-lg">StudyGenie <span className="text-xs bg-red-500 text-white px-1 rounded">DEBUG v2</span></span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={resetSession}
                                    className="hover:bg-white/20 p-1 rounded-full transition-all"
                                    title="Start New Chat"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="hover:bg-white/20 p-1 rounded-full transition-all"
                                    title="Minimize Chat"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/20 p-1 rounded-full transition-all"
                                    title="Close Window"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {(loading || isOCRProcessing) && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex space-x-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        {isOCRProcessing && <span className="text-xs text-gray-400 mt-1 block">Reading image...</span>}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                    {/* File Input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*,.pdf,.docx"
                                        onChange={handleFileUpload}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
                                        title="Attach file"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>

                                    {/* Voice Input */}
                                    <button
                                        onClick={isListening ? stopListening : startListening}
                                        className={`p-2 rounded-full transition-all ${isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}
                                        title="Voice Input"
                                    >
                                        {isListening ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </button>

                                    {/* Text Input */}
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder={isListening ? "Listening..." : "Ask anything (text, voice, docs)..."}
                                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:border-purple-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors"
                                        disabled={loading || isOCRProcessing}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={loading || !input.trim()}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full hover:scale-105 transition-all disabled:opacity-50 shadow-lg"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Minimized Bar */}
            {isOpen && isMinimized && (
                <div
                    className="fixed bottom-6 right-6 w-60 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg p-2 flex justify-between items-center cursor-pointer z-50"
                    onClick={() => setIsMinimized(false)}
                >
                    <span className="font-semibold">StudyGenie</span>
                    <X className="w-5 h-5" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} />
                </div>
            )}
        </>
    );
};

export default AIHelpBot;
