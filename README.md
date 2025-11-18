# 📚 Scribble - AI-Powered YouTube Learning Platform

![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-15.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange)

Transform YouTube playlists into interactive, structured learning experiences with **AI-powered quizzes**, **smart notes**, and **personalized assignments**. Scribble makes online learning engaging, organized, and effective.

---

## ✨ Features

### 🎓 **Structured Learning**
- Convert YouTube playlists into organized courses
- Track progress for each video and playlist
- Mark videos as completed
- Visual progress indicators

### 📝 **Smart Notes System**
- **General Notes**: Write and save notes for each video
- **AI-Generated Notes**: Automatically create comprehensive study notes
- **Timestamped Notes**: Add notes at specific video moments (e.g., `2:30`)
- Click timestamps to jump to that point in the video
- Word count tracking and auto-save

### 🧠 **AI-Powered Quizzes**
- Generate dynamic quizzes for any video using Gemini AI
- 5 multiple-choice questions per video
- Detailed explanations for each answer
- Instant scoring and feedback
- Retake or generate new quizzes anytime
- Quiz results cached locally

### 📄 **Assignment Generator**
- Create comprehensive PDF assignments
- Includes MCQs, short answers, and essay questions
- Customizable for specific exams (JEE, NEET, GATE, etc.)
- Download assignments as beautifully formatted PDFs
- Powered by AI for contextual content

### 📚 **Documentation Hub**
- Curated resources and references
- Organized by video
- Easy access to supplementary materials

### 🎨 **Beautiful Dark Mode**
- Modern, sleek interface
- Optimized for extended learning sessions
- Responsive design for all devices

### 🔒 **Secure Authentication**
- Sign up/login with Clerk
- User data protection
- Personalized dashboard

---

## 🚀 Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[shadcn/ui](https://ui.shadcn.com/)** - UI components
- **[Lucide React](https://lucide.dev/)** - Icons

### Backend & APIs
- **[Google Gemini AI](https://ai.google.dev/)** - Quiz & notes generation (`gemini-2.5-flash`)
- **[YouTube Data API](https://developers.google.com/youtube/v3)** - Fetch playlist data
- **[MongoDB](https://www.mongodb.com/)** - Database (Mongoose ODM)
- **[Clerk](https://clerk.dev/)** - Authentication

### Additional Libraries
- **[jsPDF](https://github.com/parallax/jsPDF)** - PDF generation
- **[Recharts](https://recharts.org/)** - Data visualization
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[html2canvas](https://html2canvas.hertzen.com/)** - Screenshot capture

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ and pnpm
- YouTube Data API Key
- Google Gemini API Key
- MongoDB Atlas account
- Clerk account

### 1. Clone the Repository
```bash
git clone https://github.com/harikrishnatp/Scribble.git
cd Scribble
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# YouTube API
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/scribble

# Clerk Authentication
CLERK_API_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Get API Keys

#### YouTube Data API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable YouTube Data API v3
3. Create credentials → API Key
4. Copy the key

#### Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Get API Key"
3. Copy the key (starts with `AIza...`)

#### MongoDB
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string

#### Clerk
1. Sign up at [Clerk](https://dashboard.clerk.com/)
2. Create an application
3. Copy your API keys

### 5. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
pnpm build
pnpm start
```

---

## 📖 Usage Guide

### Adding a Playlist
1. Go to Dashboard
2. Click "Add New Playlist"
3. Enter YouTube playlist URL or ID
4. Playlist loads with all videos

### Taking Notes
1. Select a video from playlist
2. Go to **General Notes** tab:
   - Click "Generate with AI" for auto-notes
   - Or click "Add Notes" to write manually
3. Go to **Timestamped Notes** tab:
   - Add notes at specific timestamps (`2:30`)
   - Click timestamp to jump to that moment

### Taking Quizzes
1. Go to **Quizzes** tab
2. Click "Generate Quiz with AI"
3. Answer 5 multiple-choice questions
4. Submit and view results with explanations
5. Retake or generate new quiz

### Generating Assignments
1. Go to **Assignments** tab
2. Optionally enter exam type (JEE, NEET, etc.)
3. Click "Generate Assignment"
4. Download as PDF

---

## 📁 Project Structure

```
Scribble/
├── app/
│   ├── api/
│   │   ├── generate-quiz/       # Quiz generation endpoint
│   │   ├── generate-notes/      # Notes generation endpoint
│   │   ├── generate-assignment/ # Assignment generation
│   │   └── ...
│   ├── course/[id]/             # Course detail page
│   ├── dashboard/               # User dashboard
│   └── ...
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── video-notes-enhanced.tsx # Notes component
│   ├── video-quiz.tsx           # Quiz component
│   ├── assignment-generator.tsx # Assignment component
│   └── ...
├── lib/
│   ├── youtube-service.ts       # YouTube API integration
│   ├── mongoose.ts              # MongoDB connection
│   └── utils.ts
├── models/
│   ├── PlaylistModel.ts
│   ├── UserModel.ts
│   └── QuizResult.ts
└── public/
```

---

## 🎯 Key Features Explained

### AI Quiz Generation
- Uses **Gemini 2.5 Flash** model
- Generates contextual questions based on video title/description
- Returns structured JSON with questions, options, and explanations
- Cached in localStorage to avoid regeneration

### Timestamped Notes
- Format: `mm:ss` or `hh:mm:ss`
- Automatically sorted chronologically
- Click to seek video to that timestamp
- Perfect for marking important moments

### Smart Notes Generator
- Analyzes video content
- Creates structured notes with:
  - Key concepts
  - Definitions
  - Examples
  - Best practices
  - Summaries

---

## 🔮 Future Enhancements

- [ ] Video transcription integration
- [ ] Collaborative learning (share playlists)
- [ ] Mobile app (React Native)
- [ ] Export notes as Markdown
- [ ] Spaced repetition for quizzes
- [ ] Integration with Notion/Obsidian
- [ ] Discussion forums per video

---

## 👥 Project Team

This project was created by:

- **Harikrishna T P** - AM.SC.U4CSE23321
- **Joseph T Mathew** - AM.SC.U4CSE23324
- **Gautham Mohanraj** - AM.SC.U4CSE23319

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Clerk](https://clerk.dev/) for authentication
- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [YouTube Data API](https://developers.google.com/youtube/v3) for video data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [MongoDB](https://www.mongodb.com/) for database

---
