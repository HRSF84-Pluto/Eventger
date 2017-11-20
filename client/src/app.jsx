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
    };
  }


  componentDidMount(){
    $.ajax({
      type: 'GET',
      url: '/eventData',
      success: (response)=> {
        console.log('Inside React componentDidMount')
        console.log('returned from GET Request: ', response)
      },
      failure: (err)=> {
        console.err(err)
      }
    });
  }
  handleViewChange(view) {
    this.setState({ view });
  }
  handleLocationInput(location) {
    console.log(location, 'location inside app.jsx');
    this.setState({ location });
  }
  handleActivity(activity){
    console.log(activity, 'Activity inside handleActivity');
    this.setState({ activity });
  }

  renderView() {
    const { view } = this.state;
    if (view === 'main') {
      return <Main handleActivity={chosenActivity => this.handleActivity(chosenActivity)}
        handleLocationInput={inputLocation => this.handleLocationInput(inputLocation)}
        handleViewChange={currentView => this.handleViewChange(currentView)} />;
    } else if (view === 'login') {
      return <Login handleViewChange={currentView => this.handleViewChange(currentView)} />;
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
