import React, { Component } from "react";
import { connect } from "react-redux";
import XAxisDate from "../components/XAxisDate";
import YAxis from "../components/YAxis";
import YAxisPanel from "../components/YAxisPanel";
import RespPlot from "../components/RespPlot";
import XRangeSelector from "../components/XRangeSelector";
import InteractionBox from "../components/InteractionBox";
import VerticalCrosshair from "../components/VerticalCrosshair";
import Location from "../components/Location";
import HoverSelectionAddOn from "../components/HoverSelectionAddOn";
import SelectionPoint from "../components/SelectionPoint";
import TriPhaseInteractionHOC from "../components/InteractionHOC/TriPhaseInteractionHOC";
import TriPhaseInteractionBox from "../components/InteractionHOC/TriPhaseInteractionBox";
import HoverInteractionBox from "../components/InteractionHOC/HoverInteractionBox";
import {changeTopLevelPlot} from "../actions/plot-actions";
import location from "./test-data/location";
import {plot1x,plot1ys} from "./test-data/plot1";

let selectionData = [];
for (let i=0; i<plot1x.length; i++) {
  selectionData.push({x:plot1x[i],y:plot1ys[0][i]});
}

let yLimitCategoryPosition = [{name:".danger",start:80,end:100},{name:".asd",start:40,end:80}];
let yLimitPosition = [{name:"ECMO",start:80,end:100},{name:"Haha",start:0,end:80}];
let yLimitCategoryColors = ["yellow","orange","cyan"];
let yLimitColors = ["red","blue"];

class RespPlotBundle extends Component {
  constructor(props){
    super(props);
    this.hoveringHandler = this.hoveringHandler.bind(this);
  }
  
  render() {
    let { minX,maxX,
          minY,maxY,
          text,
          hoverX,hoverY,
          hoverSelection,
          height, width,
          selectorMinX,selectorMaxX
          } = this.props;
    let { changeHandler } = this.props;
    let {LEFT,RIGHT,TOP,BOTTOM} = this;
    return (
      <div style={{position:"relative", width:LEFT+RIGHT+width, height:TOP+BOTTOM+height}}>
        {/*Y Axis*/}
        <div style={{position:"absolute",width:LEFT,height:height}}>
          <YAxisPanel categoryPosition={yLimitCategoryPosition} subcategoryPosition={yLimitPosition}
                      categoryColors={yLimitCategoryColors} subcategoryColors={yLimitColors}
                      minY={minY} maxY={maxY} width={LEFT} height={height}
                      style={{position:"absolute",left:0,top:0}}
                      />
          <YAxis minY={minY} maxY={maxY} width={LEFT} height={height}
                 style={{position:"absolute",left:0,top:0}}
                 />
        </div>
        {/*Plot Area*/}
        <HoverInteractionBox style={{position:"absolute",width:width,height:height,left:LEFT}}
                             hoveringHandler={console.log} mouseOutHandler={}>
          <TriPhaseInteractionBox style={{position:"absolute",width:width,height:height}}
                              fromDomXDiff={null} fromDomYDiff={null}>
            <RespPlot style={{position:"absolute",left:0,top:0}}
                      x={plot1x} ys={plot1ys}
                      minX={minX} maxX={maxX} minY={minY} maxY={maxY}
                      height={height} width={width}
                      />
          </TriPhaseInteractionBox>
          <XRangeSelector minX={minX} maxX={maxX} selectorMinX={selectorMinX} selectorMaxX={selectorMaxX}
                          height={height} width={width}/>
        </HoverInteractionBox>
        {/*X Axis*/}
        <div style={{position:"absolute",width:width,height:BOTTOM,left:LEFT,top:height}}>
          <XAxisDate minX={minX} maxX={maxX} height={BOTTOM} width={width}
                     style={{position:"absolute",left:0,top:0}}
                     />
        </div>
      </div>
    );
  }
  
  hoveringHandler ({domX,domY}) {
    let {changeHandler} = this.props;
    changeHandler({hoverX:domX*10,hoverY:domY*10});
  }
}

RespPlotBundle.prototype.LEFT=150;
RespPlotBundle.prototype.RIGHT=0;
RespPlotBundle.prototype.TOP=0;
RespPlotBundle.prototype.BOTTOM=50;


const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.minX,
    maxX: state.plot.maxX,
    minY: state.plot.minY,
    maxY: state.plot.maxY,
    selectorMinX: state.plot.selectorMinX,
    selectorMaxX: state.plot.selectorMaxX,
    text: state.plot.text,
    hoverX: state.plot.hoverX,
    hoverSelection: state.plot.hoverSelection,
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

