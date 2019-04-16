import React, { PureComponent } from 'react';
import {getRotatedAxisCoordinate} from "plot-utils";
const PRIMARY_PANEL_WIDTH = 30;
const PADDING = 5;

class YAxisTwoLevelPanel extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.memo = {};
    this.memo.scratchCanvas = document.createElement("canvas");
  }

  render() {
    let { primaryBitmaps,
          primaryStarts,
          primaryEnds,
          primaryColors,
          secondaryBitmaps,
          secondaryStarts,
          secondaryEnds,
          secondaryColors,
          height, width,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} {...rest}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw(){
    let { primaryBitmaps,
          primaryStarts,
          primaryEnds,
          primaryColors,
          secondaryBitmaps,
          secondaryStarts,
          secondaryEnds,
          secondaryColors,
          height, width
          } = this.props;
    let {memo} = this;
    let {scratchCanvas} = memo;
    let scratchCtx = scratchCanvas.getContext("2d");
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    // Primary
    let w1 = PRIMARY_PANEL_WIDTH;
    let w2 = width - PRIMARY_PANEL_WIDTH;
    let s,e,c,b,h;
    for (let i=0; i<primaryBitmaps.length; i++) {
      s = Math.round(primaryStarts[i]);
      e = Math.round(primaryEnds[i]);
      c = primaryColors[i];
      b = primaryBitmaps[i];
      h = e-s;
      ctx.fillStyle = c;
      ctx.fillRect(0,s,w1,h);
      scratchCanvas.width=w1;
      scratchCanvas.height = h;
      try {
        scratchCtx.drawImage(b,Math.round((w1-b.width)/2),Math.round((h-b.height)/2));
        ctx.drawImage(scratchCanvas,0,s);
      } catch {
        //ignore
      }
    }
    // Secondary
    for (let i=0; i<secondaryBitmaps.length; i++) {
      s = Math.round(secondaryStarts[i]);
      e = Math.round(secondaryEnds[i]);
      c = secondaryColors[i];
      b = secondaryBitmaps[i];
      h = e-s;
      ctx.fillStyle = c;
      ctx.fillRect(w1,s,w2,h);
      scratchCanvas.width = w2;
      scratchCanvas.height = h;
      try {
        scratchCtx.drawImage(b,w1+PADDING,Math.round((h-b.height)/2));
        ctx.drawImage(scratchCanvas,0,s);
      } catch {
        //ignore
      }
    }
  }

  static createPrimaryCategoryBitmap(text) {
    let font = "bold 14px Sans";
    let fillStyle = "white"
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    let width = 14;
    let height = ctx.measureText(text).width;
    canvas.width = width;
    canvas.height = height;
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.rotate(-Math.PI/2);
    let {x,y} = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
    ctx.fillText(text,x,y);
    return canvas;
  }
  
  static createSecondaryCategoryBitmap(text) {
    let font = "bold 12px Sans";
    let fillStyle = "black"
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    let width = ctx.measureText(text).width;
    let height = 14;
    canvas.width = width;
    canvas.height = height;
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text,width/2,height/2);
    return canvas;
  }
}



export default YAxisTwoLevelPanel;
