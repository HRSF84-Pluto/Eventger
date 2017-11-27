import React, {Component} from 'react';
import Calendar from './Calendar';
import {Link} from 'react-router-dom';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {location: ''};
  }

  handleLocationInput(e) {
    this.setState({location: e.target.value});
  }

  render() {
    return (
      <div className='ui action input'>
        <input type='text' placeholder='Enter Zipcode' onChange={e => this.handleLocationInput(e)}/>
        <div role='listbox' aria-expanded='false' className='ui compact selection dropdown' tabIndex='0'>
          <div className='text' role='alert' aria-live='polite'>
            <Calendar dateSelection={this.props.dateSelection}/>
          </div>
          <br/>
        </div>
        <Link className='ui button' to='/EventsFeed'>
          <button className='ui button'
                  onClick={() => this.props.onLocationSearch(this.state.location)}>
            Enter
          </button>
        </Link>
      </div>
    );
  }
}

export default Search;
