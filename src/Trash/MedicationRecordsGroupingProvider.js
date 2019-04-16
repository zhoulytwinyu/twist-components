import React, { Component } from "react";
import {memoize_one} from "memoize";

class MedicationRecordsGroupingProvider extends Component {
  render() {
    let {render,medicationRecords,categoryStructure} = this.props;
    let groupedMedicationRecords = this.getGroupedMedicationRecords(medicationRecords,categoryStructure);
    return  (
      render(groupedMedicationRecords)
    );
  }

  getGroupedMedicationRecords = memoize_one((medicationRecords,categoryStructure)=>{
    let includeMedications = new Set(categoryStructure.map(({children})=>children)
                                                      .flat()
                                                      .map(({name})=>name)
                                    );
    let medicationRecords_Filtered_ByName = {};
    for (let med of includeMedications){
      medicationRecords_Filtered_ByName[med] = medicationRecords.filter( ({name})=>med===name )
                                                                .sort( (a,b)=> a.start-b.start );
    }
    let medicationRecords_FilteredGrouped_ByName = {};
    for (let med of includeMedications) {
      medicationRecords_FilteredGrouped_ByName[med] = this.getGroupedMedicationRecords_helper(medicationRecords_Filtered_ByName[med]);
    }
    let medicationRecords_FilteredGrouped = Object.values(medicationRecords_FilteredGrouped_ByName)
                                                  .flat()
                                                  .sort( (a,b)=> {let diffStart = a.start-b.start;
                                                                  if (diffStart!==0) {
                                                                    return diffStart;
                                                                  }
                                                                  else return a.end-b.end;
                                                                  })
    return medicationRecords_FilteredGrouped;
  });

  getGroupedMedicationRecords_helper(records) {
    if (records.length===0) {
      return [];
    }
    // Heuristics, only calculate grouping at 64 scales.
    let retRecords=[];
    let visibleRange, pointGroupRange,rangeGroupRange;
    let prevRecord;
    let prevRecordType;
    let curRecord;
    let curRecordType;
    let nextRecords;
    let curRecords = records.map( (record)=>({...record,
                                              end:record.end || record.start,
                                              validFrom:0,
                                              validTo:Infinity})
                                              );
    for (let i=0; i<64; i++) {
      if (curRecords.length===1) {
        let lastRecord = curRecords[0];
        retRecords.push(lastRecord);
        break;
      }
      visibleRange = Math.pow(2,i);
      pointGroupRange = visibleRange/20;
      rangeGroupRange = visibleRange/40;
      prevRecord = curRecords[0];
      prevRecordType = this.getRecordType(prevRecord,visibleRange);
      nextRecords = [];
      for (let j=1; j<curRecords.length; j++){
        curRecord = curRecords[j];
        curRecordType = this.getRecordType(curRecord);
        if (this.needMerge(prevRecord,prevRecordType,curRecord,curRecordType,pointGroupRange,rangeGroupRange)){
          let mergedRecord = {...prevRecord,
                              ...curRecord,
                              start: Math.min(prevRecord["start"],curRecord["start"]),
                              end: Math.max(prevRecord["end"],curRecord["end"]),
                              dose: prevRecord["dose"]+curRecord["dose"],
                              validFrom:visibleRange,
                              validTo:Infinity};
          prevRecord["validTo"] = visibleRange;
          curRecord["validTo"] = visibleRange;
          retRecords.push(prevRecord,curRecord);
          prevRecord = mergedRecord;
        }
        else {
          nextRecords.push(prevRecord);
        }
        prevRecord = curRecord;
        prevRecordType = curRecordType;
      }
      nextRecords.push(prevRecord);
      curRecords = nextRecords;
    }
    return retRecords;
  }

  getRecordType(record,visibleRange) {
    let cutoff = visibleRange/20;
    if (record.end-record.start<cutoff) {
      return "point";
    }
    else {
      return "range";
    }
  }

  needMerge(prevRecord,prevRecordType,curRecord,curRecordType,pointGroupRange,rangeGroupRange) {
    let ret = false;
    if (curRecordType==="point" && prevRecordType==="point") {
      if (curRecord["start"]-prevRecord["end"] < pointGroupRange) {
        ret = true;
      }
    }
    else if (curRecordType==="point" && prevRecordType==="point"){
      if (curRecord["start"]-prevRecord["end"] < pointGroupRange) {
        ret = true;
      }
    }
    else {
      if (curRecord["start"]-prevRecord["end"] < (pointGroupRange+rangeGroupRange)/2) {
        ret = true;
      }
    }
    return ret;
  }
}

export default MedicationRecordsGroupingProvider;
