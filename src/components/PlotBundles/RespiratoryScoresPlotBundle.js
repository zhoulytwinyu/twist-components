import React, { PureComponent } from "react";
// Components
// Plot Containers
import {PlotContainer, PlotSubContainer} from "../PlotContainers/PlotContainers";
//
import RespiratoryScoresPlotLimitsPanel from "../RespiratoryScoresPlot/RespiratoryScoresPlotLimitsPanel";
import RespiratoryScoresPlotHorizontalSlabGrid from "../RespiratoryScoresPlot/RespiratoryScoresPlotHorizontalSlabGrid";
import RespiratoryScoresPlot from "../RespiratoryScoresPlot/RespiratoryScoresPlot";
import RespiratoryScoresPlotPointSelector from "../RespiratoryScoresPlot/RespiratoryScoresPlotPointSelector";
import RespiratoryScoresSelectionPoint from "../RespiratoryScoresPlot/RespiratoryScoresSelectionPoint";
import RespiratoryScoresTooltip from "../RespiratoryScoresPlot/RespiratoryScoresTooltip";
//
import LocationsPlot from "../LocationsPlot/LocationsPlot";
import LocationsPlotYAxisTwoLevelPanel from "../LocationsPlot/LocationsPlotYAxisTwoLevelPanel";
import LocationsPlotSelectionLabel from "../LocationsPlot/LocationsPlotSelectionLabel";
import LocationsPlotHoverSelector from "../LocationsPlot/LocationsPlotHoverSelector";
//
import ProceduresPlot from "../ProceduresPlot/ProceduresPlot";
import ProceduresPlotClickSelector from "../ProceduresPlot/ProceduresPlotClickSelector";
import ProceduresPlotHoverSelector from "../ProceduresPlot/ProceduresPlotHoverSelector";
import ProceduresPlotTimeDiff from "../ProceduresPlot/ProceduresPlotTimeDiff";
//
import PlotInteractionBoxProvider from "../Interaction/PlotInteractionBoxProvider";
import PlotPanningController from "../Interaction/PlotPanningController";
//
import DynamicDateYAxisTwoLevelPanel from "../DateXAxis/DynamicDateYAxisTwoLevelPanel";
import DateXAxis from "../DateXAxis/DateXAxis";
import DateVerticalGridLines from "../DateXAxis/DateVerticalGridLines";
//
import InPlotXRangeSelection from "../InPlotXRangeSelection/InPlotXRangeSelection";
import InPlotXRangeSelector from "../InPlotXRangeSelection/InPlotXRangeSelector";
import OnPlotXRangeSelection from "../OnPlotXRangeSelection/OnPlotXRangeSelection";
//
import VerticalCrosshair from "../VerticalCrosshair/VerticalCrosshair";
import VerticalCrosshairSelector from "../VerticalCrosshair/VerticalCrosshairSelector";
//
import VerticalHighlight from "../VerticalHighlight/VerticalHighlight";
//
import Relay from "../UtilityComponents/Relay";
import GradientOverlay from "../UtilityComponents/GradientOverlay";

