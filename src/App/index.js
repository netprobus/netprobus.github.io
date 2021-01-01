import './app.css';
import logoPng from './logo4.png';

import regeneratorRuntime from "regenerator-runtime";
import React, { Component } from 'react';
import {
  Alert, AlertActionCloseButton,
  Brand, Button,
  Flex, FlexItem,
  Nav, NavExpandable, NavItem, NavItemSeparator, NavList, NavGroup,
  Page, PageHeader, PageHeaderTools, PageSidebar, PageSection, PageSectionVariants,
  Popover,
  DatePicker, TimePicker,
  Text, TextContent, TextList, TextListItem, TextListItemVariants, TextListVariants, TextVariants
} from '@patternfly/react-core';
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';

import NodeSelector from './NodeSelector.js';
import DateTimeSelector from './DateTimeSelector.js';
import Graphs from './Graphs.js';


export default class App extends Component {
  constructor(props) {
    super(props);

    let hash = window.location.hash;
    if(hash && hash.toString().length > 1){
      hash = hash.toString();
      hash = hash.substring(1,hash.length);
    }
    else{
      hash = null;
    }

    const e = new Date();

    let s = new Date();
    s.setHours(e.getHours()-6);
    this.state = {
      isNavOpen: true,
      node: hash,
      datetimeRange: {
        start: s,
        end: e,
      }
    };
    this.onNavToggle = () => {
      this.setState({
        isNavOpen: !this.state.isNavOpen,
      });
    };
  }

  updateNode(v){
    this.setState({node: v});
  }

  updateDatetimeRange(dtRange){
    this.setState({datetimeRange: dtRange});
  }

  render() {
    const { isNavOpen, datetimeRange } = this.state;

    const logoProps = {
      href: 'https://netprob.us',
      onClick: () => console.log('clicked logo'),
      target: '_blank'
    };

    const Header = (
      <PageHeader
        logo={<Brand src={logoPng}/>}
        logoProps={logoProps}
        headerTools={<DateTimeSelector datetimeRange={datetimeRange} selectDatetimeRange={(dtRange)=>this.updateDatetimeRange(dtRange)} />}
        showNavToggle
        isNavOpen={isNavOpen}
        onNavToggle={this.onNavToggle}
      />
    );

    const ctrls = (<NodeSelector onNodeSelect={(selection)=>this.updateNode(selection.itemId)} />);

    const Sidebar = (
      <PageSidebar nav={ctrls} isNavOpen={isNavOpen} />
    );

    const CurrentSettings = (
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>Node</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{this.state.node}</TextListItem>

          <TextListItem component={TextListItemVariants.dt}>From</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{this.state.datetimeRange.start.toLocaleString()}</TextListItem>

          <TextListItem component={TextListItemVariants.dt}>To</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{this.state.datetimeRange.end.toLocaleString()}</TextListItem>
        </TextList>
      </TextContent>
    );

    return (
      <Page header={Header} sidebar={Sidebar}>
        <PageSection variant={PageSectionVariants.dark}>
          <Popover
              aria-label="Current settings"
              headerContent={<div>Current Settings</div>}
              bodyContent={CurrentSettings}>
            <Button variant="link" icon={<PlusCircleIcon />}>Current Settings</Button>
          </Popover>
        </PageSection>
        <PageSection variant={PageSectionVariants.light}>
          <Graphs node={this.state.node} datetimeRange={this.state.datetimeRange} />
        </PageSection>
      </Page>
    );
  }
}
