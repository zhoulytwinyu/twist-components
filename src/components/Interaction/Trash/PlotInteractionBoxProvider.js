import React, { Component } from 'react';
import PlotInteractionBox from "./PlotInteractionBox";

class PlotInteractionBoxProvider extends Component {
  constructor(props){
    super(props);
    this.state = {hoveringPosition:null,
                  clickPosition:null,
                  doubleClickPosition:null,
                  selectingPositions:null,
                  selectedPositions:null,
                  panningPositions:null,
                  pannedPositions:null
                  };
  }
  
  render(){
    let {render,width,height} = this.props;
    return (
      <PlotInteractionBox width={width}
                          height={height}
                          hoveringHandler={this.handleHovering}
                          hoverEndHandler={this.handleHoverEnd}
                          clickHandler={this.handleClick}
                          doubleClickHandler={this.handleDoubleClick}
                          selectingHandler={this.handleSelecting}
                          selectedHandler={this.handleSelected}
                          panningHandler={this.handlePanning}
                          pannedHandler={this.handlePanned}
                          >
        {render(this.state)}
      </PlotInteractionBox>
    );
  }

  handleHovering = (hoveringPosition)=>{
    this.setState({hoveringPosition});
  }

  handleHoverEnd = ()=>{
    this.setState({hoveringPosition:null});
  }

  handleClick = (clickPosition)=>{
    this.setState({clickPosition});
  }
  
  handleDoubleClick = (doubleClickPosition)=>{
    this.setState({doubleClickPosition});
  }
  
  handleSelecting = (selectingPositions)=>{
    this.setState({ selectingPositions });
  }
  
  handleSelected = (selectedPositions)=>{
    this.setState({ selectedPositions,
                    selectingPositions:null});
  }
  
  handlePanning = (panningPositions)=>{
    this.setState({ panningPositions });
  }
  
  handlePanned = (pannedPositions)=>{
    this.setState({ pannedPositions,
                    panningPositions:null});
  }
}


export default PlotInteractionBoxProvider;
