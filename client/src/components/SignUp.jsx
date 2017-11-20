import React, {Component} from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
              <input placeholder='username' />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input type="password" placeholder='password'  />
            </Form.Field>
            <Form.Field>
              <Checkbox label='I agree to the Terms and Conditions' />
            </Form.Field>
            <Button type='submit'>Submit</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default SignUp;
