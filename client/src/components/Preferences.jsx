import React, {Component} from 'react';
import FilterOptions from './FilterOptions';
import { Button } from 'semantic-ui-react';



class Preferences extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    return (
       <div className='preferences'>
         <div className='profile-options'>
           <Button>Settings</Button>
           <Button>Saved</Button>
         </div>
         <h1>Preferences</h1>
         <FilterOptions/>
       </div>
    );
  }
}

export default Preferences;
