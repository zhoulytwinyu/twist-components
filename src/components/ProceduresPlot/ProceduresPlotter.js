import {getRotatedAxisCoordinate} from "plot-utils";

const DISPLAY_LABEL_LUT = {"HLHS STAGE I, CARDIAC":"S1P",
                                "CHEST CLOSURE, CARDIAC OFF UNIT":"VAC ∆",
                                "GASTROSTOMY, LAPAROSCOPIC, GENSURG":"Hip osteoplasty",
                                "VESICOSTOMY CREATION/CLOSURE, GU":"GI",
                                "BIDIRECTIONAL GLEN SHUNT, CARDIAC":"GI"
                                };

const DISPLAY_STYLE_LUT = { "HLHS STAGE I, CARDIAC":0,
                            "CHEST CLOSURE, CARDIAC OFF UNIT":2,
                            "GASTROSTOMY, LAPAROSCOPIC, GENSURG":0,
                            "VESICOSTOMY CREATION/CLOSURE, GU":2,
                            "BIDIRECTIONAL GLEN SHUNT, CARDIAC":1
                            };

export function createLabelBitmap(name) {
  switch (DISPLAY_STYLE_LUT[name]){
    case 0:
      return _createLabelBitmap_style0(DISPLAY_LABEL_LUT[name]);
    case 1:
      return _createLabelBitmap_style1(DISPLAY_LABEL_LUT[name]);
    case 2:
    default:
      return _createLabelBitmap_style2(DISPLAY_LABEL_LUT[name]);
  }
}

export function createLabelHitbox(name){
  switch (DISPLAY_STYLE_LUT[name]){
    case 0:
      return _createLabelHitbox_style0(DISPLAY_LABEL_LUT[name]);
    case 1:
      return _createLabelHitbox_style1(DISPLAY_LABEL_LUT[name]);
    case 2:
    default:
      return _createLabelHitbox_style2(DISPLAY_LABEL_LUT[name]);
  }
}

export function createSelectedLabelBitmap(name){
  switch (DISPLAY_STYLE_LUT[name]){
    case 0:
      return _createSelectedLabelBitmap_style0(DISPLAY_LABEL_LUT[name]);
    case 1:
      return _createSelectedLabelBitmap_style1(DISPLAY_LABEL_LUT[name]);
    case 2:
    default:
      return _createSelectedLabelBitmap_style2(DISPLAY_LABEL_LUT[name]);
  }
}

export function createSelectedLabelHitbox(name){
  switch (DISPLAY_STYLE_LUT[name]){
    case 0:
      return _createSelectedLabelHitbox_style0(DISPLAY_LABEL_LUT[name]);
    case 1:
      return _createSelectedLabelHitbox_style1(DISPLAY_LABEL_LUT[name]);
    case 2:
    default:
      return _createSelectedLabelHitbox_style2(DISPLAY_LABEL_LUT[name]);
  }
}

export function plotLine(ctx,width,height,start,end,name){
  switch (DISPLAY_STYLE_LUT[name]){
    case 0:
      _plotLine_style0(ctx,width,height,start,end);
    case 1:
      _plotLine_style1(ctx,width,height,start,end);
    case 2:
    default:
      _plotLine_style2(ctx,width,height,start,end);
  }
}

export function plotLineHitbox(ctx,width,height,start,end,name){
  switch (DISPLAY_STYLE_LUT[name]){
    case 0:
      _plotLineHitbox_style0(ctx,width,height,start,end);
    case 1:
      _plotLineHitbox_style1(ctx,width,height,start,end);
    case 2:
    default:
      _plotLineHitbox_style2(ctx,width,height,start,end);
  }
}

// Helpers
const FONT_STYLE0 = "bold 12px Sans";
const FONT_HEIGHT_STYLE0 = 12;
const FONT_HEIGHT_SELECTED_STYLE0 = 14;
const FONT_STYLE1 = "10px Sans";
const FONT_HEIGHT_STYLE1 = 10;
const FONT_HEIGHT_SELECTED_STYLE1 = 12;
const FONT_STYLE2 = "10px Sans";
const FONT_HEIGHT_STYLE2 = 10;
const FONT_HEIGHT_SELECTED_STYLE2 = 12;
const COLOR_STYLE0 = "red";
const COLOR_STYLE1 = "purple";
const COLOR_STYLE2 = "blue";
// label
function _createLabelBitmap_style0(text) {
  let font = FONT_STYLE0;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_STYLE0;
  let height = ctx.measureText(text).width;
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = COLOR_STYLE0;
  ctx.rotate(-Math.PI/2);
  let {x,y} = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
  ctx.fillText(text,x,y);
  return canvas;
}

function _createLabelBitmap_style1(text) {
  let font = FONT_STYLE1;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_STYLE1;
  let height = ctx.measureText(text).width;
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = COLOR_STYLE1;
  ctx.rotate(-Math.PI/2);
  let {x,y} = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
  ctx.fillText(text,x,y);
  return canvas;
}
  
