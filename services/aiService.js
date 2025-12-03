const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeResume(resumeText, jobDescription = '') {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        let prompt = `Analyze the following resume and provide:
1. Key skills identified (list them)
2. Years of experience (estimate)
3. Education background
4. Overall assessment

Resume:
${resumeText}`;

        if (jobDescription) {
            prompt += `\n\nJob Description:
${jobDescription}

Also provide:
5. Match score (0-100) for this job
6. Missing skills or keywords
7. Recommendations for improvement`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysis = response.text();

        return {
            success: true,
            analysis: analysis
        };

    } catch (error) {
        console.error('AI Analysis Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function generateInterviewQuestions(jobTitle, count = 5) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Generate ${count} interview questions for a ${jobTitle} position. 
Include a mix of technical and behavioral questions.
Format: Return only the questions, one per line, numbered.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const questions = text
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .filter(q => q.length > 0);

        return {
            success: true,
            questions: questions
        };

    } catch (error) {
        console.error('Question Generation Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function evaluateAnswer(question, answer) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Evaluate this interview answer:

Question: ${question}
Answer: ${answer}

Provide:
1. Score (0-10)
2. Brief feedback (2-3 sentences)
3. Suggestions for improvement

Format your response as:
Score: [number]
Feedback: [text]
Suggestions: [text]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const scoreMatch = text.match(/Score:\s*(\d+)/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;

        return {
            success: true,
            score: score,
            feedback: text
        };

    } catch (error) {
        console.error('Answer Evaluation Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function generateCareerRoadmap(currentSkills, targetRole) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Create a detailed career roadmap for a user wanting to become a "${targetRole}".
        
User's Current Skills: ${currentSkills.join(', ')}

Provide a step-by-step roadmap to bridge the gap.
Format the response as a JSON object with the following structure:
{
  "overview": "Brief summary of the path",
  "roadmap": [
    {
      "step": 1,
      "title": "Step Title",
      "description": "Detailed description of what to learn",
      "resources": ["Resource 1", "Resource 2"],
      "estimatedTime": "e.g. 2 weeks"
    }
  ]
}
Return ONLY the JSON object, no markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text);

        return {
            success: true,
            data: data
        };

    } catch (error) {
        console.error('Roadmap Generation Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    analyzeResume,
    generateInterviewQuestions,
    evaluateAnswer,
    generateCareerRoadmap
};
