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


  handleSearchInput(location) {
    console.log(location, 'location inside app.jsx');
    console.log(this.state.date, 'date in calendar');
    this.setState({location});
  }

  handleActivity(activity) {
    console.log(activity, 'Activity inside handleActivity');
    this.setState({activity});
  }
 componentDidMount(){
   this.getCurrentUser();
 }
  handleLogin() {
    console.log("inside handle login");
    //this.setState({username});
    this.getCurrentUser();
  }
  getCurrentUser(){
   console.log("inside getCurrentUser");
    $.ajax({
      url: '/userData',
      method: 'GET',
      contentType: 'application/json',
      success: response => {
        console.log('response inside getCurrentUser', response);
        if (response.username) {
          console.log(response.username);
          this.setState({username: response.username});
          console.log(this.state.username, "state.username");
          //this.forceUpdate();
        }else{
          this.setState({username: 'Login'});
        }
      },
      error: (xhr, status, error) => {
        console.log('err', xhr, status, error);
      }
    })
  }

  handleLogout() {
    this.setState({username: 'Login'});
  }
  componentDidUpdate(){
    console.log("did component update? inside app.jsx");
    console.log("username inside componentDidUpdate app.jsx");
    console.log(this.state.username);
  }


  render() {
    return (
      <div>
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
                     render={() => <Login handleLogin={() => this.handleLogin()}/>}/>
              <Route exact path='/SignUp'
                     render={() => <SignUp/>}/>
              <Route exact path='/' render={() =>
                <Main username={this.state.username}
                      handleLogout={this.handleLogout.bind(this)}
                      dateSelection={date => this.setState({date: date._d.toString()})}
                      handleActivity={chosenActivity => this.handleActivity(chosenActivity)}
                      handleSearch={inputLocation => this.handleSearchInput(inputLocation)}/>
              }/>
            </div>
          </Router>
        </MuiThemeProvider>
      </div>
    );
  }
}


ReactDOM.render(<App/>, document.getElementById('app'));
