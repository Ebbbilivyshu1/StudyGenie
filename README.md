# StudyGenie

A full-stack AI-powered study companion application built with React and Node.js.

## Features

- 🤖 **AI-Powered Study Tools**
  - Text Summarizer
  - Key Points Extractor  
  - Quiz Generator
  - Mind Map Generator
  - Flowchart Generator
  - 24/7 AI Help Bot

- 🔐 **User Authentication**
  - Signup/Login with JWT
  - Password hashing (bcrypt)
  - Profile management
  - Quiz history tracking

- 📁 **Multimodal Support**
  - Text input
  - File uploads (PDF, TXT)
  - Image analysis (OCR)
  - Audio/video content

## Tech Stack

### Frontend
- React 18 + Vite
- React Router for navigation
- Tailwind CSS for styling
- React Flow for mind maps
- Mermaid.js for flowcharts
- Axios for API calls

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Groq AI API
- JWT authentication
- Multer for file uploads

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (v5.0+)
- Groq API Key

### Installation

1. **Install Backend Dependencies**
```powershell
cd backend
npm install
```

2. **Install Frontend Dependencies**
```powershell
cd frontend
npm install
```

3. **Start MongoDB**
```powershell
mongod
```

4. **Start Backend Server**
```powershell
cd backend
npm start
```
Backend runs on: http://localhost:8080

5. **Start Frontend Dev Server**
```powershell
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## Environment Variables

Backend `.env` file is already configured with:
- `PORT=8080`
- `MONGODB_URI=mongodb://localhost:27017/ai_study_companion`
- `JWT_SECRET=your_jwt_secret_key_change_this_in_production`


## Usage

1. Sign up for a new account
2. Login with your credentials
3. Choose any study tool from the dashboard
4. Upload or paste your study material
5. Get AI-generated results
6. Click the chat bot icon for instant help

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset

### Study Features (Protected)
- `POST /api/study/summarize` - Generate summary
- `POST /api/study/key-points` - Extract key points
- `POST /api/study/quiz` - Generate quiz
- `POST /api/study/mind-map` - Generate mind map
- `POST /api/study/flowchart` - Generate flowchart
- `POST /api/study/chat` - Chat with AI bot

### User
- `GET /api/user/profile` - Get user profile
- `POST /api/user/results` - Save quiz result
- `GET /api/user/results` - Get quiz history

## Project Structure

```
quiz generator/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI service)
│   ├── middleware/      # Auth middleware
│   └── server.js        # Entry point
└── frontend/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   ├── context/     # React context (Auth)
    │   ├── services/    # API service
    │   └── App.jsx      # Main app
    └── index.html
```

## License

MIT
