"use server"

import { cookies } from "next/headers"

export async function authenticateWithYouTube(formData: FormData) {
  // In a real app, this would redirect to the YouTube OAuth flow
  // and then store the access token in a secure cookie or database

  const playlistUrl = formData.get("playlistUrl") as string

  // Extract playlist ID from URL
  const playlistId = extractPlaylistId(playlistUrl)

  if (!playlistId) {
    return { error: "Invalid YouTube playlist URL" }
  }

  // Set a mock token in cookies
  cookies().set("youtube_access_token", "mock_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })

  return { success: true, playlistId }
}

function extractPlaylistId(url: string): string | null {
  try {
    const urlObj = new URL(url)

    // Handle different YouTube URL formats
    if (urlObj.hostname.includes("youtube.com")) {
      // Format: https://www.youtube.com/playlist?list=PLAYLIST_ID
      const playlistId = urlObj.searchParams.get("list")
      if (playlistId) return playlistId
    }

    return null
  } catch (error) {
    return null
  }
}
