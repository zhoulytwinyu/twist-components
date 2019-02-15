import React, { Component } from "react";
import GraphControllerConnector from "./connectors/GraphControllerConnector";
import RespPlotBundleConnector from "./connectors/RPlotConnector";
//import LocationBundleConnector from "./connectors/LocationBundleConnector";
//import MedicationRecordBundleConnector from "./connectors/MedicationRecordBundleConnector";

class App extends Component {
  render() {
    return (
      <>
        <GraphControllerConnector />
        {/*<LocationBundleConnector />*/}
        <RespPlotBundleConnector />
        {/*<MedicationRecordBundleConnector />*/}
      </>
    );
  }
}

export default App;
