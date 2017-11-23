import React, {Component} from 'react';


class Event extends Component{
  constructor(props) {
    super(props);
    this.state={
      className: "big bookmark icon"
    }
  }
  handleSavedEvent(key){
    console.log("item key", key);
    //key would hold the id or something that identifies the entry to be saved in the db
    if (this.state.className ==="big bookmark icon saved-bookmark" ){
      this.setState({className: "big bookmark icon"});
    }else{
      this.setState({className: "big bookmark icon saved-bookmark"});
    }

  }

  render() {
    return (
      <div className='event' key={this.props.idx}>
        <div className="ui small rounded image">
          <img src="http://placecorgi.com/260/180"/>
        </div>
        <div className="event-info">
        <p> Event details {this.props.event}</p>
          <p><a href="https://www.reddit.com/r/puppies/" target="_blank">Event Link</a></p>
          <div className="ui small icon buttons">
            <button className="ui button">
              <i onClick={this.handleSavedEvent.bind(this, this.props.idx)} className={this.state.className}/>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Event;
