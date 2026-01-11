import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { VideoFile } from '../types'

interface VideoDetailOverlayProps {
  video: VideoFile | null
  open: boolean
  onClose: () => void
  onPlay?: (video: VideoFile) => void
  onAddToPlaylist?: (video: VideoFile) => void
  isInPlaylist?: (video: VideoFile) => boolean
}

export function VideoDetailOverlay({ 
  video, 
  open, 
  onClose, 
  onPlay, 
  onAddToPlaylist,
  isInPlaylist 
}: VideoDetailOverlayProps) {
  if (!video) return null

  const handlePlay = () => {
    if (onPlay) {
      onPlay(video)
      onClose()
    }
  }

  const handleAddToPlaylist = () => {
    if (onAddToPlaylist) {
      onAddToPlaylist(video)
    }
  }

  const inPlaylist = isInPlaylist?.(video) ?? false

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#241E18] border-[#3C3129] text-[#F5ECD7] max-w-[calc(100vw-2rem)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#F5ECD7] mb-4 text-lg sm:text-xl">{video.Title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thumbnail - always render with placeholder fallback */}
          <img
            src={video.thumbnailUrl || '/thumbnails/placeholder.png'}
            alt=""
            className="w-full h-32 sm:h-48 object-cover rounded border border-[#3C3129]"
          />

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="text-[#C7BBA7] w-24">Artist:</span>
              <span className="text-[#F5ECD7]">{video.Artist}</span>
            </div>
            <div className="flex">
              <span className="text-[#C7BBA7] w-24">Year:</span>
              <span className="text-[#F5ECD7]">{video.Year || 'Unknown'}</span>
            </div>
            <div className="flex">
              <span className="text-[#C7BBA7] w-24">Genre:</span>
              <span className="text-[#F5ECD7]">{video.Genre || 'Unknown'}</span>
            </div>
            <div className="flex">
              <span className="text-[#C7BBA7] w-24">Duration:</span>
              <span className="text-[#F5ECD7]">{video.Length}</span>
            </div>
            <div className="flex">
              <span className="text-[#C7BBA7] w-24">Plays:</span>
              <span className="text-[#F5ECD7]">{video.PlayCount}</span>
            </div>
            {video.Grouping && (
              <div className="flex">
                <span className="text-[#C7BBA7] w-24">Grouping:</span>
                <span className="text-[#F5ECD7]">{video.Grouping}</span>
              </div>
            )}
            {video.FilePath && (
              <div className="flex">
                <span className="text-[#C7BBA7] w-24">Path:</span>
                <span className="text-[#C7BBA7] text-xs font-mono break-all">{video.FilePath}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-[#3C3129]">
          {onPlay && (
            <button
              onClick={handlePlay}
              className="flex-1 px-4 py-2.5 rounded text-sm font-medium transition-colors bg-[#A6765B] text-[#F5ECD7] hover:bg-[#B5846B] border border-[#A6765B]"
            >
              Play
            </button>
          )}
          {onAddToPlaylist && (
            <button
              onClick={handleAddToPlaylist}
              className={`flex-1 px-4 py-2.5 rounded text-sm font-medium transition-colors border ${
                inPlaylist
                  ? 'bg-[#A6765B] text-[#F5ECD7] border-[#A6765B] hover:bg-[#B5846B]'
                  : 'bg-[#2E2620] text-[#C7BBA7] border-[#3C3129] hover:bg-[#3C3129] hover:text-[#F5ECD7]'
              }`}
            >
              {inPlaylist ? 'Remove from Playlist' : 'Add to Playlist'}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
