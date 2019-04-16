import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomYCoord_Linear,
        applyCanvasStyle,
        drawTextInRect} from "plot-utils";

class YAxisPanel extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render() {
    let { category, /* [{name,start,end[,bgStyle,textStyle,textPosition:[1-9],textRotation]}] */
          height, minY, maxY,
          width,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw(){
    let { category,
          width,
          height} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    
    let processedCategory = category.map( ({start,end,...rest})=>({ domStart: this.toDomYCoord(end),
                                                                    domEnd: this.toDomYCoord(start),
                                                                    ...rest
                                                                    })
                                          ) // Drops start,end
                                    .map( ({domStart,domEnd,textPosition,...rest})=>{ if (textPosition===undefined || textPosition===null ) {
                                                                                        textPosition=3;
                                                                                      }
                                                                                      let {x,y}= this.getSubPositionLUT(width,domEnd-domStart,textPosition);
                                                                                      return ({ textDomX:x,
                                                                                                textDomY:domStart+y,
                                                                                                domStart,
                                                                                                domEnd,
                                                                                                ...rest
                                                                                                });
                                                                                      }
                                          ); // Drops textPosition
    // Draw BG
    for (let {domStart,domEnd,bgStyle} of processedCategory) {
      if (!bgStyle) {
        continue;
      }
      applyCanvasStyle(ctx,bgStyle);
      ctx.fillRect(0,domStart,width,domEnd-domStart);
    }
    // Draw text
    for (let {name,domStart,domEnd,textStyle,textDomX,textDomY,textRotation} of processedCategory) {
      if ( (!textStyle) || (!name) ) {
        continue;
      }
      drawTextInRect(ctx,0,domStart,width,domEnd-domStart,
                     name,textDomX,textDomY,textStyle,textRotation);
    }
  }
  
  getSubPositionLUT(width,rowHeight,positionID) {
    /*
     * +-----+
     * |0 1 2|
     * |3 4 5|
     * |6 7 8|
     * +-----+
     */
    let subRowHeight = rowHeight/10;
    let subColWidth = width/10;
    switch (positionID){
      case 0:
        return {x:subColWidth*1,y:subRowHeight*1};
      case 1:
        return {x:subColWidth*5,y:subRowHeight*1};
      case 2:
        return {x:subColWidth*9,y:subRowHeight*1};
      case 3:
        return {x:subColWidth*1,y:subRowHeight*5};
      case 4:
        return {x:subColWidth*5,y:subRowHeight*5};
      case 5:
        return {x:subColWidth*9,y:subRowHeight*5};
      case 6:
        return {x:subColWidth*1,y:subRowHeight*9};
      case 7:
        return {x:subColWidth*5,y:subRowHeight*9};
      case 8:
        return {x:subColWidth*9,y:subRowHeight*9};
      default:
        throw new Error("UserTooStupid");
    }
  }
  
  toDomYCoord(dataY){
    let {minY, maxY, height} = this.props;
    return toDomYCoord_Linear(height,minY,maxY,dataY);
  }
}

YAxisPanel.prototype.CATEGORY_WIDTH = 30;

export default YAxisPanel;

