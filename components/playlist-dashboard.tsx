"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoList } from "@/components/video-list"
import { PlaylistStats } from "@/components/playlist-stats"
import { RefreshCw, Plus, Trash2, Share2, BookOpen, Youtube, PenTool, CheckCircle2 } from "lucide-react"
import { fetchPlaylistDetails, type YouTubePlaylist } from "@/lib/youtube-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { AchievementCard } from "./achievement"
import Image from "next/image"
import Link from "next/link"
import { VideoModal } from "./playvideos"

export function PlaylistDashboard() {
  const { user } = useUser()
  const router = useRouter()
  const [playlistUrl, setPlaylistUrl] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
  const [currentPlaylist, setCurrentPlaylist] = useState<YouTubePlaylist | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAchievementOpen, setIsAchievementOpen] = useState(false)
  const [completedVideos, setCompletedVideos] = useState(0)
  const [savedPlaylists, setSavedPlaylists] = useState<YouTubePlaylist[]>([])
  const [showImportForm, setShowImportForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const playlists = JSON.parse(localStorage.getItem("userPlaylists") || "[]")
    setSavedPlaylists(playlists)
  }, [])

  const openModal = (url: string) => {
    setCurrentVideoUrl(url)
    setIsModalOpen(true)
  }

  const handleShareProgress = () => {
    setIsAchievementOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playlistUrl) return

    setIsLoading(true)
    setError(null)

    try {
      const playlistId = extractPlaylistId(playlistUrl)

      if (!playlistId) {
        throw new Error("Invalid YouTube playlist URL")
      }

      const playlist = await fetchPlaylistDetails(playlistId)
      const normalizedPlaylist = {
        ...playlist,
        videos: playlist.videos.map((video) => ({
          ...video,
          completed: video.completed ?? false,
        })),
      }

      let existingPlaylists = JSON.parse(localStorage.getItem("userPlaylists") || "[]")

      if (!Array.isArray(existingPlaylists)) {
        existingPlaylists = []
      }

      const isDuplicate = existingPlaylists.some((p: any) => p.id === normalizedPlaylist.id)
      if (isDuplicate) {
        throw new Error("This playlist is already saved.")
      }

      const updatedPlaylists = [...existingPlaylists, normalizedPlaylist]
      localStorage.setItem("userPlaylists", JSON.stringify(updatedPlaylists))
      setSavedPlaylists(updatedPlaylists)
      setShowImportForm(false)
      setPlaylistUrl("")
      
      // Redirect to the course detail page
      router.push(`/course/${normalizedPlaylist.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load playlist")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProgressUpdate = (completed: number) => {
    setCompletedVideos(completed)
  }

  const handleReset = () => {
    setCurrentPlaylist(null)
    setPlaylistUrl("")
    setCompletedVideos(0)
    setShowImportForm(false)
  }

  const handleDeletePlaylist = (playlistId: string) => {
    const updated = savedPlaylists.filter((p) => p.id !== playlistId)
    setSavedPlaylists(updated)
    localStorage.setItem("userPlaylists", JSON.stringify(updated))
    if (currentPlaylist?.id === playlistId) {
      setCurrentPlaylist(null)
    }
  }

  function extractPlaylistId(url: string): string | null {
    try {
      const urlObj = new URL(url)

      if (urlObj.hostname.includes("youtube.com")) {
        const playlistId = urlObj.searchParams.get("list")
        if (playlistId) return playlistId
      }

      if (/^[A-Za-z0-9_-]{10,}$/.test(url)) {
        return url
      }

      return null
    } catch (error) {
      return null
    }
  }

  return (
    <div className="min-h-screen text-white">
      {/* Background layers removed - parent handles it */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-12">
        {!currentPlaylist ? (
          <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold">My Courses</h1>
                    <p className="text-sm text-gray-400">Continue your learning journey</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setShowImportForm(!showImportForm)}
                className="bg-white text-black hover:bg-gray-100 gap-2 font-semibold px-6 h-11 rounded-lg shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Add Course</span>
              </Button>
            </div>

            {/* Import Form (Collapsible) */}
            {showImportForm && (
              <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-8 border-b border-zinc-700">
                  <h2 className="text-2xl font-bold mb-2">Add New Course</h2>
                  <p className="text-gray-400">Import a YouTube playlist to start learning</p>
                </div>

                <CardContent className="pt-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <label htmlFor="playlist-url" className="text-sm font-semibold text-gray-200">
                        YouTube Playlist URL
                      </label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                          <Input
                            id="playlist-url"
                            placeholder="https://www.youtube.com/playlist?list=..."
                            value={playlistUrl}
                            onChange={(e) => setPlaylistUrl(e.target.value)}
                            className="bg-zinc-800/50 border border-zinc-600 pl-12 h-12 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 h-12 px-6 font-semibold rounded-lg shadow-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Loading
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Import
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Stats Overview */}
            {savedPlaylists.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Courses</p>
                        <p className="text-4xl font-bold mt-2 text-white">{savedPlaylists.length}</p>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                        <BookOpen className="h-7 w-7 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-cyan-600/10 to-cyan-600/5 border border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Videos</p>
                        <p className="text-4xl font-bold mt-2 text-white">
                          {savedPlaylists.reduce((sum, p) => sum + p.totalVideos, 0)}
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center">
                        <Youtube className="h-7 w-7 text-cyan-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Learning Streak</p>
                        <p className="text-4xl font-bold mt-2 text-white">0</p>
                        <p className="text-xs text-gray-500 mt-1">days consecutive</p>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center">
                        <CheckCircle2 className="h-7 w-7 text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Courses Grid */}
            {savedPlaylists.length > 0 ? (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-bold">Your Courses</h2>
                    <p className="text-sm text-gray-400 mt-1">{savedPlaylists.length} courses to explore</p>
                  </div>
                  <div className="w-full md:w-72">
                    <Input
                      placeholder="🔍 Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-zinc-800/50 border border-zinc-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPlaylists
                    .filter(
                      (playlist) =>
                        playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        playlist.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((playlist) => (
                    <Link key={playlist.id} href={`/course/${playlist.id}`}>
                      <Card
                        className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700 overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer group h-full shadow-lg hover:shadow-cyan-500/20"
                      >
                      <div className="relative h-40 bg-zinc-800 overflow-hidden">
                        {playlist.thumbnailUrl && (
                          <Image
                            src={playlist.thumbnailUrl || "/placeholder.svg"}
                            alt={playlist.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/70 transition-colors" />
                        <Badge className="absolute top-3 right-3 bg-cyan-600 text-white font-semibold">
                          {playlist.totalVideos} videos
                        </Badge>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            {playlist.title}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">{playlist.channelTitle}</p>
                        </div>

                        <div className="w-full bg-zinc-800/50 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{playlist.totalDuration}</span>
                          <div className="flex gap-1">
                            <Link href={`/course/${playlist.id}`}>
                              <Button
                                size="sm"
                                className="gap-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <BookOpen className="h-4 w-4" />
                                Open
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="gap-1 text-white hover:bg-zinc-800"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeletePlaylist(playlist.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white"
                            style={{
                              width: `${Math.min((completedVideos / playlist.totalVideos) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    </Link>
                  ))}
                </div>
                {searchQuery &&
                  savedPlaylists.filter(
                    (playlist) =>
                      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      playlist.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border border-zinc-700">
                      <CardContent className="py-16 px-6">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-700 flex items-center justify-center mx-auto">
                            <Youtube className="h-8 w-8 text-gray-500" />
                          </div>
                          <h3 className="text-xl font-semibold">No Courses Found</h3>
                          <p className="text-gray-400 max-w-sm mx-auto">
                            No courses match "{searchQuery}"
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border border-zinc-700">
                <CardContent className="py-20 px-6">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto">
                      <BookOpen className="h-10 w-10 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Start Learning Today</h3>
                      <p className="text-gray-400 max-w-sm mx-auto mt-2">
                        Import your first YouTube playlist to begin your educational journey
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowImportForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 gap-2 font-semibold px-6 h-11"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Import Your First Course</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {currentPlaylist.thumbnailUrl && (
                  <Image
                    src={currentPlaylist.thumbnailUrl || "/placeholder.svg"}
                    alt={currentPlaylist.title}
                    width={100}
                    height={56}
                    className="rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">{currentPlaylist.title}</h1>
                  <p className="text-sm text-gray-400">
                    {currentPlaylist.channelTitle} • {currentPlaylist.totalVideos} videos • {currentPlaylist.totalDuration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-zinc-700 text-white hover:bg-zinc-800"
                  onClick={handleShareProgress}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-zinc-700 text-white hover:bg-zinc-800"
                  onClick={handleReset}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isAchievementOpen && (
              <Modal onClose={() => setIsAchievementOpen(false)}>
                <AchievementCard
                  userData={{
                    email: user?.primaryEmailAddress?.emailAddress ?? "",
                    completedVideos,
                    playlistName: currentPlaylist.title,
                    playlistUrl: playlistUrl,
                    avatarUrl: "/profile.webp",
                    thumbnailUrl: currentPlaylist.thumbnailUrl,
                  }}
                />
              </Modal>
            )}

            {/* Tabs */}
            <Tabs defaultValue="videos" className="w-full">
              {isModalOpen && currentVideoUrl && (
                <VideoModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  youtubeUrl={currentVideoUrl}
                  onVideoComplete={() => {
                    if (currentPlaylist) {
                      const updatedVideos = currentPlaylist.videos.map((v) =>
                        v.id === currentVideoId ? { ...v, completed: true } : v
                      )
                      setCurrentPlaylist({ ...currentPlaylist, videos: updatedVideos })
                      setCompletedVideos((prev) => prev + 1)
                    }
                  }}
                />
              )}

              <TabsList className="bg-transparent border-b border-zinc-700 mb-6">
                <TabsTrigger value="videos" className="data-[state=active]:border-b-2 data-[state=active]:border-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Videos
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:border-b-2 data-[state=active]:border-white">
                  <PenTool className="h-4 w-4 mr-2" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="assignments" className="data-[state=active]:border-b-2 data-[state=active]:border-white">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Assignments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="videos">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <VideoList 
                      playlist={currentPlaylist} 
                      onProgressUpdate={handleProgressUpdate} 
                      onOpenModal={openModal}
                      onVideoProgressUpdate={(videoId, completed) => {
                        // Update localStorage when video completion changes
                        const updated = savedPlaylists.map((p) => 
                          p.id === currentPlaylist.id 
                            ? {
                                ...p,
                                videos: p.videos.map((v: any) =>
                                  v.id === videoId ? { ...v, completed } : v
                                )
                              }
                            : p
                        );
                        localStorage.setItem('userPlaylists', JSON.stringify(updated));
                        setSavedPlaylists(updated);
                      }}
                    />
                  </div>
                  <div className="space-y-6">
                    <PlaylistStats
                      playlist={{
                        ...currentPlaylist,
                        completedVideos,
                      }}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes">
                <div className="space-y-4">
                  {currentPlaylist?.videos && currentPlaylist.videos.length > 0 ? (
                    <div className="grid gap-4">
                      {currentPlaylist.videos.map((video: any, idx: number) => (
                        <Card key={video.id} className="bg-zinc-900 border border-zinc-700">
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{idx + 1}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base truncate">{video.title}</CardTitle>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {video.notes ? (
                              <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
                                <p className="text-sm text-gray-200 whitespace-pre-wrap break-words line-clamp-4">{video.notes}</p>
                                <p className="text-xs text-gray-500 mt-3">
                                  {video.notes.trim().split(/\s+/).length} words
                                </p>
                              </div>
                            ) : (
                              <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700 border-dashed flex items-center justify-center min-h-[80px]">
                                <p className="text-sm text-gray-500">No notes for this video</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 backdrop-blur-sm text-center">
                      <p className="text-gray-400">No videos in this playlist yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="assignments">
                <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-4">My Assignments</h2>
                  <p className="text-gray-400 mb-6">Track your progress on assignments for each video</p>
                  <div className="min-h-[300px] bg-zinc-800/30 rounded-lg p-4 border border-zinc-700 flex items-center justify-center">
                    <p className="text-gray-400">Complete assignments to see them here</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
