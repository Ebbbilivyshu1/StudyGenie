const Groq = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Model to use
const MODEL_NAME = 'llama-3.3-70b-versatile'; // Latest stable model

class AIService {
    async callGroq(prompt, systemMessage = '') {
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemMessage || 'You are a helpful AI study assistant.' },
                    { role: 'user', content: prompt }
                ],
                model: MODEL_NAME,
                temperature: 0.7,
                max_tokens: 4096,
            });

            return completion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Groq API Error:', error);
            throw new Error('AI service unavailable: ' + error.message);
        }
    }

    // Summarize text
    async summarize(content) {
        const prompt = `Analyze the following content and create a comprehensive yet concise summary. Focus on the main ideas, key arguments, and important details. Structure your response with clear paragraphs and include 3-5 key takeaways as bullet points at the end.

Content: ${content}`;

        return await this.callGroq(prompt, 'You are an expert summarizer.');
    }

    // Extract key points
    async extractKeyPoints(content) {
        const prompt = `Extract 5-7 most important key points from this content. Each point should be:
- Self-contained and actionable
- Ranked by importance
- Distinct and non-repetitive
- Clear and concise

Return as a numbered list.

Content: ${content}`;

        return await this.callGroq(prompt, 'You are an expert at extracting key insights.');
    }

    // Generate quiz
    async generateQuiz(content, numberOfQuestions = 5) {
        const prompt = `Create ${numberOfQuestions} multiple-choice questions based STRICTLY on the provided content.

Requirements:
- Questions must test understanding, not just recall
- Each question MUST have exactly 4 options (A, B, C, D)
- Only ONE correct answer per question
- Incorrect options should be plausible but clearly wrong
- Include a brief explanation for the correct answer
- Return as valid JSON ONLY (no markdown, no code blocks)

JSON Format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct"
    }
  ]
}

Content: ${content}`;

        const text = await this.callGroq(prompt, 'You are a quiz generator. Output only valid JSON.');

        // Extract JSON from markdown code blocks if present
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
        const jsonText = jsonMatch ? jsonMatch[1] : text;

        try {
            // Clean any potential trailing commas or markdown
            const cleanedJson = jsonText.trim().replace(/,(\s*[}\]])/g, '$1');
            return JSON.parse(cleanedJson);
        } catch (e) {
            console.error('Failed to parse quiz JSON:', text);
            return { questions: [], error: 'Failed to parse quiz format', rawText: text };
        }
    }

    // Generate mind map structure
    async generateMindMap(content) {
        const prompt = `Analyze this content and create a hierarchical mind map structure.

Identify:
- Central topic (1 main concept)
- Primary branches (3-5 major themes)
- Secondary branches (2-4 subtopics per primary)

Return as JSON ONLY (no markdown, no code blocks):
{
  "nodes": [
    { "id": "1", "label": "Central Topic", "type": "central" },
    { "id": "2", "label": "Primary 1", "type": "primary" },
    { "id": "2.1", "label": "Secondary 1.1", "type": "secondary" }
  ],
  "edges": [
    { "from": "1", "to": "2" },
    { "from": "2", "to": "2.1" }
  ]
}

Content: ${content}`;

        const text = await this.callGroq(prompt, 'You are a visualization expert. Output only valid JSON.');

        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
        const jsonText = jsonMatch ? jsonMatch[1] : text;

        try {
            return JSON.parse(jsonText);
        } catch (e) {
            console.error('Failed to parse mind map JSON:', text);
            return { nodes: [], edges: [], error: 'Failed to parse mind map', rawText: text };
        }
    }

    // Generate flowchart
    async generateFlowchart(content) {
        const prompt = `Convert this content into a logical flowchart using Mermaid syntax.

Identify:
- Process steps in sequence
- Decision points (if/else conditions)
- Start and end points

Return ONLY valid Mermaid flowchart syntax (no explanations, no markdown code blocks).
Start with 'flowchart TD'.

Content: ${content}`;

        let text = await this.callGroq(prompt, 'You are a systems analyst. Output only Mermaid syntax.');

        // Clean up the mermaid syntax
        text = text.replace(/```mermaid\n/g, '').replace(/```\n/g, '').replace(/```/g, '').trim();

        return { mermaid: text };
    }

    // Chat assistant
    async chat(userMessage, conversationHistory = []) {
        let messages = [
            { role: 'system', content: 'You are a knowledgeable study assistant helping students learn. Answer questions clearly and concisely. Provide examples when helpful. If unsure, admit it rather than guessing. Keep responses to 150-200 words for readability.' }
        ];

        // Add history
        if (conversationHistory.length > 0) {
            conversationHistory.slice(-5).forEach(msg => {
                messages.push({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                });
            });
        }

        messages.push({ role: 'user', content: userMessage });

        try {
            const completion = await groq.chat.completions.create({
                messages: messages,
                model: MODEL_NAME,
                temperature: 0.7,
                max_tokens: 1024,
            });
            return completion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Groq Chat Error:', error);
            return "I'm having trouble connecting right now. Please try again later.";
        }
    }

    // Multimodal support 
    async analyzeMultimodal(prompt, fileData) {
        // Groq Llava model supports images
        // We'll use llama-3.2-11b-vision-preview for vision if available, or fail gracefully
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${fileData.mimeType};base64,${fileData.data}`
                                }
                            }
                        ]
                    }
                ],
                model: 'llama-3.2-11b-vision-preview',
                temperature: 0.7,
                max_tokens: 1024,
            });
            return completion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('Groq Vision Error:', error);
            return "Analysis failed. Ensure you are using a supported image format.";
        }
    }
}

module.exports = new AIService();
