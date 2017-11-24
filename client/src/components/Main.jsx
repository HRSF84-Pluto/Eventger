import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Choices from './Choices';
import Search from './Search';
import UserSettingsPopup from './UserSettingsPopup';


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.currentUsername || 'Login'
    };
  }

  handleLogout() {
    this.setState({username: 'Login'});
    this.props.handleLogout();
  }

  render() {
    return (
      <div className='main'>
        <div className='loginButtons'>
          <div>
            {this.state.username !== 'Login' ?
              <UserSettingsPopup handleLogOut={this.handleLogout.bind(this)} username={this.state.username}/> :
              <Link style={{color: 'white'}} to='/Login'>
                <div
                  className='login-btn'>{this.state.username}</div>
              </Link>}
          </div>
          <div>
            <Link style={{color: 'white'}} to='/SignUp'>
              <div className='signup-btn'>Sign Up</div>
            </Link>
          </div>
        </div>
        <Choices handleActivity={this.props.handleActivity}/>
        <div className='search-bar'>
          <Search dateSelection={this.props.dateSelection} onLocationSearch={this.props.handleSearch}/>
        </div>
      </div>
    );
  }
}

export default Main;
