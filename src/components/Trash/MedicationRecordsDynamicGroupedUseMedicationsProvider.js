import React, { Component } from 'react';

class MedicationRecordsDynamicGroupedUseMedicationsProvider extends Component {
  render() {
    let { render,
          medicationRecords,categoryStructure,
          minX,maxX,
          rowHeight} = this.props;
    let useMedications_And_Height = this.getUseMedicationsAndHeight(medicationRecords,categoryStructure,minX,maxX,rowHeight);
    return  (
      render(useMedications_And_Height)
    );
  }

  getUseMedicationsAndHeight(medicationRecords,categoryStructure,minX,maxX,rowHeight){
    let {memo} = this;
    if (memo.medicationRecords!==medicationRecords ||
        memo.categoryStructure!==categoryStructure ||
        memo.minX!==minX ||
        memo.maxX!==maxX ||
        rowHeight!==rowHeight) {
      let filteredMedicationRecords = medicationRecords.filter( ({start,end,validFrom,validTo}) =>
                                                                                ( !(end<minX || start>maxX) &&
                                                                                  maxX-minX<validTo &&
                                                                                  maxX-minX>=validFrom
                                                                                  )
                                                                );
      let useMedications = new Set(filteredMedicationRecords.map(({name})=>name));
      if (!memo.useMedications || !this.setEqual(memo.useMedications,useMedications)){
        memo.useMedications=useMedications;
        let rowNum = categoryStructure.map(({children})=>children)
                                      .flat()
                                      .map(({name})=>name)
                                      .filter(name=>useMedications.has(name))
                                      .length;
        let height =  rowNum*rowHeight;
        memo.useMedications_And_Height = {useMedications,height};
      }
    }
    return memo.useMedications_And_Height;
  }
  
  getUseMedications
  
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

export default MedicationRecordsDynamicGroupedUseMedicationsProvider;