// Const
const LEFT_WIDTH = 150;
const RIGHT_WIDTH = 0;
const TOP_HEIGHT = 50;
const BOTTOM_HEIGHT = 30;

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
          anesthetics,
          iNO,
          locations,
          procedures,
          respiratoryScores,
          respiratoryVariables
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
    
    let plotWidth = width-LEFT_WIDTH-RIGHT_WIDTH;
    let plotHeight = height-TOP_HEIGHT-BOTTOM_HEIGHT;
    
    return (
      <PlotContainer  width={width} height={height}
                      leftWidth={LEFT_WIDTH} plotWidth={plotWidth} rightWidth={RIGHT_WIDTH}
                      topHeight={TOP_HEIGHT} plotHeight={plotHeight} bottomHeight={BOTTOM_HEIGHT} >
        {/*Row TOP*/}
        {/*Col LEFT*/}
        <PlotSubContainer> 
          <LocationsPlotYAxisTwoLevelPanel width={LEFT_WIDTH} height={TOP_HEIGHT}/>
        </PlotSubContainer>
        {/*Col PLOT*/}
        <PlotSubContainer>
          <div style={{height:"100%",width:"100%",backgroundColor:"#fff5e9"}}>
          </div>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",height:TOP_HEIGHT,width:plotWidth}}>
            <LocationsPlot  height={TOP_HEIGHT/2}
                            data={locations}
                            minX={minX} maxX={maxX} width={plotWidth}
                            />
          </div>
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",height:TOP_HEIGHT,width:plotWidth}}>
            <LocationsPlotSelectionLabel  selection={locationSelection}
                                          minX={minX} maxX={maxX} width={plotWidth}
                                          />
          </div>
          <VerticalCrosshair X={verticalCrosshair_X}
                             height={TOP_HEIGHT}
                             minX={minX} maxX={maxX} width={plotWidth}
                             />
          <InPlotXRangeSelection  startX={inPlotXRangeSelection_StartX} endX={inPlotXRangeSelection_EndX}
                                  height={TOP_HEIGHT}
                                  minX={minX} maxX={maxX} width={plotWidth}/>
        </PlotSubContainer>
        {/*Col RIGHT*/}
        <PlotSubContainer>
        </PlotSubContainer>
        {/*Row PLOT*/}
        {/*Col LEFT*/}
        <PlotSubContainer>
          <RespiratoryScoresPlotLimitsPanel minY={minY} maxY={maxY}
                                            width={LEFT_WIDTH} height={plotHeight}
                                            />
        </PlotSubContainer>
        {/*Col PLOT*/}
        <PlotSubContainer>
          <RespiratoryScoresPlotHorizontalSlabGrid  minY={minY} maxY={maxY}
                                                    width={plotWidth} height={plotHeight}
                                                    />
          <DateVerticalGridLines  minX={minX} maxX={maxX}
                                  width={plotWidth} height={plotHeight}
                                  />
          <VerticalHighlight  start={verticalCrosshair_X}
                              end={verticalCrosshair_X+100000}
                              color="red"
                              minX={minX} maxX={maxX} width={plotWidth}
                              />
          <RespiratoryScoresPlot  respiratoryScores={respiratoryScores} iNO={iNO} anesthetics={anesthetics}
                                  minX={minX} maxX={maxX} width={plotWidth}
                                  minY={minY} maxY={maxY} height={plotHeight}
                                  />
          <RespiratoryScoresSelectionPoint  selection={respiratoryScoreSelection}
                                            minX={minX} maxX={maxX} width={plotWidth}
                                            minY={minY} maxY={maxY} height={plotHeight}
                                            />
          <RespiratoryScoresTooltip data={respiratoryVariables} selection={respiratoryScoreSelection} clientX={hoverClientX} clientY={hoverClientY}/>
          <ProceduresPlot data = {procedures} selection={procedureSelection || procedureHoverSelection}
                          minX={minX} maxX={maxX} width={plotWidth} height={plotHeight}
                          />
          <ProceduresPlotTimeDiff data = {procedures}
                                  selection={procedureSelection || procedureHoverSelection}
                                  hoverDomX={hoverDomX}
                                  minX={minX} maxX={maxX} width={plotWidth} height={plotHeight}
                                  />
          <VerticalCrosshair X={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={plotWidth}
                             height={plotHeight}
                             />
          <InPlotXRangeSelection  startX={inPlotXRangeSelection_StartX} endX={inPlotXRangeSelection_EndX}
                                  minX={minX} maxX={maxX} width={plotWidth}
                                  height={plotHeight}
                                  />
          {/* Main plot area interaction */}
          <PlotInteractionBoxProvider width={plotWidth}
                                      height={plotHeight}
                                      render={({hoveringPosition,
                                                clickPosition,doubleClickPosition,
                                                selectingPositions,
                                                selectedPositions,
                                                panningPositions,
                                                pannedPositions})=>
            <>
              <Relay  data={hoveringPosition}
                      updateHandler={this.updateHoveringPosition}/>
              <OnPlotXRangeSelection  minX={minX} maxX={maxX} height={plotHeight} width={plotWidth}
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
              <RespiratoryScoresPlotPointSelector data={respiratoryScores}
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
              <LocationsPlotHoverSelector data={locations}
                                          hoveringPosition={hoveringPosition}
                                          minX={minX} maxX={maxX} width={plotWidth}
                                          selectHandler={this.handleSelectLocation}
                                          />
              <ProceduresPlotClickSelector  data = {procedures}
                                            selection = {procedureSelection}
                                            minX={minX} maxX={maxX}
                                            width={plotWidth} height={plotHeight}
                                            clickPosition={clickPosition}
                                            selectHandler={this.handleClickSelectProcedure}
                                            />
              <ProceduresPlotHoverSelector  data={procedures}
                                            minX={minX} maxX={maxX}
                                            width={plotWidth} height={plotHeight}
                                            hoveringPosition={hoveringPosition}
                                            selectHandler={this.handleHoverSelectProcedure}
                                            />
            </>
          }/>
        </PlotSubContainer>
        {/*Col RIGHT*/}
        <PlotSubContainer>
        </PlotSubContainer>
        {/*Row BOTTOM*/}
        {/*Col LEFT*/}
        <PlotSubContainer>
          <DynamicDateYAxisTwoLevelPanel  minX={minX} maxX={maxX}
                                          width={LEFT_WIDTH} height={BOTTOM_HEIGHT}
                                          />
        </PlotSubContainer>
        {/*Col PLOT*/}
        <PlotSubContainer>
          <DateXAxis  minX={minX} maxX={maxX}
                      height={BOTTOM_HEIGHT} width={plotWidth}
                      position="x2"
                      />
        </PlotSubContainer>
        {/*Col RIGHT*/}
        <PlotSubContainer>
        </PlotSubContainer>
        {/*Other stuffs that ignore grid layut*/}
        <GradientOverlay  style={{position:"absolute",width:10,height:height,left:LEFT_WIDTH,top:0}}/>
      </PlotContainer>
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

export default RespPlotBundle;
