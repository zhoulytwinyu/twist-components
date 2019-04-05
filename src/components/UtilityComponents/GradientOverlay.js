import React, {PureComponent} from "react"

class GradientOverlay extends PureComponent {
  render(){
    let {style,...rest} = this.props
    return (
      <div style={{ ...style,
                    backgroundImage:"linear-gradient(to right, black , rgba(0,0,0,0))",
                    opacity:0.5,
                    pointerEvents:"none"}}
           {...rest}>
      </div>
    )
  }
}

export default GradientOverlay
