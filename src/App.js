import React, { Component } from "react";
import MedicationRecordsPlotBundleConnector from "./connectors/MedicationRecordsPlotBundleConnector";
import BloodPressurePlotBundleConnector from "./connectors/BloodPressurePlotBundleConnector";
import RespiratoryScoresPlotBundleConnector from "./connectors/RespiratoryScoresPlotBundleConnector";

class App extends Component {
  render() {
    return (
      <>
        <RespiratoryScoresPlotBundleConnector width={1000} height={300}/>
        Something goes here
        <MedicationRecordsPlotBundleConnector width={1000}/>
        Some other things go here
        <BloodPressurePlotBundleConnector width={1000} height={300} />
      </>
    );
  }
}

export default App;
