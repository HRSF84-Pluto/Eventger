import React from 'react';

const Choices = props => (
  <div className="allBoxes">
    <div className="selectionBox">
      <button className="dateNight-btn">
        <h1>Date Night</h1>
      </button>
    </div>
    <div className="selectionBox">
      <button className="groupEvents-btn">
        <h1>Group Events</h1>
      </button>
    </div>
    <div className="selectionBox">
      <button className="family-btn">
        <h1>Family</h1>
      </button>
    </div>
  </div>
);


export default Choices;
