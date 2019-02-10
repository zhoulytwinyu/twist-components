import React, { PureComponent } from 'react';
import {toDomYCoord_Linear} from "plot-utils";
        
class HorizontalSlabGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { grid, /*[{start,end,color}]*/
          minY,maxY,height,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={1} height={height} {...rest}></canvas>
    );
  }
  
  componentDidMount() {
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let {grid,minY,maxY,height} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,1,height);
    
    let processedGrid = grid.filter( ({start,end})=>(start<=maxY || end>=minY) )
                            .map( ({start,end,...rest})=>({ domStart:this.toDomYCoord(start),
                                                            domEnd:this.toDomYCoord(end),
                                                            ...rest
                                                            })
                                  );
    for (let {domStart,domEnd,color} of processedGrid) {
      ctx.fillStyle=color;
      ctx.fillRect(0,domStart,1,domEnd-domStart);
    }
  }
  
  toDomYCoord(dataX) {
    let {minY,maxY,height} = this.props;
    return toDomYCoord_Linear(height,minY,maxY,dataX);
  }
}

export default HorizontalSlabGrid;
