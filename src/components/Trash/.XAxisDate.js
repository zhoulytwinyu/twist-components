import React, { PureComponent } from 'react';
import {memoize,
        memoize_one} from "memoize";
import {toDomXCoord_Linear,
        generateAxisDateGrid,
        bitmapScatterPlot,
        vLinePlot} from "plot-utils";

const MARGIN_LEFT = -20;

class XAxisDate extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.buffer = {};
    this.buffer.domXs = [];
    this.buffer.domYs = [];
    this.buffer.bitmaps = [];
  }

  render() {
    let {height,width,minX,maxX,...rest} = this.props;
    let canvasStyle = this.generateCanvasStyle(MARGIN_LEFT,width);
    return (
      <div {...rest}>
        <canvas ref={this.ref} height={height} width={width-2*MARGIN_LEFT} style={canvasStyle}></canvas>
      </div>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  generateCanvasStyle = memoize_one((marginLeft,width)=>({marginLeft: marginLeft,
                                                          width: width-2*marginLeft
                                                        })
  );
  
  draw() {
    let {minX,maxX,width,height} = this.props;
    let {buffer} = this;
    // Generate grid
    let {gridPos:gridXs,gridLabels:gridXLabels} = generateAxisDateGrid(minX,maxX);
    // Create bitmaps
    let bitmaps = gridXLabels.map((text)=>this.createTextBitmap(text));
    // Filter
    let startIndex = 0;
    let endIndex = bitmaps.length-1;
    // Prepare buffer
    buffer.bitmaps.length = bitmaps.length;
    buffer.domXs.length = bitmaps.length;
    buffer.domYs.length = bitmaps.length;
    // Coordinate transform
    for (let i=startIndex,j=0; i<=endIndex; i++,j++) {
      buffer.bitmaps[j] = bitmaps[i];
      buffer.domXs[j] = toDomXCoord_Linear(width,minX,maxX,gridXs[i])-MARGIN_LEFT;
      buffer.domYs[j] = 5;
    }
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width-2*MARGIN_LEFT,height);
    bitmapScatterPlot(ctx, buffer.domXs, buffer.domYs, buffer.bitmaps, 1);
  }
  
  createTextBitmap = memoize((text)=>{
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "10px Sans";
    let height = 10;
    let width = ctx.measureText(text).width;
    canvas.width = width;
    canvas.height = height;
    ctx.font = "10px Sans";
    ctx.translate(width/2,height/2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text,0,0);
    return canvas;
  },
  4);
}

export default XAxisDate;
