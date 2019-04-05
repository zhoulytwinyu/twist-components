import React, {PureComponent} from "react"

class Autosizer extends PureComponent {
  constructor(props){
    super(props)
    this.ref = React.createRef()
    this.state = {width:null,
                  height:null}
  }
  
  render (){
    let {render} = this.props
    let {width,height} = this.state
    return (
      <div ref={this.ref} style={{width:"100%",height:"100%"}}>
        {width || height ? render(width,height) : null }
      </div>
    )
  }
  
  componentDidMount(){
    let divElem = this.ref.current
    let {width,height} = divElem.getBoundingClientRect()
    this.setState({width,height})
  }
}

export default Autosizer
