import React, {PureComponent} from "react";
import {toDomXCoord_Linear} from "plot-utils";

class VerticalHighlight extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render() {
    let { start,end,color,
          minX,maxX,width,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} height={1} width={width} {...rest}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw(){
    let { start,end,color,
          minX,maxX,width} = this.props;
    if (start===null || end===null) {
      let canvas = this.ref.current;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0,0,width,1);
      return;
    }
    let startDomX = toDomXCoord_Linear(width,minX,maxX,start);
    let endDomX = toDomXCoord_Linear(width,minX,maxX,end);
    startDomX = Math.round(Math.max(0,startDomX));
    endDomX = Math.round(Math.min(width,endDomX));
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    ctx.globalAlpha=0.3;
    ctx.fillStyle = color;
    ctx.fillRect(startDomX,0,endDomX-startDomX,1);
  }
}

export default VerticalHighlight;
