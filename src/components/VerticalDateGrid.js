import React, { PureComponent } from 'react';
import {toDomXCoord_Linear,
        generateAxisDateGrid,
        vLinePlot} from "plot-utils";

class VerticalDateGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
    // Buffer
    this.buffer = {};
    this.buffer.gridDomXs = [];
  }
  
  render() {
    let {width,minX,maxX,...rest} = this.props;
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
    let {minX,maxX,width} = this.props;
    let {buffer} = this;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    let {gridPos:gridXs} = generateAxisDateGrid(minX,maxX);
    buffer.gridDomXs.length = gridXs.length;
    for (let i=0; i<gridXs.length; i++) {
      buffer.gridDomXs[i] = toDomXCoord_Linear(width,minX,maxX,gridXs[i]);
    }
    ctx.globalAlpha=1;
    ctx.strokeStyle="grey";
    vLinePlot(ctx,buffer.gridDomXs,0,1);
  }
}

export default VerticalDateGrid;
