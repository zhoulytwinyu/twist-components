import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {changeTopLevelPlot} from "../actions/plot-actions";
// Import components
import HoverSelectionAddon from "../components/HoverSelectionAddon";
import XAxisDate from "../components/XAxisDate";
import YAxisPanel from "../components/YAxisPanel";
import VerticalGrid from "../components/VerticalGrid";
import HorizontalSlabGrid from "../components/HorizontalSlabGrid";
import RespiratoryPlot from "../components/RespiratoryPlot";
import LocationPlot from "../components/LocationPlot";
import ProcedurePlot from "../components/ProcedurePlot";
import ProcedurePlotClickSelectionAddon from "../components/ProcedurePlotClickSelectionAddon";
import OnPlotXRangeSelection from "../components/OnPlotXRangeSelection";
import VerticalCrosshair from "../components/VerticalCrosshair";
import HoverInteractionBoxWithReference from "../components/InteractionBox/HoverInteractionBoxWithReference";
import SelectionPoint from "../components/SelectionPoint";
import InPlotXRangeSelection from "../components/InPlotXRangeSelection";
import TriPhaseXInteractionBoxWithReference from "../components/InteractionBox/TriPhaseXInteractionBoxWithReference";


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

class RespPlotBundle extends PureComponent {
  render() {
    let { minX,maxX,
          minY,maxY,
          panningX,
          hoverX, hoverY,
          hoverDomX, hoverDomY,
          clickX, clickY,
          clickDomX, clickDomY,
          verticalCrosshair_X,
          dataPoint_hoverSelection,
          inPlotXRangeSelection_StartX,inPlotXRangeSelection_EndX,
          onPlotXRangeSelection_StartX,onPlotXRangeSelection_EndX,
          onPlotXRangeSelection_LeftDeltaX,onPlotXRangeSelection_RightDeltaX,
          procedurePlotClickSelectionAddon_clickSelection,
          height,width
          } = this.props;
    let { changeHandler } = this.props;
    let {LEFT,RIGHT,TOP,BOTTOM} = this;
    minX = minX-panningX;
    maxX = maxX-panningX;
    
    return (
      <div style={{position:"relative", width:LEFT+RIGHT+width, height:TOP+BOTTOM+height}}>
        {/*No-Render Addons*/}
        {/*select plot data points*/}
        <HoverSelectionAddon  data={selectionData}
                              hoverX={hoverX}
                              selectHandler={this.dataPoint_selectHandler}
                              />
        {/*select last major procedure*/}
        <HoverSelectionAddon  data={selectionData}
                              hoverX={hoverX}
                              mode="left"
                              selectHandler={this.lastMajorProcedure_selectHandler}
                              />
        {/*select procedure on click*/}
        <ProcedurePlotClickSelectionAddon data={procedures}
                                          clickDomX={clickDomX} clickDomY={clickDomY}
                                          selectHandler={this.procedurePlotClickSelectionAddon_selectHandler}
                                          />
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
                          selection={dataPoint_hoverSelection}
                          minX={minX} maxX={maxX} width={width}
                          minY={minY} maxY={maxY} height={height} 
                          />
          <VerticalCrosshair style={{position:"absolute",width:width,height:height}}
                             hoverX={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={width}
                             />
          <InPlotXRangeSelection  style={{position:"absolute",width:width,height:height}}
                                  startDataX={inPlotXRangeSelection_StartX} endDataX={inPlotXRangeSelection_EndX}
                                  minX={minX} maxX={maxX} width={width}/>
        </div>
        <HoverInteractionBoxWithReference style={{position:"absolute",width:width,height:height,left:LEFT,top:TOP}}
                                                  minX={minX} maxX={maxX} width={width}
                                                  minY={minY} maxY={maxY} height={height}
                                                  hoveringHandler={this.plot_hoveringHandler} mouseOutHandler={this.plot_mouseOutHandler}
                                                  >
          <TriPhaseXInteractionBoxWithReference style={{position:"absolute",width:width,height:height}}
                                                  minX={minX} maxX={maxX} width={width}
                                                  minY={minY} maxY={maxY} height={height}
                                                  clickedHandler={this.plot_clickedHandler}
                                                  doubleClickHandler={this.plot_doubleClickHandler}
                                                  selectingHandler={this.plot_selectingHandler} selectedHandler={this.plot_selectedHandler}
                                                  panningHandler={this.plot_panningHandler} pannedHandler={this.plot_pannedHandler}
                                                  >
            <OnPlotXRangeSelection  style={{position:"absolute",width:width,height:height}}
                                    minX={minX} maxX={maxX} height={height} width={width}
                                    startX={onPlotXRangeSelection_StartX+onPlotXRangeSelection_LeftDeltaX}
                                    endX={onPlotXRangeSelection_EndX+onPlotXRangeSelection_RightDeltaX}
                                    draggingLeftHandler={this.onPlotXRangeSelection_DraggingLeftHandler}
                                    draggingMainHandler={this.onPlotXRangeSelection_DraggingMainHandler}
                                    draggingRightHandler={this.onPlotXRangeSelection_DraggingRightHandler}
                                    draggedLeftHandler={this.onPlotXRangeSelection_DraggedLeftHandler}
                                    draggedMainHandler={this.onPlotXRangeSelection_DraggedMainHandler}
                                    draggedRightHandler={this.onPlotXRangeSelection_DraggedRightHandler}
                                    />
          </TriPhaseXInteractionBoxWithReference>
        </HoverInteractionBoxWithReference>
        {/*X Axis*/}
        <div style={{position:"absolute",width:width,height:BOTTOM,left:LEFT,top:height+TOP}}>
          <XAxisDate minX={minX} maxX={maxX} height={BOTTOM} width={width}
                     style={{position:"absolute",left:0,top:0}}
                     />
        </div>
      </div>
    );
  }
  
  plot_clickedHandler = ({dataX,dataY,domX,domY}) => {
    let {changeHandler} = this.props;
    changeHandler({ clickX:dataX,
                    clickY:dataY,
                    clickDomX:domX,
                    clickDomY:domY
                    });
  }
  
  plot_doubleClickHandler = ({dataX,dataY,domX,domY}) => {
    let {changeHandler} = this.props;
    changeHandler({ doubleClickDataX:dataX,
                    doubleClickDataY:dataY,
                    doubleClickDomX:domX,
                    doubleClickDomY:domY
                    });
  }

  plot_hoveringHandler = ({dataX,dataY,domX,domY}) => {
    let {changeHandler} = this.props;
    changeHandler({ hoverX:dataX,
                    hoverY:dataY,
                    hoverDomX:domX,
                    hoverDomY:domY,
                    verticalCrosshair_X:dataX
                    });
  }
  
  plot_mouseOutHandler = () => {
    let {changeHandler} = this.props;
    changeHandler({ hoverX:null,
                    hoverY:null,
                    hoverDomX:null,
                    hoverDomY:null
                    });
  }
  
  plot_selectingHandler = ({startDataX,endDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({inPlotXRangeSelection_StartX:startDataX,
                   inPlotXRangeSelection_EndX:endDataX});
  }
  
  plot_selectedHandler = ({startDataX,endDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({minX: Math.min(startDataX,endDataX),
                   maxX: Math.max(startDataX,endDataX),
                   inPlotXRangeSelection_StartX: null,
                   inPlotXRangeSelection_EndX: null});
  }
  
  plot_panningHandler = ({startDataX,endDataX}) => {
    let deltaDataX = endDataX-startDataX;
    let {changeHandler} = this.props;
    changeHandler({panningX:deltaDataX});
  }
  
  plot_pannedHandler = ({startDataX,endDataX}) => {
    let deltaDataX = endDataX-startDataX;
    let {changeHandler} = this.props;
    changeHandler({minX:this.props.minX-deltaDataX,
                   maxX:this.props.maxX-deltaDataX,
                   panningX:0
                   });
  }
  
  dataPoint_selectHandler = ({selection}) => {
    let {changeHandler} = this.props;
    changeHandler({dataPoint_hoverSelection:selection});
  }
  
  lastMajorProcedure_selectHandler = ({selection}) => {
    let {changeHandler} = this.props;
    changeHandler({procedurePlot_Selection:selection});
  }
  
  procedurePlotClickSelectionAddon_selectHandler =({selection}) => {
    let {changeHandler} = this.props;
    changeHandler({procedurePlot_Selection:selection});
  }
  
  onPlotXRangeSelection_DraggingLeftHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_LeftDeltaX: deltaDataX
                    });
  }
  
