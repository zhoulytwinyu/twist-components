import {getRotatedAxisCoordinate} from "plot-utils";
const PRIMARY_PANEL_WIDTH = 30;

export function createPrimaryCategoryBitmap(text, canvas) {
  let font = "bold 18px Sans";
  let fillStyle = "white";
  let strokeStyle = "#878787";
  canvas = canvas || document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = 18;
  let height = ctx.measureText(text).width;
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.rotate(-Math.PI/2);
  let {x,y} = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
  ctx.fillText(text,x,y);
  ctx.strokeText(text,x,y);
  return canvas;
}
  
export function createSecondaryCategoryBitmap(text, canvas) {
  let font = "bold 12px Sans";
  let fillStyle = "black";
  canvas = canvas || document.createElement("canvas");
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

export function drawPrimaryCategory(ctx,width,height,labelBitmap,bgColor,startDomX,endDomX){
  let plotWidth = PRIMARY_PANEL_WIDTH;
  let start = Math.round(startDomX);
  let end = Math.round(endDomX);
  let color = bgColor;
  let bitmap = labelBitmap;
  let plotHeight = end-start;
  ctx.fillStyle = color;
  ctx.fillRect(0,start,plotWidth,height);
  if (bitmap.width!==0 &&
      bitmap.height!==0) {
    let srcx = Math.round(bitmap.width/2-plotWidth/2);
    let srcy = Math.round(bitmap.height/2-plotHeight/2);
    ctx.drawImage(bitmap,srcx,srcy,plotWidth,plotHeight,
                         0,start,plotWidth,plotHeight);
  }
}

export function drawPrimaryCategories(ctx,width,height,labelBitmaps,bgColors,startDomXs,endDomXs){
  let plotWidth = PRIMARY_PANEL_WIDTH;
  for (let i=0; i<labelBitmaps.length; i++) {
    let start = Math.round(startDomXs[i]);
    let end = Math.round(endDomXs[i]);
    let color = bgColors[i];
    let bitmap = labelBitmaps[i];
    let plotHeight = end-start;
    ctx.fillStyle = color;
    ctx.fillRect(0,start,plotWidth,plotHeight);
    if (bitmap.width!==0 &&
        bitmap.height!==0) {
      let srcx = Math.round(bitmap.width/2-plotWidth/2);
      let srcy = Math.round(bitmap.height/2-plotHeight/2);
      ctx.drawImage(bitmap,srcx,srcy,plotWidth,plotHeight,
                           0,start,plotWidth,plotHeight);
    }
  }
}

export function drawSecondaryCategory(ctx,width,height,labelBitmap,bgColor,startDomX,endDomX){
  if (labelBitmap.width===0 ||
      labelBitmap.height===0 ||
      labelBitmap.height > height) {
    return;
  }
  let plotWidth = width - PRIMARY_PANEL_WIDTH;
  let xOffset = PRIMARY_PANEL_WIDTH;
  let start = Math.round(startDomX);
  let end = Math.round(endDomX);
  let plotHeight = end-start;
  ctx.fillStyle = bgColor;
  ctx.fillRect(xOffset,start,plotWidth,plotHeight);
  let srcx = 0;
  let srcy = Math.round(labelBitmap.height/2-plotHeight/2);
  ctx.drawImage(labelBitmap,srcx,srcy,plotWidth,plotHeight,
                       xOffset+5,start,plotWidth,plotHeight);
}


export function drawSecondaryCategories(ctx,width,height,labelBitmaps,bgColors,startDomXs,endDomXs){
  let plotWidth = width - PRIMARY_PANEL_WIDTH;
  let xOffset = PRIMARY_PANEL_WIDTH;
  for (let i=0; i<labelBitmaps.length; i++) {
    let start = Math.round(startDomXs[i]);
    let end = Math.round(endDomXs[i]);
    let color = bgColors[i];
    let bitmap = labelBitmaps[i];
    let plotHeight = end-start;
    ctx.fillStyle = color;
    ctx.fillRect(xOffset,start,plotWidth,plotHeight);
    if (bitmap.width!==0 &&
        bitmap.height!==0) {
      let srcx = 0
      let srcy = Math.round(bitmap.height/2-plotHeight/2);
      ctx.drawImage(bitmap,srcx,srcy,plotWidth,plotHeight,
                           xOffset+5,start,plotWidth,plotHeight);
    }
  }
}
