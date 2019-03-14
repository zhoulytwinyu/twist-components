import React, { PureComponent } from 'react';
import {bisect_left,bisect_right} from "bisect";
import {toDomYCoord_Linear} from "plot-utils";

const LIMITS = [{name:"RA",start:0,end:1},
                {name:"NC/MASK/BB",start:1,end:6},
                {name:"HFNC/CPAP",start:6,end:16},
                {name:"BIPAP",start:16,end:26},
                {name:"PSV",start:26,end:36},
                {name:"PCV/VCV",start:36,end:70},
                {name:"HFOV/HFJV",start:70,end:81},
                {name:"ECMO",start:81,end:100}  
                ];
const COLOR_CYCLE = ["#fff7e4","#fffef9"];

class RespiratoryPlotHorizontalSlabGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render(){
    let { minY,maxY,height,
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
    let { minY,maxY,height} = this.props;
    this.draw_memo = this.draw_memo || {};
    let memo = this.draw_memo;
    // Fill data
    if (memo.limits !== LIMITS) {
      memo.limits = LIMITS;
      memo.starts = LIMITS.map(({start})=>start);
      memo.ends = LIMITS.map(({end})=>end);
      memo.colors = this.generateColors(LIMITS.length);
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.ends,minY));
    let endIndex = Math.min(LIMITS.length-1,bisect_left(memo.starts,maxY));
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
