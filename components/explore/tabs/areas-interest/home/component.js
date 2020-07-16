import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { getLayerExtraParams } from 'utils/map';
import { BOUNDARIES, LAYERS } from 'components/map';
import { Dropdown } from 'components/forms';
import { useResults } from './helpers';
import Ranking from '../ranking';

import './style.scss';

const AreasInterestHome = ({
  legendLayers,
  boundaries,
  rankingBoundaries,
  rankingBoundariesOptions,
  updateBoundaries,
  updateAreaInterest,
  updateLayer,
}) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data: results, error } = useResults(debouncedSearch);

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

  /**
   * @type {(search: string) => void}
   */
  const updateSearch = useCallback(
    debounce(search => setDebouncedSearch(search), 300),
    [setDebouncedSearch]
  );

  const onClickArea = useCallback(
    result => {
      if (boundaries !== result.type) {
        updateBoundaries(result.type);
      }

      updateAreaInterest({
        id: result.id,
        name: result.name,
      });
    },
    [boundaries, updateBoundaries, updateAreaInterest]
  );

  const onChangeType = useCallback(
    type => {
      // eslint-disable-next-line no-unused-vars
      const { config, ...otherParams } = getLayerExtraParams(
        { ...LAYERS[socLayerGroup.id], id: socLayerGroup.id },
        { type }
      );
      updateLayer({ id: socLayerGroup.id, type, ...otherParams });
    },
    [socLayerGroup, updateLayer]
  );

  useEffect(() => {
    if (search.length > 0) {
      updateSearch(search);
    } else {
      setDebouncedSearch('');
    }
  }, [search, updateSearch, setDebouncedSearch]);

  return (
    <div className="c-areas-interest-home">
      <h3>Areas of interest</h3>
      <div className="form-group mt-3">
        <input
          type="search"
          aria-label="Search provinces, countries, biomes..."
          className="form-control"
          placeholder="Search provinces, countries, biomes..."
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />
      </div>

      <div className="alert alert-warning mb-3" role="alert">
        This feature is currently under development.
      </div>

      {debouncedSearch.length > 0 && !!error && (
        <div className="alert alert-danger mt-2" role="alert">
          Unable to get the results of your search.
        </div>
      )}

      {debouncedSearch.length > 0 && !error && !!results && results.length === 0 && (
        <div className="search-results">No results.</div>
      )}
      {debouncedSearch.length > 0 && !error && results?.length > 0 && (
        <div className="search-results">
          {results.map(result => (
            <div key={`${result.id}-${result.type}`} className="row">
              <div className="col-7">
                <button type="button" className="btn btn-link" onClick={() => onClickArea(result)}>
                  {result.name}
                </button>
              </div>
              <div className="col-5">{BOUNDARIES[result.type].label}</div>
            </div>
          ))}
        </div>
      )}

      {debouncedSearch.length === 0 && (
        <>
          <div className="ranking-filters">
            {socLayerGroup.id === 'soc-stock' && (
              <>
                <Dropdown
                  options={socLayerGroup.layers[0].extraParams.config.settings.type.options}
                  value={typeOption}
                  onChange={({ value }) => onChangeType(value)}
                />
                Soil Organic Carbon change by
                <Dropdown
                  options={rankingBoundariesOptions}
                  value={rankingBoundariesOptions.find(
                    option => option.value === rankingBoundaries
                  )}
                  onChange={({ value }) => updateBoundaries(value)}
                />
              </>
            )}
            {socLayerGroup.id !== 'soc-stock' && (
              <>
                Soil Organic Carbon
                <Dropdown
                  options={socLayerGroup.layers[0].extraParams.config.settings.type.options}
                  value={typeOption}
                  onChange={({ value }) => onChangeType(value)}
                />
                change by
                <Dropdown
                  options={rankingBoundariesOptions}
                  value={rankingBoundariesOptions.find(
                    option => option.value === rankingBoundaries
                  )}
                  onChange={({ value }) => updateBoundaries(value)}
                />
              </>
            )}
          </div>
          <Ranking />
        </>
      )}
    </div>
  );
};

AreasInterestHome.propTypes = {
  legendLayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  boundaries: PropTypes.string.isRequired,
  rankingBoundaries: PropTypes.string.isRequired,
  rankingBoundariesOptions: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.string.isRequired })
  ).isRequired,
  updateBoundaries: PropTypes.func.isRequired,
  updateAreaInterest: PropTypes.func.isRequired,
  updateLayer: PropTypes.func.isRequired,
};

export default AreasInterestHome;