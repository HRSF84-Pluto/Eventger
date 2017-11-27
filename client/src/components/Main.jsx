import React from 'react';
import {Link} from 'react-router-dom';
import Choices from './Choices';
import Search from './Search';
import UserSettingsPopup from './UserSettingsPopup';


const Main  = (props) => {
  const handleLogout =()=> {
    props.handleLogout();
  };

  return (
    <div className='main'>
      <div className='loginButtons'>
        <div>
          {props.username !== 'Login' ?
            <UserSettingsPopup handleLogOut={handleLogout.bind(this)} username={props.username}/> :
            <Link style={{color: 'white'}} to='/Login'>
              <div
                className='login-btn'>{props.username}</div>
            </Link>}
        </div>
        <div>
          <Link style={{color: 'white'}} to='/SignUp'>
            <div className='signup-btn'>Sign Up</div>
          </Link>
        </div>
      </div>
      <Choices handleActivity={props.handleActivity}/>
      <div className='search-bar'>
        <Search dateSelection={props.dateSelection} onLocationSearch={props.handleSearch}/>
      </div>
    </div>
  );
};

export default Main;
