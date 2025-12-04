const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeResume(resumeText, jobDescription = '') {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-pro',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        });

        let prompt = `You are an expert resume analyzer and career coach. Analyze the following resume with a critical yet constructive eye.

Resume:
${resumeText}

Provide a detailed analysis including:
1. **Key Skills Identified**: List the specific technical and soft skills mentioned
2. **Years of Experience**: Estimate based on work history and dates
3. **Education Background**: Summarize degrees, certifications, and institutions
4. **Strengths**: What makes this resume stand out?
5. **Overall Assessment**: Professional evaluation in 2-3 sentences`;

        if (jobDescription) {
            prompt += `\n\nJob Description:
${jobDescription}

Additionally provide:
6. **Match Score**: Rate the fit from 0-100 with justification
7. **Missing Skills**: List specific skills/keywords from the JD that are absent
8. **Alignment**: Which experiences best match this role?
9. **Recommendations**: 3-5 specific, actionable improvements to increase match score`;
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

async function generateInterviewQuestions(jobTitle, level = 'mid', count = 5) {
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-pro',
            generationConfig: {
                temperature: 0.9, // Higher temp for more variety
                maxOutputTokens: 1024,
            }
        });

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

Example style:
1. How would you approach debugging a production issue where...
2. Describe a time when you had to make a difficult technical decision...

Now generate ${count} original questions:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const questions = text
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^\\d+\\.\\s*/, '').trim())
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
        const model = genAI.getGenerativeModel({
            model: 'gemini-pro',
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 800,
            }
        });

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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const scoreMatch = text.match(/Score:\\s*(\\d+)/i);
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
        const model = genAI.getGenerativeModel({
            model: 'gemini-pro',
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 3000,
            }
        });

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
