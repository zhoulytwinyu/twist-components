import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomXCoord_Linear,
        scatterPlot} from "plot-utils";
        
class LocationPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { data, /*[{name,start,end},...]*/
          minX,maxX,width,
          style,
          ...rest} = this.props;
    return (
      <div style={{...style,backgroundColor:"beige"}} {...rest}>
        <canvas ref={this.ref} height={1} width={width} style={{position:"absolute",width:"100%",height:"50%",top:"25%"}}></canvas>
      </div>
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
    let preprocessedData = this.convertNameToColor(data,this.COLOR_LUT);
    preprocessedData = preprocessedData.filter( ({start,end})=> !(start>maxX || end<minX) );
    preprocessedData = preprocessedData.map(({start,end,...rest})=>({ domStart: this.toDomXCoord(start),
                                                                      domEnd: this.toDomXCoord(end),
                                                                      ...rest
                                                                      })
                                              );
    let canvas = this.ref.current;

    // Clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    
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

LocationPlot.prototype.COLOR_LUT = {"OR":"firebrick", "8S":"pink", "8E":"orange", "home":"green"}


export default LocationPlot;
