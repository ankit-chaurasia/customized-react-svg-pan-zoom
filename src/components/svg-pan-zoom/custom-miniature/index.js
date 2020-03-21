import React from 'react';
import PropTypes from 'prop-types';
import { applyToPoints, inverse } from 'transformation-matrix';
import { pan } from 'react-svg-pan-zoom';
import MiniatureMask from './miniature-mask';
import { getSVGPoint } from '../../../utils/svg';
import { getMousePosition } from '../../../utils/common';
import './stylesheets/index.css';

const POSITION_LEFT = 'left';
const POSITION_RIGHT = 'right';

export default function Miniature(props) {
  let {
    value,
    onChangeValue,
    children,
    position,
    background,
    SVGBackground,
    width: miniatureWidth,
    height: miniatureHeight,
    zoomPercentage,
    onReset,
  } = props;
  let { SVGMinX, SVGMinY, SVGWidth, SVGHeight, viewerWidth, viewerHeight } = value;
  let ratio = SVGHeight / SVGWidth;
  let miniatureViewerDom = null;
  let zoomToFit = ratio >= 1 ? miniatureHeight / SVGHeight : miniatureWidth / SVGWidth;
  let [{ x: x1, y: y1 }, { x: x2, y: y2 }] = applyToPoints(inverse(value), [
    { x: 0, y: 0 },
    { x: viewerWidth, y: viewerHeight },
  ]);
  const navFooterHeight = 24;
  const miniatureContainerPadding = 6;
  const miniatureContainerBorderWidth = 1;
  let style = {
    width: miniatureWidth + miniatureContainerBorderWidth * 2 + 'px',
    height: miniatureHeight + miniatureContainerPadding * 2 + miniatureContainerBorderWidth * 2 + navFooterHeight + 'px',
    [position === POSITION_LEFT ? 'left' : 'right']: '6px',
    background,
    padding: miniatureContainerPadding,
    border: `${miniatureContainerBorderWidth}px solid #000`,
  };
  let centerTranslation =
    ratio >= 1
      ? `translate(${(miniatureWidth - SVGWidth * zoomToFit) / 2 - SVGMinX * zoomToFit}, ${-SVGMinY * zoomToFit})`
      : `translate(${-SVGMinX * zoomToFit}, ${(miniatureHeight - SVGHeight * zoomToFit) / 2 - SVGMinY * zoomToFit})`;

  const startPanning = (viewerX, viewerY) => {
    const newValueProps = {
      startX: viewerX,
      startY: viewerY,
      endX: viewerX,
      endY: viewerY,
    };
    onChangeValue({ ...value, ...newValueProps });
  };

  const updatePanning = (viewerX, viewerY) => {
    let { endX, endY } = value;
    let start = getSVGPoint(value, viewerX, viewerY);
    let end = getSVGPoint(value, endX, endY);
    let deltaX = end.x - start.x;
    let deltaY = end.y - start.y;
    let ratio = SVGHeight / SVGWidth;
    let zoomToFit = ratio >= 1 ? SVGHeight / miniatureHeight : SVGWidth / miniatureWidth;
    let nextValue = pan(value, deltaX * zoomToFit * value.d, deltaY * zoomToFit * value.d);
    onChangeValue({ ...nextValue, ...{ endX: viewerX, endY: viewerY } });
  };

  const stopPanning = () => {
    const newValueProps = {
      startX: null,
      startY: null,
      endX: null,
      endY: null,
    };
    onChangeValue({ ...value, ...newValueProps });
  };

  const handleMouseDown = (event) => {
    const { x, y } = getMousePosition(event, miniatureViewerDom);
    startPanning(x, y);
    event.preventDefault();
  };

  const handleMouseMove = (event) => {
    if (event.buttons === 0) {
      stopPanning();
    } else {
      const { x, y } = getMousePosition(event, miniatureViewerDom);
      updatePanning(x, y);
    }
    event.preventDefault();
  };
  const handleMouseUp = (event) => {
    stopPanning();
    event.preventDefault();
  };

  return (
    <div role="navigation" className="miniature-container" style={style}>
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={(el) => (miniatureViewerDom = el)}
      >
        <svg width={miniatureWidth} height={miniatureHeight} style={{ pointerEvents: 'none' }}>
          <g transform={centerTranslation}>
            <g transform={`scale(${zoomToFit}, ${zoomToFit})`}>
              <rect fill={SVGBackground} x={SVGMinX} y={SVGMinY} width={SVGWidth} height={SVGHeight} />
              {children}
              <MiniatureMask x1={x1} y1={y1} x2={x2} y2={y2} />
            </g>
          </g>
        </svg>
      </div>
      <div className="nav-footer" style={{ height: navFooterHeight }}>
        <a className="item resetButton" onClick={onReset}>
          Reset
        </a>
        <div className="item zoomPercentage">{zoomPercentage > 0 ? `${zoomPercentage}%` : ''}</div>
      </div>
    </div>
  );
}

Miniature.propTypes = {
  value: PropTypes.object.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  SVGBackground: PropTypes.string.isRequired,
  position: PropTypes.oneOf([POSITION_RIGHT, POSITION_LEFT]),
  background: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  zoomPercentage: PropTypes.number.isRequired,
  children: PropTypes.element,
};

Miniature.defaultProps = {
  position: POSITION_RIGHT,
  background: '#202020',
  width: 100,
  height: 80,
};
