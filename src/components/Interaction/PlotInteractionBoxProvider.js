import React, { Component } from 'react';
import PlotInteractionBox from "./PlotInteractionBox";

class PlotInteractionBoxProvider extends Component {
  constructor(props){
    super(props);
    this.state = {hoveringPosition:undefined,
                  clickPosition:undefined,
                  doubleClickPosition:undefined,
                  selectingPositionStart:undefined,
                  selectingPositionEnd:undefined,
                  selectedPositionStart:undefined,
                  selectedPositionEnd:undefined,
                  panningPositionStart:undefined,
                  panningPositionEnd:undefined,
                  pannedPositionStart:undefined,
                  pannedPositionEnd:undefined
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

  handleHoverEnd = ()=>{
    this.setState({hoveringPosition:null});
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
                    selectedPositionEnd,
                    selectingPositionStart:null,
                    selectingPositionEnd:null
                    });
  }
  
  handlePanning = (panningPositionStart,panningPositionEnd)=>{
    this.setState({ panningPositionStart,
                    panningPositionEnd});
  }
  
  handlePanned = (pannedPositionStart,pannedPositionEnd)=>{
    this.setState({ pannedPositionStart,
                    pannedPositionEnd,
                    panningPositionStart:null,
                    panningPositionEnd:null});
  }
}


export default PlotInteractionBoxProvider;
