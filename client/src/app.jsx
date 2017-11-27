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
      username: 'Login'
    };
  }

  handleLocation(location){
    this.setState({location});
  }


  handleActivity(activity) {
    console.log(activity, 'Activity inside handleActivity');
    this.setState({activity});
  }
 componentDidMount(){
   this.getCurrentUser();
   //TODO: This function will fetch events for the user on login according to previously used search terms
   //get events bound to the current user
   // $.ajax({
   //   url: '/eventData',
   //   method: 'GET',
   //   success: response => {
   //     console.log('response inside eventData fetch', response);
   //   },
   //   error: (xhr, status, error) => {
   //     console.log('err inside eventData fetch', xhr, status, error);
   //   }
   // })
 }
  handleLogin() {
    console.log("inside handle login");
    //this.setState({username});
    this.getCurrentUser();
  }
  getCurrentUser(){
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

        }else{
          this.setState({username: 'Login'});
        }
      },
      error: () => {
        console.log('there\'s no active session, please log in');
      }
    })
  }

  handleLogout() {
    this.setState({username: 'Login'});
    $.ajax({
      url: '/logout',
      method: 'GET',
      contentType: 'application/json',
      success: response => {
        console.log('success inside handleLogout: ');
        console.log(response);
      },
      error: (err)=> {
        console.log('failure inside handleLogout: ');
        console.log(err);
      }
    });
  }
  componentDidUpdate(){
  }


  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Router>
            <div>
              <Route exact path='/EventsFeed'
                     render={() => <EventFeed passDownSearchInput={this.state} username={this.state.username}/>}/>
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
                      dateSelection={date => {
                        date = date._d.toISOString();
                        this.setState({date})
                      }}
                      handleActivity={chosenActivity => this.handleActivity(chosenActivity)}
                      handleSearch={inputLocation => this.handleLocation(inputLocation)}/>
              }/>
            </div>
          </Router>
        </MuiThemeProvider>
      </div>
    );
  }
}


ReactDOM.render(<App/>, document.getElementById('app'));
