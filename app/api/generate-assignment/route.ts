import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error: "GEMINI_API_KEY is not set. Add it to your .env.local file",
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { videoTitle, videoDescription, duration, examType } = body

    if (!videoTitle) {
      return NextResponse.json(
        { ok: false, error: "Video title is required" },
        { status: 400 }
      )
    }

    const examContext = examType ? `This assignment is for ${examType} exam preparation.` : ""

    const prompt = `Generate a comprehensive assignment/worksheet for a video titled "${videoTitle}".
${videoDescription ? `Video description: ${videoDescription}` : ""}
${duration ? `Video duration: ${duration} minutes` : ""}
${examContext}

Please create a detailed assignment with the following structure. Use markdown formatting but ensure it's clean and readable:

Assignment: ${videoTitle}

Learning Objectives
- Objective 1
- Objective 2
- Objective 3
- Objective 4

Key Concepts
Summary of main ideas from the video...

Multiple Choice Questions
Question 1: [Question text]
a) [Option A]
b) [Option B]
c) [Option C] ✓ (Correct)
d) [Option D]

[Repeat for 5 questions total]

Short Answer Questions
Question 1: [Question text]
Your Answer: ___________

Question 2: [Question text]
Your Answer: ___________

[Repeat for 3-4 questions]

Essay/Long Answer Question
Question: [Question text]
Your Answer: ___________

Critical Thinking Task
[Practical exercise description]

Additional Resources & References
- Resource 1
- Resource 2
- Resource 3

Make sure the content is well-structured with proper spacing. Do NOT use # or ## symbols - just use line breaks and indentation for structure.`

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    const result = await model.generateContent(prompt)
    const assignmentText = result.response.text()

    return NextResponse.json({
      ok: true,
      assignment: assignmentText,
      videoTitle,
    })
  } catch (error) {
    console.error("Assignment generation error:", error)
    return NextResponse.json(
      {
        ok: false,
        error: (error as any).message || "Failed to generate assignment",
      },
      { status: 500 }
    )
  }
}
