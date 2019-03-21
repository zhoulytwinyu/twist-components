import React, { Component } from "react";
import RPlotConnector from "./connectors/RPlotConnector";
import MedicationRecordBundleConnector from "./connectors/MedicationRecordBundleConnector";

class App extends Component {
  render() {
    return (
      <>
        <RPlotConnector width={1000} height={400}/>
        Something goes here
        <MedicationRecordBundleConnector width={1000}/>
      </>
    );
  }
}

export default App;
