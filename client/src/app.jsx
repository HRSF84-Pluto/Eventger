import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Main from './components/Main';




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'main',
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
    this.setState({ view });
    this.setState({ username });
  }
  handleLocationInput(location) {
    console.log(location, 'location inside app.jsx');
    this.setState({ location });
  }
  handleActivity(activity) {
    console.log(activity, 'Activity inside handleActivity');
    this.setState({ activity });
  }
  dateSelection(date) {
    const dateStr = date._d.toString();
    this.setState({ date: dateStr });
  }

  renderView() {
    const { view } = this.state;
    if (view === 'main') {
      return <Main currentUsername={this.state.username}
        dateSelection={date => this.dateSelection(date)}
        handleActivity={chosenActivity => this.handleActivity(chosenActivity)}
        handleLocationInput={inputLocation => this.handleLocationInput(inputLocation)}
        handleViewChange={currentView => this.handleViewChange(currentView)} />;
    } else if (view === 'login') {
      return <Login handleViewChange={(currentView, username) => this.handleViewChange(currentView, username)} />;
    } else if (view === 'signup') {
      return <SignUp handleViewChange={currentView => this.handleViewChange(currentView)} />;
    }
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
