import React, { PureComponent } from 'react';
import {filterData,
        toDomXCoord_Linear,
        toDomYCoord_Linear,
        hLinePlot,
        vLinePlot,
        stepLinePlot,
        scatterPlot,
        generateAxisDateGrid} from "plot-utils";

class RespPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.toDomXCoord = this.toDomXCoord.bind(this);
    this.toDomYCoord = this.toDomYCoord.bind(this);
  }

  render() {
    let {height,width,left,top} = this.props;
    return (
      <canvas ref={this.ref} height={height} width={width} style={{position:"absolute",left:left,top:top}}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let {x,ys} = this.props;
    let {minX,maxX,minY,maxY,width,height} = this.props;
    let canvas = this.ref.current;

    // Clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    // Filter data
    let {filteredX,filteredYs} = filterData(x,ys,minX,maxX);
    // Coordinate transform
    let domX = filteredX.map(this.toDomXCoord);
    let domYs = filteredYs.map(series=>series.map(this.toDomYCoord));
    // Draw Axis
    vLinePlot(canvas,[this.toDomXCoord(0),this.toDomXCoord(minX)],0,canvas.height);
    hLinePlot(canvas,[this.toDomYCoord(0),this.toDomYCoord(minY)],0,canvas.width);
    // Draw plot
    stepLinePlot(canvas,domX,domYs[0]);
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
  
  toDomYCoord(dataY) {
    let {minY,maxY,height} = this.props;
    return toDomYCoord_Linear(height,minY,maxY,dataY);
  }
}

export default RespPlot;
