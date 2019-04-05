import { Component } from 'react'
import {memoize_one} from "memoize"

class MedicationRecordsGroupingProvider extends Component {
  render(){
    let {medicationRecords,render} = this.props
    let groupedMedicationRecords = this.getGroupedMedicationRecords(medicationRecords)
    return (
      render(groupedMedicationRecords)
    )
  }
  
  getGroupedMedicationRecords = memoize_one((medicationRecords)=>{
    let grouped = []
    let MedicationRecordsByName = this.getMedicationRecordsByName(medicationRecords)
    for (let MRs of Object.values(MedicationRecordsByName)){
      let curGrouped = this.groupSingleMedicationRecords(MRs)
      grouped.push(...curGrouped)
    }
    return grouped
  })
  
  getMedicationRecordsByName(medicationRecords){
    let ret = {}
    for (let rec of medicationRecords){
      ret[rec.name] = ret[rec.name] || []
      ret[rec.name].push(rec)
    }
    return ret
  }
  
  groupSingleMedicationRecords(singleMedicationRecords) {
    let myMRs = singleMedicationRecords.sort(this.compareMedicationRecords)
                                        .map((item)=>({ ...item,
                                                        validFrom:-Infinity,
                                                        validTo:Infinity
                                                        }))
    // LUT for merged record
    let mergedMR = new Map()
    for (let MR of myMRs) {
      mergedMR.set(MR,null)
    }
    // Get sorted distances
    let distances = []
    for (let i=0; i<myMRs.length-1; i++) {
      let dist = myMRs[i+1].start-myMRs[i].end
      distances.push({index:i,distance:dist})
    }
    distances.sort((a,b)=>a.distance-b.distance)
    // Group records, from closest pair
    for (let {index,distance} of distances) {
      let obj1 = myMRs[index]
      let obj2 = myMRs[index+1]
      while (mergedMR.get(obj1)) {
        obj1 = mergedMR.get(obj1)
      }
      while (mergedMR.get(obj2)) {
        obj2 = mergedMR.get(obj2)
      }
      obj1.validTo = distance
      obj2.validTo = distance
      let newObj = this.mergeMedicationRecords(obj1,obj2)
      newObj.validFrom = distance
      newObj.validTo = Infinity
      mergedMR.set(obj1,newObj)
      mergedMR.set(obj2,newObj)
      mergedMR.set(newObj,null)
    }
    // Flatten mergedMR
    return mergedMR.keys()
  }
  
  compareMedicationRecords(obj1,obj2) {
  if (obj1.start !== obj2.start)
    return obj1.start-obj2.start
  else 
    return obj2.end-obj2.end
  }
  
  mergeMedicationRecords(obj1,obj2) {
    let newObj = {}
    newObj.start = Math.min(obj1.start,obj2.start)
    newObj.end = Math.max(obj1.end,obj2.end)
    newObj.name = obj1.name
    newObj.dose = obj1.dose+obj2.dose
    newObj.type = "merged"
    return newObj
  }
}

export default MedicationRecordsGroupingProvider
