import React, {Component} from 'react';


class Event extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='event' key={this.props.idx}>
        <h1> Event number: {this.props.event}</h1>
      </div>
    );
  }
}

export default Event;
