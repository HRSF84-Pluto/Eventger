import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class App extends React.Component {
  constructor() {
    super();
    this.state = { }
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


  render() {
    return (
      <div>
        <h1>Event-gers</h1>
        <h3>Take back your Saturday night!</h3>
      </div>
    )
  }
}










ReactDOM.render(<App />, document.getElementById('app'));
