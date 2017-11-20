import React from 'react';

const Choices = props => (
  <div className="allBoxes">
    <div className="selectionBox">
      <button onClick={() => props.onClick('date night')} className="dateNight-btn">
        <h1>Date Night</h1>
      </button>
    </div>
    <div className="selectionBox">
      <button onClick={() => props.onClick('group events')} className="groupEvents-btn">
        <h1>Group Events</h1>
      </button>
    </div>
    <div className="selectionBox">
      <button onClick={() => props.onClick('family')} className="family-btn">
        <h1>Family</h1>
      </button>
    </div>
  </div>
);


export default Choices;
