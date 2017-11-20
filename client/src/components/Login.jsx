import React, {Component} from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {username: '',
                  password: '',
    };
  }
  handleUsernameInput(e) {
    this.setState({username: e.target.value});
  }
  handlePasswordInput(e) {
    this.setState({password: e.target.value});
  }
  handleLoginInput() {
    // checks for username in db: if username exists, accept login info, else, redirect to signup
    const data = this.state;
    console.log(data, 'data object to be sent to db');
    //this function returns true if login is successful, and returns false if it's not. This returned Boolean will allow
    //the conditional rendering of the views (done inside the  submit <Button/> below)
    return true;
  }
  render() {
    return (
      <div className="loginPage">
        <div>
          <h3>Login Page</h3>
        </div>
        <div onClick={()=> this.props.handleViewChange('main')} className='close'>
        </div>
        <div className='logInForm'>
          <Form>
            <Form.Field>
              <label>Username</label>
              <input placeholder='username' onChange={e => this.handleUsernameInput(e)} />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input type='password' placeholder='password' onChange={e => this.handlePasswordInput(e)} />
            </Form.Field>
            <Button type='submit' onClick={() => this.handleLoginInput() ? this.props.handleViewChange('main', this.state.username) : this.props.handleViewChange('signup') }>Submit</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;
