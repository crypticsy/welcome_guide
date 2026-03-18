export function haversineKm(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number],
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatKm(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

export function directionsUrl(dest: [number, number]): string {
  const [lat, lng] = dest
  return `https://www.google.com/maps/dir/53.7044641,-1.8574304/${lat},${lng}`
}
