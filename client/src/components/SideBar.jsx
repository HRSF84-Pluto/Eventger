import React from 'react';
import Profile from './Profile';
import Preferences from './Preferences';

const SideBar = (props)=>(
  <div className='wrapperSidebar'>
    <div className='boxSidebar headerSidebar'> <Profile username={props.username}/></div>
    <div className='boxSidebar contentSidebar'> <Preferences/></div>
  </div>
);
export default SideBar;


