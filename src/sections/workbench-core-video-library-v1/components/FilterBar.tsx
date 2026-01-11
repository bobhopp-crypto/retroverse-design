type SortOption = 'title' | 'popularity' | 'year'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedDecade: string | null
  onDecadeChange: (decade: string | null) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

const DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedDecade,
  onDecadeChange,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 border-b border-[#3C3129] bg-[#241E18]">
      {/* Search box */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search videos..."
        className="w-full px-3 sm:px-4 py-2 bg-[#1A1510] border border-[#3C3129] rounded text-[#F5ECD7] placeholder-[#C7BBA7] focus:outline-none focus:border-[#E8D29A] focus:ring-2 focus:ring-[#E8D29A]/20 text-sm sm:text-base"
      />

      {/* Decade filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onDecadeChange(null)}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            selectedDecade === null
              ? 'bg-[#E3C47C] text-[#1A1510]'
              : 'bg-[#2E2620] text-[#C7BBA7] hover:bg-[#3C3129]'
          }`}
        >
          All
        </button>
        {DECADES.map((decade) => (
          <button
            key={decade}
            onClick={() => onDecadeChange(decade)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedDecade === decade
                ? 'bg-[#E3C47C] text-[#1A1510]'
                : 'bg-[#2E2620] text-[#C7BBA7] hover:bg-[#3C3129]'
            }`}
          >
            {decade}
          </button>
        ))}
      </div>

      {/* Sort toggle group */}
      <div className="flex gap-2">
        <span className="text-sm text-[#C7BBA7] mr-2">Sort:</span>
        <button
          onClick={() => onSortChange('title')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            sortBy === 'title'
              ? 'bg-[#A6765B] text-[#F5ECD7]'
              : 'bg-[#2E2620] text-[#C7BBA7] hover:bg-[#3C3129]'
          }`}
        >
          A–Z
        </button>
        <button
          onClick={() => onSortChange('popularity')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            sortBy === 'popularity'
              ? 'bg-[#A6765B] text-[#F5ECD7]'
              : 'bg-[#2E2620] text-[#C7BBA7] hover:bg-[#3C3129]'
          }`}
        >
          Popularity
        </button>
        <button
          onClick={() => onSortChange('year')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            sortBy === 'year'
              ? 'bg-[#A6765B] text-[#F5ECD7]'
              : 'bg-[#2E2620] text-[#C7BBA7] hover:bg-[#3C3129]'
          }`}
        >
          Year
        </button>
      </div>
    </div>
  )
}
