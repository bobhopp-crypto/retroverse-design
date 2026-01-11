import type { VideoFile } from '../types'

interface PlaylistCardProps {
  video: VideoFile
  onPlay: () => void
  onRemove: () => void
}

/**
 * Playlist Card — Compact Variant (LOCKED)
 * 
 * Differences from VideoRow:
 * - No thumbnail
 * - No genre
 * - No play count
 * - No info button
 * - No add (+) button
 * 
 * Controls (same location as library card):
 * - Play (▶)
 * - Remove (✕)
 * 
 * Layout:
 * - Reduced vertical padding
 * - Tighter spacing
 * - Typography unchanged
 */
export function PlaylistCard({ video, onPlay, onRemove }: PlaylistCardProps) {
  return (
    <button
      onClick={onPlay}
      className="w-full text-left p-2 sm:p-3 hover:bg-[#2E2620] transition-colors border-b border-[#3C3129] cursor-pointer"
    >
      <div className="flex gap-3 sm:gap-4 items-center">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Line 1: Title */}
          <div className="font-semibold text-[#F5ECD7] mb-1 truncate">
            {video.Title}
          </div>

          {/* Line 2: Artist */}
          <div className="text-sm text-[#C7BBA7] mb-1 truncate">
            {video.Artist}
          </div>

          {/* Line 3: Metadata bar (Year, Duration only) */}
          <div className="flex items-center gap-3 text-xs text-[#C7BBA7]">
            <span>{video.Year || 'Unknown'}</span>
            <span>•</span>
            <span>{video.Length}</span>
          </div>
        </div>

        {/* Controls — Play and Remove buttons (compact size) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Play button (▶) */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPlay()
            }}
            className="w-7 h-7 rounded-full bg-[#2E2620] border border-[#3C3129] text-[#C7BBA7] hover:bg-[#3C3129] hover:text-[#F5ECD7] transition-colors flex items-center justify-center"
            aria-label="Play"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5 ml-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
              />
            </svg>
          </button>

          {/* Remove button (✕) */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="w-7 h-7 rounded-full bg-[#2E2620] border border-[#3C3129] text-[#C7BBA7] hover:bg-[#3C3129] hover:text-[#F5ECD7] transition-colors flex items-center justify-center"
            aria-label="Remove"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </button>
  )
}
