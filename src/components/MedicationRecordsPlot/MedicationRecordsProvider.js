import { Component } from 'react'
import {memoize_one} from "memoize"

class MedicationRecordsProvider extends Component {
  render(){
    let {medicationRecords,categoryStructure,render} = this.props
    let requiredMedicationRecords = this.getRequiredMedicationRecords(medicationRecords,categoryStructure)
    return (
      render(requiredMedicationRecords)
    )
  }
  
  getRequiredMedicationRecords = memoize_one((medicationRecords,categoryStructure)=>{
    let requiredMedications = categoryStructure.map( ({children})=>children )
                                               .flat()
                                               .map(({name})=>name)
    requiredMedications = new Set(requiredMedications)
    return medicationRecords.filter((item)=>requiredMedications.has(item.name))
                            .map((item)=>({ end:item.end|| item.start,
                                            ...item
                                          })
                                  )
  })
}

export default MedicationRecordsProvider
