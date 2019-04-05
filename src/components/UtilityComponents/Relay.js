import {Component} from "react"

class Relay extends Component{
  constructor(props){
    super(props)
    this.lastData = null
  }
  
  render(){
    return null
  }

  componentDidMount(){
    this.update()
  }
  
  componentDidUpdate(){
    this.update()
  }

  update(){
    let {updateHandler,data} = this.props
    if (this.lastData===data) {
      return
    }
    this.lastData = data
    updateHandler(data)
  }
}

export default Relay
