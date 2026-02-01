import { useState } from 'react';
import Tesseract from 'tesseract.js';

const useImageOCR = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const extractText = async (imageFile) => {
        setIsProcessing(true);
        setError(null);
        try {
            const result = await Tesseract.recognize(
                imageFile,
                'eng',
                { logger: m => console.log(m) }
            );
            setIsProcessing(false);
            return result.data.text;
        } catch (err) {
            console.error('OCR Error:', err);
            setError('Failed to extract text from image');
            setIsProcessing(false);
            return null;
        }
    };

    return { extractText, isProcessing, error };
};

export default useImageOCR;
