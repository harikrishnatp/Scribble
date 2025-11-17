import { NextResponse } from "next/server";
import { connectionToDatabase } from "@/lib/mongoose";
import { QuizResult } from "@/models/QuizResult";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, playlistId, quizId, score, totalQuestions, answers } = body;

    if (!userId || !playlistId || !quizId) {
      return NextResponse.json({ ok: false, error: "missing params" }, { status: 400 });
    }

    await connectionToDatabase();

    const doc = await QuizResult.create({
      user: userId,
      playlist: playlistId,
      quizId,
      score,
      totalQuestions,
      answers: answers || [],
      completedAt: new Date(),
    });

    return NextResponse.json({ ok: true, result: doc });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: (error as any).message || "error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const playlistId = url.searchParams.get("playlistId");

    if (!userId || !playlistId) {
      return NextResponse.json({ ok: false, error: "userId and playlistId required" }, { status: 400 });
    }

    await connectionToDatabase();

    const items = await QuizResult.find({ user: userId, playlist: playlistId });
    return NextResponse.json({ ok: true, results: items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: (error as any).message || "error" }, { status: 500 });
  }
}
