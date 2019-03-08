import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {bisect_left,bisect_right} from "bisect";
import {toDomYCoord_Linear,
        rowIndexedToColumnIndexed} from "plot-utils";

const COLOR_CYCLE = ["#fff7e4","#fffef9"];

class RespiratoryScoreLimitSlabGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    // Buffer
    this.buffer = {};
    this.buffer.startDomYs = [];
    this.buffer.endDomYs = [];
    this.buffer.colors = [];
  }

  render(){
    let { data,
          minY,maxY,height,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} height={height} width={1} {...rest}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }

  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let { data, /*[{start,end},...]*/
          minY,maxY,height,
          ...rest} = this.props;
    let {buffer} = this;
    // Fill data
    let {start:starts,end:ends} = this.columnIndex(data);
    let colors = this.generateColor(data);
    // Filter
    let startIndex = Math.max(0,bisect_right(ends,minY));
    let endIndex = Math.min(data.length-1,bisect_left(starts,maxY));
    // Coord convert
    buffer.startDomYs.length = endIndex-startIndex+1;
    buffer.endDomYs.length = endIndex-startIndex+1;
    buffer.colors.length = endIndex-startIndex+1;
    for (let i=startIndex,j=0; i<=endIndex; i++,j++){
      buffer.startDomYs[j] = toDomYCoord_Linear(height,minY,maxY,ends[i]);
      buffer.endDomYs[j] = toDomYCoord_Linear(height,minY,maxY,starts[i]);
      buffer.colors[j] = colors[i];
    }
    // Draw
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,height,1);
    this.slabGridPlot(ctx,buffer.startDomYs,buffer.endDomYs,buffer.colors);
  }
  
  columnIndex = memoize_one((data)=>{
    return rowIndexedToColumnIndexed(data,["start","end"]);
  });
  
  generateColor = memoize_one((data)=>{
    let color = data.map((x,i)=>COLOR_CYCLE[i%COLOR_CYCLE.length]);
    return color;
  });

  slabGridPlot(ctx,startDomYs,endDomYs,colors) {
    let color = null;
    let startDomY = null;
    let endDomY = null;
    for (let i=0; i<startDomYs.length; i++){
      color = colors[i];
      startDomY = startDomYs[i];
      endDomY = endDomYs[i];
      ctx.fillStyle = color;
      ctx.fillRect(0,startDomY,1,endDomY-startDomY);
    }
  }
}

export default RespiratoryScoreLimitSlabGrid;
