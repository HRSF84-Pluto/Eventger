import React,{Component} from 'react';
import { Button } from 'semantic-ui-react';

class FilterOptions extends Component {
  //state controls the selection and css styling of selected preferences and dollar signs
  constructor(props){
    super(props);
    this.state = {
      nba: false,
      nfl: false,
      restaurants: false,
      bar: false,
      coffee: false,
      danceClubs: false,
      museums: false,
      hike: false,
      comedyClubs: false,
      pop: false,
      country: false,
      rap: false,
      budget: '',
      classNameOneDollar: '',
      classNameTwoDollars: '',
      classNameThreeDollars: '',
      classNameFourDollars: ''
    };
  }

  handleSubmit(){
    const {
      nba,
      nfl,
      restaurants,
      bar,
      coffee,
      danceClubs,
      museums,
      hike,
      comedyClubs,
      pop,
      country,
      rap
    } = this.state;


    const preferences = {
      nba,
      nfl,
      restaurants,
      bar,
      coffee,
      danceClubs,
      museums,
      hike,
      comedyClubs,
      pop,
      country,
      rap
    };

    //sends activity preferences and budget to parent
    this.props.handleFilterOptions(preferences, this.state.budget);
  }
  handleClick(dollars){
    console.log(dollars, 'dollar signs selected');
    if (this.state.budget === dollars){
      this.setState({budget:'$$'});
    }else{
      this.setState({budget: dollars});
    }

    if (dollars === '$'){
      if (this.state.classNameOneDollar === ''){
        this.setState({classNameOneDollar: 'dollar-select'});
        this.setState({classNameTwoDollars: ''});
        this.setState({classNameThreeDollars: ''});
        this.setState({classNameFourDollars: ''});
      } else {
        this.setState({classNameOneDollar: ''});
      }

    }else if (dollars === '$$'){
      if (this.state.classNameTwoDollars === ''){
        this.setState({classNameTwoDollars: 'dollar-select'});
        this.setState({classNameOneDollar: ''});
        this.setState({classNameThreeDollars: ''});
        this.setState({classNameFourDollars: ''});
      }else{
        this.setState({classNameTwoDollars: ''});
      }

    }else if (dollars === '$$$'){
      if (this.state.classNameThreeDollars === ''){
        this.setState({classNameThreeDollars: 'dollar-select'});
        this.setState({classNameOneDollar: ''});
        this.setState({classNameTwoDollars: ''});
        this.setState({classNameFourDollars: ''});
      }else{
        this.setState({classNameThreeDollars: ''});
      }
    }else if (dollars === '$$$$'){
      if (this.state.classNameFourDollars === ''){
        this.setState({classNameFourDollars: 'dollar-select'});
        this.setState({classNameThreeDollars: ''});
        this.setState({classNameOneDollar: ''});
        this.setState({classNameTwoDollars: ''});
      }else{
        this.setState({classNameFourDollars: ''});
      }

    }

  }

  render() {
    return (
    <div className='options-div'>
        <div className='budget'>
          <p style={{marginLeft: '85px', marginTop: '40px'}}>Budget</p>
        <div className='ui small basic buttons'>
          <button className='ui icon button' role='button' onClick={()=> this.handleClick('$')} >
            <i aria-hidden='true' className={'dollar icon' + ' ' + this.state.classNameOneDollar}/>
          </button>
          <button className='ui icon button' role="button" onClick={()=> this.handleClick('$$')}>
            <i aria-hidden='true' className={'dollar icon' + ' ' + this.state.classNameTwoDollars}/>
            <i aria-hidden='true' className={'dollar icon' + ' ' + this.state.classNameTwoDollars}/>
          </button>
          <button className='ui icon button' role='button' onClick={()=> this.handleClick('$$$')}>
            <i aria-hidden='true' className={'dollar icon' + ' ' + this.state.classNameThreeDollars}/>
            <i aria-hidden='true' className={'dollar icon' + ' ' + this.state.classNameThreeDollars}/>
            <i aria-hidden='true' className={'dollar icon' + ' ' + this.state.classNameThreeDollars}/>
          </button>
          <button className='ui icon button' role='button' onClick={()=> this.handleClick('$$$$')}>
            <i aria-hidden='true' className={'dollar icon' + ' ' + this.state.classNameFourDollars}/>
            <i aria-hidden='true' className={'dollar icon' + ' ' + this.state.classNameFourDollars}/>
            <i aria-hidden='true' className={'dollar icon' + ' ' + this.state.classNameFourDollars}/>
            <i aria-hidden='true' className={'dollar icon' + ' ' + this.state.classNameFourDollars}/>
          </button>
        </div>
        </div>
      <div className='radio-btn-section'>
      <label className='container'><p>Restaurants</p>
        <input type='checkbox' onClick={()=> this.setState({restaurants: !this.state.restaurants})} />
        <span className='checkmark'/>
      </label>
      <label className='container'><p>Bar</p>
        <input type='checkbox' onClick={()=> this.setState({bar: !this.state.bar})} />
        <span className='checkmark'/>
      </label>
      <label className='container'><p>Coffee</p>
        <input type='checkbox' onClick={()=> this.setState({coffee: !this.state.coffee})} />
        <span className='checkmark'/>
      </label>
      <label className='container'><p>Dance clubs</p>
        <input type='checkbox' onClick={()=> this.setState({danceClubs: !this.state.danceClubs})} />
        <span className='checkmark'/>
      </label>
        <label className='container'><p>Museums</p>
          <input type='checkbox' onClick={()=> this.setState({museums: !this.state.museums})} />
          <span className='checkmark'/>
        </label>
        <label className='container'><p>Hike</p>
          <input type='checkbox' onClick={()=> this.setState({hike: !this.state.hike})} />
          <span className='checkmark'/>
        </label>
        <label className='container'><p>Comedy clubs</p>
          <input type='checkbox' onClick={()=> this.setState({comedyClubs: !this.state.comedyClubs})} />
          <span className='checkmark'/>
        </label>
      </div>

      <div className='radio-btn-section'>
        <label className='container'><p>Pop</p>
          <input type='checkbox' onClick={()=> this.setState({pop: !this.state.pop})} />
          <span className='checkmark'/>
        </label>
        <label className='container'><p>Country</p>
          <input type='checkbox' onClick={()=> this.setState({country: !this.state.country})} />
          <span className='checkmark'/>
        </label>
        <label className='container'><p>Rap/Hip-Hop</p>
          <input type='checkbox' onClick={()=> this.setState({rap: !this.state.rapHipHop})} />
          <span className='checkmark'/>
        </label>
      </div>

      <div className='radio-btn-section'>
        <label className='container'><p>NFL</p>
          <input type='checkbox' onClick={()=> this.setState({nfl: !this.state.nfl})} />
          <span className='checkmark'/>
        </label>
        <label className='container'><p>NBA</p>
          <input type='checkbox' onClick={()=> this.setState({nba: !this.state.nba})} />
          <span className='checkmark'/>
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
