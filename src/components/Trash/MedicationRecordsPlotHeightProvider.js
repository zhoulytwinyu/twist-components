import React, { PureComponent } from 'react';

class GroupedUseMedicationsProvider extends PureComponent {
  constructor(props){
    super(props);
  }

  render() {
    let { Context,children,
          useMedications,
          rowHeight} = this.props;
    let height = useMedications.size*rowHeight;
    return  (
      <Context.Provider value={height}>
        {children}
      </Context.Provider>
    );
  }
}

export default GroupedUseMedicationsProvider;
