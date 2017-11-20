import React, {Component} from 'react';
import Choices from './Choices';
import Search from './Search';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <div className="loginButtons">
      <div>
        <div className="login-btn" onClick={() => this.props.onClick('login')}>Login</div>
      </div>
      <div>
      <div className="signup-btn" onClick={() => this.props.onClick('signup')}>Sign Up</div>
      </div>
        </div>
      <Choices />
        <div className="search-bar">
        <Search />
        </div>
      </div>
    );
  }
}

export default Main;
