import React, { PureComponent } from 'react';
import {memoize_one} from "../utils/memoize";
import {toDomCoord_Categorical} from "plot-utils";

class YCategoricalPanel extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.toDomYCoord = this.toDomYCoord.bind(this);
  }
  
  render() {
    let {width, height, left, top} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} style={{position:"absolute", left:left,top:top}}> </canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw(){
    let {width} = this.props;
    let {categoryPosition,subcategoryPosition, // format: [{name,start,end}]
         categoryColors, subcategoryColors} = this.props;
    let {CATEGORY_WIDTH} = this;
    let categoryDomX = CATEGORY_WIDTH/2;
    let subcategoryDomX = CATEGORY_WIDTH;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.save();
    // Draw category bg
    for (let i=0; i<categoryPosition.length; i++ ) {
      let {start,end} = categoryPosition[i];
      let domYTop = this.toDomYCoord(start);
      let domYBottom = this.toDomYCoord(end);
      let color = categoryColors[i%categoryColors.length];
      ctx.fillStyle = color;
      ctx.fillRect(0,domYTop,CATEGORY_WIDTH,domYBottom-domYTop);
    }
    // Draw category label
    ctx.font = "bold 16px Sans";
    ctx.fillStyle="white";
    ctx.strokeStyle="grey";
    ctx.lineWidth=0.5;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let {name,start,end} of categoryPosition) {
      if (name === '' || name === undefined || name === null) {
        continue;
      }
      let domYCenter = this.toDomYCoord( (start+end)/2 );
      //TODO: Simplify text based on given width TODO
      ctx.translate(categoryDomX,domYCenter);
      ctx.rotate(-Math.PI/2);
      ctx.fillText(name,0,0);
      ctx.strokeText(name,0,0);
      ctx.rotate(Math.PI/2);
      ctx.translate(-categoryDomX,-domYCenter);
    }
    // Draw subcategory bg
    for (let i=0; i<subcategoryPosition.length; i++) {
      let {start,end} = subcategoryPosition[i];
      let domYTop = this.toDomYCoord(start);
      let domYBottom = this.toDomYCoord(end);
      let color = subcategoryColors[i%subcategoryColors.length];
      ctx.fillStyle = color;
      ctx.fillRect(subcategoryDomX,domYTop,width-subcategoryDomX,domYBottom-domYTop);
    }
    // Draw subcategory label
    ctx.font = "14px Sans";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle="black";
    for (let {name,start,end} of subcategoryPosition) {
      if (name === '' || name === undefined || name === null) {
        continue;
      }
      let domYCenter = this.toDomYCoord( (start+end)/2 );
      // TODO: Simplify text based on given width
      ctx.fillText(name,subcategoryDomX+5,domYCenter);
    }
    ctx.restore();
  }
  
  toDomYCoord(dataY){
    let {rowHeight} = this.props;
    return dataY*rowHeight;
  }
}

YCategoricalPanel.prototype.CATEGORY_WIDTH = 30;

export default YCategoricalPanel;
