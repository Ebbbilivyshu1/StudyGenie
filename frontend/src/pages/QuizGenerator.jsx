import { useState } from 'react';
import { studyAPI, userAPI } from '../services/api';
import { Brain, Loader, CheckCircle, XCircle } from 'lucide-react';

const QuizGenerator = () => {
    const [content, setContent] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState(5);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleGenerate = async () => {
        if (content.trim().length < 50) {
            setError('Please provide at least 50 characters of text');
            return;
        }

        setLoading(true);
        setError('');
        setQuiz(null);
        setAnswers({});
        setSubmitted(false);

        try {
            const response = await studyAPI.generateQuiz(content, numberOfQuestions);
            setQuiz(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!quiz || !quiz.questions) return;

        let correctCount = 0;
        quiz.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                correctCount++;
            }
        });

        setScore(correctCount);
        setSubmitted(true);

        // Save result
        try {
            await userAPI.saveResult({
                score: correctCount,
                total: quiz.questions.length,
                quizTitle: 'AI Generated Quiz'
            });
        } catch (err) {
            console.error('Failed to save result:', err);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8 text-white animate-fade-in">
                    <Brain className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold mb-2">Quiz Generator</h1>
                    <p className="text-white/80">Test your knowledge with AI-generated quizzes</p>
                </div>

                {/* Input Section */}
                <div className="card mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Input Content</h2>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Paste your study material here..."
                        className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                    />

                    <div className="mt-4 flex items-center gap-4">
                        <label className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">Number of questions:</span>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={numberOfQuestions}
                                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                                className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                            />
                        </label>
                    </div>

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
                                Generating Quiz...
                            </span>
                        ) : (
                            'Generate Quiz'
                        )}
                    </button>
                </div>

                {/* Quiz Display */}
                {quiz && quiz.questions && quiz.questions.length > 0 && (
                    <div className="space-y-6">
                        {quiz.questions.map((question, qIdx) => (
                            <div key={qIdx} className="card">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Question {qIdx + 1}: {question.question}
                                </h3>

                                <div className="space-y-2">
                                    {question.options.map((option, oIdx) => (
                                        <label
                                            key={oIdx}
                                            className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${submitted
                                                    ? oIdx === question.correctAnswer
                                                        ? 'border-green-500 bg-green-50'
                                                        : answers[qIdx] === oIdx
                                                            ? 'border-red-500 bg-red-50'
                                                            : 'border-gray-200'
                                                    : answers[qIdx] === oIdx
                                                        ? 'border-purple-500 bg-purple-50'
                                                        : 'border-gray-200 hover:border-purple-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${qIdx}`}
                                                checked={answers[qIdx] === oIdx}
                                                onChange={() => !submitted && setAnswers({ ...answers, [qIdx]: oIdx })}
                                                disabled={submitted}
                                                className="mr-3"
                                            />
                                            <span>{option}</span>
                                            {submitted && oIdx === question.correctAnswer && (
                                                <CheckCircle className="ml-auto w-5 h-5 text-green-600" />
                                            )}
                                            {submitted && answers[qIdx] === oIdx && oIdx !== question.correctAnswer && (
                                                <XCircle className="ml-auto w-5 h-5 text-red-600" />
                                            )}
                                        </label>
                                    ))}
                                </div>

                                {submitted && question.explanation && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            <strong>Explanation:</strong> {question.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}

                        {!submitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(answers).length !== quiz.questions.length}
                                className="btn-primary w-full disabled:opacity-50"
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <div className="card text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                                <p className="text-2xl">
                                    You scored {score} out of {quiz.questions.length}
                                </p>
                                <p className="mt-2">({Math.round((score / quiz.questions.length) * 100)}%)</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizGenerator;
