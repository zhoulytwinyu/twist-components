import React, { PureComponent } from "react";

// Components
// Plot Containers
import {PlotContainer,PlotSubContainer} from "../PlotContainers/PlotContainers";

//
import BloodPressurePlot from "../BloodPressurePlot/BloodPressurePlot";
import BloodPressurePanel from "../BloodPressurePlot/BloodPressurePanel";
import BloodPressuresHorizontalSlabGrid from "../BloodPressurePlot/BloodPressuresHorizontalSlabGrid";
//
import DynamicDateYAxisTwoLevelPanel from "../DateXAxis/DynamicDateYAxisTwoLevelPanel";
import DateXAxis from "../DateXAxis/DateXAxis";
import DateVerticalGridLines from "../DateXAxis/DateVerticalGridLines";
//
import YAxis from "../YAxis/YAxis";
import YAxisSlabGrid from "../YAxis/YAxisSlabGrid";
//
import PlotInteractionBoxProvider from "../Interaction/PlotInteractionBoxProvider";
import VerticalCrosshair from "../VerticalCrosshair/VerticalCrosshair";
import VerticalCrosshairSelector from "../VerticalCrosshair/VerticalCrosshairSelector";
//
import GradientOverlay from "../UtilityComponents/GradientOverlay";

const minY = 0;
const maxY = 200;
const LEFT_WIDTH = 150
const RIGHT_WIDTH = 0
const TOP_HEIGHT = 30
const BOTTOM_HEIGHT = 0

class BloodPressurePlotBundle extends PureComponent {
  render() {
    let { DBP,MBP,SBP,
          width,minX,maxX,height,
          verticalCrosshair_X} = this.props
    let plotWidth = width-LEFT_WIDTH-RIGHT_WIDTH
    let plotHeight = height-TOP_HEIGHT-BOTTOM_HEIGHT

    return (
      <PlotContainer  width={width} height={height}
                      leftWidth={LEFT_WIDTH} plotWidth={plotWidth} rightWidth={RIGHT_WIDTH}
                      topHeight={TOP_HEIGHT} plotHeight={plotHeight} bottomHeight={BOTTOM_HEIGHT} >
        {/*Row TOP*/}
        {/*Col LEFT*/}
        <PlotSubContainer> 
          <DynamicDateYAxisTwoLevelPanel  minX={minX} maxX={maxX} width={LEFT_WIDTH}
                                          height={TOP_HEIGHT}
                                          />
        </PlotSubContainer>
        {/*Col PLOT*/}
        <PlotSubContainer>
          <DateXAxis  minX={minX} maxX={maxX}
                      height={TOP_HEIGHT} width={plotWidth}
                      tickPosition="bottom"
                      />
        </PlotSubContainer>
        {/*Col RIGHT*/}
        <PlotSubContainer>
        </PlotSubContainer>
        {/*Row PLOT*/}
        {/*Col LEFT*/}
        <PlotSubContainer>
          <BloodPressurePanel height={plotHeight} width={LEFT_WIDTH}/>
          <YAxis  minY={minY} maxY={maxY}
                  width={LEFT_WIDTH} height={plotHeight}
                  tickPosition="right"
                  />
        </PlotSubContainer>
        {/*Col PLOT*/}
        <PlotSubContainer>
          <YAxisSlabGrid  height={plotHeight}
                          width={plotWidth} minY={minY} maxY={maxY}
                          />
          <DateVerticalGridLines  height={plotHeight}
                                  width={plotWidth} minX={minX} maxX={maxX}
                                  />
          <BloodPressurePlot  DBP={DBP}
                              MBP={MBP}
                              SBP={SBP}
                              width={plotWidth} minX={minX} maxX={maxX}
                              height={plotHeight} minY={minY} maxY={maxY}
                              />
          <VerticalCrosshair X={verticalCrosshair_X}
                             minX={minX} maxX={maxX} width={plotWidth}
                             height={plotHeight}
                             />
          {/* Main plot area interaction */}
          <PlotInteractionBoxProvider width={plotWidth}
                                      height={plotHeight}
                                      render={({hoveringPosition,
                                                clickPosition,doubleClickPosition,
                                                selectingPositionStart,selectingPositionEnd,
                                                selectedPositionStart,selectedPositionEnd,
                                                panningPositionStart,panningPositionEnd,
                                                pannedPositionStart,pannedPositionEnd})=>
            <>
              <VerticalCrosshairSelector  hoveringPosition={hoveringPosition}
                                          selectHandler={this.updateVerticalCrosshairX}
                                          minX={minX} maxX={maxX} width={plotWidth}
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
        </PlotSubContainer>
        {/*Col PLOT*/}
        <PlotSubContainer>
        </PlotSubContainer>
        {/*Col RIGHT*/}
        <PlotSubContainer>
        </PlotSubContainer>
        {/*Other stuffs that ignore grid layut*/}
        <GradientOverlay  style={{position:"absolute",width:10,height:height,left:LEFT_WIDTH,top:0}}/>
      </PlotContainer>
    );
  }
  
  updateVerticalCrosshairX = (VCX)=>{
    let {changeHandler} = this.props;
    changeHandler({verticalCrosshair_X:VCX});
  }
}

export default BloodPressurePlotBundle;
