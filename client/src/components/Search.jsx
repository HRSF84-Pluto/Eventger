import React, {Component} from 'react';


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="ui action input">
        <input type="text" placeholder="Search..." />
        <div role="listbox" aria-expanded="false" className="ui compact selection dropdown" tabIndex="0">
          <div className="text" role="alert" aria-live="polite">Date</div>
          <i aria-hidden="true" className="dropdown icon"></i>
          <br/>
        </div>
        <button type="submit" className="ui button" role="button">Search</button>
      </div>
    );
  }
}

export default Search;
