import { useState } from 'react'
import { TbChevronUp, TbChevronDown } from 'react-icons/tb'
import Header from './components/Header'
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
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
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
            <div style={{ padding: '18px 24px 0', flexShrink: 0 }}>
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
      </div>
    )
  }

  /* ── Mobile layout ── */
  const SHEET_COLLAPSED_H = 172 // tabs + handle + eyebrow
  const SHEET_EXPANDED_H  = '72vh'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      <Header />

      {/* Relative container below the header — map + sheet live here */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Map: absolute fill of this container */}
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
          {/* Drag handle + toggle */}
          <div
            onClick={() => setSheetExpanded((v) => !v)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px 20px 6px',
              cursor: 'pointer',
              flexShrink: 0,
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          >
            <div style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: 'var(--border-2)',
              marginBottom: 8,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
              <span style={{ color: 'var(--text-3)' }}>
                {sheetExpanded
                  ? <TbChevronDown size={16} strokeWidth={2} />
                  : <TbChevronUp   size={16} strokeWidth={2} />}
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
