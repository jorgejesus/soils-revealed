export const BASEMAPS = {
  light: {
    label: 'White',
    image: null,
    backgroundColor: '#d4d8da',
    minZoom: 0,
    maxZoom: 19,
    url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
  },
  dark: {
    label: 'Dark',
    image: null,
    backgroundColor: '#282626',
    minZoom: 0,
    maxZoom: 19,
    url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
  },
  satellite: {
    label: 'Satellite',
    image: null,
    backgroundColor: '#061b3a',
    minZoom: 0,
    maxZoom: 18,
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  },
  landsat: {
    label: 'Landsat',
    image: null,
    backgroundColor: '#020043',
    minZoom: 0,
    maxZoom: 12,
    url: 'https://api.resourcewatch.org/v2/landsat-tiles/{year}/{z}/{x}/{y}',
    params: {
      year: {
        label: 'Year',
        values: [2013, 2014, 2015, 2016, 2017],
        default: 2017,
      },
    },
    attribution: 'rw',
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
    // minZoom: 0,
    // maxZoom: 8,
    // url: '',
    // render: {
    //   layers: [
    //     {
    //       type: 'fill',
    //       'source-layer': 'Biomes',
    //       paint: {
    //         'fill-color': 'orange',
    //         'fill-opacity': 0.5,
    //         'fill-outline-color': 'red',
    //       },
    //     },
    //   ],
    // },
  },
};

export const ATTRIBUTIONS = {
  rw:
    'Powered by <a href="https://resourcewatch.org/" target="_blank" rel="noopener noreferrer">Resource Watch</a>',
};
