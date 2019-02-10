import React, { Component } from "react";
import { connect } from "react-redux";
import {changeTopLevelPlot} from "../actions/plot-actions";
// Import components
import XAxisDate from "../components/XAxisDate";
import YAxisPanel from "../components/YAxisPanel";
import VerticalGrid from "../components/VerticalGrid";
import HorizontalSlabGrid from "../components/HorizontalSlabGrid";
import RespiratoryPlot from "../components/RespiratoryPlot";
import LocationPlot from "../components/LocationPlot";
import ProcedurePlot from "../components/ProcedurePlot";
import OnPlotXRangeSelection from "../components/OnPlotXRangeSelection";
import VerticalCrosshair from "../components/VerticalCrosshair";
import HoverSelectionXInteractionBoxWithReference from "../components/InteractionBox/HoverSelectionXInteractionBoxWithReference";
import SelectionPoint from "../components/SelectionPoint";
import InPlotXRangeSelection from "../components/InPlotXRangeSelection";
import DualPhaseXInteractionBoxWithReference from "../components/InteractionBox/DualPhaseXInteractionBoxWithReference";


import location from "./test-data/location";
import procedures from "./test-data/procedures";
import {plot1x,plot1ys} from "./test-data/plot1";

let selectionData = [];
for (let i=0; i<plot1x.length; i++) {
  selectionData.push({x:plot1x[i],ys:[plot1ys[0][i],plot1ys[1][i]] });
}

let yLimitCategoryPosition = [{name:".danger",start:80,end:100},{name:".asd",start:40,end:80}];
let yLimitPosition = [{name:"ECMO",start:80,end:100},{name:"Haha",start:0,end:80}];
let yLimitCategoryColors = ["yellow","orange","cyan"];
let yLimitColors = ["red","blue"];

class RespPlotBundle extends Component {
  render() {
    let { minX,maxX,
          minY,maxY,
          text,
          hoverX,hoverY,
          hoverSelection,
          height, width,
          selectorMinX,selectorMaxX,
          inPlotXRangeSelectionStartDataX,inPlotXRangeSelectionEndDataX,
          onPlotXRangeSelection_StartDataX,onPlotXRangeSelection_EndDataX,
          onPlotXRangeSelection_LeftDeltaDataX,onPlotXRangeSelection_RightDeltaDataX,
          panningDataX
          } = this.props;
    let { changeHandler } = this.props;
    let {LEFT,RIGHT,TOP,BOTTOM} = this;
    minX = minX-panningDataX;
    maxX = maxX-panningDataX;
    return (
      <div style={{position:"relative", width:LEFT+RIGHT+width, height:TOP+BOTTOM+height}}>
        {/*Y Axis*/}
        <div style={{position:"absolute",width:LEFT,height:height,top:TOP}}>
          <YAxisPanel style={{position:"absolute",width:LEFT,height:height}}
                      category={[ {start:80,end:100,bgStyle:{fillStyle:"red"},name:"ECMO",textStyle:{fillStyle:"black",font:"bold 16px Sans",textAlign:"left",textBaseline:"middle"},textPosition:3},
                                  {start:40,end:80,bgStyle:{fillStyle:"yellow"},name:"Other",textStyle:{fillStyle:"black",font:"bold 16px Sans",textAlign:"left",textBaseline:"middle"},textPosition:3}
                                  ]}
                      minY={minY} maxY={maxY} width={LEFT} height={height}
                      />
        </div>
        {/*Plot Area*/}
        <div style={{position:"absolute",width:width,height:height,left:LEFT,top:TOP}}>
          <HorizontalSlabGrid style={{position:"absolute",width:width,height:height}}
                              grid={[ {start:1000,end:800,color:"yellow"},
                                      {start:800,end:600,color:"white"},
                                      {start:600,end:300,color:"yellow"},
                                      {start:300,end:0,color:"white"}]}
                              minY={minY} maxY={maxY} height={height}
                              />
          <VerticalGrid style={{position:"absolute",width:width,height:height}}
                        grid={[{x:2000},{x:8000},{x:16000}]}
                        minX={minX} maxX={maxX} width={width}
                        />
          <RespiratoryPlot  style={{position:"absolute",width:width,height:height}}
                            x={plot1x} ys={plot1ys}
                            minX={minX} maxX={maxX} width={width}
                            minY={minY} maxY={maxY} height={height} 
                            />
          <ProcedurePlot  style={{position:"absolute",width:width,height:height}}
                          data = {procedures}
                          selection={null}
                          minX={minX} maxX={maxX} width={width} height={height}
                          />
          <SelectionPoint style={{position:"absolute",width:width,height:height}}
                          selection={hoverSelection}
                          minX={minX} maxX={maxX} width={width}
                          minY={minY} maxY={maxY} height={height} 
                          />
          <VerticalCrosshair style={{position:"absolute",width:width,height:height}}
                             hoverDataX={hoverX}
                             minX={minX} maxX={maxX} width={width}
                             />
          <InPlotXRangeSelection  style={{position:"absolute",width:width,height:height}}
                                  startDataX={inPlotXRangeSelectionStartDataX} endDataX={inPlotXRangeSelectionEndDataX}
                                  minX={minX} maxX={maxX} width={width}/>
        </div>
        <HoverSelectionXInteractionBoxWithReference style={{position:"absolute",width:width,height:height,left:LEFT,top:TOP}}
                                                    minX={minX} maxX={maxX} width={width}
                                                    minY={minY} maxY={maxY} height={height}
                                                    data={selectionData}
                                                    hoveringHandler={this.hoveringHandler} mouseOutHandler={this.mouseOutHandler}
                                                    selectHandler={this.hoverSelectionHandler} >
          <DualPhaseXInteractionBoxWithReference style={{position:"absolute",width:width,height:height}}
                                                  minX={minX} maxX={maxX} width={width}
                                                  selectingHandler={this.selectingHandler} selectedHandler={this.selectedHandler}
                                                  panningHandler={this.panningHandler} pannedHandler={this.pannedHandler}
                                                  >
            <OnPlotXRangeSelection  style={{position:"absolute",width:width,height:height}}
                                    minX={minX} maxX={maxX} height={height} width={width}
                                    startX={onPlotXRangeSelection_StartDataX+onPlotXRangeSelection_LeftDeltaDataX}
                                    endX={onPlotXRangeSelection_EndDataX+onPlotXRangeSelection_RightDeltaDataX}
                                    draggingLeftHandler={this.onPlotXRangeSelection_DraggingLeftHandler}
                                    draggingMainHandler={this.onPlotXRangeSelection_DraggingMainHandler}
                                    draggingRightHandler={this.onPlotXRangeSelection_DraggingRightHandler}
                                    draggedLeftHandler={this.onPlotXRangeSelection_DraggedLeftHandler}
                                    draggedMainHandler={this.onPlotXRangeSelection_DraggedMainHandler}
                                    draggedRightHandler={this.onPlotXRangeSelection_DraggedRightHandler}
                                    />
          </DualPhaseXInteractionBoxWithReference>
        </HoverSelectionXInteractionBoxWithReference>
        {/*X Axis*/}
        <div style={{position:"absolute",width:width,height:BOTTOM,left:LEFT,top:height+TOP}}>
          <XAxisDate minX={minX} maxX={maxX} height={BOTTOM} width={width}
                     style={{position:"absolute",left:0,top:0}}
                     />
        </div>
      </div>
    );
  }
  
