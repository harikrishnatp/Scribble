/**
 * Video Download Service
 * Handles downloading videos from YouTube using external services
 */

export interface DownloadOption {
  quality: 'best' | '720p' | '480p' | '360p' | 'audio'
  format: 'mp4' | 'webm' | 'mp3'
}

/**
 * Generate YouTube download link using yt-dlp web service
 * Uses a public API to avoid backend complexity
 */
export function getDownloadLink(videoId: string, quality: string): string {
  // Using yt-dlp.com API for downloads
  const downloadUrl = `https://yt-dlp.com/api/download?id=${videoId}&quality=${quality}`
  return downloadUrl
}

/**
 * Get available download options for a video
 */
export function getDownloadOptions(videoId: string): DownloadOption[] {
  return [
    { quality: 'best', format: 'mp4' },
    { quality: '720p', format: 'mp4' },
    { quality: '480p', format: 'mp4' },
    { quality: '360p', format: 'mp4' },
    { quality: 'audio', format: 'mp3' },
  ]
}

/**
 * Start download by opening external download service
 */
export function downloadVideo(videoId: string, videoTitle: string, quality: string = 'best') {
  try {
    // Using online downloader service
    const downloadUrl = `https://savefrom.net/?url=https://www.youtube.com/watch?v=${videoId}`
    window.open(downloadUrl, '_blank', 'noopener,noreferrer')
  } catch (error) {
    console.error('Download failed:', error)
    throw new Error('Failed to initiate download')
  }
}

/**
 * Open download options page for more control
 */
export function openDownloadOptions(videoId: string, videoTitle: string) {
  const downloadUrl = `https://www.y2mate.com/en/youtube/${videoId}`
  window.open(downloadUrl, '_blank', 'noopener,noreferrer')
}
