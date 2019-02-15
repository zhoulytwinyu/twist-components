import React, { PureComponent } from "react";
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
import TriPhaseInteractionBoxWithReference from "../components/InteractionBox/TriPhaseInteractionBoxWithReference";

import location from "./test-data/location";

class LocationBundle extends PureComponent {
  render() {
    let { minX,maxX,
          minY,maxY,
          panningX,
          hoverX, hoverY,
          hoverDomX, hoverDomY,
          clickX, clickY,
          clickDomX, clickDomY,
          verticalCrosshair_X,
          inPlotXRangeSelection_StartX,inPlotXRangeSelection_EndX,
          onPlotXRangeSelection_StartX,onPlotXRangeSelection_EndX,
          onPlotXRangeSelection_LeftDeltaX,onPlotXRangeSelection_RightDeltaX,
          procedurePlotClickSelectionAddon_clickSelection
          } = this.props;
    let { changeHandler } = this.props;
    let {LEFT,RIGHT,TOP,BOTTOM} = this;
    minX = minX-panningX;
    maxX = maxX-panningX;
    let width=1000;
    let left
    
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
        
        {/* Location plot area*/}
        <div style={{position:"absolute",width:width,height:height,left:LEFT,top:TOP,backgroundColor:"#fff5e9"}}>
          <VerticalGrid style={{position:"absolute",width:width,height:height}}
                        grid={[{x:2000},{x:8000},{x:16000}]}
                        minX={minX} maxX={maxX} width={width}
                        />
          <LocationPlot style={{position:"absolute",height:height/2,width:width,top:height/4}}
                        minX={minX} maxX={maxX} width={width}
                        data={location}
                        />
          <LocationPlotHoverLabel style={{position:"absolute",height:height/2,width:width,top:height/4}}
                                  minX={minX} maxX={maxX} width={width}
                                  data={location} hoverX={hoverX}/>
          <VerticalCrosshair style={{position:"absolute",width:width,height:height}}
                             hoverX={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={width}
                             />
          <InPlotXRangeSelection  style={{position:"absolute",width:width,height:height}}
                                  startX={inPlotXRangeSelection_StartX} endX={inPlotXRangeSelection_EndX}
                                  minX={minX} maxX={maxX} width={width}/>
        </div>

        <HoverInteractionBoxWithReference style={{position:"absolute",width:width,height:height,left:LEFT,top:TOP}}
                                                  minX={minX} maxX={maxX} width={width}
                                                  minY={1} maxY={0} height={height}
                                                  hoveringHandler={this.plot_hoveringHandler} mouseOutHandler={this.plot_mouseOutHandler}
                                                  >
          <TriPhaseInteractionBoxWithReference  style={{position:"absolute",width:width,height:height}}
                                                minX={minX} maxX={maxX} width={width}
                                                minY={1} maxY={0} height={height}
                                                doubleClickHandler={console.log}
                                                selectingHandler={this.plot_selectingHandler} selectedHandler={this.plot_selectedHandler}
                                                panningHandler={this.plot_panningHandler} pannedHandler={this.plot_pannedHandler}
                                                >
            <OnPlotXRangeSelection  style={{position:"absolute",width:width,height:height}}
                                    minX={minX} maxX={maxX} height={height} width={width}
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
    );
  }
  
  plot_hoveringHandler = ({dataX,dataY,domX,domY}) => {
    let {changeHandler} = this.props;
    changeHandler({ hoverX: dataX,
                    hoverDomX: domX,
                    hoverY: null,
                    hoverDomY: null,
                    verticalCrosshair_X: dataX,
                    });
  }
  
  plot_mouseOutHandler = () => {
    let {changeHandler} = this.props;
    changeHandler({ hoverX:null,
                    hoverDomX:null, 
                    hoverDomY:null,
                    hoverY:null,
                    verticalCrosshair_X: null,
                    });
  }
  
  hoverSelectionHandler = ({selection}) => {
    let {changeHandler} = this.props;
    changeHandler({hoverSelection:selection});
  }
  
  plot_selectingHandler = ({startDataX,endDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({inPlotXRangeSelection_StartX:startDataX,
                   inPlotXRangeSelection_EndX:endDataX});
  }
  
  plot_selectedHandler = ({startDataX,endDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({minX:Math.min(startDataX,endDataX),
                   maxX:Math.max(startDataX,endDataX),
                   inPlotXRangeSelection_StartX:null,
                   inPlotXRangeSelection_EndDX:null});
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
    changeHandler({ onPlotXRangeSelection_StartDataX: this.props.onPlotXRangeSelection_StartDataX+deltaDataX,
                    onPlotXRangeSelection_LeftDeltaX: 0
                    });
  }
  
  onPlotXRangeSelection_DraggedMainHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_StartDataX: this.props.onPlotXRangeSelection_StartDataX+deltaDataX,
                    onPlotXRangeSelection_EndDataX: this.props.onPlotXRangeSelection_EndDataX+deltaDataX,
                    onPlotXRangeSelection_LeftDeltaX: 0,
                    onPlotXRangeSelection_RightDeltaX: 0
                    });
  }
  
  onPlotXRangeSelection_DraggedRightHandler = ({deltaDataX}) => {
    let {changeHandler} = this.props;
    changeHandler({ onPlotXRangeSelection_EndDataX: this.props.onPlotXRangeSelection_EndDataX+deltaDataX,
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

