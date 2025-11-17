import { NextResponse } from "next/server"
import { spawn } from "child_process"
import * as fs from "fs"
import * as path from "path"

// Store download progress
const downloadProgress: { [key: string]: number } = {}

// Get the full path to yt-dlp
function getYtDlpPath(): string {
  try {
    // Try to find yt-dlp in PATH
    const { execSync } = require("child_process")
    const which = execSync("which yt-dlp", { encoding: "utf-8" }).trim()
    return which
  } catch (e) {
    // If not found, try common locations
    const commonPaths = [
      "/usr/local/bin/yt-dlp",
      "/opt/homebrew/bin/yt-dlp",
      "/usr/bin/yt-dlp",
    ]
    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        return p
      }
    }
    throw new Error("yt-dlp not found in PATH")
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { videoId, videoTitle, quality = "low" } = body

    if (!videoId) {
      return NextResponse.json(
        { ok: false, error: "Video ID is required" },
        { status: 400 }
      )
    }

    // Create downloads directory if it doesn't exist
    const downloadDir = path.join(process.cwd(), "public", "downloads")
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true })
    }

    // Sanitize filename
    const safeTitle = (videoTitle || videoId).replace(/[^a-z0-9]/gi, "_").slice(0, 50)
    const qualitySuffix = quality === "audio" ? "_audio" : quality === "low" ? "_low" : ""
    const ext = quality === "audio" ? "m4a" : "mp4"
    const outputPath = path.join(downloadDir, `${safeTitle}${qualitySuffix}.${ext}`)

    // Check if file already exists
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath)
      return NextResponse.json({
        ok: true,
        message: "Video already downloaded",
        downloadUrl: `/downloads/${safeTitle}${qualitySuffix}.${ext}`,
        cached: true,
        fileSize: stats.size,
      })
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`
    const progressKey = `${videoId}-${quality}`

    return new Promise((resolve) => {
      try {
        const ytDlpPath = getYtDlpPath()
        
        // Different format strings for different quality levels
        let formatStr = ""
        switch (quality) {
          case "audio":
            // Audio only - fastest and smallest
            formatStr = "bestaudio[ext=m4a]/bestaudio"
            break
          case "low":
            // Low quality video - faster download
            formatStr = "worst[ext=mp4]/worst"
            break
          case "medium":
            // Medium quality
            formatStr = "best[height<=480][ext=mp4]/best[height<=480]"
            break
          default:
            // Best quality
            formatStr = "best[ext=mp4]/best"
        }

        const args = [
          "-f", formatStr,
          "-o", outputPath,
          "--quiet",
          "--no-warnings",
          "--progress",
          youtubeUrl,
        ]

        const ytdlp = spawn(ytDlpPath, args, {
          timeout: 600000, // 10 minute timeout
        })

        let hasError = false
        downloadProgress[progressKey] = 0

        ytdlp.stderr.on("data", (data) => {
          const stderr = data.toString()
          if (stderr && !stderr.includes("WARNING")) {
            console.error("yt-dlp stderr:", stderr)
          }
        })

        ytdlp.stdout.on("data", (data) => {
          const stdout = data.toString()
          // Parse progress if available
          const match = stdout.match(/(\d+\.\d+)%/)
          if (match) {
            downloadProgress[progressKey] = parseFloat(match[1])
          }
        })

        ytdlp.on("error", (error) => {
          hasError = true
          console.error("yt-dlp process error:", error)
          delete downloadProgress[progressKey]
          resolve(
            NextResponse.json(
              {
                ok: false,
                error: `Process error: ${error.message}`,
              },
              { status: 500 }
            )
          )
        })

        ytdlp.on("close", (code) => {
          delete downloadProgress[progressKey]
          
          if (hasError) return

          if (code !== 0) {
            console.error(`yt-dlp exited with code ${code}`)
            resolve(
              NextResponse.json(
                {
                  ok: false,
                  error: `Download failed with exit code ${code}`,
                },
                { status: 500 }
              )
            )
            return
          }

          // Verify file was created
          if (!fs.existsSync(outputPath)) {
            resolve(
              NextResponse.json(
                { ok: false, error: "Download failed - file not created" },
                { status: 500 }
              )
            )
            return
          }

          // Get file size
          const stats = fs.statSync(outputPath)
          
          resolve(
            NextResponse.json({
              ok: true,
              message: "Video downloaded successfully",
              downloadUrl: `/downloads/${safeTitle}${qualitySuffix}.${ext}`,
              fileName: `${safeTitle}${qualitySuffix}.${ext}`,
              fileSize: stats.size,
              quality,
            })
          )
        })
      } catch (error: any) {
        console.error("Download error:", error)
        delete downloadProgress[progressKey]
        resolve(
          NextResponse.json(
            {
              ok: false,
              error: `Failed to download: ${error.message}`,
            },
            { status: 500 }
          )
        )
      }
    })
  } catch (error) {
    console.error("Download API error:", error)
    return NextResponse.json(
      {
        ok: false,
        error: (error as any).message || "Internal server error",
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const videoId = url.searchParams.get("videoId")
  const quality = url.searchParams.get("quality") || "low"

  // Return progress for a specific download
  if (videoId) {
    const progressKey = `${videoId}-${quality}`
    const progress = downloadProgress[progressKey] || 0
    return NextResponse.json({
      ok: true,
      videoId,
      quality,
      progress,
      isDownloading: progress > 0 && progress < 100,
    })
  }

  // List all downloads
  try {
    const downloadDir = path.join(process.cwd(), "public", "downloads")

    if (!fs.existsSync(downloadDir)) {
      return NextResponse.json({ ok: true, files: [] })
    }

    const files = fs.readdirSync(downloadDir).map((file) => {
      const filePath = path.join(downloadDir, file)
      const stats = fs.statSync(filePath)
      return {
        name: file,
        url: `/downloads/${file}`,
        size: stats.size,
        sizeFormatted: formatBytes(stats.size),
      }
    })

    return NextResponse.json({
      ok: true,
      files,
    })
  } catch (error) {
    console.error("Error listing downloads:", error)
    return NextResponse.json(
      { ok: false, error: "Failed to list downloads" },
      { status: 500 }
    )
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
