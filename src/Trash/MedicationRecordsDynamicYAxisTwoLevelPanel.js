import React, { PureComponent } from 'react';
import YAxisTwoLevelPanel from "./YAxisTwoLevelPanel";

const PRIMARY_COLOR_CYCLE = ["cyan","blue","green"];
const SECONDARY_COLOR_CYCLE = ["yellow","beige"];

class MedicationRecordsDynamicYAxisTwoLevelPanel extends PureComponent{
  constructor(props){
    super(props);
    this.memo={};
  }
  render(){
    let { categoryStructure, /* [{name,children:[...]}] */
          useMedications, /* Set */
          rowHeight, height, width,
          ...rest} = this.props;
    let {memo} = this;
    if (memo.categoryStructure !== categoryStructure) {
      memo.categoryStructure = categoryStructure;
      memo.primaryColors_LUT = {};
      memo.primaryBitmaps_LUT = {};
      for (let i=0; i<categoryStructure.length; i++) {
        let name = categoryStructure[i]["name"];
        if (!memo.primaryBitmaps_LUT[name]) {
          memo.primaryBitmaps_LUT[name] = YAxisTwoLevelPanel.createPrimaryCategoryBitmap(name);
        }
        if (!memo.primaryColors_LUT[name]) {
          memo.primaryColors_LUT[name] = PRIMARY_COLOR_CYCLE[i%PRIMARY_COLOR_CYCLE.length];
        }
      }
      memo.secondaryBitmaps_LUT = {};
      for (let name of categoryStructure.map(({children})=>children).flat().map(({name})=>name) ) {
        if (!memo.secondaryBitmaps_LUT[name]) {
          memo.secondaryBitmaps_LUT[name] = YAxisTwoLevelPanel.createSecondaryCategoryBitmap(name);
        }
      }
    }

    let primaryBitmaps = [];
    let primaryStarts = [];
    let primaryEnds = [];
    let primaryColors = [];
    let secondaryBitmaps = [];
    let secondaryStarts = [];
    let secondaryEnds = [];
    let secondaryColors = [];
    
    for (let i=0,rowNum=0; i<categoryStructure.length; i++) {
      let {name:primary,children} = categoryStructure[i];
      let rowStart = rowNum;
      for (let secondary of children.map(({name})=>name)) {
        if (useMedications.has(secondary)) {
          secondaryBitmaps.push(memo.secondaryBitmaps_LUT[secondary]);
          secondaryStarts.push(rowNum*rowHeight);
          secondaryEnds.push((rowNum+1)*rowHeight);
          rowNum+=1;
          secondaryColors.push(SECONDARY_COLOR_CYCLE[rowNum%SECONDARY_COLOR_CYCLE.length]);
        }
      }
      if (rowNum !== rowStart) {
        primaryBitmaps.push(memo.primaryBitmaps_LUT[primary]);
        primaryStarts.push(rowStart*rowHeight);
        primaryEnds.push(rowNum*rowHeight);
        primaryColors.push(memo.primaryColors_LUT[primary]);
      }
    }
    
    return <YAxisTwoLevelPanel  primaryBitmaps={primaryBitmaps}
                                primaryStarts={primaryStarts}
                                primaryEnds={primaryEnds}
                                primaryColors={primaryColors}
                                secondaryBitmaps={secondaryBitmaps}
                                secondaryStarts={secondaryStarts}
                                secondaryEnds={secondaryEnds}
                                secondaryColors={secondaryColors}
                                height={height} width={width}
                                {...rest}
                                />
  }
}

export default MedicationRecordsDynamicYAxisTwoLevelPanel;
