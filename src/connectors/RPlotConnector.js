import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { memoize_one } from "memoize";
import {changeTopLevelPlot} from "../actions/plot-actions";
// Import components
import HoverSelectionAddon from "../components/HoverSelectionAddon";
import XAxisDate from "../components/XAxisDate";
import YAxisPanel from "../components/YAxisPanel";
import VerticalGrid from "../components/VerticalGrid";
import HorizontalSlabGrid from "../components/HorizontalSlabGrid";
import RespiratoryPlot from "../components/RespiratoryPlot";
import LocationPlot from "../components/LocationPlot/LocationPlot";
import LocationPlotHoverLabel from "../components/LocationPlot/LocationPlotHoverLabel";
import LocationPlotYCategoricalPanel from "../components/LocationPlot/LocationPlotYCategoricalPanel";
import ProcedurePlot, {ProcedurePlotAddon} from "../components/ProcedurePlot";
import ProcedurePlotClickSelectionAddon from "../components/ProcedurePlotClickSelectionAddon";
import OnPlotXRangeSelection from "../components/OnPlotXRangeSelection";
import VerticalCrosshair from "../components/VerticalCrosshair";
import HoverInteractionBoxWithReference from "../components/InteractionBox/HoverInteractionBoxWithReference";
import SelectionPoint from "../components/SelectionPoint";
import InPlotXRangeSelection from "../components/InPlotXRangeSelection";
import TriPhaseInteractionBoxWithReference from "../components/InteractionBox/TriPhaseInteractionBoxWithReference";

import "./RespPlotBundle.css";

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

const LEFT_WIDTH=150;
const PLOT_WIDTH=1000;

const TOP_HEIGHT=50;
const PLOT_HEIGHT=200;
const BOTTOM_HEIGHT=50;

