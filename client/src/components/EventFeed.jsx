import React, {Component} from 'react';
import $ from 'jquery';
import EventList from './EventList';
import SideBar from './SideBar';



class EventFeed extends Component{
  constructor(props) {
    super(props);
    this.state= {eventsArray: []}
  }
  componentDidMount(){
    this.handleDataFetch();
  }
  handleFilterOptions(options){
    console.log(options, ": options inside handleFilterOptions");
    //this.handleDataFetch(options);
  }
//TODO: turns queryTermForYelp property into array of strings, not strings for garrett;
  handleDataFetch(options){
    let {location, activity, date} = this.props.passDownSearchInput;
    if (activity === ''){ activity = 'group events';}
    if (location === ''){location = 'seattle';}
    if (date === ''){date = new Date().toISOString();}
    if (options){}
    const eventMapper = {
      "group events": {
        "queryTermForTM": ["music", "sports"],
        "queryTermForYelp": "dance clubs"
      },
      "family": {
        "queryTermForTM": ["music", "sports"],
        "queryTermForYelp": "museums"
      },
      "date night": {
        "queryTermForTM": ["music"],
        "queryTermForYelp": "restaurant"
      }
    };

    const queryTermForTM = eventMapper[activity]["queryTermForTM"];
    const queryTermForYelp = eventMapper[activity]["queryTermForYelp"];

    const apiQueryObj = {
      'city': location,
      queryTermForTM,
      queryTermForYelp,
      'startDateTime': date
    };

    $.ajax({
      url: '/eventData',
      type: 'POST',
      data: JSON.stringify(apiQueryObj),
      contentType: 'application/json',
      success: response => {
        console.log('response inside handleSearchInput', response);
        const ticketmaster = response['ticketmaster'];
        const yelp = response['yelp'];
        let eventsArray = [];
        eventsArray = eventsArray.concat(yelp).concat(ticketmaster).sort();
        this.setState({eventsArray});
        console.log(this.state.eventsArray, "result array inside ajax call");
      },
      error: (xhr, status, error) => {
        console.log('err inside handleSearchInput', xhr, status, error);
      }
    });
  }
  render(){
    return (
      <div className='wrapper'>
        <div className='box header'/>
        <div className='box sidebar'>
          <SideBar handleFilterOptions={(options)=> this.handleFilterOptions(options)} username={this.props.username}/>
        </div>
        <div className='box content'>
          <EventList eventsArray={this.state.eventsArray}/>
        </div>
        <div className='box footer'/>
      </div>
    );
  }
}

export default EventFeed;


