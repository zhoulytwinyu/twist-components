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
  }

  componentWillUnmount(){
    document.removeEventListener("mousemove",this.handleMouseMove,true)
    document.removeEventListener("mouseup",this.handleMouseUp,true)
  }
  
  handleMouseMove = (ev)=>{
    ev.stopPropagation()
    let {mouseMoveHandler} = this.props
    mouseMoveHandler(ev)
  }

  handleMouseUp = (ev)=>{
    ev.stopPropagation()
    let {mouseUpHandler} = this.props
    mouseUpHandler(ev)
  }
}


DragOverlay.propTypes = {
  cursor: PropTypes.string.isRequired,
  mouseMoveHandler: PropTypes.func.isRequired,
  mouseUpHandler: PropTypes.func.isRequired
}

export default DragOverlay
