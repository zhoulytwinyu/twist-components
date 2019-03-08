import React, {PureComponent} from "react";

class MyProvider extends PureComponent {
  render(){
    let {Context,value1,value2,children} = this.props;
    let derived = value1*value2;
    return (
      <Context.Provider value={derived} >
        {children}
      </Context.Provider>
    );
  }
}

class Display extends PureComponent {
  render(){
    let {value} = this.props;
    console.log("12#!23");
    return (
      <div>{value}</div>
    );
  }
}


class Test extends PureComponent {
  constructor(props){
    super(props);
    this.state = {b:null,c:null};
    this.setState = this.setState.bind(this);
    this.MyContext = React.createContext();
  }

  render (){
    console.log("render");
    let {DisplayWithContext} = this;
    let {MyContext} = this;
    return (
      <>
        "asdasda"
        <MyProvider Context={MyContext} value1={1} value2={3}>
          <MyContext.Consumer>
            {v => <Display value={v}/>}
          </MyContext.Consumer>
        </MyProvider>
      </>
    );
  }
}

export default Test;
