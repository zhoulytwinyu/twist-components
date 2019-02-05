import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomYCoord_Linear} from "plot-utils";

class YAxisPanel extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.toDomYCoord = this.toDomYCoord.bind(this);
  }
  
  render() {
    let {width, height, minY, maxY,
         categoryPosition, subcategoryPosition,
         categoryColors, subcategoryColors, ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} {...rest}> </canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw(){
    let {width,height} = this.props;
    let {categoryPosition, subcategoryPosition,
         categoryColors, subcategoryColors} = this.props;
    let {CATEGORY_WIDTH} = this;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    // Prepare category for plotting
    let categoryDomX = CATEGORY_WIDTH/2;
    let categoryDomY_Top = categoryPosition.map( ({start})=>this.toDomYCoord(start) );
    let categoryDomY_Bottom = categoryPosition.map( ({end})=>this.toDomYCoord(end) );
    let categoryDomY_Center = categoryPosition.map( ({start,end})=>this.toDomYCoord((start+end)/2) );
    let categoryLabels = categoryPosition.map( ({name})=>name );
    // Draw category bg
    for (let i=0; i<categoryDomY_Top.length; i++) {
      let domYTop = categoryDomY_Top[i];
      let domYBottom = categoryDomY_Bottom[i];
      let color = categoryColors[i%categoryColors.length];
      ctx.fillStyle = color;
      ctx.fillRect(0,domYTop,CATEGORY_WIDTH,domYBottom-domYTop);
    }
    // Draw category label
    ctx.fillStyle="white";
    ctx.strokeStyle="grey";
    ctx.lineWidth=1;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i=0; i<categoryLabels.length; i++) {
      let domYCenter = categoryDomY_Center[i];
      let label = categoryLabels[i];
      if (label.startsWith('.')) {
        continue;
      }
      //TODO: Simplify text based on given width TODO
      ctx.translate(categoryDomX,domYCenter);
      ctx.rotate(-Math.PI/2);
      ctx.fillText(label,0,0);
      ctx.strokeText(label,0,0);
      ctx.rotate(Math.PI/2);
      ctx.translate(-categoryDomX,-domYCenter);
    }
    // Prepare subcategory for plotting
    let subcategoryDomX = CATEGORY_WIDTH;
    let subcategoryDomY_Top = subcategoryPosition.map( ({start})=>this.toDomYCoord(start) );
    let subcategoryDomY_Bottom = subcategoryPosition.map( ({end})=>this.toDomYCoord(end) );
    let subcategoryDomY_Center = subcategoryPosition.map( ({start,end})=>this.toDomYCoord((start+end)/2) );
    let subcategoryLabels = subcategoryPosition.map( ({name})=>name );
    // Draw subcategory bg
    for (let i=0; i<subcategoryDomY_Top.length; i++) {
      let domYTop = subcategoryDomY_Top[i];
      let domYBottom = subcategoryDomY_Bottom[i];
      let color = subcategoryColors[i%subcategoryColors.length];
      ctx.fillStyle = color;
      ctx.fillRect(subcategoryDomX,domYTop,width-subcategoryDomX,domYBottom-domYTop);
    }
    // Draw subcategory label
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle="black";
    for (let i=0; i<subcategoryLabels.length; i++) {
      let domYCenter = subcategoryDomY_Center[i];
      let label = subcategoryLabels[i];
      if (label.startsWith('.')) {
        continue;
      }
      // TODO: Simplify text based on given width
      ctx.fillText(label,subcategoryDomX+5,domYCenter);
    }
    ctx.restore();
  }
  
  toDomYCoord(dataY){
    let {minY, maxY, height} = this.props;
    return toDomYCoord_Linear(height,minY,maxY,dataY);
  }
}

YAxisPanel.prototype.CATEGORY_WIDTH = 30;

export default YAxisPanel;
