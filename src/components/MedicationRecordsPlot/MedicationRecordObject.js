const POINT_CUTOFF = 20;

class MedicationRecordObject {
  constructor({name,start,dose,end,type,validFrom,validTo}) {
    this.name = name
    this.start = start
    this.end = end || start
    this.dose = dose
    this.type = type // "iv","po","merged"
    this.validFrom = validFrom
    this.validTo = validTo
  }
  
  draw(ctx,width,height,startDomX,endDomX,startDomY,rowHeight){
    // Draw as pointstartDomX
    
    if (endDomX-startDomX<POINT_CUTOFF) {
      let centerDomX = (endDomX+startDomX)/2
      switch (this.type) {
        case "po":
          this.drawCircle(ctx,centerDomX,startDomY,rowHeight)
          this.drawPointDoseLabel(ctx,centerDomX,startDomY,rowHeight)
          break
        case "iv":
          this.drawSquare(ctx,centerDomX,startDomY,rowHeight)
          this.drawPointDoseLabel(ctx,centerDomX,startDomY,rowHeight)
          break
        case "merged":
        default:
          this.drawOctagon(ctx,centerDomX,startDomY,rowHeight)
          this.drawPointDoseLabel(ctx,centerDomX,startDomY,rowHeight)
          break
      }
    }
    else {
      switch (this.type){
        case "iv":
          this.drawRectangle(ctx,width,height,startDomX,endDomX,startDomY,rowHeight)
          this.drawRangeDoseLabel(ctx,width,height,startDomX,endDomX,startDomY,rowHeight)
          break
        case "merged":
        default:
          this.drawLongOctagon(ctx,startDomX,endDomX,startDomY,rowHeight)
          this.drawRangeDoseLabel(ctx,width,height,startDomX,endDomX,startDomY,rowHeight)
      }
    }
  }
  
  drawPointDoseLabel(ctx,centerDomX,startDomY,rowHeight) {
    let labelBitmap = this.getDoseLabelBitmap()
    let labelStartDomX = Math.round(centerDomX-labelBitmap.width/2)
    let labelStartDomY = Math.round(startDomY+rowHeight/2-labelBitmap.height/2)
    ctx.drawImage(labelBitmap,labelStartDomX,labelStartDomY)
  }
  
  drawRangeDoseLabel(ctx,width,height,startDomX,endDomX,startDomY,rowHeight) {
    let labelBitmap = this.getDoseLabelBitmap()
    let labelStartDomX = Math.max(0,startDomX)+5
    let labelStartDomY = Math.round(startDomY+rowHeight/4-labelBitmap.height/2)
    ctx.drawImage(labelBitmap,labelStartDomX,labelStartDomY)
  }
  
