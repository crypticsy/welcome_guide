# Halifax Welcome Pack — Laing O'Rourke

An interactive map and location guide for the Laing O'Rourke Advanced Works site in Halifax, UK. Helps site staff quickly find nearby restaurants, garages, fuel stations, shops, medical facilities, attractions, and accommodation — all sorted by distance from the site office.

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build    # type-check + production build → dist/
npm run deploy   # build + publish to GitHub Pages
```

## Adding or updating places

Edit `src/data/places.json` to add, remove, or update locations. Each entry follows this shape:

```json
{
  "id": 1,
  "name": "Place Name",
  "location": "https://maps.app.goo.gl/...",
  "type": "Category subtype",
  "description": "Short description.",
  "tags": ["Tag1", "Tag2"]
}
```

Coordinates are assigned in `src/data.ts` — add a matching entry to the relevant `*Coords` array when adding a new place.
