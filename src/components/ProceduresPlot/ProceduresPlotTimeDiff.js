import React, { PureComponent } from 'react';
import {toDomXCoord_Linear,
        fromDomXCoord_Linear} from "plot-utils";
import "./ProceduresPlotTimeDiff.css";
import leftArrow from "./leftArrow.svg";
import rightArrow from "./rightArrow.svg";

const INTERVAL_UNITS = [["yr",365*24*60*60*1000],
                                                  ["mon",30*24*60*60*1000],
                                                  ["day",24*60*60*1000],
                                                  ["hr",60*60*1000],
                                                  ["min",60*1000],
                                                  ["sec",1*1000],
                                                  ];

const ARROW_WIDTH =6;
const HEIGHT = 16;
const TEXT_WIDTH = 75;

class ProceduresPlotTimeDiff extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { data, /*[{name,start,end}]*/
          selection, 
          hoverDomX,
          minX,maxX,width,
          ...rest} = this.props;
    if (!hoverDomX || !selection || data.length===0) {
      return null;
    }
    this.render_memo = this.render_memo || {};
    let memo = this.render_memo;
    if (memo.data!==data) {
      memo.data = data;
      memo.normalizedData = {};
      for (let d of data) {
        memo.normalizedData[d.id] = d;
      }
    }
    let selectedObj = memo.normalizedData[selection];
    let selectionEndDomX = toDomXCoord_Linear(width,minX,maxX,selectedObj.end);
    let hoverX = fromDomXCoord_Linear(width,minX,maxX,hoverDomX);
    let timeDiffString = this.toPrettyInterval(hoverX-selectedObj.end);
    
    return (
      <div {...rest} className="ProcedurePlotTimeDiff-floatDiv">
        <img  style={{display:"block",position:"absolute",left:Math.min(hoverDomX,selectionEndDomX),width:ARROW_WIDTH,height:HEIGHT}}
              width={ARROW_WIDTH} height={HEIGHT}
              src={leftArrow} 
              alt="<"
              />
        <div  style={{position:"absolute",top:0,left:this.determineLabelDomX(hoverDomX,selectionEndDomX),width:TEXT_WIDTH,height:HEIGHT,
                      backgroundColor:"rgba(200,200,200,0.8)",textAlign:"center"}}>{timeDiffString}</div>
        <img  style={{position:"absolute",left:Math.max(hoverDomX,selectionEndDomX),marginLeft:-ARROW_WIDTH,width:ARROW_WIDTH,height:HEIGHT,
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
      return hoverDomX+ARROW_WIDTH;
    }
  }

  toPrettyInterval=function(unixMS){
    let output = "0 sec";
    let precision = 2;
    let prepend = '';
    if (unixMS<0){
      unixMS = -unixMS;
      prepend = '-';
    }
    
    for (let i=0,curPrecision=precision; i<INTERVAL_UNITS.length; i++){
      let unit = INTERVAL_UNITS[i][0];
      let value = INTERVAL_UNITS[i][1];
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

export default ProceduresPlotTimeDiff;