  onPlotXRangeSelection_DraggingMainHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_LeftDeltaX: deltaDataX,
                    onPlotXRangeSelection_RightDeltaX: deltaDataX
                    });
  }
  
  onPlotXRangeSelection_DraggingRightHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_RightDeltaX: deltaDataX
                    });
  }
  
  onPlotXRangeSelection_DraggedLeftHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartX: this.props.onPlotXRangeSelection_StartX+deltaDataX,
                    onPlotXRangeSelection_LeftDeltaX: 0
                    });
  }
  
  onPlotXRangeSelection_DraggedMainHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartX: this.props.onPlotXRangeSelection_StartX+deltaDataX,
                    onPlotXRangeSelection_EndX: this.props.onPlotXRangeSelection_EndX+deltaDataX,
                    onPlotXRangeSelection_LeftDeltaX: 0,
                    onPlotXRangeSelection_RightDeltaX: 0
                    });
  }
  
  onPlotXRangeSelection_DraggedRightHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_EndX: this.props.onPlotXRangeSelection_EndX+deltaDataX,
                    onPlotXRangeSelection_RightDeltaX: 0
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
    panningX: state.plot.panningX || 0,
    hoverX: state.plot.hoverX || null,
    hoverY: state.plot.hoverY || null,
    hoverDomX: state.plot.hoverDomX || null,
    hoverDomY: state.plot.hoverDomX || null,
    clickX: state.plot.clickX || null,
    clickY: state.plot.clickY || null,
    clickDomX: state.plot.clickDomX || null,
    clickDomY: state.plot.clickDomX || null,
    doubleClickX: state.plot.doubleClickX || null,
    doubleClickY: state.plot.doubleClickY || null,
    doubleClickDomX: state.plot.doubleClickDomX || null,
    doubleClickDomY: state.plot.doubleClickDomY || null,
    verticalCrosshair_X: state.plot.verticalCrosshair_X || null,
    dataPoint_hoverSelection: state.plot.dataPoint_hoverSelection || null,
    inPlotXRangeSelection_StartX: state.plot.inPlotXRangeSelection_StartX || null,
    inPlotXRangeSelection_EndX: state.plot.inPlotXRangeSelection_EndX || null,
    onPlotXRangeSelection_StartX: state.plot.onPlotXRangeSelection_StartX || 0,
    onPlotXRangeSelection_EndX: state.plot.onPlotXRangeSelection_EndX || 2000,
    onPlotXRangeSelection_LeftDeltaX: state.plot.onPlotXRangeSelection_LeftDeltaX || 0,
    onPlotXRangeSelection_RightDeltaX: state.plot.onPlotXRangeSelection_RightDeltaX || 0,
    procedurePlotClickSelectionAddon_clickSelection: state.plot.onPlotXRangeSelection_RightDeltaX || null,
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

