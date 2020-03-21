import React, { Component } from 'react';
import SVGPanZoom from './components/svg-pan-zoom';
import LoadSVG from './components/load-svg';
import { svgDummyData } from './svgData';
import './index.css';
class App extends Component {
  state = {
    containerWidth: 0,
    containerHeight: 0,
    areaValue: { overview: true, name: 'Default View' },
    areaList: [
      { overview: true, name: 'Default View' },
      { x: 27, y: 204, width: 100, height: 60, name: 'A' },
    ],
  };

  componentDidMount() {
    let { clientHeight, clientWidth } = this.containerRef;
    this.setState(() => ({
      containerWidth: clientWidth,
      containerHeight: clientHeight,
    }));
  }

  setAreaList = (value) => {
    this.setState(() => ({ areaValue: value }));
  };

  createSvgData = (svgXML) => {
    return <LoadSVG svgXML={svgXML} />;
  };

  render() {
    return (
      <div style={{ width: '100%', height: '90%' }} ref={(el) => (this.containerRef = el)}>
        <SVGPanZoom
          svgData={this.createSvgData(svgDummyData)}
          containerWidth={this.state.containerWidth}
          containerHeight={this.state.containerHeight}
          areaList={this.state.areaList}
          setAreaList={this.setAreaList}
          areaValue={this.state.areaValue}
        />
      </div>
    );
  }
}

export default App;
