import React, { Component } from "react";
import { connect } from "react-redux";
import {changeTopLevelPlot} from "../actions/plot-actions";
// Import components
import XAxisDate from "../components/XAxisDate";
import YCategoricalPanel from "../components/YCategoricalPanel";
import VerticalGrid from "../components/VerticalGrid";
import HorizontalSlabGrid from "../components/HorizontalSlabGrid";
import RespiratoryPlot from "../components/RespiratoryPlot";
import LocationPlot from "../components/LocationPlot";
import LocationPlotHoverLabel from "../components/LocationPlotHoverLabel";
import ProcedurePlot from "../components/ProcedurePlot";
import OnPlotXRangeSelection from "../components/OnPlotXRangeSelection";
import VerticalCrosshair from "../components/VerticalCrosshair";
import SelectionPoint from "../components/SelectionPoint";
import InPlotXRangeSelection from "../components/InPlotXRangeSelection";
import HoverInteractionBoxWithReference from "../components/InteractionBox/HoverInteractionBoxWithReference";
import TriPhaseXInteractionBoxWithReference from "../components/InteractionBox/TriPhaseXInteractionBoxWithReference";

import location from "./test-data/location";
import procedures from "./test-data/procedures";
import {plot1x,plot1ys} from "./test-data/plot1";

let selectionData = [];
for (let i=0; i<plot1x.length; i++) {
  selectionData.push({x:plot1x[i],ys:[plot1ys[0][i],plot1ys[1][i]] });
}

class LocationBundle extends Component {
  render() {
    let { minX,maxX,
          minY,maxY,
          hoverX,hoverY,
          verticalCrosshair_X,
          hoverSelection,
          height,width,
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
          <YCategoricalPanel  style={{position:"absolute",width:30,height:height}}
                              category={[ {start:0,end:1,bgStyle:{fillStyle:"grey"}}
                                          ]}
                              width={LEFT} height={height} rowHeight={height}
                              />
          <YCategoricalPanel  style={{position:"absolute",width:LEFT-30,height:height,left:30}}
                              category={[ {start:0,end:1,bgStyle:{fillStyle:"red"},name:"Location",textStyle:{fillStyle:"black",font:"bold 16px Sans",textAlign:"left",textBaseline:"middle"},textPosition:3}
                                          ]}
                              width={LEFT} height={height} rowHeight={height}
                              />
        </div>
        <div style={{position:"absolute",width:width,height:height,left:LEFT,top:TOP,backgroundColor:"#fff5e9"}}>
            <VerticalGrid style={{position:"absolute",width:width,height:height}}
                          grid={[{x:2000},{x:8000},{x:16000}]}
                          minX={minX} maxX={maxX} width={width}
                          />
            <LocationPlot style={{position:"absolute",height:height/2,width:width,top:height/4}}
                          minX={minX} maxX={maxX} width={width}
                          data={location}/>
            <LocationPlotHoverLabel style={{position:"absolute",height:height/2,width:width,top:height/4}}
                          minX={minX} maxX={maxX} width={width}
                          data={location} hoverDataX={hoverX}/>
            <VerticalCrosshair style={{position:"absolute",width:width,height:height}}
                               hoverX={verticalCrosshair_X}
                               minX={minX} maxX={maxX} width={width}
                               />
            <InPlotXRangeSelection  style={{position:"absolute",width:width,height:height}}
                                    startDataX={inPlotXRangeSelectionStartDataX} endDataX={inPlotXRangeSelectionEndDataX}
                                    minX={minX} maxX={maxX} width={width}/>
        </div>
        {/*Plot Area*/}
        <HoverInteractionBoxWithReference style={{position:"absolute",width:width,height:height,left:LEFT,top:TOP}}
                                                  minX={minX} maxX={maxX} width={width}
                                                  minY={1} maxY={0} height={height}
                                                  hoveringHandler={this.hoveringHandler} mouseOutHandler={this.mouseOutHandler}
                                                  >
          <TriPhaseXInteractionBoxWithReference style={{position:"absolute",width:width,height:height}}
                                                minX={minX} maxX={maxX} width={width}
                                                minY={1} maxY={0} height={height}
                                                clickedHandler={console.log}
                                                doubleClickHandler={console.log}
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
          </TriPhaseXInteractionBoxWithReference>
        </HoverInteractionBoxWithReference>
      </div>
    );
  }
  
  hoveringHandler = ({dataX,dataY,domX,domY}) => {
    let {changeHandler} = this.props;
    changeHandler({ hoverX: dataX,
                    hoverDomX: domX,
                    verticalCrosshair_X: dataX,
                    hoverY: null,
                    hoverDomY: null
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

LocationBundle.prototype.LEFT=150;
LocationBundle.prototype.RIGHT=0;
LocationBundle.prototype.TOP=0;
LocationBundle.prototype.BOTTOM=0;

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

const LocationBundleConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationBundle);

export default LocationBundleConnector;

