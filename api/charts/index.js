const getOnTheFlyData = require('./on-the-fly');
const getTimeseriesData = require('./timeseries');
const getChangeData = require('./change');
const { combineTimeseriesData, combineChangeData } = require('./helpers');

module.exports = async (
  { params: { layer, type, boundaries, depth }, body: { areaInterest, compareAreaInterest } },
  res
) => {
  try {
    let resData;

    const data =
      typeof areaInterest === 'object'
        ? await getOnTheFlyData({ layer, type, boundaries, depth, areaInterest })
        : {
            timeseries: await getTimeseriesData({ layer, type, boundaries, depth, areaInterest }),
            change: await getChangeData({ layer, type, boundaries, depth, areaInterest }),
          };

    resData = data;

    if (compareAreaInterest) {
      const compareData =
        typeof areaInterest === 'object'
          ? await getOnTheFlyData({
              layer,
              type,
              boundaries,
              depth,
              areaInterest: compareAreaInterest,
            })
          : {
              timeseries: await getTimeseriesData({
                layer,
                type,
                boundaries,
                depth,
                areaInterest: compareAreaInterest,
              }),
              change: await getChangeData({
                layer,
                type,
                boundaries,
                depth,
                areaInterest: compareAreaInterest,
              }),
            };

      resData = {
        timeseries: combineTimeseriesData(data.timeseries, compareData.timeseries),
        change: combineChangeData(data.change, compareData.change),
      };
    }

    // We cache the results for 10 minutes
    res.set('Cache-Control', `public,max-age=${10 * 60}`);
    res.send({ data: resData });
  } catch (e) {
    console.log(e);
    res.status(404).end();
  }
};