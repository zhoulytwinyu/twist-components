import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { changeTopLevelPlot } from "../actions/plot-actions";
// Import components
import RespiratoryScoresPlotLimitsPanel from "../components/RespiratoryScoresPlot/RespiratoryScoresPlotLimitsPanel";
import RespiratoryScoresPlotHorizontalSlabGrid from "../components/RespiratoryScoresPlot/RespiratoryScoresPlotHorizontalSlabGrid";
import RespiratoryScoresPlot from "../components/RespiratoryScoresPlot/RespiratoryScoresPlot";
//
import LocationsPlot from "../components/LocationsPlot/LocationsPlot";
import LocationsPlotYAxisTwoLevelPanel from "../components/LocationsPlot/LocationsPlotYAxisTwoLevelPanel";
import LocationsPlotSelectionLabel from "../components/LocationsPlot/LocationsPlotSelectionLabel";
import LocationsPlotHoverSelector from "../components/LocationsPlot/LocationsPlotHoverSelector";
//
import ProceduresPlot from "../components/ProceduresPlot/ProceduresPlot";
import ProceduresPlotClickSelector from "../components/ProceduresPlot/ProceduresPlotClickSelector";
import ProceduresPlotHoverSelector from "../components/ProceduresPlot/ProceduresPlotHoverSelector";
import ProceduresPlotTimeDiff from "../components/ProceduresPlot/ProceduresPlotTimeDiff";
//
import PlotInteractionBoxProvider from "../components/Interaction/PlotInteractionBoxProvider";
//
import DynamicDateYAxisTwoLevelPanel from "../components/DateXAxis/DynamicDateYAxisTwoLevelPanel";
import DateXAxis from "../components/DateXAxis/DateXAxis";
import DateVerticalGridLines from "../components/DateXAxis/DateVerticalGridLines";
//import SelectionPoint from "../components/SelectionPoint";
import InPlotXRangeSelection from "../components/InPlotXRangeSelection/InPlotXRangeSelection";
import InPlotXRangeSelector from "../components/InPlotXRangeSelection/InPlotXRangeSelector";
import OnPlotXRangeSelection from "../components/OnPlotXRangeSelection/OnPlotXRangeSelection";
//
import VerticalCrosshair from "../components/VerticalCrosshair/VerticalCrosshair";
import VerticalCrosshairSelector from "../components/VerticalCrosshair/VerticalCrosshairSelector";
//
import Relay from "../components/UtilityComponents/Relay";
import GradientOverlay from "../components/UtilityComponents/GradientOverlay";
// CSS
import "./plot.css";

// Fake data
import respiratoryScore from "./test-data/respiratoryScore";
import iNO from "./test-data/iNO";
import anesthetics from "./test-data/anesthetics";
import respiratoryScoreLimits from "./test-data/respiratoryScoreLimits";
import location from "./test-data/location";
import procedure from "./test-data/procedure";
import {plot1x,plot1ys} from "./test-data/plot1";

let selectionData = [];
for (let i=0; i<plot1x.length; i++) {
  selectionData.push({x:plot1x[i],ys:[plot1ys[0][i],plot1ys[1][i]] });
}

let yLimitCategoryPosition = [{name:".danger",start:80,end:100},{name:".asd",start:40,end:80}];
let yLimitPosition = [{name:"ECMO",start:80,end:100},{name:"Haha",start:0,end:80}];
let yLimitCategoryColors = ["yellow","orange","cyan"];
let yLimitColors = ["red","blue"];

const YAXIS_WIDTH=150;
const X1AXIS_HEIGHT=50;
const XAXIS_HEIGHT=30;

