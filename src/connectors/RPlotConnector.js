import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { memoize_one } from "memoize";
import { changeTopLevelPlot } from "../actions/plot-actions";
// Import components
import Timer from "../components/Timer";
import HoverSelectionAddon from "../components/HoverSelectionAddon";
import XAxisDate from "../components/XAxisDate";
import VerticalGrid_Date from "../components/VerticalGrid_Date";
import RespiratoryScoreLimitSlabGrid from "../components/RespiratoryScoreLimitSlabGrid";
import RespiratoryPlot from "../components/RespiratoryPlot";
import LocationPlot from "../components/LocationPlot";
import LocationPlotYAxisTwoLevelPanel from "../components/LocationPlotYAxisTwoLevelPanel";
import LocationPlotSelector from "../components/LocationPlotSelector";
import LocationPlotSelectionLabel from "../components/LocationPlotSelectionLabel";
import ProcedurePlot, {ProcedurePlotAddon} from "../components/ProcedurePlot";
//import ProcedurePlotClickSelectionAddon from "../components/ProcedurePlotClickSelectionAddon";
import OnPlotXRangeSelection from "../components/OnPlotXRangeSelection";
import VerticalCrosshair from "../components/VerticalCrosshair";
import SelectionPoint from "../components/SelectionPoint";
import InPlotXRangeSelection from "../components/InPlotXRangeSelection";
import RespiratoryScoreLimitsPanel from "../components/RespiratoryScoreLimitsPanel";

import "./RespPlotBundle.css";

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

const LEFT_WIDTH=150;
const PLOT_WIDTH=1000;

const TOP_HEIGHT=50;
const PLOT_HEIGHT=100;
const BOTTOM_HEIGHT=50;


class VerticalCrossHairController extends PureComponent{
  render(){
    return null;
  }

  componentDidUpdate() {
    let {hoverX,updateHandler} = this.props;
    updateHandler({verticalCrosshair_X:hoverX});
  }
}

