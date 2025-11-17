# Assignment Generator Setup

The assignment generator creates AI-powered PDF assignments for each video using Google's Gemini API.

## Setup Instructions

### 1. Get Your Gemini API Key

1. Go to https://ai.google.dev/
2. Click "Get API Key" 
3. Create a new project or use existing one
4. Copy your API key

### 2. Add API Key to .env.local

Open `.env.local` in the root directory and replace:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

with your actual API key:
```
GEMINI_API_KEY=AIzaSyC...your_actual_key_here
```

### 3. Restart the Dev Server

```bash
npm run dev
```

## Features

- **AI-Generated Assignments**: Creates comprehensive assignments based on video content
- **PDF Export**: Automatically generates professional PDF documents
- **Multiple Formats**: Includes:
  - Learning Objectives
  - Key Concepts Summary
  - Multiple Choice Questions
  - Short Answer Questions
  - Essay Questions
  - Critical Thinking Tasks
  - Resources & References

## Usage

1. Click the **"Generate Assignment"** button below any video
2. The system will analyze the video title and metadata
3. Gemini AI generates comprehensive assignment content
4. A PDF is automatically created and downloaded

## API Endpoints

### POST /api/generate-assignment

Generates assignment content for a video.

**Request Body:**
```json
{
  "videoTitle": "String",
  "videoDescription": "String (optional)",
  "duration": "Number (optional)"
}
```

**Response:**
```json
{
  "ok": true,
  "assignment": "Generated assignment text",
  "videoTitle": "Video title"
}
```

## Troubleshooting

- **"GEMINI_API_KEY is not set"**: Make sure you added the key to `.env.local` and restarted the dev server
- **API Rate Limit**: Free tier has rate limits. Wait a moment before generating another assignment
- **PDF Generation Fails**: Check browser console for errors

## Costs

Google's Gemini API has a free tier with:
- 60 requests per minute
- Unlimited daily requests (with rate limiting)
- Perfect for development and small-scale usage

For production, consider upgrading to a paid plan.
