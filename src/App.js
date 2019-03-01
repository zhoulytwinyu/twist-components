import React, { Component } from "react";
import RespPlotBundleConnector from "./connectors/RPlotConnector";
//import MedicationRecordBundleConnector from "./connectors/MedicationRecordBundleConnector";

class App extends Component {
  render() {
    return (
      <>
        <RespPlotBundleConnector />
        {/* <MedicationRecordBundleConnector /> */}
      </>
    );
  }
}

export default App;
