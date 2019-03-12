import React, { PureComponent } from 'react';

class DocumentInteraction extends PureComponent {
  constructor(props){
    super(props);
    this.state = {event:null};
  }
  
  render() {
    null
  }

  componentDidMount(){
    document.addEventListener("mousemove",this.handleMouseMove);
    document.addEventListener("mouseup",this.handleMouseUp);
  }

  componentWillUnmount(){
    document.removeEventListener("mousemove",this.handleMouseMove);
    document.removeEventListener("mouseup",this.handleMouseUp);
  }
  
  handleMouseMove(ev){
    let {mouseMoveHandler} = this.props;
    mouseMoveHandler(ev.persist());
  }

  handleMouseUp(){
    let {mouseUpHandler} = this.props;
    mouseUpHandler(ev.persist());
  }
}

export default DocumentInteractionProvider;
