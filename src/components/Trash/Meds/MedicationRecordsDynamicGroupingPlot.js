import React, { PureComponent } from 'react';
import {toDomXCoord_Linear} from "plot-utils";

class MedicationRecordsDynamicGroupedPlot extends PureComponent {
  constructor(props){
    super(props);
    this.memo = {};
    this.ref = React.createRef();
  }

  render() {
    let { medicationRecords,
          categoryStructure,
          useMedications,
          rowHeight,
          minX,maxX,
          width,height,
          ...rest
          } = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} {...rest}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let { medicationRecords,
          categoryStructure,
          useMedications,
          rowHeight,
          minX,maxX,
          width,height,
          } = this.props;
    let {memo} = this;
    if (memo.medicationRecords !== medicationRecords) {
      memo.medicationRecords = medicationRecords;
      memo.doseBitmaps_LUT = {};
      for (let dose of medicationRecords.map( ({dose})=>dose ) ){
        if (!memo.doseBitmaps_LUT[dose]) {
          memo.doseBitmaps_LUT[dose] = this.createTextBitmap(Number.parseFloat(dose).toPrecision(2));
        }
      }
    }
    // Filter
    let filteredMedicationRecords = medicationRecords.filter( ({start,end,validFrom,validTo}) =>
                                                                    ( !(start>maxX || end<minX) &&
                                                                      (maxX-minX) >= validFrom &&
                                                                      (maxX-minX) < validTo
                                                                      )
                                                              );
    // Get position
    let rowPosition_LUT = this.getPositionLUT(categoryStructure,useMedications);
    // Coord conv
    let r = rowHeight*0.9/2 ;
    let startXs =[];
    let endXs = [];
    let Ys = [];
    let types = [];
    let doseBitmaps = [];
    for (let row of filteredMedicationRecords) {
      let {name,start,end,type,dose} = row;
      let startX = toDomXCoord_Linear(width,minX,maxX,start);
      let endX = toDomXCoord_Linear(width,minX,maxX,end);
      let doseBitmap = memo.doseBitmaps_LUT[dose];
      for (let rowNum of rowPosition_LUT[name]) {
        let Y = rowHeight*(rowNum+0.5);
        startXs.push(startX);
        endXs.push(endX);
        Ys.push(Y);
        doseBitmaps.push(doseBitmap);
        types.push(type);
      }
    }
    // Draw
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    for (let i=0; i<startXs.length; i++){
      let startX = startXs[i];
      let endX = endXs[i];
      let Y = Ys[i];
      let doseBitmap = doseBitmaps[i];
      let type = types[i];
      this.drawCircle(ctx,startX,Y,r,'lightgreen');
      this.drawRectangle(ctx,startX+10,endX-10,Y-r,r,'lightgreen');
      ctx.drawImage(doseBitmap,startX-doseBitmap.width/2,Y-doseBitmap.height/2);
    }
  }
  
  createTextBitmap(text){
    let font = "bold 10ps Sans";
    let fillStyle = "lightgrey";
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    let width = ctx.measureText(text).width;
    let height = 10;
    canvas.height = height;
    canvas.width = width;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text,width/2,height/2);
    return canvas;
  }

  getPositionLUT(categoryStructure,useMedications) {
    let medicationsInOrder = categoryStructure.map( ({children})=>children )
                                              .flat()
                                              .map( ({name})=>name )
                                              .filter( (name)=>useMedications.has(name) )
                                              ;
    let LUT = {};
    for (let i=0; i<medicationsInOrder.length; i++) {
      let med = medicationsInOrder[i];
      LUT[med] = LUT[med] || [];
      LUT[med].push(i);
    }
    return LUT;
  }

  drawCenteredBitmap(ctx,bitmap,x,y){
    x = Math.round(x-bitmap.width/2);
    y = Math.round(y-bitmap.height/2);
    ctx.drawImage(bitmap,x,y);
  }
  
  drawCircle(ctx,x,y,r,color) {
    x = Math.round(x);
    y = Math.round(y);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  drawSquare(ctx,x,y,r,color) {
    //~ let x = Math.round(x-r);
    //~ y = Math.round();
    //~ let endX = Math.round();
    //~ let h = Math.round(x-Math.round);
    //~ ctx.fillStyle = color;
    //~ ctx.strokeStyle = "black";
    //~ x = Math.round(x-h/2);
    //~ y = Math.round(y-h/2);
    //~ ctx.fillRect(x,y,h,h);
    //~ ctx.strokeRect(x,y,h,h);
  }
  
  drawRectangle(ctx,startX,endX,y,r,color) {
    let startY = y-r;
    let endY = y+r;
    y = Math.round(y);
    let h = Math.round(endY)-Math.round(startY);
    let x = Math.round(startX);
    let w = Math.round(endX) - x;
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.fillRect(x,y,w,h);
    ctx.strokeRect(x,y,w,h);
  }

  drawOctagon(ctx,x,y,r,color) {
    let x0,x1,x2,x3;
    let y0,y1,y2,y3;
    x0 = Math.round(x-r);
    x1 = Math.round(x-r/2);
    x2 = Math.round(x+r/2);
    x3 = Math.round(x+r);
    y0 = Math.round(y-r);
    y1 = Math.round(y-r/2);
    y2 = Math.round(y+r/2);
    y3 = Math.round(y+r);
    ctx.beginPath();
    ctx.moveTo(x0,y1);
    ctx.lineTo(x1,y0);
    ctx.lineTo(x2,y0);
    ctx.lineTo(x3,y1);
    ctx.lineTo(x3,y2);
    ctx.lineTo(x2,y3);
    ctx.lineTo(x1,y3);
    ctx.LineTo(x0,y2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "grey";
    ctx.stroke();
    ctx.fill();
  }

  drawLongOctagon(ctx,startX,endX,y,r,color) {
    let x0,x1,x2,x3;
    let y0,y1,y2,y3;
    x0 = Math.round(startX);
    x1 = Math.round(startX+r/2);
    x2 = Math.round(endX-r/2);
    x3 = Math.round(endX);
    y0 = Math.round(y-r);
    y1 = Math.round(y-r/2);
    y2 = Math.round(y+r/2);
    y3 = Math.round(y+r);
    ctx.beginPath();
    ctx.moveTo(x0,y1);
    ctx.lineTo(x1,y0);
    ctx.lineTo(x2,y0);
    ctx.lineTo(x3,y1);
    ctx.lineTo(x3,y2);
    ctx.lineTo(x2,y3);
    ctx.lineTo(x1,y3);
    ctx.LineTo(x0,y2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "grey";
    ctx.stroke();
    ctx.fill();
  }
}

export default MedicationRecordsDynamicGroupedPlot;
