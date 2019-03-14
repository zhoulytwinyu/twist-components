import React, { PureComponent } from 'react';

class InteractionBox extends PureComponent {
  constructor(props){
    super(props);
    this.state={mode:"hovering"};
  }

  render() {
    if (this.state.mode === "hovering"){
      return (
        <>
          <div  ref={this.ref} {...rest}
                onMouseDown={this.handleMouseDown}
                >
          </div>
          <div className={"full-screen"+cursorStyle}>
          </div>
        </>
      );
    }
    if (this.state.mode === "hold"){
      return (
        <>
          <div  ref={this.ref} {...rest}
                onMouseDown={this.handleMouseDown}
                >
          </div>
          <DocumentInteraction handleMouseUp={this.}/>
          <div className={"full-screen"+cursorStyle}>
          </div>
        </>
      );
    }
    return null;
  }
  
  handleMouseDown= (ev)=>{
    this.setState({mode:"hold"});
  }

  handleMouseUp= (ev)=>{
    this.setState({mode:"hovering"});
  }
  
}

class DocumentInteraction extends PureComponent {
  constructor(props){
    super(props);
    this.state = {event:null};
  }
  
  render() {
    null
  }

  componentDidMount(){
    //document.addEventListener("mousemove",this.handleMouseMove);
    document.addEventListener("mouseup",this.handleMouseUp);
  }

  componentWillUnmount(){
    //document.removeEventListener("mousemove",this.handleMouseMove);
    document.removeEventListener("mouseup",this.handleMouseUp);
  }
  
  handleMouseMove(ev){
    let {mouseMoveHandler} = this.props;
    mouseMoveHandler(ev.persist());
  }

  handleMouseUp(ev){
    let {mouseUpHandler} = this.props;
    mouseUpHandler(ev);
  }
}
