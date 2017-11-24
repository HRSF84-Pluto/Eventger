import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import PasswordField from 'material-ui-password-field'
import TextField from 'material-ui/TextField';

const styles = {
  errorStyle: {
    color: "#CC0000",
  },
  underlineStyle: {
    borderColor: "#CC0000",
  },
  floatingLabelStyle: {
    color: "#CC0000",
  },
  floatingLabelFocusStyle: {
    color: "#CC0000",
  },
};

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




         <PasswordField
           id="passfield"
           floatingLabelText="Styled Floating Label Text"
           floatingLabelStyle={styles.floatingLabelStyle}
           floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
           underlineStyle={styles.underlineStyle}
           type="password"
         />

         <TextField
           id="textfield"
           floatingLabelText="Styled Floating Label Text"
           floatingLabelStyle={styles.floatingLabelStyle}
           floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
           underlineStyle={styles.underlineStyle}
         />


     </div>
   </div>
 )
 }

};

export default Settings;
