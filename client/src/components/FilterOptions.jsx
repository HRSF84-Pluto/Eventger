import React,{Component} from 'react';
import { Button } from 'semantic-ui-react';

class FilterOptions extends Component {
  constructor(props){
    super(props);
    this.state = { dancing: false,
      outdoor: false,
      indoor: false,
      wifi: false,
      budget: '',
      classNameOneDollar: "",
      classNameTwoDollars: "",
      classNameThreeDollars: "",
      classNameFourDollars: ""
    };
  }

  handleSubmit(){
    const {dancing, outdoor, indoor, wifi, budget} = this.state;
    const dataObj = {dancing, outdoor, indoor, wifi, budget};
    console.log(dataObj, "object with activity preferences");
    //submit to state object to db;
  }
  handleClick(dollars){
    console.log(dollars, "dollar signs in your eyes");
    this.setState({budget: dollars});
    if (dollars === '$'){
    this.state.classNameOneDollar === "" ?
      this.setState({classNameOneDollar: "dollar-select"}) :
        this.setState({classNameOneDollar: ""})

    }else if (dollars === '$$'){
      this.state.classNameTwoDollars === "" ?
        this.setState({classNameTwoDollars: "dollar-select"}) :
        this.setState({classNameTwoDollars: ""})

    }else if (dollars === '$$$'){
      this.state.classNameThreeDollars === "" ?
        this.setState({classNameThreeDollars: "dollar-select"}) :
        this.setState({classNameThreeDollars: ""})

    }else if (dollars === '$$$$'){
      this.state.classNameFourDollars === "" ?
        this.setState({classNameFourDollars: "dollar-select"}) :
        this.setState({classNameFourDollars: ""})

    }

  }

  render() {
    return (
    <div className="options-div">
        <div className="budget">
          <p style={{marginLeft: "85px", marginTop: "40px"}}>Budget</p>
        <div className="ui small basic buttons">
          <button className="ui icon button" role="button" onClick={()=> this.handleClick('$')} >
            <i aria-hidden="true" className={"dollar icon" + " " + this.state.classNameOneDollar}/>
          </button>
          <button className="ui icon button" role="button" onClick={()=> this.handleClick('$$')}>
            <i aria-hidden="true" className={"dollar icon" + " " + this.state.classNameTwoDollars}/>
            <i aria-hidden="true" className={"dollar icon" + " " + this.state.classNameTwoDollars}/>
          </button>
          <button className="ui icon button" role="button" onClick={()=> this.handleClick('$$$')}>
            <i aria-hidden="true" className={"dollar icon" + " " + this.state.classNameThreeDollars}/>
            <i aria-hidden="true" className={"dollar icon" + " " + this.state.classNameThreeDollars}/>
            <i aria-hidden="true" className={"dollar icon" + " " + this.state.classNameThreeDollars}/>
          </button>
          <button className="ui icon button" role="button" onClick={()=> this.handleClick('$$$$')}>
            <i aria-hidden="true" className={"dollar icon" + " " + this.state.classNameFourDollars}/>
            <i aria-hidden="true" className={"dollar icon" + " " + this.state.classNameFourDollars}/>
            <i aria-hidden="true" className={"dollar icon" + " " + this.state.classNameFourDollars}/>
            <i aria-hidden="true" className={"dollar icon" + " " + this.state.classNameFourDollars}/>
          </button>
        </div>
        </div>
      <div className="radio-btn-section">
      <label className="container"><p>Dancing</p>
        <input type="checkbox" onClick={()=> this.setState({dancing: !this.state.dancing})} />
        <span className="checkmark"/>
      </label>
      <label className="container"><p>Outdoor</p>
        <input type="checkbox" onClick={()=> this.setState({outdoor: !this.state.outdoor})} />
        <span className="checkmark"/>
      </label>
      <label className="container"><p>Indoor</p>
        <input type="checkbox" onClick={()=> this.setState({indoor: !this.state.indoor})} />
        <span className="checkmark"/>
      </label>
      <label className="container"><p>Wifi Access</p>
        <input type="checkbox" onClick={()=> this.setState({wifi: !this.state.wifi})} />
        <span className="checkmark"/>
      </label>
      <div className='profile-options'>
        <Button onClick={this.handleSubmit.bind(this)}>Enter</Button>
      </div>
      </div>
    </div>
    )
  }
}


export default FilterOptions;