class RespPlotBundle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {hoverDomX:null,
                  locationSelection:null,
                  procedureSelection:null,
                  procedureHoverSelection:null,
                  dataPointSelection:null,
                  inPlotXRangeSelectionStartX:null,
                  inPlotXRangeSelectionEndX:null,
                  };
    this.setState = this.setState.bind(this);
  }
  render() {
    let { minX,maxX,
          minY,maxY,
          panningX,
          clickX, clickY,
          clickDomX, clickDomY,
          clickTimeStamp,
          verticalCrosshair_X,
          inPlotXRangeSelection_StartX,inPlotXRangeSelection_EndX,
          onPlotXRangeSelection_StartX,onPlotXRangeSelection_EndX,
          onPlotXRangeSelection_LeftDeltaX,onPlotXRangeSelection_RightDeltaX,
          procedurePlot_selection,procedurePlot_autoSelection,
          width,height,
          // location
          // procedure
          // respiratory
          // data
          } = this.props;
    
    let { hoverDomX,
          locationSelection,
          procedureSelection,
          procedureHoverSelection,
          inPlotXRangeSelectionStartX,
          inPlotXRangeSelectionEndX,
          } = this.state;
    minX = minX-panningX;
    maxX = maxX-panningX;
    
    let plotWidth = width-YAXIS_WIDTH;
    let plotHeight = height-XAXIS_HEIGHT-X1AXIS_HEIGHT;
    
    return (
      <div style={{position:"relative", width:width, height:height}}>
        {/*  Location Plot  */}
        {/*Row 0 Col 0: Location Plot Y Axis*/}
        <div style={{position:"absolute",width:YAXIS_WIDTH,height:X1AXIS_HEIGHT}}>
          <LocationsPlotYAxisTwoLevelPanel className="fillParent"
                                          width={YAXIS_WIDTH} height={X1AXIS_HEIGHT}/>
        </div>
        {/*Row 0 Col 1: Location Plot*/}
        <div style={{position:"absolute",width:plotWidth,height:X1AXIS_HEIGHT,left:YAXIS_WIDTH,backgroundColor:"#fff5e9"}}>
          <div style={{position:"absolute",width:plotWidth,height:X1AXIS_HEIGHT/2,top:X1AXIS_HEIGHT/4}}>
            <LocationsPlot  className="fillParent"
                            data={location}
                            minX={minX} maxX={maxX} width={plotWidth}
                            />
            <LocationsPlotSelectionLabel  className="fillParent"
                                          selection={locationSelection}
                                          minX={minX} maxX={maxX} width={plotWidth}
                                          />
          </div>
          <VerticalCrosshair className="fillParent"
                             X={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={plotWidth}
                             />
          <InPlotXRangeSelection  className="fillParent"
                                  startX={inPlotXRangeSelection_StartX} endX={inPlotXRangeSelection_EndX}
                                  minX={minX} maxX={maxX} width={plotWidth}/>
        </div>
        {/*  End Location Plot  */}
        {/*Row 1 Col 0: Respiratory Plot Y Axis*/}
        <div style={{position:"absolute",width:YAXIS_WIDTH,height:plotHeight,top:X1AXIS_HEIGHT}}>
          <RespiratoryScoresPlotLimitsPanel className="fillParent"
                                        minY={minY} maxY={maxY} width={YAXIS_WIDTH} height={plotHeight}
                                        />
        </div>
        {/*Row 1 Col 1: Respiratory Plot*/}
        <div style={{position:"absolute",width:plotWidth,height:plotHeight,left:YAXIS_WIDTH,top:X1AXIS_HEIGHT,overflow:"hidden"}}>
          <RespiratoryScoresPlotHorizontalSlabGrid  className="fillParent"
                                                    minY={minY} maxY={maxY} height={plotHeight}
                                                    />
          <DateVerticalGridLines  className="fillParent"
                                  minX={minX} maxX={maxX} width={plotWidth}
                                  />
          <RespiratoryScoresPlot  className="fillParent"
                                  respiratoryScores={respiratoryScore} iNO={iNO} anesthetics={anesthetics}
                                  minX={minX} maxX={maxX} width={plotWidth}
                                  minY={minY} maxY={maxY} height={plotHeight}
                                  />
          <ProceduresPlot className="fillParent"
                          data = {procedure} selection={procedureSelection || procedureHoverSelection}
                          minX={minX} maxX={maxX} width={plotWidth} height={plotHeight}
                          />
          <ProceduresPlotTimeDiff data = {procedure}
                                  selection={procedureSelection || procedureHoverSelection}
                                  hoverDomX={hoverDomX}
                                  minX={minX} maxX={maxX} width={plotWidth} height={plotHeight}
                                  />
          <VerticalCrosshair className="fillParent"
                             X={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={plotWidth}
                             />
          <InPlotXRangeSelection  className="fillParent"
                                  startX={inPlotXRangeSelectionStartX} endX={inPlotXRangeSelectionEndX}
                                  minX={minX} maxX={maxX} width={plotWidth}/>
          {/* Main plot area interaction */}
          <PlotInteractionBoxProvider className="fillParent"
                                      render={({hoveringPosition,
                                                clickPosition,doubleClickPosition,
                                                selectingPositionStart,selectingPositionEnd,
                                                selectedPositionStart,selectedPositionEnd,
                                                panningPositionStart,panningPositionEnd,
                                                pannedPositionStart,pannedPositionEnd})=>
            <>
              <OnPlotXRangeSelection  className="fillParent"
                                      minX={minX} maxX={maxX} height={plotHeight} width={plotWidth}
                                      startX={onPlotXRangeSelection_StartX+onPlotXRangeSelection_LeftDeltaX}
                                      endX={onPlotXRangeSelection_EndX+onPlotXRangeSelection_RightDeltaX}
                                      topHandle={true}
                                      draggingLeftHandler={this.onPlotXRangeSelection_DraggingLeftHandler}
                                      draggingMainHandler={this.onPlotXRangeSelection_DraggingMainHandler}
                                      draggingRightHandler={this.onPlotXRangeSelection_DraggingRightHandler}
                                      draggedLeftHandler={this.onPlotXRangeSelection_DraggedLeftHandler}
                                      draggedMainHandler={this.onPlotXRangeSelection_DraggedMainHandler}
                                      draggedRightHandler={this.onPlotXRangeSelection_DraggedRightHandler}
                                      />
              <Relay  hoveringPosition={hoveringPosition}
                      updateHandler={this.updateHoverDomX}
                      />
              <InPlotXRangeSelector selectingPositionStart={selectingPositionStart}
                                    selectingPositionEnd={selectingPositionEnd}
                                    minX={minX} maxX={maxX} width={plotWidth}
                                    selectHandler={this.handleInPlotXRangeSelection}
                                    />
              <LocationsPlotHoverSelector data={location}
                                          hoveringPosition={hoveringPosition}
                                          minX={minX} maxX={maxX} width={plotWidth}
                                          selectHandler={this.handleSelectLocation}
                                          />
              <ProceduresPlotClickSelector  data = {procedure}
                                            selection = {procedureSelection}
                                            minX={minX} maxX={maxX}
                                            width={plotWidth} height={plotHeight}
                                            clickPosition={clickPosition}
                                            selectHandler={this.handleClickSelectProcedure}
                                            />
              <ProceduresPlotHoverSelector  data={procedure}
                                            minX={minX} maxX={maxX}
                                            width={plotWidth} height={plotHeight}
                                            hoveringPosition={hoveringPosition}
                                            selectHandler={this.handleHoverSelectProcedure}
                                            />
            </>
          }/>
        </div>
        {/*  End Respiratory Plot  */}
        {/*  X Axis  */}
        <div style={{position:"absolute",width:YAXIS_WIDTH,height:XAXIS_HEIGHT,left:0,top:plotHeight+X1AXIS_HEIGHT}}>
          <DynamicDateYAxisTwoLevelPanel  className="fillParent"
                                          minX={minX} maxX={maxX}
                                          width={YAXIS_WIDTH} height={XAXIS_HEIGHT}
                                          />
        </div>
        <div style={{position:"absolute",width:plotWidth,height:XAXIS_HEIGHT,left:YAXIS_WIDTH,top:plotHeight+X1AXIS_HEIGHT}}>
          <DateXAxis  className="fillParent"
                      minX={minX} maxX={maxX}
                      height={XAXIS_HEIGHT} width={plotWidth}
                      />
        </div>
        {/*  End X Axis  */}
        {/* Other decorations */}
        <GradientOverlay  style={{position:"absolute",width:10,height:plotHeight+XAXIS_HEIGHT+X1AXIS_HEIGHT,left:YAXIS_WIDTH,top:0}}/>
      </div>
    );
  }

  changeMinXY = ()=>{
    let {changeHandler} = this.props;
    let {minX,minY,maxX,maxY} = this.props;
    if (minX>=1508858000){
      this.incrementX = -100000;
    }
    if (minX<= 1482858000){
      this.incrementX = 100000;
    }
    if (!this.incrementY) {
      this.incrementY = 1;
    }
    if (minY>=10){
      this.incrementY = -1;
    }
    if (minY<=-10){
      this.incrementY = 1;
    }
    changeHandler({ minX:minX+this.incrementX,
                    maxX:maxX+this.incrementX,
                    minY:minY+this.incrementY,
                    maxY:maxY+this.incrementY});
  }
  
  updateHoverDomX = ({hoveringPosition})=>{
    if (hoveringPosition===undefined) {
      return;
    }
    let domX = null;
    if (hoveringPosition) {
      domX = hoveringPosition.domX;
    }
    this.setState({ hoverDomX:domX });
  }

  handleInPlotXRangeSelection = (startX,endX)=>{
    this.setState({ inPlotXRangeSelectionStartX:startX,inPlotXRangeSelectionEndX:endX });
  }
  
  handleSelectLocation = (selection)=>{
    this.setState({ locationSelection:selection,
                    });
  }

  handleClickSelectProcedure = (selection)=>{
    this.setState({ procedureSelection:selection,
                    });
  }
  
  handleHoverSelectProcedure = (selection)=>{
    this.setState({ procedureHoverSelection:selection,
                    });
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
  
  onPlotXRangeSelection_DraggingLeftHandler = (deltaDataX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_LeftDeltaX: deltaDataX
                    });
  }
  
  onPlotXRangeSelection_DraggingMainHandler = (deltaDataX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_LeftDeltaX: deltaDataX,
                    onPlotXRangeSelection_RightDeltaX: deltaDataX
                    });
  }
  
  onPlotXRangeSelection_DraggingRightHandler = (deltaDataX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_RightDeltaX: deltaDataX
                    });
  }
  
  onPlotXRangeSelection_DraggedLeftHandler = (deltaDataX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartX: this.props.onPlotXRangeSelection_StartX+deltaDataX,
                    onPlotXRangeSelection_LeftDeltaX: 0
                    });
  }
  
  onPlotXRangeSelection_DraggedMainHandler = (deltaDataX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartX: this.props.onPlotXRangeSelection_StartX+deltaDataX,
                    onPlotXRangeSelection_EndX: this.props.onPlotXRangeSelection_EndX+deltaDataX,
                    onPlotXRangeSelection_LeftDeltaX: 0,
                    onPlotXRangeSelection_RightDeltaX: 0
                    });
  }
  
  onPlotXRangeSelection_DraggedRightHandler = (deltaDataX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_EndX: this.props.onPlotXRangeSelection_EndX+deltaDataX,
                    onPlotXRangeSelection_RightDeltaX: 0
                    });
  }
}

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
    locationSelection: state.plot.locationSelection || null,
    verticalCrosshair_X: state.plot.verticalCrosshair_X || null,
    dataPoint_hoverSelection: state.plot.dataPoint_hoverSelection || null,
    inPlotXRangeSelection_StartX: state.plot.inPlotXRangeSelection_StartX || null,
    inPlotXRangeSelection_EndX: state.plot.inPlotXRangeSelection_EndX || null,
    onPlotXRangeSelection_StartX: state.plot.onPlotXRangeSelection_StartX || 1482858000,
    onPlotXRangeSelection_EndX: state.plot.onPlotXRangeSelection_EndX || 1502858000,
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

