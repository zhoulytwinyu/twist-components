import React, { PureComponent } from 'react'
import {toDomXCoord_Linear} from "plot-utils"
import MedicationRecordObject from "./MedicationRecordObject"

class MedicationRecordsDynamicPlot extends PureComponent {
  constructor(props){
    super(props)
    this.memo = {}
    this.ref = React.createRef()
  }

  render() {
    let { width,height } = this.props
    return (
      <canvas ref={this.ref} width={width} height={height} style={{display:"block",width:width,height:height}}></canvas>
    )
  }

  componentDidMount(){
    this.draw()
  }
  
  componentDidUpdate(){
    this.draw()
  }
  
  draw() {
    let { medicationRecords,
          categoryStructure,
          useMedications,
          rowHeight,
          minX,maxX,
          width,height,
          } = this.props
    let {memo} = this
    if (memo.medicationRecords !== medicationRecords) {
      memo.medicationRecords = medicationRecords
      memo.medicationRecordsObjects = medicationRecords.map(obj=>new MedicationRecordObject(obj))
    }
    if (memo.categoryStructure!==categoryStructure ||
        memo.useMedications!==useMedications) {
      memo.categoryStructure=categoryStructure
      memo.useMedications=useMedications
      memo.startDomYLUT = {}
      let i=0
      for ( let med of categoryStructure.map(({children})=> children)
                                        .flat()
                                        .map(({name})=>name) ) {
        if (useMedications.has(med)) {
          memo.startDomYLUT[med] = i
          i++
        }
      }
    }
    // Plot
    let canvas = this.ref.current
    let ctx = canvas.getContext("2d")
    let mergeCutoff = (maxX-minX)/20
    ctx.clearRect(0,0,width,height)
    for (let MR of memo.medicationRecordsObjects) {
      if (maxX<MR.start || MR.end<minX ||
          mergeCutoff<=MR.validFrom || MR.validTo<=mergeCutoff) {
        continue
      }
      let startDomX = toDomXCoord_Linear(width,minX,maxX,MR.start)
      let endDomX = toDomXCoord_Linear(width,minX,maxX,MR.end)
      let startDomY = memo.startDomYLUT[MR.name]*rowHeight
      MR.draw(ctx,width,height,startDomX,endDomX,startDomY,rowHeight)
    }
  }
}

export default MedicationRecordsDynamicPlot
