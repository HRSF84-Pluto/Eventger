import React, {Component} from 'react';
import {Form} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';
import $ from 'jquery';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
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
    const {username, password} = this.state;
    const data = {username, password};
    console.log(data, 'data object to be sent to db');
    //this function returns true if login is successful, and returns false if it's not. This returned Boolean will allow
    //the conditional rendering of the views (done inside the  submit <Button/> below)
    return new Promise((resolve,reject) => {
      $.ajax({
        type: 'POST',
        url: '/login',
        data: data,
        success: response => {
          console.log('success');
          console.log(response);
          this.props.handleLogin(response);
          resolve(response)
        },
        error: (err)=> {
          console.log('failure');
          console.log(err);
          reject(err)
        }
      });

    })

  }

  render() {
    const Button = withRouter(({history}) => (
      <button
        type='button'
        className='ui secondary button'
        onClick={() =>{
          this.handleLoginInput()
            .then(() => history.push('/'))
            .catch((err) => {
              console.log("promise error hit");
              if (err.status === 401) {
                this.setState({error: 'incorrect password, please try again'})
              } else {
                history.push('/SignUp')
              }
            })
        }}>
        Submit
      </button>
    ));
    return (
      <div className='loginPage'>
        <div className='login-div'>
          <h3>Login Page</h3>
        </div>
        <Link className='close' to='/'/>
        <div className='logInForm'>
          <Form>
            <Form.Field>
              <label>Username</label>
              <input placeholder='username' onChange={e => this.handleUsernameInput(e)}/>
            </Form.Field>
            <Form.Field>
              <h4 className="error">{this.state.error}</h4>
              <label>Password</label>
              <input type='password' placeholder='password' onChange={e => this.handlePasswordInput(e)}/>
            </Form.Field>
            <Button/>
          </Form>
        </div>
      </div>
    );
  };
}

export default Login;
