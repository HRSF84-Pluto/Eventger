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
    var data = {username: 'begona', password:'', location: 'nowhere'}
    $.ajax({
      type: 'POST',
      url: '/signup',
      data: '',
      success: (response)=> {
        console.log('returned from POST Request: ', response)
      },
      failure: (err)=> {
        console.err(err)
      }
    });
  }
  handleClick(view) {
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
      return <Main onClickbtn={chosenActivity => this.handleActivity(chosenActivity)} onSubmit={inputLocation => this.handleLocationInput(inputLocation)} onClick={currentView => this.handleClick(currentView)} />;
    } else if (view === 'login') {
      return <Login onClick={currentView => this.handleClick(currentView)} />;
    } else if (view === 'signup') {
      return <SignUp onClick={currentView => this.handleClick(currentView)} />;
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
