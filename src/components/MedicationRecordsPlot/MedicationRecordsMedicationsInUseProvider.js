import { Component } from 'react'
import {memoize_one} from "memoize"

class MedicationRecordsMedicationsInUseProvider extends Component {
  render(){
    let {render,minX,maxX,medicationRecords} = this.props
    let medicationsInUse = this.getMedicationsInUse(medicationRecords,minX,maxX)
    return (
      render(medicationsInUse)
    )
  }
  
  getMedicationsInUse = memoize_one((medicationRecords,minX,maxX)=>{
    let medicationsInUse = medicationRecords.filter( ({start,end})=>!(end<minX || maxX<start) )
                                          .map( ({name})=>name )
    medicationsInUse = new Set(medicationsInUse)
    // Memoization: return same Set if possible.
    this.getMedicationsInUse_memo = this.getMedicationsInUse_memo || {}
    let memo = this.getMedicationsInUse_memo
    memo.medicationsInUse = memo.medicationsInUse || new Set()
    if (!this.setEqual(memo.medicationsInUse,medicationsInUse)) {
      memo.medicationsInUse = medicationsInUse
    } 
    return memo.medicationsInUse
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

export default MedicationRecordsMedicationsInUseProvider
