import React from 'react';
import PropTypes from 'prop-types';
import { SvgLoader } from 'react-svgmt';
import { createSvgElement } from '../../utils/svg';
import { SELECTED_AREA_RECT_ID } from '../../constants/misc';

const LoadSVG = (props) => {
  const { svgXML } = props;

  const createSelectedTerminalRect = (loadedSvg) => {
    const targetElement = loadedSvg;
    const rectMetadata = {
      name: 'rect',
      attributes: {
        id: SELECTED_AREA_RECT_ID,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      styles: {
        fill: 'rgb(0,0,0,0)',
        stroke: '#5BAFB4',
        strokeWidth: '0.5px',
        strokeDasharray: '0.5 0.5',
      },
    };
    const rect = createSvgElement(rectMetadata);
    targetElement.appendChild(rect);
  };

  return <SvgLoader svgXML={svgXML} onSVGReady={createSelectedTerminalRect}></SvgLoader>;
};

LoadSVG.propTypes = {
  svgXML: PropTypes.string.isRequired,
};

export default LoadSVG;
