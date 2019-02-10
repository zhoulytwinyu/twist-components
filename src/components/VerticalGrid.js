import React, { PureComponent } from 'react';
import {toDomXCoord_Linear} from "plot-utils";
        
class VerticalGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { grid, /*[{x}]*/
          minX,maxX,width,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={1} {...rest}></canvas>
    );
  }
  
  componentDidMount() {
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let {grid,minX,maxX,width} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    ctx.strokeStyle = "grey";
    
    let domXArray = grid.filter( ({x})=>(x<=maxX && x>=minX) )
                        .map( ({x})=>this.toDomXCoord(x) );
    for (let domX of domXArray) {
      ctx.fillRect(domX-0.5,0,1,1);
    }
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

export default VerticalGrid;
