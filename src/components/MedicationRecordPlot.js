import React, { PureComponent } from 'react';
import {toDomXCoord_Linear} from "plot-utils";

const SHAPE_LUT={"iv":"square","po":"circle","cont":"rectangle"};

class MedicationRecordPlot extends PureComponent {
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
      memo.names = medicationRecords.map( ({name})=>name );
      memo.shapes = medicationRecords.map( ({type})=>["circle","square"][Math.floor(Math.random()*2)] );
      //memo.colors = medicationRecords.map( ({score})=>this.assignColorFromScore(score) );
      memo.doses = medicationRecords.map( (dose)=>dose );
      memo.starts = medicationRecords.map( ({start})=>start );
      //memo.ends = medicationRecords.map( ({end})=>end );
    }
    if (memo.categoryStructure !== categoryStructure ||
        memo.useMedications !== useMedications) {
      memo.categoryStructure = categoryStructure;
      memo.useMedications = useMedications;
      memo.medicationPosition_LUT = {};
      let rowNum = 0;
      for (let med of categoryStructure.map(({children})=>children)
                                        .flat()
                                        .map(({name})=>name) ){
        if (useMedications.has(med)) {
          memo.medicationPosition_LUT[med] = memo.medicationPosition_LUT[med] || [];
          memo.medicationPosition_LUT[med] = rowNum;
          rowNum ++;
        }
      }
    }
    // Coordinate convert
    let shapes = memo.shapes;
    let startXs = memo.starts.map((x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let endXs = memo.starts.map((x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let startYs = memo.names.map((n)=>memo.medicationPosition_LUT[n]*rowHeight);
    let endYs = memo.names.map((n)=>(memo.medicationPosition_LUT[n]+1)*rowHeight);
    
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    // Draw 
    for (let i=0; i<startXs.length; i++) {
      //~ let bitmap = bitmaps[i];
      //~ let color = colors[i];
      let color= "lightgrey";
      let shape = shapes[i];
      let startX = startXs[i];
      let endX = endXs[i];
      let startY = startYs[i];
      let endY = endYs[i];
      switch (shape) {
        case "circle":
          this.drawCircle(ctx,startX,endX,startY,endY,color);
          break;
        case "square":
          this.drawSquare(ctx,startX,endX,startY,endY,color);
          break;
        case "rectangle":
          this.drawRectangle(ctx,startX,endX,startY,endY,color);
          break;
      }
    }
  }

  drawCircle(ctx,startX,endX,startY,endY,color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    let x = Math.round((startX+endX)/2);
    let y = Math.round((startY+endY)/2);
    let r = Math.round((endY-startY)*0.45);
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  drawSquare(ctx,startX,endX,startY,endY,color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    let x = (startX+endX)/2;
    let y = (startY+endY)/2;
    let h = Math.round((endY-startY)*0.9);
    x = Math.round(x-h/2);
    y = Math.round(y-h/2);
    ctx.fillRect(x,y,h,h);
    ctx.strokeRect(x,y,h,h);
  }
  
  drawRectangle(ctx,startX,endX,startY,endY,color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    let y = Math.round(startY);
    let h = Math.round(endY) - y;
    let x = Math.round(startX);
    let w = Math.round(endX) - x;
    ctx.fillRect(x,y,w,h);
    ctx.strokeRect(x,y,w,h);
  }
}

export default MedicationRecordPlot;
