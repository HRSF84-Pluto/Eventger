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
  handleSavedEvents(savedEventsArr){
    const username =this.props.username;
    savedEventsArr = JSON.stringify(savedEventsArr);
    if (username !== 'Login'){
      const data = {username, events: savedEventsArr};
      $.ajax({
        url: '/saveEvent',
        method: 'POST',
        data: data,
        success: response => {
          console.log('Successful saving of event', response);
        },
        error: () => {
          console.log('there\'s no active session, please login');
        }
      })
    }
  }
  handleFilterOptions(options,price){

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
      rap} = options;

    const dataObj = {
      rap,
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

    this.handleDataFetch(optionsObj, price);
  }

  setDefaults(activity, location, date, username){
    if (activity === ''){ activity = 'group events';}
    if (location === ''){location =  94102;}
    if (date === ''){date = new Date().toISOString();}
    return {date, location, activity, username};
  }

  handleDataFetch(options, price='$$'){
     let objWithDefaults;
     //uses local storage to remember the user's most recent search parameters
     const currentStorage = JSON.parse(localStorage.getItem("main page options"));
    let storageLocation;
    if (currentStorage.location){
      storageLocation = currentStorage.location;
     }

     //reassigns values to the properties of the api query object
    //the api query object with be sent below
    if (this.props.passDownSearchInput.username === currentStorage.username &&
      (this.props.passDownSearchInput.location === '' ||
        this.props.passDownSearchInput.activity === '' || this.props.passDownSearchInput.date === '')){
      const myStorage = localStorage.getItem("main page options");
      let storedMainPagePreferences = JSON.parse(myStorage);
      let {location, activity, date, username} = storedMainPagePreferences;
      if (this.props.passDownSearchInput.location !== ''){
        location = this.props.passDownSearchInput.location;
      }
      if (this.props.passDownSearchInput.date !== ''){
        date = this.props.passDownSearchInput.date;
      }
      if (this.props.passDownSearchInput.activity !== ''){
        activity = this.props.passDownSearchInput.activity;
      }
       objWithDefaults= this.setDefaults(activity, location, date, username);
    }else{
      let {location, activity, date, username} = this.props.passDownSearchInput;
      objWithDefaults = this.setDefaults(activity, location, date, username);
    }
    //reassigns object stored in localStorage;
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

    //assigns preferences to preferenceForMusicOrLeague object sent to api helper
    if (options) {
      let optionsArr = Object.values(options);
      if (queryTermForTM.includes("music") || queryTermForTM.includes("sports")) {
        if (optionsArr.includes("nba")){
          preferenceForMusicOrLeague.push("nba");
          const indexOfItem = optionsArr.indexOf("nba");
          optionsArr.splice(indexOfItem,1);
        }
        if (optionsArr.includes("rap")){
          preferenceForMusicOrLeague.push("rap");
          const indexOfItem = optionsArr.indexOf("rap");
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
    }

    let apiQueryObj =  {
      location,
      queryTermForTM,
      queryTermForYelp,
      'startDateTime': date,
      preferenceForMusicOrLeague,
      price
    };

    if (preferenceForMusicOrLeague.length > 0){
      apiQueryObj['preferenceForMusicOrLeague'] = preferenceForMusicOrLeague;
    }

    console.log("THE APIQUERYOBJ",apiQueryObj );
    //resetting location in storage object to the one set at signup
    let storageObj = JSON.parse(localStorage.getItem("main page options"));
    storageObj['location'] = storageLocation;
    localStorage.setItem("main page options", JSON.stringify(storageObj));

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
          console.log(this.state.eventsArray, "fetched events array returned from api helper");
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
          <SideBar handleFilterOptions={(options, price)=> this.handleFilterOptions(options, price)} username={this.props.username}/>
        </div>
        <div className='box content'>
          <EventList  postSavedEvents={(savedEventsArr)=> this.handleSavedEvents(savedEventsArr)}
                      username={this.props.username}
                      eventsArray={this.state.eventsArray}/>
        </div>
        <div className='box footer'/>
      </div>
    );
  }
}

export default EventFeed;


