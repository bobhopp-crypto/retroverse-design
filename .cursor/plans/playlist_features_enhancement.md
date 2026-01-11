# Playlist Features Enhancement

## Overview
Enhance the playlist panel with reordering, export, and playback functionality. Focus only on playlist panel features - do not modify header, random logic, video library list, or layout heights.

## 1. Playlist Reordering (No Handles)

### Requirements
- Press-and-hold anywhere on playlist row to initiate drag
- Row visually "lifts" (subtle shadow/scale) when dragging
- Drag vertically to reorder
- Release to drop
- Works on desktop and mobile (pointer events)
- No drag handles, icons, or extra visual controls
- Minimal visual cues: cursor changes to grab, active row slightly darkens/glows
- Smooth, restrained animation (RetroVerse style)

### Implementation

**File:** `src/sections/workbench-core-video-library-v1/components/PlaylistCard.tsx`

- Add drag state management (isDragging, dragStartY, dragOffsetY)
- Use Pointer Events API for cross-platform support
- Add `onDragStart`, `onPointerMove`, `onPointerUp`, `onPointerCancel` handlers
- Add visual feedback classes when dragging: `cursor-grab`, `cursor-grabbing`, subtle shadow/scale transform
- Prevent click events during drag (use pointer capture)
- Add `onReorder` prop: `(fromIndex: number, toIndex: number) => void`

**File:** `src/sections/workbench-core-video-library-v1/components/PlaylistShell.tsx`

- Add `onReorder` prop and pass to PlaylistCard
- Track item indices for reordering logic
- Pass index to each PlaylistCard

**File:** `src/sections/workbench-core-video-library-v1/components/VideoLibraryHome.tsx`

- Add `handlePlaylistReorder` function that updates playlistTracks array order
- Use array move logic: remove item at fromIndex, insert at toIndex
- Pass handler to PlaylistPanel → PlaylistShell

**Key Functions:**
```typescript
// In PlaylistCard
const handlePointerDown = (e: React.PointerEvent) => {
  // Prevent if clicking buttons
  if (e.target instanceof HTMLElement && e.target.closest('button')) return
  
  setIsDragging(true)
  setDragStartY(e.clientY)
  setDragOffsetY(0)
  e.currentTarget.setPointerCapture(e.pointerId)
  e.preventDefault()
}

const handlePointerMove = (e: React.PointerEvent) => {
  if (!isDragging) return
  const offsetY = e.clientY - dragStartY
  setDragOffsetY(offsetY)
  // Calculate target index based on offset
  // Call onReorder when crossing threshold
}

const handlePointerUp = (e: React.PointerEvent) => {
  if (!isDragging) return
  setIsDragging(false)
  e.currentTarget.releasePointerCapture(e.pointerId)
  // Finalize reorder
}
```

## 2. Playlist Card Layout Verification

### Requirements Check
Current PlaylistCard should have:
- ▶ Play button (left)
- Title (next)
- Artist (next)
- Year (monospace)
- Duration (monospace)
- ✕ Remove button (right)
- No thumbnails ✓
- No genre ✓
- Compact buttons ✓
- Tighter vertical spacing ✓

**Action:** Verify current layout matches spec. If not, update to match: `▶  Title  Artist  Year  Duration  ✕` (single line or two-line layout as appropriate).

## 3. Export Playlist (TXT)

### Requirements
- Export button in PlaylistPanel header
- Format: .txt file
- Filename: `retroverse-playlist.txt`
- Encoding: UTF-8
- One track per line: `Artist - Title`
- No numbering, headers, or extra metadata
- Triggers file download

### Implementation

**File:** `src/sections/workbench-core-video-library-v1/components/PlaylistPanel.tsx`

- Add header section with title "Playlist" and Export button
- Add `onExport` prop

**File:** `src/sections/workbench-core-video-library-v1/components/PlaylistShell.tsx`

- Add `onExport` prop and pass to PlaylistPanel (or handle directly in PlaylistPanel)

**File:** `src/sections/workbench-core-video-library-v1/components/VideoLibraryHome.tsx`

- Add `handleExportPlaylist` function:
```typescript
const handleExportPlaylist = () => {
  const content = playlistTracks
    .map((track) => `${track.Artist} - ${track.Title}`)
    .join('\n')
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'retroverse-playlist.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

**File:** `src/sections/workbench-core-video-library-v1/components/PlaylistPanel.tsx`

- Add header with Export button before scrollable content
- Style button to match RetroVerse theme

## 4. Playback Behavior

### Requirements
- Play button plays playlist sequentially
- Uses existing video player (native browser player via video element)
- Native AirPlay must remain available (Safari default)
- No Chromecast/Google Cast integration
- No shuffle logic

### Implementation

**File:** `src/sections/workbench-core-video-library-v1/components/VideoLibraryHome.tsx`

- Add video playback state: `currentPlaylistIndex`, `isPlayingPlaylist`
- Create video element ref for playback
- Add `handlePlaylistPlay` function:
  - Set `currentPlaylistIndex` to 0
  - Set `isPlayingPlaylist` to true
  - Start playing first track
- Add event handlers for video element:
  - `onEnded`: move to next track in playlist
  - When last track ends, stop playlist
- Update `handlePlay` in PlaylistCard context to call playlist play if in playlist mode

**Note:** This is a minimal implementation. Full video player UI is outside scope. Focus on:
- Sequential playback logic
- Track advancement
- Playlist state management

## Files to Modify

1. `src/sections/workbench-core-video-library-v1/components/PlaylistCard.tsx`
   - Add drag-and-drop reordering logic
   - Add visual feedback for dragging

2. `src/sections/workbench-core-video-library-v1/components/PlaylistShell.tsx`
   - Add onReorder prop
   - Pass index to PlaylistCard

3. `src/sections/workbench-core-video-library-v1/components/PlaylistPanel.tsx`
   - Add header with Export button
   - Add onExport prop

4. `src/sections/workbench-core-video-library-v1/components/VideoLibraryHome.tsx`
   - Add handlePlaylistReorder function
   - Add handleExportPlaylist function
   - Add playlist playback state and logic
   - Wire handlers to components

## Constraints
- ❌ Do NOT change header rows
- ❌ Do NOT change random logic
- ❌ Do NOT change video library list behavior
- ❌ Do NOT change visual height of existing layouts
- ❌ No drag handles
- ❌ No playlist thumbnails
- ❌ No genre display
- ❌ No shuffle
- ❌ No extra playlist controls
- ❌ No casting UI
