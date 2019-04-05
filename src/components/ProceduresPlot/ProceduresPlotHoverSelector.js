import { Component } from "react";
import {bisect_left} from "bisect";
import {fromDomXCoord_Linear} from "plot-utils";

const PROCEDURE_TYPE = {"HLHS STAGE I, CARDIAC":0,
                        "CHEST CLOSURE, CARDIAC OFF UNIT":2,
                        "GASTROSTOMY, LAPAROSCOPIC, GENSURG":0,
                        "VESICOSTOMY CREATION/CLOSURE, GU":2,
                        "BIDIRECTIONAL GLEN SHUNT, CARDIAC":1
                        };

class ProcedurePlotHoverSelector extends Component {
  render() {
    return null;
  }

  shouldComponentUpdate(nextProps,nextState){
    if (nextProps.hoveringPosition===this.props.hoveringPosition) {
      return false;
    }
    return true;
  }

  componentDidMount(){
    this.select();
  }
  
  componentDidUpdate(){
    this.select();
  }
  
  select() {
    let { data,
          minX,maxX,width,
          hoveringPosition,
          selectHandler} = this.props;
    if (hoveringPosition===undefined) {
      return;
    }
    if (hoveringPosition===null) {
      selectHandler(null);
      return;
    }
    this.select_memo = this.select_memo || {};
    let memo = this.select_memo;
    // Column index data and fill bitmaps etc.
    if (memo.data !== data ) {
      memo.data = data;
      memo.filteredData = data.filter(({name})=>PROCEDURE_TYPE[name]===0);
      memo.ends = memo.filteredData.map(({end})=>end);
    }
    if (memo.filteredData.length===0) {
      return;
    }
    // Filter
    let hoverX = fromDomXCoord_Linear(width,minX,maxX,hoveringPosition.domX);
    let index = Math.max(0,bisect_left(memo.ends,hoverX));
    let selection = memo.filteredData[index].id;
    selectHandler(selection);
  }
}

export default ProcedurePlotHoverSelector;
