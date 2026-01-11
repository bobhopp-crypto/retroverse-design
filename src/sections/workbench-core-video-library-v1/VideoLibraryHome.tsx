import { useState, useEffect } from 'react'
import { VideoLibraryHome as VideoLibraryHomeComponent } from './components/VideoLibraryHome'
import type { VideoFile } from './types'

/**
 * Thumbnail index: Maps FilePath -> thumbnail URL
 * e.g., "1960's/Carla Thomas - Comfort Me.mp4" -> "/thumbnails/1960's/Carla Thomas - Comfort Me.jpg"
 */
type ThumbnailIndex = Record<string, string>

/**
 * Preview wrapper for VideoLibraryHome
 * This component loads the real VideoFiles.json dataset from /data/VideoFiles.json
 * and feeds it to the VideoLibraryHome component for display in Design OS.
 */
export default function VideoLibraryHome() {
  const [videos, setVideos] = useState<VideoFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL

    Promise.all([
      fetch(`${baseUrl}data/VideoFiles.json`).then((r) => r.json()),
      fetch(`${baseUrl}thumbnails-index.json`).then((r) => r.json()),
    ])
      .then(([videos, thumbIndex]: [VideoFile[], ThumbnailIndex]) => {
        const normalized = videos.map((v) => {
          const thumbnailPath = thumbIndex[v.FilePath]
          // Strip "/public" prefix from index values since public assets are served from root
          const thumbnailUrl = thumbnailPath?.replace(/^\/public/, '') ?? undefined
          return {
            ...v,
            thumbnailUrl,
          }
        })

        setVideos(normalized)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading data:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1510] text-[#F5ECD7] flex items-center justify-center">
        <div className="text-[#C7BBA7]">Loading video library...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A1510] text-[#F5ECD7] flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    )
  }

  return <VideoLibraryHomeComponent videos={videos} />
}
