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
    const {
      nba,
      nfl,
      restaurants,
      bar,
      coffee,
      danceClubs,
      museums,
      hike,
      comedyClubs,
      pop,
      country,
      rapHipHop} = options;

    const dataObj = {'rap/hip-hop': rapHipHop,
      'dance clubs': danceClubs, 'comedy clubs': comedyClubs,
      nba,
      nfl,
      restaurants,
      bar,
      coffee,
      museums,
      hike,
      pop,
      country,
    };
    const ticketMaster = [];
    console.log("is searchInput still accessible?: ", this.props.passDownSearchInput);
    console.log("is it in localStorage after page refreshes?");
    const myStorage = localStorage.getItem("main page options");
    console.log(JSON.parse(myStorage));




    // for (let key in dataObj){
    //   if (dataObj[key]){
    //     if (key)
    //
    //   }
    // }

    console.log(dataObj, "object inside handleFliterOptions");
    //this.handleDataFetch(options);
  }
//TODO: turns queryTermForYelp property into array of strings, not strings for garrett;
  handleDataFetch(options){
    let {location, activity, date, username} = this.props.passDownSearchInput;
    if (location !== '' || date !== '' || activity !== ''){
      localStorage.setItem("main page options", JSON.stringify(this.props.passDownSearchInput));
    }

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


