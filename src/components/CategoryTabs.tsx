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
  restaurant:    <TbToolsKitchen2    size={16} strokeWidth={1.8} />,
  medical:       <TbHeartbeat        size={16} strokeWidth={1.8} />,
  attraction:    <TbBuildingMonument size={16} strokeWidth={1.8} />,
  garage:        <TbCar              size={16} strokeWidth={1.8} />,
  fuel:          <TbGasStation       size={16} strokeWidth={1.8} />,
  shop:          <TbShoppingBag      size={16} strokeWidth={1.8} />,
  accommodation: <TbBed              size={16} strokeWidth={1.8} />,
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
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 4,
        padding: '8px 12px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      {categories.map((cat) => {
        const isActive = cat.key === active
        return (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '8px 4px',
              borderRadius: 8,
              border: isActive
                ? `1.5px solid ${cat.color}55`
                : '1.5px solid transparent',
              background: isActive ? `${cat.color}10` : 'transparent',
              cursor: 'pointer',
              color: isActive ? cat.color : 'var(--text-3)',
              transition: 'all var(--transition)',
              width: '100%',
              minWidth: 0,
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
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.color = 'var(--text-3)'
              }
            }}
          >
            <span style={{ lineHeight: 1, display: 'flex' }}>{iconMap[cat.icon]}</span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                lineHeight: 1,
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
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
