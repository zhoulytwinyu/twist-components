import React, { PureComponent } from "react";
import { connect } from "react-redux";

class Test extends PureComponent {
  render() {
    let {store} = this.props;
    return <div>{JSON.stringify(store)}</div>;
  }
}

const mapStateToProps = function (state) {
  return {
    store:state
  };
};


const TestConnector = connect(
  mapStateToProps,
  null
)(Test);

export default TestConnector

