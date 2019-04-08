import React, { PureComponent } from "react";

// Components
// Plot Containers
import {PlotContainer,PlotSubContainer} from "../PlotContainers/PlotContainers";
//
import MedicationRecordsDynamicYAxisTwoLevelPanel from "../MedicationRecordsPlot/MedicationRecordsDynamicYAxisTwoLevelPanel";
import MedicationRecordsPlotHorizontalSlabGrid from "../MedicationRecordsPlot/MedicationRecordsPlotHorizontalSlabGrid";
import MedicationRecordsGroupingProvider from "../MedicationRecordsPlot/MedicationRecordsGroupingProvider"
import MedicationRecordsMedicationsInUseProvider from "../MedicationRecordsPlot/MedicationRecordsMedicationsInUseProvider"
import MedicationRecordsProvider from "../MedicationRecordsPlot/MedicationRecordsProvider"
import MedicationRecordsDynamicGroupedPlot from "../MedicationRecordsPlot/MedicationRecordsDynamicGroupingPlot"
//
import DynamicDateYAxisTwoLevelPanel from "../DateXAxis/DynamicDateYAxisTwoLevelPanel";
import DateXAxis from "../DateXAxis/DateXAxis";
import DateVerticalGridLines from "../DateXAxis/DateVerticalGridLines";
//
import PlotInteractionBoxProvider from "../Interaction/PlotInteractionBoxProvider";
import VerticalCrosshair from "../VerticalCrosshair/VerticalCrosshair";
import VerticalCrosshairSelector from "../VerticalCrosshair/VerticalCrosshairSelector";
//
import GradientOverlay from "../UtilityComponents/GradientOverlay";

const TOP_HEIGHT = 40;
const BOTTOM_HEIGHT = 0;
const LEFT_WIDTH = 150;
const RIGHT_WIDTH = 0;
const ROW_HEIGHT = 30;

class MedicationRecordsPlotBundle extends PureComponent {
  render() {
    let { minX,maxX,
          verticalCrosshair_X,
          width,
          medications,
          categoryStructure
          } = this.props;
    let plotWidth = width-LEFT_WIDTH;
    return (
      <>
        <MedicationRecordsProvider  medicationRecords={medications}
                                    categoryStructure={categoryStructure}
                                    render={ (requiredMedicationRecords) =>
          <MedicationRecordsGroupingProvider  medicationRecords={requiredMedicationRecords}
                                              render={ (groupedMedicationRecords)=>
            <MedicationRecordsMedicationsInUseProvider  medicationRecords={requiredMedicationRecords}
                                                        minX={minX}
                                                        maxX={maxX}
                                                        render={ (useMedications)=>
              {
              let plotHeight = useMedications.size*ROW_HEIGHT;
              let height = plotHeight+TOP_HEIGHT+BOTTOM_HEIGHT;
              return (
              <PlotContainer  width={width}
                              height={height}
                              topHeight={TOP_HEIGHT} plotHeight={plotHeight} bottomHeight={BOTTOM_HEIGHT}
                              leftWidth={LEFT_WIDTH} plotWidth={plotWidth} rightWidth={RIGHT_WIDTH}
                              >
                {/*TOP*/}
                <PlotSubContainer>
                  <DynamicDateYAxisTwoLevelPanel  minX={minX} maxX={maxX}
                                                  width={LEFT_WIDTH} height={TOP_HEIGHT}
                                                  />
                </PlotSubContainer>
                <PlotSubContainer>
                  <DateXAxis  minX={minX} maxX={maxX}
                              height={TOP_HEIGHT} width={plotWidth}
                              tickPosition="bottom"
                              />
                </PlotSubContainer>
                <PlotSubContainer>
                </PlotSubContainer>
                {/*Plot*/}
                <PlotSubContainer>
                  <MedicationRecordsDynamicYAxisTwoLevelPanel categoryStructure={categoryStructure}
                                                              useMedications={useMedications}
                                                              rowHeight={ROW_HEIGHT}
                                                              width={LEFT_WIDTH}
                                                              height={useMedications.size*ROW_HEIGHT}
                                                              />
                </PlotSubContainer>
                <PlotSubContainer>
                  <MedicationRecordsPlotHorizontalSlabGrid  height={plotHeight} rowHeight={ROW_HEIGHT}
                                                            width={plotWidth}
                                                            />
                  <DateVerticalGridLines  minX={minX} maxX={maxX} width={plotWidth}
                                          height={plotHeight}
                                          />
                  <MedicationRecordsDynamicGroupedPlot  medicationRecords={groupedMedicationRecords}
                                                        categoryStructure={categoryStructure}
                                                        useMedications={useMedications}
                                                        rowHeight={ROW_HEIGHT}
                                                        minX={minX} maxX={maxX}
                                                        width={plotWidth} height={useMedications.size*ROW_HEIGHT}
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
                <PlotSubContainer>
                </PlotSubContainer>
                {/*BOTTOM*/}
                <PlotSubContainer>
                </PlotSubContainer>
                <PlotSubContainer>
                </PlotSubContainer>
                <PlotSubContainer>
                </PlotSubContainer>
                {/* Others*/}
                <GradientOverlay  style={{position:"absolute",width:10,height:useMedications.size*ROW_HEIGHT+BOTTOM_HEIGHT+TOP_HEIGHT,left:LEFT_WIDTH,top:0}}/>
              </PlotContainer>
              );
              }
            }/>
          }/>
        }/>
      </>
    );
  }
  
  updateVerticalCrosshairX = (VCX)=>{
    let {changeHandler} = this.props;
    changeHandler({verticalCrosshair_X:VCX});
  }
}

export default MedicationRecordsPlotBundle;
