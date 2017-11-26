import React, {Component} from 'react';
import {Item} from 'semantic-ui-react';
import Event from './Event';


//TODO: change class component to functional;
class EventList extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    const list = this.props.eventsArray.map((event, i) => <Event event={event} key={i} idx={i} />);
    return (
      <Item.Group divided style={{marginLeft: '100px'}}>
        {list}
      </Item.Group>
    );
  }
}

export default EventList;
