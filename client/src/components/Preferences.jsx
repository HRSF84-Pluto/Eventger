import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import FilterOptions from './FilterOptions';



//TODO: refactor to functional component
class Preferences extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    return (
       <div>
         <div>
           <Link className='settings-btn' to='/Settings'>Settings</Link>
           <Link className='saved-btn' to='/SavedEvents'>Saved</Link>
         </div>
         <FilterOptions  handleFilterOptions={this.props.handleFilterOptions}/>
       </div>
    );
  }
}

export default Preferences;
