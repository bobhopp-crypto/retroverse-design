import type { VideoFile } from '../types'

interface VideoRowProps {
  video: VideoFile
  onClick: () => void
  onPlay?: () => void
  onAdd?: () => void
  onInfo?: () => void
  isInPlaylist?: boolean
}

export function VideoRow({ video, onClick, onPlay, onAdd, onInfo, isInPlaylist }: VideoRowProps) {
  return (
    <div className="w-full p-3 sm:p-4 hover:bg-[#2E2620] transition-colors border-b border-[#3C3129]">
      <div className="flex gap-3 sm:gap-4 items-center">
        {/* Thumbnail - always render with placeholder fallback */}
        <img
          src={video.thumbnailUrl || '/thumbnails/placeholder.png'}
          alt=""
          loading="lazy"
          className="w-12 h-12 rounded object-cover shrink-0"
        />

        {/* Content */}
        <button
          onClick={onClick}
          className="flex-1 min-w-0 text-left"
        >
          {/* Line 1: Title */}
          <div className="font-semibold text-[#F5ECD7] mb-1 truncate">
            {video.Title}
          </div>
          
          {/* Line 2: Artist */}
          <div className="text-sm text-[#C7BBA7] mb-2 truncate">
            {video.Artist}
          </div>
          
          {/* Line 3: Metadata bar */}
          <div className="flex items-center gap-3 text-xs text-[#C7BBA7]">
            <span>{video.Year || 'Unknown'}</span>
            <span>•</span>
            <span>{video.Length}</span>
            {video.Genre && (
              <>
                <span>•</span>
                <span>{video.Genre}</span>
              </>
            )}
            <span className="ml-auto">{video.PlayCount} plays</span>
          </div>
        </button>

        {/* Action Controls — Right-aligned, compact circular buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Play button (▶) */}
          {onPlay && (
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
          )}

          {/* Add to Playlist button (＋) */}
          {onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAdd()
              }}
              className={`w-7 h-7 rounded-full border transition-colors flex items-center justify-center ${
                isInPlaylist
                  ? 'bg-[#A6765B] border-[#A6765B] text-[#F5ECD7] hover:bg-[#B5846B]'
                  : 'bg-[#2E2620] border-[#3C3129] text-[#C7BBA7] hover:bg-[#3C3129] hover:text-[#F5ECD7]'
              }`}
              aria-label={isInPlaylist ? "Remove from Playlist" : "Add to Playlist"}
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          )}

          {/* Info button (ℹ) */}
          {onInfo && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onInfo()
              }}
              className="w-7 h-7 rounded-full bg-[#2E2620] border border-[#3C3129] text-[#C7BBA7] hover:bg-[#3C3129] hover:text-[#F5ECD7] transition-colors flex items-center justify-center"
              aria-label="Info"
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
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
