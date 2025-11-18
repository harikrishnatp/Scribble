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
    const { videoTitle, videoDescription } = body;

    if (!videoTitle) {
      return NextResponse.json(
        { ok: false, error: "Video title is required" },
        { status: 400 }
      );
    }

    const prompt = `Generate comprehensive, well-structured notes for a video titled "${videoTitle}".
${videoDescription ? `Video description: ${videoDescription}` : ""}

Create detailed notes that include:
1. Key concepts and main ideas
2. Important definitions
3. Step-by-step explanations
4. Examples and use cases
5. Tips and best practices
6. Summary and takeaways

Format the notes in a clear, organized way with:
- Headings and subheadings
- Bullet points for lists
- Clear paragraphs
- Easy to read structure

Make the notes comprehensive yet concise, suitable for learning and review.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const notesText = result.response.text();

    return NextResponse.json({
      ok: true,
      notes: notesText,
      videoTitle,
    });
  } catch (error: any) {
    console.error("Notes generation error:", error);
    
    let errorMessage = error.message || "Failed to generate notes";
    let statusCode = 500;
    
    if (error.message?.includes("quota") || error.message?.includes("rate limit") || error.message?.includes("429")) {
      errorMessage = "⏱️ Rate limit reached! Please wait 1 minute and try again.";
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
