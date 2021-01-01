import React, { Component } from 'react';
import {
  Alert, AlertActionCloseButton,
  Brand,
  DatePicker,
  Form, FormGroup,
  Nav, NavExpandable, NavItem, NavItemSeparator, NavList, NavGroup,
  PageNavigation,
  Text, TextVariants,
  TimePicker
} from '@patternfly/react-core';

import {retrieveData} from './utils.js';

export default class NodeSelector extends Component {
  constructor(props){
    super(props);
    this.state = {
      nodes: this.props.nodes || [],
      isLoading: true,
      activeNode: null,
    };
  }

  componentDidMount(){
    this.setState({isLoading: true});
    const url =
      'https://us-central1-netprobeme.cloudfunctions.net/nodelist';

    retrieveData(url, this, nodes=>{
      this.setState({
        nodes: nodes,
        isLoading: false,
      });
    });
  }

  render(){
    const {onNodeSelect} = this.props;

    const nodelist = this.state.nodes.map((node, idx)=>{
      return (
        <NavItem to={'#' + node} itemId={node} isActive={this.state.activeNode === '#' + node} key={idx}>{node}</NavItem>
      )
    });

    let NodeLinks;
    if (nodelist && nodelist.length > 0){
      return (<Nav onSelect={onNodeSelect}><NavGroup title="Available Nodes"><NavList>{nodelist}</NavList></NavGroup></Nav>);
    }
    else{
      return (<Nav><Text component={TextVariants.small}>Loading nodes...</Text></Nav>);
    }
  }
}
