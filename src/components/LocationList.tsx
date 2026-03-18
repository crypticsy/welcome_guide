import { TbExternalLink, TbMapPin, TbNavigation, TbRoute } from 'react-icons/tb'
import type { Category, Location } from '../types'
import { OFFICE } from '../constants'
import { haversineKm, formatKm, directionsUrl } from '../utils/distance'

interface Props {
  category: Category
  selectedId: number | null
  onSelect: (location: Location) => void
}

export default function LocationList({ category, selectedId, onSelect }: Props) {
  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Section header */}
      <div
        style={{
          padding: '20px 24px 14px',
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 400,
            color: 'var(--text)',
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          {category.label}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 400,
            color: 'var(--text-3)',
          }}
        >
          {category.locations.length} locations in Halifax
        </p>
      </div>

      {/* List */}
      <div style={{ overflow: 'auto', flex: 1, padding: '0 12px 16px' }}>
        {category.locations.map((loc, idx) => (
          <div
            key={loc.id}
            className="anim-slide-in"
            style={{ animationDelay: `${idx * 16}ms` }}
          >
            <LocationRow
              loc={loc}
              rank={idx + 1}
              isSelected={loc.id === selectedId}
              color={category.color}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

interface RowProps {
  loc: Location
  rank: number
  isSelected: boolean
  color: string
  onSelect: (loc: Location) => void
}

function LocationRow({ loc, rank, isSelected, color, onSelect }: RowProps) {
  // Link-only entries (no coords) open the URL directly instead of selecting a map pin
  if (!loc.coords) {
    return (
      <a
        href={loc.location}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          padding: '14px 14px',
          borderRadius: 'var(--radius)',
          marginBottom: 4,
          background: 'transparent',
          border: '1.5px solid var(--border)',
          textDecoration: 'none',
          transition: 'all var(--transition)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-surface)'
          e.currentTarget.style.borderColor = `${color}50`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'var(--border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `${color}12`,
              border: `1.5px solid ${color}35`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <TbExternalLink size={13} strokeWidth={2} style={{ color }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'var(--text)',
              lineHeight: 1.35,
              marginBottom: 3,
            }}>
              {loc.name}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 400,
              color: color,
              marginBottom: 6,
            }}>
              {loc.type}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--text-2)',
              lineHeight: 1.55,
            }}>
              {loc.description}
            </div>
          </div>
          <TbExternalLink size={14} strokeWidth={2} style={{ color, flexShrink: 0, marginTop: 2 }} />
        </div>
      </a>
    )
  }

  return (
    <div
      onClick={() => onSelect(loc)}
      style={{
        padding: '14px 14px',
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        marginBottom: 4,
        background: isSelected ? `${color}0a` : 'transparent',
        border: isSelected
          ? `1.5px solid ${color}35`
          : '1.5px solid transparent',
        transition: 'all var(--transition)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'var(--bg-surface)'
          e.currentTarget.style.borderColor = 'var(--border)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Number badge */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: isSelected ? color : 'var(--bg-surface)',
            border: `1.5px solid ${isSelected ? color : 'var(--border)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: 1,
            transition: 'all var(--transition)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 10,
              fontWeight: 600,
              color: isSelected ? 'white' : 'var(--text-3)',
              lineHeight: 1,
            }}
          >
            {rank}
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'var(--text)',
              lineHeight: 1.35,
              marginBottom: 3,
            }}
          >
            {loc.name}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              fontWeight: 400,
              color: isSelected ? color : 'var(--text-3)',
              marginBottom: 6,
              transition: 'color var(--transition)',
            }}
          >
            {loc.type}
          </div>

          {/* Description + distance (expanded when selected) */}
          {isSelected && (() => {
            const dist = loc.coords ? haversineKm(OFFICE.coords, loc.coords) : null
            return (
              <>
                <p
                  className="anim-fade-up"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    fontWeight: 400,
                    color: 'var(--text-2)',
                    lineHeight: 1.65,
                    marginBottom: 10,
                  }}
                >
                  {loc.description}
                </p>

                {/* Distance + directions row */}
                {dist !== null && (
                  <div
                    className="anim-fade-up"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 10,
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <TbRoute size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} strokeWidth={2} />
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      color: 'var(--text-2)',
                      flex: 1,
                    }}>
                      <strong style={{ fontWeight: 600, color: 'var(--text)' }}>{formatKm(dist)}</strong>
                      {' '}from site office
                    </span>
                    <a
                      href={directionsUrl(loc.coords!)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontFamily: 'var(--font-body)',
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: color,
                        textDecoration: 'none',
                        padding: '4px 9px',
                        borderRadius: 99,
                        border: `1.5px solid ${color}35`,
                        background: `${color}0d`,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      <TbNavigation size={11} strokeWidth={2.5} />
                      Directions
                    </a>
                  </div>
                )}
              </>
            )
          })()}

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {loc.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 10,
                  fontWeight: 500,
                  color: isSelected ? color : 'var(--text-3)',
                  background: isSelected ? `${color}10` : 'var(--bg-surface)',
                  border: `1px solid ${isSelected ? `${color}28` : 'var(--border)'}`,
                  borderRadius: 99,
                  padding: '2px 8px',
                  transition: 'all var(--transition)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
          }}
        >
          {isSelected && (
            <TbMapPin size={14} style={{ color: color }} strokeWidth={2} />
          )}
          <a
            href={loc.location}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open in Google Maps"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-sm)',
              border: `1.5px solid ${isSelected ? `${color}40` : 'var(--border)'}`,
              background: isSelected ? `${color}0d` : 'transparent',
              color: isSelected ? color : 'var(--text-3)',
              textDecoration: 'none',
              transition: 'all var(--transition)',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${color}12`
              e.currentTarget.style.borderColor = `${color}50`
              e.currentTarget.style.color = color
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-3)'
              } else {
                e.currentTarget.style.background = `${color}0d`
                e.currentTarget.style.borderColor = `${color}40`
                e.currentTarget.style.color = color
              }
            }}
          >
            <TbExternalLink size={13} strokeWidth={2} />
          </a>
        </div>
      </div>
    </div>
  )
}
