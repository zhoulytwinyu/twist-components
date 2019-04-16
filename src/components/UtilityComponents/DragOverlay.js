import React, { PureComponent } from "react"
import PropTypes from 'prop-types'
// CSS
import "./DragOverlay.css"

class DragOverlay extends PureComponent {
  render() {
    let { cursor} = this.props
    return <div className="fullscreen" style={{cursor:cursor}}></div>
  }

  componentDidMount(){
    document.addEventListener("mousemove",this.handleMouseMove,true)
    document.addEventListener("mouseup",this.handleMouseUp,true)
    //document.addEventListener("DOMMouseScroll",this.ignoreScroll)
  }

  componentWillUnmount(){
    document.removeEventListener("mousemove",this.handleMouseMove,true)
    document.removeEventListener("mouseup",this.handleMouseUp,true)
    //document.removeEventListener("DOMMouseScroll",this.ignoreScroll)
  }
  
  handleMouseMove = (ev)=>{
    ev.preventDefault();
    ev.stopPropagation()
    let {mouseMoveHandler} = this.props
    mouseMoveHandler(ev)
  }

  handleMouseUp = (ev)=>{
    ev.preventDefault();
    ev.stopPropagation()
    let {mouseUpHandler} = this.props
    mouseUpHandler(ev)
  }
  
  ignoreScroll(ev){
    ev.preventDefault();
    ev.stopPropagation();
  }
}


DragOverlay.propTypes = {
  cursor: PropTypes.string.isRequired,
  mouseMoveHandler: PropTypes.func.isRequired,
  mouseUpHandler: PropTypes.func.isRequired
}

export default DragOverlay
