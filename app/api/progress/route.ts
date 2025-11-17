import { NextResponse } from "next/server";
import { connectionToDatabase } from "@/lib/mongoose";
import { VideoProgress } from "@/models/VideoProgress";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, playlistId, videoId, progress } = body;

    if (!userId || !playlistId || !videoId) {
      return NextResponse.json({ ok: false, error: "missing params" }, { status: 400 });
    }

    await connectionToDatabase();

    const existing = await VideoProgress.findOne({ user: userId, playlist: playlistId, videoId });
    if (existing) {
      existing.progress = progress ?? existing.progress;
      existing.completed = (progress ?? existing.progress) >= 100;
      existing.watchedAt = new Date();
      await existing.save();
      return NextResponse.json({ ok: true, progress: existing });
    }

    const doc = await VideoProgress.create({
      user: userId,
      playlist: playlistId,
      videoId,
      progress: progress ?? 0,
      completed: (progress ?? 0) >= 100,
      watchedAt: new Date(),
    });

    return NextResponse.json({ ok: true, progress: doc });
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

    const items = await VideoProgress.find({ user: userId, playlist: playlistId });
    return NextResponse.json({ ok: true, progress: items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: (error as any).message || "error" }, { status: 500 });
  }
}
