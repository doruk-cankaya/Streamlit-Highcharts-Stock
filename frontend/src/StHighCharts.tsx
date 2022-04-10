/* eslint no-eval: 0 */

import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode} from "react"
// import React, { ReactNode , Component, useRef, useEffect} from "react"
// import { render } from 'react-dom';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import FullScreen from "highcharts/modules/full-screen.js";
import StockTools from "highcharts/modules/stock-tools.js";
import drilldown from "highcharts/modules/drilldown.js";
import AnnotationsModule from 'highcharts/modules/annotations';
// import DragablePoints from 'highcharts/modules/draggable-points';


import "./style.css";

Indicators(Highcharts);
DragPanes(Highcharts);
AnnotationsAdvanced(Highcharts);
PriceIndicator(Highcharts);
FullScreen(Highcharts);
StockTools(Highcharts);
drilldown(Highcharts);
AnnotationsModule(Highcharts);
// DragablePoints(Highcharts);

interface State {
  numClicks: number
  isFocused: boolean
  optionsss: object
  cizim: object
  annot: object
}

/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class StHighCharts extends StreamlitComponentBase<State> {


  public state = { numClicks: 0, isFocused: false , optionsss: {}, cizim: this.props.args["jdata"], annot: eval("annotations:"+this.props.args["annot"])}

  
  public render = (): ReactNode => {
    
    
    
    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`. Here, we access the "name" arg.
    const name = this.props.args["name"]
    const jdata = this.props.args["jdata"]
    // const annn = eval("annotations:"+this.props.args["annot"])
    // this.state.annot =[annotations[0]]

    // const cizikler = [annn[0]]
    // this.state.annot=cizikler
    // const chartComponent = useRef(null);
    // Streamlit sends us a theme object via props that we can use to ensure
    // that our component has visuals that match the active theme in a
    // streamlit app.
    var ohlc = [],
    volume = [],
    dataLength = jdata.length,
    groupingUnits = [[
      'day',                         // unit name
        [1]                             // allowed multiples
    ],[
      'week',                         // unit name
        [1]                             // allowed multiples
    ], [
        'month',
        [1]
    ]],
    i = 0;
    for (i; i < dataLength; i += 1) {
      ohlc.push([
          jdata[i][0], // the date
          jdata[i][1], // open
          jdata[i][2], // high
          jdata[i][3], // low
          jdata[i][4] // close
      ]);

      volume.push([
          jdata[i][0], // the date
          jdata[i][5] // the volume
      ]);
  }
    this.state.optionsss = {
      
      title: {
        text: name
      },
      chart: {
        height: (9 / 16 * 90) + '%',
        // zoomType: 'xy',
        panning: {
            enabled: true,
            type: 'x'
        },
        resetZoomButton: {
          position: {
              // align: 'right', // by default
              // verticalAlign: 'top', // by default
              x: -400,
              y: -30
          }
      }
        // panKey: 'shift'
      // zoomKey: 'alt',
      // zoomType: 'xy'
        // height: '40%'//(9 / 16 * 80) + '%',
        // width: 75 + '%',
      },
      credits: {
        enabled: false
      },
    //   mapNavigation: {
    //     enabled: true,
    //     enableButtons: false
    // },
      // style:{
      //   height: window.innerHeight + 310 + 'px'
      // },
      yAxis: [{
        // type: 'logarithmic',
        labels: {
            
            align: 'left'
        },
        height: '100%',
        resize: {
            enabled: true
        },
        gridLineWidth: 0,
      //   scrollbar: {
      //     enabled: true
      // }
    }, {
        labels: {
            align: 'left'
        },
        top: '90%',
        height: '10%',
        offset: 0
    }],
    xAxis:[{
      minRange: 30 * 24 * 3600 * 1000,
    },{
      minRange: 30 * 24 * 3600 * 1000,
    },
  ],
    series: [{
      type: 'candlestick',
      id: name.toLowerCase() + '-ohlc',
      name: name+' Stock Price',
      data: ohlc,
      dataGrouping: {
        units: groupingUnits
      }
  }, {
      type: 'column',
      id: name.toLowerCase() + '-volume',
      name: name+' Volume',
      data: volume,
      yAxis: 1,
      dataGrouping: {
        units: groupingUnits
      }
  }],
  colors: ["#C0392B", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
  plotOptions: {
    candlestick:{
      upColor: "#1E8449"
    }
  },
  tooltip: {
    shape: 'square',
    headerShape: 'callout',
    borderWidth: 0,
    valueDecimals: 2,
    style: {
      fontSize: "8px"
    },
    positioner: function () {
      return { x: 50, y: 35 };
  },
    shadow: false},
  responsive: {
      rules: [{
          condition: {
              maxWidth: 40
          },
          chartOptions: {
              
          }
      }]
  },
  rangeSelector: {
    inputEnabled: true,
    selected: 1
  },
  StockTools: {
    enabled: true
  },
  annotations: this.state.annot,

    };


    const { theme } = this.props
    const style: React.CSSProperties = {}

    // Maintain compatibility with older versions of Streamlit that don't send
    // a theme object.
    if (theme) {
      // Use the theme object to style our button border. Alternatively, the
      // theme style is defined in CSS vars.
      const borderStyling = `1px solid ${
        this.state.isFocused ? theme.primaryColor : "gray"
      }`
      style.border = borderStyling
      style.outline = borderStyling

      // for (const child of this.state.annot) {
      //   console.log(child);
      // }

      
      
      
      // console.log("Çizim için gönderilen seri:\n"+[(this.state.annot)])
      // eval("asd="+[this.props.args["annot"]])
      // eval("asd="+this.props.args["annot"])
      // console.log(typeof cizikler)
      // console.log(cizikler)
      console.log(typeof this.state.optionsss)
      console.log(this.state.optionsss)
      
      

    }


    return (
      <span>
          <div id="container">
            <HighchartsReact
              // ref = {chartComponent}
              highcharts={Highcharts}
              constructorType={'stockChart'}
              options={this.state.optionsss}
              asd = {this.props.args['chart']}
              onClick={this.onClicked}
            />

          <input value={this.state.annot} onChange={(e) => {this.onClicked()}}/>
          <button
          style={style}
          onClick={this.onClicked}>
            Kaydet
          </button>
          </div>
       
        {/* <button
          style={style}
          onClick={this.onClicked}
          // disabled={this.props.disabled}
          // onFocus={this._onFocus}
          // onBlur={this._onBlur}
        >
          Send Changes!
        </button> */}
      </span>
      
      
    )
  }
  
  /** Click handler for our "Click Me!" button. */
  public onClicked = (): void => {
    // Increment state.numClicks, and pass the new value back to
    // Streamlit via `Streamlit.setComponentValue`.
    // this.setState(
    //   prevState => ({ numClicks: prevState.numClicks + 1 }),
    //   () => Streamlit.setComponentValue(this.state.numClicks)
    // )
    
    // BUrası kkaydet butonuun işlevini göstermektedir
    this.setState(
      // prevState => ({definitions: HighchartsReact.}),
      // this.state.cizim= asd;
      
      () => Streamlit.setComponentValue(JSON.stringify(this.state.annot))
    )
    

  }

  // /** Focus handler for our "Click Me!" button. */
  // private _onFocus = (): void => {
  //   this.setState({ isFocused: true })
  // }

  // /** Blur handler for our "Click Me!" button. */
  // private _onBlur = (): void => {
  //   this.setState({ isFocused: false })
  // }
}









// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(StHighCharts)