class RespPlotBundle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {hoverX:null,hoverY:null,
                  hoverDomX:null,hoverDomY:null,
                  hoverTimeStamp:null,
                  };
    this.setState = this.setState.bind(this);
    this.HoverInteractionContext = React.createContext();
  }
  render() {
    console.log("render");
    let { minX,maxX,
          minY,maxY,
          panningX,
          //~ hoverX, hoverY,
          //~ hoverDomX, hoverDomY,
          //~ hoverTimeStamp,
          clickX, clickY,
          clickDomX, clickDomY,
          clickTimeStamp,
          verticalCrosshair_X,
          locationSelection,
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
    
    let { hoverX,hoverY,
          hoverDomX,hoverDomY,
          hoverTimeStamp} = this.state;
    let {HoverInteractionContext} = this;
    let { changeHandler } = this.props;
    minX = minX-panningX;
    maxX = maxX-panningX;

    return (
      <div style={{position:"relative", width:LEFT_WIDTH+PLOT_WIDTH, height:TOP_HEIGHT+PLOT_HEIGHT+BOTTOM_HEIGHT}}>
        {/*<Timer callback={this.changeMinXY}/>*/}
        {/*Location plot*/}
        <div style={{position:"absolute",width:LEFT_WIDTH,height:TOP_HEIGHT}}>
          <LocationPlotYAxisTwoLevelPanel className="RespPlotBundle-fillParent"
                                          width={LEFT_WIDTH} height={TOP_HEIGHT}/>
        </div>
        <div style={{position:"absolute",width:PLOT_WIDTH,height:TOP_HEIGHT,left:LEFT_WIDTH}}>
          <LocationPlotSelector data={location}
                                minX={minX} maxX={maxX} width={PLOT_WIDTH}
                                hoverX={hoverX}
                                selectHandler={this.locationPlot_selectHandler}
                                />
          <div style={{position:"absolute",width:PLOT_WIDTH,height:TOP_HEIGHT/2,top:TOP_HEIGHT/4,backgroundColor:"#fff5e9"}}>
            <LocationPlot className="RespPlotBundle-fillParent"
                          data={location}
                          minX={minX} maxX={maxX} width={PLOT_WIDTH}
                          />
            <LocationPlotSelectionLabel className="RespPlotBundle-fillParent"
                                        selection={locationSelection}
                                        minX={minX} maxX={maxX} width={PLOT_WIDTH}
                                        />
          </div>
          <VerticalCrosshair className="RespPlotBundle-fillParent"
                             X={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={PLOT_WIDTH}
                             />
          <InPlotXRangeSelection  className="RespPlotBundle-fillParent"
                                  startX={inPlotXRangeSelection_StartX} endX={inPlotXRangeSelection_EndX}
                                  minX={minX} maxX={maxX} width={PLOT_WIDTH}/>
        </div>
        {/*End Location plot*/}
        {/*Y Axis*/}
        <div style={{position:"absolute",width:LEFT_WIDTH,height:PLOT_HEIGHT,top:TOP_HEIGHT}}>
          <RespiratoryScoreLimitsPanel  className="RespPlotBundle-fillParent"
                                        minY={minY} maxY={maxY} width={LEFT_WIDTH} height={PLOT_HEIGHT}
                                        />
        </div>
        {/*Respiratory plot area*/}
        <div style={{position:"absolute",width:PLOT_WIDTH,height:PLOT_HEIGHT,left:LEFT_WIDTH,top:TOP_HEIGHT,overflow:"hidden"}}>
          <RespiratoryScoreLimitSlabGrid  className="RespPlotBundle-fillParent"
                                          data={respiratoryScoreLimits}
                                          minY={minY} maxY={maxY} height={PLOT_HEIGHT}
                                          />
          <VerticalGrid_Date  className="RespPlotBundle-fillParent RespPlotBundle-opacity25"
                              minX={minX} maxX={maxX} width={PLOT_WIDTH}
                              />
          <RespiratoryPlot  className="RespPlotBundle-fillParent"
                            respiratoryScores={respiratoryScore} iNO={iNO} anesthetics={anesthetics}
                            minX={minX} maxX={maxX} width={PLOT_WIDTH}
                            minY={minY} maxY={maxY} height={PLOT_HEIGHT}
                            />
          <ProcedurePlot  className="RespPlotBundle-fillParent"
                          data = {procedure}
                          minX={minX} maxX={maxX} width={PLOT_WIDTH} height={PLOT_HEIGHT}
                          />
          <SelectionPoint className="RespPlotBundle-fillParent"
                          
                          minX={minX} maxX={maxX} width={PLOT_WIDTH}
                          minY={minY} maxY={maxY} height={PLOT_HEIGHT} 
                          />
          <VerticalCrosshair className="RespPlotBundle-fillParent"
                             X={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={PLOT_WIDTH}
                             />
          <InPlotXRangeSelection  className="RespPlotBundle-fillParent"
                                  startX={inPlotXRangeSelection_StartX} endX={inPlotXRangeSelection_EndX}
                                  minX={minX} maxX={maxX} width={PLOT_WIDTH}/>
        </div>
        {/*End Respiratory plot area*/}
        {/*X Axis*/}
        <div style={{position:"absolute",width:PLOT_WIDTH,height:BOTTOM_HEIGHT,left:LEFT_WIDTH,top:PLOT_HEIGHT+TOP_HEIGHT}}>
          <XAxisDate className="RespPlotBundle-fillParent"
                      minX={minX} maxX={maxX} height={BOTTOM_HEIGHT} width={PLOT_WIDTH}
                     />
        </div>
        {/*End X Axis*/}
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
  
  locationPlot_selectHandler = (selection)=> {
    let {changeHandler} = this.props;
    changeHandler({ locationSelection:selection,
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
    locationSelection: state.plot.locationSelection || null,
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

