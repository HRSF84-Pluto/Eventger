import React, {Component} from 'react';
import {Item} from 'semantic-ui-react';
import $ from 'jquery';
import Event from './Event';



class EventList extends Component{
  constructor(props) {
    super(props);
    this.state = {
      savedEvents: [],
      savedEventsToFilter: []
    };
  }
  handleUnsavedEvent(id){

  }
  handleSavedEvent(id){
    let currentArr = this.state.savedEvents.slice();
    const findEvent = this.props.eventsArray.filter((event)=> event.id === id);
    currentArr = currentArr.concat(findEvent);
    this.setState({savedEvents: currentArr});
  }

  componentDidUpdate(){
    this.props.postSavedEvents(this.state.savedEvents);
  }
  componentDidMount(){

  }


  render(){
      let targetArr = this.props.eventsArray;
    const list = targetArr.map((event, i) =>
      <Event username={this.props.username} savedView={false} event={event} key={i} idx={i} handleSavedEvent={id=> this.handleSavedEvent(id)}
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
