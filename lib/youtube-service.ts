// YouTube API integration


export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  position: number;
  completed?: boolean;
  progress?: number;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  thumbnailUrl: string;
  videos: YouTubeVideo[];
  totalVideos: number;
  totalDuration: string;
}

// Convert ISO 8601 duration to readable format
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  const hours = match?.[1] ? Number.parseInt(match[1]) : 0;
  const minutes = match?.[2] ? Number.parseInt(match[2]) : 0;
  const seconds = match?.[3] ? Number.parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Calculate total duration from video durations
function calculateTotalDuration(videos: YouTubeVideo[]): string {
  let totalSeconds = 0;

  videos.forEach((video) => {
    const parts = video.duration.split(":");
    if (parts.length === 3) {
      // hours:minutes:seconds
      totalSeconds += Number.parseInt(parts[0]) * 3600 + Number.parseInt(parts[1]) * 60 + Number.parseInt(parts[2]);
    } else if (parts.length === 2) {
      // minutes:seconds
      totalSeconds += Number.parseInt(parts[0]) * 60 + Number.parseInt(parts[1]);
    }
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
export async function fetchPlaylistDetails(playlistId: string): Promise<YouTubePlaylist> {
  try {
    // Step 1: Get playlist details
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
    );
    const playlistData = await playlistResponse.json();

    if (!playlistData.items || playlistData.items.length === 0) {
      throw new Error("Playlist not found");
    }

    const playlistInfo = playlistData.items[0];

    // Step 2: Get playlist items (videos)
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
    );
    const videosData = await videosResponse.json();

    if (!videosData.items) {
      throw new Error("No videos found in playlist");
    }

    // Step 3: Get video details (for duration)
    const videoIds = videosData.items.map((item: any) => item.contentDetails.videoId).join(",");
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${apiKey}`
    );
    const videoDetailsData = await videoDetailsResponse.json();

    // Map video details
    const videos: YouTubeVideo[] = videosData.items.map((item: any, index: number) => {
      const videoId = item.contentDetails.videoId;
      const videoDetails = videoDetailsData.items.find((v: any) => v.id === videoId);

      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        duration: videoDetails ? formatDuration(videoDetails.contentDetails.duration) : "0:00",
        position: index + 1,
        completed: false,
        progress: 0,
      };
    });

    return {
      id: playlistId,
      title: playlistInfo.snippet.title,
      description: playlistInfo.snippet.description,
      channelTitle: playlistInfo.snippet.channelTitle,
      thumbnailUrl: playlistInfo.snippet.thumbnails.high?.url || playlistInfo.snippet.thumbnails.default?.url,
      videos,
      totalVideos: videos.length,
      totalDuration: calculateTotalDuration(videos),
    };
  } catch (error) {
    console.error("Error fetching playlist:", error);
    throw error;
  }
}

export async function fetchUserProgress(userId: string, playlistId: string): Promise<Record<string, number>> {
  // In a real app, this would fetch from your database
  // For now, we'll use localStorage in the client component
  return {};
}

export async function updateVideoProgress(userId: string, videoId: string, progress: number): Promise<void> {
  // In a real app, this would update your database
  // For now, we'll use localStorage in the client component
}