"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DownloadButtonProps {
  videoId: string
  videoTitle: string
  size?: "sm" | "lg" | "default"
  variant?: "outline" | "default" | "ghost"
  className?: string
}

export function DownloadButton({
  videoId,
  videoTitle,
  size = "sm",
  variant = "outline",
  className = "",
}: DownloadButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Handle 'D' key press for download menu
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "d" && !event.ctrlKey && !event.metaKey) {
        // Don't trigger if user is typing in input
        const target = event.target as HTMLElement
        const isTyping =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.contentEditable === "true"

        if (!isTyping) {
          event.preventDefault()
          setIsOpen((prev) => !prev)
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  const handleDirectDownload = async (quality: string = "low") => {
    setIsDownloading(true)
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          videoTitle,
          quality,
        }),
      })

      const data = await response.json()

      if (data.ok && data.downloadUrl) {
        // Show success message
        alert(`✅ Download ready!\n\nFile: ${data.fileName}\nSize: ${data.fileSize ? formatBytes(data.fileSize) : 'calculating...'}\nQuality: ${data.quality}`)
        
        // Create a temporary link and click it
        const link = document.createElement("a")
        link.href = data.downloadUrl
        link.download = data.fileName || `${videoTitle}.mp4`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert("❌ Download failed: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Download error:", error)
      alert("❌ Failed to download video. Check the server logs for details.")
    } finally {
      setIsDownloading(false)
      setIsOpen(false)
    }
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const downloadServices = [
    {
      name: "🎵 Audio Only",
      description: "Fastest - MP3 only (~5-10MB)",
      quality: "audio",
    },
    {
      name: "📹 Low Quality",
      description: "Fast - 360p (~20-50MB)",
      quality: "low",
    },
    {
      name: "🎬 Medium Quality",
      description: "Balanced - 480p (~50-150MB)",
      quality: "medium",
    },
    {
      name: "🎥 Best Quality",
      description: "Slow - Best available",
      quality: "best",
    },
  ]

  const handleDownload = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={`gap-2 ${className}`}
          title="Download video - Press D"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-zinc-900 border border-zinc-700">
        <DropdownMenuLabel className="text-white">Download Video</DropdownMenuLabel>
        <DropdownMenuLabel className="text-xs text-gray-400 font-normal">
          {videoTitle}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        {downloadServices.map((service) => (
          <DropdownMenuItem
            key={service.quality}
            className="flex flex-col items-start gap-1 p-3 cursor-pointer hover:bg-zinc-800 rounded-md"
            onSelect={() => handleDirectDownload(service.quality)}
            disabled={isDownloading}
          >
            <div className="flex items-center gap-2 w-full">
              <span className="font-medium text-white">{service.name}</span>
              {isDownloading ? (
                <Loader2 className="h-3 w-3 text-gray-400 animate-spin" />
              ) : (
                <Download className="h-3 w-3 text-gray-400" />
              )}
            </div>
            <span className="text-xs text-gray-400">{service.description}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-zinc-800" />
        <div className="px-3 py-2 text-xs text-gray-500 space-y-1">
          <div>ℹ️ Downloads using yt-dlp directly</div>
          <div className="text-gray-600">⌨️ Press <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-xs">D</kbd> to toggle</div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
