import {memoize_one} from "memoize";
import {getRotatedAxisCoordinate} from "plot-utils";

const PROCEDURE_DISPLAY = { "HLHS STAGE I, CARDIAC":"S1P",
                            "CHEST CLOSURE, CARDIAC OFF UNIT":"VAC ∆",
                            "GASTROSTOMY, LAPAROSCOPIC, GENSURG":"Hip osteoplasty",
                            "VESICOSTOMY CREATION/CLOSURE, GU":"GI",
                            "BIDIRECTIONAL GLEN SHUNT, CARDIAC":"GI"
                            };

const PROCEDURE_TYPE = {"HLHS STAGE I, CARDIAC":0,
                        "CHEST CLOSURE, CARDIAC OFF UNIT":2,
                        "GASTROSTOMY, LAPAROSCOPIC, GENSURG":0,
                        "VESICOSTOMY CREATION/CLOSURE, GU":2,
                        "BIDIRECTIONAL GLEN SHUNT, CARDIAC":1
                        };

class ProcedureObject {
  constructor({id,name,start,end}){
    this.id = id;
    this.name = name;
    this.start = start;
    this.end = end;
    Object.freeze(this);
  }
  
  getType = memoize_one(()=>{
    return PROCEDURE_TYPE[this.name];
  });
  
  getDisplay = memoize_one(()=> {
    return PROCEDURE_DISPLAY[this.name] || this.name;
  });
  
  getDisplayBitmap = memoize_one(()=>{
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let display = this.getDisplay();
    let font;
    let width;
    let height;
    let rotatedPos;
    switch(this.getType()) {
      case 0:
        font = "10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        canvas.width = width;
        canvas.height = height;
        ctx.font = font;
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.rotate(-Math.PI/2);
        rotatedPos = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
        ctx.fillText(display,rotatedPos.x,rotatedPos.y);
        break;
      case 1:
        font = "10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        canvas.width = width;
        canvas.height = height;
        ctx.font = font;
        ctx.fillStyle = "orange";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.rotate(-Math.PI/2);
        rotatedPos = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
        ctx.fillText(display,rotatedPos.x,rotatedPos.y);
        break;
      case 2:
      default:
        font = "10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        canvas.width = width;
        canvas.height = height;
        ctx.font = font;
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.rotate(-Math.PI/2);
        rotatedPos = getRotatedAxisCoordinate(width/2,height/2,-Math.PI/2);
        ctx.fillText(display,rotatedPos.x,rotatedPos.y);
        break;
    }
    return canvas;
  });
  
  getDisplayHitbox = memoize_one(()=>{
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let display = this.getDisplay();
    let font;
    let width;
    let height;
    switch(this.getType()) {
      case 0:
        font = "10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        break;
      case 1:
        font = "10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        break;
      case 2:
      default:
        font = "10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        break;
    }
    return {width,height};
  });
  
  getDisplaySelectedBitmap = memoize_one(()=>{
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let display = this.getDisplay();
    let font;
    let width;
    let height;
    switch(this.getType()) {
      case 0:
        font = "bold 10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        canvas.width = width;
        canvas.height = height;
        ctx.font = font;
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.rotate(-Math.PI/2);
        ctx.fillText(display,-height/2,width/2);
        break;
      case 1:
        font = "bold 10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        canvas.width = width;
        canvas.height = height;
        ctx.font = font;
        ctx.fillStyle = "orange";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.rotate(-Math.PI/2);
        ctx.fillText(display,-height/2,width/2);
        break;
      case 2:
      default:
        font = "bold 10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        canvas.width = width;
        canvas.height = height;
        ctx.font = font;
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.rotate(-Math.PI/2);
        ctx.fillText(display,-height/2,width/2);
        break;
    }
    return canvas;
  });
  
