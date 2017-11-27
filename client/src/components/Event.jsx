import React, {Component} from 'react';
import { Item, Label } from 'semantic-ui-react';

class Event extends Component{
  constructor(props) {
    super(props);
    this.state={
      className: 'large bookmark icon',
      savedView: this.props.savedView
    }
  }
  handleSavedBtnClick(id){
    //console.log('saved item id', id);
    //unsave the event
    if (this.state.className === 'large bookmark icon saved-bookmark' ){
      this.setState({className: 'large bookmark icon'});
      this.props.handleUnsavedEvent(id);
    }else{
      //save the event
      this.setState({className: 'large bookmark icon saved-bookmark'});
      this.props.handleSavedEvent(id);
    }
  }


  render() {
    return (
      <Item>
        <Item.Image src={this.props.event.photoUrl} />
        <Item.Content>
          <Item.Header style={{fontSize: '0.9em'}} as='a'>{this.props.event.eventName}</Item.Header>
          <Item.Meta>
            <span style={{fontSize: '0.8em'}} className='cinema'>Time: {this.props.event.time? this.props.event.time: 'Anytime'}</span>
            <br/>
            <span style={{fontSize: '0.8em'}} className='cinema'>Price: {this.props.event.price}</span>
            <br/>
            <a style={{fontSize: '0.8em', color: '#00007f'}} className='cinema' href={this.props.event.url} target='_blank'>Event Link</a>
            <br/>
            <span style={{fontSize: '0.8em'}} className='cinema'>{this.props.event.date ?'Date: '+ this.props.event.date: '' }</span>
          </Item.Meta>
          <Item.Description style={{fontSize: '0.7em'}}>Address:
            <br/>
            {this.props.event.location.line_1}
          {'  ' + this.props.event.location.line_2}
            <br/>
          {this.props.event.location.city}
            {' '+ this.props.event.location.state}
            <br/>
            {this.props.event.location.zip ? ' '+ this.props.event.location.zip : ''}
          </Item.Description>
          <Item.Extra>
            <Label>{this.props.event.category}</Label>
            {this.props.savedView ?  <i className="bookmark icon saved-bookmark"/> :
              <i onClick={this.handleSavedBtnClick.bind(this, this.props.event.id)} className={this.state.className}/>}


          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }
}

export default Event;
