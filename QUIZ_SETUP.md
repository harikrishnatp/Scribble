# 🧠 AI-Powered Quiz System Setup

The quiz system uses Google's Gemini API to generate dynamic, contextual quiz questions for each video in your playlists.

---

## 📋 Features

✅ **AI-Generated Questions**: Creates 5 unique multiple-choice questions per video  
✅ **Contextual Content**: Questions are based on video title and description  
✅ **Smart Caching**: Quizzes are cached in localStorage to avoid regenerating  
✅ **Detailed Explanations**: Each answer includes an educational explanation  
✅ **Real-time Scoring**: Instant feedback with percentage scores  
✅ **Retake & Regenerate**: Retake the same quiz or generate a new one  

---

## 🔑 Getting Your Gemini API Key

### Step 1: Access Google AI Studio
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account

### Step 2: Create API Key
1. Click on **"Get API Key"** or **"Create API Key"**
2. Select a project (or create a new one)
3. Click **"Create API Key in new project"** or use existing project
4. Copy the API key that appears (starts with `AIza...`)

### Step 3: Add to Environment Variables
1. Open your `.env` or `.env.local` file
2. Add the following line:
   ```env
   GEMINI_API_KEY=AIzaSyC...your_actual_key_here
   ```
3. Save the file

### Step 4: Restart Development Server
```bash
# Stop the server (Ctrl+C) and restart
pnpm dev
```

---

## 🎯 How to Use

### 1. Navigate to Course Page
- Go to your Dashboard
- Click on any playlist/course

### 2. Select a Video
- Choose any video from the playlist

### 3. Go to Quizzes Tab
- Click on the **"Quizzes"** tab

### 4. Generate Quiz
- Click **"Generate Quiz with AI"** button
- Wait 5-10 seconds for AI to generate questions
- Questions are automatically saved for next time

### 5. Take the Quiz
- Answer all 5 questions
- Click **"Submit Quiz"** to see your score
- View explanations for each answer

### 6. Additional Options
- **Retake**: Attempt the same quiz again
- **New Quiz**: Generate completely new questions for the same video

---

## 🏗️ Technical Implementation

### API Endpoint: `/api/generate-quiz`
```typescript
POST /api/generate-quiz
Content-Type: application/json

{
  "videoTitle": "Introduction to React Hooks",
  "videoDescription": "Learn about useState, useEffect...",
  "numberOfQuestions": 5
}
```

### Response Format
```json
{
  "ok": true,
  "questions": [
    {
      "id": "q1",
      "question": "What is useState used for?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation..."
    }
  ],
  "videoTitle": "Introduction to React Hooks"
}
```

### Caching Strategy
- Quizzes are stored in `localStorage` under key `videoQuizzes`
- Cached by `videoId` to avoid duplicate generation
- Persists across browser sessions
- Can be cleared manually via browser DevTools

---

## 🆓 Gemini API Free Tier

Google's Gemini API offers a generous free tier:

**Using Model: `gemini-1.5-flash-latest`** (Stable, optimized for free tier)

- **15 requests per minute** (RPM)
- **1,500 requests per day**
- **1 million tokens per minute** (TPM)
- **Free forever** for personal use

Perfect for personal projects and learning! 🎉

**Note**: We use `gemini-1.5-flash-latest` which is the stable production model with best free tier support.

For more details: [Gemini API Pricing](https://ai.google.dev/pricing)

---

## 🐛 Troubleshooting

### Error: "GEMINI_API_KEY is not set"
**Solution**: 
1. Check your `.env` file has `GEMINI_API_KEY=your_key`
2. Restart the development server
3. Make sure the file is named `.env` or `.env.local`

### Error: "Quota exceeded" or "Too Many Requests"
**Solution**:
1. **Wait 1 minute** - Free tier allows 15 requests per minute
2. Don't spam the "Generate Quiz" button
3. Quizzes are cached, so you only need to generate once per video
4. If you see "retry in X seconds", just wait that amount of time
5. Consider the daily limit of 1,500 requests

### Quiz Generation Fails
**Solution**:
1. Check your API key is valid at [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Verify you haven't exceeded rate limits (15/min, 1500/day)
3. Check browser console for detailed errors
4. Try generating again in a few seconds
5. Make sure you're using the correct API key (starts with `AIza...`)

### Questions Don't Load
**Solution**:
1. Clear localStorage: `localStorage.removeItem('videoQuizzes')`
2. Refresh the page
3. Generate quiz again

### Invalid JSON Response
**Solution**:
- This is rare but can happen with AI responses
- Click "Generate Quiz with AI" again
- The system includes JSON cleanup logic

---

## 📊 Quiz Data Storage

### Local Storage Structure
```javascript
{
  "videoQuizzes": {
    "VIDEO_ID_1": [
      { /* question 1 */ },
      { /* question 2 */ },
      // ...
    ],
    "VIDEO_ID_2": [
      // ...
    ]
  }
}
```

### Playlist Storage (includes quiz answers)
```javascript
{
  "userPlaylists": [
    {
      "id": "playlist_id",
      "videos": [
        {
          "id": "video_id",
          "title": "...",
          "quizAnswers": {
            "q1": 0,
            "q2": 1,
            // ...
          }
        }
      ]
    }
  ]
}
```

---

## 🎨 UI Components

### VideoQuiz Component
**Location**: `/components/video-quiz.tsx`

**Props**:
- `videoId`: string - YouTube video ID
- `videoTitle`: string - Video title
- `videoDescription`: string - Video description (optional)
- `onSaveQuizAnswers`: Function to save quiz results

**Features**:
- Dynamic quiz generation
- Progress tracking
- Answer validation
- Score calculation
- Explanations with correct/incorrect highlighting

---

## 🔮 Future Enhancements

Potential improvements for the quiz system:

1. **Difficulty Levels**: Easy, Medium, Hard quiz modes
2. **Question Types**: True/False, Multiple answer, Fill in blank
3. **Time Limits**: Add timed quiz mode
4. **Leaderboards**: Compare scores with other learners
5. **Progress Tracking**: Save quiz history to database
6. **Custom Questions**: Allow users to add their own questions
7. **Export/Import**: Share quizzes between users

---

## 📝 Example Quiz Flow

```
1. User clicks "Quizzes" tab
   ↓
2. System checks localStorage for cached quiz
   ↓
3. If not cached:
   - Show "Generate Quiz" button
   - User clicks button
   - API calls Gemini
   - Questions generated & cached
   ↓
4. Display quiz questions
   ↓
5. User answers all questions
   ↓
6. User submits quiz
   ↓
7. System calculates score
   ↓
8. Show results with explanations
   ↓
9. User can retake or generate new quiz
```

---

## ✅ Testing Your Setup

1. **Start the dev server**: `pnpm dev`
2. **Add a playlist** to your dashboard
3. **Select a video** from the playlist
4. **Go to Quizzes tab**
5. **Click "Generate Quiz with AI"**
6. **Wait for generation** (5-10 seconds)
7. **Answer questions** and submit
8. **View your score** and explanations

If everything works, you're all set! 🎉

---

## 💡 Tips

- Generate quizzes after watching videos for better retention
- Read explanations even for correct answers to deepen understanding
- Use "New Quiz" to test yourself with different questions
- Aim for 80%+ scores before moving to next video
- Quiz results are saved per video, so you can track progress

---

## 🤝 Contributing

Have ideas to improve the quiz system? Open an issue or PR!

---

Made with ❤️ using Google Gemini AI
