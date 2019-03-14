import React, { PureComponent } from 'react';
import {toDomXCoord_Linear,
        toDomYCoord_Linear} from "plot-utils";
import {bisect_left, bisect_right} from "bisect";

class CroppedBitmapPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.memo = {};
    this.memo.startDomXs = [];
    this.memo.endDomXs = [];
    this.memo.startDomYs = [];
    this.memo.endDomYs = [];
  }

  render() {
    let { bitmaps,
          startXs,endXs,
          startYs,endYs,
          positions,
          offsetDomXs,offsetDomYs,
          minX,maxX,
          minY,maxY,
          height, width,
          ...rest} = this.props;
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
    let { bitmaps,
          startXs,endXs,
          startYs,endYs,
          positions,
          offsetDomXs,offsetDomYs,
          minX,maxX,
          minY,maxY,
          height, width,
          ...rest} = this.props;
    let {memo} = this;
    memo.startDomXs.length = startXs.length;
    memo.endDomXs.length = endXs.length;
    memo.startDomYs.length = startYs.length;
    memo.endDomYs.length = endYs.length;
    // Filter
    let startIndex = Math.max(0,bisect_right(startXs,minX));
    let endIndex = Math.max(endXs.length-1,bisect_left(endXs,maxX));
    // Coord convert
    for (let i=startIndex; i<=endIndex; i++) {
      memo.startDomXs[i] = toDomXCoord_Linear(width,minX,maxX,startXs[i]);
      memo.endDomXs[i] = toDomXCoord_Linear(width,minX,maxX,endXs[i]);
      memo.startDomYs[i] = toDomYCoord_Linear(height,minY,maxY,startYs[i]);
      memo.endDomYs[i] = toDomYCoord_Linear(width,minX,maxX,endYs[i]);
    }
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    this.plot(ctx,);
  }
  
  plot(ctx,bitmaps,startDomXs,startDomYs,endDomXs,endDomYs,positions,offsetXs,offsetYs,startIndex,endIndex) {
    let {memo} = this;
    memo.scratchCanvas = memo.scratchCanvas || document.createElement("canvas");
    let bitmap;
    let startDomX, startDomY;
    let endDomX, endDomY;
    let position;
    let offsetX, offsetY;
    let width, height;
    for (let i=startIndex; i<=endIndex; i++) {
      bitmap = bitmaps[i];
      startDomX = startDomXs[i];
      startDomY = startDomYs[i];
      endDomX = endDomXs[i];
      endDomX = endDomYs[i];
      position = positions[i];
      offsetX = offsetXs[i];
      offsetY = offsetYs[i];
      startDomX = Math.round(adjustPositionX(startDomX,bitmap.width,position)+offsetX);
      endDomX = Math.round(adjustPositionX(endDomX,bitmap.width,position)+offsetX);
      startDomY = Math.round(adjustPositionX(startDomY,bitmap.height,position)+offsetY);
      endDomY = Math.round(adjustPositionY(endDomY,bitmap.height,position)+offsetY);
      width = endDomX-startDomX;
      height = endDomY-startDomY;
    }
  }
  
  adjustPositionX(startDomX,bitmapWidth,position){
    let ret;
    switch(position){
      case 0:
      case 3:
      case 6:
        ret = startDomX;
        break;
      case 1:
      case 4:
      case 7:
        ret = startDomX-bitmapWidth/2;
        break;
      case 2:
      case 5:
      case 8:
      default:
        ret = startDomX-bitmapWidth;
        break;
    }
    return ret;
  }
  
  adjustPositionY(startDomY,bitmapHeight,position){
    let ret;
    switch(position){
      case 0:
      case 1:
      case 2:
        ret = startDomX;
        break;
      case 3:
      case 4:
      case 5:
        ret = startDomX-bitmapHeight/2;
        break;
      case 6:
      case 7:
      case 8:
      default:
        ret = startDomX-bitmapHeight;
        break;
    }
    return ret;
  }
}
