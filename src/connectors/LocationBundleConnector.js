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

class LocationBundle extends Component {
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
          <YCategoricalPanel  style={{position:"absolute",width:30,height:height}}
                              category={[ {start:0,end:1,bgStyle:{fillStyle:"grey"}}
                                          ]}
                              width={LEFT} height={height}
                              />
          <YCategoricalPanel  style={{position:"absolute",width:LEFT-30,height:height,left:30}}
                              category={[ {start:0,end:1,bgStyle:{fillStyle:"red"},name:"Location",textStyle:{fillStyle:"black",font:"bold 16px Sans",textAlign:"left",textBaseline:"middle"},textPosition:3}
                                          ]}
                              width={LEFT} height={height}
                              />
        </div>
        <div style={{position:"absolute",width:width,height:height,left:LEFT,top:TOP}}>
            <VerticalGrid style={{position:"absolute",width:width,height:height}}
                          grid={[{x:2000},{x:8000},{x:16000}]}
                          minX={minX} maxX={maxX} width={width}
                          />
            <LocationPlot style={{position:"absolute",height:height,width:width}}
                          minX={minX} maxX={maxX} width={width}
                          data={location} />
            <VerticalCrosshair style={{position:"absolute",width:width,height:height}}
                               hoverDataX={hoverX}
                               minX={minX} maxX={maxX} width={width}
                               />
            <InPlotXRangeSelection  style={{position:"absolute",width:width,height:height}}
                                    startDataX={inPlotXRangeSelectionStartDataX} endDataX={inPlotXRangeSelectionEndDataX}
                                    minX={minX} maxX={maxX} width={width}/>
        </div>
        {/*Plot Area*/}
        <HoverSelectionXInteractionBoxWithReference style={{position:"absolute",width:width,height:height,left:LEFT,top:TOP}}
                                                    minX={minX} maxX={maxX} width={width}
                                                    minY={minY} maxY={maxY} height={height}
                                                    data={selectionData}
                                                    hoveringHandler={this.hoveringHandler} mouseOutHandler={this.mouseOutHandler}
                                                    selectHandler={this.hoverSelectionHandler} >
          <DualPhaseXInteractionBoxWithReference  style={{position:"absolute",width:width,height:height}}
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

const LocationBundleConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationBundle);

export default LocationBundleConnector;

