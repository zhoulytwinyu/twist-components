import {PureComponent} from "react"

class Logit extends PureComponent {
  render(){
    return null
  }
  
  componentDidMount(){
    this.logit()
  }
  
  componentDidUpdate(){
    this.logit()
  }
  
  logit(){
    console.log(this.props)
  }
}

export default Logit
