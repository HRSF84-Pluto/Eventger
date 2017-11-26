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
    let optionsObj = {};
    for (let key in dataObj){
      if (dataObj[key]){
        optionsObj[key] = key;
      }
    }
    console.log(optionsObj , "the new Object");

    console.log(dataObj, "object inside handleFliterOptions");
    this.handleDataFetch(optionsObj);
  }

  setDefaults(activity, location, date, username){
    if (activity === ''){ activity = 'group events';}
    if (location === ''){location = 'san francisco';}
    if (date === ''){date = new Date().toISOString();}
    return {date, location, activity, username};
  }
//TODO: turns queryTermForYelp property into array of strings, not strings for garrett;
  handleDataFetch(options){
     let objWithDefaults;
     const currentStorage = JSON.parse(localStorage.getItem("main page options"));
    if (this.props.passDownSearchInput.username === currentStorage.username && (this.props.passDownSearchInput.location === '' ||
        this.props.passDownSearchInput.activity === '' || this.props.passDownSearchInput.date === '')){
      const myStorage = localStorage.getItem("main page options");
      let storedMainPagePreferences = JSON.parse(myStorage);
      let {location, activity, date, username} = storedMainPagePreferences;
       objWithDefaults= this.setDefaults(activity, location, date, username);
    }else{
      let {location, activity, date, username} = this.props.passDownSearchInput;
      objWithDefaults = this.setDefaults(activity, location, date, username);
    }
    localStorage.setItem("main page options", JSON.stringify(objWithDefaults));

    let {activity, location, date, username} = objWithDefaults;


    const eventMapper = {
      "group events": {
        "queryTermForTM": ["music", "sports"],
        "queryTermForYelp": ["dance clubs", "bar"]
      },
      "family": {
        "queryTermForTM": ["music", "sports"],
        "queryTermForYelp": ["museums", "hike"]
      },
      "date night": {
        "queryTermForTM": ["music"],
        "queryTermForYelp": ["restaurant", "bar", "winery"]
      }
    };

    const preferenceForMusicOrLeague = [];
    const queryTermForTM = eventMapper[activity]["queryTermForTM"];
    let queryTermForYelp = eventMapper[activity]["queryTermForYelp"];
    if (options) {
      let optionsArr = Object.values(options);
      if (queryTermForTM.includes("music") || queryTermForTM.includes("sports")) {
        if (optionsArr.includes("nba")){
          preferenceForMusicOrLeague.push("nba");
          const indexOfItem = optionsArr.indexOf("nba");
          optionsArr.splice(indexOfItem,1);
        }
        if (optionsArr.includes("rap/hip-hop")){
          preferenceForMusicOrLeague.push("rap/hip-hop");
          const indexOfItem = optionsArr.indexOf("rap/hip-hop");
          optionsArr.splice(indexOfItem,1);
        }
        if (optionsArr.includes("nfl")){
          preferenceForMusicOrLeague.push("nfl");
          const indexOfItem = optionsArr.indexOf("nfl");
          optionsArr.splice(indexOfItem,1);
        }
        if (optionsArr.includes("pop")){
          preferenceForMusicOrLeague.push("pop");
          const indexOfItem = optionsArr.indexOf("pop");
          optionsArr.splice(indexOfItem,1);
        }
        if (optionsArr.includes("country")){
          preferenceForMusicOrLeague.push("country");
          const indexOfItem = optionsArr.indexOf("country");
          optionsArr.splice(indexOfItem,1);
        }

      }

      queryTermForYelp = optionsArr.concat(queryTermForYelp.filter(function (item) {
          return optionsArr.indexOf(item) < 0;
        }))

        console.log(queryTermForYelp, "new queryTermForYelp HERE!!!");
        console.log(preferenceForMusicOrLeague, "new preferenceForMusicOrLeague HERE!!!!!!");

    }

    const apiQueryObj = {
      'city': location,
      queryTermForTM,
      queryTermForYelp,
      preferenceForMusicOrLeague,
        'startDateTime': date
    };



    console.log("THE APIQUERYOBJ",apiQueryObj );

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
        if (ticketmaster && yelp) {
          eventsArray = eventsArray.concat(yelp).concat(ticketmaster).sort();
          this.setState({eventsArray});
          console.log(this.state.eventsArray, "result array inside ajax call");
        }else{
          ticketmaster ? this.setState({eventsArray: ticketmaster}) : this.setState({eventsArray: yelp}) ;
        }
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