  getDisplaySelectedHitbox = memoize_one(()=>{
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let display = this.getDisplay();
    let font;
    let width;
    let height;
    switch(this.getType()) {
      case 0:
        font = "bold 10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        break;
      case 1:
        font = "bold 10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        break;
      case 2:
      default:
        font = "bold 10px Sans";
        ctx.font = font;
        height = ctx.measureText(display).width;
        width = 12;
        break;
    }
    return {width,height};
  });
  
  draw(ctx,width,height,startDomX,endDomX) {
    startDomX = Math.round(startDomX);
    endDomX = Math.round(endDomX);
    let lineWidth = endDomX+1-startDomX;
    let lineCenter = (startDomX+endDomX+1) / 2;
    // Line
    switch (this.getType()) {
      case 0:
        ctx.strokeStyle = "red";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(lineCenter,0);
        ctx.lineTo(lineCenter,height);
        ctx.stroke();
        break;
      case 1:
        ctx.strokeStyle = "orange";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(lineCenter,0);
        ctx.lineTo(lineCenter,height);
        ctx.stroke();
        break;
      case 2:
      default:
        ctx.strokeStyle = "green";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(lineCenter,0);
        ctx.lineTo(lineCenter,height);
        ctx.stroke();
        break;
    }
    // Label Bitmap
    let bitmap = this.getDisplayBitmap();
    ctx.drawImage(bitmap,
                  startDomX-5-bitmap.width,
                  5);
  }
  
  drawHitbox(ctx,width,height,startDomX,endDomX) {
    startDomX = Math.round(startDomX);
    endDomX = Math.round(endDomX);
    let lineWidth = endDomX - startDomX+1;
    let lineCenter = (startDomX+endDomX+1) / 2;
    // Line
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.moveTo(lineCenter,0);
    ctx.lineTo(lineCenter,height);
    ctx.stroke();
    // Hitbox
    let hitbox = this.getDisplayHitbox();
    ctx.fillRect( startDomX-5-hitbox.width,
                  5,
                  hitbox.width,
                  hitbox.height);
  }
  
  drawSelected(ctx,width,height,startDomX,endDomX) {
    startDomX = Math.round(startDomX);
    endDomX = Math.round(endDomX);
    let lineWidth = endDomX - startDomX+1;
    let lineCenter = (startDomX+endDomX+1) / 2;
    // Line
    switch (this.getType()) {
      case 0:
        ctx.strokeStyle = "red";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(lineCenter,0);
        ctx.lineTo(lineCenter,height);
        ctx.stroke();
        break;
      case 1:
        ctx.strokeStyle = "orange";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(lineCenter,0);
        ctx.lineTo(lineCenter,height);
        ctx.stroke();
        break;
      case 2:
      default:
        ctx.strokeStyle = "green";
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(lineCenter,0);
        ctx.lineTo(lineCenter,height);
        ctx.stroke();
        break;
    }
    // Label Bitmap
    let bitmap = this.getDisplaySelectedBitmap();
    ctx.drawImage(bitmap,
                  startDomX-5-bitmap.width,
                  5);
  }

  drawSelectedHitbox(ctx,width,height,startDomX,endDomX) {
    startDomX = Math.round(startDomX);
    endDomX = Math.round(endDomX);
    let lineWidth = endDomX - startDomX+1;
    let lineCenter = (startDomX+endDomX+1) / 2;
    // Line
    ctx.beginPath();
    ctx.lineWidh = lineWidth;
    ctx.moveTo(lineCenter,0);
    ctx.lineTo(lineCenter,height);
    ctx.stroke();
    // Label Bitmap
    let hitbox = this.getDisplaySelectedHitbox();
    ctx.fillRect( startDomX-5-hitbox.width,
                  5,
                  hitbox.width,
                  hitbox.height);
  }
}

export default ProcedureObject;


export function compareProcedureObjects(obj1,obj2){
  if (obj1.start!==obj2.start) {
    return obj1.start-obj2.start;
  }
  else {
    return obj1.end-obj2.end;
  }
}
