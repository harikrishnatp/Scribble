"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { YoutubeIcon, PlusCircle, BookOpen, Clock, Flame, Trophy, TrendingUp, Play } from "lucide-react"
import { Header } from "@/components/header"
import { Input } from "@/components/ui/input"

export default function CoursePage() {
  const [userPlaylists, setUserPlaylists] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Load user playlists from localStorage
  useEffect(() => {
    const storedPlaylists = localStorage.getItem("userPlaylists");
    if (storedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(storedPlaylists);
  
        // Validate that the parsed data is an array
        if (Array.isArray(parsedPlaylists)) {
          setUserPlaylists(parsedPlaylists);
        } else {
          console.warn("Invalid data in localStorage, resetting to an empty array.");
          setUserPlaylists([]);
        }
      } catch (e) {
        console.error("Error parsing stored playlists:", e);
        setUserPlaylists([]);
      }
    }
  }, []);

  const filteredPlaylists = userPlaylists.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.channelTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-zinc-900 text-white">
      
        <Header/>
        
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 border-b border-zinc-700">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="relative px-6 py-8 sm:px-8 sm:py-12 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold">My Courses</h1>
                </div>
                <p className="text-gray-300 text-lg">Continue your learning journey with curated playlists</p>
              </div>
              
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    placeholder="Search courses, channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-800/50 border-zinc-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20 pl-4 pr-10 py-2 rounded-lg"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-gray-400">Total Courses</span>
                </div>
                <p className="text-2xl font-bold">{userPlaylists.length || 3}</p>
              </div>
              <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-cyan-500" />
                  <span className="text-xs text-gray-400">Total Hours</span>
                </div>
                <p className="text-2xl font-bold">36h 45m</p>
              </div>
              <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-gray-400">Streak</span>
                </div>
                <p className="text-2xl font-bold">12 days</p>
              </div>
              <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-gray-400">Points</span>
                </div>
                <p className="text-2xl font-bold">2,450</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 sm:px-8 max-w-7xl mx-auto">
          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-800/30 border border-zinc-700/50 p-1 mb-8">
              <TabsTrigger 
                value="courses"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 rounded-lg transition-all"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                My Courses
              </TabsTrigger>
              <TabsTrigger 
                value="progress"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 rounded-lg transition-all"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Progress
              </TabsTrigger>
            </TabsList>
          

          <TabsContent value="courses" className="mt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Your Learning Path</h2>
              <p className="text-gray-400">
                {filteredPlaylists.length} {filteredPlaylists.length === 1 ? 'course' : 'courses'} available
              </p>
            </div>
            
            {filteredPlaylists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaylists.map((playlist, i) => (
                  <Link href={`/course/${playlist.id}`} key={`user-${i}`}>
                    <Card className="bg-zinc-800/50 border-zinc-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer h-full group">
                      <CardHeader className="pb-3">
                        <div className="relative h-40 mb-4 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-zinc-700 rounded-lg overflow-hidden group-hover:border-cyan-500/50 transition-colors">
                          {playlist.thumbnailUrl ? (
                            <img
                              src={playlist.thumbnailUrl}
                              alt={playlist.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600/40 to-cyan-600/40">
                              <YoutubeIcon className="h-12 w-12 text-cyan-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-cyan-500 rounded-full p-3">
                              <Play className="h-6 w-6 text-white fill-white" />
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-lg group-hover:text-cyan-300 transition-colors">{playlist.title}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {playlist.channelTitle}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            {playlist.videoCount} videos
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {playlist.totalDuration}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-300">Progress</span>
                            <span className="text-xs font-bold text-cyan-400">0%</span>
                          </div>
                          <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full" style={{ width: "0%" }}></div>
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all">
                          <Play className="h-4 w-4" />
                          Start Learning
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : userPlaylists.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Link href="/course/1" key={i}>
                    <Card className="bg-zinc-800/50 border-zinc-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer h-full group">
                      <CardHeader className="pb-3">
                        <div className="relative h-40 mb-4 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-zinc-700 rounded-lg overflow-hidden group-hover:border-cyan-500/50 transition-colors flex items-center justify-center">
                          <YoutubeIcon className="h-12 w-12 text-cyan-400" />
                        </div>
                        <CardTitle className="text-lg group-hover:text-cyan-300 transition-colors">Operating System (Complete Playlist)</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          Gate Smashers
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            50 videos
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            12h 13m
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-300">Progress</span>
                            <span className="text-xs font-bold text-cyan-400">0%</span>
                          </div>
                          <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full" style={{ width: "0%" }}></div>
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium gap-2 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-all">
                          <Play className="h-4 w-4" />
                          Start Learning
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="progress" className="mt-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Learning Progress</h2>
              <p className="text-gray-400">Track your learning journey and achievements</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Statistics Cards */}
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border-blue-500/30 hover:border-blue-500/60 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Courses in Progress</CardTitle>
                    <div className="h-10 w-10 rounded-lg bg-blue-600/30 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-300 mb-2">{userPlaylists.length || 3}</p>
                  <p className="text-xs text-gray-400">Active learning courses</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-600/20 to-cyan-600/5 border-cyan-500/30 hover:border-cyan-500/60 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Total Study Time</CardTitle>
                    <div className="h-10 w-10 rounded-lg bg-cyan-600/30 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-cyan-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-cyan-300 mb-2">36h 45m</p>
                  <p className="text-xs text-gray-400">Total learning hours</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/20 to-orange-600/5 border-orange-500/30 hover:border-orange-500/60 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Current Streak</CardTitle>
                    <div className="h-10 w-10 rounded-lg bg-orange-600/30 flex items-center justify-center">
                      <Flame className="h-5 w-5 text-orange-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-300 mb-2">12 days</p>
                  <p className="text-xs text-gray-400">Keep it going! 🔥</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course Progress */}
              <Card className="bg-zinc-800/50 border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-cyan-400" />
                    Course Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(userPlaylists.slice(0, 3).length > 0 ? userPlaylists.slice(0, 3) : [
                    { title: "Operating System", progress: 35 },
                    { title: "Data Structures", progress: 62 },
                    { title: "Algorithms", progress: 18 }
                  ]).map((course, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-white text-sm">{course.title}</p>
                        <span className="text-xs font-bold text-cyan-400">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all" style={{ width: `${course.progress || 0}%` }}></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-zinc-800/50 border-zinc-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-cyan-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Operating System - Lecture 1", time: "15 minutes ago", icon: "📚" },
                      { title: "Data Structures - Lecture 5", time: "2 days ago", icon: "🔗" },
                      { title: "Algorithms - Lecture 3", time: "5 days ago", icon: "⚙️" }
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-4 pb-4 border-b border-zinc-700/50 last:border-0 last:pb-0">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border border-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">{activity.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm truncate">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  )
}
