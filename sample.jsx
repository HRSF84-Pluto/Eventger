import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import axios from 'axios';
import PastSearches from './components/PastSearches.jsx';
import NewSearch from './components/NewSearch.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      name: '',
      direction: '',
      busLine: '',
      busStop: '',
      busStopId: null,

      buses: [],
      stops:[],
      stopsIdArr: [],
      
      predictions: [],
      pastSearches: [],

    }
    // this.storeQuery = this.storeQuery.bind(this);
    this.onNameInput = this.onNameInput.bind(this);
    this.onDirectionSelection = this.onDirectionSelection.bind(this);
    this.onBusSelection = this.onBusSelection.bind(this);
    this.onStopSelection = this.onStopSelection.bind(this);
    this.onETAClick = this.onETAClick.bind(this);
    this.onGetRecords = this.onGetRecords.bind(this);
  }

  componentWillMount() {
    this.getBuses();
  }
  
  // ****************** EVENT HANDLERS *********************//

  onNameInput (name) {
    this.setState({name: name.target.value})
  }

  onDirectionSelection (direction) {
    this.setState({direction: direction.target.value})
  }

  onBusSelection (bus) {
    this.setState({busLine: bus.target.value})
    this.getStops(bus.target.value);

    // FIGURE OUT WHY YOU CAN'T USE THIS.STATE.BUSLINE AS ARGUMENT //
    // this.getStops(busSelection.target.value);
  }

  onStopSelection (stop) {
    this.setState({busStop: stop.target.value})

    const stopIndex = this.state.stops.indexOf(stop.target.value)
    this.setState({busStopId: this.state.stopsIdArr[stopIndex]});
  }

  onETAClick () {
    this.getPredictions();
  }

  onGetRecords () {
    this.getRecords();
  }

  // ******************** SERVER REQs ***********************//

  getBuses () {
    axios.get('/buses')
    .then((response) => {
      console.log('successful get request /buses')
      var sortedBuses = response.data.sort()
      this.setState({buses: sortedBuses})

    })
    .catch((error) => {
      console.error('unsuccessful getBuses req: ', error);
    });
  } 
  
  getStops (bus) {
    axios.post('/stops', {
      direction: this.state.direction,
      busSelection: bus
    })
    .then((response) => {
      console.log('successful post request /stops');
      this.setState({stops: response.data[0]})
      this.setState({stopsIdArr: response.data[1]})
    })
    .catch((error) => {
      console.error('unsuccessful getStops req: ', error);
    });
  }

  getPredictions () {
    axios.post('/predictions', {
      name: this.state.name,
      busLine: this.state.busLine,
      busStopId: this.state.busStopId,
      busStop: this.state.busStop,
      direction: this.state.direction,
    })
    .then((response) => {
      console.log('successful post request /predictions');

      this.setState({predictions: response.data.slice(0,3)})
    })
    .catch((error) => {
      console.error('unsuccessful getPredictions req: ', error);
    });  
  }


  getRecords () {
    console.log('inside getRecords req');
  
    axios.get('/records',{
      params: {
        name: this.state.name,
      }
    })
    .then((response) => {
      console.log('successful get request /records')
      console.log('Returned from getRecords: ', response.data.busline);
      this.setState({pastSearches: response.data})
    })
    .catch((error) => {
      console.error('unsuccessful get request /records', error);
    });
  }  
  
  // ********************* RENDER *********************//

  render () {
    return (
    <div><h1>SF MUNI:</h1><h2 className="heading"> Next Bus Arrival Times</h2>
      <NewSearch 
        storeQuery={this.storeQuery}
        onNameInput={this.onNameInput}         
        onBusSelection={this.onBusSelection}         
        onDirectionSelection={this.onDirectionSelection}
        onETAClick={this.onETAClick}
        onStopSelection={this.onStopSelection}
        buses={this.state.buses}         
        stops={this.state.stops}         
        predictions={this.state.predictions}         
      />
      <PastSearches 
        onGetRecords={this.onGetRecords}
        onNameInput={this.onNameInput}         
        pastSearches={this.state.pastSearches}         
      />
    </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));


  // storeQuery () {
  //   axios.post('/records', {
  //     name: this.state.name,
  //     direction: this.state.direction,
  //     busLine: this.state.busLine,
  //     busStop: this.state.busStop,
  //   })
  //   .then((response) => {
  //     console.log('successful post request /predictions')
  //     this.getPredictions()

  //   })
  //   .catch((error) => {
  //     console.log('unsuccessful storeQuery req: ', error);
  //   });
  // }


