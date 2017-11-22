import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import FilterOptions from './FilterOptions';




class Preferences extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    return (
       <div className='preferences'>
         <div className='profile-options'>
           <Link className="settings-btn" to="/Settings">Settings</Link>
           <Link className="saved-btn" to="/SavedEvents">Saved</Link>
         </div>
         <h1>Preferences</h1>
         <FilterOptions/>
       </div>
    );
  }
}

export default Preferences;
