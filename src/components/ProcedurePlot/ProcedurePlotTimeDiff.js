import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomXCoord_Linear} from "plot-utils";
import "./ProcedurePlotTimeDiff.css";
import leftArrow from "./leftArrow.svg";
import rightArrow from "./rightArrow.svg";

const ARROW_WIDTH =6;
const HEIGHT = 16;
const TEXT_WIDTH = 75;

class ProcedurePlotTimeDiff extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { selection, /*{name,time}*/
          hoverX,
          minX,maxX,width,
          ...rest} = this.props;
    if (hoverX===null || hoverX===undefined || selection===null) {
      return null;
    }
    
    let selectionDomX = this.toDomXCoord(selection.time);
    let hoverDomX = this.toDomXCoord(hoverX);
    let timeDiffString = this.toPrettyInterval(hoverX-selection.time);
    
    return (
      <div {...rest} className="ProcedurePlotTimeDiff-contianer">
        <img  style={{display:"block",position:"absolute",left:Math.min(hoverDomX,selectionDomX),width:ARROW_WIDTH,height:HEIGHT}}
              width={ARROW_WIDTH} height={HEIGHT}
              src={leftArrow} 
              alt="<"
              />
        <div  style={{position:"absolute",top:0,left:this.determineLabelDomX(hoverDomX,selectionDomX),width:TEXT_WIDTH,height:HEIGHT,
                      backgroundColor:"rgba(200,200,200,0.8)",textAlign:"center"}}>{timeDiffString}</div>
        <img  style={{position:"absolute",left:Math.max(hoverDomX,selectionDomX),marginLeft:-ARROW_WIDTH,width:ARROW_WIDTH,height:HEIGHT,
                      preserveAspectRatio:"none"}}
              width={ARROW_WIDTH} height={HEIGHT}
              src={rightArrow}
              alt=">"
              />
      </div>
    );
  }
  
  determineLabelDomX(hoverDomX,selectionDomX) {
    if ( Math.abs(hoverDomX-selectionDomX)<TEXT_WIDTH+2*ARROW_WIDTH ) {
      return Math.max(hoverDomX,selectionDomX);
    }
    else if ( hoverDomX>selectionDomX ) {
      return hoverDomX-ARROW_WIDTH-TEXT_WIDTH;
    }
    else {
      return hoverDomX+10;
    }
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }

  toPrettyInterval=function(unixMS){
    let output = "0 sec";
    let precision = 2;
    let prepend = '';
    if (unixMS<0){
      unixMS = -unixMS;
      prepend = '-';
    }
    
    for (let i=0,curPrecision=precision; i<this.INTERVAL_UNITS.length; i++){
      let unit = this.INTERVAL_UNITS[i][0];
      let value = this.INTERVAL_UNITS[i][1];
      let num = Math.floor(unixMS/value);
      if (curPrecision===precision && num===0){
        continue;
      }
      else if (curPrecision === precision){
        output=num+unit;
        unixMS-=num*value;
        curPrecision-=1;
      }
      else {
        output+=","+num+unit;
        unixMS-=num*value;
        curPrecision-=1;
      }
      if (curPrecision===0){
        break;
      }
    }
    return prepend+output;
  };
}

ProcedurePlotTimeDiff.prototype.INTERVAL_UNITS = [["yr",365*24*60*60*1000],
                                                  ["mon",30*24*60*60*1000],
                                                  ["day",24*60*60*1000],
                                                  ["hr",60*60*1000],
                                                  ["min",60*1000],
                                                  ["sec",1*1000],
                                                  ];

export default ProcedurePlotTimeDiff;


