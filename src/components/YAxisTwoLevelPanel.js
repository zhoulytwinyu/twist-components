import React, { PureComponent } from 'react';
import {simplifiedDrawImage} from "plot-utils";

const PRIMARY_PANEL_WIDTH = 30;
const PADDING = 5;

class YAxisTwoLevelPanel extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { primaryCategories, /* [{bitmap,start,end,color}] */
          secondaryCategories , /* [{bitmap,start,end,color}] */
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
    let { primaryCategories,
          secondaryCategories,
          width,height} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    for (let {bitmap,start,end,color} of primaryCategories) {
      let roundedStart = Math.round(start);
      let roundedEnd = Math.round(end);
      let roundedHeight = roundedEnd-roundedStart;
      let croppedBitmap = this.createCroppedPrimaryBitmap(bitmap,PRIMARY_PANEL_WIDTH,PRIMARY_PANEL_WIDTH);
      ctx.fillStyle = color;
      ctx.fillRect(0,roundedStart,PRIMARY_PANEL_WIDTH,roundedHeight);
      ctx.drawImage(croppedBitmap,0,roundedStart);
    }
    for (let {bitmap,start,end,color} of secondaryCategories) {
      let roundedStart = Math.round(start);
      let roundedEnd = Math.round(end);
      let roundedHeight = roundedEnd-roundedStart;
      let roundedWidth = width-PRIMARY_PANEL_WIDTH;
      let croppedBitmap = this.createCroppedSecondaryBitmap(bitmap,roundedWidth,roundedHeight);
      ctx.fillStyle = color;
      ctx.fillRect(PRIMARY_PANEL_WIDTH,roundedStart,roundedWidth,roundedHeight);
      ctx.drawImage(croppedBitmap,PRIMARY_PANEL_WIDTH,roundedStart);
    }
  }
  
  createCroppedPrimaryBitmap(bitmap,width,height) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    simplifiedDrawImage(ctx,bitmap,width/2,height-PADDING,7);
    return canvas;
  }
  
  createCroppedSecondaryBitmap(bitmap,width,height) {
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    simplifiedDrawImage(ctx,bitmap,PADDING,height/2,3);
    return canvas;
  }
  
  static createPrimaryCategoryBitmap(text) {
    let font = "bold 12px Sans";
    let fillStyle = "white"
    let strokeStyle = "black";
    let lineWidth = 1;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    let width = ctx.measureText(text).width;
    let height = 14;
    canvas.width = width;
    canvas.height = height;
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text,width/2,height/2);
    ctx.strokeText(text,width/2,height/2);
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
