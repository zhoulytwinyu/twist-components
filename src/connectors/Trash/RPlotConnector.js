import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { changeTopLevelPlot } from "../actions/plot-actions";
// Import components
import RespiratoryScoresPlotLimitsPanel from "../components/RespiratoryScoresPlot/RespiratoryScoresPlotLimitsPanel";
import RespiratoryScoresPlotHorizontalSlabGrid from "../components/RespiratoryScoresPlot/RespiratoryScoresPlotHorizontalSlabGrid";
import RespiratoryScoresPlot from "../components/RespiratoryScoresPlot/RespiratoryScoresPlot";
import RespiratoryScoresPlotPointSelector from "../components/RespiratoryScoresPlot/RespiratoryScoresPlotPointSelector";
import RespiratoryScoresSelectionPoint from "../components/RespiratoryScoresPlot/RespiratoryScoresSelectionPoint";
import RespiratoryScoresTooltip from "../components/RespiratoryScoresPlot/RespiratoryScoresTooltip";
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
import PlotPanningController from "../components/Interaction/PlotPanningController";
//
import DynamicDateYAxisTwoLevelPanel from "../components/DateXAxis/DynamicDateYAxisTwoLevelPanel";
import DateXAxis from "../components/DateXAxis/DateXAxis";
import DateVerticalGridLines from "../components/DateXAxis/DateVerticalGridLines";
//
import InPlotXRangeSelection from "../components/InPlotXRangeSelection/InPlotXRangeSelection";
import InPlotXRangeSelector from "../components/InPlotXRangeSelection/InPlotXRangeSelector";
import OnPlotXRangeSelection from "../components/OnPlotXRangeSelection/OnPlotXRangeSelection";
//
import VerticalCrosshair from "../components/VerticalCrosshair/VerticalCrosshair";
import VerticalCrosshairSelector from "../components/VerticalCrosshair/VerticalCrosshairSelector";
//
import VerticalHighlight from "../components/VerticalHighlight/VerticalHighlight";
//
import Relay from "../components/UtilityComponents/Relay";
import GradientOverlay from "../components/UtilityComponents/GradientOverlay";
// CSS
import "./plot.css";

// Fake data
import respiratoryScore from "./test-data/respiratoryScore";
import iNO from "./test-data/iNO";
import anesthetics from "./test-data/anesthetics";
import location from "./test-data/location";
import procedure from "./test-data/procedure";
import respiratoryVariables from "./test-data/respiratoryVariables";

const YAXIS_WIDTH=150;
const X1AXIS_HEIGHT=50;
const XAXIS_HEIGHT=30;
const minY = 0, maxY = 100;

