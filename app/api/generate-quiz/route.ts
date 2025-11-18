import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error: "GEMINI_API_KEY is not set. Add it to your .env file",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { videoTitle, videoDescription, numberOfQuestions = 5 } = body;

    if (!videoTitle) {
      return NextResponse.json(
        { ok: false, error: "Video title is required" },
        { status: 400 }
      );
    }

    const prompt = `Generate a quiz with ${numberOfQuestions} multiple-choice questions for a video titled "${videoTitle}".
${videoDescription ? `Video description: ${videoDescription}` : ""}

Create questions that test understanding of key concepts from this video.

IMPORTANT: Return ONLY a valid JSON array with no additional text, markdown formatting, or code blocks. The response must be parseable JSON.

Format each question exactly like this:
[
  {
    "id": "q1",
    "question": "What is the main concept covered in this video?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of why this is correct and why other options are incorrect."
  }
]

Rules:
- Generate exactly ${numberOfQuestions} questions
- Each question must have exactly 4 options
- correctAnswer must be the index (0, 1, 2, or 3) of the correct option
- Questions should test different aspects: concepts, applications, analysis
- Make explanations detailed and educational
- Ensure questions are specific to the video topic
- Return ONLY the JSON array, nothing else`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    let quizText = result.response.text();

    // Clean up the response - remove markdown code blocks if present
    quizText = quizText.trim();
    quizText = quizText.replace(/```json\n?/g, "");
    quizText = quizText.replace(/```\n?/g, "");
    quizText = quizText.trim();

    // Parse the JSON
    let questions;
    try {
      questions = JSON.parse(quizText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", quizText);
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to parse quiz questions. Please try again.",
        },
        { status: 500 }
      );
    }

    // Validate the structure
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid quiz format generated. Please try again.",
        },
        { status: 500 }
      );
    }

    // Validate each question has required fields
    for (const q of questions) {
      if (
        !q.id ||
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctAnswer !== "number" ||
        !q.explanation
      ) {
        return NextResponse.json(
          {
            ok: false,
            error: "Invalid question format. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      questions,
      videoTitle,
    });
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    
    // Handle rate limit errors specifically
    let errorMessage = error.message || "Failed to generate quiz";
    let statusCode = 500;
    
    if (error.message?.includes("quota") || error.message?.includes("rate limit") || error.message?.includes("429")) {
      errorMessage = "⏱️ Rate limit reached! Please wait 1 minute and try again. Free tier allows 15 requests per minute.";
      statusCode = 429;
    } else if (error.message?.includes("API key")) {
      errorMessage = "🔑 Invalid API key. Please check your GEMINI_API_KEY in .env file.";
      statusCode = 401;
    }
    
    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}
