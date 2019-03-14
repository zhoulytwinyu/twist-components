import React, { PureComponent } from "react";

class VerticalGridLine extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { width,minX,maxX,
          Xs, colors,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={1} {...rest}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let {minX,maxX,width,Xs,colors} = this.props;
    let {buffer} = this;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    this.verticalLinePlot(ctx,width,1,Xs,colors);
  }
  
  verticalLinePlot(ctx,width,height,domXs,colors){
    let x = null;
    let c = null;
    for (let i=0; i<domXs.length; i++) {
      x = Math.round(domXs[i]);
      c = colors[i];
      ctx.beginPath();
      ctx.fillStyle = c;
      ctx.moveTo(x,0);
      ctx.lineTo(x,height);
      ctx.stroke();
    }
  }
}

export default VerticalGridLine;
