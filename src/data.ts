import type { Category, Location } from './types'
import rawData from './data/places.json'
import { haversineKm } from './utils/distance'
import { OFFICE } from './constants'

function sortByDistance(locations: Location[]): Location[] {
  return locations.slice().sort((a, b) => {
    if (!a.coords) return -1
    if (!b.coords) return 1
    return haversineKm(OFFICE.coords, a.coords) - haversineKm(OFFICE.coords, b.coords)
  })
}

function toCoords(place: { lat?: number | null; lng?: number | null }): [number, number] | undefined {
  if (place.lat != null && place.lng != null) return [place.lat, place.lng]
  return undefined
}

type RawPlace = { id: number; name: string; location: string; type: string; description: string; tags: string[]; lat?: number | null; lng?: number | null }

function mapLocations(places: RawPlace[]): Location[] {
  return places.map(l => ({ ...l, coords: toCoords(l) }))
}

export const categories: Category[] = [
  {
    key: 'accommodations',
    label: 'Stay',
    icon: 'accommodation',
    color: '#b07d3a',
    locations: sortByDistance(mapLocations(rawData.accommodations)),
  },
  {
    key: 'restaurants',
    label: 'Restaurants',
    icon: 'restaurant',
    color: '#e05a2b',
    locations: sortByDistance(mapLocations(rawData.restaurants)),
  },
  {
    key: 'medical_facilities',
    label: 'Medical',
    icon: 'medical',
    color: '#e30413',
    locations: sortByDistance(mapLocations(rawData.medical_facilities)),
  },
  {
    key: 'things_to_do',
    label: 'Attractions',
    icon: 'attraction',
    color: '#c4916c',
    locations: sortByDistance(mapLocations(rawData.things_to_do)),
  },
  {
    key: 'fuel_stations',
    label: 'Fuel',
    icon: 'fuel',
    color: '#5a9a3a',
    locations: sortByDistance(mapLocations(rawData.fuel_stations)),
  },
  {
    key: 'local_shops',
    label: 'Shops',
    icon: 'shop',
    color: '#8a5fad',
    locations: sortByDistance(mapLocations(rawData.local_shops)),
  },
  {
    key: 'garages',
    label: 'Garages',
    icon: 'garage',
    color: '#3d8fad',
    locations: sortByDistance(mapLocations(rawData.garages)),
  },
]
