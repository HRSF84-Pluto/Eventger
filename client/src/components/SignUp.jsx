import React, {Component} from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {username: '',
                 password: '',

    };
  }
  handleUsernameInput(e){
    this.setState({username: e.target.value});
  }
  handlePasswordInput(e){
    this.setState({password: e.target.value});
  }
  handleSignUpInput(){
    //checks for username in db:
     // if username exists, redirect to login,
     // if input is incorrent, show error message
    const data = {"username": this.state.username, "password": this.state.password};
    console.log(data, 'data object to be sent to db');
    //this function returns true if sign up is successful, and returns false if it's not. This returned Boolean will allow
    //the conditional rendering of the views (done inside the  submit <Button/> below)
    return true;
  }
  render() {
    return (
      <div className="signUpPage">
        <div>
          <h3>Sign Up</h3>
        </div>
        <div onClick={()=> this.props.handleViewChange('main')} className='close'>
        </div>
        <div className="signUpForm">
          <Form>
            <Form.Field>
              <label>Username</label>
              <input placeholder='username' onChange={e => this.handleUsernameInput(e)} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input type="password" placeholder='password' onChange={e => this.handlePasswordInput(e)}  />
            </Form.Field>
            <Form.Field>
              <Checkbox label='I agree to the Terms and Conditions' />
            </Form.Field>
            <Button type='submit' onClick={()=> this.handleSignUpInput() ? this.props.handleViewChange('login') : this.props.handleViewChange('login') }>Submit</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default SignUp;
