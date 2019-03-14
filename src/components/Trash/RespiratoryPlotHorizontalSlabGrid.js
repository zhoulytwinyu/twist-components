import React, { PureComponent } from 'react';
import {bisect_left,bisect_right} from "bisect";
import {toDomYCoord_Linear} from "plot-utils";

const COLOR_CYCLE = ["#fff7e4","#fffef9"];

class RespiratoryPlotHorizontalSlabGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    // Buffer
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
    this.draw_memo = this.draw_memo || {};
    let memo = this.draw_memo;
    let { data, /*[{start,end},...]*/
          minY,maxY,height,
          ...rest} = this.props;
    // Fill data
    if (memo.data !== data) {
      memo.data = data;
      memo.starts = data.map(({start})=>start);
      memo.ends = data.map(({end})=>end);
      memo.colors = this.generateColors(data.length);
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.ends,minY));
    let endIndex = Math.min(data.length-1,bisect_left(memo.starts,maxY));
    // Coord convert
    let startDomYs = memo.ends.slice(startIndex,endIndex+1)
                              .map((y)=>toDomYCoord_Linear(height,minY,maxY,y));
    let endDomYs = memo.starts.slice(startIndex,endIndex+1)
                              .map((y)=>toDomYCoord_Linear(height,minY,maxY,y));
    let colors = memo.colors.slice(startIndex,endIndex+1);
    // Draw
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,1,height);
    this.slabGridPlot(ctx,startDomYs,endDomYs,colors);
  }
  
  generateColors(length){
    this.generateColors_memo = this.generateColors_memo || {};
    let memo = this.generateColors_memo;
    if (memo.length!==length) {
      let colors = [...new Array(length).keys()].map((x,i)=>COLOR_CYCLE[i%COLOR_CYCLE.length]);
      memo.colors = colors;
    }
    return memo.colors;
  }

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

export default RespiratoryPlotHorizontalSlabGrid;
