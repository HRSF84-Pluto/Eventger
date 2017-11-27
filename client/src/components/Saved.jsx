import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Item} from 'semantic-ui-react';
import $ from 'jquery';
import Event from './Event';

class Saved extends Component{
  constructor(props){
    super(props);
    this.state = {
      savedEvents: [],
      error: ''
    }
  }

  componentDidMount(){
    this.fetchSavedEvents();
  }
  fetchSavedEvents(){
    const username = JSON.parse(localStorage.getItem("main page options")).username;
    if (username !== 'Login'){
      $.ajax({
        url: '/saveEvent',
        method: 'GET',
        data: username,
        success: response => {
          //console.log('success inside fetchSavedEvents: ', response);
          this.setState({savedEvents: response});
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
    const savedEventsList = this.state.savedEvents.map((event, i) => {
      return (
        <Event savedView={true} event={event} key={i} idx={i}/>)
    });
    return (
      <div className='saved-events'>
        <h1>SAVED EVENTS</h1>
        <h3 style={{color: 'red'}}>{this.state.error}</h3>
        <div className='go-back-btn'><Link to='/EventsFeed'>To Events Feed</Link></div>
        <Item.Group divided style={{margin: '0 auto', width: '50%'}}>
          {savedEventsList}
        </Item.Group>
      </div>
    )
  }
}

export default Saved;
