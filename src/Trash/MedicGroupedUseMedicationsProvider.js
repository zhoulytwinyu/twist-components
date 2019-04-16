import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";

class GroupedUseMedicationsProvider extends PureComponent {
  constructor(props){
    super(props);
  }

  render() {
    let { Context,children,
          medicationRecords, /* [name,start,end,validFrom,validTo, ...rest] */
          categoryStructure, /* [ node:{name,children:nodes} ] */
          minX,maxX} = this.props;
    let useMedications = this.getUseMedications(medicationRecords,categoryStructure,minX,maxX);
    return  (
      <Context.Provider value={useMedications}>
        {children}
      </Context.Provider>
    );
  }

  getUseMedications = memoize_one((medicationRecords,categoryStructure,minX,maxX)=>{
    let filteredMedicationRecords = medicationRecords.filter( ({start,end,validFrom,validTo}) =>
                                                                              ( !(end<minX || start>maxX) &&
                                                                                maxX-minX<=validTo &&
                                                                                maxX-minX>validFrom
                                                                                )
                                                              );
    let names = filteredMedicationRecords.map(({name})=>name);
    return new Set(names);
  });
}

export default GroupedUseMedicationsProvider;
