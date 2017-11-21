import React,{Component} from 'react';


class FilterOptions extends Component {
  constructor(props){
    super(props);
    this.state = { budget: false,
      outdoor: false,
      indoor: false,
      wifi: false,
    };
  }
  componentDidUpdate() {
      console.log("this state", this.state);
      //makes patch request to server after every input: live event filtering!
  }

  render() {
    return (
    <div>
      <label className="container"><p>Budget</p>
        <input type="checkbox" onClick={()=> this.setState({budget: !this.state.budget})} />
        <span className="checkmark"></span>
      </label>
      <label className="container"><p>Outdoor</p>
        <input type="checkbox" onClick={()=> this.setState({outdoor: !this.state.outdoor})} />
        <span className="checkmark"></span>
      </label>
      <label className="container"><p>Indoor</p>
        <input type="checkbox" onClick={()=> this.setState({indoor: !this.state.indoor})} />
        <span className="checkmark"></span>
      </label>
      <label className="container"><p>Wifi Access</p>
        <input type="checkbox" onClick={()=> this.setState({wifi: !this.state.wifi})} />
        <span className="checkmark"></span>
      </label>
    </div>
    )
  }
}


export default FilterOptions;
