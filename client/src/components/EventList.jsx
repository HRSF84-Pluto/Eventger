import React, {Component} from 'react';
import {Item} from 'semantic-ui-react';
import Event from './Event';



class EventList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }
  handleUnsavedEvent(id){

  }
  handleSavedEvent(id){
    let currentArr = this.state.events.slice();
    const findEvent = this.props.eventsArray.filter((event)=> event.id === id);
    currentArr = currentArr.concat(findEvent);
    console.log(currentArr, "currentArr inside handleUnsavedEvent!!!!");
    this.setState({events: currentArr});
  }

  componentDidUpdate(){
    this.props.postSavedEvents(this.state.events);
  }

  render(){
    const list = this.props.eventsArray.map((event, i) =>
      <Event event={event} key={i} idx={i} handleSavedEvent={id=> this.handleSavedEvent(id)}
             handleUnsavedEvent={id=> this.handleUnsavedEvent(id)}

      />);
    return (
      <Item.Group divided style={{marginLeft: '100px'}}>
        {list}
      </Item.Group>
    );
  }
}

export default EventList;
