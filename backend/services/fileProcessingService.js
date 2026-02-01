const pdf = require('pdf-parse');
const mammoth = require('mammoth');

class FileProcessingService {
    async extractText(file) {
        if (!file) throw new Error('No file provided');

        try {
            if (file.mimetype === 'application/pdf') {
                const data = await pdf(file.buffer);
                return data.text;
            } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const result = await mammoth.extractRawText({ buffer: file.buffer });
                return result.value;
            } else {
                throw new Error(`Unsupported file type: ${file.mimetype}`);
            }
        } catch (error) {
            console.error('File processing error:', error);
            throw new Error('Failed to process file: ' + error.message);
        }
    }
}

module.exports = new FileProcessingService();
