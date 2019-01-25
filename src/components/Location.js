import React, { PureComponent } from 'react';
import {memoize_one} from "../utils/memoize";
import {toDomXCoord_Linear,
        scatterPlot} from "plot-utils";
        
class Location extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.toDomXCoord = this.toDomXCoord.bind(this);
    this.convertNameToColor = memoize_one(this.convertNameToColor);
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
    let preprocessedData = this.convertNameToColor(data,this.COLOR_LUT);
    preprocessedData = preprocessedData.filter( ({color,start,end})=> !(start>maxX || end<minX) );
    preprocessedData = preprocessedData.map(({color,start,end})=>({ color,
                                                                    domStart: this.toDomXCoord(start),
                                                                    domEnd: this.toDomXCoord(end)
                                                                  })
                                              );
    let canvas = this.ref.current;

    // Clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    
    // Plot
    for (let {color,domStart,domEnd} of preprocessedData) {
      ctx.fillStyle=color;
      ctx.fillRect(domStart,0,domEnd-domStart,height);
    }
  }
  
  convertNameToColor(data,color_lut) {
    let ret = data.map( ({name,start,end})=>({color:color_lut[name],
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

Location.prototype.COLOR_LUT = {"OR":"firebrick", "8S":"pink", "8E":"orange", "home":"green"}


export default Location;
