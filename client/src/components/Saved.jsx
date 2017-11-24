import React from 'react';
import {Link} from 'react-router-dom';
import Event from './Event';

const Saved = () => {
  const savedEventsList = [1,2,3,4,5].map((event,i)=>{
    return(<div key={i}>
     <Event/>
    </div>)
  });
  return(
  <div className='saved-events'>
    <h1>SAVED EVENTS</h1>
    <div className="go-back-btn"><Link to="/EventsFeed">To Events Feed</Link></div>
    <div>{savedEventsList}</div>
  </div>
)};

export default Saved;
