import React, {Component} from 'react';
import Choices from './Choices';
import Search from './Search';


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.currentUsername || 'Login',
    };
  }
  render() {
    return (
      <div>
        <div className="loginButtons">
          <div>
            <div className="login-btn" onClick={() => this.props.handleViewChange('login')}>{this.state.username}</div>
          </div>
          <div>
            <div className="signup-btn" onClick={() => this.props.handleViewChange('signup')}>Sign Up</div>
          </div>
        </div>
        <Choices handleActivity={this.props.handleActivity}/>
        <div className="search-bar">
          <Search dateSelection={this.props.dateSelection} onLocationSearch={this.props.handleLocationInput}/>
        </div>
      </div>
    );
  }
}

export default Main;
