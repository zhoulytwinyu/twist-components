import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomXCoord_Linear,
        applyCanvasStyle} from "plot-utils";
import ProcedurePlotMain from "./ProcedurePlotMain";
import ProcedurePlotSelection from "./ProcedurePlotSelection";
import ProcedurePlotTimeDiff from "./ProcedurePlotTimeDiff";
import ProcedurePlotClickSelectionAddon from "./ProcedurePlotClickSelectionAddon";
import ProcedurePlotHoverSelectionAddon from "./ProcedurePlotHoverSelectionAddon";

class ProcedurePlot extends PureComponent {
  render() {
    let { data, /*[{name,x}]*/
          selection, hoverX,
          minX,maxX,height,width,
          ...rest} = this.props;
    return (
      <>
        <ProcedurePlotMain  minX={minX} maxX={maxX}
                            width={width} height={height}
                            data={data}
                            {...rest}
                            />
        <ProcedurePlotSelection minX={minX} maxX={maxX}
                                width={width} height={height}
                                selection={selection}
                                hoverX={hoverX}
                                {...rest}
                                />
        <ProcedurePlotTimeDiff  selection={selection}
                                hoverX={hoverX}
                                minX={minX} maxX={maxX} width={width}
                                {...rest}
                                />
      </>
    );
  }
}

export default ProcedurePlot;

class ProcedurePlotAddon extends PureComponent {
  render() {
    let { data, /*[{name,x}]*/
          hoverX,hoverTimeStamp,
          clickDomX,clickDomY,clickTimeStamp,
          minX,maxX,height,width
          } = this.props;
    return (
      <>
        <ProcedurePlotClickSelectionAddon clickDomX={clickDomX} clickDomY={clickDomY} clickTimeStamp={clickTimeStamp}
                                          data={data}
                                          minX={minX} maxX={maxX} width={width} height={height}
                                          selectHandler={this.handleSelect}
                                          />
        <ProcedurePlotHoverSelectionAddon hoverX={hoverX} hoverTimeStamp={hoverTimeStamp}
                                          data={data}
                                          minX={minX} maxX={maxX} width={width} height={height}
                                          selectHandler={this.handleAutoSelect}
                                          />
      </>
    );
  }
  
  handleSelect = (selection)=>{
    let {selectHandler} = this.props;
    selectHandler({selection});
  }
  
  handleAutoSelect = (selection)=>{
    let {autoSelectHandler} = this.props;
    autoSelectHandler({selection});
  }
}

export {ProcedurePlotAddon};
