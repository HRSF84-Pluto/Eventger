import React, {Component} from 'react';
import Event from './Event';

class EventList extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    const list = [1, 2, 3, 4, 5, 6].map((event, i) => <Event event={event} key={i} idx={i} />);
    return (
      <div>
        {list}
      </div>
    );
  }
}

export default EventList;
