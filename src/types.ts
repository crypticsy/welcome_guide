export interface Location {
  id: number
  name: string
  location: string
  type: string
  description: string
  tags: string[]
  coords?: [number, number]
}

export interface Category {
  key: string
  label: string
  icon: string
  color: string
  locations: Location[]
}
