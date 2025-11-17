import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Clock, Video, Calendar, Award } from "lucide-react"

interface PlaylistStatsProps {
  playlist: {
    totalVideos: number
    totalDuration: string
    videos: Array<{ completed?: boolean }>
    completedVideos:number;
  }
}

export function PlaylistStats({ playlist }: PlaylistStatsProps) {
  const completedVideos = playlist.videos.filter((video) => video.completed).length
  const completionPercentage = Math.round((playlist.completedVideos / playlist.totalVideos) * 100)

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4">
          <CircularProgress
            value={completionPercentage}
            size={120}
            strokeWidth={10}
            showValue={true}
            color="stroke-blue-500"
            className="mb-4"
          />
          <p className="text-sm text-gray-400">
            {playlist.completedVideos} of {playlist.totalVideos} videos completed
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center p-3 rounded-lg bg-gray-800/50">
            <Video className="h-5 w-5 mr-3 text-blue-400" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Total Videos</p>
              <p className="text-xs text-gray-400">{playlist.totalVideos} lessons</p>
            </div>
          </div>

          <div className="flex items-center p-3 rounded-lg bg-gray-800/50">
            <Clock className="h-5 w-5 mr-3 text-green-400" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Total Duration</p>
              <p className="text-xs text-gray-400">{playlist.totalDuration}</p>
            </div>
          </div>

          <div className="flex items-center p-3 rounded-lg bg-gray-800/50">
            <Calendar className="h-5 w-5 mr-3 text-purple-400" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Started On</p>
              <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center p-3 rounded-lg bg-gray-800/50">
            <Award className="h-5 w-5 mr-3 text-yellow-400" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Estimated Completion</p>
              <p className="text-xs text-gray-400">
                {completionPercentage === 100
                  ? "Completed!"
                  : completionPercentage > 0
                    ? `${Math.ceil((playlist.totalVideos - completedVideos) / (completedVideos || 1))} days`
                    : "Not started"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
