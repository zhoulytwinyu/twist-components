import React, { PureComponent } from 'react';

const REDS = ["#000000",,"#110000","#220000","#330000",
              "#440000",,"#550000","#660000","#770000",
              "#880000",,"#990000","#aa0000","#bb0000",
              "#cc0000","#dd0000","#ee0000","#ff00000"
              ];

class MedicationRecordModifier extends PureComponent {
  constructor(props){
    super(props);
    this.memo = {};
  }

  render() {
    return null;
  }
  
  componentDidMount(){
    this.update();
  }

  componentDidUpdate(){
    this.update();
  }
  
  update() {
    let { minX,maxX,
          rowHeight,
          medicationRecords, /* [{name,start,end,dose,type,score}] */
          categoryStructure /* [ {name,children:[{name}]} ]*/
          } = this.props;
    let {memo} = this;

    if (memo.categoryStructure!==categoryStructure ||
        memo.medicationRecords!==medicationRecords) {
      if (memo.categoryStructure!==categoryStructure) {
        memo.categoryStructure = categoryStructure;
        memo.includeMedications = new Set(categoryStructure.map(({children})=>children)
                                                            .flat()
                                                            .map(({name})=>name)
                                          );
      }
      if (memo.medicationRecords!==medicationRecords) {
        memo.medicationRecords = medicationRecords;
      }
      memo.filteredMedicationRecords_ByName = {};
      for (let med of memo.includeMedications) {
        memo.filteredMedicationRecords_ByName[med] = medicationRecords.filter( ({name})=>med===name ).sort( (a,b)=> a.start-b.start );
      }
    }
    
    let filteredMedicationRecords = Object.values(memo.filteredMedicationRecords_ByName)
                                          .flat()
                                          .filter( ({start,end})=> !(start<minX || maxX<start) );
    let useMedications = new Set(filteredMedicationRecords.map( ({name})=>name ));
    let rowCount = categoryStructure.map(({children})=>children)
                                    .flat()
                                    .map(({name})=>name)
                                    .filter( (x)=>useMedications.has(x) )
                                    .length;
    let height = rowCount*rowHeight;
    
    this.handleUpdate(height,useMedications,filteredMedicationRecords);
  }

  handleUpdate(height,useMedications,modifiedMedicationRecords) {
    let { updateHandler} = this.props;
    updateHandler({height,useMedications,modifiedMedicationRecords});
  }

  getGroupedMedicationRecords(medicationRecords,categoryStructure) {
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
  }

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
      console.log(i,curRecords);
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

export default MedicationRecordModifier;
