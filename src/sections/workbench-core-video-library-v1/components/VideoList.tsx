import type { VideoFile } from '../types'
import { VideoRow } from './VideoRow'

interface VideoListProps {
  videos: VideoFile[]
  onVideoClick: (video: VideoFile) => void
  onPlay?: (video: VideoFile) => void
  onAdd?: (video: VideoFile) => void
  onInfo?: (video: VideoFile) => void
  isInPlaylist?: (video: VideoFile) => boolean
}

export function VideoList({ videos, onVideoClick, onPlay, onAdd, onInfo, isInPlaylist }: VideoListProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12 text-[#C7BBA7]">
        No videos found matching your filters.
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {videos.map((video, index) => (
        <VideoRow
          key={`${video.FilePath}-${index}`}
          video={video}
          onClick={() => onVideoClick(video)}
          onPlay={onPlay ? () => onPlay(video) : undefined}
          onAdd={onAdd ? () => onAdd(video) : undefined}
          onInfo={onInfo ? () => onInfo(video) : undefined}
          isInPlaylist={isInPlaylist?.(video) ?? false}
        />
      ))}
    </div>
  )
}
