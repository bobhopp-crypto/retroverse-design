import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import type { VideoFile } from '../types'
import { parseDuration } from '../utils/duration'

type RotationMode = 'promo' | 'light' | 'steady' | 'heavy' | 'catalog'

interface RandomPanelProps {
  open: boolean
  onClose: () => void
  filteredTracks: VideoFile[]
  allTracks: VideoFile[] // Full database for Catalog mode
  onAddToPlaylist: (tracks: VideoFile[]) => void
  onPreview: (tracks: VideoFile[]) => void
  onClearFilters?: () => void // For Catalog mode
  centerYear?: number
  minYear?: number
  maxYear?: number
  searchQuery?: string
}

/**
 * Random Panel — Compact control surface for randomized track selection
 * 
 * Layout (Vertical Stack):
 * 1. Header Row (title + close)
 * 2. Track Count Selector (stepper)
 * 3. Rotation Control (segmented selector)
 * 4. Preview Summary (monospace: NN • HH:MM)
 * 5. Action Buttons (Add to Playlist, Preview Only)
 */
// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function RandomPanel({
  open,
  onClose,
  filteredTracks,
  allTracks,
  onAddToPlaylist,
  onPreview,
  onClearFilters,
  centerYear,
  minYear,
  maxYear,
  searchQuery,
}: RandomPanelProps) {
  const [trackCount, setTrackCount] = useState(10)
  const [rotationMode, setRotationMode] = useState<RotationMode>('catalog')
  const [generatedTracks, setGeneratedTracks] = useState<VideoFile[]>([])

  // Handle Catalog mode: clear filters when selected
  const handleRotationModeChange = (mode: RotationMode) => {
    setRotationMode(mode)
    if (mode === 'catalog' && onClearFilters) {
      onClearFilters()
    }
  }

  // Determine source tracks based on rotation mode
  const sourceTracks = useMemo(() => {
    if (rotationMode === 'catalog') {
      return allTracks // Use full database
    }
    return filteredTracks // Use filtered set
  }, [rotationMode, filteredTracks, allTracks])

  // Determine source label for display
  const sourceLabel = useMemo(() => {
    if (searchQuery && searchQuery.trim()) {
      return 'Search'
    }
    const isCatalogMode = centerYear !== undefined && minYear !== undefined && centerYear === minYear
    if (isCatalogMode) {
      return 'Catalog'
    }
    if (centerYear !== undefined && minYear !== undefined && maxYear !== undefined) {
      const rangeStart = Math.max(minYear, centerYear - 3)
      const rangeEnd = Math.min(maxYear, centerYear + 3)
      return `${rangeStart}–${rangeEnd}`
    }
    return 'Catalog'
  }, [searchQuery, centerYear, minYear, maxYear])

  // Stats calculation (based on generatedTracks only)
  const stats = useMemo(() => {
    if (generatedTracks.length === 0) {
      return {
        count: 0,
        hours: 0,
        minutes: 0,
      }
    }
    
    // Calculate total duration (normalize to seconds)
    const totalSeconds = generatedTracks.reduce((sum, track) => {
      return sum + parseDuration(track.Length || '0:0')
    }, 0)
    
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    
    return {
      count: generatedTracks.length,
      hours,
      minutes,
    }
  }, [generatedTracks])

  // Handle Generate button
  const handleGenerate = () => {
    // Shuffle source tracks and take first N
    const shuffled = shuffleArray(sourceTracks)
    const selectedTracks = shuffled.slice(0, Math.min(trackCount, shuffled.length))
    setGeneratedTracks(selectedTracks)
  }

  const handleAddToPlaylist = () => {
    if (generatedTracks.length === 0) return
    onAddToPlaylist(generatedTracks)
    onClose()
    // Reset generated tracks after adding
    setGeneratedTracks([])
  }

  const handlePreview = () => {
    if (generatedTracks.length === 0) return
    onPreview(generatedTracks)
    onClose()
    // Reset generated tracks after preview
    setGeneratedTracks([])
  }

  const canGenerate = trackCount > 0 && sourceTracks.length > 0
  const canApply = generatedTracks.length > 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="bg-[#241E18] border-[#3C3129] text-[#F5ECD7] p-0 max-w-md"
        showCloseButton={false}
      >
        {/* 1. Header Row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#3C3129]">
          <h2 
            className="text-sm font-semibold text-[#F5ECD7]"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            Randomize
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#C7BBA7] hover:bg-[#2E2620] hover:text-[#F5ECD7] transition-colors"
            aria-label="Close"
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

        <div className="px-4 py-4 space-y-4">
          {/* 2. Track Count Selector */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setTrackCount(Math.max(1, trackCount - 1))}
              className="w-8 h-8 rounded-full bg-[#2E2620] border border-[#3C3129] text-[#C7BBA7] hover:bg-[#3C3129] hover:text-[#F5ECD7] transition-colors flex items-center justify-center text-lg"
            >
              –
            </button>
            <div className="text-2xl font-mono text-[#F5ECD7] min-w-[60px] text-center">
              {trackCount}
            </div>
            <button
              onClick={() => setTrackCount(Math.min(100, trackCount + 1))}
              className="w-8 h-8 rounded-full bg-[#2E2620] border border-[#3C3129] text-[#C7BBA7] hover:bg-[#3C3129] hover:text-[#F5ECD7] transition-colors flex items-center justify-center text-lg"
            >
              +
            </button>
          </div>

          {/* 3. Rotation Control */}
          <div className="flex gap-1">
            {(['promo', 'light', 'steady', 'heavy', 'catalog'] as RotationMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => handleRotationModeChange(mode)}
                className={`flex-1 px-2 py-1.5 rounded text-xs transition-colors border ${
                  rotationMode === mode
                    ? 'bg-[#A6765B] text-[#F5ECD7] border-[#A6765B]'
                    : 'bg-[#2E2620] text-[#C7BBA7] hover:bg-[#3C3129] border-[#3C3129]'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* 4. Source Display */}
          <div className="text-center">
            <div className="text-xs text-[#C7BBA7] opacity-60">
              Source: {sourceLabel}
            </div>
          </div>

          {/* 5. Stats Summary (generatedTracks only) */}
          <div className="text-center">
            <div className="text-xl font-mono text-[#C7BBA7] tracking-wider">
              {stats.count.toString().padStart(2, ' ')} • {stats.hours.toString().padStart(2, '0')}:{stats.minutes.toString().padStart(2, '0')}
            </div>
          </div>

          {/* 6. Generate Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full px-4 py-2 rounded text-sm font-medium transition-colors bg-[#A6765B] text-[#F5ECD7] hover:bg-[#B5846B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate
            </button>
          </div>

          {/* 7. Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAddToPlaylist}
              disabled={!canApply}
              className="flex-1 px-4 py-2 rounded text-sm font-medium transition-colors bg-[#A6765B] text-[#F5ECD7] hover:bg-[#B5846B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Playlist
            </button>
            <button
              onClick={handlePreview}
              disabled={!canApply}
              className="flex-1 px-4 py-2 rounded text-sm transition-colors bg-[#2E2620] text-[#C7BBA7] hover:bg-[#3C3129] disabled:opacity-50 disabled:cursor-not-allowed border border-[#3C3129]"
            >
              Filter List
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
