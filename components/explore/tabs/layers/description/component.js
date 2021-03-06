import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { logEvent } from 'utils/analytics';
import Icon from 'components/icon';
import Markdown from 'components/markdown';

import './style.scss';

const Description = ({ layers, layerId, onClickInfo }) => {
  const [previousLayerId, setPreviousLayerId] = useState(layerId);
  const [selectedTabIndex, setSelectedTabIndex] = useState(1); // The tab 1 is the Recent one

  const onClickTab = useCallback(
    index => {
      logEvent(
        'Map layers',
        'Preview',
        `${layers[layerId].label} (${layers[layerId].paramsConfig.settings.type.options[index].label})`
      );
      setSelectedTabIndex(index);
    },
    [layers, layerId, setSelectedTabIndex]
  );

  // Whenever the layer ID changes, we reset the selected tab
  useEffect(() => {
    if (previousLayerId !== layerId) {
      setSelectedTabIndex(1);
      setPreviousLayerId(layerId);
    }
  }, [previousLayerId, layerId, setSelectedTabIndex, setPreviousLayerId]);

  if (!layerId || !layers[layerId].description) {
    return null;
  }

  return (
    <div className="c-layers-tab-description">
      {layerId !== 'soc-stock' && (
        <>
          <div className="description">
            <Markdown content={layers[layerId].description ?? '−'} />
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link"
            onClick={() => {
              logEvent('Map layers', 'more information', layers[layerId].label);
              onClickInfo({ id: layerId });
            }}
          >
            <Icon name="info" /> More information
          </button>
        </>
      )}
      {layerId === 'soc-stock' && (
        <Tabs className="description-tabs" selectedIndex={selectedTabIndex} onSelect={onClickTab}>
          <TabList>
            {layers[layerId].paramsConfig.settings.type.options.map(option => (
              <Tab key={option.value}>{option.label}</Tab>
            ))}
          </TabList>
          {layers[layerId].paramsConfig.settings.type.options.map(option => (
            <TabPanel key={option.value}>
              <div className="description">
                <Markdown content={layers[layerId].description[option.value] ?? '−'} />
              </div>
              <button
                type="button"
                className="btn btn-sm btn-link"
                onClick={() => {
                  logEvent(
                    'Map layers',
                    'more information',
                    `${layers[layerId].label} (${option.label})`
                  );
                  onClickInfo({
                    id: layerId,
                    tab: option.value,
                  });
                }}
              >
                <Icon name="info" /> More information
              </button>
            </TabPanel>
          ))}
        </Tabs>
      )}
    </div>
  );
};

Description.propTypes = {
  layers: PropTypes.object.isRequired,
  layerId: PropTypes.string,
  onClickInfo: PropTypes.func.isRequired,
};

Description.defaultProps = {
  layerId: null,
};

export default Description;
