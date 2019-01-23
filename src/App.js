import React, { Component } from "react";
import GraphControllerConnector from "./connectors/GraphControllerConnector";
import RespPlotBundleConnector from "./connectors/RespPlotBundleConnector";
import MedicationRecordBundleConnector from "./connectors/MedicationRecordBundleConnector";

class App extends Component {
  render() {
    return (
      <>
        <GraphControllerConnector />
        <RespPlotBundleConnector width={1000} height={200}/>
        <MedicationRecordBundleConnector width={1000}/>
      </>
    );
  }
}

export default App;
