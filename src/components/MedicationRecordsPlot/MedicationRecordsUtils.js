function drawMedicationRecord(startDomX,endDomX,startDomX,startDomY,type,doseBitmap,score){
  
}

function drawMedicationRecordPicking(startDomX,endDomX,startDomX,startDomY,type,doseBitmap,score){
  
}

  drawCenteredBitmap(ctx,bitmap,x,y){
    x = Math.round(x-bitmap.width/2);
    y = Math.round(y-bitmap.height/2);
    ctx.drawImage(bitmap,x,y);
  }
  
  drawCircle(ctx,x,y,r,color) {
    x = Math.round(x);
    y = Math.round(y);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  drawSquare(ctx,x,y,r,color) {
    //~ let x = Math.round(x-r);
    //~ y = Math.round();
    //~ let endX = Math.round();
    //~ let h = Math.round(x-Math.round);
    //~ ctx.fillStyle = color;
    //~ ctx.strokeStyle = "black";
    //~ x = Math.round(x-h/2);
    //~ y = Math.round(y-h/2);
    //~ ctx.fillRect(x,y,h,h);
    //~ ctx.strokeRect(x,y,h,h);
  }
  
  drawRectangle(ctx,startX,endX,y,r,color) {
    let startY = y-r;
    let endY = y+r;
    y = Math.round(y);
    let h = Math.round(endY)-Math.round(startY);
    let x = Math.round(startX);
    let w = Math.round(endX) - x;
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.fillRect(x,y,w,h);
    ctx.strokeRect(x,y,w,h);
  }

  drawOctagon(ctx,x,y,r,color) {
    let x0,x1,x2,x3;
    let y0,y1,y2,y3;
    x0 = Math.round(x-r);
    x1 = Math.round(x-r/2);
    x2 = Math.round(x+r/2);
    x3 = Math.round(x+r);
    y0 = Math.round(y-r);
    y1 = Math.round(y-r/2);
    y2 = Math.round(y+r/2);
    y3 = Math.round(y+r);
    ctx.beginPath();
    ctx.moveTo(x0,y1);
    ctx.lineTo(x1,y0);
    ctx.lineTo(x2,y0);
    ctx.lineTo(x3,y1);
    ctx.lineTo(x3,y2);
    ctx.lineTo(x2,y3);
    ctx.lineTo(x1,y3);
    ctx.LineTo(x0,y2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "grey";
    ctx.stroke();
    ctx.fill();
  }

  drawLongOctagon(ctx,startX,endX,y,r,color) {
    let x0,x1,x2,x3;
    let y0,y1,y2,y3;
    x0 = Math.round(startX);
    x1 = Math.round(startX+r/2);
    x2 = Math.round(endX-r/2);
    x3 = Math.round(endX);
    y0 = Math.round(y-r);
    y1 = Math.round(y-r/2);
    y2 = Math.round(y+r/2);
    y3 = Math.round(y+r);
    ctx.beginPath();
    ctx.moveTo(x0,y1);
    ctx.lineTo(x1,y0);
    ctx.lineTo(x2,y0);
    ctx.lineTo(x3,y1);
    ctx.lineTo(x3,y2);
    ctx.lineTo(x2,y3);
    ctx.lineTo(x1,y3);
    ctx.LineTo(x0,y2);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "grey";
    ctx.stroke();
    ctx.fill();
  }
