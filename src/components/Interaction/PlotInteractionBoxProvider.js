import React, { Component } from 'react';
import PlotInteractionBox from "./PlotInteractionBox";

class PlotInteractionBoxProvider extends Component {
  constructor(props){
    super(props);
    this.state = {hoveringPosition:null,
                  hoverEndPosition:null,
                  clickPosition:null,
                  doubleClickPosition:null,
                  selectingPositionStart:null,
                  selectingPositionEnd:null,
                  selectedPositionStart:null,
                  selectedPositionEnd:null,
                  panningPositionStart:null,
                  panningPositionEnd:null,
                  pannedPositionStart:null,
                  pannedPositionEnd:null
                  };
  }
  
  render(){
    let {render,...rest} = this.props;
    return (
      <PlotInteractionBox {...rest}
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

  handleHoverEnd = (hoverEndPosition)=>{
    this.setState({hoverEndPosition});
  }

  handleClick = (clickPosition)=>{
    this.setState({clickPosition});
  }
  
  handleDoubleClick = (doubleClickPosition)=>{
    this.setState({doubleClickPosition});
  }
  
  handleSelecting = (selectingPositionStart,selectingPositionEnd)=>{
    this.setState({ selectingPositionStart,
                    selectingPositionEnd});
  }
  
  handleSelected = (selectedPositionStart,selectedPositionEnd)=>{
    this.setState({ selectedPositionStart,
                    selectedPositionEnd});
  }
  
  handlePanning = (panningPositionStart,panningPositionEnd)=>{
    this.setState({ panningPositionStart,
                    panningPositionEnd});
  }
  
  handlePanned = (pannedPositionStart,pannedPositionEnd)=>{
    this.setState({ pannedPositionStart,
                    pannedPositionEnd});
  }
}


export default PlotInteractionBoxProvider;
