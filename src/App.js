import React, { Component } from "react";
import RespPlotBundleConnector from "./connectors/RespPlotBundleConnector";
import GraphControllerConnector from "./connectors/GraphControllerConnector";

class App extends Component {
  render() {
    return (
      <>
        <GraphControllerConnector />
        <RespPlotBundleConnector width={1000} height={200}/>
      </>
    );
  }
}

export default App;
