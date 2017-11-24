import React, {Component} from 'react';

import EventList from './EventList';
import SideBar from './SideBar';

class EventFeed extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <div className="wrapper">
        <div className="box header"/>
        <div className="box sidebar">
          <SideBar username={this.props.username}/>
        </div>
        <div className="box content">
          <EventList/>
        </div>
        <div className="box footer"/>
      </div>
    );
  }
}

export default EventFeed;


