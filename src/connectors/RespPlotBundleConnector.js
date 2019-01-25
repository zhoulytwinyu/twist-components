import React, { Component } from "react";
import { connect } from "react-redux";
import XAxisDate from "../components/XAxisDate";
import YAxis from "../components/YAxis";
import RespPlot from "../components/RespPlot";
import InteractionBox from "../components/InteractionBox";
import VerticalCrosshair from "../components/VerticalCrosshair";
import Location from "../components/Location";
import {changeTopLevelPlot} from "../actions/plot-actions";
import location from "./test-data/location";
import {plot1x,plot1ys} from "./test-data/plot1";

class RespPlotBundle extends Component {
  render() {
    let { minX,maxX,
          minY,maxY,
          text,
          hoverX,hoverY,
          height, width
          } = this.props;
    let { changeHandler } = this.props;
    let {LEFT,TOP,RIGHT,BOTTOM} = this;
    return (
      <div style={{position:"relative", width:LEFT+RIGHT+width, height:TOP+BOTTOM+height}}>
        <Location data={location} minX={minX} maxX={maxX} height={BOTTOM} width={width} left={LEFT} top={0}/>
        
        <XAxisDate minX={minX} maxX={maxX} height={BOTTOM} width={width} left={LEFT} top={height+TOP} />
        <YAxis minY={minY} maxY={maxY} height={height} width={LEFT} left={0} top={TOP} />
        <RespPlot x={plot1x} ys={plot1ys} minX={minX} maxX={maxX} minY={minY} maxY={maxY} height={height} width={width} left={LEFT} top={TOP} />
        
        <VerticalCrosshair hoverX={hoverX} minX={minX} maxX={maxX} width={width} height={height} left={LEFT} top={TOP} />
        
        <InteractionBox mouseMoveHandler={changeHandler}
                        mouseClickHandler={changeHandler}
                        mouseDragHandler={changeHandler}
                        minX={minX} maxX={maxX} height={height} width={width}
                        left={LEFT} top={TOP} />
      </div>
    );
  }
}

RespPlotBundle.prototype.LEFT=150;
RespPlotBundle.prototype.TOP=50;
RespPlotBundle.prototype.RIGHT=50;
RespPlotBundle.prototype.BOTTOM=50;


const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.minX,
    maxX: state.plot.maxX,
    minY: state.plot.minY,
    maxY: state.plot.maxY,
    text: "disabled",
    hoverX: state.plot.hoverX,
    ...ownProps
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    changeHandler: (obj) => dispatch(changeTopLevelPlot(obj))
  };
};

const RespPlotBundleConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(RespPlotBundle);

export default RespPlotBundleConnector
