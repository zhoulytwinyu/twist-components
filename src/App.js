import React, { Component } from "react";
import RespPlot from "./connectors/RPlotConnector";
import MedicationRecordBundleConnector from "./connectors/MedicationRecordBundleConnector";
import Test from "./connectors/Test";

class App extends Component {
  render() {
    return (
      <>
        {/*<RespPlot width={1000} height={400}/>*/}
        {/*<MedicationRecordBundleConnector width={1000}/>*/}
        <Test />
      </>
    );
  }
}

export default App;
