import React, { PureComponent } from 'react';
import {memoize_one} from "../utils/memoize";
import {toDomXCoord_Linear,
        scatterPlot} from "plot-utils";
        
class Location extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.toDomXCoord = this.toDomXCoord.bind(this);
    this.preprocessData = memoize_one(this.preprocessData.bind(this));
  }

  render() {
    let {height,width,left,top} = this.props;
    return (
      <canvas ref={this.ref} height={height} width={width} style={{position:"absolute", left:left, top:top}}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let {minX,maxX,width,height} = this.props;
    let {data} = this.props;
    // data: [{name,start,end},...]
    // assumptions: No overlap.
    let preprocessedData = this.preprocessData(data);
    
    let canvas = this.ref.current;

    // Clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    
    preprocessedData = preprocessedData.map(({color,start,end})=>({ color,
                                                                        domStart: this.toDomXCoord(start),
                                                                        domEnd: this.toDomXCoord(end)
                                                                      })
                                                );
    // Plot
    for (let {color,domStart,domEnd} of preprocessedData) {
      ctx.fillStyle=color;
      ctx.fillRect(domStart,0,domEnd-domStart,height);
    }
  }
  
  preprocessData(data) {
    console.log("here");
    let {COLOR_LUT,toDomXCoord} = this;
    
    let ret = data.map( ({name,start,end})=>({color:COLOR_LUT[name],
                                                  start,
                                                  end})
                        );
    return ret;
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

Location.prototype.COLOR_LUT = {"OR":"brickred", "8S":"pink", "8E":"orange", "home":"green"}


export default Location;
