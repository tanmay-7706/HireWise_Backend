const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function analyzeResume(resumeText, jobDescription = '') {
    try {
        let prompt = `You are an expert resume analyzer. Analyze this resume and provide CLEAN TEXT output (no markdown, no asterisks, no special formatting).

RESUME:
${resumeText}

Provide analysis in this EXACT format (use plain text only, no ** or ## symbols):

KEY SKILLS IDENTIFIED:
• [List each skill on a new line with bullet points]

YEARS OF EXPERIENCE: [X years based on work history]

EDUCATION: [Summarize degrees and institutions]

STRENGTHS:
• [List key strengths]

OVERALL ASSESSMENT: [2-3 sentence professional evaluation]`;

        if (jobDescription) {
            prompt += `

JOB DESCRIPTION:
${jobDescription}

ADDITIONAL ANALYSIS:

MATCH SCORE: [0-100]% - [Brief justification]

MISSING SKILLS:
• [List specific skills from JD that are absent]

BEST MATCHING EXPERIENCES:
• [List experiences that align with the role]

RECOMMENDATIONS TO IMPROVE MATCH:
1. [Specific actionable recommendation]
2. [Specific actionable recommendation]
3. [Specific actionable recommendation]

Remember: Output ONLY plain text. Do NOT use asterisks (*), hashtags (#), or any markdown formatting.`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        // Clean up any remaining markdown from the response
        let cleanText = response.text
            .replace(/\*\*/g, '')         // Remove bold markers
            .replace(/\*/g, '•')          // Replace remaining asterisks with bullets
            .replace(/#{1,6}\s*/g, '')    // Remove headers
            .replace(/`/g, '')            // Remove code markers
            .trim();

        return {
            success: true,
            analysis: cleanText
        };

    } catch (error) {
        console.error('AI Analysis Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function generateInterviewQuestions(jobTitle, level = 'mid', count = 5) {
    try {
        const levelDescriptions = {
            junior: "entry-level with 0-2 years experience",
            mid: "mid-level with 3-5 years experience",
            senior: "senior-level with 6+ years experience"
        };

        const prompt = `You are a hiring manager conducting interviews. Generate ${count} unique and thought-provoking interview questions for a ${levelDescriptions[level] || levelDescriptions.mid} ${jobTitle} position.

Guidelines:
- Mix technical and behavioral questions (60% technical, 40% behavioral)
- Make questions specific to ${jobTitle}, not generic
- Vary difficulty appropriate for ${level} level
- Include scenario-based questions that test problem-solving
- Avoid clichéd questions like "what's your weakness"
- Each question should assess a different skill or competency

Format: Return only the questions, numbered 1-${count}, one per line.

Now generate ${count} original questions:`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text;
        const questions = text
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^\d+\.\s*/, '').trim())
            .filter(q => q.length > 10);

        return {
            success: true,
            questions: questions.slice(0, count)
        };

    } catch (error) {
        console.error('Question Generation Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function evaluateAnswer(question, answer, jobTitle = '') {
    try {
        const contextPrompt = jobTitle ? ` for a ${jobTitle} role` : '';

        const prompt = `You are an experienced interviewer evaluating candidate responses${contextPrompt}.

Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer comprehensively:

1. **Score**: Rate from 0-10 where:
   - 0-3: Poor (major gaps, irrelevant, or unclear)
   - 4-6: Average (meets basic expectations)
   - 7-8: Good (solid answer with clear examples)
   - 9-10: Excellent (exceptional depth, insight, and relevance)

2. **Strengths**: What did the candidate do well?

3. **Areas for Improvement**: What could be enhanced?

4. **Specific Suggestions**: 2-3 concrete ways to improve this answer

Format your response as:
Score: [0-10]
Strengths: [text]
Areas for Improvement: [text]
Suggestions: [text]`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = response.text;
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

async function generateCareerRoadmap(currentSkills, targetRole, experienceLevel = 'beginner') {
    try {
        const skillsStr = currentSkills.length > 0 ? currentSkills.join(', ') : 'Starting from scratch';

        const prompt = `You are a career development expert. Create a personalized, actionable career roadmap for someone who wants to become a "${targetRole}".

**Current Situation:**
- Experience Level: ${experienceLevel}
- Current Skills: ${skillsStr}

**Instructions:**
1. Analyze the gap between current skills and ${targetRole} requirements
2. Create a step-by-step learning path with 4-6 milestones
3. Provide SPECIFIC resources (actual course names, books, platforms)
4. Estimate realistic timeframes based on ${experienceLevel} level commitment
5. Include industry-relevant skills and trends for ${targetRole}

Return ONLY a valid JSON object (no markdown formatting) with this structure:
{
  "overview": "Brief 2-3 sentence summary of the path and what makes this role exciting",
  "skillGap": ["Skill 1 to learn", "Skill 2 to learn"],
  "roadmap": [
    {
      "step": 1,
      "title": "Clear milestone name",
      "description": "Detailed description of what to learn and why it matters",
      "keyTopics": ["Topic 1", "Topic 2", "Topic 3"],
      "resources": [
        "Specific Course: 'Course Name' on Platform",
        "Book: 'Book Title' by Author",
        "Practice: Platform or project idea"
      ],
      "estimatedTime": "X weeks/months for ${experienceLevel}",
      "successMetrics": ["How to know you've mastered this step"]
    }
  ],
  "careerTips": ["Industry-specific tip 1", "Networking tip", "Portfolio advice"]
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let text = response.text;
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

async function chatWithAI(message, jobTitle, context) {
    try {
        const prompt = `You are an AI interviewer conducting a ${jobTitle || 'mock'} interview. 

Previous context: ${context || 'This is the start of the interview.'}

The candidate just said: "${message}"

Respond as a professional interviewer would:
1. If they're ready to start, ask them a relevant interview question
2. If they answered a question, briefly acknowledge and ask a follow-up or new question
3. Be encouraging but professional
4. Keep responses concise (2-3 sentences max)
5. Ask one question at a time

Your response:`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return {
            success: true,
            message: response.text
        };

    } catch (error) {
        console.error('Chat AI Error:', error);
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
    generateCareerRoadmap,
    chatWithAI
};
