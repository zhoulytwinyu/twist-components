import React, { PureComponent } from "react";
import {filterDataPoint_columnsIndexed,
        filterDataRange_columnsIndexed,
        toDomXCoord_Linear,
        toDomYCoord_Linear,
        stepLinePlot,
        shadeArea} from "plot-utils";

class RespPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { respiratoryScores, /*[{time,RespiratorySupportScore,ECMOScore}]*/
          iNO, /*[{start,end}]*/
          anethetics, /*[{start,end}]*/
          minX,maxX,width,
          minY,maxY,height,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} height={height} width={width} {...rest}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let { respiratoryScores,
          iNO,
          anethetics,
          minX,maxX,width,
          minY,maxY,height
          } = this.props;
    // Organize data (cached)
    let respiratoryScores_byColumn = this.columnIndex_respiratoryScores(respiratoryScores);
    let iNO_byColumn = this.columnIndexed_iNO(iNO);
    let anethetics_byColumn = this.columnIndex_anethetics(anethetics);
    // Filter data
    respiratoryScores_byColumn_filtered=filterDataPoint_columnsIndexed(respiratoryScores_byColumn,"time",minX,maxX);
    iNO_byColumn_filtered = filterDataRange_columnsIndexed(iNO_byColumn,"start","end",minX,maxX);
    anethetics_byColumn_filtered = filterDataRange_columnsIndexed(anethetics_byColumn,"start","end",minX,maxX);
    // Coordinate transform
    let time_domXs = respiratoryScores_byColumn_filtered["time"].map( (x)=>toDomXCoord_Linear(width,minX,maxX,x) );
    let RespiratorySupportScore_domYs = respiratoryScores_byColumn_filtered["RespiratorySupportScore"].map( (y)=>toDomYCoord_Linear(height,minY,maxY,y) );
    let ECMOScore_domYs = respiratoryScores_byColumn_filtered["ECMOScore"].map( (y)=>toDomYCoord_Linear(height,minY,maxY,y) );
    let iNOStartDomX = iNO_byColumn_filtered["start"].map( (x)=>toDomXCoord_Linear(width,minX,maxX,x) );
    let iNOEndDomX = iNO_byColumn_filtered["end"].map( (x)=>toDomXCoord_Linear(width,minX,maxX,x) );
    let anetheticsStartDomX = anethetics_byColumn_filtered["start"].map( (x)=>toDomXCoord_Linear(width,minX,maxX,x) );
    let anetheticsEndDomX = anethetics_byColumn_filtered["end"].map( (x)=>toDomXCoord_Linear(width,minX,maxX,x) );
    // Clear plots
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    // Draw plot
    stepLinePlot(canvas,time_domXs,RespiratorySupportScore_domYs);
    stepLinePlot(canvas,time_domXs,ECMOScore_domYs);
  }
  
  // Data manip (cached)
  columnIndex_respiratoryScores = memoize_one( (respiratoryScores)=> {
    let times = respiratoryScores.map( ({time})=>time );
    let RespiratorySupportScores = respiratoryScores.map( ({RespiratorySupportScore})=>RespiratorySupportScore );
    let ECMOScores = respiratoryScores.map( ({ECMOScore})=>ECMOScore );
    return {time,RespiratorySupportScore,ECMOScore}
  });
  
  columnIndex_iNO = memoize_one( (iNO)=> {
    let starts = iNO.map( ({start})=>start );
    let ends = iNO.map( ({end})=>end );
    return {start,end};
  });
    
  columnIndex_anethetics = memoize_one( (anethetics)=> {
    let starts = anethetics.map( ({start})=>start );
    let ends = anethetics.map( ({end})=>end );
    return {start,end};
  });

  // Coordinate conv
  toDomXCoord(dataX){
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
  
  toDomYCoord(dataY) {
    let {minY,maxY,height} = this.props;
    return toDomYCoord_Linear(height,minY,maxY,dataY);
  }
}

export default RespPlot;
