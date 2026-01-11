import { useState, useMemo } from 'react'
import type { VideoFile } from '../types'
import { VideoLibraryHeader } from './VideoLibraryHeader'
import { VideoList } from './VideoList'
import { VideoDetailOverlay } from './VideoDetailOverlay'
import { PlaylistPanel } from './PlaylistPanel'
import { parseDuration } from '../utils/duration'

type SortOption = 'title' | 'artist' | 'year' | 'count'

interface VideoLibraryHomeProps {
  videos: VideoFile[]
}

export function VideoLibraryHome({ videos }: VideoLibraryHomeProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('title')
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  
  // Playlist state (in-memory, append-only)
  const [playlistTracks, setPlaylistTracks] = useState<VideoFile[]>([])
  
  // Preview state (temporary filter, does not modify playlist)
  const [previewTracks, setPreviewTracks] = useState<VideoFile[] | null>(null)
  
  // Calculate min/max years from videos (for slider bounds)
  const { minYear, maxYear } = useMemo(() => {
    const years = videos.map((v) => v.Year).filter((y) => y > 0)
    return {
      minYear: 1950, // Fixed minimum
      maxYear: years.length > 0 ? Math.max(...years) : 2020,
    }
  }, [videos])
  
  // Center year for 7-year range (initialize to Catalog mode = minYear)
  const [centerYear, setCenterYear] = useState(() => {
    return 1950 // Start in Catalog mode (slider fully left)
  })

  // Parse year/year range from search text
  const parsedYearRange = useMemo(() => {
    const query = searchQuery.trim()
    if (!query) return null

    // Match 4-digit year (e.g., "1987")
    const fourDigitYearMatch = query.match(/\b(19\d{2}|20\d{2})\b/)
    if (fourDigitYearMatch) {
      const year = Number(fourDigitYearMatch[1])
      const clampedYear = Math.max(1950, Math.min(maxYear, year))
      return { start: clampedYear, end: clampedYear }
    }

    // Match year range (e.g., "1985-1991", "85-91", "1985–1991", "85–91")
    const rangeMatch = query.match(/\b(19\d{2}|20\d{2}|[0-9]{2})\s*[-–]\s*(19\d{2}|20\d{2}|[0-9]{2})\b/)
    if (rangeMatch) {
      let startYear = Number(rangeMatch[1])
      let endYear = Number(rangeMatch[2])

      // Handle 2-digit years (infer century from dataset)
      if (startYear < 100) {
        // Infer century: if year <= 50, assume 2000s; otherwise 1900s
        // But clamp to dataset bounds
        if (startYear <= 50) {
          startYear = 2000 + startYear
        } else {
          startYear = 1900 + startYear
        }
        // Clamp to dataset range
        startYear = Math.max(1950, Math.min(maxYear, startYear))
      }
      if (endYear < 100) {
        if (endYear <= 50) {
          endYear = 2000 + endYear
        } else {
          endYear = 1900 + endYear
        }
        endYear = Math.max(1950, Math.min(maxYear, endYear))
      }

      // Ensure start <= end
      if (startYear > endYear) {
        [startYear, endYear] = [endYear, startYear]
      }

      return {
        start: Math.max(1950, Math.min(maxYear, startYear)),
        end: Math.max(1950, Math.min(maxYear, endYear)),
      }
    }

    // Match 2-digit year (e.g., "87")
    const twoDigitYearMatch = query.match(/\b([0-9]{2})\b/)
    if (twoDigitYearMatch) {
      let year = Number(twoDigitYearMatch[1])
      // Infer century: if year <= 50, assume 2000s; otherwise 1900s
      if (year <= 50) {
        year = 2000 + year
      } else {
        year = 1900 + year
      }
      const clampedYear = Math.max(1950, Math.min(maxYear, year))
      return { start: clampedYear, end: clampedYear }
    }

    return null
  }, [searchQuery, maxYear])

  // Filter and sort videos
  const filteredAndSortedVideos = useMemo(() => {
    // If preview mode is active, use preview tracks instead
    if (previewTracks !== null) {
      return previewTracks
    }

    let filtered = videos

    // Check if slider is in Catalog mode (fully left = minYear)
    const isCatalogMode = centerYear === minYear

    // Determine year range: use parsed year from search if present, otherwise use slider range
    const yearRange = parsedYearRange || (() => {
      // If Catalog mode, don't filter by year
      if (isCatalogMode) {
        return null
      }
      const rangeStart = Math.max(minYear, centerYear - 3)
      const rangeEnd = Math.min(maxYear, centerYear + 3)
      return { start: rangeStart, end: rangeEnd }
    })()

    // Apply search filter (title and artist)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      // Remove year patterns from query for text matching
      const textQuery = query
        .replace(/\b(19\d{2}|20\d{2}|[0-9]{2})\s*[-–]\s*(19\d{2}|20\d{2}|[0-9]{2})\b/g, '')
        .replace(/\b(19\d{2}|20\d{2}|[0-9]{2})\b/g, '')
        .trim()

      if (textQuery) {
        filtered = filtered.filter(
          (video) =>
            video.Title.toLowerCase().includes(textQuery) ||
            video.Artist.toLowerCase().includes(textQuery)
        )
      }
    }

    // Apply year range filter (from search or slider, but skip if Catalog mode and no search year)
    if (yearRange) {
      filtered = filtered.filter((video) => {
        // Clamp year for filtering: < 1950 → 1950, > maxYear → maxYear
        const clampedYear = Math.max(1950, Math.min(maxYear, video.Year || 0))
        return clampedYear >= yearRange.start && clampedYear <= yearRange.end
      })
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.Title.localeCompare(b.Title)
        case 'artist':
          return a.Artist.localeCompare(b.Artist)
        case 'year':
          return (b.Year || 0) - (a.Year || 0)
        case 'count':
          return b.PlayCount - a.PlayCount
        default:
          return 0
      }
    })

    return sorted
  }, [videos, searchQuery, centerYear, maxYear, sortBy, parsedYearRange, previewTracks])

  const handleVideoClick = (video: VideoFile) => {
    setSelectedVideo(video)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedVideo(null)
  }

  // Handle Play (placeholder - will be implemented later)
  const handlePlay = (video: VideoFile) => {
    // TODO: Implement play functionality
    console.log('Play:', video.Title)
  }

  // Handle Add to Playlist (toggle)
  const handleAddVideoToPlaylist = (video: VideoFile) => {
    setPlaylistTracks((prev) => {
      const isInPlaylist = prev.some((v) => v.FilePath === video.FilePath)
      if (isInPlaylist) {
        // Remove from playlist
        return prev.filter((v) => v.FilePath !== video.FilePath)
      } else {
        // Add to playlist
        return [...prev, video]
      }
    })
  }

  // Helper to check if video is in playlist
  const isVideoInPlaylist = (video: VideoFile): boolean => {
    return playlistTracks.some((v) => v.FilePath === video.FilePath)
  }

  // Handle Info (opens detail overlay)
  const handleInfo = (video: VideoFile) => {
    setSelectedVideo(video)
    setIsDetailOpen(true)
  }

  // Playlist panel state (overlay mode)
  const [isPlaylistPanelOpen, setIsPlaylistPanelOpen] = useState(false)

  // Calculate playlist duration (in seconds)
  const playlistDuration = useMemo(() => {
    return playlistTracks.reduce((sum, track) => {
      return sum + parseDuration(track.Length || '0:0')
    }, 0)
  }, [playlistTracks])

  // Handle Add to Playlist
  const handleAddToPlaylist = (tracks: VideoFile[]) => {
    setPlaylistTracks((prev) => [...prev, ...tracks])
    setPreviewTracks(null) // Clear preview when adding to playlist
    setIsPlaylistPanelOpen(true) // Open playlist overlay
  }

  // Handle Preview Only
  const handlePreview = (tracks: VideoFile[]) => {
    setPreviewTracks(tracks) // Temporarily filter library view
  }

  // Clear preview when search/filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setPreviewTracks(null) // Clear preview on filter change
  }

  // Handle year range change
  const handleCenterYearChange = (year: number) => {
    setCenterYear(year)
    setPreviewTracks(null) // Clear preview on year change
  }

  // Handle sort change
  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
    setPreviewTracks(null) // Clear preview on sort change
  }

  // Handle clear filters (for Catalog mode - reset to Catalog position)
  const handleClearFilters = () => {
    setSearchQuery('')
    setCenterYear(minYear) // Reset to Catalog mode (slider fully left)
    setPreviewTracks(null) // Clear preview
  }

  // Handle Random panel open/close to clear preview
  const handleRandomPanelOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setPreviewTracks(null) // Clear preview when panel reopens
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1510] text-[#F5ECD7]">
      {/* Header — v1 (Locked) */}
      <VideoLibraryHeader
        visibleCount={filteredAndSortedVideos.length}
        totalCount={videos.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        centerYear={centerYear}
        onCenterYearChange={handleCenterYearChange}
        minYear={minYear}
        maxYear={maxYear}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        playlistCount={playlistTracks.length}
        playlistDuration={playlistDuration}
        filteredTracks={filteredAndSortedVideos}
        allTracks={videos}
        onAddToPlaylist={handleAddToPlaylist}
        onPreview={handlePreview}
        onClearFilters={handleClearFilters}
        onRandomPanelOpenChange={handleRandomPanelOpenChange}
      />

      {/* Main Content — Library (always visible) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-0 sm:pt-4 pb-4">
        <VideoList
          videos={filteredAndSortedVideos}
          onVideoClick={handleVideoClick}
          onPlay={handlePlay}
          onAdd={handleAddVideoToPlaylist}
          onInfo={handleInfo}
          isInPlaylist={isVideoInPlaylist}
        />
      </div>

      {/* Playlist Panel — Overlay */}
      <PlaylistPanel
        open={isPlaylistPanelOpen}
        onClose={() => setIsPlaylistPanelOpen(false)}
        playlistTracks={playlistTracks}
        onVideoClick={handleVideoClick}
        onRemove={(video) => {
          setPlaylistTracks((prev) => prev.filter((v) => v.FilePath !== video.FilePath))
        }}
      />

      {/* Footer placeholder for future timeline / nostalgia navigation (inactive in v1) */}
      <div className="border-t border-[#3C3129] bg-[#241E18] px-6 py-4 mt-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-[#C7BBA7] opacity-50">
          Timeline & Nostalgia Navigation (v2+)
        </div>
      </div>

      {/* Detail Overlay */}
      <VideoDetailOverlay
        video={selectedVideo}
        open={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  )
}
