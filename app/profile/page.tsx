import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Award, BookOpen, Calendar, Clock, Github, Users } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">John Doe</h2>
                  <p className="text-sm text-gray-400">john.doe@example.com</p>

                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      <span>Pro Member</span>
                    </Badge>
                  </div>

                  <div className="w-full mt-6 pt-6 border-t border-gray-800">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Member Since</span>
                        <span className="font-medium">April 2023</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Courses Completed</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Total Learning Time</span>
                        <span className="font-medium">43h 12m</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Learning Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg bg-gray-800/50">
                    <BookOpen className="h-5 w-5 mr-3 text-blue-400" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Courses Started</p>
                      <p className="text-xs text-gray-400">12 courses</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 rounded-lg bg-gray-800/50">
                    <Award className="h-5 w-5 mr-3 text-yellow-400" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Completion Rate</p>
                      <p className="text-xs text-gray-400">67% (8/12 courses)</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 rounded-lg bg-gray-800/50">
                    <Clock className="h-5 w-5 mr-3 text-green-400" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Average Time per Course</p>
                      <p className="text-xs text-gray-400">5h 24m</p>
                    </div>
                  </div>

                  <div className="flex items-center p-3 rounded-lg bg-gray-800/50">
                    <Calendar className="h-5 w-5 mr-3 text-purple-400" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Learning Streak</p>
                      <p className="text-xs text-gray-400">12 days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-2/3">
            <Tabs defaultValue="courses">
              <TabsList className="mb-4">
                <TabsTrigger value="courses">My Courses</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="courses">
                <div className="grid gap-4">
                  <h2 className="text-xl font-bold">Current Courses</h2>

                  <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-[120px] h-[68px] bg-gray-800 rounded-md flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-blue-500" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">React TypeScript Tutorial</h3>
                                  <p className="text-xs text-gray-400">Programming with Mosh • 9 videos</p>
                                </div>

                                <CircularProgress
                                  value={i * 25}
                                  size={40}
                                  strokeWidth={4}
                                  showValue={true}
                                  color="stroke-blue-500"
                                />
                              </div>

                              <div className="flex items-center gap-2 mt-2">
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  Continue
                                </Button>
                                <span className="text-xs text-gray-400">Last watched: 2 days ago</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold mt-6">Completed Courses</h2>

                  <div className="grid gap-4">
                    {[1, 2].map((i) => (
                      <Card key={i} className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-[120px] h-[68px] bg-gray-800 rounded-md flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-green-500" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">JavaScript Basics</h3>
                                  <p className="text-xs text-gray-400">Traversy Media • 12 videos</p>
                                </div>

                                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                                  Completed
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 mt-2">
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  Review
                                </Button>
                                <span className="text-xs text-gray-400">Completed: 3 weeks ago</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="achievements">
                <div className="grid gap-6">
                  <h2 className="text-xl font-bold">Your Achievements</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "First Course",
                        desc: "Completed your first course",
                        icon: BookOpen,
                        color: "text-blue-400",
                      },
                      {
                        title: "Learning Streak",
                        desc: "Learned for 7 days in a row",
                        icon: Calendar,
                        color: "text-green-400",
                      },
                      {
                        title: "Fast Learner",
                        desc: "Completed a course in under 3 days",
                        icon: Clock,
                        color: "text-yellow-400",
                      },
                      {
                        title: "Quiz Master",
                        desc: "Scored 100% on all assignments",
                        icon: Award,
                        color: "text-purple-400",
                      },
                    ].map((achievement, i) => (
                      <Card key={i} className="bg-gray-900 border-gray-800">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center ${achievement.color}`}
                            >
                              <achievement.icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-medium">{achievement.title}</h3>
                              <p className="text-xs text-gray-400">{achievement.desc}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold mt-4">Locked Achievements</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "Course Creator",
                        desc: "Create and share your own course",
                        icon: BookOpen,
                        color: "text-gray-400",
                      },
                      {
                        title: "Community Leader",
                        desc: "Help 10 other learners",
                        icon: Users,
                        color: "text-gray-400",
                      },
                    ].map((achievement, i) => (
                      <Card key={i} className="bg-gray-900 border-gray-800 opacity-60">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center ${achievement.color}`}
                            >
                              <achievement.icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-medium">{achievement.title}</h3>
                              <p className="text-xs text-gray-400">{achievement.desc}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Email Notifications</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Course updates</span>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800">
                          <span className="absolute h-4 w-4 rounded-full bg-blue-500 transform translate-x-6"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">New assignments</span>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800">
                          <span className="absolute h-4 w-4 rounded-full bg-blue-500 transform translate-x-6"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Community messages</span>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800">
                          <span className="absolute h-4 w-4 rounded-full bg-gray-600 transform translate-x-1"></span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-800">
                      <h3 className="text-sm font-medium">Privacy Settings</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Show my progress to others</span>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800">
                          <span className="absolute h-4 w-4 rounded-full bg-blue-500 transform translate-x-6"></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Allow others to see my profile</span>
                        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800">
                          <span className="absolute h-4 w-4 rounded-full bg-blue-500 transform translate-x-6"></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              <span>1,234 active users</span>
            </Badge>
          </div>

          <Link href="https://github.com/intojhanurag/CracCode-Hackathon">
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              <span>Star on GitHub</span>
            </Button>      
          </Link>
          
        </div>
      </div>
    </div>
  )
}
