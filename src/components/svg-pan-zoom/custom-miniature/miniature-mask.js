import React from 'react';
import PropTypes from 'prop-types';

function MiniatureMask({ x1, y1, x2, y2 }) {
  return (
    <g>
      <rect
        x={x1}
        y={y1}
        width={x2 - x1}
        height={y2 - y1}
        style={{
          stroke: '#979797',
          strokeWidth: 10,
          fill: 'rgb(0,0,0,0)',
        }}
      />
    </g>
  );
}

MiniatureMask.propTypes = {
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
};

export default MiniatureMask;