class RespPlotBundle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {hoverDomX:null,
                  hoverClientX:null,
                  hoverClientY:null,
                  respiratoryScoreSelection:null,
                  locationSelection:null,
                  procedureSelection:null,
                  procedureHoverSelection:null,
                  dataPointSelection:null,
                  inPlotXRangeSelectionStartX:null,
                  inPlotXRangeSelectionEndX:null
                  };
    this.setState = this.setState.bind(this);
  }
  render() {
    let { minX,maxX,
          verticalCrosshair_X,
          onPlotXRangeSelection_StartX,onPlotXRangeSelection_EndX,
          width,height,
          // location
          // procedure
          // respiratory
          // data
          } = this.props;
    
    let { hoverDomX,
          hoverClientX,
          hoverClientY,
          respiratoryScoreSelection,
          locationSelection,
          procedureSelection,
          procedureHoverSelection,
          inPlotXRangeSelection_StartX,
          inPlotXRangeSelection_EndX,
          } = this.state;
    
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
            <LocationsPlotSelectionLabel  className="fillParent abcdefg"
                                          selection={locationSelection}
                                          minX={minX} maxX={maxX} width={plotWidth}
                                          />
          </div>
          <VerticalCrosshair className="fillParent"
                             X={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={plotWidth}
                             />
          <InPlotXRangeSelection  
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
        <div style={{position:"absolute",width:plotWidth,height:plotHeight,left:YAXIS_WIDTH,top:X1AXIS_HEIGHT}}>
          <RespiratoryScoresPlotHorizontalSlabGrid  className="fillParent"
                                                    minY={minY} maxY={maxY} height={plotHeight}
                                                    />
          <DateVerticalGridLines  className="fillParent"
                                  minX={minX} maxX={maxX} width={plotWidth}
                                  />
          <VerticalHighlight  className="fillParent"
                              start={verticalCrosshair_X} end={verticalCrosshair_X+100000} color="red"
                              minX={minX} maxX={maxX} width={plotWidth}
                              />
          <RespiratoryScoresPlot  className="fillParent"
                                  respiratoryScores={respiratoryScore} iNO={iNO} anesthetics={anesthetics}
                                  minX={minX} maxX={maxX} width={plotWidth}
                                  minY={minY} maxY={maxY} height={plotHeight}
                                  />
          <RespiratoryScoresSelectionPoint  className="fillParent"
                                            selection={respiratoryScoreSelection}
                                            minX={minX} maxX={maxX} width={plotWidth}
                                            minY={minY} maxY={maxY} height={plotHeight}
                                            />
          <RespiratoryScoresTooltip data={respiratoryVariables} selection={respiratoryScoreSelection} clientX={hoverClientX} clientY={hoverClientY}/>
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
                                  startX={inPlotXRangeSelection_StartX} endX={inPlotXRangeSelection_EndX}
                                  minX={minX} maxX={maxX} width={plotWidth}/>
          {/* Main plot area interaction */}
          <PlotInteractionBoxProvider className="fillParent test"
                                      render={({hoveringPosition,
                                                clickPosition,doubleClickPosition,
                                                selectingPositions,
                                                selectedPositions,
                                                panningPositions,
                                                pannedPositions})=>
            <>
              <Relay  data={hoveringPosition}
                      updateHandler={this.updateHoveringPosition}/>
              <OnPlotXRangeSelection  className="fillParent"
                                      minX={minX} maxX={maxX} height={plotHeight} width={plotWidth}
                                      startX={onPlotXRangeSelection_StartX}
                                      endX={onPlotXRangeSelection_EndX}
                                      topHandle={true}
                                      draggingLeftHandler={this.onPlotXRangeSelection_DraggingLeftHandler}
                                      draggingMainHandler={this.onPlotXRangeSelection_DraggingMainHandler}
                                      draggingRightHandler={this.onPlotXRangeSelection_DraggingRightHandler}
                                      draggedLeftHandler={this.onPlotXRangeSelection_DraggedLeftHandler}
                                      draggedMainHandler={this.onPlotXRangeSelection_DraggedMainHandler}
                                      draggedRightHandler={this.onPlotXRangeSelection_DraggedRightHandler}
                                      />
              <RespiratoryScoresPlotPointSelector data={respiratoryScore}
                                                  hoveringPosition={hoveringPosition}
                                                  minX={minX} maxX={maxX} width={plotWidth}
                                                  selectHandler={this.handlePointSelect}
                                                  />
              <PlotPanningController  panningPositions={panningPositions}
                                      minX={minX} maxX={maxX} width={plotWidth}
                                      panHandler={this.handlePanning}
                                      />
              <VerticalCrosshairSelector  hoveringPosition={hoveringPosition}
                                          selectHandler={this.updateVerticalCrosshairX}
                                          minX={minX} maxX={maxX} width={plotWidth}
                                          />
              <InPlotXRangeSelector selectingPositions={selectingPositions}
                                    minX={minX} maxX={maxX} width={plotWidth}
                                    selectHandler={this.handleInPlotXRangeSelecting}
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
                      position="x2"
                      />
        </div>
        {/*  End X Axis  */}
        {/* Other decorations */}
        <GradientOverlay  style={{position:"absolute",width:10,height:plotHeight+XAXIS_HEIGHT+X1AXIS_HEIGHT,left:YAXIS_WIDTH,top:0}}/>
      </div>
    );
  }
  
  updateHoveringPosition = (hoveringPosition)=>{
    if (hoveringPosition){
      this.setState({ hoverDomX: hoveringPosition.domX,
                      hoverClientX: hoveringPosition.clientX,
                      hoverClientY: hoveringPosition.clientY
                      });
    }
    else {
      this.setState({ hoverDomX: null,
                      hoverClientX: null,
                      hoverClientY: null
                      });
    }
  }
  
  handlePointSelect = (selection)=>{
    this.setState({ respiratoryScoreSelection:selection });
  }
  
  handlePanning = (minX,maxX)=>{
    let {changeHandler} = this.props;
    changeHandler({minX,maxX});
  }
  
  updateVerticalCrosshairX = (VCX)=>{
    let {changeHandler} = this.props;
    changeHandler({verticalCrosshair_X:VCX});
  }

  handleInPlotXRangeSelecting = (startX,endX)=>{
    this.setState({ inPlotXRangeSelection_StartX:startX,inPlotXRangeSelection_EndX:endX });
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
  
  onPlotXRangeSelection_DraggingLeftHandler = (startX,endX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartX: startX,
                    onPlotXRangeSelection_EndX: endX
                    });
  }
  
  onPlotXRangeSelection_DraggingMainHandler = (startX,endX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartX: startX,
                    onPlotXRangeSelection_EndX: endX
                    });
  }
  
  onPlotXRangeSelection_DraggingRightHandler = (startX,endX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartX: startX,
                    onPlotXRangeSelection_EndX: endX
                    });
  }
  
  onPlotXRangeSelection_DraggedLeftHandler = (startX,endX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartX: startX,
                    onPlotXRangeSelection_EndX: endX
                    });
  }
  
  onPlotXRangeSelection_DraggedMainHandler = (startX,endX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartX: startX,
                    onPlotXRangeSelection_EndX: endX
                    });
  }
  
  onPlotXRangeSelection_DraggedRightHandler = (startX,endX) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartX: startX,
                    onPlotXRangeSelection_EndX: endX
                    });
  }
}

const mapStateToProps = function (state,ownProps) {
  return {
    minX: state.plot.minX,
    maxX: state.plot.maxX,
    verticalCrosshair_X: state.plot.verticalCrosshair_X,
    onPlotXRangeSelection_StartX: state.plot.onPlotXRangeSelection_StartX || 1482858000,
    onPlotXRangeSelection_EndX: state.plot.onPlotXRangeSelection_EndX || 1502858000,
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

