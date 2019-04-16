import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {bisect_left,bisect_right} from "bisect";
import {toDomYCoord_Linear} from "plot-utils";

const PRIMARY_PANEL_WIDTH = 30;

class YAxisTwoLevelPanel extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render() {
    let { primaryCategories, /* [{name,start,end,color}] */
          secondaryCategories , /* [{name,start,end,color}] */
          rowHeight,
          height, minY, maxY,
          width,
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
          rowHeight,
          width,
          minY,maxY,height} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    // Index by column (cached)
    let primaryCategories_byColumn = this.columnIndex_primaryCategories(primaryCategories);
    let secondaryCategories_byColumn = this.columnIndex_secondaryCategories(secondaryCategories);
    // Create bitmaps and background colors (cached)
    primaryCategories_byColumn["bitmap"] = this.createPrimaryCategoryTextBitmaps(primaryCategories_byColumn["name"]);
    secondaryCategories_byColumn["bitmap"] = this.createSecondaryCategoryTextBitmaps(secondaryCategories_byColumn["name"]);
    // Filter data by minY,maxY
    let primaryCategories_byColumn_filtered = filterDataRange_columnsIndexed(primaryCategories_byColumn,"start","end",minY,maxY);
    let secondaryCategories_byColumn_filtered = filterDataRange_columnsIndexed(secondaryCategories_byColumn,"start","end",minY,maxY);
    // Convert coordinates
    let primaryCategories_endDomYs = primaryCategories_byColumn_filtered["start"].map( (y)=>toDomYCoord_Linear(height,minY,maxY,y) );
    let primaryCategories_startDomYs = primaryCategories_byColumn_filtered["end"].map( (y)=>toDomYCoord_Linear(height,minY,maxY,y) );
    let secondaryCategories_endDomYs = secondaryCategories_byColumn_filtered["start"].map( (y)=>toDomYCoord_Linear(height,minY,maxY,y) );
    let secondaryCategories_startDomYs = secondaryCategories_byColumn_filtered["end"].map( (y)=>toDomYCoord_Linear(height,minY,maxY,y) );
    // Plot
    this.plotPrimaryCategories( ctx,PRIMARY_PANEL_WIDTH,
                                primaryCategories_startDomYs,primaryCategories_endDomYs,
                                primaryCategories_byColumn_filtered["bitmap"],primaryCategories_byColumn_filtered["color"]);
    this.plotSecondaryCategories( ctx,PRIMARY_PANEL_WIDTH,width-PRIMARY_PANEL_WIDTH,
                                  secondaryCategories_startDomYs,secondaryCategories_endDomYs,
                                  secondaryCategories_byColumn_filtered["bitmap"],secondaryCategories_byColumn_filtered["color"]);
  }
  
  columnIndex_primaryCategories = memoize_one((primaryCategories)=>{
    let name = primaryCategories.map(({name})=>name);
    let start = primaryCategories.map(({start})=>start);
    let end = primaryCategories.map(({end})=>end);
    let color = primaryCategories.map(({color})=>color);
    return {name,start,end,color};
  });
  
  columnIndex_secondaryCategories = memoize_one((secondaryCategories)=>{
    let name = secondaryCategories.map(({name})=>name);
    let start = secondaryCategories.map(({start})=>start);
    let end = secondaryCategories.map(({end})=>end);
    let color = secondaryCategories.map(({color})=>color);
    return {name,start,end,color};
  });
  
  plotPrimaryCategories(ctx,panelWidth,starts,ends,bitmaps,colors) {
    let tmpCanvas = document.createElement("canvas");
    let tmpCtx = tmpCanvas.getContext("2d");
    for (let i=0; i<bitmaps.length; i++) {
      let start = starts[i];
      let end = ends[i];
      let bitmap = bitmaps[i];
      let color = colors[i];
      let height = end-start;
      tmpCanvas.width = panelWidth;
      tmpCanvas.height = height;
      tmpCtx.fillStyle= color;
      tmpCtx.fillRect(0,0,panelWidth,height);
      tmpCtx.drawImage(bitmap,panelWidth/2-bitmap.width/2,height/2-bitmap.height/2);
      ctx.drawImage(tmpCanvas,0,start);
    }
  }
  
  plotSecondaryCategories(ctx,panelOffsetX,panelWidth,starts,ends,bitmaps,colors) {
    let tmpCanvas = document.createElement("canvas");
    let tmpCtx = tmpCanvas.getContext("2d");
    for (let i=0; i<bitmaps.length; i++) {
      let start = starts[i];
      let end = ends[i];
      let bitmap = bitmaps[i];
      let color = colors[i];
      let height = end-start;
      tmpCanvas.width = panelWidth;
      tmpCanvas.height = height;
      tmpCtx.fillStyle= color;
      tmpCtx.fillRect(0,0,panelWidth,height);
      tmpCtx.drawImage(bitmap,10,height/2-bitmap.height/2);
      ctx.drawImage(tmpCanvas,panelOffsetX,start);
    }
  }
  
  createPrimaryCategoryTextBitmaps = memoize_one((texts)=>{
    let bitmaps = [];
    for (let t of texts){
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let width = 12;
      let height = 100;
      canvas.width = width;
      canvas.height = height;
      ctx.font = "bold 10px Sans";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.translate(width/2,height/2);
      ctx.rotate(-Math.PI/2);
      ctx.fillText(t,0,0);
      ctx.strokeText(t,0,0);
      bitmaps.push(canvas);
    }
    return bitmaps;
  });
  
  createSecondaryCategoryTextBitmaps = memoize_one((texts)=>{
    let bitmaps = [];
    for (let t of texts){
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let width = 100;
      let height = 12;
      canvas.width = width;
      canvas.height = height;
      ctx.font = "bold 10px Sans";
      ctx.fillStyle = "black";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(t,0,height/2);
      ctx.strokeText(t,0,height/2);
      bitmaps.push(canvas);
    }
    return bitmaps;
  });
}

export default YAxisTwoLevelPanel;
