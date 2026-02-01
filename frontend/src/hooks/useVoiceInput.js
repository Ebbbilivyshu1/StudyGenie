import { useState, useEffect, useCallback } from 'react';

const useVoiceInput = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onstart = () => setIsListening(true);
            recognitionInstance.onend = () => setIsListening(false);
            recognitionInstance.onerror = (event) => {
                setError(event.error);
                setIsListening(false);
            };
            recognitionInstance.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
            };

            setRecognition(recognitionInstance);
        } else {
            setError('Speech recognition not supported in this browser.');
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognition) {
            setTranscript('');
            setError(null);
            recognition.start();
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
        }
    }, [recognition]);

    return { isListening, transcript, startListening, stopListening, error, resetTranscript: () => setTranscript('') };
};

export default useVoiceInput;
