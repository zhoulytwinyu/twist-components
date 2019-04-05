import React, { Component } from "react";
import {memoize_one} from "memoize";

class MedicationRecordsDynamicMedicationsProvider extends Component {
  render() {
    let { render,
          medicationRecords,categoryStructure,
          minX,maxX,
          rowHeight
          } = this.props;
    let medicationRecordsSubset = this.getMedicationRecordsSubset(categoryStructure,medicationRecords)
    let useMedications = this.getUseMedicationsInRange(medicationRecordsSubset,minX,maxX);
    let height = this.getRequiredHeight(useMedications,categoryStructure,rowHeight);
    return  (
      render(medicationRecordsSubset,useMedications,height)
    );
  }
  
  getMedicationRecordsSubset = memoize_one((categoryStructure,medicationRecords)=>{
    let allMedications = new Set(categoryStructure.map(({children})=>children)
                                                  .flat()
                                                  .map(({name})=>name)
                                  )
    return medicationRecords.filter( ({start,end,name})=>allMedications.has(name)
                                    );
  })
  
  getUseMedicationsInRange(medicationRecordsSubset,minX,maxX){
    let filteredMedicationRecords = medicationRecordsSubset.filter( ({start,end,name})=>
                                                                      minX<=start && maxX>=start
                                                                    )
    let useMedications = new Set(filteredMedicationRecords.map(({name})=>name));
    // Memoization: return same Set if possible.
    this.getMedicationRecordsInRange_memo = this.getMedicationRecordsInRange_memo || {};
    let memo = this.getMedicationRecordsInRange_memo;
    memo.useMedications = memo.useMedications || new Set();
    if (!this.setEqual(memo.useMedications,useMedications)) {
      memo.useMedications = useMedications;
    } 
    return memo.useMedications;
  }

  getRequiredHeight = memoize_one((useMedications,categoryStructure,rowHeight)=>{
    let rowNum = categoryStructure.map(({children})=>children)
                                  .flat()
                                  .map(({name})=>name)
                                  .filter(name=>useMedications.has(name))
                                  .length;
    let height =  rowNum*rowHeight;
    return height;
  });
  
  setEqual(set1,set2) {
    if (set1.size !== set2.size){
      return false;
    }
    for (let i of set1) {
      if (!set2.has(i)) {
        return false;
      }
    }
    return true;
  }
}

export default MedicationRecordsDynamicMedicationsProvider;
