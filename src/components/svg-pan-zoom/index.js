import React from 'react';
import PropTypes from 'prop-types';
import { fitSelection, fitToViewer, INITIAL_VALUE, ReactSVGPanZoom, TOOL_AUTO, zoomOnViewerCenter } from 'react-svg-pan-zoom';
import { ReactSvgPanZoomLoader } from 'react-svg-pan-zoom-loader';
import { AutoSizer } from 'react-virtualized';
import CustomMiniature from './custom-miniature';
import { getPercentage } from '../../utils/common';
import { hideSvgElement, setSvgElementData } from '../../utils/svg';
import { SELECTED_AREA_RECT_ID } from '../../constants/misc';

export default class App extends React.Component {
  state = {
    tool: TOOL_AUTO,
    value: INITIAL_VALUE,
    selectionList: [],
    selectedAreaValue: { overview: true },
  };
  Viewer = null;

  static propTypes = {
    background: PropTypes.string,
    SVGBackground: PropTypes.string,
    scaleFactor: PropTypes.number,
    scaleFactorOnWheel: PropTypes.number,
    scaleFactorMax: PropTypes.number,
    scaleFactorMin: PropTypes.number,
    svgData: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    containerWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    containerHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    areaValue: PropTypes.object,
    areaList: PropTypes.array,
    setAreaList: PropTypes.func,
  };

  static defaultProps = {
    background: '#616264',
    SVGBackground: '#1F3242',
    scaleFactor: 1.1,
    scaleFactorOnWheel: 1.1,
    scaleFactorMax: 19.2,
    scaleFactorMin: 1,
  };

  componentDidMount() {
    if (this.Viewer) {
      this.Viewer.fitToViewer();
    }
  }

  changeTool = (nextTool) => {
    this.setState({ tool: nextTool });
  };

  changeValue = (nextValue) => {
    this.setState({ value: nextValue });
  };

  fitToViewer = () => {
    this.setState((state) => ({ value: fitToViewer(state.value) }));
  };

  onReset = () => {
    this.Viewer.reset();
    hideSvgElement(SELECTED_AREA_RECT_ID);
    this.props.setAreaList(this.props.areaList[0]);
  };

  getZoomPercentage = () => {
    let zoom = 0;
    const maxZoomPercentage = this.props.scaleFactorMax * 100;
    const currentZoom = Math.round(this.state.value.d * 100) / 100;
    if (currentZoom > 1) {
      zoom = Math.round(((currentZoom * 100) / maxZoomPercentage) * 100);
    }
    return zoom;
  };

  updateSelectedAreaRectPosition = (box) => {
    const existingElement = document.getElementById(SELECTED_AREA_RECT_ID);
    if (existingElement) {
      const elementMetadata = {
        attributes: { ...box },
      };
      setSvgElementData(existingElement, elementMetadata);
      existingElement.style.display = 'block';
    }
  };

  handleAreaChange = (event) => {
    const box = JSON.parse(event.target.value);
    if (box.overview) {
      this.changeValue(INITIAL_VALUE);
      hideSvgElement(SELECTED_AREA_RECT_ID);
    } else {
      this.changeValue(zoomOnViewerCenter(fitSelection(this.state.value, box.x, box.y, box.width, box.height), 1 / 1.5));
      this.updateSelectedAreaRectPosition(box);
    }
    this.props.setAreaList(box);
  };

  zoomOnViewerCenter = () => {
    this.setState((state) => ({
      value: zoomOnViewerCenter(state.value, 1.1),
    }));
  };
  zoomOutViewerCenter = () => {
    this.setState((state) => ({
      value: zoomOnViewerCenter(state.value, 1 / 1.1),
    }));
  };

  getViewerValue = () => {
    console.log('getValue()', this.Viewer.getValue());
  };

  render() {
    const {
      svgData,
      containerWidth,
      containerHeight,
      scaleFactor,
      scaleFactorOnWheel,
      scaleFactorMax,
      scaleFactorMin,
      SVGBackground,
    } = this.props;
    return (
      <div>
        <button className="btn" onClick={() => this.zoomOnViewerCenter()}>
          Zoom in
        </button>
        <button className="btn" onClick={() => this.zoomOutViewerCenter()}>
          Zoom out
        </button>
        <button className="btn" onClick={() => this.fitToViewer()}>
          Fit
        </button>
        <button className="btn" onClick={() => this.getViewerValue()}>
          Get current viewer value
        </button>
        <button className="btn" onClick={() => this.onZoom()}>
          Zoom
        </button>
        <select onChange={this.handleAreaChange} value={JSON.stringify(this.props.areaValue)}>
          {this.props.areaList.map((value) => {
            return <option key={JSON.stringify(value)} value={JSON.stringify(value)}>{`Area ${value.name}`}</option>;
          })}
        </select>
        <div ref={(el) => (this.ViewerDOM = el)} style={{ width: containerWidth, height: containerHeight }}>
          <AutoSizer>
            {({ width, height }) => {
              return width === 0 || height === 0 ? null : (
                <ReactSVGPanZoom
                  className="map-overview"
                  detectPinchGesture={false}
                  width={width}
                  height={height}
                  ref={(Viewer) => (this.Viewer = Viewer)}
                  tool={this.state.tool}
                  scaleFactor={scaleFactor}
                  scaleFactorOnWheel={scaleFactorOnWheel}
                  scaleFactorMax={scaleFactorMax}
                  scaleFactorMin={scaleFactorMin}
                  customMiniature={CustomMiniature}
                  miniatureProps={{
                    width: getPercentage(containerWidth, 20),
                    height: getPercentage(containerHeight, 20),
                    zoomPercentage: this.getZoomPercentage(),
                    onReset: this.onReset,
                  }}
                  onChangeTool={this.changeTool}
                  value={this.state.value}
                  onChangeValue={this.changeValue}
                  onClick={() => {}}
                  detectAutoPan={false}
                  SVGBackground={SVGBackground}
                >
                  <svg width={width} height={height} id="overviewSvg">
                    {svgData}
                  </svg>
                </ReactSVGPanZoom>
              );
            }}
          </AutoSizer>
        </div>
      </div>
    );
  }
}
