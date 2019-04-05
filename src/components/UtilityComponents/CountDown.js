import {PureComponent} from "react"

class CountDown extends PureComponent{
  render(){
    return null
  }
  
  componentDidMount(){
    let {timeout,callback} = this.props
    this.timeout = setTimeout(callback,timeout)
  }

  componentDidUpdate(){
    clearTimeout(this.timeout)
    let {timeout,callback} = this.props
    this.timeout = setTimeout(callback,timeout)
  }

  componentWillUnmount(){
    clearTimeout(this.timeout)
  }
}

export default CountDown
