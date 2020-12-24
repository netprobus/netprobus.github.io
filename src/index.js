import React from 'react';
import ReactDOM from 'react-dom';
import {VegaLite} from 'react-vega';
import './index.css';

function retrieveData(url, caller, callback){
  return fetch(url)
  .then(response => {
    if(response.status >= 400){
      throw new Error(response.status + " " + response.body);
    }

    return response.json();
  })
  .then(json =>{
    callback(json);
  })
  .catch(error =>{
    console.log(error);
    caller.setState({
      feedback: "Error loading data from: " + url + "\nError was: " + error,
      isLoading: false
    });
  });
}

function Feedback(props){
  if (props.feedback){
    return(<div className="netprobe-feedback">{props.feedback}</div>);
  }

  return(<div className="netprobe-feedback">{props.isLoading ? "Please wait..." : ""}</div>);
}

function PingGraph(props){
  const pingSpec = {
    width: 400,
    height: 200,
    data: { name: 'table' },
    title: 'Ping Results',
    transform: [
      {"calculate": "round(100*datum.loss)", "as": "pct_loss"},
      {"calculate": "time(datum.tstamp)", "as": "time"},
    ],
    mark: 'area',
    encoding: {
      row: {field: 'host'},
      x: {
        field: 'tstamp',
        type: 'temporal',
        axis: {
          title: 'Time'
        }
      },
      y: {
        field: 'avg',
        type: 'quantitative',
        axis: {
          title: 'Average (ms)'
        }
      },
      color: {
        field: 'host',
        type: 'nominal',
        legend: null
      },
      tooltip: [
        {field: 'min', type: 'quantitative', title: "Min (ms)"},
        {field: 'avg', type: 'quantitative', title: "Avg (ms)"},
        {field: 'max', type: 'quantitative', title: "Max (ms)"},
        {field: 'pct_loss', type: 'quantitative', title: "Percent Loss"},
        {field: 'tstr', type: 'ordinal', title: "Time"},
        {field: 'tstamp', type: 'ordinal', title: "Timestamp"},
      ]
    },
  };

  if(props.data && props.data.length > 0){
    const data = {table: props.data};
    return(
      <div className="netprobe-graph">
        <VegaLite spec={pingSpec} data={data}/>
      </div>);
  }
  else{
    return(
      <div className="netprobe-graph-nodata">
      </div>);
  }
}

function SpeedGraph(props){
  const spec = {
    width: 400,
    height: 200,
    data: { name: 'table' },
    title: 'Network Speed Results',
    mark: 'area',
    encoding: {
      x: {
        field: 'tstamp',
        type: 'temporal',
        axis: {
          title: 'Time'
        }
      },
      tooltip: [
        {field: 'down_mbps', type: 'quantitative', title: "Down (Mbps)"},
        {field: 'up_mbps', type: 'quantitative', title: "Up (Mbps)"},
        {field: 'ping', type: 'quantitative', title: "Ping (ms)"},
        {field: 'tstr', type: 'ordinal', title: "Time"},
        {field: 'tstamp', type: 'ordinal', title: "Timestamp"},
      ]
    },
    layer: [
      {
        mark: {type: 'area', color: 'green'},
        encoding: {
          y: {
            field: 'down_mbps',
            type: 'quantitative',
            axis: {
              title: 'Mbps'
            }
          }
        }
      },
      {
        mark: {type: 'area', color: 'blue'},
        encoding: {
          y: {
            field: 'up_mbps',
            type: 'quantitative',
          }
        }
      }
    ],
  };

  if(props.data && props.data.length > 0){
    const data = {table: props.data};
    return(
      <div className="netprobe-graph">
        <VegaLite spec={spec} data={data}/>
      </div>);
  }
  else{
    return(
      <div className="netprobe-graph-nodata">
      </div>);
  }
}

