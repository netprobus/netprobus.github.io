import regeneratorRuntime from "regenerator-runtime";
import React, { Component } from 'react';
import {
  Card, CardBody, CardTitle, CardFooter,
  Flex, FlexItem,
  Spinner,
  Tabs, Tab, TabTitleText,
  Text, TextInput, TextVariants
} from '@patternfly/react-core';
import {Vega} from 'react-vega';

import {retrieveData, formatGraphUrl} from './utils.js';

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

const speedSpec = {
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

const wifiSpec = {
  width: 400,
  height: 200,
  data: { name: 'table' },
  title: 'WiFi Network Results',
  mark: 'circle',
  selection: {
      grid: {
        type: "interval",
        bind: "scales"
      }
    },
  encoding: {
    x: {
      field: 'chan',
      type: 'ordinal',
      axis: {
        title: 'Channel'
      },
    },
    y: {
      field: 'str',
      type: 'quantitative',
      axis: {
        title: 'Strength'
      },
      scale: {domain: [0, 100]}
    },
    color: {field: 'ssid', type: 'nominal'},
    size: {
      field: 'str',
      type: 'quantitative',
      title: 'Network Strength',
      scale: {rangeMax: 100}
    },
    tooltip: [
      {field: 'str', type: 'quantitative', title: "Strength"},
      {field: 'ssid', type: 'nominal', title: "SSID"},
      {field: 'chan', type: 'quantitative', title: "Channel"},
      {field: 'tstamp', type: 'ordinal', title: "Timestamp"},
    ]
  },
};

class Graph extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      spec: props.spec,
      dataset: props.dataset,
      data: null,
    }
  }

  reload(){
    // console.log("Mounted graph component");
    this.setState({isLoading: true});

    const {dataset} = this.state;
    const {node, datetimeRange} = this.props;
    const url = formatGraphUrl(node, dataset, datetimeRange);
    // console.log(`Loading: ${url}`);

    retrieveData(url, this, data=>{
      this.setState({
        data: data,
        isLoading: false,
      });
    });
  }

  componentDidMount(){
    // console.log("Loading graph");
    this.reload();
  }

  componentDidUpdate(prevProps, prevState){
    if (prevProps !== null && (this.props.node !== prevProps.node ||
        this.props.datetimeRange.start !== prevProps.datetimeRange.start ||
        this.props.datetimeRange.end !== prevProps.datetimeRange.end )) {

        // console.log("Reloading graph");
        this.reload();
    }
  }

  render(){
    // console.log("Rendering graph");
    const {spec, isLoading} = this.state;
    let {data} = this.state;

    let Content;
    if (isLoading){
        Content = (<Spinner/>);
    }
    else if(data && data.length > 0){
      data = {table: data};
      Content = (<Vega spec={spec} data={data}/>);
    }
    else{
      Content = (<Text>No Data.</Text>);
    }

    return(
      <Card>
        <CardBody>{Content}</CardBody>
      </Card>
    );
  }
}

export default class Graphs extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeTabKey: 0,
    }

    this.handleTabClick = (event, tabIndex) => {
      this.setState({
        activeTabKey: tabIndex
      });
    };
  }

  render(){
    const {node, datetimeRange} = this.props;

    return (
      <Tabs activeKey={this.state.activeTabKey} isBox={false} onSelect={this.handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Ping Latencies</TabTitleText>}>
          <Graph
            dataset={"ping"}
            spec={pingSpec}
            node={node}
            datetimeRange={datetimeRange}
          />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Speedtest.net Results</TabTitleText>}>
          <Graph
            dataset={"speed"}
            spec={speedSpec}
            node={node}
            datetimeRange={datetimeRange}
          />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Available WiFi Networks</TabTitleText>}>
          <Graph
            dataset={"wifi"}
            spec={wifiSpec}
            node={node}
            datetimeRange={datetimeRange}
            />
        </Tab>
      </Tabs>
    );
  }
}
