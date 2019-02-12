import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomXCoord_Linear,
        toDomCoord_Categorical,
        scatterPlot,
        labelPlot} from "plot-utils";

class MedicationRecord extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { minX,maxX,width,
          height,rowHeight,
          category, /* [{name,start,end,bgStyle,textStyle,textPosition,textRotation}] */
          data, /* [{name,start,end,dose,route,score}] */
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
    let { minX,maxX,width,
          height,rowHeight,
          category,
          data} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    let medPosLUT = this.getMedPosLUT(category);
    // Draw 
    let domX = data.map( ({start,end})=>this.toDomXCoord((start+end)/2) );
    let domY = data.map( ({name})=>this.toDomYCoord(name,medPosLUT,"middle") );
    let dose = data.map( ({dose})=>dose);
    scatterPlot(canvas,domX,domY,{shape:"dot",radius:rowHeight/2-2,fillStyle:"red"});
    scatterPlot(canvas,domX,domY,{shape:"dot",radius:rowHeight/2-2,fillStyle:"red"});
    labelPlot(canvas,domX,domY,dose,"center","middle",0);
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
  
  toDomYCoord(med,medPosLUT,type) {
    let {rowHeight} = this.props;
    return toDomCoord_Categorical(med,medPosLUT,rowHeight,type);
  }
  
  getMedPosLUT(medPosition) {
    let medPosLUT = {};
    for (let {name,start,end} of medPosition) {
      medPosLUT[name] = {start,end};
    }
    return medPosLUT;
  }
}

MedicationRecord.prototype.SHAPE_LUT={"iv":"square","po":"circle","cont":"rectangle"};

export default MedicationRecord;
