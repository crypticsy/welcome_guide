import {
  TbToolsKitchen2,
  TbCar,
  TbGasStation,
  TbShoppingBag,
  TbHeartbeat,
  TbBuildingMonument,
  TbBed,
} from 'react-icons/tb'
import type { Category } from '../types'

const iconMap: Record<string, React.ReactNode> = {
  restaurant:    <TbToolsKitchen2    size={15} strokeWidth={1.8} />,
  medical:       <TbHeartbeat        size={15} strokeWidth={1.8} />,
  attraction:    <TbBuildingMonument size={15} strokeWidth={1.8} />,
  garage:        <TbCar              size={15} strokeWidth={1.8} />,
  fuel:          <TbGasStation       size={15} strokeWidth={1.8} />,
  shop:          <TbShoppingBag      size={15} strokeWidth={1.8} />,
  accommodation: <TbBed              size={15} strokeWidth={1.8} />,
}

interface Props {
  categories: Category[]
  active: string
  onChange: (key: string) => void
}

export default function CategoryTabs({ categories, active, onChange }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
        flexShrink: 0,
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}
    >
      {categories.map((cat) => {
        const isActive = cat.key === active
        return (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 99,
              border: isActive
                ? `1.5px solid ${cat.color}55`
                : '1.5px solid var(--border)',
              background: isActive ? `${cat.color}10` : 'transparent',
              cursor: 'pointer',
              color: isActive ? cat.color : 'var(--text-3)',
              flexShrink: 0,
              transition: 'all var(--transition)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--bg-surface)'
                e.currentTarget.style.borderColor = 'var(--border-2)'
                e.currentTarget.style.color = 'var(--text-2)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-3)'
              }
            }}
          >
            <span style={{ lineHeight: 1, display: 'flex' }}>{iconMap[cat.icon]}</span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                lineHeight: 1,
              }}
            >
              {cat.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