function WiFiGraph(props){
  const spec = {
    width: 400,
    height: 200,
    data: { name: 'table' },
    title: 'WiFi Network Results',
    mark: {
      type: 'circle',
      opacity: 0.8,
      stroke: 'black',
      strokeWidth: 1,
    },
    encoding: {
      x: {
        field: 'chan',
        type: 'ordinal',
        axis: {
          title: 'Channel'
        }
      },
      y: {
        field: 'str',
        type: 'quantitative',
        axis: {
          title: 'Strength'
        }
      },
      color: {field: 'ssid', type: 'nominal'},
      // size: {
      //   field: 'str',
      //   type: 'quantitative',
      //   title: 'Network Strength',
      //   scale: {rangeMax: 100}
      // },
      tooltip: [
        {field: 'str', type: 'quantitative', title: "Strength"},
        {field: 'ssid', type: 'nominal', title: "SSID"},
        {field: 'chan', type: 'quantitative', title: "Channel"},
        {field: 'tstamp', type: 'ordinal', title: "Timestamp"},
      ]
    },
  };

  if(props.data && props.data.length > 0){
    const data = {table: props.data};
    return(
      <div className="netprobe-graph">
        <VegaLite spec={spec} data={data}/>
      </div>);
  }
  else{
    return(
      <div className="netprobe-graph-nodata">
      </div>);
  }
}

class NodeSelector extends React.Component {
  constructor(props){
    super(props);

    this.processChange = this.processChange.bind(this);
  }

  processChange(event){
    this.props.selector(event.target.value);
  }

  render(){
    const nodelist = this.props.nodes.map((node, idx)=>{
      return (
        <option value={node} key={idx}>{node}</option>
      )
    });

    if (nodelist && nodelist.length > 0){
      return (
        <div className="netprobe-nodes">
          <label>
            Select a node:
            <select name="nodes" id="node-selector" onChange={this.processChange}>
              <option value="NONE">---Please select a node---</option>
              {nodelist}
            </select>
          </label>
        </div>
      );
    }
    else{
      return (<div className="netprobe-nodes">No nodes are currently available. Please wait...</div>);
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNode: null,
      feedback: null,
      nodes: [],
      isLoading: false,
      pings: [],
      speeds: [],
    };
  }

  componentDidMount(){
    this.setState({isLoading: true, feedback: "Loading node list..."});
    const url =
      'https://us-central1-netprobeme.cloudfunctions.net/nodelist';

    retrieveData(url, this, nodes=>{
      this.setState({
        nodes: nodes,
        isLoading: false,
        feedback: null,
      });
    });
  }

  processNodeSelection(value) {
    let node;
    let index;
    this.state.nodes.forEach((n,i)=>{
      if (n === value){
        node = value;
        index = i;
      }
    });

    this.setState({
      selectedNode: index,
      feedback: 'Current node: ' + node,
      isLoading: true,
    });

    const url="https://us-central1-netprobeme.cloudfunctions.net/getNetprobeData?nodeId=" + node + "&dataset=";
    const pingPromise = retrieveData(url + "ping", this, pings=>{
      this.setState({
        pings: pings,
        feedback: "Ping data loaded.",
      });
    });

    const speedPromise = retrieveData(url + "speed", this, speeds=>{
      this.setState({
        speeds: speeds,
        feedback: "Network speed data loaded.",
      });
    });

    const wifiPromise = retrieveData(url + "wifi", this, wifis=>{
      this.setState({
        wifis: wifis,
        feedback: "WiFi networks loaded.",
      });
    });

    Promise.all([pingPromise, speedPromise, wifiPromise]).then((values)=>{
      this.setState({
        isLoading: false,
        feedback: "All data loaded for: " + node
      });
    })
  }

  render() {
    return (
      <div className="netprobe">
        <div className="netprobe-header">
          <NodeSelector
            nodes={this.state.nodes}
            selector={(value)=>this.processNodeSelection(value)}/>
        </div>
        <div className="netprobe-graphs">
          <PingGraph data={this.state.pings}/>
          <SpeedGraph data={this.state.speeds}/>
          <WiFiGraph data={this.state.wifis}/>
        </div>
        <div className="netprobe-status">
          <Feedback isLoading={this.state.isLoading} feedback={this.state.feedback}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);
