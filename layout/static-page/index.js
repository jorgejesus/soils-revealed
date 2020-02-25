import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Header from 'components/header';

import './style.scss';

const SimplePage = ({ className, children }) => (
  <div className={classNames('l-simple-page', className)}>
    <Header />
    <div className="l-static-page">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-10 offset-md-1">{children}</div>
        </div>
      </div>
    </div>
  </div>
);

SimplePage.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

SimplePage.defaultProps = { className: null };

export default SimplePage;
