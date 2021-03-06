import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { logEvent } from 'utils/analytics';
import { Select } from 'components/forms';
import GradientBar from 'components/map/legend/gradient-bar';

import './style.scss';

const LEGEND_ITEMS = {
  timeseries: {
    stock: [
      { color: '#FFD0BB', value: '0' },
      { color: '#FFB492', value: '20' },
      { color: '#E18D67', value: '40' },
      { color: '#B74829', value: '60' },
      { color: '#903116', value: '80' },
      { color: '#631E0B', value: '100' },
      { color: '#2A0A02', value: '≥120' },
    ],
    concentration: [
      { color: '#FFD0BB', value: '0' },
      { color: '#FFB492', value: '10' },
      { color: '#E18D67', value: '20' },
      { color: '#B74829', value: '30' },
      { color: '#903116', value: '40' },
      { color: '#631E0B', value: '50' },
      { color: '#2A0A02', value: '≥60' },
    ],
  },
  change: {
    stock: [
      { color: '#B30200', value: '≤-20' },
      { color: '#E34A33', value: '' },
      { color: '#FC8D59', value: '-10' },
      { color: '#FDCC8A', value: '' },
      { color: '#FFFFCC', value: '0' },
      { color: '#A1DAB4', value: '' },
      { color: '#31B3BD', value: '10' },
      { color: '#1C9099', value: '' },
      { color: '#066C59', value: '≥20' },
    ],
    concentration: [
      { color: '#B30200', value: '≤-5' },
      { color: '#E34A33', value: '' },
      { color: '#FC8D59', value: '-2.5' },
      { color: '#FDCC8A', value: '' },
      { color: '#FFFFCC', value: '0' },
      { color: '#A1DAB4', value: '' },
      { color: '#31B3BD', value: '2.5' },
      { color: '#1C9099', value: '' },
      { color: '#066C59', value: '≥5' },
    ],
  },
};

const SOCExperimentalLegend = ({ layerGroup, onChangeParams }) => {
  const layer = layerGroup.layers[0];

  const typeOptions = useMemo(() => layer.extraParams.config.settings.type.options, [layer]);

  const selectedTypeIndex = useMemo(
    () => typeOptions.findIndex(option => option.value === layer.extraParams.type),
    [layer, typeOptions]
  );

  const modeOptions = useMemo(
    () =>
      layer.extraParams.config.settings.type.options.find(
        option => option.value === layer.extraParams.type
      )?.settings.mode.options ?? [],
    [layer]
  );

  const selectedModeIndex = useMemo(
    () => modeOptions.findIndex(option => option.value === layer.extraParams.mode),
    [layer, modeOptions]
  );

  const onChangeMode = useCallback(
    index => {
      logEvent(
        'Legend',
        'interacts with legend "experimental dataset"',
        `Clicks on "${modeOptions[index].label}"`
      );

      const mode = modeOptions[index].value;
      onChangeParams(layerGroup.id, { mode });
    },
    [modeOptions, layerGroup, onChangeParams]
  );

  return (
    <div className="c-map-legend-soc-experimental">
      <div className="gradient-container">
        <GradientBar items={LEGEND_ITEMS[layer.extraParams.mode][layer.extraParams.type]} />
        <div className="unit">
          ({layer.extraParams.type === 'concentration' ? 'g C/kg' : 't C/ha'})
        </div>
      </div>

      <Tabs selectedIndex={selectedModeIndex} onSelect={onChangeMode}>
        <TabList>
          {modeOptions.map(option => (
            <Tab key={option.value}>{option.label}</Tab>
          ))}
          <div className="depth-dropdown">
            {typeOptions[selectedTypeIndex].settings.depth.options.length === 1 && (
              <>
                Soil depth:
                <span className="d-inline-block ml-1 font-weight-bold">
                  {typeOptions[selectedTypeIndex].settings.depth.options[0].label}
                </span>
              </>
            )}
            {typeOptions[selectedTypeIndex].settings.depth.options.length > 1 && (
              <>
                <label htmlFor="legend-depth">Soil depth:</label>
                <Select
                  id="legend-depth"
                  className="ml-2"
                  options={typeOptions[selectedTypeIndex].settings.depth.options}
                  value={layer.extraParams.depth}
                  onChange={({ value }) => {
                    logEvent(
                      'Legend',
                      'interacts with legend "experimental dataset"',
                      'Changes "soil depth"'
                    );
                    onChangeParams(layerGroup.id, { depth: value });
                  }}
                  overflow
                />
              </>
            )}
          </div>
        </TabList>
        <TabPanel className="react-tabs__tab-panel align-items-end">
          <div className="change-year d-flex flex-column">
            <label htmlFor="legend-recent-year">Year:</label>
            <Select
              id="legend-recent-year"
              className="mt-1"
              options={typeOptions[1].settings.year.options}
              value={layer.extraParams.year}
              onChange={({ value }) => {
                logEvent(
                  'Legend',
                  'interacts with legend "experimental dataset"',
                  `Changes year in "${modeOptions[selectedModeIndex].label}"`
                );
                onChangeParams(layerGroup.id, { year: value });
              }}
              overflow
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="change-year d-inline-block mr-4">
            <label htmlFor="legend-from">From:</label>
            <Select
              id="legend-recent-from"
              className="ml-2"
              options={typeOptions[selectedTypeIndex].settings.year.options.map(o => ({
                ...o,
                isDisabled: +o.value >= layer.extraParams.year2,
              }))}
              value={`${layer.extraParams.year1}`}
              onChange={({ value }) => {
                logEvent(
                  'Legend',
                  'interacts with legend "experimental dataset"',
                  `Changes year in "${modeOptions[selectedModeIndex].label}"`
                );
                onChangeParams(layerGroup.id, { year1: +value });
              }}
              overflow
            />
          </div>
          <div className="change-year d-inline-block">
            <label htmlFor="legend-to">To:</label>
            <Select
              id="legend-recent-to"
              className="ml-2"
              options={typeOptions[selectedTypeIndex].settings.year.options.map(o => ({
                ...o,
                isDisabled: +o.value <= layer.extraParams.year1,
              }))}
              value={`${layer.extraParams.year2}`}
              onChange={({ value }) => {
                logEvent(
                  'Legend',
                  'interacts with legend "experimental dataset"',
                  `Changes year in "${modeOptions[selectedModeIndex].label}"`
                );
                onChangeParams(layerGroup.id, { year2: +value });
              }}
              overflow
            />
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

SOCExperimentalLegend.propTypes = {
  layerGroup: PropTypes.object.isRequired,
  onChangeParams: PropTypes.func.isRequired,
};

export default SOCExperimentalLegend;
