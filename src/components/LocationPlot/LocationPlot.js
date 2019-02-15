import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomXCoord_Linear} from "plot-utils";

const COLOR_LUT={"OR":"firebrick", "8S":"pink", "8E":"orange", "home":"green"}

class LocationPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { data, /*[{name,start,end},...]*/
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
  
  draw() {
    let { data,
          minX,maxX,width} = this.props;
    let preprocessedData = this.convertNameToColor(data,COLOR_LUT);
    preprocessedData = preprocessedData.filter( ({start,end})=> !(start>maxX || end<minX) );
    preprocessedData = preprocessedData.map( ({start,end,...rest})=> ({ start:Math.max(minX,start),
                                                                        end:Math.min(maxX,end),
                                                                        ...rest
                                                                        }))
    preprocessedData = preprocessedData.map(({start,end,...rest})=>({ domStart: this.toDomXCoord(start),
                                                                      domEnd: this.toDomXCoord(end),
                                                                      ...rest
                                                                      })
                                              );
    let canvas = this.ref.current;

    // Clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0,0,width,1);
    // Plot
    for (let {color,domStart,domEnd} of preprocessedData) {
      ctx.fillStyle=color;
      ctx.fillRect(domStart,0,domEnd-domStart,1);
    }
  }
  
  convertNameToColor = memoize_one( (data,color_lut)=>{
    let ret = data.map( ({name,start,end})=>({color:color_lut[name],
                                              start,
                                              end})
                        );
    return ret;
  });
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

export default LocationPlot;
