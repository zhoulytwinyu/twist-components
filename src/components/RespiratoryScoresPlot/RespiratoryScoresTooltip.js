import React, {PureComponent} from "react"
import "./RespiratoryScoresTooltip.css"

const RSVToDisplay = {
    "RA":[],
    "NC":["NC_Flow","FiO2","iNO_Set"],
    "MASK":["MASK_Flow","FiO2"],
    "BB":["NC_Flow","FiO2"],
    "HFNC":["HFNC_Flow","FiO2","iNO_Set"],
    "CPAP":["CPAP_PEEP_comb","FiO2"],
    "BIPAP":["BIPAP_IPAP","BIPAP_EPAP","BIPAP_Rate","FiO2"],
    "PSV":["PEEP","PS","FiO2","iNO_Set","duration"],
    "PCV":["VT_set_norm","PIP_comb","PEEP","PS","VR","FiO2","iNO_Set","duration"],
    "VCV":["VT_set_norm","PEEP","PS","VR","FiO2","iNO_Set"],
    "HFOV":["HFOV_MPAW","HFOV_Amplitude","HFOV_Frequency","FiO2","iNO_Set"],
    "HFJV":["FiO2","HFJV_PEEP","HFJV_PIP","HFJV_Rate","iNO_Set"],
    "ECMO":["ECMO_Flow_norm"]
  }

const TITLE_COLOR = {
  "RA": "#A4D65E",
  "NC": "#A4D65E",
  "MASK": "#A4D65E",
  "BB": "#A4D65E",

  "HFNC": "#41B6E6",
  "CPAP": "#41B6E6",
  "BIPAP": "#41B6E6",

  "PSV": "#FBDB65",
  "PCV": "#FBDB65",
  "VCV": "#FBDB65",

  "HFOV": "#C6579A",
  "HFJV": "#C6579A",
  
  "ECMO": "#F6323E",
}


class RespiratoryScoresTooltip extends PureComponent {
  render() {
    let { data,
          selection,
          clientX,clientY,
          } = this.props
    if (selection===null || clientX===null || clientY === null) {
      return null
    }
    let {time} = selection
    let res = data.filter((row)=>row.time===time)
    if (res.length===0) {
      return
    }
    let record = res[0]
    let RSTRow =  <div className="RSTooltip-title">
                    <strong>{record.RST}</strong>
                    <span className="float-right RSTooltip-time">
                      {new Date(time).toLocaleString()}
                    </span>
                  </div>
    let ECMORow = record.ECMO_Flow_norm ?
                  <div className="RSTooltip-content">
                    <strong>ECMO_Flow</strong>
                    <span className="float-right">
                      {record.ECMO_Flow_norm}
                    </span>
                  </div> :
                  null
    let contentRows = RSVToDisplay[record.RST].map( V=>this.formatRow(V,record[V],V))
    
    return (
      <div style={{position:"fixed",zIndex:9999,top:clientY-50,left:10+clientX,pointerEvents:"none"}}>
        <div style={{width:200,backgroundColor:"rgba(0,0,0,0.3)",borderRadius:5,padding:0,margin:0,overflow:"hidden"}}>
          <div style={{backgroundColor:TITLE_COLOR[record.RST]}}>
            {RSTRow}
            {ECMORow}
          </div>
          {contentRows}
        </div>
      </div>
    )
  }
  
  formatRow(left,right,key){
    left = left || " "
    if (!right) {
      return null;
    }
    return (
      <div className="RSTooltip-content" key={key}>
        <strong>{left}</strong>
        <span className="float-right">
          {right}
        </span>
      </div>
    )
  }
}

export default RespiratoryScoresTooltip
