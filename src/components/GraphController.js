import React, { Component } from 'react';

class GraphController extends Component {
  constructor(props) {
    super(props);
    this.handleXChange = this.handleXChange.bind(this);
    this.handleYChange = this.handleYChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  
  render() {
    let {maxX,maxY,text} = this.props;
    return (
      <>
        <p>X</p> <input type="range" min={Math.round(Math.log(2000)/Math.log(10))} max={Math.log(3*60*1000)/Math.log(10)} value={`${Math.log(maxX)/Math.log(10)}`} step={0.01} onChange={this.handleXChange}/>
        <p>Y</p> <input type="range" min={0} max={1000} value={maxY} step={10} onChange={this.handleYChange}/>
        <p>Text</p> <input type="text" value={text} onChange={this.handleTextChange}/>
      </>
    );
  }
  
  handleXChange (ev) {
    let maxX = Math.pow(10,parseFloat(ev.target.value));
    this.props.changeHandler({maxX});
  }

  handleYChange (ev) {
    let maxY = parseFloat(ev.target.value);
    this.props.changeHandler({maxY});
  }
  
  handleTextChange (ev) {
    let text = ev.target.value;
    this.props.changeHandler({text});
  }
}

export default GraphController;
