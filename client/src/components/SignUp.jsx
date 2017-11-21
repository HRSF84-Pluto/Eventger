import React, {Component} from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import $ from 'jquery';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      location: '',
      errorMessage : '',
    };
  }
  handleUsernameInput(e) {
    this.setState({username: e.target.value});
  }
  handleZipInput(e) {
    this.setState({location: e.target.value});
  }
  handlePasswordInput(e) {
    this.setState({password: e.target.value});
  }
  handleSignUpInput() {
    const data = {'username': this.state.username, 'password': this.state.password, 'location': this.state.location};
    //checks for username in db:
    var results = $.ajax({
      type: 'POST',
      url: '/signup',
      data: data,
      success: (response)=> {
        console.log('returned from SIGNUP POST Request: ', response)
        //If succesfully add user, return true so they are redirrected to main
        if (response) {
          return true;
        } else {
          //If User already exisits, show an error message
          this.setState({error: 'Username already exists, please try again'});
        }
      },
      failure: (err)=> {
        // if input is incorrent, show an error message
        this.setState({error: 'There was an error in the Sign-up Process'});
        console.err(err)
      }
    });

    return results;
  }
  render() {
    return (
      <div className="signUpPage">
        <div>
          <h3>Sign Up</h3>
        </div>
        <div className="signUpForm">
          <Form>
            <Form.Field>
              <label>Username</label>
              <input placeholder='username' onChange={e => this.handleUsernameInput(e)} />
            </Form.Field>
            <h4 className='error' >{this.state.error}</h4>
              <Form.Field>
                <label>Zip Code</label>
                <input placeholder='zipcode' onChange={e => this.handleZipInput(e)} />
              </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input type="password" placeholder='password' onChange={e => this.handlePasswordInput(e)}  />
            </Form.Field>
            <Form.Field>
              <Checkbox label='I agree to the Terms and Conditions' />
            </Form.Field>
            <Button type='submit' onClick={()=> this.handleSignUpInput() ? this.props.handleViewChange('main', this.state.username) : this.props.handleViewChange('signup') }>Submit</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default SignUp;
