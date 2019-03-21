import React, { PureComponent } from "react";
import {bisect_left, bisect_right} from "bisect";
import {toDomXCoord_Linear,generateDateGrids} from "plot-utils";
import {format} from "date-fns";

class DateXAxis extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { minX,maxX,
          width,height,
          style,position,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref}  width={width} height={height}
                              style={{backgroundColor:"#fff7e4",...style}}
                              {...rest}
                              >
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
    let { minX,maxX,
          width,height,
          position} = this.props;
    this.draw_memo = this.draw_memo || {validFromDiffX:0,validToDiffX:-1,rangeMinX:0,rangeMaxX:-1};
    let memo = this.draw_memo;
    let diffX = maxX-minX;
    // Generate grids, labels and bitmaps in cache
    if (memo.validFromDiffX>diffX ||
        diffX>memo.validToDiffX ||
        memo.rangeMinX>minX ||
        maxX>memo.rangeMaxX
        ) {
      memo.rangeMinX = minX-10*diffX;
      memo.rangeMaxX = maxX+10*diffX;
      let {grids, validFromDiffX, validToDiffX} = generateDateGrids(minX,maxX,memo.rangeMinX,memo.rangeMaxX);
      memo.validFromDiffX = validFromDiffX;
      memo.validToDiffX = validToDiffX;
      memo.grids = grids;
      let gridLabels = this.getGridLabels(minX,maxX,grids);
      memo.labelBitmaps = gridLabels.map((text)=>this.createTextBitmaps(text));
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.grids,minX));
    let endIndex = Math.min(memo.grids.length-1,bisect_left(memo.grids,maxX));
    
    let domXs = memo.grids.slice(startIndex,endIndex+1).map( (x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let labelBitmaps = memo.labelBitmaps.slice(startIndex,endIndex+1);
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    this.bitmapPlot(ctx,width,height,domXs,labelBitmaps);
    this.ticPlot(ctx,width,height,domXs,position);
  }
  
  getGridLabels(minX,maxX,grids){
    let minT = new Date(minX);
    let maxT = new Date(maxX);
    let minT_Year = minT.getFullYear();
    let maxT_Year = maxT.getFullYear();
    if (minT_Year===maxT_Year){
      let minT_Month = minT.getMonth();
      let maxT_Month = maxT.getMonth();
      if (minT_Month===maxT_Month){
        let minT_Date = minT.getDate();
        let maxT_Date = maxT.getDate();
        if (minT_Date===maxT_Date){
          let minT_Hour = minT.getHours();
          let maxT_Hour = maxT.getHours();
          if (minT_Hour===maxT_Hour){
            let minT_Minute = minT.getMinutes();
            let maxT_Minute = maxT.getMinutes();
            if (minT_Minute===maxT_Minute){
              let minT_Second = minT.getSeconds();
              let maxT_Second = maxT.getSeconds();
              if (minT_Second===maxT_Second){
                return grids.map((x)=>format(x,"SSS"));
              }
              if (maxT_Second-minT_Second<2) {
                return grids.map((x)=>format(x,"ss.SSS"));
              }
              else {
                return grids.map((x)=>format(x,"ss"));
              }
            }
            if (maxT_Minute-minT_Minute<2) {
              return grids.map((x)=>format(x,"mm:ss"));
            }
            else {
              return grids.map((x)=>format(x,"mm"));
            }
          }
          if (maxT_Hour-minT_Hour<2) {
            return grids.map((x)=>format(x,"HH:mm"));
          }
          else {
            return grids.map((x)=>format(x,"hha"));
          }
        }
        if (maxT_Date-minT_Date<2) {
          return grids.map((x)=>format(x,"Do hha"));
        }
        else {
          return grids.map((x)=>format(x,"Do"));
        }
      }
      if (maxT_Month-minT_Month<2) {
        return grids.map((x)=>format(x,"MMM/DD"));
      }
      else {
        return grids.map((x)=>format(x,"MMM"));
      }
    }
    if (maxT_Year-minT_Year<2) {
      return grids.map((x)=>format(x,"YYYY/MMM"));
    }
    else {
      return grids.map((x)=>format(x,"YYYY"));
    }
  }
  
  createTextBitmaps(text) {
    let font = "12px Sans";
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    let width = ctx.measureText(text).width;
    let height = 12;
    canvas.width = width;
    canvas.height = height;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text,width/2,height/2);
    return canvas;
  }

  bitmapPlot(ctx,width,height,domXs,bitmaps){
    for (let i=0; i<domXs.length; i++) {
      let bitmap = bitmaps[i];
      let x = Math.round(domXs[i]-bitmap.width/2);
      let y = Math.round(height/2-bitmap.height/2);
      ctx.drawImage(bitmap,x,y);
    }
  }
  
  ticPlot(ctx,width,height,domXs,position){
    let y;
    switch (position) {
      case "x":
      default:
        ctx.beginPath();
        y = Math.round(height*0.1);
        for (let x of domXs){
          ctx.moveTo(Math.round(x),0);
          ctx.lineTo(Math.round(x),y);
        }
        ctx.moveTo(0,0);
        ctx.lineTo(width,0);
        ctx.stroke();
        break;
      case "x1":
        ctx.beginPath();
        y = Math.round(height*0.9);
        for (let x of domXs){
          ctx.moveTo(Math.round(x),y);
          ctx.lineTo(Math.round(x),height);
        }
        ctx.moveTo(0,height);
        ctx.lineTo(width,height);
        ctx.stroke();
        break;
    }
  }
}

export default DateXAxis;
