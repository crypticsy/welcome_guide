import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Category, Location } from '../types'
import { OFFICE } from '../constants'
import { haversineKm, formatKm, directionsUrl } from '../utils/distance'
import { useIsMobile } from '../hooks/useIsMobile'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const SELECTED_COLOR = '#e30413'

function createMarkerIcon(color: string, index: number, isSelected: boolean): L.DivIcon {
  const bg     = isSelected ? SELECTED_COLOR : color + 'dd'
  const size   = isSelected ? 38 : 30
  const border = isSelected ? 3 : 2.5
  const font   = isSelected ? 12 : 10
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:50% 50% 50% 0;
      background:${bg};
      border:${border}px solid white;
      box-shadow:${isSelected
        ? `0 0 0 4px ${SELECTED_COLOR}28,0 4px 16px rgba(28,21,16,0.35)`
        : '0 2px 8px rgba(28,21,16,0.2)'};
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;">
      <span style="transform:rotate(45deg);color:white;font-size:${font}px;font-weight:600;
        font-family:'Century Gothic',CenturyGothic,AppleGothic,sans-serif;line-height:1;display:block;">${index}</span>
    </div>`,
    iconSize:    [size, size],
    iconAnchor:  [Math.round(size / 2), Math.round(size * 1.207)],
    popupAnchor: [0, -Math.round(size * 1.414 + 8)],
  })
}

function MapRefSetter({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap()
  useEffect(() => { mapRef.current = map }, [map, mapRef])
  return null
}

// Controls map viewport and opens popup when a location is selected from the sidebar
function MapController({
  categoryKey,
  allCoords,
  selectedLocation,
  markerRefs,
}: {
  categoryKey: string
  allCoords: [number, number][]
  selectedLocation: Location | null
  markerRefs: React.RefObject<Map<number, L.Marker>>
}) {
  const map              = useMap()
  const prevCategoryRef  = useRef<string>('')
  const prevSelectedId   = useRef<number | null>(null)
  const pendingHandler   = useRef<(() => void) | null>(null)

  function cancelPending() {
    if (pendingHandler.current) {
      map.off('moveend', pendingHandler.current)
      pendingHandler.current = null
    }
  }

  function fitAll(coords: [number, number][]) {
    const bounds = L.latLngBounds([...coords, OFFICE.coords])
    map.setView(bounds.getCenter(), map.getBoundsZoom(bounds, false, L.point(48, 48)), { animate: true, duration: 0.4 })
  }

  // Fit all markers when category changes
  useEffect(() => {
    if (categoryKey !== prevCategoryRef.current) {
      prevCategoryRef.current = categoryKey
      prevSelectedId.current  = null
      cancelPending()
      map.closePopup()
      if (allCoords.length > 0) fitAll(allCoords)
    }
  }, [categoryKey, allCoords, map])

  // Navigate to selected location + open its popup
  useEffect(() => {
    if (selectedLocation?.coords && selectedLocation.id !== prevSelectedId.current) {
      prevSelectedId.current = selectedLocation.id
      cancelPending()
      map.closePopup()
      map.setView(selectedLocation.coords, 17, { animate: true, duration: 0.4 })
      const targetId = selectedLocation.id
      const handler = () => {
        pendingHandler.current = null
        if (prevSelectedId.current === targetId) {
          markerRefs.current?.get(targetId)?.openPopup()
        }
      }
      pendingHandler.current = handler
      map.once('moveend', handler)
    } else if (!selectedLocation && prevSelectedId.current !== null) {
      prevSelectedId.current = null
      cancelPending()
      map.closePopup()
      if (allCoords.length > 0) fitAll(allCoords)
    }
  }, [selectedLocation, allCoords, map, markerRefs])

  return null
}

interface Props {
  category: Category
  selectedLocation: Location | null
  onMarkerClick: (location: Location) => void
}

export default function MapView({ category, selectedLocation, onMarkerClick }: Props) {
  const allCoords  = category.locations.flatMap((l) => (l.coords ? [l.coords] : []))
  const markerRefs = useRef<Map<number, L.Marker>>(new Map())
  const mapRef     = useRef<L.Map | null>(null)
  const isMobile   = useIsMobile()

  // Clear refs when category changes
  useEffect(() => {
    markerRefs.current.clear()
  }, [category.key])

  return (
    <div style={{ flex: 1, height: '100%', position: 'relative', overflow: 'hidden' }}>
      <MapContainer
        center={OFFICE.coords}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRefSetter mapRef={mapRef} />

        {/* CRH / Site Office boundary */}
        <Circle
          center={OFFICE.coords}
          radius={220}
          pathOptions={{
            color: '#22c55e',
            weight: 2.5,
            opacity: 0.9,
            fillColor: '#22c55e',
            fillOpacity: 0.06,
            dashArray: '6 4',
          }}
        />

        <MapController
          categoryKey={category.key}
          allCoords={allCoords}
          selectedLocation={selectedLocation}
          markerRefs={markerRefs}
        />

        {/* Location markers */}
        {category.locations.map((loc, idx) => {
          if (!loc.coords) return null
          const isSel = selectedLocation?.id === loc.id
          const dist  = haversineKm(OFFICE.coords, loc.coords)
          return (
            <Marker
              key={`${category.key}-${loc.id}`}
              position={loc.coords}
              icon={createMarkerIcon(category.color, idx + 1, isSel)}
              zIndexOffset={isSel ? 1000 : 0}
              ref={(m) => {
                if (m) markerRefs.current.set(loc.id, m)
                else markerRefs.current.delete(loc.id)
              }}
              eventHandlers={{ click: () => onMarkerClick(loc) }}
            >
              <Popup minWidth={240} maxWidth={300}>
                <div style={{ fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif", padding: '18px 20px 16px' }}>

                  {/* Type pill */}
                  <span style={{
                    display: 'inline-block',
                    fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif",
                    fontSize: 9.5, fontWeight: 600, letterSpacing: '0.8px',
                    textTransform: 'uppercase' as const,
                    color: category.color, background: `${category.color}12`,
                    border: `1px solid ${category.color}28`,
                    borderRadius: 99, padding: '3px 9px', marginBottom: 10,
                  }}>
                    {loc.type}
                  </span>

                  {/* Name */}
                  <div style={{
                    fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif",
                    fontSize: 15, color: '#1c1510', lineHeight: 1.3, marginBottom: 6,
                  }}>
                    {loc.name}
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 12, color: '#5c4f44', lineHeight: 1.6, marginBottom: 10 }}>
                    {loc.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginBottom: 12 }}>
                    {loc.tags.map((tag) => (
                      <span key={tag} style={{
                        fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif",
                        fontSize: 10, fontWeight: 500, color: '#8b7d6e',
                        background: '#f5ede0', border: '1px solid #e2d5c3',
                        borderRadius: 99, padding: '2px 8px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Distance from office */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 10px', marginBottom: 12,
                    background: '#f5ede0', border: '1px solid #e2d5c3',
                    borderRadius: 6,
                  }}>
                    <span style={{ fontSize: 13 }}>📍</span>
                    <span style={{ fontSize: 11, color: '#5c4f44', flex: 1 }}>
                      <strong style={{ fontWeight: 600, color: '#1c1510' }}>{formatKm(dist)}</strong>
                      {' '}from site office
                    </span>
                    <a
                      href={directionsUrl(loc.coords)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif",
                        fontSize: 10.5, fontWeight: 600,
                        color: category.color, textDecoration: 'none',
                        padding: '4px 9px', borderRadius: 99,
                        border: `1.5px solid ${category.color}35`,
                        background: `${category.color}0d`,
                        whiteSpace: 'nowrap' as const,
                      }}
                    >
                      ↗ Directions
                    </a>
                  </div>

                  {/* Google Maps link */}
                  <a
                    href={loc.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif",
                      fontSize: 11.5, fontWeight: 600, color: category.color,
                      textDecoration: 'none', padding: '7px 14px', borderRadius: 99,
                      border: `1.5px solid ${category.color}35`,
                      background: `${category.color}0e`, letterSpacing: '0.2px',
                    }}
                  >
                    Open in Google Maps ↗
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Office marker */}
        <Marker
          position={OFFICE.coords}
          icon={L.divIcon({
            className: '',
            html: `<div style="
              width:38px;height:38px;border-radius:50% 50% 50% 0;
              background:#000;border:3px solid #ffe900;
              box-shadow:0 0 0 3px rgba(0,0,0,0.18),0 4px 14px rgba(0,0,0,0.35);
              transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;">
              <span style="transform:rotate(45deg);color:#ffe900;font-size:13px;
                font-weight:700;font-family:'DM Sans',sans-serif;line-height:1;">⚑</span>
            </div>`,
            iconSize: [38, 38], iconAnchor: [19, 46], popupAnchor: [0, -62],
          })}
          zIndexOffset={2000}
        >
          <Popup minWidth={200}>
            <div style={{ fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif", padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: '#000', border: '2px solid #ffe900',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#ffe900', fontSize: 14 }}>⚑</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, color: '#1c1510', lineHeight: 1.2 }}>
                    Site Office
                  </div>
                  <div style={{ fontSize: 10, color: '#8b7d6e', fontWeight: 500, marginTop: 1 }}>
                    Calderdale Royal Hospital
                  </div>
                </div>
              </div>
              <a
                href={OFFICE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif", fontSize: 11, fontWeight: 600,
                  color: '#1c1510', textDecoration: 'none',
                  padding: '6px 12px', borderRadius: 99,
                  border: '1.5px solid #000', background: '#ffe90018',
                }}
              >
                View on Google Maps ↗
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Zoom controls */}
      <div style={{
        position: 'absolute',
        bottom: isMobile ? 174 : 32,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        {(['+', '−'] as const).map((label) => (
          <button
            key={label}
            onClick={() => label === '+' ? mapRef.current?.zoomIn() : mapRef.current?.zoomOut()}
            style={{
              width: 36,
              height: 36,
              border: '1px solid var(--border)',
              borderRadius: 8,
              background: 'rgba(253,248,241,0.92)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: '0 2px 12px rgba(28,21,16,0.10)',
              cursor: 'pointer',
              fontSize: 20,
              fontWeight: 300,
              color: 'var(--text-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-body)',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(245,237,224,0.98)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(253,248,241,0.92)'
              e.currentTarget.style.color = 'var(--text-2)'
            }}
            aria-label={label === '+' ? 'Zoom in' : 'Zoom out'}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Floating category pill */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        zIndex: 1000, background: 'rgba(253,248,241,0.90)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        borderRadius: 99, padding: '7px 18px',
        boxShadow: '0 2px 20px rgba(28,21,16,0.1)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
        pointerEvents: 'none' as const, whiteSpace: 'nowrap' as const,
      }}>
        <span style={{ fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif", fontSize: 11, fontWeight: 500, color: '#5c4f44' }}>
          {category.label}
        </span>
        <span style={{ width: 1, height: 12, background: '#e2d5c3' }} />
        <span style={{ fontFamily: "'Century Gothic', CenturyGothic, AppleGothic, sans-serif", fontSize: 11, fontWeight: 600, color: category.color }}>
          {category.locations.length} locations
        </span>
      </div>
    </div>
  )
}
