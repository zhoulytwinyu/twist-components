import React, { PureComponent } from 'react';
import {toDomXCoord_Linear,
        generateAxisDateGrid,
        labelPlot,
        vLinePlot} from "plot-utils";

class XAxisDate extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.toDomXCoord = this.toDomXCoord.bind(this);
  }

  render() {
    let {height,width,minX,maxX,style,...rest} = this.props;
    let {LEFT_OFFSET,RIGHT_OFFSET} = this;
    style={...style,marginLeft:-RIGHT_OFFSET,width:width-LEFT_OFFSET+RIGHT_OFFSET}
    return (
      <canvas ref={this.ref} height={height} width={width-LEFT_OFFSET+RIGHT_OFFSET} style={style}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let {minX,maxX,width,height} = this.props;
    let {LEFT_OFFSET,RIGHT_OFFSET} = this;
    let canvas = this.ref.current;

    // Clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width-LEFT_OFFSET+RIGHT_OFFSET,height);
    
    // Generate grid
    let {gridPos:gridX,gridLabels:gridXLabels} = generateAxisDateGrid(minX,maxX);
    // Coordinate transform
    let gridDomX = gridX.map(this.toDomXCoord);
    let gridDomY = gridX.map( ()=>15 );
    // Plot
    vLinePlot(canvas,gridDomX,0,3);
    labelPlot(canvas,gridDomX,gridDomY,gridXLabels);
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    let {LEFT_OFFSET} = this;
    return toDomXCoord_Linear(width,minX,maxX,dataX)-LEFT_OFFSET;
  }
}

XAxisDate.prototype.LEFT_OFFSET=-20;
XAxisDate.prototype.RIGHT_OFFSET=20;

export default XAxisDate;
