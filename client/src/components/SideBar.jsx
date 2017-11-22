import React from 'react';
import Profile from './Profile';
import Preferences from './Preferences';

const SideBar = (props)=>(
  <div className="sidebar">
    <div className="name">
      <h1>Your Name</h1>
    </div>
    <Profile/>
    <Preferences/>
  </div>
);
export default SideBar;
