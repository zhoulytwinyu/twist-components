import {Component} from "react";
import {toDomXCoord_Linear} from "plot-utils";

class VerticalCrosshairSelector extends Component {
  render(){
    return null;
  }

  componentDidMount(){
    this.select();
  }

  componentDidUpdate(){
    this.select();
  }

  select(){
    let { hoverPosition,selectHandler,
          width,minX,maxX} = this.props;
    selectHandler(toDomXCoord_Linear(width,minX,maxX,hoverPosition.domX));
  }
}

export default VerticalCrosshairSelector;
