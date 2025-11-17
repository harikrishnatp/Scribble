"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward } from "lucide-react"
import { DownloadButton } from "@/components/download-button"

interface VideoPlayerProps {
  videoId: string
  title: string
  onProgress: (progress: number) => void
  onComplete: () => void
}

export function VideoPlayer({ videoId, title, onProgress, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      const progress = (video.currentTime / video.duration) * 100
      onProgress(progress)

      // Mark as complete when watched 90% of the video
      if (progress >= 90) {
        onComplete()
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [onProgress, onComplete])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Number.parseFloat(e.target.value)
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = Number.parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  return (
    <Card className="overflow-hidden bg-gray-900 border-gray-800">
      <CardContent className="p-0 relative">
        <div className="absolute inset-x-0 top-0 p-4 text-lg text-white bg-gradient-to-b from-black/50 to-transparent z-10">
          <div className="line-clamp-1">{title}</div>
        </div>

        <video
          ref={videoRef}
          className="w-full aspect-video"
          poster={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
        >
          <source src={`https://www.youtube.com/watch?v=${videoId}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent z-10">
          <div className="px-4 py-2">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 p-3 pt-0 text-white">
            <Button size="icon" variant="ghost" className="w-9 h-9 hover:bg-black/50" onClick={togglePlay}>
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>

            <DownloadButton
              videoId={videoId}
              videoTitle={title}
              size="sm"
              variant="ghost"
              className="hover:bg-black/50"
            />

            <Button size="icon" variant="ghost" className="w-9 h-9 hover:bg-black/50">
              <SkipForward className="w-6 h-6" />
            </Button>

            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="w-9 h-9 hover:bg-black/50" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </Button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <Button size="icon" variant="ghost" className="ml-auto w-9 h-9 hover:bg-black/50">
              <Maximize className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
