import React, {Component} from 'react';
import Calendar from './Calendar';



class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {location: ''};
  }
  handleLocationInput(e){
    this.setState({location: e.target.value});
  }
  render() {
    return (
      <div className="ui action input">
        <input type="text" placeholder="Enter Location" onChange={e => this.handleLocationInput(e)} />
        <div role="listbox" aria-expanded="false" className="ui compact selection dropdown" tabIndex="0">
          <div className="text" role="alert" aria-live="polite">
            <Calendar dateSelection={this.props.dateSelection}/>
          </div>
          <br/>
        </div>
        <button type="submit" className="ui button" role="button" onClick={()=> this.props.onLocationSearch(this.state.location, 'newsfeed')}>Enter</button>
      </div>
    );
  }
}

export default Search;