class RespPlotBundle extends PureComponent {
  render() {
    let { minX,maxX,
          minY,maxY,
          panningX,
          hoverX, hoverY,
          hoverDomX, hoverDomY,
          hoverTimeStamp,
          clickX, clickY,
          clickDomX, clickDomY,
          clickTimeStamp,
          verticalCrosshair_X,
          dataPoint_hoverSelection,
          inPlotXRangeSelection_StartX,inPlotXRangeSelection_EndX,
          onPlotXRangeSelection_StartX,onPlotXRangeSelection_EndX,
          onPlotXRangeSelection_LeftDeltaX,onPlotXRangeSelection_RightDeltaX,
          procedurePlot_selection,procedurePlot_autoSelection,
          // location
          // procedure
          // respiratory
          // data
          } = this.props;
    let { changeHandler } = this.props;
    
    minX = minX-panningX;
    maxX = maxX-panningX;
    
    return (
      <div style={{position:"relative", width:LEFT_WIDTH+PLOT_WIDTH, height:TOP_HEIGHT+PLOT_HEIGHT+BOTTOM_HEIGHT}}>
        {/*No-render addons*/}
        {/*select plot data points*/}
        <HoverSelectionAddon  data={selectionData}
                              hoverX={hoverX}
                              hoverTimeStamp={hoverTimeStamp}
                              selectHandler={this.dataPoint_selectHandler}
                              />
        {/*select procedure on click*/}
        <ProcedurePlotAddon data={procedures}
                            minX={minX} maxX={maxX} width={PLOT_WIDTH} height={PLOT_HEIGHT}
                            clickDomX={clickDomX} clickDomY={clickDomY} clickTimeStamp={clickTimeStamp}
                            hoverX={hoverX} hoverTimeStamp={hoverTimeStamp}
                            selectHandler={this.procedurePlot_selectHandler}
                            autoSelectHandler={this.procedurePlot_autoSelectHandler}
                            />
        {/*End No-render addons*/}
        {/*Location plot*/}
        <div style={{position:"absolute",width:LEFT_WIDTH,height:TOP_HEIGHT}}>
          <LocationPlotYCategoricalPanel  className="RespPlotBundle-contained"
                                          width={LEFT_WIDTH} height={TOP_HEIGHT}
                                          />
        </div>
        <div style={{position:"absolute",width:PLOT_WIDTH,height:TOP_HEIGHT,left:LEFT_WIDTH}}>
          <VerticalGrid className="RespPlotBundle-contained"
                        grid={[{x:2000},{x:8000},{x:16000}]}
                        minX={minX} maxX={maxX} width={PLOT_WIDTH}
                        />
          <div style={{position:"absolute",width:PLOT_WIDTH,height:TOP_HEIGHT/2,top:TOP_HEIGHT/4,backgroundColor:"#fff5e9"}}>
            <LocationPlot className="RespPlotBundle-contained"
                          minX={minX} maxX={maxX} width={PLOT_WIDTH}
                          data={location}
                          />
            <LocationPlotHoverLabel className="RespPlotBundle-contained"
                                    minX={minX} maxX={maxX} width={PLOT_WIDTH}
                                    data={location} hoverX={hoverX}/>
          </div>
          <VerticalCrosshair className="RespPlotBundle-contained"
                             hoverX={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={PLOT_WIDTH}
                             />
          <InPlotXRangeSelection  className="RespPlotBundle-contained"
                                  startX={inPlotXRangeSelection_StartX} endX={inPlotXRangeSelection_EndX}
                                  minX={minX} maxX={maxX} width={PLOT_WIDTH}/>
          <HoverInteractionBoxWithReference className="RespPlotBundle-contained"
                                            minX={minX} maxX={maxX} width={PLOT_WIDTH}
                                            minY={1} maxY={0} height={TOP_HEIGHT}
                                            hoveringHandler={this.plot_hoveringHandler} mouseOutHandler={this.plot_mouseOutHandler}
                                            >
            <TriPhaseInteractionBoxWithReference  className="RespPlotBundle-contained"
                                                  minX={minX} maxX={maxX} width={PLOT_WIDTH}
                                                  minY={1} maxY={0} height={TOP_HEIGHT}
                                                  doubleClickHandler={console.log}
                                                  selectingHandler={this.plot_selectingHandler} selectedHandler={this.plot_selectedHandler}
                                                  panningHandler={this.plot_panningHandler} pannedHandler={this.plot_pannedHandler}
                                                  >
              <OnPlotXRangeSelection  className="RespPlotBundle-contained"
                                      minX={minX} maxX={maxX} height={TOP_HEIGHT} width={PLOT_WIDTH}
                                      startX={onPlotXRangeSelection_StartX+onPlotXRangeSelection_LeftDeltaX}
                                      endX={onPlotXRangeSelection_EndX+onPlotXRangeSelection_RightDeltaX}
                                      leftHandle={true} rightHandle={true} topHandle={true}
                                      draggingLeftHandler={this.onPlotXRangeSelection_DraggingLeftHandler}
                                      draggingMainHandler={this.onPlotXRangeSelection_DraggingMainHandler}
                                      draggingRightHandler={this.onPlotXRangeSelection_DraggingRightHandler}
                                      draggedLeftHandler={this.onPlotXRangeSelection_DraggedLeftHandler}
                                      draggedMainHandler={this.onPlotXRangeSelection_DraggedMainHandler}
                                      draggedRightHandler={this.onPlotXRangeSelection_DraggedRightHandler}
                                      />
            </TriPhaseInteractionBoxWithReference>
          </HoverInteractionBoxWithReference>
        </div>
        {/*End Location plot*/}
        {/*Y Axis*/}
        <div style={{position:"absolute",width:LEFT_WIDTH,height:PLOT_HEIGHT,top:TOP_HEIGHT}}>
          <YAxisPanel className="RespPlotBundle-contained"
                      category={[ {start:80,end:100,bgStyle:{fillStyle:"red"},name:"ECMO",textStyle:{fillStyle:"black",font:"bold 16px Sans",textAlign:"left",textBaseline:"middle"},textPosition:3},
                                  {start:40,end:80,bgStyle:{fillStyle:"yellow"},name:"Other",textStyle:{fillStyle:"black",font:"bold 16px Sans",textAlign:"left",textBaseline:"middle"},textPosition:3}
                                  ]}
                      minY={minY} maxY={maxY} width={LEFT_WIDTH} height={PLOT_HEIGHT}
                      />
          <TriPhaseInteractionBoxWithReference  className="RespPlotBundle-contained"
                                                minX={minX} maxX={maxX} width={PLOT_WIDTH}
                                                minY={minY} maxY={maxY} height={PLOT_HEIGHT}
                                                doubleClickHandler={this.plot_doubleClickHandler}
                                                selectingHandler={this.plot_selectingHandler} selectedHandler={this.plot_selectedHandler}
                                                panningHandler={this.plot_panningHandler} pannedHandler={this.plot_pannedHandler}
                                                >
          </TriPhaseInteractionBoxWithReference>
        </div>
        {/*Respiratory plot area*/}
        <div style={{position:"absolute",width:PLOT_WIDTH,height:PLOT_HEIGHT,left:LEFT_WIDTH,top:TOP_HEIGHT,overflow:"hidden"}}>
          <HorizontalSlabGrid className="RespPlotBundle-contained"
                              grid={[ {start:1000,end:800,color:"yellow"},
                                      {start:800,end:600,color:"white"},
                                      {start:600,end:300,color:"yellow"},
                                      {start:300,end:0,color:"white"}]}
                              minY={minY} maxY={maxY} height={PLOT_HEIGHT}
                              />
          <VerticalGrid className="RespPlotBundle-contained"
                        grid={[{x:2000},{x:8000},{x:16000}]}
                        minX={minX} maxX={maxX} width={PLOT_WIDTH}
                        />
          <RespiratoryPlot  className="RespPlotBundle-contained"
                            x={plot1x} ys={plot1ys}
                            minX={minX} maxX={maxX} width={PLOT_WIDTH}
                            minY={minY} maxY={maxY} height={PLOT_HEIGHT}
                            />
          <ProcedurePlot  className="RespPlotBundle-contained"
                          data = {procedures}
                          selection={procedurePlot_selection || procedurePlot_autoSelection}
                          hoverX={hoverX}
                          minX={minX} maxX={maxX} width={PLOT_WIDTH} height={PLOT_HEIGHT}
                          />
          <SelectionPoint className="RespPlotBundle-contained"
                          selection={dataPoint_hoverSelection}
                          minX={minX} maxX={maxX} width={PLOT_WIDTH}
                          minY={minY} maxY={maxY} height={PLOT_HEIGHT} 
                          />
          <VerticalCrosshair className="RespPlotBundle-contained"
                             hoverX={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={PLOT_WIDTH}
                             />
          <InPlotXRangeSelection  className="RespPlotBundle-contained"
                                  startX={inPlotXRangeSelection_StartX} endX={inPlotXRangeSelection_EndX}
                                  minX={minX} maxX={maxX} width={PLOT_WIDTH}/>
          <HoverInteractionBoxWithReference className="RespPlotBundle-contained"
                                                    minX={minX} maxX={maxX} width={PLOT_WIDTH}
                                                    minY={minY} maxY={maxY} height={PLOT_HEIGHT}
                                                    hoveringHandler={this.plot_hoveringHandler} mouseOutHandler={this.plot_mouseOutHandler}
                                                    >
            <TriPhaseInteractionBoxWithReference  className="RespPlotBundle-contained"
                                                  minX={minX} maxX={maxX} width={PLOT_WIDTH}
                                                  minY={minY} maxY={maxY} height={PLOT_HEIGHT}
                                                  clickedHandler={this.plot_clickedHandler}
                                                  doubleClickHandler={this.plot_doubleClickHandler}
                                                  selectingHandler={this.plot_selectingHandler} selectedHandler={this.plot_selectedHandler}
                                                  panningHandler={this.plot_panningHandler} pannedHandler={this.plot_pannedHandler}
                                                  >
              <OnPlotXRangeSelection  className="RespPlotBundle-contained"
                                      minX={minX} maxX={maxX} height={PLOT_HEIGHT} width={PLOT_WIDTH}
                                      startX={onPlotXRangeSelection_StartX+onPlotXRangeSelection_LeftDeltaX}
                                      endX={onPlotXRangeSelection_EndX+onPlotXRangeSelection_RightDeltaX}
                                      leftHandle={true} rightHandle={true} topHandle={false}
                                      draggingLeftHandler={this.onPlotXRangeSelection_DraggingLeftHandler}
                                      draggingMainHandler={this.onPlotXRangeSelection_DraggingMainHandler}
                                      draggingRightHandler={this.onPlotXRangeSelection_DraggingRightHandler}
                                      draggedLeftHandler={this.onPlotXRangeSelection_DraggedLeftHandler}
                                      draggedMainHandler={this.onPlotXRangeSelection_DraggedMainHandler}
                                      draggedRightHandler={this.onPlotXRangeSelection_DraggedRightHandler}
                                      />
            </TriPhaseInteractionBoxWithReference>
          </HoverInteractionBoxWithReference>
        </div>
        {/*End Respiratory plot area*/}
        {/*X Axis*/}
        <div style={{position:"absolute",width:PLOT_WIDTH,height:BOTTOM_HEIGHT,left:LEFT_WIDTH,top:PLOT_HEIGHT+TOP_HEIGHT}}>
          <XAxisDate minX={minX} maxX={maxX} height={BOTTOM_HEIGHT} width={PLOT_WIDTH}
                     style={{position:"absolute",left:0,top:0}}
                     />
          <HoverInteractionBoxWithReference className="RespPlotBundle-contained"
                                                    minX={minX} maxX={maxX} width={PLOT_WIDTH}
                                                    minY={minY} maxY={maxY} height={PLOT_HEIGHT}
                                                    hoveringHandler={this.plot_hoveringHandler} mouseOutHandler={this.plot_mouseOutHandler}
                                                    >
            <TriPhaseInteractionBoxWithReference  className="RespPlotBundle-contained"
                                                  minX={minX} maxX={maxX} width={PLOT_WIDTH}
                                                  minY={minY} maxY={maxY} height={PLOT_HEIGHT}
                                                  doubleClickHandler={this.plot_doubleClickHandler}
                                                  selectingHandler={this.plot_selectingHandler} selectedHandler={this.plot_selectedHandler}
                                                  panningHandler={this.plot_panningHandler} pannedHandler={this.plot_pannedHandler}
                                                  >
            </TriPhaseInteractionBoxWithReference>
          </HoverInteractionBoxWithReference>
        </div>
        {/*End X Axis*/}
      </div>
    );
  }
  
  plot_clickedHandler = ({dataX,dataY,domX,domY,timestamp}) => {
    let {changeHandler} = this.props;
    changeHandler({ clickX:dataX,
                    clickY:dataY,
                    clickDomX:domX,
                    clickDomY:domY,
                    clickTimeStamp:timestamp
                    });
  }
  
  plot_doubleClickHandler = ({dataX,dataY,domX,domY,timestamp}) => {
    let {changeHandler} = this.props;
    changeHandler({ doubleClickDataX:dataX,
                    doubleClickDataY:dataY,
                    doubleClickDomX:domX,
                    doubleClickDomY:domY,
                    doubleClickStamp:timestamp,
                    minX:0,
                    maxX:180000
                    });
  }

  plot_hoveringHandler = ({dataX,dataY,domX,domY,timestamp}) => {
    let {changeHandler} = this.props;
    changeHandler({ hoverX:dataX,
                    hoverY:dataY,
                    hoverDomX:domX,
                    hoverDomY:domY,
                    verticalCrosshair_X:dataX,
                    hoverTimeStamp:timestamp
                    });
  }
  
  plot_mouseOutHandler = () => {
    let {changeHandler} = this.props;
    changeHandler({ hoverX:null,
                    hoverY:null,
                    hoverDomX:null,
                    hoverDomY:null,
                    verticalCrosshair_X:null
                    });
  }
  
  plot_selectingHandler = ({startDataX,endDataX,startDomX,endDomX,startDomY,endDomY}) => {
    let {changeHandler} = this.props;
    if (Math.abs(endDomY-startDomY) > Math.abs(endDomX-startDomX)) {
      changeHandler({ inPlotXRangeSelection_StartX:null,
                      inPlotXRangeSelection_EndX:null
                      });
    }
    else {
      changeHandler({inPlotXRangeSelection_StartX:startDataX,
                     inPlotXRangeSelection_EndX:endDataX
                     });
    }
  }
  
  plot_selectedHandler = ({startDataX,endDataX,startDomX,endDomX,startDomY,endDomY}) => {
    let {changeHandler} = this.props;
    if (Math.abs(endDomY-startDomY) > Math.abs(endDomX-startDomX)) {
        changeHandler({inPlotXRangeSelection_StartX: null,
                       inPlotXRangeSelection_EndX: null});
    }
    else {
      changeHandler({minX: Math.min(startDataX,endDataX),
                     maxX: Math.max(startDataX,endDataX),
                     inPlotXRangeSelection_StartX: null,
                     inPlotXRangeSelection_EndX: null});
    }
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
  
  procedurePlot_selectHandler =({selection}) => {
    let {changeHandler} = this.props;
    changeHandler({procedurePlot_selection:selection});
  }
  
  procedurePlot_autoSelectHandler =({selection}) => {
    let {changeHandler} = this.props;
    changeHandler({procedurePlot_autoSelection:selection});
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
    hoverDomY: state.plot.hoverDomY || null,
    hoverTimeStamp: state.plot.hoverTimeStamp || null,
    clickX: state.plot.clickX || null,
    clickY: state.plot.clickY || null,
    clickDomX: state.plot.clickDomX || null,
    clickDomY: state.plot.clickDomY || null,
    clickTimeStamp: state.plot.clickTimeStamp || null,
    doubleClickX: state.plot.doubleClickX || null,
    doubleClickY: state.plot.doubleClickY || null,
    doubleClickDomX: state.plot.doubleClickDomX || null,
    doubleClickDomY: state.plot.doubleClickDomY || null,
    doubleClickTimeStamp: state.plot.doubleClickTimeStamp || null,
    verticalCrosshair_X: state.plot.verticalCrosshair_X || null,
    dataPoint_hoverSelection: state.plot.dataPoint_hoverSelection || null,
    inPlotXRangeSelection_StartX: state.plot.inPlotXRangeSelection_StartX || null,
    inPlotXRangeSelection_EndX: state.plot.inPlotXRangeSelection_EndX || null,
    onPlotXRangeSelection_StartX: state.plot.onPlotXRangeSelection_StartX || 0,
    onPlotXRangeSelection_EndX: state.plot.onPlotXRangeSelection_EndX || 2000,
    onPlotXRangeSelection_LeftDeltaX: state.plot.onPlotXRangeSelection_LeftDeltaX || 0,
    onPlotXRangeSelection_RightDeltaX: state.plot.onPlotXRangeSelection_RightDeltaX || 0,
    procedurePlot_selection: state.plot.procedurePlot_selection || null,
    procedurePlot_autoSelection: state.plot.procedurePlot_autoSelection || null,
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

