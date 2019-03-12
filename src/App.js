import React, { Component } from "react";
import RespPlot from "./connectors/RPlotConnector";
import MedicationRecordBundleConnector from "./connectors/MedicationRecordBundleConnector";

class App extends Component {
  render() {
    return (
      <>
        <RespPlot width={1000} height={400}/>
        <MedicationRecordBundleConnector width={1000}/>
      </>
    );
  }
}

export default App;
