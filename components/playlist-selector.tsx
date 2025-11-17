"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { YoutubeIcon } from "lucide-react"

interface PlaylistSelectorProps {
  onPlaylistSelect: (playlistUrl: string) => void
}

export function PlaylistSelector({ onPlaylistSelect }: PlaylistSelectorProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const playlistUrl = formData.get("playlistUrl") as string

    if (playlistUrl) {
      onPlaylistSelect(playlistUrl)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <YoutubeIcon className="h-5 w-5 text-white" />
          Import YouTube Playlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              name="playlistUrl"
              placeholder="Paste YouTube playlist URL"
              className="bg-zinc-800 border-zinc-600 text-white"
            />
          </div>
          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 font-semibold">
            Import Playlist
          </Button>
          <p className="text-xs text-gray-400 text-center">You can only have one active playlist at a time</p>
        </form>
      </CardContent>
    </Card>
  )
}
