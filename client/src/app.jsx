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
    };
  }


  componentDidMount(){
    $.ajax({
      type: 'GET',
      url: '/testYelp',
      success: (response)=> {
        console.log('Inside React componentDidMount')
      },
      failure: (err)=> {
        console.err(err)
      }
    });
  }
  handleClick(view) {
    this.setState({ view });
  }

  renderView() {
    const { view } = this.state;
    if (view === 'main') {
      return <Main onClick={currentView => this.handleClick(currentView)} />;
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
