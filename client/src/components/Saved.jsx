import React from 'react';
import {Link} from 'react-router-dom';

const Saved = () => {
  const savedEventsList = [1,2,3,4,5].map((event,i)=>{
    return(<div key={i} className='event'>
      <h3>{event}</h3>
    </div>)
  });
  return(
  <div className='saved-events'>
    <h1>SAVED EVENTS</h1>
    <div className="go-back-btn"><Link to="/EventsFeed">Go Back</Link></div>
    <div>{savedEventsList}</div>
  </div>
)};

export default Saved;
