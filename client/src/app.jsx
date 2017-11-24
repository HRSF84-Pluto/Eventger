import React from 'react';
import ReactDOM from 'react-dom';
import {Route,HashRouter} from 'react-router-dom';
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


  componentDidMount(){

    // var dataSign = {username: 'begona', password:'', location: 'nowhere'}
    // $.ajax({
    //   type: 'POST',
    //   url: '/signup',
    //   data: dataSign,
    //   success: (response)=> {
    //     console.log('returned from POST Request: ', response)
    //   },
    //   failure: (err)=> {
    //     console.err(err)
    //   }
    // });
  }
  handleViewChange(username) {
    console.log('inside view changeusername', username )
    this.setState({ username });
  }
  handleLocationInput(location, newsFeedView) {
    console.log(location, 'location inside app.jsx');
    this.setState({view: newsFeedView});
    this.setState({ location });
  }
  handleActivity(activity) {
    console.log(activity, 'Activity inside handleActivity');
    this.setState({ activity });
  }

  renderView() {
    return (
      <MuiThemeProvider>
        <HashRouter>
          <div>
            <Route exact path="/EventsFeed"
                   render={() => <EventFeed />}/>
            <Route exact path="/SavedEvents"
                   render={() => <Saved/>}/>
            <Route exact path="/Settings"
                   render={() => <Settings/>}/>
            <Route exact path="/Login"
                   render={() => <Login handleViewChange={(username) => this.handleViewChange(username)} />}/>
            <Route exact  path="/SignUp"
                   render={() => <SignUp handleViewChange={(currentView, username) => this.handleViewChange(currentView, username)} />}/>
            <Route exact path="/" render={() =>
              <Main currentUsername={this.state.username}
                    dateSelection={date => this.setState({ date: date._d.toString()})}
                    handleActivity={chosenActivity => this.handleActivity(chosenActivity)}
                    handleLocationInput={(inputLocation, eventsFeedView) => this.handleLocationInput(inputLocation, eventsFeedView)}
                    handleViewChange={currentView => this.handleViewChange(currentView)} />
            }/>
          </div>
        </HashRouter>
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





ReactDOM.render(<App />, document.getElementById('app'));
