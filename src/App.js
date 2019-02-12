import React, { Component } from "react";
import GraphControllerConnector from "./connectors/GraphControllerConnector";
import RespPlotBundleConnector from "./connectors/RPlotConnector";
import LocationBundleConnector from "./connectors/LocationBundleConnector";
import MedicationRecordBundleConnector from "./connectors/MedicationRecordBundleConnector";

class App extends Component {
  render() {
    return (
      <>
        <GraphControllerConnector />
        <LocationBundleConnector width={1000} height={50} />
        <RespPlotBundleConnector width={1000} height={200} />
        <MedicationRecordBundleConnector width={1000}/>
      </>
    );
  }
}

export default App;
