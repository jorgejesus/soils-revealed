export const BASEMAPS = {
  light: {
    label: 'White',
    image: null,
    minZoom: 0,
    maxZoom: 19,
    mapStyle: {
      version: 8,
      sources: {
        'carto-tiles': {
          type: 'raster',
          tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'],
          tileSize: 256,
          minzoom: 0,
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: 'basemap',
          type: 'raster',
          source: 'carto-tiles',
        },
      ],
    },
  },
  dark: {
    label: 'Dark',
    image: null,
    minZoom: 0,
    maxZoom: 19,
    mapStyle: {
      version: 8,
      sources: {
        'carto-tiles': {
          type: 'raster',
          tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
          tileSize: 256,
          minzoom: 0,
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: 'basemap',
          type: 'raster',
          source: 'carto-tiles',
        },
      ],
    },
  },
  satellite: {
    label: 'Satellite',
    image: null,
    minZoom: 0,
    maxZoom: 18,
    mapStyle: {
      version: 8,
      sources: {
        'carto-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          minzoom: 0,
          maxzoom: 18,
        },
      },
      layers: [
        {
          id: 'basemap',
          type: 'raster',
          source: 'carto-tiles',
        },
      ],
    },
  },
};

export const BOUNDARIES = {
  'no-boundaries': {
    label: 'No boundaries',
  },
  'political-boundaries': {
    label: 'Political boundaries',
  },
  'protected-areas': {
    label: 'Protected areas',
  },
  'river-basins': {
    label: 'River basins',
  },
  biomes: {
    label: 'Biomes',
  },
};
