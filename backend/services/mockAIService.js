// Mock AI Service - Returns fake responses for testing
class MockAIService {
    async summarize(content) {
        // Simulate API delay
        await this.delay(1000);

        return `**Summary of your content:**

This text discusses various topics including key concepts and important ideas. The main points have been extracted and condensed for easy understanding.

**Key Takeaways:**
- Main idea 1: Primary concept discussed
- Main idea 2: Supporting arguments presented
- Main idea 3: Conclusions drawn from the content
- Main idea 4: Future implications mentioned
- Main idea 5: Overall significance highlighted`;
    }

    async extractKeyPoints(content) {
        await this.delay(1000);

        return `**Key Points Extracted:**

1. **Primary Concept** - The fundamental idea presented in the first section
2. **Supporting Evidence** - Data and examples that reinforce the main argument
3. **Critical Analysis** - Important evaluation of the presented information
4. **Practical Applications** - Real-world use cases and implementations
5. **Future Considerations** - Potential developments and next steps
6. **Conclusion** - Summary of findings and recommendations`;
    }

    async generateQuiz(content, numberOfQuestions = 5) {
        await this.delay(1500);

        const questions = [];
        for (let i = 0; i < Math.min(numberOfQuestions, 5); i++) {
            questions.push({
                question: `Sample Question ${i + 1}: What is the main concept discussed in section ${i + 1}?`,
                options: [
                    "Option A: First possible answer",
                    "Option B: Second possible answer",
                    "Option C: Third possible answer",
                    "Option D: Fourth possible answer"
                ],
                correctAnswer: i % 4, // Vary the correct answer
                explanation: `The correct answer explains the key concept from the content.`
            });
        }

        return { questions };
    }

    async generateMindMap(content) {
        await this.delay(1200);

        return {
            nodes: [
                { id: "1", label: "Central Topic", type: "central" },
                { id: "2", label: "Main Idea 1", type: "primary" },
                { id: "3", label: "Main Idea 2", type: "primary" },
                { id: "4", label: "Main Idea 3", type: "primary" },
                { id: "2.1", label: "Subtopic 1.1", type: "secondary" },
                { id: "2.2", label: "Subtopic 1.2", type: "secondary" },
                { id: "3.1", label: "Subtopic 2.1", type: "secondary" },
                { id: "3.2", label: "Subtopic 2.2", type: "secondary" }
            ],
            edges: [
                { from: "1", to: "2" },
                { from: "1", to: "3" },
                { from: "1", to: "4" },
                { from: "2", to: "2.1" },
                { from: "2", to: "2.2" },
                { from: "3", to: "3.1" },
                { from: "3", to: "3.2" }
            ]
        };
    }

    async generateFlowchart(content) {
        await this.delay(1000);

        return {
            mermaid: `flowchart TD
    Start[Start Process] --> Input[Receive Input]
    Input --> Process1[Process Data]
    Process1 --> Decision{Check Condition}
    Decision -->|Yes| Action1[Perform Action A]
    Decision -->|No| Action2[Perform Action B]
    Action1 --> Combine[Combine Results]
    Action2 --> Combine
    Combine --> Output[Generate Output]
    Output --> End[End]`
        };
    }

    async chat(userMessage, conversationHistory = []) {
        await this.delay(800);

        const responses = [
            "That's a great question! In general, this topic involves understanding the fundamental principles and applying them in practical scenarios.",
            "I'd be happy to help explain that. The key concept here relates to how different elements interact and influence outcomes.",
            "Excellent question! This is an important area to understand. Let me break it down for you in simple terms.",
            "From a learning perspective, this concept builds on previous knowledge and helps establish a foundation for more advanced topics.",
            "That's an interesting point to explore. The main idea revolves around connecting theory with real-world applications."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return randomResponse + " (Note: This is a mock response for testing. Get a real Gemini API key for actual AI responses!)";
    }

    async analyzeMultimodal(prompt, fileData) {
        await this.delay(1500);
        return "Mock analysis: The uploaded file contains visual/audio content. Real analysis requires a valid Gemini API key.";
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new MockAIService();
