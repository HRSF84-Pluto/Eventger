import React, {Component} from 'react';
import Choices from './Choices';
import Search from './Search';
import {Link} from 'react-router-dom';


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.currentUsername || 'Login',
      logOut: '',
    };
  }

  render() {
    return (
      <div className="main">
        <div className="loginButtons">
          <div>
            <Link style={{color: 'white'}} to="/Login"><div className="login-btn">{this.state.username}</div></Link>
            {this.state.logOut}
          </div>
          <div>
            <Link style={{color: 'white'}} to="/SignUp"><div className="signup-btn">Sign Up</div></Link>
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
