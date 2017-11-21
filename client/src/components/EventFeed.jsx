import React, {Component} from 'react';

import EventList from './EventList';
import SideBar from './SideBar';

class EventFeed extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="newsFeed">
        <SideBar/>
      <EventList/>
      </div>
    );
  }
}

export default EventFeed;
