import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';


class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.dateSelection(this.state.startDate);
  }

  render() {
    return <DatePicker
      dateSelection={this.state.startDate}
      selected={this.state.startDate}
      onChange={date => this.setState({startDate: date}, this.handleChange)}
    />;
  }
}

export default Calendar;
