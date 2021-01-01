import React, { Component } from 'react';
import {
  Button,
  DatePicker,
  Flex, FlexItem,
  Form, FormGroup,
  PageHeaderTools,
  Text, TextInput, TextVariants,
  TimePicker
} from '@patternfly/react-core';

import {retrieveData} from './utils.js';

export default class DateTimeSelector extends Component {
  constructor(props){
    super(props);

    const {datetimeRange} = props;
    const {start,end} = datetimeRange;
    this.state = {
      startDate: start,
      endDate: end,
    };
  }

  selectDate(isStart, str, d){
    let od = isStart ? this.state.startDate : this.state.endDate;
    od = new Date(od);

    d.setHours(od.getHours());
    d.setMinutes(od.getMinutes());

    if ( d instanceof Date && !isNaN(d) ){
      if (isStart){
        this.setState({startDate: d});
      }
      else{
        this.setState({endDate: d});
      }
    }
  }

  selectTime(isStart, str){
    let parts = str.split(':');

    let d = isStart ? this.state.startDate : this.state.endDate;
    d = new Date(d);

    let h=parseInt(parts[0]);
    let m=parseInt(parts[1]);

    d.setHours(h);
    d.setMinutes(m);

    if ( d instanceof Date && !isNaN(d) ){
      if(isStart){
        this.setState({startDate: d});
      }
      else{
        this.setState({endDate: d});
      }
    }
  }

  formatDate(d){
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  }

  formatTime(d){
    let h = d.getHours();
    let m = d.getMinutes();

    m = m >= 30 ? '30' : '00';

    return `${h.toString().padStart(2, '0')}:${m}`;
  }

  selectDTRange(){
    const {startDate,endDate} = this.state;
    const dtRange = {start: startDate, end: endDate};
    this.props.selectDatetimeRange(dtRange);
  }

  render(){
    let selectStartDate = (s,d)=>this.selectDate(true, s, d);
    let selectEndDate = (s,d)=>this.selectDate(false, s, d);
    let selectStartTime = (s)=>this.selectTime(true, s);
    let selectEndTime = (s)=>this.selectTime(false, s);
    let saveDatetimeRange = ()=>this.selectDTRange();

    const {startDate, endDate} = this.state;
    return (
      <PageHeaderTools>
        <Flex>
          <FlexItem><Text>From:</Text></FlexItem>
          <FlexItem>
            <DatePicker id="startDate" value={this.formatDate(startDate)} onChange={selectStartDate} />
          </FlexItem>
          <FlexItem>
            <TextInput
              isRequired
              type="time"
              id="startTime"
              value={this.formatTime(startDate)}
              onChange={selectStartTime}
            />
          </FlexItem>
          <FlexItem><Text>To:</Text></FlexItem>
          <FlexItem>
            <DatePicker id="endDate" value={this.formatDate(endDate)} onChange={selectEndDate} />
          </FlexItem>
          <FlexItem>
            <TextInput
              isRequired
              type="time"
              id="endTime"
              value={this.formatTime(endDate)}
              onChange={selectEndTime}
            />
          </FlexItem>
          <FlexItem>
            <Button variant="primary" onClick={saveDatetimeRange}>Set</Button>
          </FlexItem>
        </Flex>
      </PageHeaderTools>
    );
  }
}