  hoveringHandler = ({dataX,dataY}) => {
    let {changeHandler} = this.props;
    changeHandler({ hoverX:dataX,
                    hoverY:dataY
                    });
  }
  
  mouseOutHandler = ({dataX,dataY}) => {
    let {changeHandler} = this.props;
    changeHandler({ hoverX:null,
                    hoverY:null
                    });
  }
  
  hoverSelectionHandler = ({selection}) => {
    let {changeHandler} = this.props;
    changeHandler({hoverSelection:selection});
  }
  
  selectingHandler = ({startDataX,endDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({inPlotXRangeSelectionStartDataX:startDataX,
                   inPlotXRangeSelectionEndDataX:endDataX});
  }
  
  selectedHandler = ({startDataX,endDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({minX:Math.min(startDataX,endDataX),
                   maxX:Math.max(startDataX,endDataX),
                   inPlotXRangeSelectionStartDataX:null,
                   inPlotXRangeSelectionEndDataX:null});
  }
  
  panningHandler = ({startDataX,endDataX}) => {
    let deltaDataX = endDataX-startDataX;
    let {changeHandler} = this.props;
    changeHandler({panningDataX:deltaDataX});
  }
  
  pannedHandler = ({startDataX,endDataX}) => {
    let deltaDataX = endDataX-startDataX;
    let {changeHandler} = this.props;
    changeHandler({minX:this.props.minX-deltaDataX,
                   maxX:this.props.maxX-deltaDataX,
                   panningDataX:0
                   });
  }
  
  onPlotXRangeSelection_DraggingLeftHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_LeftDeltaDataX: deltaDataX
                    });
  }
  
  onPlotXRangeSelection_DraggingMainHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_LeftDeltaDataX: deltaDataX,
                    onPlotXRangeSelection_RightDeltaDataX: deltaDataX
                    });
  }
  
  onPlotXRangeSelection_DraggingRightHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_RightDeltaDataX: deltaDataX
                    });
  }
  
  onPlotXRangeSelection_DraggedLeftHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartDataX: this.props.onPlotXRangeSelection_StartDataX+deltaDataX,
                    onPlotXRangeSelection_LeftDeltaDataX: 0
                    });
  }
  
  onPlotXRangeSelection_DraggedMainHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartDataX: this.props.onPlotXRangeSelection_StartDataX+deltaDataX,
                    onPlotXRangeSelection_EndDataX: this.props.onPlotXRangeSelection_EndDataX+deltaDataX,
                    onPlotXRangeSelection_LeftDeltaDataX: 0,
                    onPlotXRangeSelection_RightDeltaDataX: 0
                    });
  }
  
  onPlotXRangeSelection_DraggedRightHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_EndDataX: this.props.onPlotXRangeSelection_EndDataX+deltaDataX,
                    onPlotXRangeSelection_RightDeltaDataX: 0
                    });
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
    selectorMinX: state.plot.selectorMinX || 1000,
    selectorMaxX: state.plot.selectorMaxX || 2000,
    text: state.plot.text,
    hoverX: state.plot.hoverX,
    hoverSelection: state.plot.hoverSelection,
    inPlotXRangeSelectionStartDataX: state.plot.inPlotXRangeSelectionStartDataX || null,
    inPlotXRangeSelectionEndDataX: state.plot.inPlotXRangeSelectionEndDataX || null,
    onPlotXRangeSelection_StartDataX: state.plot.onPlotXRangeSelection_StartDataX || null,
    onPlotXRangeSelection_EndDataX: state.plot.onPlotXRangeSelection_EndDataX || null,
    onPlotXRangeSelection_LeftDeltaDataX: state.plot.onPlotXRangeSelection_LeftDeltaDataX || 0,
    onPlotXRangeSelection_RightDeltaDataX: state.plot.onPlotXRangeSelection_RightDeltaDataX || 0,
    panningDataX: state.plot.panningDataX || 0,
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
