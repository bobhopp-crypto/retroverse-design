import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { PlaylistShell } from './PlaylistShell'
import type { VideoFile } from '../types'

interface PlaylistPanelProps {
  open: boolean
  onClose: () => void
  playlistTracks: VideoFile[]
  onVideoClick?: (video: VideoFile) => void
  onRemove?: (video: VideoFile) => void
}

/**
 * Playlist Panel — Overlay Mode (LOCKED)
 * 
 * Rules:
 * - Library remains mounted underneath
 * - Playlist panel covers ~90–95% viewport height
 * - Dismissible via close button or swipe-down
 * - Independent scrolling
 * - Opening playlist must NOT replace the Video Library list
 */
export function PlaylistPanel({
  open,
  onClose,
  playlistTracks,
  onVideoClick,
  onRemove,
}: PlaylistPanelProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="bg-[#241E18] border-[#3C3129] text-[#F5ECD7] p-0 max-w-6xl w-full max-h-[95vh] h-[95vh] flex flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto">
          <PlaylistShell
            playlistTracks={playlistTracks}
            onVideoClick={onVideoClick}
            onRemove={onRemove}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
