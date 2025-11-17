import { NextResponse } from "next/server";
import { connectionToDatabase } from "@/lib/mongoose";
import { Playlist } from "@/models/PlaylistModel";
import { User } from "@/models/UserModel";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playlistId, title, description, userId, thumbnail, videos } = body;

    await connectionToDatabase();

    // avoid duplicates
    let existing = await Playlist.findOne({ playlistId });
    if (existing) {
      return NextResponse.json({ ok: true, playlist: existing });
    }

    const playlist = await Playlist.create({
      playlistId,
      title,
      description,
      user: userId,
      thumbnail,
      videos,
      totalVideos: Array.isArray(videos) ? videos.length : 0,
    });

    // attach to user
    if (userId) {
      await User.findByIdAndUpdate(userId, { $addToSet: { playlists: playlist._id } });
    }

    return NextResponse.json({ ok: true, playlist });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: (error as any).message || "error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const playlistId = url.searchParams.get("playlistId");

    if (!playlistId) {
      return NextResponse.json({ ok: false, error: "playlistId required" }, { status: 400 });
    }

    await connectionToDatabase();

    const playlist = await Playlist.findOne({ playlistId }).populate("user");

    if (!playlist) {
      return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, playlist });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: (error as any).message || "error" }, { status: 500 });
  }
}
