import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import $ from 'jquery';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Main from './components/Main';
import EventFeed from './components/EventFeed';
import Saved from './components/Saved';
import Settings from './components/Settings';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      activity: '',
      date: '',
      username: 'Login',
    };
  }


  componentDidMount() {

  }

  handleSearchInput(location) {
    console.log(location, 'location inside app.jsx');
    console.log(this.state.date, 'date in calendar');
    this.setState({location});
  }

  handleActivity(activity) {
    console.log(activity, 'Activity inside handleActivity');
    this.setState({activity});
  }

  handleLogin(username) {
    this.setState({username});
  }

  handleLogout() {
    this.setState({username: 'Login'});
  }

  renderView() {
    return (
      <MuiThemeProvider>
        <Router>
          <div>
            <Route exact path='/EventsFeed'
                   render={() => <EventFeed username={this.state.username}/>}/>
            <Route exact path='/SavedEvents'
                   render={() => <Saved/>}/>
            <Route exact path='/Settings'
                   render={() => <Settings/>}/>
            <Route exact path='/Login'
                   render={() => <Login handleLogin={username => this.handleLogin(username)}/>}/>
            <Route exact path='/SignUp'
                   render={() => <SignUp/>}/>
            <Route exact path='/' render={() =>
              <Main currentUsername={this.state.username}
                    handleLogout={this.handleLogout.bind(this)}
                    dateSelection={date => this.setState({date: date._d.toString()})}
                    handleActivity={chosenActivity => this.handleActivity(chosenActivity)}
                    handleSearch={inputLocation => this.handleSearchInput(inputLocation)}/>
            }/>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }

  render() {
    return (
      <div>
        {this.renderView()}
      </div>
    );
  }
}


ReactDOM.render(<App/>, document.getElementById('app'));
