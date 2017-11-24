import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PasswordField from 'material-ui-password-field'
import TextField from 'material-ui/TextField';

const styles = {
  errorStyle: {
    color: "#1e4acc",
  },
  underlineStyle: {
    borderColor: "#4dc3cc",
  },
  floatingLabelStyle: {
    color: "#1e4acc",
  },
  floatingLabelFocusStyle: {
    color: "#715ecc",
  },
};

class Settings extends Component{
  constructor(props){
    super(props);
    this.state = {
      oldPass: '',
      newPass: '',
      city: ''
    };
  }
  handleCurrentPass(e){
    console.log(e.target.value, "currentPass");
    this.setState({oldPass: e.target.value});
  }
  handleNewPass(e){
    console.log(e.target.value, "newPass");
    this.setState({newPass: e.target.value});
  }
  handleNewCity(e){
    console.log(e.target.value, "new city");
    this.setState({city: e.target.value});
  }
  handleUpdatedData(){
  //sends POST request to server
    console.log("inside handleUpdateData");
  }
  render() {
    return (
      <div className='settings-page'>
        <h1> </h1>
        <div className='go-back-btn'>
          <Link to='/EventsFeed'>To Events Feed</Link>
        </div>
        <div className='settings-div'>
          <h3>Update your info</h3>
          <div className='settings-input'>
            <div>
              <div>
                <PasswordField
                  id='passfieldCurrent'
                  floatingLabelText='Current Password'
                  floatingLabelStyle={styles.floatingLabelStyle}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  type='password'
                  onChange={this.handleCurrentPass.bind(this)}
                />
              </div>
              <div>
                <PasswordField
                  id='passfieldNew'
                  floatingLabelText='Update Password'
                  floatingLabelStyle={styles.floatingLabelStyle}
                  floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  underlineStyle={styles.underlineStyle}
                  type='password'
                  onChange={this.handleNewPass.bind(this)}
                />
              </div>
            </div>
            <div>
              <TextField
                id='textfieldCity'
                floatingLabelText='Update City'
                floatingLabelStyle={styles.floatingLabelStyle}
                floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                underlineStyle={styles.underlineStyle}
                onChange={this.handleNewCity.bind(this)}
              />
              <br/>
              <button className='ui secondary button' onClick={this.handleUpdatedData.bind(this)}>Update</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Settings;
