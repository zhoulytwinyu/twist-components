import React, { PureComponent } from "react";
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear} from "plot-utils";

class XAxis extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
    // Buffer
    this.memo = {};
    this.memo.prevLabels = null;
    this.memo.bitmaps = [];
    this.memo.domXs = [];
  }
  
  render() {
    let { width,minX,maxX,
          height,
          Xs,labels,
          ...rest} = this.props;
    return (
      <canvas id="sadasd" ref={this.ref} width={width} height={height} {...rest}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let { minX,maxX,width,
          height,
          Xs,labels} = this.props;
    let {memo} = this;
    // Generate memo and bitmaps
    if (memo.prevLabels !== labels) {
      memo.prevLabels = labels;
      memo.bitmaps.length = labels.length;
      memo.domXs.length = labels.length;
      for (let i=0; i<labels.length; i++) {
        memo.bitmaps[i] = this.createTextBitmaps(labels[i]);
      }
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(Xs,minX));
    let endIndex = Math.min(Xs.length-1,bisect_left(Xs,maxX));
    // Coord convert
    for (let i=startIndex; i<=endIndex; i++) {
      memo.domXs[i] = toDomXCoord_Linear(width,minX,maxX,Xs[i]);
    }
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    this.bitmapPlot(ctx,width,height,memo.domXs,memo.bitmaps,startIndex,endIndex);
  }
  
  createTextBitmaps(text) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "10px Sans";
    let width = ctx.measureText(text).width;
    let height = 10;
    canvas.width = width;
    canvas.height = height;
    ctx.font = "10px Sans";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text,width/2,height/2);
    return canvas;
  }
  
  bitmapPlot(ctx,width,height,domXs,bitmaps,startIndex,endIndex){
    let x = null;
    let bitmap = null;
    let y = 5;
    for (let i=startIndex; i<=endIndex; i++) {
      bitmap = bitmaps[i];
      x = Math.round(domXs[i]-bitmap.width/2);
      ctx.drawImage(bitmap,x,y);
    }
  }
}

export default XAxis;
