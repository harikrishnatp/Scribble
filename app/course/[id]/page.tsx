"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Play, BookOpen, FileText, CheckCircle2, Share2, Trash2, StickyNote } from "lucide-react";
import Link from "next/link";
import { QuizSection } from "@/components/quiz-section";
import { DocumentationSection } from "@/components/documentation-section";
import { VideoNotesEnhanced } from "@/components/video-notes-enhanced";
import { VideoQuiz } from "@/components/video-quiz";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DownloadButton } from "@/components/download-button";
import { AssignmentGenerator } from "@/components/assignment-generator";

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [playlist, setPlaylist] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completedVideos, setCompletedVideos] = useState(0);
  const [videoNotes, setVideoNotes] = useState<Record<string, string>>({});
  const [videoTimestampedNotes, setVideoTimestampedNotes] = useState<Record<string, any[]>>({});
  const [videoQuizAnswers, setVideoQuizAnswers] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    // Fetch playlist from localStorage or API
    const storedPlaylists = localStorage.getItem("userPlaylists");
    if (storedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(storedPlaylists);
        const found = parsedPlaylists.find(
          (p: any) => p.id === courseId || p.playlistId === courseId
        );
        if (found) {
          setPlaylist(found);
          setSelectedVideo(found.videos?.[0] || null);
          // Count completed videos
          const completed = found.videos?.filter((v: any) => v.completed).length || 0;
          setCompletedVideos(completed);
          // Load notes for all videos
          const notes: Record<string, string> = {};
          const tsNotes: Record<string, any[]> = {};
          found.videos?.forEach((video: any) => {
            if (video.notes) {
              notes[video.id] = video.notes;
            }
            if (video.timestampedNotes) {
              tsNotes[video.id] = video.timestampedNotes;
            }
          });
          setVideoNotes(notes);
          setVideoTimestampedNotes(tsNotes);
        }
      } catch (e) {
        console.error("Error fetching playlist:", e);
      }
    }
    setLoading(false);
  }, [courseId]);

  // Keyboard shortcuts
  const handleNextVideo = () => {
    if (selectedVideo && playlist?.videos) {
      const currentIndex = playlist.videos.findIndex(
        (v: any) => v.id === selectedVideo.id
      );
      if (currentIndex < playlist.videos.length - 1) {
        setSelectedVideo(playlist.videos[currentIndex + 1]);
      }
    }
  };

  const handlePrevVideo = () => {
    if (selectedVideo && playlist?.videos) {
      const currentIndex = playlist.videos.findIndex(
        (v: any) => v.id === selectedVideo.id
      );
      if (currentIndex > 0) {
        setSelectedVideo(playlist.videos[currentIndex - 1]);
      }
    }
  };

  useKeyboardShortcuts({
    onNextVideo: handleNextVideo,
    onPrevVideo: handlePrevVideo,
  });

  const handleDeletePlaylist = () => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      const storedPlaylists = localStorage.getItem("userPlaylists");
      if (storedPlaylists) {
        const parsedPlaylists = JSON.parse(storedPlaylists);
        const filtered = parsedPlaylists.filter((p: any) => p.id !== courseId);
        localStorage.setItem("userPlaylists", JSON.stringify(filtered));
        router.push("/dashboard");
      }
    }
  };

  const updateVideoProgress = (videoId: string, completed: boolean) => {
    // Update local playlist state
    const updatedPlaylist = {
      ...playlist,
      videos: playlist.videos.map((v: any) => 
        v.id === videoId ? { ...v, completed } : v
      )
    };
    setPlaylist(updatedPlaylist);
    const newCompleted = updatedPlaylist.videos.filter((v: any) => v.completed).length;
    setCompletedVideos(newCompleted);

    // Persist to localStorage
    const storedPlaylists = localStorage.getItem("userPlaylists");
    if (storedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(storedPlaylists);
        const updated = parsedPlaylists.map((p: any) => 
          p.id === courseId || p.playlistId === courseId ? updatedPlaylist : p
        );
        localStorage.setItem("userPlaylists", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving progress:", e);
      }
    }
  };

  const saveVideoNotes = (videoId: string, notes: string) => {
    // Update local notes state
    setVideoNotes((prev) => ({
      ...prev,
      [videoId]: notes,
    }));

    // Update playlist with notes
    const updatedPlaylist = {
      ...playlist,
      videos: playlist.videos.map((v: any) =>
        v.id === videoId ? { ...v, notes } : v
      ),
    };
    setPlaylist(updatedPlaylist);

    // Persist to localStorage
    const storedPlaylists = localStorage.getItem("userPlaylists");
    if (storedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(storedPlaylists);
        const updated = parsedPlaylists.map((p: any) =>
          p.id === courseId || p.playlistId === courseId ? updatedPlaylist : p
        );
        localStorage.setItem("userPlaylists", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving notes:", e);
      }
    }
  };

  const saveVideoTimestampedNotes = (videoId: string, timestampedNotes: any[]) => {
    // Update local state
    setVideoTimestampedNotes((prev) => ({
      ...prev,
      [videoId]: timestampedNotes,
    }));

    // Update playlist with timestamped notes
    const updatedPlaylist = {
      ...playlist,
      videos: playlist.videos.map((v: any) =>
        v.id === videoId ? { ...v, timestampedNotes } : v
      ),
    };
    setPlaylist(updatedPlaylist);

    // Persist to localStorage
    const storedPlaylists = localStorage.getItem("userPlaylists");
    if (storedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(storedPlaylists);
        const updated = parsedPlaylists.map((p: any) =>
          p.id === courseId || p.playlistId === courseId ? updatedPlaylist : p
        );
        localStorage.setItem("userPlaylists", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving timestamped notes:", e);
      }
    }
  };

  const saveVideoQuizAnswers = (videoId: string, answers: Record<string, number>) => {
    // Update local state
    setVideoQuizAnswers((prev) => ({
      ...prev,
      [videoId]: answers,
    }));

    // Update playlist with quiz answers
    const updatedPlaylist = {
      ...playlist,
      videos: playlist.videos.map((v: any) =>
        v.id === videoId ? { ...v, quizAnswers: answers } : v
      ),
    };
    setPlaylist(updatedPlaylist);

    // Persist to localStorage
    const storedPlaylists = localStorage.getItem("userPlaylists");
    if (storedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(storedPlaylists);
        const updated = parsedPlaylists.map((p: any) =>
          p.id === courseId || p.playlistId === courseId ? updatedPlaylist : p
        );
        localStorage.setItem("userPlaylists", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving quiz answers:", e);
      }
    }
  };

  const progress = playlist ? Math.round((completedVideos / playlist.videos?.length) * 100) || 0 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-zinc-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-zinc-800/20 blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-zinc-900/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-zinc-800/20 blur-3xl" />
        </div>
        <Header />
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <p className="text-gray-400 mb-8">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/dashboard">
              <Button className="bg-white text-black hover:bg-gray-200 font-semibold">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-zinc-900/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-zinc-800/20 blur-3xl" />
      </div>

      <Header />

      <div className="relative z-10">
        {/* Course Header */}
        <div className="border-b border-zinc-700 bg-zinc-900">
          <div className="container mx-auto px-4 py-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-white hover:text-gray-300 mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex gap-8">
              {playlist.thumbnailUrl && (
                <Image
                  src={playlist.thumbnailUrl}
                  alt={playlist.title}
                  width={200}
                  height={112}
                  className="h-32 w-56 object-cover rounded-lg shadow-lg shadow-zinc-500/20"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{playlist.title}</h1>
                    <p className="text-gray-400 font-medium">{playlist.channelTitle}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-zinc-600 text-white hover:bg-zinc-800"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-zinc-600 text-white hover:bg-zinc-800 hover:text-white"
                      onClick={handleDeletePlaylist}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">{playlist.description}</p>
                <div className="flex gap-6 text-sm mb-6">
                  <div className="flex flex-col">
                    <span className="text-gray-400">Total Videos</span>
                    <span className="text-xl font-bold text-white">{playlist.videos?.length || 0}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-xl font-bold text-white">{playlist.totalDuration || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-xl font-bold text-white">{progress}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Video Player */}
              {selectedVideo && (
                <Card className="bg-zinc-900 border border-zinc-700 overflow-hidden">
                  <CardHeader className="pb-3 flex flex-row items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{selectedVideo.title}</CardTitle>
                    </div>
                    <DownloadButton
                      videoId={selectedVideo.id}
                      videoTitle={selectedVideo.title}
                      size="sm"
                      variant="outline"
                      className="border-zinc-600 text-white hover:bg-zinc-800 ml-4"
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                        title={selectedVideo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4 flex gap-3">
                    <Button
                      onClick={handlePrevVideo}
                      className="flex-1 bg-zinc-800 text-white hover:bg-zinc-700"
                      disabled={
                        !selectedVideo ||
                        playlist?.videos?.findIndex(
                          (v: any) => v.id === selectedVideo.id
                        ) === 0
                      }
                    >
                      ← Previous Video
                    </Button>
                    <Button
                      onClick={handleNextVideo}
                      className="flex-1 bg-white text-black hover:bg-gray-200 font-semibold"
                      disabled={
                        !selectedVideo ||
                        playlist?.videos?.findIndex(
                          (v: any) => v.id === selectedVideo.id
                        ) ===
                          playlist?.videos?.length - 1
                      }
                    >
                      Next Video →
                    </Button>
                  </div>
                </Card>
              )}

              {/* Video Notes */}
              {selectedVideo && (
                <VideoNotesEnhanced
                  key={selectedVideo.id}
                  videoId={selectedVideo.id}
                  videoTitle={selectedVideo.title}
                  videoDescription={selectedVideo.description}
                  notes={videoNotes[selectedVideo.id] || ""}
                  timestampedNotes={videoTimestampedNotes[selectedVideo.id] || []}
                  onSaveNotes={saveVideoNotes}
                  onSaveTimestampedNotes={saveVideoTimestampedNotes}
                />
              )}

              {/* Tabs for additional content */}
              <Tabs defaultValue="videos" className="w-full">
                <TabsList className="bg-transparent border-b border-zinc-700 mb-6">
                  <TabsTrigger value="videos" className="data-[state=active]:border-b-2 data-[state=active]:border-white">
                    <Play className="h-4 w-4 mr-2" />
                    Videos
                  </TabsTrigger>
                  <TabsTrigger value="quizzes" className="data-[state=active]:border-b-2 data-[state=active]:border-white">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Quizzes
                  </TabsTrigger>
                  <TabsTrigger value="assignments" className="data-[state=active]:border-b-2 data-[state=active]:border-white">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Assignments
                  </TabsTrigger>
                  <TabsTrigger value="docs" className="data-[state=active]:border-b-2 data-[state=active]:border-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Docs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="videos">
                  <div className="space-y-3">
                    {playlist.videos?.map((video: any, idx: number) => (
                      <Card
                        key={video.id || idx}
                        className="bg-zinc-900 border border-zinc-700 cursor-pointer hover:border-zinc-600 transition-all"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={video.completed || false}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  updateVideoProgress(video.id, !video.completed);
                                }}
                                className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
                              />
                              <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{idx + 1}</span>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{video.title}</h4>
                              <p className="text-xs text-gray-400 mt-1">{video.duration}</p>
                            </div>
                            {video.completed && (
                              <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="quizzes">
                  {selectedVideo ? (
                    <VideoQuiz
                      key={selectedVideo.id}
                      videoId={selectedVideo.id}
                      videoTitle={selectedVideo.title}
                      videoDescription={selectedVideo.description}
                      onSaveQuizAnswers={saveVideoQuizAnswers}
                    />
                  ) : (
                    <Card className="bg-zinc-900 border border-zinc-700">
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-400">Select a video to take the quiz</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="assignments">
                  {selectedVideo ? (
                    <AssignmentGenerator
                      videoTitle={selectedVideo.title}
                      videoDescription={selectedVideo.description}
                    />
                  ) : (
                    <Card className="bg-zinc-900 border border-zinc-700">
                      <CardContent className="p-8 text-center">
                        <p className="text-gray-400">Select a video to generate an assignment</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="docs">
                  <Card className="bg-zinc-900 border border-zinc-700">
                    <CardHeader>
                      <CardTitle className="text-lg">Documentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DocumentationSection
                        videoId={selectedVideo?.id || ""}
                        videoTitle={selectedVideo?.title || "Course"}
                        resources={[]}
                        onAddResource={(resource: any) => console.log("Resource added:", resource)}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Video List */}
            <div>
              <Card className="bg-zinc-900/40 border border-zinc-700 sticky top-24 max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">Playlist</CardTitle>
                  <CardDescription>{playlist.videos?.length || 0} videos</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <div className="space-y-2">
                    {playlist.videos?.map((video: any, idx: number) => (
                      <button
                        key={video.id || idx}
                        onClick={() => setSelectedVideo(video)}
                        className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                          selectedVideo?.id === video.id
                            ? "bg-white text-black shadow-lg shadow-zinc-500/30 font-semibold"
                            : "bg-zinc-800 border border-zinc-700 text-gray-300 hover:border-zinc-600"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-medium truncate text-xs">{idx + 1}. {video.title}</div>
                          {video.completed && <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{video.duration}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
