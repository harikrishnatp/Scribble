import { NextResponse } from "next/server";
import { connectionToDatabase } from "@/lib/mongoose";
import { Assignment } from "@/models/Assignment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, playlistId, assignmentId, title, submission } = body;

    if (!userId || !playlistId || !assignmentId) {
      return NextResponse.json({ ok: false, error: "missing params" }, { status: 400 });
    }

    await connectionToDatabase();

    const doc = await Assignment.create({
      user: userId,
      playlist: playlistId,
      assignmentId,
      title,
      submission,
      submitted: !!submission,
      submittedAt: submission ? new Date() : undefined,
    });

    return NextResponse.json({ ok: true, assignment: doc });
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

    const items = await Assignment.find({ user: userId, playlist: playlistId });
    return NextResponse.json({ ok: true, assignments: items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: (error as any).message || "error" }, { status: 500 });
  }
}
