import React from 'react';
import {Link} from 'react-router-dom';
import FilterOptions from './FilterOptions';

const Preferences =(props)=> (
       <div>
         <div>
           <Link className='settings-btn' to='/Settings'>Settings</Link>
           <Link className='saved-btn' to='/SavedEvents'>Saved</Link>
         </div>
         <FilterOptions  handleFilterOptions={props.handleFilterOptions}/>
       </div>
    );


export default Preferences;