  getDoseLabelBitmap(){
    if (!this.doseLabelBitmap) {
      let text = Number.parseFloat(this.dose).toPrecision(2)
      let font = "10px MuseoSans, Sans"
      let canvas = document.createElement("canvas")
      let ctx = canvas.getContext("2d")
      ctx.font = font
      let height = 10
      let width = ctx.measureText(text).width
      canvas.height = height
      canvas.width = width
      ctx.font = font
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text,width/2,height/2)
      this.doseLabelBitmap = canvas
    }
    return this.doseLabelBitmap
  }
  
  drawCircle(ctx,centerDomX,startDomY,rowHeight) {
    let color = "pink"
    let height = rowHeight*0.9
    let radius = Math.round(height/2)
    centerDomX = Math.round(centerDomX)
    let centerDomY = Math.round(startDomY+rowHeight/2)
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.lineWidth = 1
    ctx.strokeStyle = "lightgrey"
    ctx.arc(centerDomX,centerDomY,radius,0,2*Math.PI)
    ctx.fill()
    ctx.stroke()
  }
  
  //~ drawCircleHitbox(ctx,x,y,h){
    //~ let diameter = Math.round(h*0.9)
    //~ let centerDomX = Math.round(x)
    //~ let centerDomY = Math.round(y+h/2)
    //~ ctx.arc(centerDomX,centerDomY,diameter,0,2*Math.PI)
    //~ ctx.fill()
  //~ }
  
  drawSquare(ctx,centerDomX,startDomY,rowHeight) {
    let color = "red"
    let height = Math.round(rowHeight*0.9)
    let startDomX = Math.round(centerDomX-height/2)
    startDomY = Math.round(startDomY+rowHeight/2-height/2)
    ctx.fillStyle = color
    ctx.lineWidth = 1
    ctx.strokeStyle = "lightgrey"
    ctx.fillRect(startDomX,startDomY,height,height)
    ctx.strokeRect(startDomX,startDomY,height,height)
  }
  
  //~ drawSquareHitbox(ctx,x,y,h){
    //~ let squareWidth = Math.round(h*0.9)
    //~ let startDomX = Math.round(x-squareWidth/2)
    //~ let startDomY = Math.round(y+h/2-squareWidth/2)
    //~ ctx.fillRect(startDomX,startDomY,squareWidth,squareWidth)
  //~ }
  
  drawOctagon(ctx,centerDomX,startDomY,rowHeight) {
    let color = "red"
    let height = rowHeight*0.9
    let x0 = Math.round(centerDomX-height/2)
    let x1 = Math.round(centerDomX-height/4)
    let x2 = Math.round(centerDomX+height/4)
    let x3 = Math.round(centerDomX+height/2)
    let centerDomY = startDomY+rowHeight/2
    let y0 = Math.round(centerDomY-height/2)
    let y1 = Math.round(centerDomY-height/4)
    let y2 = Math.round(centerDomY+height/4)
    let y3 = Math.round(centerDomY+height/2)
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.lineWidth = 1
    ctx.strokeStyle = "lightgrey"
    ctx.moveTo(x0,y1)
    ctx.lineTo(x1,y0)
    ctx.lineTo(x2,y0)
    ctx.lineTo(x3,y1)
    ctx.lineTo(x3,y2)
    ctx.lineTo(x2,y3)
    ctx.lineTo(x1,y3)
    ctx.lineTo(x0,y2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  
  //~ drawOctagonHitbox(ctx,x,y,h){
    //~ let diameter = Math.round(h*0.9)
    //~ let x0 = Math.round(x-diameter/2)
    //~ let x1 = Math.round(x-diameter/4)
    //~ let x2 = Math.round(x+diameter/4)
    //~ let x3 = Math.round(x+diameter/2)
    //~ let y0 = Math.round(y+h/2-diameter/2)
    //~ let y1 = Math.round(y+h/2-diameter/4)
    //~ let y2 = Math.round(y+h/2+diameter/4)
    //~ let y3 = Math.round(y+h/2+diameter/2)
    //~ ctx.beginPath()
    //~ ctx.moveTo(x0,y1)
    //~ ctx.lineTo(x1,y0)
    //~ ctx.lineTo(x2,y0)
    //~ ctx.lineTo(x3,y1)
    //~ ctx.lineTo(x3,y2)
    //~ ctx.lineTo(x2,y3)
    //~ ctx.lineTo(x1,y3)
    //~ ctx.lineTo(x0,y2)
    //~ ctx.closePath()
    //~ ctx.fill()
  //~ }
  
  drawRectangle(ctx,startDomX,endDomX,startDomY,rowHeight){
    let color = "yellow"
    let height = Math.round(rowHeight*0.45)
    startDomX = Math.round(startDomX)
    let width = Math.round(endDomX) - startDomX
    startDomY = Math.round(startDomY+0.05*rowHeight)
    ctx.fillStyle = color
    ctx.lineWidth = 1
    ctx.strokeStyle = "lightgrey"
    ctx.fillRect(startDomX,startDomY,width,height)
    ctx.strokeRect(startDomX,startDomY,width,height)
  }
  
  //~ drawRectangleHitbox(ctx,startX,endX,h){
    //~ let height = Math.round(h*0.9)
    //~ let startDomX = Math.round(startX)
    //~ let width = Math.round(endX) - startX
    //~ let startDomY = Math.round(y+h/2-squareWidth/2)
    //~ ctx.fillRect(startDomX,startDomY,width,height)
  //~ }
  
  drawLongOctagon(ctx,startDomX,endDomX,startDomY,rowHeight){
    let color = "orange"
    let height = rowHeight*0.45
    let x0 = Math.round(startDomX)
    let x1 = Math.round(startDomX+height/2)
    let x2 = Math.round(endDomX-height/2)
    let x3 = Math.round(endDomX)
    let centerDomY = startDomY+rowHeight/4
    let y0 = Math.round(centerDomY-height/2)
    let y1 = Math.round(centerDomY-height/4)
    let y2 = Math.round(centerDomY+height/4)
    let y3 = Math.round(centerDomY+height/2)
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.lineWidth = 1
    ctx.strokeStyle = "lightgrey"
    ctx.moveTo(x0,y1)
    ctx.lineTo(x1,y0)
    ctx.lineTo(x2,y0)
    ctx.lineTo(x3,y1)
    ctx.lineTo(x3,y2)
    ctx.lineTo(x2,y3)
    ctx.lineTo(x1,y3)
    ctx.lineTo(x0,y2)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  
  //~ drawLongOctagonHitbox(ctx,startX,endX,h,r){
    //~ let height = Math.round(h*0.9)
    //~ let x0 = Math.round(startX)
    //~ let x1 = Math.round(startX+diameter/4)
    //~ let x2 = Math.round(endX-diameter/4)
    //~ let x3 = Math.round(endX)
    //~ let y0 = Math.round(y+h/2-height/2)
    //~ let y1 = Math.round(y+h/2-height/4)
    //~ let y2 = Math.round(y+h/2+height/4)
    //~ let y3 = Math.round(y+h/2+height/2)
    //~ ctx.beginPath()
    //~ ctx.moveTo(x0,y1)
    //~ ctx.lineTo(x1,y0)
    //~ ctx.lineTo(x2,y0)
    //~ ctx.lineTo(x3,y1)
    //~ ctx.lineTo(x3,y2)
    //~ ctx.lineTo(x2,y3)
    //~ ctx.lineTo(x1,y3)
    //~ ctx.lineTo(x0,y2)
    //~ ctx.closePath()
    //~ ctx.fill()
  //~ }
}

export default MedicationRecordObject
