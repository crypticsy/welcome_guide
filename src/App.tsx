import { useState } from 'react'
import { TbChevronUp, TbChevronDown } from 'react-icons/tb'
import CategoryTabs from './components/CategoryTabs'
import LocationList from './components/LocationList'
import MapView from './components/MapView'
import { categories } from './data'
import type { Location } from './types'
import { useIsMobile } from './hooks/useIsMobile'

export default function App() {
  const [activeCategoryKey, setActiveCategoryKey] = useState(categories[0].key)
  const [selectedLocation, setSelectedLocation]   = useState<Location | null>(null)
  const [sheetExpanded, setSheetExpanded]          = useState(false)
  const isMobile                                   = useIsMobile()

  const activeCategory = categories.find((c) => c.key === activeCategoryKey)!

  function handleCategoryChange(key: string) {
    setActiveCategoryKey(key)
    setSelectedLocation(null)
    if (isMobile) setSheetExpanded(false)
  }

  function handleLocationSelect(location: Location) {
    setSelectedLocation((prev) => (prev?.id === location.id ? null : location))
    if (isMobile) setSheetExpanded(false)
  }

  /* ── Desktop layout ── */
  if (!isMobile) {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div
          style={{
            width: 'var(--sidebar-w)',
            flexShrink: 0,
            background: 'var(--bg-card)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Section label */}
          <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 500,
              color: 'var(--text-4)',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
            }}>
              Explore by category
            </p>
          </div>

          <CategoryTabs
            categories={categories}
            active={activeCategoryKey}
            onChange={handleCategoryChange}
          />

          <LocationList
            category={activeCategory}
            selectedId={selectedLocation?.id ?? null}
            onSelect={handleLocationSelect}
          />

          <div style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-ghost)',
            flexShrink: 0,
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 400,
              color: 'var(--text-4)',
              textAlign: 'center',
              lineHeight: 1.6,
            }}>
              Select a location to highlight on the map
              <br />
              Use ↗ to open directly in Google Maps
            </p>
          </div>
        </div>

        <MapView
          category={activeCategory}
          selectedLocation={selectedLocation}
          onMarkerClick={handleLocationSelect}
        />
      </div>
    )
  }

  /* ── Mobile layout ── */
  const SHEET_COLLAPSED_H = 158
  const SHEET_EXPANDED_H  = '72vh'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      {/* Map fills full screen */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <MapView
            category={activeCategory}
            selectedLocation={selectedLocation}
            onMarkerClick={handleLocationSelect}
          />
        </div>

        {/* ── Bottom sheet ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 500,
            background: 'var(--bg-card)',
            borderRadius: '20px 20px 0 0',
            boxShadow: '0 -4px 32px rgba(28, 21, 16, 0.14)',
            border: '1px solid var(--border)',
            borderBottom: 'none',
            display: 'flex',
            flexDirection: 'column',
            height: sheetExpanded ? SHEET_EXPANDED_H : SHEET_COLLAPSED_H,
            transition: 'height 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
            overflow: 'hidden',
          }}
        >
          {/* Drag handle */}
          <div
            onClick={() => setSheetExpanded((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 18px 8px',
              cursor: 'pointer',
              flexShrink: 0,
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            {/* Active category pill */}
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 600,
              color: activeCategory.color,
              background: `${activeCategory.color}12`,
              border: `1px solid ${activeCategory.color}30`,
              borderRadius: 99,
              padding: '3px 10px',
            }}>
              {activeCategory.label}
            </span>

            {/* Drag pill + chevron */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28,
                height: 3,
                borderRadius: 2,
                background: 'var(--border-2)',
              }} />
              <span style={{ color: 'var(--text-3)', display: 'flex' }}>
                {sheetExpanded
                  ? <TbChevronDown size={15} strokeWidth={2} />
                  : <TbChevronUp   size={15} strokeWidth={2} />}
              </span>
            </div>
          </div>

          {/* Category tabs */}
          <CategoryTabs
            categories={categories}
            active={activeCategoryKey}
            onChange={handleCategoryChange}
          />

          {/* Location list — only rendered when expanded */}
          {sheetExpanded && (
            <LocationList
              category={activeCategory}
              selectedId={selectedLocation?.id ?? null}
              onSelect={handleLocationSelect}
            />
          )}
        </div>
      </div>
    </div>
  )
}
