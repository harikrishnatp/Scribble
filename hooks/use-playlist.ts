"use client"

import { useState, useEffect } from "react"
import { fetchPlaylistDetails, type YouTubePlaylist } from "@/lib/youtube-service"

export function usePlaylist(playlistId: string | null) {
  const [playlist, setPlaylist] = useState<YouTubePlaylist | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!playlistId) return

    const loadPlaylist = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchPlaylistDetails(playlistId)
        setPlaylist(data)
      } catch (err) {
        setError("Failed to load playlist. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPlaylist()
  }, [playlistId])

  const markVideoCompleted = (videoId: string, completed: boolean) => {
    if (!playlist) return

    setPlaylist({
      ...playlist,
      videos: playlist.videos.map((video) => (video.id === videoId ? { ...video, completed } : video)),
    })

    // In a real app, you would save this to a database
  }

  return {
    playlist,
    isLoading,
    error,
    markVideoCompleted,
  }
}
