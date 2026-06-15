<h1 align="center">
  <br>
  ⚙️ HireWise Backend
  <br>
</h1>

<h4 align="center">The robust Node.js/Express API powering the HireWise AI Career Platform.</h4>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#ai-integration">AI Integration</a> •
  <a href="#installation">Installation</a> •
  <a href="#api-structure">API Structure</a>
</p>

## Overview

The HireWise backend serves as the core engine for the platform. It handles secure user authentication, stores career data in MongoDB, parses uploaded PDF resumes, and acts as the secure intermediary bridging the frontend client with **Google's Gemini AI**.

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **AI Model:** [@google/genai](https://www.npmjs.com/package/@google/genai) (Gemini)
- **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/) & Google Auth Library
- **File Handling:** [Multer](https://www.npmjs.com/package/multer) & [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- **Security:** bcryptjs, cors, dotenv

## AI Integration

This backend heavily leverages the `gemini-2.5-flash` model for various complex NLP tasks. The `aiService.js` handles:
1. **Resume Screening:** Comparing parsed PDF text against job descriptions to extract missing skills and calculate match percentages.
2. **Cover Letter Generation:** Utilizing context from the user's uploaded resume to draft personalized cover letters.
3. **Career Roadmapping:** Generating structured JSON data for 1-6 month learning paths based on the user's current skills.
4. **Mock Interview Evaluation:** Generating tailored interview questions and evaluating entire conversational transcripts to output structured, scored feedback.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tanmay-7706/HireWise_Backend.git
   cd HireWise_Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Structure

The API is structured around several core domains, completely secured behind JWT authentication middleware:

- `/api/auth` - Email/Password & Google OAuth registration and login.
- `/api/user` - User profile management.
- `/api/resume` - PDF uploading, parsing, screening, and Cover Letter generation.
- `/api/jd` - Job Description CRUD operations.
- `/api/mockjd` - Pre-configured sample job descriptions for practice.
- `/api/career` - AI Career Roadmap generation.
- `/api/interview` - Mock interview initialization, chat streaming, and post-interview analytics.

## License

MIT