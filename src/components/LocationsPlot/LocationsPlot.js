import React, { PureComponent } from 'react';
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear} from "plot-utils";

const COLOR_LUT={"other":"#5084de",
                 "8S":"#de5f50",
                 "8E":"#deb150",
                 "home":"#7eca8a"
                 };

class LocationPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render() {
    let { height,
          width } = this.props;
    return (
      <canvas ref={this.ref} width={width} height={1}
              style={{height:height,width:width,backgroundColor:"lightgrey",display:"block"}}>
      </canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let { data,
          minX,maxX,width} = this.props;
    this.draw_memo = this.draw_memo || {};
    let memo = this.draw_memo;
    if (memo.data!==data) {
      memo.data = data;
      memo.starts = data.map(({start})=>start);
      memo.ends = data.map(({end})=>end);
      memo.colors = data.map(({name})=>COLOR_LUT[name]);
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.ends,minX));
    let endIndex = Math.min(data.length-1,bisect_left(memo.starts,maxX));
    // Coord convert
    let startDomXs =  memo.starts.slice(startIndex,endIndex+1)
                                .map(x=>toDomXCoord_Linear(width,minX,maxX,x));
    let endDomXs =  memo.ends.slice(startIndex,endIndex+1)
                                .map(x=>toDomXCoord_Linear(width,minX,maxX,x));
    let colors = memo.colors.slice(startIndex,endIndex+1);
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    this.verticalSlabPlot(ctx,width,1,startDomXs,endDomXs,colors);
  }
  
  verticalSlabPlot(ctx,width,height,startDomXs,endDomXs,colors){
    let s = null;
    let e = null;
    let c = null;
    for (let i=0; i<startDomXs.length; i++) {
      s = Math.max(0,Math.round(startDomXs[i]));
      e = Math.min(width,Math.round(endDomXs[i]));
      c = colors[i];
      ctx.fillStyle = c;
      ctx.fillRect(s,0,e-s,height);
    }
  }
}

export default LocationPlot;
