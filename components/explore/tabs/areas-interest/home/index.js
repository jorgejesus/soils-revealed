import { connect } from 'react-redux';

import { mapSelectors, mapActions, analysisActions } from 'modules/explore';
import Component from './component';

export default connect(
  state => ({
    legendLayers: mapSelectors.selectLegendDataLayers(state),
    boundaries: mapSelectors.selectBoundaries(state),
    rankingBoundaries: mapSelectors.selectRankingBoundaries(state),
    rankingBoundariesOptions: mapSelectors.selectRankingBoundariesOptions(state),
  }),
  {
    updateBoundaries: mapActions.updateBoundaries,
    updateAreaInterest: analysisActions.updateAreaInterest,
    updateLayer: mapActions.updateLayer,
  }
)(Component);
