import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import $ from 'jquery';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Main from './components/Main';
import EventFeed from './components/EventFeed';
import Saved from './components/Saved';
import Settings from './components/Settings';



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: '',
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
  handleViewChange(view, username) {
    console.log('inside view changeusername', username )
        console.log('inside view', view )
    this.setState({ view });
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
    const { view } = this.state;
    return (
      <Router>
      <div>
        <Route path="/EventsFeed"
        render={props => <EventFeed handleViewChange={currentView => this.handleViewChange(currentView)} />}/>
        <Route path="/SavedEvents"
               render={props => <Saved/>}/>
        <Route path="/Settings"
               render={props => <Settings/>}/>
      <Route exact path="/" render={() => {
         if (view === 'login') {
          return (<Login handleViewChange={(currentView, username) => this.handleViewChange(currentView, username)} />);

        } else if (view === 'signup') {
          return (<SignUp handleViewChange={(currentView, username) => this.handleViewChange(currentView, username)} />);
        }
        else{
           return(<Main currentUsername={this.state.username}
                        dateSelection={date => this.setState({ date: date._d.toString()})}
                        handleActivity={chosenActivity => this.handleActivity(chosenActivity)}
                        handleLocationInput={(inputLocation, eventsFeedView) => this.handleLocationInput(inputLocation, eventsFeedView)}
                        handleViewChange={currentView => this.handleViewChange(currentView)} />);
        }
      }}/>
      </div>
    </Router>);
  }


  render() {
    return (
      <div className="main">
        {this.renderView()}
      </div>
    );
  }
}





ReactDOM.render(<App />, document.getElementById('app'));
