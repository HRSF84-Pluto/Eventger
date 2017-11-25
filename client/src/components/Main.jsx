import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Choices from './Choices';
import Search from './Search';
import UserSettingsPopup from './UserSettingsPopup';


class Main extends Component {


  handleLogout() {
    this.props.handleLogout();
  }

 componentDidUpdate(){
   console.log("did component update?");
   console.log("username inside componentDidUpdate");
   console.log("Username == " + this.props.username);
 }

  render() {
    return (
      <div className='main'>
        <div className='loginButtons'>
          <div>
            {this.props.username !== 'Login' ?
              <UserSettingsPopup handleLogOut={this.handleLogout.bind(this)} username={this.props.username}/> :
              <Link style={{color: 'white'}} to='/Login'>
                <div
                  className='login-btn'>{this.props.username}</div>
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
