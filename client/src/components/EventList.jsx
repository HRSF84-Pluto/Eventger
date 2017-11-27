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
    console.log(currentArr, "currentArr inside handleSavedEvent!!!!");
    this.setState({savedEvents: currentArr});
  }

  componentDidUpdate(){
    this.props.postSavedEvents(this.state.savedEvents);
  }
  componentDidMount(){
    const username = JSON.parse(localStorage.getItem("main page options")).username;
    if (username !== 'Login'){
      $.ajax({
        url: '/saveEvent',
        method: 'GET',
        data: username,
        success: response => {
          console.log('success inside fetchSavedEvents: ', response);
          this.setState({savedEventsToFilter: response});
        },
        error: (err)=> {
          console.log('failure inside fetchSavedEvents: ');
          console.log(err);
        }
      });
    }else{
      this.setState({error: "Please login to see saved events"});
    }
  }


  render(){

      let targetArr = this.props.eventsArray;
    const list = targetArr.map((event, i) =>
      <Event savedView={false} event={event} key={i} idx={i} handleSavedEvent={id=> this.handleSavedEvent(id)}
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
