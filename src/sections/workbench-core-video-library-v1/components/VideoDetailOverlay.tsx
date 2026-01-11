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
}

export function VideoDetailOverlay({ video, open, onClose }: VideoDetailOverlayProps) {
  if (!video) return null

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
      </DialogContent>
    </Dialog>
  )
}
