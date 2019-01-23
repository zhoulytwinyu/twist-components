import React, { PureComponent } from 'react';
import {toDomYCoord_Linear,
        generateAxisGrid,
        labelPlot,
        hLinePlot} from "plot-utils";

class YAxis extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.toDomYCoord = this.toDomYCoord.bind(this);
  }

  render() {
    let {height,width,left,top} = this.props;
    let {TOP_OFFSET,BOTTOM_OFFSET} = this;
    return (
      <canvas ref={this.ref} height={height-TOP_OFFSET+BOTTOM_OFFSET} width={width} style={{position:"absolute", top:top+TOP_OFFSET, left:left}}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let {minY,maxY,width,height} = this.props;
    let {TOP_OFFSET,BOTTOM_OFFSET} = this;
    let canvas = this.ref.current;

    // Clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height-TOP_OFFSET+BOTTOM_OFFSET);
    
    // Generate grid
    let {gridPos:gridY,gridLabels:gridYLabels} = generateAxisGrid(minY,maxY);
    // Coordinate transformation
    let gridDomY = gridY.map(this.toDomYCoord);
    let gridDomX = gridY.map(()=>width-5);
    // Plotting
    hLinePlot(canvas,gridDomY,width-3,width);
    labelPlot(canvas,gridDomX,gridDomY,gridYLabels,"right","middle",0);
  }
  
  toDomYCoord(dataY) {
    let {minY,maxY,height} = this.props;
    let {TOP_OFFSET} = this;
    return toDomYCoord_Linear(height,minY,maxY,dataY)-TOP_OFFSET;
  }
}

YAxis.prototype.TOP_OFFSET = -10;
YAxis.prototype.BOTTOM_OFFSET = 10;

export default YAxis;
