import React, { PureComponent } from 'react';
import {memoize_one} from "../utils/memoize";

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
    let {categoryToPlot, subcategoryToPlot,
         categoryColors, subcategoryColors} = this.props;
    console.log(categoryToPlot,subcategoryToPlot);
    let {CATEGORY_WIDTH} = this;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.save();
    // Prepare category for plotting
    let categoryDomX = CATEGORY_WIDTH/2;
    let categoryDomY_Top = categoryToPlot.map( ({start})=>this.toDomYCoord(start) );
    let categoryDomY_Bottom = categoryToPlot.map( ({end})=>this.toDomYCoord(end) );
    let categoryDomY_Center = categoryToPlot.map( ({start,end})=>this.toDomYCoord((start+end)/2) );
    let categoryLabels = categoryToPlot.map( ({name})=>name );
    console.log(categoryLabels);
    // Draw category bg
    for (let i=0; i<categoryDomY_Top.length; i++) {
      let domYTop = categoryDomY_Top[i];
      let domYBottom = categoryDomY_Bottom[i];
      let color = categoryColors[i%categoryColors.length];
      console.log(color,0,domYTop,CATEGORY_WIDTH,domYBottom-domYTop);
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
    let subcategoryDomY_Top = subcategoryToPlot.map( ({start})=>this.toDomYCoord(start) );
    let subcategoryDomY_Bottom = subcategoryToPlot.map( ({end})=>this.toDomYCoord(end) );
    let subcategoryDomY_Center = subcategoryToPlot.map( ({start,end})=>this.toDomYCoord((start+end)/2) );
    let subcategoryLabels = subcategoryToPlot.map( ({name})=>name );
    console.log(subcategoryDomY_Top);
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
      // TODO: Simplify text based on given width
      ctx.fillText(label,subcategoryDomX+5,domYCenter);
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
