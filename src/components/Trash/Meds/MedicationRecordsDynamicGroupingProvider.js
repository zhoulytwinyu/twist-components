import React, { PureComponent } from "react"
import {memoize_one} from "memoize"

class MedicationRecordsDynamicGroupingProvider extends PureComponent {
  render() {
    let { render,
          medicationRecords,categoryStructure,
          minX,maxX,
          rowHeight
          } = this.props
    let groupedMedicationRecords = this.getGroupedMedicationRecords(medicationRecords,categoryStructure,)
    let useMedications = this.getUseMedicationsInRange(groupedMedicationRecords,minX,maxX)
    let height = this.getRequiredHeight(useMedications,categoryStructure,rowHeight)
    return  (
      render(groupedMedicationRecords,useMedications,height)
    )
  }

  getGroupedMedicationRecords = memoize_one((medicationRecords,categoryStructure)=>{
    let includeMedications = new Set(categoryStructure.map(({children})=>children)
                                                      .flat()
                                                      .map(({name})=>name)
                                    )
    let medicationRecords_Filtered_ByName = {}
    for (let med of includeMedications){
      medicationRecords_Filtered_ByName[med] = medicationRecords.filter( ({name})=>med===name )
                                                                .sort( (a,b)=> a.start-b.start )
    }
    let medicationRecords_FilteredGrouped_ByName = {}
    for (let med of includeMedications) {
      medicationRecords_FilteredGrouped_ByName[med] = this.getGroupedMedicationRecords_helper(medicationRecords_Filtered_ByName[med])
    }
    let medicationRecords_FilteredGrouped = Object.values(medicationRecords_FilteredGrouped_ByName)
                                                  .flat()
                                                  .sort( (a,b)=> {let diffStart = a.start-b.start
                                                                  if (diffStart!==0) {
                                                                    return diffStart
                                                                  }
                                                                  else return a.end-b.end
                                                                  })
    return medicationRecords_FilteredGrouped
  })

  getGroupedMedicationRecords_helper(records,groupRange) {
    if (records.length===0) {
      return []
    }
    // Heuristics, only calculate grouping at 64 scales.
    let retRecords=[]
    let visibleRange
    let prevRecord
    let prevRecordType
    let curRecord
    let curRecordType
    let nextRecords
    let curRecords = records.map( (record)=>({...record,
                                              end:record.end || record.start,
                                              validFrom:0,
                                              validTo:Infinity})
                                              )
    for (let i=0; i<64; i++) {
      if (curRecords.length===1) {
        let lastRecord = curRecords[0]
        retRecords.push(lastRecord)
        break
      }
      visibleRange = Math.pow(2,i)
      prevRecord = curRecords[0]
      prevRecordType = this.getRecordType(prevRecord,visibleRange)
      nextRecords = []
      for (let j=1; j<curRecords.length; j++){
        curRecord = curRecords[j]
        curRecordType = this.getRecordType(curRecord)
        if (this.needMerge(prevRecord,prevRecordType,curRecord,curRecordType,groupRange)){
          let mergedRecord = {...prevRecord,
                              ...curRecord,
                              start: Math.min(prevRecord["start"],curRecord["start"]),
                              end: Math.max(prevRecord["end"],curRecord["end"]),
                              dose: prevRecord["dose"]+curRecord["dose"],
                              validFrom:visibleRange,
                              validTo:Infinity}
          prevRecord["validTo"] = visibleRange
          curRecord["validTo"] = visibleRange
          retRecords.push(prevRecord,curRecord)
          prevRecord = mergedRecord
        }
        else {
          nextRecords.push(prevRecord)
        }
        prevRecord = curRecord
        prevRecordType = curRecordType
      }
      nextRecords.push(prevRecord)
      curRecords = nextRecords
    }
    return retRecords
  }

  getRecordType(record,visibleRange) {
    let cutoff = visibleRange/20
    if (record.end-record.start<cutoff) {
      return "point"
    }
    else {
      return "range"
    }
  }

  needMerge(prevRecord,prevRecordType,curRecord,curRecordType,groupRange) {
    let ret = false
    if (curRecordType==="point" && prevRecordType==="point") {
      if (curRecord["start"]-prevRecord["end"] < groupRange) {
        ret = true
      }
    }
    else if (curRecordType==="point" && prevRecordType==="point"){
      if (curRecord["start"]-prevRecord["end"] < groupRange) {
        ret = true
      }
    }
    else {
      if (curRecord["start"]-prevRecord["end"] < groupRange) {
        ret = true
      }
    }
    return ret
  }

  getUseMedicationsInRange(medicationRecords,minX,maxX){
    let filteredMedicationRecords = medicationRecords.filter( ({start,end,validFrom,validTo}) =>
                                                                          ( !(end<minX || start>maxX) &&
                                                                            maxX-minX<validTo &&
                                                                            maxX-minX>=validFrom
                                                                            )
                                                          )
    let useMedications = new Set(filteredMedicationRecords.map(({name})=>name))
    // Memoization: return same Set if possible.
    this.getMedicationRecordsInRange_memo = this.getMedicationRecordsInRange_memo || {}
    let memo = this.getMedicationRecordsInRange_memo
    memo.useMedications = memo.useMedications || new Set()
    if (!this.setEqual(memo.useMedications,useMedications)) {
      memo.useMedications = useMedications
    } 
    return memo.useMedications
  }

  getRequiredHeight = memoize_one((useMedications,categoryStructure,rowHeight)=>{
    let rowNum = categoryStructure.map(({children})=>children)
                                  .flat()
                                  .map(({name})=>name)
                                  .filter(name=>useMedications.has(name))
                                  .length
    let height =  rowNum*rowHeight
    return height
  })
  
  setEqual(set1,set2) {
    if (set1.size !== set2.size){
      return false
    }
    for (let i of set1) {
      if (!set2.has(i)) {
        return false
      }
    }
    return true
  }
}

export default MedicationRecordsDynamicGroupingProvider
