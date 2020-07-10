import React, { useMemo, useCallback, useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Line, Label } from 'recharts';

import { Switch, Dropdown } from 'components/forms';
import LoadingSpinner from 'components/loading-spinner';
import LegendTitle from 'components/map/legend/title';
import { BOUNDARIES } from 'components/map';
import { fetchChartData } from './helpers';

const dataReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return { ...state, loading: true, error: false, refetch: false };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: true };

    default:
      return state;
  }
};

const TimeseriesSection = ({ legendLayers, boundaries, areaInterest, updateLayer }) => {
  /**
   * @type {[any, (action: any) => void]}
   */
  const [dataState, dataDispatch] = useReducer(dataReducer, {
    loading: true,
    error: false,
    data: null,
  });

  const socLayerGroup = useMemo(
    () => legendLayers.find(layer => layer.id === 'soc-stock' || layer.id === 'soc-experimental'),
    [legendLayers]
  );

  const typeOption = useMemo(
    () =>
      socLayerGroup.layers[0].extraParams.config.settings.type.options.find(
        option => option.value === socLayerGroup.layers[0].extraParams.type
      ),
    [socLayerGroup]
  );

  const depthOption = useMemo(
    () =>
      typeOption.settings.depth.options.find(
        option => option.value === socLayerGroup.layers[0].extraParams.depth
      ),
    [typeOption, socLayerGroup]
  );

  const modeOptions = useMemo(() => {
    return typeOption.settings.mode.options;
  }, [typeOption]);

  const [year1Option, setYear1Option] = useState(
    typeOption.settings.year.options.find(
      option => option.value === `${typeOption.settings.year1.defaultOption}`
    )
  );

  const [year2Option, setYear2Option] = useState(
    typeOption.settings.year.options.find(
      option => option.value === `${typeOption.settings.year2.defaultOption}`
    )
  );

  const year1Options = useMemo(
    () => typeOption.settings.year.options.filter(option => +option.value < +year2Option.value),
    [typeOption, year2Option]
  );

  const year2Options = useMemo(
    () => typeOption.settings.year.options.filter(option => +option.value > +year1Option.value),
    [typeOption, year1Option]
  );

  const chartData = useMemo(() => {
    if (!dataState.data?.length) {
      return [];
    }

    return dataState.data.filter(d => d.year >= +year1Option.value && d.year <= +year2Option.value);
  }, [dataState, year1Option, year2Option]);

  const onChangeMode = useCallback(() => {
    const newMode =
      socLayerGroup.layers[0].extraParams.mode === modeOptions[0].value
        ? modeOptions[1].value
        : modeOptions[0].value;

    updateLayer({ id: socLayerGroup.id, mode: newMode });
  }, [socLayerGroup, modeOptions, updateLayer]);

  useEffect(() => {
    dataDispatch({ type: 'FETCH_INIT' });

    fetchChartData({
      table: BOUNDARIES[boundaries].table,
      geoId: BOUNDARIES[boundaries].geoId,
      areaInterest,
      depth: depthOption,
      variable:
        socLayerGroup.id === 'soc-stock' || socLayerGroup.layers[0].extraParams.type === 'stock'
          ? 'stocks'
          : 'concentration',
      group:
        socLayerGroup.id === 'soc-stock'
          ? socLayerGroup.layers[0].extraParams.type
          : 'experimental_dataset',
    })
      .then(data => dataDispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch(() => dataDispatch({ type: 'FETCH_FAILURE' }));
  }, [boundaries, areaInterest, typeOption, depthOption, socLayerGroup]);

  useEffect(() => {
    setYear1Option(
      typeOption.settings.year.options.find(
        option => option.value === `${typeOption.settings.year1.defaultOption}`
      )
    );

    setYear2Option(
      typeOption.settings.year.options.find(
        option => option.value === `${typeOption.settings.year2.defaultOption}`
      )
    );
  }, [typeOption, setYear1Option, setYear2Option]);

  return (
    <section>
      <LegendTitle
        layerGroup={socLayerGroup}
        onChangeParams={(id, params) => updateLayer({ id, ...params })}
      />
      <header className="mt-2">
        <h4>{modeOptions[0].label}</h4>
        <Switch
          id="analysis-timeseries-toggle"
          checked={socLayerGroup.layers[0].extraParams.mode === modeOptions[0].value}
          onChange={onChangeMode}
          className="-label-left"
        >
          Display on map
        </Switch>
      </header>
      {!!dataState.error && (
        <div className="alert alert-danger mt-2" role="alert">
          Unable to fetch the data.
        </div>
      )}
      {!dataState.error && dataState.loading && (!dataState.data || dataState.data.length === 0) && (
        <div className="mt-2 text-center">
          <LoadingSpinner transparent inline />
        </div>
      )}
      {!dataState.error && !dataState.loading && (!dataState.data || dataState.data.length === 0) && (
        <div className="alert alert-primary mt-2" role="alert">
          No data available.
        </div>
      )}
      {!dataState.error && dataState.data?.length > 0 && (
        <>
          <div className="chart-intro">
            Soil organic carbon from
            <Dropdown
              options={year1Options}
              value={year1Option}
              onChange={option => setYear1Option(option)}
            />
            to
            <Dropdown
              options={year2Options}
              value={year2Option}
              onChange={option => setYear2Option(option)}
            />
            at <strong>{depthOption.label} depth</strong>.
          </div>
          <ResponsiveContainer width="100%" aspect={1.3}>
            <LineChart data={chartData} margin={{ top: 0, right: 0, bottom: 45, left: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="5 5" />
              <XAxis dataKey="year" padding={{ left: 20, right: 20 }}>
                <Label
                  position="insideBottomLeft"
                  content={({ viewBox }) => {
                    const LINE_HEIGHT = 16;
                    return (
                      <g className="recharts-text recharts-legend">
                        <rect
                          width={100}
                          height={22}
                          x={viewBox.x}
                          y={viewBox.y + LINE_HEIGHT + 35}
                        />
                        <line
                          x1={viewBox.x + 5}
                          x2={viewBox.x + 35}
                          y1={viewBox.y + LINE_HEIGHT + 46}
                          y2={viewBox.y + LINE_HEIGHT + 46}
                          strokeDasharray="5 5"
                        />
                        <text
                          x={viewBox.x + 40}
                          y={viewBox.y + LINE_HEIGHT + 50}
                          textAnchor="start"
                        >
                          0-30 cm
                        </text>
                      </g>
                    );
                  }}
                />
              </XAxis>
              <YAxis dataKey="value" width={70} axisLine={false} tickLine={false}>
                <Label
                  position="insideTopRight"
                  content={() => {
                    const LINE_HEIGHT = 16;
                    return (
                      <g className="recharts-text recharts-label">
                        <text x={0} y={LINE_HEIGHT} transform="rotate(-90)" textAnchor="end">
                          Soil Organic Carbon{' '}
                          {socLayerGroup.id !== 'soc-stock'
                            ? socLayerGroup.layers[0].extraParams.type
                            : `stock`}
                        </text>
                        <text x={0} y={LINE_HEIGHT * 2} transform="rotate(-90)" textAnchor="end">
                          (t C/ha)
                        </text>
                      </g>
                    );
                  }}
                />
              </YAxis>
              <Line dataKey="value" dot={false} strokeDasharray="5 5" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </section>
  );
};

TimeseriesSection.propTypes = {
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  boundaries: PropTypes.string.isRequired,
  areaInterest: PropTypes.object.isRequired,
  updateLayer: PropTypes.func.isRequired,
};

export default TimeseriesSection;
