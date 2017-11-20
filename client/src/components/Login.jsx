import React, {Component} from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="loginPage">
        <div>
          <h3>Login Page</h3>
        </div>
        <div onClick={()=> this.props.onClick('main')} className="close">
        </div>
        <div className="logInForm">
          <Form>
            <Form.Field>
              <label>Username</label>
              <input placeholder='username' />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input type="password" placeholder='password' />
            </Form.Field>
            <Button type='submit'>Submit</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Login;
