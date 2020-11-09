const ee = require('@google/earthengine');
const axios = require('axios').default;

const STOCK_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#B30200" quantity="-20" opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-15" />
      <ColorMapEntry color="#FC8D59" quantity="-10" />
      <ColorMapEntry color="#FDCC8A" quantity="-5" />
      <ColorMapEntry color="#FFFFCC" quantity="0" />
      <ColorMapEntry color="#A1DAB4" quantity="5" />
      <ColorMapEntry color="#31B3BD" quantity="10" />
      <ColorMapEntry color="#1C9099" quantity="15" />
      <ColorMapEntry color="#066C59" quantity="20" />
    </ColorMap>
  </RasterSymbolizer>
`;

const CONCENTRATION_RAMP = `
  <RasterSymbolizer>
    <ColorMap extended="false" type="ramp">
      <ColorMapEntry color="#B30200" quantity="-5" opacity="1" />
      <ColorMapEntry color="#E34A33" quantity="-3.75" />
      <ColorMapEntry color="#FC8D59" quantity="-2.5" />
      <ColorMapEntry color="#FDCC8A" quantity="-1.25" />
      <ColorMapEntry color="#FFFFCC" quantity="0" />
      <ColorMapEntry color="#A1DAB4" quantity="1.25" />
      <ColorMapEntry color="#31B3BD" quantity="2.5" />
      <ColorMapEntry color="#1C9099" quantity="3.75" />
      <ColorMapEntry color="#066C59" quantity="5" />
    </ColorMap>
  </RasterSymbolizer>
`;

module.exports = ({ params: { type, depth, year1, year2, x, y, z } }, res) => {
  try {
    let image;

    if (type === 'stock') {
      const collection = ee.ImageCollection(
        'projects/soils-revealed/experimental-dataset/SOC_stock'
      );

      image = collection
        .filterDate(`${year2}-01-01`, `${year2}-12-31`)
        .first()
        .subtract(collection.filterDate(`${year1}-01-01`, `${year1}-12-31`).first())
        .divide(10)
        .select('b1')
        .sldStyle(STOCK_RAMP);
    } else if (type === 'concentration') {
      const collection = ee.ImageCollection(
        'projects/soils-revealed/experimental-dataset/SOC_concentration_2020'
      );

      image = collection
        .filterDate(`${year2}-01-01`, `${year2}-12-31`)
        .first()
        .subtract(collection.filterDate(`${year1}-01-01`, `${year1}-12-31`).first())
        .select(`b${+depth + 1}`);

      image = image.updateMask(image.gt(0)).sldStyle(CONCENTRATION_RAMP);
    }

    image.getMap({}, async ({ formatTileUrl }) => {
      const url = formatTileUrl(x, y, z);
      const serverPromise = axios.get(url, {
        headers: { Accept: 'image/*' },
        responseType: 'arraybuffer',
      });
      await serverPromise.then(serverResponse => {
        res.set('Content-Type', 'image/png');
        res.set('Cache-Control', 'public,max-age=604800');
        return res.send(Buffer.from(serverResponse.data));
      });
    });
  } catch (e) {
    res.status(404).end();
  }
};
