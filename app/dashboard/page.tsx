import { PlaylistDashboard } from "@/components/playlist-dashboard"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-zinc-900 text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>
      <PlaylistDashboard />
    </div>
  )
}