function _createLabelBitmap_style2(text) {
  let font = FONT_STYLE2;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_STYLE2;
  let height = ctx.measureText(text).width;
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = COLOR_STYLE2;
  ctx.rotate(-Math.PI/2);
  let {x,y} = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
  ctx.fillText(text,x,y);
  return canvas;
}

// label hitbox
function _createLabelHitbox_style0(text) {
  let font = FONT_STYLE0;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_STYLE0;
  let height = ctx.measureText(text).width;
  return {width,height};
}

function _createLabelHitbox_style1(text) {
  let font = FONT_STYLE1;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_STYLE1;
  let height = ctx.measureText(text).width;
  return {width,height};
}
  
function _createLabelHitbox_style2(text) {
  let font = FONT_STYLE2;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_STYLE2;
  let height = ctx.measureText(text).width;
  return {width,height};
}

// Selected label
function _createSelectedLabelBitmap_style0(text) {
  let font = FONT_STYLE0;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_SELECTED_STYLE0;
  let height = ctx.measureText(text).width;
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = COLOR_STYLE0;
  ctx.fillStyle = "white";
  ctx.rotate(-Math.PI/2);
  let {x,y} = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
  ctx.fillText(text,x,y);
  ctx.strokeText(text,x,y);
  return canvas;
}
  
function _createSelectedLabelBitmap_style1(text) {
  let font = FONT_STYLE1;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_SELECTED_STYLE1;
  let height = ctx.measureText(text).width;
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = COLOR_STYLE1;
  ctx.fillStyle = "white";
  ctx.rotate(-Math.PI/2);
  let {x,y} = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
  ctx.fillText(text,x,y);
  ctx.strokeText(text,x,y);
  return canvas;
}

function _createSelectedLabelBitmap_style2(text) {
  let font = FONT_STYLE2;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_SELECTED_STYLE2;
  let height = ctx.measureText(text).width;
  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = COLOR_STYLE2;
  ctx.fillStyle = "white";
  ctx.rotate(-Math.PI/2);
  let {x,y} = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
  ctx.fillText(text,x,y);
  ctx.strokeText(text,x,y);
  return canvas;
}

// Selected label hitbox
function _createSelectedLabelHitbox_style0(text) {
  let font = FONT_STYLE0;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_SELECTED_STYLE0;
  let height = ctx.measureText(text).width;
  return {width,height};
}
  
function _createSelectedLabelHitbox_style1(text) {
  let font = FONT_STYLE1;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_SELECTED_STYLE1;
  let height = ctx.measureText(text).width;
  return {width,height};
}

function _createSelectedLabelHitbox_style2(text) {
  let font = FONT_STYLE2;
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  ctx.font = font;
  let width = FONT_HEIGHT_SELECTED_STYLE2;
  let height = ctx.measureText(text).width;
  return {width,height};
}

// line
function _plotLine_style0(ctx,width,height,start,end) {
  start = Math.round(start);
  end = Math.round(end);
  let width = end-start+1;
  let center = (end+start+1)/2;
  ctx.fillStyle = COLOR_STYLE0;
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(center,0);
  ctx.lineTo(center,height);
  ctx.stroke();
}

function _plotLine_style1(ctx,width,height,start,end) {
  start = Math.round(start);
  end = Math.round(end);
  let width = end-start+1;
  let center = (end+start+1)/2;
  ctx.fillStyle = COLOR_STYLE1;
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(center,0);
  ctx.lineTo(center,height);
  ctx.stroke();
}

function _plotLine_style2(ctx,width,height,start,end) {
  start = Math.round(start);
  end = Math.round(end);
  let width = end-start+1;
  let center = (end+start+1)/2;
  ctx.fillStyle = COLOR_STYLE2;
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(center,0);
  ctx.lineTo(center,height);
  ctx.stroke();
}

// line hitbox
function _plotLineHitbox_style0(ctx,width,height,start,end) {
  start = Math.round(start);
  end = Math.round(end);
  let width = end-start+1;
  let center = (end+start+1)/2;
  ctx.lineWidth = width;
  ctx.moveTo(center,0);
  ctx.lineTo(center,height);
  ctx.stroke();
}

function _plotLineHitbox_style1(ctx,width,height,start,end) {
  start = Math.round(start);
  end = Math.round(end);
  let width = end-start+1;
  let center = (end+start+1)/2;
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(center,0);
  ctx.lineTo(center,height);
  ctx.stroke();
}

function _plotLineHitbox_style2(ctx,width,height,start,end) {
  start = Math.round(start);
  end = Math.round(end);
  let width = end-start+1;
  let center = (end+start+1)/2;
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(center,0);
  ctx.lineTo(center,height);
  ctx.stroke();
}
