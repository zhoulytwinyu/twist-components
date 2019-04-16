import React, { PureComponent } from "react";

class XAxis extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { width,height,
          Xs,bitmaps,positions,
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
  
  draw() {
    let { width,height,
          Xs,bitmaps,positions} = this.props;
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    this.bitmapPlot(ctx,width,height,Xs,bitmaps,positions);
    this.ticPlot(ctx,width,height,Xs);
  }
  
  bitmapPlot(ctx,width,height,domXs,bitmaps,positions){
    let x = null;
    let bitmap = null;
    let y = 5;
    let position = null;
    for (let i=0; i<domXs.length; i++) {
      bitmap = bitmaps[i];
      position = positions[i];
      x = domXs[i];
      switch (position) {
        case 0:
          x = Math.round(x);
          break;
        case 1:
          x = Math.round(x-bitmap.width/2);
          break;
        case 2:
          x = Math.round(x-bitmap.width);
          break;
        default:
          throw new Error("ProgrammerTooDumbError");
      }
      ctx.drawImage(bitmap,x,y);
    }
  }
  
  ticPlot(ctx,width,height,domXs){
    ctx.beginPath();
    for (let x of domXs){
      ctx.moveTo(Math.round(x),0);
      ctx.lineTo(Math.round(x),3);
    }
    ctx.stroke();
  }
}

export default XAxis;
