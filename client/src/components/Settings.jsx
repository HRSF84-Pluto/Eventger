import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';


class Settings extends Component{
 constructor(props){
   super(props);
   this.state = {};
 }
 render() {
   return (
     <div className='settings-page'>
       <h1>Settings</h1>
       <div className="go-back-btn">
         <Link to="/EventsFeed">Go Back</Link>
       </div>
       <div className="event">
         <h1>Update your info</h1>
       </div>
     </div>
   )
 }

};

export default Settings;
